import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

const CourseCard = ({ course, isSoldOut, slotsLeft, hideOriginalPrice = false, className = '' }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const showSoldOut = isSoldOut;



    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        if (course.images && course.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % course.images.length);
            }, 4500); // 4.5 seconds

            return () => clearInterval(interval);
        }
    }, [course.images]);

    const activeImage = course.images && course.images.length > 0
        ? course.images[currentImageIndex]
        : course.image;

    return (
        <div
            onClick={() => navigate(`/course/${course.id || course._id}`)}
            className={`group relative flex flex-row items-center gap-4 p-4 md:p-6 bg-surface border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] cursor-pointer ${className}`}
        >

            {/* Image Section */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 flex-shrink-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={activeImage}
                        initial={{ opacity: 0.8, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.8 }}
                        transition={{ duration: 0.7 }}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Carousel Indicators */}
                {course.images && course.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                        {course.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1 h-1 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-2' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}

                {/* Sold Out Badge (Simplified for horizontal) */}
                {showSoldOut && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                        <div className="bg-red-500 text-white font-black px-2 py-0.5 rounded-full text-[8px] uppercase tracking-tighter shadow-lg border border-red-400/50">
                            Sold Out
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow min-w-0 pr-18 md:pr-12">
                <div className="flex justify-between items-start mb-1 md:mb-2 text-left">
                    <h3 className="text-sm md:text-2xl font-black text-text-primary group-hover:text-accent transition-colors leading-tight tracking-tight">
                        {course.title}
                    </h3>
                </div>

                <p className="text-[10px] md:text-sm text-text-secondary line-clamp-2 md:line-clamp-3 mb-2 md:mb-4 leading-relaxed opacity-70">
                    {course.description || "Premium program designed for maximum results and sustainable health."}
                </p>

                <div className="flex items-end gap-1.5 md:gap-5 mt-auto relative z-10 transition-all">
                    {!hideOriginalPrice && (
                        <div className="flex flex-col items-start translate-y-0.5 md:translate-y-0">
                            <span className="text-[8px] md:text-[9px] font-black text-accent uppercase tracking-[0.2em] mb-1.5 md:mb-2 leading-none">Launch Price</span>
                            <span className="text-sm md:text-2xl text-white/50 line-through font-black italic tracking-tighter leading-none">
                                ₹{(course.originalPrice || Math.round((course.displayPrice || course.price) * 1.2)).toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm md:text-2xl font-black text-white italic tracking-tighter text-glow leading-none">
                            ₹{(course.displayPrice || course.price).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Circular Add Button */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!showSoldOut) addToCart(course);
                    }}
                    disabled={showSoldOut}
                    className={`px-4 py-2 md:px-10 md:py-3.5 flex items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300 shadow-xl border border-white/10 group/btn overflow-hidden relative ${showSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white hover:scale-105 active:scale-95'}`}
                >
                    <span className="relative z-10 text-[9px] md:text-xs font-black">
                        ADD
                    </span>
                    {!showSoldOut && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
