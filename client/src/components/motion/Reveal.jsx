import React from 'react';
import { motion } from 'framer-motion';

const Reveal = ({
    children,
    width = "fit-content",
    delay = 0,
    staggerChildren = 0,
    y = 30,
    x = 0,
    scale = 1,
    duration = 0.5,
    once = true,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y, x, scale }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once, margin: "-100px" }}
            transition={{
                duration,
                delay,
                ease: [0.25, 1, 0.5, 1],
                staggerChildren
            }}
            style={{ width }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;
