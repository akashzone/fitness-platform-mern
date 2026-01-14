import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

const CourseCard = ({ course, isSoldOut }) => {
    const { addToCart } = useCart();
    const showSoldOut = isSoldOut;

    return (
        <div className={`glass-card rounded-2xl md:rounded-[2rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group flex flex-col h-full border border-white/5 hover:border-accent/30 ${showSoldOut ? 'opacity-70 grayscale pointer-events-none' : ''}`}>
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

                <div className="absolute top-2 left-2 md:top-6 md:left-6 glass px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-2xl flex flex-col items-center shadow-2xl border-white/10 group-hover:border-accent/20 transition-all">
                    <span className="text-[6px] md:text-[8px] uppercase tracking-widest opacity-70 mb-0.5">
                        {course.isLiveTest ? 'Live Testing' : 'Starting From'}
                    </span>
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-[8px] md:text-[10px] line-through text-white/30 font-bold mb-0.5">₹{Math.round((course.displayPrice || course.price) * 1.2).toLocaleString('en-IN')}</span>
                        <span className="text-[10px] md:text-base font-black text-white uppercase italic">₹{(course.displayPrice || course.price).toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-page/80 to-transparent opacity-60" />
            </div>

            <div className="p-3 md:p-8 flex flex-col items-center text-center flex-grow relative z-10">
                <div className="mb-2 md:mb-6">
                    <StarRating rating={course.rating || 4.9} />
                </div>
                <h3 className="text-[10px] md:text-2xl lg:text-2xl font-black mb-1 md:mb-4 text-text-primary group-hover:text-accent transition-colors leading-[1.1] tracking-tight uppercase break-words hyphens-auto w-full">
                    {course.title}
                </h3>
                <p className="text-text-secondary text-[10px] md:text-base mb-3 md:mb-10 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium opacity-80">
                    {course.description}
                </p>

                <div className="mt-auto w-full grid grid-cols-2 gap-2 md:gap-4 relative z-20">
                    <Link
                        to={showSoldOut ? '#' : `/course/${course.id || course._id}`}
                        className={`flex items-center justify-center w-full font-black py-2 md:py-4 rounded-lg md:rounded-xl transition-all border border-white/10 text-white text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/5 ${showSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {showSoldOut ? 'Wait' : 'Details'}
                    </Link>
                    <button
                        onClick={() => !showSoldOut && addToCart(course)}
                        disabled={showSoldOut}
                        className={`flex items-center justify-center w-full font-black py-2 md:py-4 rounded-lg md:rounded-xl transition-all btn-glow shadow-xl group/btn overflow-hidden relative text-[10px] md:text-xs uppercase tracking-widest ${showSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'}`}
                    >
                        <span className="relative z-10">Add</span>
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
