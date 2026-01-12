import React from 'react';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from './motion/Reveal';
import MagneticButton from './motion/MagneticButton';
import { generateWhatsAppLink } from '../utils/whatsapp';

const PaymentSuccess = ({ user, program, onBack }) => {
    const whatsappLink = generateWhatsAppLink(user, program);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 md:p-8 text-center">
            <Reveal>
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] border border-accent/20">
                    <CheckCircle className="text-accent animate-bounce" size={40} />
                </div>
            </Reveal>

            <Reveal delay={0.1}>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic">
                    Payment Successful 🎉
                </h1>
            </Reveal>

            <Reveal delay={0.2} className="max-w-xl mx-auto mb-10">
                <div className="bg-accent/5 border border-accent/10 rounded-2xl p-4 mb-6 inline-block">
                    <p className="text-accent font-black uppercase tracking-widest text-sm">
                        Enrolled in: {program?.title} {program?.selectedDuration ? `(${program.selectedDuration} Months)` : ''}
                    </p>
                </div>
                <p className="text-text-secondary text-lg font-medium leading-relaxed">
                    Thank you for enrolling in the program. Your payment has been received successfully.
                </p>
                <p className="text-text-secondary text-lg font-medium mt-4">
                    Our team will review your details and you will be personally contacted by the trainer within 24–48 hours.
                </p>
            </Reveal>

            <Reveal delay={0.3} className="w-full max-w-md">
                <div className="glass-card border border-white/10 p-8 rounded-[2.5rem] bg-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl pointer-events-none" />

                    <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-6 px-4">
                        To speed up the onboarding process, you can message us directly on WhatsApp.
                    </p>

                    <MagneticButton className="w-full">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-5 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
                        >
                            <MessageCircle size={24} fill="currentColor" />
                            <span>Continue on WhatsApp</span>
                        </a>
                    </MagneticButton>

                    <p className="text-[10px] text-text-secondary mt-6 font-bold uppercase tracking-[0.2em] opacity-40">
                        You will be redirected to WhatsApp to send a pre-filled message. No data is shared automatically.
                    </p>
                </div>
            </Reveal>

            <Reveal delay={0.4} className="mt-12">
                <button
                    onClick={onBack}
                    className="text-text-secondary hover:text-accent font-black uppercase tracking-[0.3em] text-xs transition-colors flex items-center gap-2 group"
                >
                    Back to Programs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </Reveal>
        </div>
    );
};

export default PaymentSuccess;
