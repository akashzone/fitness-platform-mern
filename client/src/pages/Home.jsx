import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { courses } from '../data/courses';
import api from '../utils/api';
import CourseCard from '../components/CourseCard';
import TestimonialSlider from '../components/TestimonialSlider';
import Reveal from '../components/motion/Reveal';
import MagneticButton from '../components/motion/MagneticButton';

const Home = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

    // Although we use static courses, we still check slotInfo from backend
    // to show 'Sold Out' status if needed (as per requirement 3 & 9)
    // Use static courses as initial state, then update from backend
    const [slotInfo, setSlotInfo] = useState(null);
    const [products, setProducts] = useState(courses);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Only fetch slot info from backend, use static products
                const response = await api.get('/products');
                if (response.data.slotInfo) setSlotInfo(response.data.slotInfo);
            } catch (err) {
                console.error('Data Load Error:', err);
            }
        };
        fetchData();
    }, []);

    const isSoldOut = slotInfo?.isSoldOut;

    // Slider range tracking
    const containerRef = useRef(null);
    const { scrollYProgress: containerScroll } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const springProgress = useSpring(containerScroll, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const dotY = useTransform(springProgress, [0, 1], ["0%", "100%"]);

    return (
        <div className="bg-bg-page selection:bg-accent/40 selection:text-white">
            {/* Hero Section */}
            <section ref={heroRef} className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-bg-page">
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 h-full w-full">
                    {/* Desktop Video */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="hidden lg:block w-full h-full object-cover hero-video-desktop"
                    >
                        <source src="/assets/desktop.MOV" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Mobile Video */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="block lg:hidden w-full h-full object-cover hero-video-mobile"
                    >
                        <source src="/assets/phone.MOV" />
                        Your browser does not support the video tag.
                    </video>

                    <div className="absolute inset-0 bg-primary-brand/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/20 to-transparent" />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <div className="max-w-4xl">
                        <Reveal delay={0.1} width="100%">
                            <div className="w-full flex justify-center pt-2 md:pt-8">
                                <div className="inline-flex items-center space-x-2 bg-accent/5 backdrop-blur-md px-8 py-3 rounded-full mb-8 border border-accent/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:border-accent hover:bg-accent/10 transition-all duration-500 cursor-default group">
                                    <Zap size={16} className="text-accent fill-accent animate-pulse" />
                                    <span className="text-accent text-[10px] md:text-xs font-black uppercase tracking-[0.3em] font-sans">FitWithPravinn</span>
                                </div>
                            </div>
                        </Reveal>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-text-primary mb-6 leading-[1.1] uppercase flex flex-col items-center gap-2">
                            <span>DISCIPLINE</span>
                            <span className="text-accent italic text-glow">OVER</span>
                            <span className="text-accent italic text-glow">MOTIVATION</span>
                        </h1>

                        <Reveal delay={0.5} y={30} width="100%">
                            <p className="text-base md:text-2xl text-text-secondary mb-14 leading-relaxed max-w-2xl mx-auto font-medium text-center">
                                Science-based training, nutrition guidance, and elite lifestyle habits. Transform your body and mindset with Mumbai's leading fitness educator.
                            </p>
                        </Reveal>

                        <Reveal delay={0.7} y={20} width="100%">
                            <div className="flex justify-center w-full relative z-20 pb-8 px-4">
                                <MagneticButton>
                                    <Link
                                        to="/programs"
                                        className="inline-flex items-center justify-center space-x-3 md:space-x-4 bg-accent hover:bg-accent-hover text-white px-8 py-5 md:px-10 md:py-4 rounded-2xl md:rounded-2xl font-black text-xs md:text-lg transition-all btn-glow group overflow-hidden relative shadow-[0_20px_50px_rgba(34,197,94,0.3)] active:scale-95 transform-gpu"
                                    >
                                        <span className="relative z-10 uppercase tracking-[0.2em] md:tracking-[0.2em]">Get Started</span>
                                        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform md:w-6 md:h-6 opacity-80 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </Link>
                                </MagneticButton>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <div ref={containerRef}>
                {/* About Section */}
                <section id="about" className="py-10 md:py-20 lg:py-40 bg-surface relative overflow-hidden text-left">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                            <Reveal x={-50} duration={0.8} width="100%">
                                <span className="lg:hidden text-accent font-black uppercase tracking-[0.4em] text-sm mb-6 block">The Coach</span>
                                <div className="relative group">
                                    <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-accent/5 relative w-[88%] max-w-sm mx-auto lg:w-full lg:max-w-none">
                                        <img
                                            src="/assets/pravin_about.png"
                                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                                            alt="Pravin Kumar"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 glass p-8 rounded-[2rem] shadow-2xl border-white/10 hidden md:block z-20">
                                        <div className="text-5xl font-black text-accent text-glow">1.5+</div>
                                        <div className="text-text-secondary font-bold uppercase tracking-widest text-xs mt-3">Years Experience</div>
                                    </div>
                                </div>
                            </Reveal>

                            <div className="space-y-6 md:space-y-10">
                                <Reveal delay={0.2}>
                                    <div className="max-w-xl">
                                        <span className="hidden lg:block text-accent font-black uppercase tracking-[0.4em] text-sm">The Coach</span>
                                        <h2 className="text-3xl md:text-6xl font-black mt-6 mb-10 text-text-primary tracking-tighter leading-tight">
                                            About <br /> <span className="text-accent italic">Pravin Kumar</span>
                                        </h2>
                                    </div>
                                </Reveal>

                                <Reveal delay={0.4} staggerChildren={0.2}>
                                    <div className="space-y-6 text-text-secondary text-base md:text-lg leading-relaxed font-medium">
                                        <p className="hover:text-text-primary transition-colors cursor-default">
                                            Hi, I’m <span className="text-text-primary font-bold">Pravin</span>, the coach behind fitwithpravinn. I’m an online fitness coach and content creator helping people transform through structured training, sustainable nutrition, and consistent habits. My approach is practical, science-backed, and focused on long-term results.
                                        </p>
                                        <p className="hover:text-text-primary transition-colors cursor-default">
                                            What makes my coaching different is personal involvement and accountability. Every client gets customized guidance, progress tracking, and plan updates based on real progress. Whether your goal is fat loss, muscle gain, or overall fitness, I’ll guide you clearly and keep you on track.
                                        </p>

                                    </div>
                                </Reveal>

                                <Reveal delay={0.6}>
                                    <div className="pt-2 md:pt-8 text-left">
                                        <MagneticButton distance={0.2}>
                                            <Link to="/programs" className="text-accent font-black text-2xl hover:text-white transition-all inline-flex items-center space-x-6 group">
                                                <span>Explore My Programs</span>
                                                <div className="bg-accent/10 p-4 rounded-full group-hover:bg-accent group-hover:text-white transition-all">
                                                    <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </Link>
                                        </MagneticButton>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="pt-20 pb-10 md:py-40 bg-bg-page relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Reveal className="text-center mb-16 md:mb-32 max-w-4xl mx-auto">
                            <span className="text-accent font-black uppercase tracking-[0.4em] text-sm md:text-base">Elite Programs</span>
                            <h2 className="text-5xl md:text-8xl font-black mt-6 mb-8 text-text-primary tracking-tighter uppercase leading-[0.9]">Master Your Physique</h2>
                            <div className="flex justify-center">
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                            {products.map((course, index) => (
                                <Reveal key={course._id} delay={index * 0.1} scale={0.9} y={40} width="100%">
                                    <CourseCard course={course} isSoldOut={isSoldOut} hideOriginalPrice={true} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="pt-10 pb-10 md:py-40 bg-surface border-y border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
                            <Reveal x={-30}>
                                <div className="space-y-12">
                                    <div>
                                        <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Success Stories</span>
                                        <h2 className="text-4xl md:text-8xl font-black mt-6 mb-10 text-text-primary tracking-tighter uppercase leading-[0.9]">Proven <br />Results.</h2>
                                        <p className="text-text-secondary text-base md:text-2xl font-medium leading-relaxed italic before:content-['“'] after:content-['”'] opacity-80">
                                            Pravin's approach to science-based training completely changed how I look at fitness. It's not about working harder, it's about working smarter.
                                        </p>
                                    </div>
                                    <div className="flex gap-12 md:gap-24 text-center mt-8 md:mt-24 pb-0 md:pb-16 scale-90 md:scale-100">
                                        <Reveal delay={0.9} width="100%">
                                            <div className="flex flex-col items-center group cursor-default">
                                                <span className="text-4xl md:text-6xl font-black text-white italic group-hover:text-accent transition-colors duration-500 mb-1 md:mb-2">100+</span>
                                                <span className="text-[10px] md:text-sm font-bold text-text-secondary tracking-[0.2em] md:tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-500">Lives Impacted</span>
                                            </div>
                                        </Reveal>
                                        <div className="h-16 w-px bg-white/10 hidden md:block" />
                                        <Reveal delay={1.0} width="100%">
                                            <div className="flex flex-col items-center group cursor-default">
                                                <span className="text-4xl md:text-6xl font-black text-white italic group-hover:text-accent transition-colors duration-500 mb-1 md:mb-2">4.5/5</span>
                                                <span className="text-[10px] md:text-sm font-bold text-text-secondary tracking-[0.2em] md:tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-500">Satisfaction</span>
                                            </div>
                                        </Reveal>
                                    </div>
                                </div>
                            </Reveal>
                            <Reveal delay={0.3} x={30}>
                                <TestimonialSlider />
                            </Reveal>
                        </div>
                    </div>
                </section>
            </div>

            {/* Local Scroll Progress Slider */}
            <motion.div
                style={{ opacity: useTransform(containerScroll, [0, 0.05], [0, 1]) }}
                className="fixed left-2 md:left-12 top-1/2 -translate-y-1/2 h-[70vh] md:h-[60vh] w-8 md:w-10 hidden md:flex flex-col items-center justify-between z-[100] pointer-events-none"
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
        </div>
    );
};

export default Home;
