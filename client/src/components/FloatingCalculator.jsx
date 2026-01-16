import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FloatingCalculator = () => {
    const { isCartOpen } = useCart();
    const location = useLocation();

    // Hide on the calculator page itself to avoid redundancy, or keep it? 
    // Usually floating buttons stay, but if it links to the current page it's weird.
    // Let's hide it on /calorie-calculator
    if (location.pathname === '/calorie-calculator') return null;

    return (
        <AnimatePresence>
            {!isCartOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="fixed bottom-6 right-6 z-[9999]"
                >
                    <div className="relative group">
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl translate-y-2 group-hover:translate-y-0">
                            Calculate Calories
                            <div className="absolute top-full right-6 w-2 h-2 bg-white rotate-45 -translate-y-1/2" />
                        </div>

                        {/* Pulsing Glow Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-[#22c55e] rounded-full blur-xl"
                        />

                        {/* The Button */}
                        <Link to="/calorie-calculator">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative flex items-center justify-center w-14 h-14 bg-[#22c55e] text-white rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.4)] border-2 border-white/20 hover:border-white/40 transition-colors z-10"
                            >
                                <Calculator size={28} className="text-white fill-current" />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCalculator;
