import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cartItems, removeFromCart, updateCartItemDuration, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        // Always use cart-based checkout to preserve custom durations/prices from cart
        navigate('/checkout/cart');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-page border-l border-white/10 z-[201] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="text-accent" size={20} />
                                <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white">Your Cart</h2>
                                <span className="bg-accent/10 text-accent text-[10px] md:text-xs font-black px-2 py-0.5 md:py-1 rounded-full border border-accent/20">
                                    {cartItems.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-secondary hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag className="text-white/20" size={32} />
                                    </div>
                                    <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider">Your cart is empty</h3>
                                    <p className="text-text-secondary text-xs md:text-sm max-w-[200px]">
                                        Explore our transformation programs to start your journey.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            navigate('/programs');
                                        }}
                                        className="mt-4 text-accent font-black uppercase tracking-widest text-[10px] md:text-xs hover:underline"
                                    >
                                        Browse Programs
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id || item._id} className="flex space-x-3 md:space-x-4 group p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[12px] md:text-sm font-black text-white uppercase truncate pr-4">{item.title}</h4>
                                                <button
                                                    onClick={() => removeFromCart(item.id || item._id)}
                                                    className="text-text-secondary hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-1 md:mt-2">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-accent font-black text-xs md:text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <p className="text-[8px] md:text-[10px] line-through text-white/20 font-bold decoration-accent/30">₹{item.originalPrice.toLocaleString('en-IN')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/5 rounded text-text-secondary self-start">
                                                    Course
                                                </span>
                                            </div>

                                            <div className="mt-3 md:mt-4 space-y-2">
                                                {item.durations?.length > 1 && (
                                                    <>
                                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">Duration</p>
                                                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                            {item.durations?.map((opt) => (
                                                                <button
                                                                    key={opt.months}
                                                                    onClick={() => updateCartItemDuration(item.id || item._id, opt.months)}
                                                                    className={`relative px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border ${item.durationMonths === opt.months
                                                                        ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                                                        : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    {opt.months}M
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-4 md:p-6 border-t border-white/10 bg-white/[0.02] space-y-3 md:space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-text-secondary font-bold uppercase tracking-widest text-[10px] md:text-xs">Subtotal</span>
                                    <span className="text-xl md:text-2xl font-black text-white italic tracking-tighter">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-accent hover:bg-accent-hover text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center space-x-2 md:space-x-3 group/btn hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span className="text-sm md:text-base">Checkout Now</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-[8px] md:text-[10px] text-center text-text-secondary font-medium italic opacity-60">
                                    Secure checkout powered by Cashfree
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
