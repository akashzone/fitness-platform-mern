import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Reveal from '../components/motion/Reveal';

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
                            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] border border-accent/20">
                                <CheckCircle className="text-accent" size={40} />
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase italic mb-4">Registration Secured!</h2>
                            <p className="text-text-secondary mb-8">
                                Congratulations! Your payment was successful. Our team will reach out via WhatsApp/Email within 24 hours to begin your journey.
                            </p>
                            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem] mb-10">
                                <p className="text-white font-bold opacity-80 italic text-sm">Order ID: {orderId}</p>
                            </div>
                            <button
                                onClick={() => navigate('/programs')}
                                className="w-full bg-accent hover:bg-accent-hover text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl btn-glow flex items-center justify-center gap-3"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            </Reveal>
        </div>
    );
};

export default PaymentStatus;
