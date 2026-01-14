import React from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Phone, Mail, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import CustomCursor from './motion/CustomCursor';
import WhatsAppButton from './WhatsAppButton';
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
        <footer ref={ref} className="bg-surface border-t border-white/5 py-24 text-text-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 items-start text-center md:text-left">
                    <div>
                        <Link to="/" className="flex items-center space-x-4 justify-center md:justify-start">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                            <span className="text-2xl font-black tracking-tighter text-text-primary uppercase">
                                FITWITH<span className="text-accent italic">PRAVINN</span>
                            </span>
                        </Link>
                        <p className="mt-8 text-text-secondary text-sm md:text-base leading-relaxed max-w-sm font-medium">
                            Elite fitness educator, transformation coach, and lifestyle influencer based in Mumbai. Dedicated to making self-improvement simple and achievable.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Contact Details</h3>
                        <div className="flex items-start justify-center md:justify-start space-x-4 group">
                            <Mail size={20} className="text-accent mt-1" />
                            <div className="flex flex-col">
                                <span className="text-text-primary font-bold text-[10px] md:text-sm uppercase tracking-widest mb-1 font-sans">Business Email</span>
                                <span className="font-semibold text-sm md:text-base group-hover:text-text-primary transition-colors">fitwithpravinn.com</span>
                            </div>
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

                    <div className="space-y-8">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Social Platforms</h3>
                        <div className="flex justify-center md:justify-start space-x-8">
                            <a href="https://instagram.com/fitwithpravinn" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-all transform hover:scale-125 hover:text-glow">
                                <Instagram size={32} />
                            </a>
                            <a href="https://youtube.com/@fitwithpravinn" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-all transform hover:scale-125 hover:text-glow">
                                <Youtube size={32} />
                            </a>
                        </div>
                        <p className="text-text-secondary text-xs font-bold leading-relaxed">
                            Snapchat: fitwithpravinn <br />
                            Access all resources via Linktree.
                        </p>
                    </div>
                </div>
                <div className="mt-24 pt-12 border-t border-white/5 text-center text-text-secondary text-sm font-bold opacity-60">
                    &copy; {new Date().getFullYear()} FitWithPravinn. Build for Discipline.
                </div>
            </div>
        </footer>
    );
});

const VerticalScrollProgress = ({ footerRef }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [progress, setProgress] = React.useState(0);
    const springProgress = useSpring(progress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    React.useEffect(() => {
        if (!isHome) return;

        const updateProgress = () => {
            if (!footerRef.current) return;

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            const footerTop = footerRef.current.offsetTop;

            // We want the progress to be 0 at the start of the page
            // and 1 exactly when we reach the bottom of the page (which is the bottom of the footer)
            // The maximum scrollable value is totalHeight - viewportHeight
            const maxScroll = totalHeight - viewportHeight;

            if (maxScroll <= 0) {
                setProgress(1);
                return;
            }

            // Define the range: 
            // Start filling after Hero (~15% of page or fixed pixel value)
            // Hard stop at 1.0 at maxScroll
            const startThreshold = totalHeight * 0.15;

            let p = 0;
            if (scrollY > startThreshold) {
                p = (scrollY - startThreshold) / (maxScroll - startThreshold);
            }

            setProgress(Math.min(1, Math.max(0, p)));
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        window.addEventListener('orientationchange', updateProgress);

        // Initial call
        updateProgress();

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
            window.removeEventListener('orientationchange', updateProgress);
        };
    }, [isHome, footerRef]);

    const opacity = useSpring(progress > 0 ? 1 : 0);
    const dotY = useTransform(springProgress, [0, 1], ["0%", "100%"]);

    if (!isHome) return null;

    return (
        <motion.div
            style={{ opacity: progress > 0.01 ? 1 : 0 }}
            className="fixed left-2 md:left-12 top-1/2 -translate-y-1/2 h-[70vh] md:h-[60vh] w-8 md:w-10 flex flex-col items-center justify-between z-[100] pointer-events-none"
        >
            {/* The Track Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 overflow-hidden rounded-full">
                <motion.div
                    className="w-full bg-accent origin-top shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    style={{ scaleY: springProgress, height: '100%' }}
                />
            </div>

            {/* Static Dots */}
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-surface border-2 border-white/20 relative z-10"
                />
            ))}

            {/* Moving Glowing Dot */}
            <motion.div
                className="absolute left-1/2 w-5 h-5 bg-accent rounded-full shadow-[0_0_20px_rgba(34,197,94,0.8)] z-20 flex items-center justify-center"
                style={{ top: dotY, x: "-50%", y: "-50%" }}
            >
                <div className="w-2.5 h-2.5 bg-white rounded-full opacity-50" />
            </motion.div>
        </motion.div>
    );
};

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
            <VerticalScrollProgress footerRef={footerRef} />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer ref={footerRef} />

            {/* WhatsApp & Back to Top Buttons - Hidden on Admin Pages */}
            {!isAdmin && (
                <>
                    <WhatsAppButton />
                    <BackToTop />
                </>
            )}
        </div>
    );
};

export default Layout;

