import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, ArrowLeft, Play, Zap, CreditCard, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import MagneticButton from '../components/motion/MagneticButton';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setCourse(response.data);
            } catch (err) {
                setError('Product not found or connection error.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-black text-white uppercase mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/programs')} className="text-accent underline font-bold uppercase tracking-widest">Back to Programs</button>
            </div>
        );
    }

    return (
        <div className="py-12 lg:py-24 bg-bg-page min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-3 text-text-secondary hover:text-accent mb-16 transition-all font-black uppercase tracking-[0.2em] text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                    <span>Back to Programs</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start">
                    {/* Left: Course Image & Details */}
                    <div className="lg:col-span-2 space-y-20">
                        <div className="space-y-16">
                            {/* Title & Rating at the top */}
                            <div className="space-y-8">
                                <Reveal>
                                    <span className="bg-accent/10 border border-accent/20 text-accent px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(34,197,94,0.1)]">Premium Program</span>
                                </Reveal>
                                <Reveal delay={0.2}>
                                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-text-primary tracking-tighter leading-[1] uppercase break-words hyphens-auto">{course.title}</h1>
                                </Reveal>
                                <Reveal delay={0.4}>
                                    <div className="flex items-center space-x-8">
                                        <StarRating rating={course.rating || 4.9} />
                                        <span className="text-white/10 text-2xl font-thin">|</span>
                                        <span className="text-text-secondary font-black uppercase tracking-widest text-sm">1,200+ Active Athletes</span>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Video below Title & Rating */}
                            <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/5">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                                    <div className="w-20 h-20 glass border border-white/20 rounded-full flex items-center justify-center text-white scale-100 group-hover:scale-125 transition-all shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                        <Play size={28} fill="white" className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary below Video */}
                        <div className="space-y-10">
                            <Reveal>
                                <h3 className="text-2xl font-black text-text-primary mb-8 flex items-center space-x-4 uppercase tracking-tighter">
                                    <span className="w-12 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <span>Executive Summary</span>
                                </h3>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <p className="text-text-secondary text-xl md:text-2xl leading-relaxed font-medium opacity-90 border-l-4 border-accent/20 pl-8">
                                    {course.fullDescription}
                                </p>
                            </Reveal>
                        </div>

                        {/* How this program works */}
                        {course.features && (
                            <div className="space-y-12">
                                <Reveal>
                                    <h3 className="text-4xl font-black text-text-primary tracking-tighter uppercase">How this program works?</h3>
                                </Reveal>
                                <div className="grid grid-cols-1 gap-8">
                                    {[
                                        {
                                            step: "Step 1: Initial Consultation",
                                            desc: [
                                                "We'll start with a detailed talk about your height, weight, age, food preferences, and daily activity levels.",
                                                "I'll understand your goals — whether it's fat loss, muscle gain, or overall fitness.",
                                                "We'll discuss any past injuries or health concerns to make sure your plan is safe and effective."
                                            ]
                                        },
                                        {
                                            step: "Step 2: Personalized Plan Creation",
                                            desc: [
                                                "Within 24 hours after our first session, you'll receive your custom diet plan and personalized workout routine.",
                                                "Both are designed around your goals, schedule, and food preferences, making them easy to follow and realistic."
                                            ]
                                        },
                                        {
                                            step: "Step 3: Weekly Progress Tracking",
                                            desc: [
                                                "In upcoming sessions, we'll track your progress — strength levels, workout consistency, and diet adherence.",
                                                "Based on your results, I'll modify your workouts and diet to keep you progressing efficiently."
                                            ]
                                        },
                                        {
                                            step: "Step 4: Ongoing Support & Accountability",
                                            desc: [
                                                "You'll have continuous guidance, text support, and feedback whenever you need help.",
                                                "My focus stays on keeping you consistent, confident, and progressing every single week."
                                            ]
                                        }
                                    ].map((item, idx) => (
                                        <Reveal key={idx} delay={idx * 0.1}>
                                            <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-accent/20 transition-all group">
                                                <h4 className="text-2xl font-black text-accent mb-6 uppercase tracking-tight group-hover:text-glow">{item.step}</h4>
                                                <ul className="space-y-5">
                                                    {item.desc.map((line, lIdx) => (
                                                        <li key={lIdx} className="flex items-start space-x-4 text-text-secondary font-medium leading-relaxed group-hover:text-text-primary transition-colors">
                                                            <CheckCircle size={20} className="text-accent/40 group-hover:text-accent mt-0.5 flex-shrink-0 transition-colors" />
                                                            <span>{line}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Checkout Sidebar */}
                    <div className="lg:sticky lg:top-32 glass-card p-6 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        {/* Sold Out Overlay for Sidebar */}
                        {course.type === 'course' && course.slotInfo?.isSoldOut && (
                            <div className="absolute inset-0 bg-bg-page/40 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-red-500 text-white font-black px-8 py-3 rounded-full text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-red-400/50 mb-4">
                                    Sold Out
                                </div>
                                <p className="text-text-primary font-bold text-sm uppercase tracking-widest">Waitlist Only for this month</p>
                            </div>
                        )}

                        <div className="mb-12 text-center">
                            <div className="text-text-secondary text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-60">Program Investment</div>
                            <div className="text-6xl font-black text-text-primary tracking-tighter">₹{course.price.toLocaleString('en-IN')}</div>
                        </div>

                        <Reveal>
                            <div className="space-y-6">
                                <button
                                    onClick={() => !course.slotInfo?.isSoldOut && navigate(`/checkout/${course._id}`)}
                                    disabled={course.type === 'course' && course.slotInfo?.isSoldOut}
                                    className={`w-full px-6 py-4 md:py-6 rounded-2xl font-black text-xl transition-all transform hover:scale-[1.03] active:scale-95 uppercase tracking-wider overflow-hidden relative group/btn whitespace-nowrap ${course.type === 'course' && course.slotInfo?.isSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed opacity-50' : 'bg-accent hover:bg-accent-hover text-white shadow-[0_0_30px_rgba(34,197,94,0.3)] btn-glow'}`}
                                >
                                    <span className="relative z-10">{course.type === 'course' && course.slotInfo?.isSoldOut ? 'Sold Out' : 'Secure My Spot'}</span>
                                    {(!course.slotInfo || !course.slotInfo.isSoldOut) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    )}
                                </button>
                                <button
                                    onClick={() => addToCart(course)}
                                    disabled={course.type === 'course' && course.slotInfo?.isSoldOut}
                                    className={`w-full px-6 py-4 md:py-5 rounded-2xl font-black text-sm border transition-all uppercase tracking-[0.2em] flex items-center justify-center space-x-3 mb-10 ${course.type === 'course' && course.slotInfo?.isSoldOut ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}
                                >
                                    <ShoppingBag size={18} />
                                    <span>{course.type === 'course' && course.slotInfo?.isSoldOut ? 'Unavailable' : 'Add to Cart'}</span>
                                </button>
                            </div>
                        </Reveal>

                        {course.features && (
                            <div className="space-y-6">
                                <div className="text-xs font-black text-text-primary uppercase tracking-[0.3em] border-b border-white/5 pb-4">Plan Inclusions:</div>
                                <ul className="space-y-5">
                                    {course.features.map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-4 group/item">
                                            <Zap size={16} className="text-accent mt-1 flex-shrink-0 group-hover:fill-accent transition-all" />
                                            <span className="text-text-secondary text-sm font-bold uppercase tracking-widest group-hover:text-text-primary transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-16 pt-10 border-t border-white/5 text-center">
                            <p className="text-text-secondary font-black text-xs uppercase tracking-[0.2em] italic opacity-40">
                                Trusted by Elite Athletes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
