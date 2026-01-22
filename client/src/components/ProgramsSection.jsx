import React, { useState } from 'react';
import Reveal from './motion/Reveal';
import CourseCard from './CourseCard';
import ComparePlansModal from './ComparePlansModal';
import { ArrowRight } from 'lucide-react';

const ProgramsSection = ({ products, isSoldOut, slotsLeft }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id="programs" className="pt-20 pb-10 md:py-40 bg-bg-page relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
                    <span className="text-accent font-black uppercase tracking-[0.4em] text-sm md:text-base">Elite Programs</span>
                    <h2 className="text-3xl md:text-8xl font-black mt-6 mb-8 text-text-primary tracking-tighter uppercase leading-[0.9]">Training <span className="text-accent italic">Programs</span></h2>

                    <div className="flex flex-col items-center gap-8 mt-12">
                        {/* Compare Plans Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group flex items-center gap-4 text-accent hover:text-white transition-all duration-300 font-black uppercase tracking-[0.2em] text-xs md:text-sm"
                        >
                            <span>Compare Plans</span>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    {products.map((course, index) => (
                        <Reveal key={course._id} delay={index * 0.1} scale={0.9} y={40} width="100%">
                            <CourseCard
                                course={course}
                                isSoldOut={isSoldOut}
                                slotsLeft={slotsLeft}
                                hideOriginalPrice={false}
                            />
                        </Reveal>
                    ))}
                </div>
            </div>

            <ComparePlansModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default ProgramsSection;
