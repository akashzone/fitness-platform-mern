import React from 'react';
import { motion } from 'framer-motion';
import { Search, Rocket, Trophy } from 'lucide-react';
import Reveal from './motion/Reveal';

const steps = [
    {
        icon: <Search className="text-accent" size={32} />,
        title: "Choose your program",
        description: "Select the plan that aligns best with your fitness goals and budget."
    },
    {
        icon: <Rocket className="text-accent text-glow" size={32} />,
        title: "Get your plan + onboarding",
        description: "Receive your customized diet and workout blueprint with a personal consultation."
    },
    {
        icon: <Trophy className="text-accent" size={32} />,
        title: "Track progress + results",
        description: "Execute, stay accountable, and watch your body transform week by week."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 md:py-40 bg-surface relative overflow-hidden text-left">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/[0.02] blur-[150px] rounded-full pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal className="mb-16 md:mb-32 max-w-4xl">
                    <span className="text-accent font-black uppercase tracking-[0.4em] text-sm md:text-base">The Process</span>
                    <h2 className="text-3xl md:text-8xl font-black mt-6 mb-8 text-text-primary tracking-tighter uppercase leading-[0.9]">How It <span className="text-accent italic">Works</span></h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-24 left-0 right-0 h-px bg-white/5 z-0" />

                    {steps.map((step, index) => (
                        <Reveal key={index} delay={index * 0.2} x={index % 2 === 0 ? -20 : 20} width="100%">
                            <div className="relative z-10 flex flex-col items-start gap-8 group">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-surface border border-white/5 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-xl group-hover:border-accent/30 group-hover:bg-white/[0.03] transition-all duration-500 transform group-hover:-translate-y-2">
                                    <div className="group-hover:scale-110 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-black text-xs border-4 border-surface shadow-lg">
                                        {index + 1}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-accent transition-colors duration-500">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-text-secondary leading-relaxed font-medium opacity-70">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
