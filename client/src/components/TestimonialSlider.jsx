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

    const onDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -50 || velocity < -500) {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        } else if (offset > 50 || velocity > 500) {
            setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto relative py-10 px-4">
            <div className="relative min-h-[300px] md:min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        transition={{ duration: 0.3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={onDragEnd}
                        className="w-full touch-pan-y cursor-grab active:cursor-grabbing"
                    >
                        <div className="glass-card p-5 md:p-20 rounded-2xl md:rounded-[3rem] border-white/5 flex flex-col justify-center relative shadow-3xl overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="mb-6 md:mb-12 flex space-x-1 items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-rating-stars text-rating-stars md:w-5 md:h-5 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                                ))}
                            </div>

                            <p className="text-base md:text-4xl text-text-primary mb-8 md:mb-16 font-medium leading-[1.4] italic tracking-tight opacity-90 relative z-10">
                                "{testimonials[currentIndex].feedback}"
                            </p>

                            <div className="flex items-center space-x-4 md:space-x-8 mt-auto relative z-10">
                                <div className="w-12 h-12 md:w-20 md:h-20 bg-accent/10 rounded-xl md:rounded-2xl flex items-center justify-center text-accent text-xl md:text-3xl font-black shadow-inner border border-white/5 flex-shrink-0">
                                    {testimonials[currentIndex].name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-text-primary font-black text-base md:text-2xl leading-tight tracking-tight uppercase">{testimonials[currentIndex].name}</h4>
                                    <p className="text-accent text-[10px] md:text-sm uppercase tracking-[0.2em] mt-1 md:mt-2 font-black opacity-80">Verified Member</p>
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
