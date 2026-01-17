import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

const CourseCard = ({ course, isSoldOut, hideOriginalPrice = false }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const showSoldOut = isSoldOut;

    const handleCardClick = (e) => {
        if (showSoldOut) return;
        // Don't navigate if clicking the Add button
        if (e.target.closest('button')) return;
        navigate(`/course/${course.id || course._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`glass-card rounded-2xl md:rounded-[2rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group flex flex-col h-full border border-white/5 hover:border-accent/30 cursor-pointer ${showSoldOut ? 'opacity-70 grayscale pointer-events-none' : ''}`}
        >
            <div className="relative aspect-[16/11] overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                />

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
                    {course.features?.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-start leading-tight">
                            <span className="mr-2 text-accent">•</span>
                            <span>{feature}</span>
                        </li>
                    ))}
                    {course.features?.length > 2 && (
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
