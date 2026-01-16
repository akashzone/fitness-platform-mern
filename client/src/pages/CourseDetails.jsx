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
import Reveal from '../components/motion/Reveal';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';
import { courses } from '../data/courses';

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
        if (course.isLiveTest) {
            return {
                price: 30,
                originalPrice: Math.round(30 * 1.2)
            };
        }

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
                            {course.isLiveTest && (
                                <span className="bg-accent/20 text-accent text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-accent/30 animate-pulse">Live Testing</span>
                            )}
                        </div>
                    </Reveal>

                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover grayscale-[0.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-pulse">
                                <Play size={20} fill="white" className="ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Custom Duration Selection */}
                    {/* Mobile Custom Duration Selection - Only show if more than 1 option */}
                    {durationOptions.length > 1 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary">Select Program Duration</h3>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="relative w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-4 flex items-center justify-between focus:outline-none focus:border-accent transition-all font-bold text-sm tracking-widest uppercase"
                                >
                                    <span className="flex items-center gap-2">
                                        {selectedDuration?.label}
                                    </span>
                                    {selectedDuration?.recommended && (
                                        <span className="absolute top-0 right-0 bg-accent text-white text-[7px] px-3 py-1 rounded-tr-xl rounded-bl-xl font-black uppercase shadow-xl z-10 animate-pulse italic">Recommended</span>
                                    )}
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-accent' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="relative mt-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 mb-4">
                                        {durationOptions.map((opt) => (
                                            <button
                                                key={opt.months}
                                                onClick={() => {
                                                    setSelectedDuration(opt);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full px-4 py-4 text-left font-bold text-xs uppercase tracking-widest border-b border-white/5 last:border-0 transition-colors ${selectedDuration?.months === opt.months ? 'bg-accent text-white' : 'text-text-secondary hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{opt.label}</span>
                                                    {opt.recommended && (
                                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${selectedDuration?.months === opt.months ? 'bg-white text-accent' : 'bg-accent/20 text-accent'}`}>MOST RECOMMENDED</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 gap-2">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-60">
                                {course.isLiveTest ? 'Test Investment' : 'Investment'}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="text-xl md:text-2xl font-black italic text-glow whitespace-nowrap">
                                    ₹{getCurrentPrice().price.toLocaleString('en-IN')}
                                </div>
                                <div className="price-original text-[13px] md:text-lg whitespace-nowrap ml-2">
                                    <span className="text-[9px] md:text-xs opacity-50 font-black mr-1 uppercase">Was</span>
                                    ₹{getCurrentPrice().originalPrice.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="text-accent text-[10px] md:text-[11px] font-black uppercase tracking-widest mt-1 whitespace-nowrap">
                                Save ₹{(getCurrentPrice().originalPrice - getCurrentPrice().price).toLocaleString('en-IN')}
                            </div>
                        </div>
                        <button
                            disabled={course.slotInfo?.isSoldOut}
                            onClick={handleCheckout}
                            className={`px-4 py-2.5 md:px-8 md:py-4 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex-shrink-0 ${course.slotInfo?.isSoldOut
                                ? 'bg-white/10 text-white/40'
                                : 'bg-accent text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                                }`}
                        >
                            {course.slotInfo?.isSoldOut
                                ? 'Sold Out'
                                : 'Secure Spot'}
                        </button>
                    </div>

                    {/* Cross Sell */}
                    {recommendedProduct && (
                        <div className="mt-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-text-secondary px-2">
                                Ultimate Add-on
                            </h3>
                            <div
                                onClick={() =>
                                    navigate(
                                        `/course/${recommendedProduct._id}`
                                    )
                                }
                                className="glass-card p-4 rounded-2xl cursor-pointer border border-white/5 hover:border-accent/30 transition-all flex gap-4"
                            >
                                <img
                                    src={recommendedProduct.image}
                                    className="w-20 h-24 object-cover rounded-xl grayscale-[0.3]"
                                    alt=""
                                />
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-tight mb-1">
                                            {recommendedProduct.title}
                                        </h4>
                                        <p className="text-[10px] text-text-secondary font-medium line-clamp-2 leading-tight">
                                            {recommendedProduct.description || 'Enhance your results.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-accent text-sm italic">
                                            ₹{recommendedProduct.price}
                                        </span>
                                        <div className="bg-white/10 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">
                                            View
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xs font-black uppercase mb-4 tracking-widest text-text-secondary">Executive Summary</h3>
                        <p className="text-sm opacity-80 leading-relaxed font-medium">
                            {course.fullDescription}
                        </p>
                    </div>
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
                                {course.isLiveTest && (
                                    <span className="bg-accent/20 text-accent text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-accent/30 animate-pulse">Live Testing Mode Active</span>
                                )}
                            </div>
                        </Reveal>

                        <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 group">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700" />
                        </div>

                        <div className="space-y-12">
                            <Reveal>
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                                    <span className="h-px w-12 bg-accent" />
                                    Executive Summary
                                </h3>
                                <p className="text-2xl opacity-80 mt-8 leading-relaxed font-medium max-w-4xl">
                                    {course.fullDescription}
                                </p>
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
                                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
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

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                                {course.features && course.features.slice(0, 3).map((f, i) => (
                                    <div key={i} className="flex gap-4 items-center opacity-60 hover:opacity-100 transition-opacity">
                                        <Zap size={14} className="text-accent flex-shrink-0" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest leading-tight">{f}</span>
                                    </div>
                                ))}
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
