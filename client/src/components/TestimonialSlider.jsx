import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/mockData';
import { Star } from 'lucide-react';

const TestimonialSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length),
            6000
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex]);

    return (
        <div className="w-full max-w-5xl mx-auto relative py-10 px-4">
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        <div className="glass-card p-6 md:p-20 rounded-[3rem] border-white/5 flex flex-col justify-center relative shadow-3xl overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="mb-12 flex space-x-1.5 items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-rating-stars text-rating-stars drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                                ))}
                            </div>

                            <p className="text-2xl md:text-4xl text-text-primary mb-16 font-medium leading-[1.4] italic tracking-tight opacity-90 relative z-10">
                                "{testimonials[currentIndex].feedback}"
                            </p>

                            <div className="flex items-center space-x-6 md:space-x-8 mt-auto relative z-10">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-2xl md:text-3xl font-black shadow-inner border border-white/5 flex-shrink-0">
                                    {testimonials[currentIndex].name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-text-primary font-black text-xl md:text-2xl leading-tight tracking-tight uppercase">{testimonials[currentIndex].name}</h4>
                                    <p className="text-accent text-sm uppercase tracking-[0.3em] mt-2 font-black opacity-80">Verified Member</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center mt-16 space-x-4">
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-12 bg-accent shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'w-4 bg-white/10 hover:bg-white/20'
                            }`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialSlider;
