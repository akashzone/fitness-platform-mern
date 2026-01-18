import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    ArrowLeft,
    ArrowRight,
    Play,
    Zap,
    Loader2,
    AlertCircle,
    ShoppingBag,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/motion/Reveal';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';
import { courses } from '../data/courses';
import api from '../utils/api';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedProduct, setRecommendedProduct] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [slotInfo, setSlotInfo] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Image Rotation Logic
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (course?.images && course.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % course.images.length);
            }, 4500); // 4.5 seconds

            return () => clearInterval(interval);
        }
    }, [course?.images]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await api.get('/products');
                if (response.data.slotInfo) {
                    setSlotInfo(response.data.slotInfo);
                }
            } catch (error) {
                console.error('Failed to fetch slots:', error);
            }
        };
        fetchSlots();
    }, []);

    // Configuration for dynamic pricing based on duration
    const DURATION_CONFIG = {
        "default": [
            { months: 1, label: "1 Month", priceMultiplier: 1, originalPriceMultiplier: 1.2 },
            { months: 2, label: "2 Months", priceMultiplier: 1.8, originalPriceMultiplier: 2.2 },
            { months: 3, label: "3 Months", priceMultiplier: 2.5, originalPriceMultiplier: 3.5, recommended: true },
            { months: 6, label: "6 Months", priceMultiplier: 4.5, originalPriceMultiplier: 6.5 }
        ]
    };

    const getDurationOptions = (courseId) => {
        // If the course object itself has plans, use them
        if (course && course.plans) {
            return course.plans;
        }
        // Fallback or logic for other courses if any (though we updated all)
        return DURATION_CONFIG.default;
    };

    useEffect(() => {
        const currentProduct = courses.find(c => c.id === id || c._id === id);

        if (currentProduct) {
            setCourse(currentProduct);

            // Set default selected duration (Recommended)
            const options = currentProduct.plans || getDurationOptions(currentProduct.id);
            const recommended = options.find(o => o.recommended) || options[0];
            setSelectedDuration(recommended);

            // Similar Products logic: Other courses only
            const otherCourses = courses.filter(c => c.id !== currentProduct.id && c._id !== currentProduct._id);
            if (otherCourses.length > 0) {
                setRecommendedProduct(
                    otherCourses[Math.floor(Math.random() * otherCourses.length)]
                );
            }
            setLoading(false);
        } else {
            setError('Product not found.');
            setLoading(false);
        }
    }, [id]);

    const getCurrentPrice = () => {
        if (!course || !selectedDuration) return { price: 0, originalPrice: 0 };

        // Use explicit price from plans if available
        if (selectedDuration.price !== undefined) {
            return {
                price: selectedDuration.price,
                originalPrice: selectedDuration.originalPrice || Math.round(selectedDuration.price * 1.2)
            };
        }

        return {
            price: Math.round(course.price * selectedDuration.priceMultiplier),
            originalPrice: Math.round(course.price * selectedDuration.originalPriceMultiplier)
        };
    };

    const handleAddToCart = () => {
        const { price, originalPrice } = getCurrentPrice();
        addToCart({
            ...course,
            price: price,
            originalPrice: originalPrice,
            durationMonths: selectedDuration.months,
            displayPrice: price
        });
    };
    const handleCheckout = () => {
        const { price, originalPrice } = getCurrentPrice();
        navigate(`/checkout/${course._id}`, {
            state: {
                selectedDuration: selectedDuration.months,
                customPrice: price,
                originalPrice: originalPrice
            }
        });
    };
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
                <h2 className="text-2xl font-black text-white uppercase mb-4">
                    Product Not Found
                </h2>
                <button
                    onClick={() => navigate('/programs')}
                    className="text-accent underline font-bold uppercase tracking-widest"
                >
                    Back to Programs
                </button>
            </div>
        );
    }

    const durationOptions = course?.plans || getDurationOptions(course?._id);


    return (
        <div className="py-6 lg:py-12 bg-bg-page min-h-screen selection:bg-accent/30 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-text-secondary hover:text-accent mb-6 md:mb-4 font-black uppercase tracking-widest text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Programs
                </button>

                {/* ================= MOBILE ================= */}
                <div className="lg:hidden space-y-8">
                    <Reveal>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                            {course.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <StarRating rating={course.rating || 4.9} size={12} />
                            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">4.9/5 Elite Rating</span>

                        </div>
                    </Reveal>

                    {/* 1. Image Card */}
                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                        {course.detailImage || course.mobileDetailImage ? (
                            <img
                                src={windowWidth < 1024 && course.mobileDetailImage ? course.mobileDetailImage : course.detailImage}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={course.images && course.images.length > 0 ? course.images[currentImageIndex] : course.image}
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0.8 }}
                                    transition={{ duration: 0.7 }}
                                    alt={course.title}
                                    className="w-full h-full object-contain bg-black/40"
                                />
                            </AnimatePresence>
                        )}

                        {!course.detailImage && course.images && course.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                {course.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Duration Selection (if multiple) - Moved Above CTA */}
                    {durationOptions.length > 1 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-secondary">Change Plan Duration</h3>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="relative w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-5 flex items-center justify-between focus:outline-none focus:border-accent transition-all font-bold text-sm tracking-widest uppercase overflow-hidden"
                                >
                                    <span className="flex items-center gap-2">
                                        {selectedDuration?.label}
                                    </span>
                                    {selectedDuration?.recommended && (
                                        <span className="absolute top-0 right-0 bg-accent text-white text-[8px] px-3 py-1 rounded-bl-xl font-black uppercase shadow-2xl z-10 italic">Most Recommended</span>
                                    )}
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-accent' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="mt-3 bg-[#0B0F14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                        {durationOptions.map((opt) => (
                                            <button
                                                key={opt.months}
                                                onClick={() => {
                                                    setSelectedDuration(opt);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full px-5 py-5 text-left font-bold text-xs uppercase tracking-widest border-b border-white/5 last:border-0 transition-colors flex justify-between items-center ${selectedDuration?.months === opt.months ? 'bg-accent text-white' : 'text-text-secondary hover:bg-white/5'}`}
                                            >
                                                <span>{opt.label}</span>
                                                {opt.recommended && (
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${selectedDuration?.months === opt.months ? 'bg-white text-accent' : 'bg-accent/20 text-accent'}`}>RECOMMENDED</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. CTA Card (Price + Join Now) */}
                    <div className="flex justify-between items-center bg-[#0B0F14] p-5 rounded-3xl border border-white/10 shadow-2xl gap-4">
                        <div className="flex flex-col min-w-0">
                            {slotInfo && course.id !== 'foundation-plan' && (
                                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${slotInfo.slotsLeft > 0 ? 'text-accent' : 'text-red-500'}`}>
                                    {slotInfo.slotsLeft > 0 ? `${slotInfo.slotsLeft} Spots Left` : 'Sold Out'}
                                </span>
                            )}
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black italic text-glow text-white">₹{getCurrentPrice().price.toLocaleString('en-IN')}</span>
                                <span className="text-xs opacity-40 line-through text-white font-medium">₹{getCurrentPrice().originalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-accent mt-0.5">Secure Your Spot</span>
                        </div>
                        <button
                            disabled={course.slotInfo?.isSoldOut}
                            onClick={handleCheckout}
                            className={`flex-1 max-w-[160px] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${course.slotInfo?.isSoldOut
                                ? 'bg-white/10 text-white/40'
                                : 'bg-accent text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)]'}`}
                        >
                            {course.slotInfo?.isSoldOut ? 'Sold Out' : 'Join Now'}
                        </button>
                    </div>

                    {/* 2. Executive Summary (WHY) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Why this plan?</h3>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <ul className="space-y-4 list-none">
                                {course.executiveSummary?.map((point, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                        <span className="text-sm font-bold opacity-90 leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 3. What's Included (WHAT) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">What you get</h3>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 grid grid-cols-1 gap-5">
                            {course.features && course.features.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 group">
                                    <div className="mt-0.5 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                                        <CheckCircle size={12} className="text-accent" />
                                    </div>
                                    <span className="text-sm font-black opacity-80 uppercase tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Who This Plan Is For (WHO) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Ideal For</h3>
                        <div className="bg-accent/5 p-6 rounded-3xl border border-accent/20">
                            <p className="text-sm font-bold text-text-primary leading-relaxed italic">
                                "{course.whoThisPlanIsFor}"
                            </p>
                        </div>
                    </div>

                    {/* 5. Cross Sell (Ultimate Add-on) */}
                    {recommendedProduct && (
                        <div className="pt-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-text-secondary px-2 flex items-center gap-2">
                                <Zap size={12} className="text-accent" />
                                Ultimate Add-on
                            </h3>
                            <div
                                onClick={() => navigate(`/course/${recommendedProduct._id}`)}
                                className="glass-card p-4 rounded-3xl cursor-pointer border border-white/10 hover:border-accent/30 transition-all flex gap-4 bg-white/[0.02]"
                            >
                                <img
                                    src={recommendedProduct.image}
                                    className="w-20 h-24 object-cover rounded-2xl grayscale-[0.3]"
                                    alt=""
                                />
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-tight mb-1">
                                            {recommendedProduct.title}
                                        </h4>
                                        <p className="text-[10px] text-text-secondary font-medium line-clamp-2 leading-tight">
                                            Perfect companion for your transformation.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-accent text-sm italic">
                                            ₹{recommendedProduct.price}
                                        </span>
                                        <div className="bg-white/10 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                                            View
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                </div>

                {/* ================= DESKTOP ================= */}
                <div className="hidden lg:grid grid-cols-3 gap-24 mt-4">
                    {/* LEFT */}
                    <div className="col-span-2 space-y-6">
                        <Reveal>
                            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                {course.title}
                            </h1>
                            <div className="flex items-center gap-6 mt-6">
                                <StarRating rating={course.rating || 4.9} size={16} />
                                <span className="h-1 w-1 bg-white/20 rounded-full" />
                                <span className="text-xs text-text-secondary font-black uppercase tracking-[0.3em]">The Elite Choice</span>

                            </div>
                        </Reveal>

                        <div className="relative h-96 md:h-[30rem] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 group">
                            {course.detailImage || course.mobileDetailImage ? (
                                <img
                                    src={windowWidth < 1024 && course.mobileDetailImage ? course.mobileDetailImage : course.detailImage}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-all duration-1000"
                                />
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={course.images && course.images.length > 0 ? course.images[currentImageIndex] : course.image}
                                        initial={{ opacity: 0.8 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0.8 }}
                                        transition={{ duration: 1 }}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-all duration-1000"
                                    />
                                </AnimatePresence>
                            )}

                            {/* Carousel Indicators for Desktop */}
                            {!course.detailImage && course.images && course.images.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {course.images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-6' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700 pointer-events-none" />
                        </div>

                        <div className="space-y-12">
                            <Reveal>
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                                    <span className="h-px w-12 bg-accent" />
                                    Executive Summary
                                </h3>
                                <div className="text-2xl opacity-80 mt-8 leading-relaxed font-medium max-w-4xl">
                                    <ul className="space-y-4 list-none">
                                        {course.executiveSummary?.map((point, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <span className="text-accent mt-1.5">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <div className="grid grid-cols-2 gap-8 mt-12">
                                    {course.features && course.features.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-5 group/feat"
                                        >
                                            <div className="mt-1 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover/feat:bg-accent transition-all">
                                                <CheckCircle
                                                    size={12}
                                                    className="text-accent group-hover/feat:text-white"
                                                />
                                            </div>
                                            <span className="text-lg font-bold opacity-70 group-hover/feat:opacity-100 transition-opacity">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="sticky top-32 h-fit">
                        <div className="glass-card p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group/card text-left">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none group-hover/card:bg-accent/10 transition-all duration-1000" />

                            <div className="text-center mb-10 relative z-10">
                                {slotInfo && course.id !== 'foundation-plan' && (
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <span className={`text-xs font-black uppercase tracking-widest ${slotInfo.slotsLeft > 0 ? 'text-accent' : 'text-red-500'}`}>
                                            {slotInfo.slotsLeft > 0 ? `Hurry! Only ${slotInfo.slotsLeft} Spots Available` : 'Sold Out'}
                                        </span>
                                    </div>
                                )}
                                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-3 opacity-60">Total Investment</span>
                                <div className="flex flex-col items-center">
                                    <div className="price-original text-2xl md:text-4xl whitespace-nowrap mb-2">
                                        <span className="text-sm md:text-lg opacity-40 font-black mr-2 uppercase tracking-widest">Original Value</span>
                                        ₹{getCurrentPrice().originalPrice.toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-7xl font-black italic tracking-tighter text-glow">
                                        ₹{getCurrentPrice().price.toLocaleString('en-IN')}
                                    </div>
                                    <div className="bg-accent/10 text-accent text-[10px] px-4 py-1 rounded-full font-black uppercase tracking-widest mt-4 border border-accent/20 animate-bounce">
                                        Save ₹{(getCurrentPrice().originalPrice - getCurrentPrice().price).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Custom Duration Selection */}
                            {/* Desktop Custom Duration Selection - Only show if more than 1 option */}
                            {durationOptions.length > 1 && (
                                <div className="space-y-6 mb-10 relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-secondary pl-2">Select Duration</h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="relative w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-5 flex items-center justify-between focus:outline-none focus:border-accent transition-all font-black text-sm tracking-widest uppercase hover:bg-white/10"
                                        >
                                            <span className="flex items-center gap-3">
                                                {selectedDuration?.label}
                                            </span>
                                            {selectedDuration?.recommended && (
                                                <span className="absolute top-0 right-0 bg-accent text-white text-[9px] px-4 py-1.5 rounded-tr-2xl rounded-bl-2xl font-black uppercase shadow-2xl z-10 animate-pulse italic">Most Recommended</span>
                                            )}
                                            <ChevronDown size={20} className={`text-text-secondary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-accent' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="relative mt-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mb-6">
                                                {durationOptions.map((opt) => (
                                                    <button
                                                        key={opt.months}
                                                        onClick={() => {
                                                            setSelectedDuration(opt);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-6 py-5 text-left font-black text-xs uppercase tracking-[0.2em] border-b border-white/5 last:border-0 transition-all flex items-center justify-between group/opt ${selectedDuration?.months === opt.months ? 'bg-accent text-white' : 'text-text-secondary hover:bg-accent/10 hover:text-white'
                                                            }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        {opt.recommended && (
                                                            <span className={`text-[8px] px-3 py-1 rounded-full font-black ${selectedDuration?.months === opt.months ? 'bg-white text-accent' : 'bg-accent/20 text-accent group-hover/opt:bg-accent group-hover/opt:text-white'}`}>MOST RECOMMENDED</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 relative z-10">
                                <button
                                    disabled={course.slotInfo?.isSoldOut}
                                    onClick={handleCheckout}
                                    className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-lg transition-all transform hover:scale-[1.02] active:scale-95 btn-glow ${course.slotInfo?.isSoldOut
                                        ? 'bg-white/10 text-white/40'
                                        : 'bg-accent text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                                        }`}
                                >
                                    {course.slotInfo?.isSoldOut
                                        ? 'Sold Out'
                                        : 'Secure My Spot'}
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-5 rounded-2xl border border-white/10 uppercase font-black flex items-center justify-center gap-4 text-white hover:bg-white/5 transition-all text-sm tracking-[0.2em] group/cart"
                                >
                                    <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                                    Add to Cart
                                </button>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-6 relative z-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-secondary">Who This Plan Is For</h3>
                                <p className="text-sm font-bold opacity-70 leading-relaxed italic">
                                    {course.whoThisPlanIsFor}
                                </p>
                            </div>
                        </div>

                        {/* Recommendation Card */}
                        {recommendedProduct && (
                            <div
                                onClick={() => navigate(`/course/${recommendedProduct.id || recommendedProduct._id}`)}
                                className="glass-card mt-6 p-6 rounded-[2rem] border border-white/5 cursor-pointer group active:scale-95 transition-all hover:border-accent/40 relative overflow-hidden bg-black/20"
                            >
                                <div className="flex gap-5 items-center relative z-10">
                                    <img
                                        src={recommendedProduct.image}
                                        alt={recommendedProduct.title}
                                        className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10 shadow-lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Zap size={10} className="text-accent animate-pulse" />
                                            <span className="text-[9px] text-accent font-black uppercase tracking-widest">Recommended For You</span>
                                        </div>
                                        <h4 className="text-sm font-black uppercase leading-tight group-hover:text-white text-text-primary/90 transition-colors truncate">
                                            {recommendedProduct.title}
                                        </h4>
                                        <div className="mt-1 text-[10px] uppercase tracking-wider opacity-60 font-bold">
                                            from ₹{recommendedProduct.price}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-full border border-white/5 group-hover:bg-accent group-hover:text-white transition-all shadow-xl group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
