import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import { useCart } from '../context/CartContext';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const { isCartOpen } = useCart();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        const footer = document.getElementById('site-footer');
        if (footer) observer.observe(footer);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            if (footer) observer.unobserve(footer);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && !isCartOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        bottom: isFooterVisible ? 160 : 96 // Shift higher when footer visible to stay above calculator
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="fixed right-6 z-[9998]"
                    style={{ bottom: isFooterVisible ? '10rem' : '6rem' }}
                >
                    <button
                        onClick={scrollToTop}
                        className="p-4 bg-white/5 backdrop-blur-md border border-white/10 text-accent hover:bg-white/10 hover:border-accent/50 hover:text-glow transition-all rounded-2xl shadow-2xl group relative overflow-hidden"
                    >
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />

                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-4 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                            Back to Top
                            <div className="absolute top-full right-4 w-2 h-2 bg-white rotate-45 -translate-y-1/2" />
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
