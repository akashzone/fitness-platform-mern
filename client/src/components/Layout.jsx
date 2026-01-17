import React from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Phone, Mail, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import CustomCursor from './motion/CustomCursor';

// import WhatsAppButton from './WhatsAppButton';
import FloatingCalculator from './FloatingCalculator';
import BackToTop from './BackToTop';

const Header = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { scrollYProgress } = useScroll();
    const { cartCount, setIsCartOpen } = useCart();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <header className="glass fixed top-0 left-0 right-0 z-50 border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Left space for alignment */}
                    <div className="w-10 md:w-20 lg:block hidden" />

                    <Link to="/" className="text-lg md:text-3xl font-black tracking-tighter text-text-primary uppercase group">
                        FITWITH<span className="text-accent italic group-hover:text-glow transition-all">PRAVINN</span>
                    </Link>

                    {/* Cart Trigger - Hidden on Admin Pages */}
                    {!location.pathname.startsWith('/admin') && (
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-white group"
                        >
                            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-bg-page"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </button>
                    )}
                </div>
            </div>
            {!isHome && (
                <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-accent origin-left"
                    style={{ scaleX }}
                />
            )}
        </header>
    );
};

const Footer = React.forwardRef((props, ref) => {
    const [feedback, setFeedback] = React.useState('');

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        // Open mailto with body
        window.location.href = `mailto:feedback@fitwithpravinn.com?subject=Website Feedback&body=${encodeURIComponent(feedback)}`;
        setFeedback('');
    };

    return (
        <footer id="site-footer" ref={ref} className="bg-surface border-t border-white/5 pt-6 pb-10 md:py-24 text-text-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start text-center md:text-left">
                    <div>
                        <Link to="/" className="flex items-center gap-0 justify-center md:justify-start">
                            <img src="/logo1.png" alt="Logo" className="mt-2 w-16 h-16 object-contain" />
                            <span className="text-2xl font-black tracking-tighter text-text-primary uppercase">
                                FITWITH<span className="text-accent italic">PRAVINN</span>
                            </span>
                        </Link>
                        <p className="mt-6 text-sm md:text-base text-text-secondary leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                            Level up your fitness game with professional training programs, expert diet plans, and premium resources tailored for your success.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Contact Details</h3>

                        {/* Social Icons Row including Email */}
                        <div className="flex items-center justify-center md:justify-start space-x-6">
                            <a
                                href="mailto:fitwithpravinn@gmail.com"
                                className="group flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 md:bg-white/5 text-accent md:text-text-secondary border border-accent/20 md:border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.3)] md:shadow-none md:hover:bg-accent md:hover:text-white transition-all duration-300"
                                aria-label="Email"
                            >
                                <Mail size={18} className="transition-colors" />
                            </a>
                            <a
                                href="https://instagram.com/fitwithpravinn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 md:bg-white/5 text-accent md:text-text-secondary border border-accent/20 md:border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.3)] md:shadow-none md:hover:bg-pink-600 md:hover:text-white transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} className="transition-colors" />
                            </a>
                            <a
                                href="https://youtube.com/@fitwithpravinn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 md:bg-white/5 text-accent md:text-text-secondary border border-accent/20 md:border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.3)] md:shadow-none md:hover:bg-red-600 md:hover:text-white transition-all duration-300"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} className="transition-colors" />
                            </a>
                        </div>

                        {/* Feedback Input Section */}
                        <div className="flex flex-col space-y-3 pt-4 border-t border-white/5">
                            <div className="flex items-center space-x-2 justify-center md:justify-start">
                                <span className="text-text-primary font-bold text-[10px] md:text-sm uppercase tracking-widest">Feedback</span>
                            </div>
                            <form onSubmit={handleFeedbackSubmit} className="max-w-xs mx-auto md:mx-0 flex flex-col gap-3">
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:bg-white/10 focus:border-accent outline-none transition-all resize-none min-h-[80px] custom-scrollbar"
                                />
                                <button
                                    type="submit"
                                    className="self-end h-9 px-6 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-95 btn-glow"
                                    disabled={!feedback.trim()}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-wider leading-none">Send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="mt-12 md:mt-24 pt-8 md:pt-12 border-t border-white/5 text-center text-text-secondary text-sm font-bold opacity-60">
                    &copy; {new Date().getFullYear()} FitWithPravinn. <Link to="/terms-and-conditions" className="hover:text-accent transition-colors underline decoration-white/20 hover:decoration-accent underline-offset-4">Terms & Conditions</Link>
                </div>
            </div>
        </footer>
    );
});


const Layout = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const footerRef = React.useRef(null);

    return (
        <div
            className="min-h-screen flex flex-col bg-bg-page text-text-primary font-sans selection:bg-accent/30 selection:text-white"
        >
            <CustomCursor />
            <Header />
            {!isAdmin && <CartDrawer />}

            <main className="flex-grow pt-20">
                {children}
            </main>
            {!isAdmin && <Footer ref={footerRef} />}

            {/* WhatsApp & Back to Top Buttons - Hidden on Admin Pages */}
            {!isAdmin && (
                <>
                    {/* <WhatsAppButton /> */}
                    <FloatingCalculator />
                    <BackToTop />
                </>
            )}
        </div>
    );
};

export default Layout;

