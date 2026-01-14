import React from 'react';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from './motion/Reveal';
import MagneticButton from './motion/MagneticButton';
import { generateWhatsAppLink } from '../utils/whatsapp';

const PaymentSuccess = ({ user, program, onBack }) => {
    const whatsappLink = generateWhatsAppLink(user, program);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="flex flex-col items-center justify-start p-2 md:p-8 text-center min-h-[60vh]">
            <Reveal>
                <div className="w-12 h-12 md:w-20 md:h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] border border-accent/20">
                    <CheckCircle className="text-accent" size={40} />
                </div>
            </Reveal>

            <Reveal delay={0.1}>
                <h1 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase italic">
                    🎉 Payment Successful!
                </h1>
            </Reveal>

            <Reveal delay={0.2} className="max-w-xl mx-auto mb-6 md:mb-10">

                <p className="text-text-secondary text-sm md:text-lg font-medium leading-relaxed px-4">
                    Thank you for your enrollment. We've sent a confirmation email to your registered inbox with all the details.
                </p>
                <p className="text-text-secondary text-xs md:text-base font-medium mt-2 opacity-80">
                    Our team will personally reach out to you within 24–48 hours for your official onboarding.
                </p>
            </Reveal>

            <Reveal delay={0.3} className="w-full max-w-sm">
                <div className="glass-card border border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-white/5 relative overflow-hidden group">
                    <p className="text-white/80 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4 md:mb-6 px-2">
                        Click the WhatsApp button below to speed up the process! 🚀
                    </p>

                    <MagneticButton className="w-full">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg shadow-[0_0_30px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 md:gap-3 transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
                        >
                            <MessageCircle size={20} fill="currentColor" />
                            <span>WhatsApp Us</span>
                        </a>
                    </MagneticButton>
                </div>
            </Reveal>

            <Reveal delay={0.4} className="mt-8 md:mt-12">
                <button
                    onClick={onBack}
                    className="text-text-secondary hover:text-accent font-black uppercase tracking-[0.2em] text-[10px] transition-colors flex items-center gap-2 group"
                >
                    Back to Shop <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </Reveal>
        </div>
    );
};

export default PaymentSuccess;
