import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { courses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import TestimonialSlider from '../components/TestimonialSlider';
import Reveal from '../components/motion/Reveal';
import MagneticButton from '../components/motion/MagneticButton';
import { useState, useEffect } from 'react';

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
    const [slotInfo, setSlotInfo] = useState(null);

    useEffect(() => {
        const fetchSlotInfo = async () => {
            try {
                // We only fetch slot info, not products
                const response = await api.get('/products');
                setSlotInfo(response.data.slotInfo);
            } catch (err) {
                console.error('Slot Info Load Error:', err);
            }
        };
        fetchSlotInfo();
    }, []);

    const isSoldOut = slotInfo?.isSoldOut;

    return (
        <div className="bg-bg-page selection:bg-accent/40 selection:text-white">
            {/* Hero Section */}
            <section ref={heroRef} className="relative h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-bg-page">
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 h-full w-full">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
                        alt="Hero Background"
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-primary-brand/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/20 to-transparent" />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 pl-10 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <div className="max-w-4xl">
                        <Reveal delay={0.1} width="100%">
                            <div className="w-full flex justify-center pt-8">
                                <div className="inline-flex items-center space-x-2 bg-accent/5 backdrop-blur-md px-8 py-3 rounded-full mb-8 border border-accent/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:border-accent hover:bg-accent/10 transition-all duration-500 cursor-default group">
                                    <Zap size={16} className="text-accent fill-accent animate-pulse" />
                                    <span className="text-accent text-xs font-black uppercase tracking-[0.3em] font-sans">FitWithPravinn</span>
                                </div>
                            </div>
                        </Reveal>

                        <h1 className="text-2xl md:text-6xl font-black tracking-tighter text-text-primary mb-6 leading-[1.1] uppercase flex flex-col items-center gap-2">
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
                            <div className="flex justify-center w-full relative z-20 pb-8">
                                <MagneticButton>
                                    <Link
                                        to="/programs"
                                        className="inline-flex items-center justify-center space-x-3 md:space-x-4 bg-accent hover:bg-accent-hover text-white px-6 py-3 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl transition-all btn-glow group overflow-hidden relative shadow-2xl shadow-accent/20"
                                    >
                                        <span className="relative z-10 uppercase tracking-widest">Get Started</span>
                                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform md:w-6 md:h-6" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </Link>
                                </MagneticButton>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 lg:py-40 bg-surface relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 pl-10 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <Reveal x={-50} duration={0.8} width="100%">
                            <span className="lg:hidden text-accent font-black uppercase tracking-[0.4em] text-sm mb-6 block">The Coach</span>
                            <div className="relative group">
                                <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-accent/5 relative w-3/4 max-w-xs mx-auto lg:w-full lg:max-w-none">
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

                        <div className="space-y-10">
                            <Reveal delay={0.2}>
                                <div className="max-w-xl">
                                    <span className="hidden lg:block text-accent font-black uppercase tracking-[0.4em] text-sm">The Coach</span>
                                    <h2 className="text-3xl md:text-6xl font-black mt-6 mb-10 text-text-primary tracking-tighter leading-tight">
                                        About <br /> <span className="text-accent italic">Pravin Kumar</span>
                                    </h2>
                                </div>
                            </Reveal>

                            <Reveal delay={0.4} staggerChildren={0.2}>
                                <div className="space-y-8 text-text-secondary text-base md:text-xl leading-relaxed font-medium">
                                    <p className="hover:text-text-primary transition-colors cursor-default">
                                        Praveen Kumar, widely known as <span className="text-text-primary font-bold">FitWithPravinn</span>, is a Mumbai-based fitness educator, transformation coach, and lifestyle influencer. His mission is to make self-improvement simple, practical, and achievable for everyone.
                                    </p>
                                    <p className="hover:text-text-primary transition-colors cursor-default">
                                        Through Instagram, YouTube, and Snapchat, Praveen shares science-based workouts, nutrition guidance, and disciplined lifestyle habits that help people transform their bodies and mindset.
                                    </p>

                                </div>
                            </Reveal>

                            <Reveal delay={0.6}>
                                <div className="pt-8">
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
            <section id="courses" className="py-40 bg-bg-page relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 pl-10 sm:px-6 lg:px-8">
                    <Reveal className="text-center mb-32 max-w-4xl mx-auto">
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-sm md:text-base">Elite Programs</span>
                        <h2 className="text-5xl md:text-8xl font-black mt-6 mb-8 text-text-primary tracking-tighter uppercase leading-[0.9]">Master Your Physique</h2>
                        <div className="flex justify-center">
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-10">
                        {courses.map((course, index) => (
                            <Reveal key={course._id} delay={index * 0.1} scale={0.9} y={40} width="100%">
                                <CourseCard course={course} isSoldOut={isSoldOut} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-40 bg-surface border-y border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 pl-10 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <Reveal x={-30}>
                            <div className="space-y-12">
                                <div>
                                    <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Success Stories</span>
                                    <h2 className="text-4xl md:text-8xl font-black mt-6 mb-10 text-text-primary tracking-tighter uppercase leading-[0.9]">Proven <br />Results.</h2>
                                    <p className="text-text-secondary text-base md:text-2xl font-medium leading-relaxed italic before:content-['“'] after:content-['”'] opacity-80">
                                        Pravin's approach to science-based training completely changed how I look at fitness. It's not about working harder, it's about working smarter.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-6 md:gap-16">
                                    <div className="group">
                                        <div className="text-3xl md:text-6xl font-black text-text-primary italic group-hover:text-accent transition-colors">10K+</div>
                                        <div className="text-text-secondary text-[8px] md:text-xs font-black uppercase mt-3 tracking-[0.2em] opacity-60">Lives Impacted</div>
                                    </div>
                                    <div className="group">
                                        <div className="text-3xl md:text-6xl font-black text-text-primary italic group-hover:text-accent transition-colors">4.9/5</div>
                                        <div className="text-text-secondary text-[8px] md:text-xs font-black uppercase mt-3 tracking-[0.2em] opacity-60">Satisfaction</div>
                                    </div>
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
    );
};

export default Home;
