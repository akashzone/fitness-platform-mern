import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

const CourseCard = ({ course, isSoldOut, hideOriginalPrice = false, className = '' }) => {
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
            className={`group relative flex flex-col h-full bg-surface border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] cursor-pointer ${className}`}
        >
            <div className="relative h-48 sm:h-52 md:h-64 overflow-hidden"> {/* Changed aspect ratio div */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10 hidden md:block" />
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={activeImage}
                        initial={{ opacity: 0.8, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.8 }}
                        transition={{ duration: 0.7 }}
                        alt={course.title}
                        className="w-full h-full object-cover transform grayscale-0 md:grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                    />
                </AnimatePresence>

                {/* Carousel Indicators */}
                {course.images && course.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                        {course.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-3' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Sold Out Badge */}
                {showSoldOut && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                        <div className="bg-red-500 text-white font-black px-3 py-1 md:px-8 md:py-3 rounded-full text-xs md:text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-red-400/50">
                            Sold Out
                        </div>
                    </div>
                )}

                <div className="absolute top-1 left-1 md:top-6 md:left-6 bg-black/40 md:glass px-2 py-1 md:px-8 md:py-4 rounded-xl md:rounded-3xl flex flex-col items-center shadow-2xl border border-white/10 group-hover:border-accent/30 transition-all duration-500 backdrop-blur-md md:backdrop-blur-xl">
                    <span className="pricing-badge-label text-[9px] md:text-[12px] opacity-80 mb-0.5 md:mb-1">
                        Starting From
                    </span>
                    <div className="flex flex-col items-center leading-none">
                        {!hideOriginalPrice && (
                            <span className="price-original mb-1 md:mb-2 text-[10px] md:text-base">
                                <span className="text-[7px] md:text-[10px] opacity-60 mr-1 uppercase">Was</span>
                                ₹{Math.round((course.displayPrice || course.price) * 1.2).toLocaleString('en-IN')}
                            </span>
                        )}
                        <span className="price-final text-glow text-xs md:text-2xl">
                            ₹{(course.displayPrice || course.price).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-page/80 to-transparent opacity-60" />
            </div>

            <div className="p-3 md:p-8 flex flex-col items-center text-center flex-grow relative z-10">
                <div className="mb-1 md:mb-6 opacity-60 md:opacity-100 scale-75 md:scale-100 origin-center">
                    <StarRating rating={course.rating || 4.9} />
                </div>
                <h3 className="text-xs md:text-xl font-black mb-0 md:mb-4 text-text-primary group-hover:text-accent py-1 transition-colors leading-[1.2] tracking-tight uppercase break-words hyphens-auto w-full">
                    {course.title}
                </h3>
                <ul className="text-text-secondary text-xs md:text-sm mb-3 md:mb-8 text-left w-full space-y-1.5 pl-1 opacity-80 min-h-[60px]">
                    {(() => {
                        const isFoundation = course.id === 'foundation-plan' || course._id === 'foundation-plan';
                        const visibleFeatures = isFoundation ? course.features : course.features?.slice(0, 2);

                        return (
                            <>
                                {visibleFeatures?.map((feature, idx) => (
                                    <li key={idx} className="flex items-start leading-tight">
                                        <span className="mr-2 text-accent">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                                {!isFoundation && course.features?.length > 2 && (
                                    <li className="flex items-start leading-tight pt-1">
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/course/${course.id || course._id}`);
                                            }}
                                            className="text-accent hover:text-white transition-colors font-bold text-[10px] md:text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>View all benefits</span>
                                            <span className="text-sm leading-none">→</span>
                                        </span>
                                    </li>
                                )}
                            </>
                        );
                    })()}
                </ul>

                <div className="mt-auto w-full grid grid-cols-2 gap-2 md:gap-4 relative z-20">
                    <Link
                        to={showSoldOut ? '#' : `/course/${course.id || course._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center justify-center w-full font-black py-2 md:py-4 rounded-lg md:rounded-xl transition-all border border-white/5 md:border-white/10 text-white/50 md:text-white text-[9px] md:text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white ${showSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {showSoldOut ? 'Wait' : 'Details'}
                    </Link>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!showSoldOut) addToCart(course);
                        }}
                        disabled={showSoldOut}
                        className={`flex items-center justify-center w-full font-black py-2 md:py-4 rounded-lg md:rounded-xl transition-all btn-glow shadow-xl group/btn overflow-hidden relative text-[9px] md:text-xs uppercase tracking-widest ${showSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'}`}
                    >
                        <span className="relative z-10">ADD</span>
                        {!showSoldOut && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
