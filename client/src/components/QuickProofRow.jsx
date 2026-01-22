import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Clock } from 'lucide-react';
import Reveal from './motion/Reveal';

const stats = [
    {
        icon: <Users className="text-accent" size={24} />,
        value: "100+",
        label: "Transformations"
    },
    {
        icon: <Star className="text-accent fill-accent" size={24} />,
        value: "4.5/5",
        label: "Avg Rating"
    },
    {
        icon: <Clock className="text-accent" size={24} />,
        value: "Weekly",
        label: "Accountability"
    }
];

const QuickProofRow = () => {
    return (
        <section className="py-8 md:py-12 bg-bg-page relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                    {stats.map((stat, index) => (
                        <Reveal
                            key={index}
                            delay={index * 0.1}
                            y={20}
                            width="100%"
                            className={index === 2 ? "col-span-2 md:col-span-1" : "col-span-1"}
                        >
                            <div className="glass p-3 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left justify-center sm:justify-start gap-2 md:gap-6 hover:border-accent/30 transition-all duration-500 group h-full">
                                <div className="p-2 md:p-4 bg-accent/10 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                                    {React.cloneElement(stat.icon, { size: window.innerWidth < 768 ? 18 : 24 })}
                                </div>
                                <div>
                                    <div className="text-base md:text-3xl font-black text-white group-hover:text-accent transition-colors duration-500 flex items-center justify-center sm:justify-start gap-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-[8px] md:text-xs font-black text-text-secondary uppercase tracking-widest md:tracking-[0.2em] mt-0.5">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickProofRow;
