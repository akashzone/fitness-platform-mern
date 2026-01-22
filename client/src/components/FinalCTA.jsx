import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Reveal from './motion/Reveal';

const FinalCTA = () => {
    const scrollToPrograms = () => {
        const programsSection = document.getElementById('programs');
        if (programsSection) {
            const offset = 80; // Navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = programsSection.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-20 md:py-40 bg-surface relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-accent/[0.02] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="glass p-6 md:p-24 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-all duration-1000" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 blur-[130px] rounded-full group-hover:bg-accent/10 transition-all duration-1000" />

                    <Reveal className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-8xl font-black text-text-primary tracking-tighter uppercase leading-[0.9] mb-8 md:mb-12 italic break-words">
                            Ready to start your <br /> <span className="text-accent not-italic">transformation?</span>
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <button
                                onClick={scrollToPrograms}
                                className="w-full md:w-auto px-6 py-4 md:px-12 md:py-5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black text-xs md:text-lg uppercase tracking-widest md:tracking-[0.2em] transition-all btn-glow shadow-xl group/btn flex items-center justify-center gap-4"
                            >
                                <span>Choose a Program</span>
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </button>

                            <a
                                href="https://wa.me/918369325997"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-auto px-6 py-4 md:px-12 md:py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs md:text-lg uppercase tracking-widest md:tracking-[0.2em] transition-all flex items-center justify-center gap-4"
                            >
                                <MessageSquare size={18} className="text-accent" />
                                <span>Talk to Coach</span>
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
