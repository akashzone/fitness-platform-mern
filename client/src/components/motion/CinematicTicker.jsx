import React from 'react';
import { motion } from 'framer-motion';

const CinematicTicker = ({ text, speed = 25 }) => {
    return (
        <div className="relative w-full overflow-hidden bg-white/5 border-y border-white/10 py-6 mb-12 select-none group">
            {/* Cinematic Blur Mask */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-page to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-page to-transparent z-10" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {/* 12 items ensure screen is always filled even on large displays */}
                {[...Array(12)].map((_, i) => (
                    <span
                        key={i}
                        className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white/20 mx-4 md:mx-8 italic flex items-center gap-4 md:gap-8 shrink-0"
                        style={{
                            // Remove blur on mobile for GPU performance
                            filter: window.innerWidth < 768 ? 'none' : 'blur(0.8px)',
                            transition: 'filter 0.3s ease'
                        }}
                    >
                        {text}
                        <span className="w-6 md:w-12 h-[2px] bg-accent/30 rounded-full" />
                    </span>
                ))}
            </motion.div>

            {/* Decorative Overlay for extra depth - Hidden on mobile if needed for perf */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,136,0.1),transparent_70%)] hidden md:block" />
        </div>
    );
};

export default CinematicTicker;
