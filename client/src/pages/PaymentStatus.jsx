import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import PaymentSuccess from '../components/PaymentSuccess';
import api from '../utils/api';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState('loading'); // loading, success, failed

    const [orderData, setOrderData] = useState(null);
    const [programData, setProgramData] = useState(null);

    useEffect(() => {
        if (!orderId) {
            navigate('/programs');
            return;
        }

        const verifyAndFetch = async () => {
            try {
                // Verify with backend
                const response = await api.get(`/cashfree/verify/${orderId}`);
                if (response.data.success) {
                    const order = response.data.order;
                    setOrderData(order);
                    // Extract first product for the success UI
                    if (order.products && order.products.length > 0) {
                        setProgramData(order.products[0]);
                    }
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus('failed');
            }
        };

        verifyAndFetch();
    }, [orderId, navigate]);

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
            <Reveal>
                <div className="glass-card p-12 rounded-[3rem] border border-white/5 shadow-2xl text-center max-w-lg">
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin text-accent mx-auto mb-6" size={64} />
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Verifying Payment...</h2>
                            <p className="text-text-secondary mt-4 font-medium italic opacity-60">We are confirming your transaction with Cashfree. Please do not close this window.</p>
                        </>
                    ) : status === 'failed' ? (
                        <div className="flex flex-col items-center">
                            <XCircle className="text-red-500 mb-6 animate-pulse" size={64} />
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Verification Failed</h2>
                            <p className="text-text-secondary mt-4 mb-8">We couldn't confirm your payment automatically. Please contact support if your money was debited.</p>
                            <button
                                onClick={() => navigate('/programs')}
                                className="bg-white/10 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                            >
                                Back to Programs
                            </button>
                        </div>
                    ) : (
                        <PaymentSuccess
                            user={orderData}
                            program={programData}
                            onBack={() => navigate('/programs')}
                        />
                    )}
                </div>
            </Reveal>
        </div>
    );
};

export default PaymentStatus;
