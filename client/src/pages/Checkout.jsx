
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CreditCard, Lock, ArrowLeft, Shield, Loader2, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import MagneticButton from '../components/motion/MagneticButton';
import { useCart } from '../context/CartContext';
import FeedbackSection from '../components/FeedbackSection';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const prepareCheckout = async () => {
            setLoading(true);
            try {
                if (id === 'cart') {
                    if (cartItems.length === 0) {
                        navigate('/programs');
                        return;
                    }
                    setCheckoutItems(cartItems);
                    setTotal(cartTotal);
                } else {
                    const response = await api.get(`/products/${id}`);
                    setCheckoutItems([response.data]);
                    setTotal(response.data.price);
                }
            } catch (err) {
                setError('Product not found.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        prepareCheckout();
    }, [id, cartItems, cartTotal, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert("Please fill in all contact details.");
            return;
        }

        setStatus('processing');
        try {
            // Updated to Cashfree Integration
            const response = await api.post('/cashfree/create-order', {
                amount: total,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                productId: checkoutItems[0]?._id || id // Use the first item ID
            });

            if (response.data.success) {
                const cashfree = new window.Cashfree({
                    mode: "sandbox" // Change to "production" for live
                });

                cashfree.checkout({
                    paymentSessionId: response.data.payment_session_id,
                    redirectTarget: "_self", // Redirects to the return_url set in backend
                });

                // Clear cart locally as we are redirecting
                clearCart();
            } else {
                alert(response.data.message || "Failed to initialize payment.");
                setStatus('idle');
            }
        } catch (err) {
            console.error('Checkout Error:', err);
            const errorMessage = err.response?.data?.message || "An error occurred during checkout.";
            alert(errorMessage);
            setStatus('idle');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePayment();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)] border border-accent/20">
                    <CheckCircle className="text-accent animate-bounce" size={40} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Payment Successful!</h1>
                <p className="text-text-secondary text-lg max-w-xl mx-auto mb-6 font-medium">
                    Congratulations! Your order has been secured. Check your email and WhatsApp for confirmation. Our team will deliver your digital products/next steps shortly.
                </p>
                <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem] max-w-lg mx-auto mb-8">
                    <p className="text-white font-bold opacity-80 italic">"Discipline is the bridge between goals and accomplishment."</p>
                </div>
                <button
                    onClick={() => navigate('/programs')}
                    className="bg-accent text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-accent-hover transition-all shadow-2xl btn-glow"
                >
                    Back to Programs
                </button>
                <FeedbackSection />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="text-red-500 mb-6 animate-pulse" size={64} />
                <h2 className="text-3xl font-black text-white uppercase mb-4">Payment Verification Failed</h2>
                <p className="text-text-secondary mb-8 max-w-md">The payment was processed but we couldn't verify it with our servers. Please contact support if your money was debited.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="bg-white/10 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-black text-white uppercase mb-4">No Items to Checkout</h2>
                <button onClick={() => navigate('/programs')} className="text-accent underline font-bold uppercase tracking-widest">Back to Programs</button>
            </div>
        );
    }

    return (
        <div className="py-24 bg-bg-page min-h-screen selection:bg-accent/30 selection:text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-3 text-text-secondary hover:text-accent mb-16 transition-all font-black uppercase tracking-[0.2em] text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                    {/* Checkout Form */}
                    <Reveal className="lg:col-span-3">
                        <div className="glass-card p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none" />

                            <h1 className="text-4xl md:text-5xl font-black mb-12 text-text-primary tracking-tighter uppercase">Secure Checkout</h1>
                            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.3em] pl-2 opacity-60">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Alexander Pierce"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:bg-white/10 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all font-bold text-text-primary placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.3em] pl-2 opacity-60">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="alex@example.com"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:bg-white/10 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all font-bold text-text-primary placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.3em] pl-2 opacity-60">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+91 00000 00000"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:bg-white/10 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all font-bold text-text-primary placeholder:text-white/10"
                                    />
                                </div>

                                <div className="pt-8">
                                    <MagneticButton className="w-full">
                                        <button
                                            type="submit"
                                            disabled={status === 'processing'}
                                            className="w-full bg-accent hover:bg-accent-hover text-white py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 btn-glow uppercase tracking-widest overflow-hidden relative group/btn disabled:opacity-50"
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {status === 'processing' ? (
                                                    <Loader2 className="animate-spin" size={24} />
                                                ) : (
                                                    <CreditCard size={24} />
                                                )}
                                                <span className="leading-tight">
                                                    {status === 'processing' ? 'Processing...' : 'Proceed to Payment'}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        </button>
                                    </MagneticButton>
                                </div>

                                <div className="flex flex-col items-center justify-center space-y-6 pt-6">
                                    <div className="flex items-center space-x-3 text-text-secondary text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                                        <Lock size={12} />
                                        <span>Military-Grade Encryption</span>
                                    </div>
                                    <div className="flex space-x-6 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default text-text-primary">
                                        <span className="text-[10px] font-black uppercase tracking-widest">UPI</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Cards</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Net Banking</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Reveal>

                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-10">
                        <Reveal x={20}>
                            <h2 className="text-xl font-black text-text-primary tracking-[0.2em] uppercase pl-2">Order Summary</h2>
                        </Reveal>

                        <Reveal x={20} delay={0.2}>
                            <div className="glass-card border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="space-y-6 mb-10 pb-10 border-b border-white/5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {checkoutItems.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-6">
                                            <div className="w-16 h-16 flex-shrink-0 relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10 grayscale-[0.3]"
                                                />
                                                <div className="absolute inset-0 bg-accent/10 rounded-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-black text-text-primary text-sm leading-tight mb-1 truncate uppercase">{item.title}</h3>
                                                <p className="text-accent text-[10px] font-black uppercase tracking-widest italic">₹{item.price.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between text-text-secondary font-bold uppercase tracking-widest text-xs">
                                        <span>Subtotal</span>
                                        <span className="text-text-primary">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary font-bold uppercase tracking-widest text-xs">
                                        <span>Service Fee</span>
                                        <span className="text-accent">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-text-primary text-3xl font-black pt-8 border-t border-white/5 tracking-tighter italic">
                                        <span>Total</span>
                                        <span className="text-glow">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal x={20} delay={0.4}>
                            <div className="bg-accent/5 border border-accent/10 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-2xl group-hover:blur-3xl transition-all" />
                                <div className="flex items-start space-x-5 relative z-10">
                                    <Shield className="text-accent mt-0.5 flex-shrink-0 animate-pulse" size={24} />
                                    <p className="text-sm text-text-secondary font-medium leading-relaxed">
                                        <span className="text-text-primary font-black uppercase tracking-widest block mb-2 text-xs">Direct Delivery</span>
                                        After confirmation, you will receive your digital products or onboarding details via WhatsApp and Email shortly.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

