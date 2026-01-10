import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cartItems, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        // If there's only one item, navigate to that item's checkout
        if (cartItems.length === 1) {
            navigate(`/checkout/${cartItems[0]._id}`);
        } else {
            // Future: Multi-item checkout page
            navigate('/checkout/cart');
        }
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
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="text-accent" size={24} />
                                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Your Cart</h2>
                                <span className="bg-accent/10 text-accent text-xs font-black px-2 py-1 rounded-full border border-accent/20">
                                    {cartItems.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-secondary hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag className="text-white/20" size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Your cart is empty</h3>
                                    <p className="text-text-secondary text-sm max-w-[200px]">
                                        Explore our programs and ebooks to start your journey.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            navigate('/programs');
                                        }}
                                        className="mt-4 text-accent font-black uppercase tracking-widest text-xs hover:underline"
                                    >
                                        Browse Programs
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item._id} className="flex space-x-4 group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-black text-white uppercase truncate pr-4">{item.title}</h4>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-text-secondary hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-accent font-black text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                            <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md text-text-secondary">
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-text-secondary font-bold uppercase tracking-widest text-xs">Subtotal</span>
                                    <span className="text-2xl font-black text-white italic tracking-tighter">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-accent hover:bg-accent-hover text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center space-x-3 group/btn hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span>Checkout Now</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-[10px] text-center text-text-secondary font-medium italic opacity-60">
                                    Secure checkout powered by Razorpay
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
