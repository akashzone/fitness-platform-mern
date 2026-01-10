import React from 'react';
import { motion } from 'framer-motion';

const CinematicTicker = ({ text, speed = 50 }) => {
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
                {/* Double the content to ensure seamless wrapping */}
                {[...Array(20)].map((_, i) => (
                    <span
                        key={i}
                        className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white/20 mx-8 italic flex items-center gap-8 shrink-0"
                        style={{
                            filter: 'blur(0.8px)', // Subtle cinematic motion blur
                            transition: 'filter 0.3s ease'
                        }}
                    >
                        {text}
                        <span className="w-12 h-[2px] bg-accent/30 rounded-full" />
                    </span>
                ))}
            </motion.div>

            {/* Decorative Overlay for extra depth */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,136,0.1),transparent_70%)]" />
        </div>
    );
};

export default CinematicTicker;
