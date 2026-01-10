import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WhatsAppButton = () => {
    const { isCartOpen } = useCart();
    const phoneNumber = "918369697508";
    const message = "Hi, I found your website and want to connect.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

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
                            Chat on WhatsApp
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
                            className="absolute inset-0 bg-[#25D366] rounded-full blur-xl"
                        />

                        {/* The Button */}
                        <motion.a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] border-2 border-white/20 hover:border-white/40 transition-colors z-10"
                        >
                            <MessageCircle size={32} fill="currentColor" className="text-white" />
                        </motion.a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WhatsAppButton;
