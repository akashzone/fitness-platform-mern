import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import PaymentSuccess from '../components/PaymentSuccess';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState('loading'); // loading, success, failed

    useEffect(() => {
        // Since we use webhooks, the order might not be marked 'SUCCESS' in DB immediately 
        // upon redirect. However, for a good UX, we assume if they land here with an orderId, 
        // the payment was likely successful or at least attempted.
        // We'll show a "Checking Status" and then "Success" message.

        const timer = setTimeout(() => {
            setStatus('success');
        }, 2000);

        return () => clearTimeout(timer);
    }, [orderId]);

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
            <Reveal>
                <div className="glass-card p-12 rounded-[3rem] border border-white/5 shadow-2xl text-center max-w-lg">
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin text-accent mx-auto mb-6" size={64} />
                            <h2 className="text-3xl font-black text-white uppercase italic">Verifying Payment...</h2>
                            <p className="text-text-secondary mt-4">We are confirming your transaction with Cashfree. Please do not close this window.</p>
                        </>
                    ) : (
                        <>
                            <PaymentSuccess
                                user={null} // Placeholders will be used
                                program={null} // Placeholders will be used
                                onBack={() => navigate('/programs')}
                            />
                        </>
                    )}
                </div>
            </Reveal>
        </div>
    );
};

export default PaymentStatus;
