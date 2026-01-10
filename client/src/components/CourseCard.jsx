import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

const CourseCard = ({ course, isSoldOut }) => {
    const { addToCart } = useCart();
    const isEbook = course.type === 'ebook';
    const showSoldOut = !isEbook && isSoldOut;

    return (
        <div className={`glass-card rounded-[2rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group flex flex-col h-full border border-white/5 hover:border-accent/30 ${showSoldOut ? 'opacity-70 grayscale pointer-events-none' : ''}`}>
            <div className="relative aspect-[16/11] overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                />

                {/* Sold Out Badge */}
                {showSoldOut && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                        <div className="bg-red-500 text-white font-black px-8 py-3 rounded-full text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-red-400/50">
                            Sold Out
                        </div>
                    </div>
                )}

                <div className="absolute top-6 left-6 glass px-6 py-2 rounded-2xl text-sm font-black text-white shadow-2xl border-white/10">
                    ₹{course.price.toLocaleString('en-IN')}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-page/80 to-transparent opacity-60" />
            </div>

            <div className="p-8 flex flex-col items-center text-center flex-grow relative z-10">
                <div className="mb-6">
                    <StarRating rating={course.rating || 4.9} />
                </div>
                <h3 className="text-xl md:text-2xl lg:text-2xl font-black mb-4 text-text-primary group-hover:text-accent transition-colors leading-[1.1] tracking-tight uppercase break-words hyphens-auto">
                    {course.title}
                </h3>
                <p className="text-text-secondary text-base mb-10 line-clamp-3 leading-relaxed font-medium opacity-80">
                    {course.description}
                </p>

                <div className="mt-auto w-full grid grid-cols-2 gap-4 relative z-20">
                    <Link
                        to={showSoldOut ? '#' : `/course/${course._id}`}
                        className={`flex items-center justify-center w-full font-black py-4 rounded-xl transition-all border border-white/10 text-white text-xs uppercase tracking-widest hover:bg-white/5 ${showSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {showSoldOut ? 'Waitlisted' : 'Details'}
                    </Link>
                    <button
                        onClick={() => !showSoldOut && addToCart(course)}
                        disabled={showSoldOut}
                        className={`flex items-center justify-center w-full font-black py-4 rounded-xl transition-all btn-glow shadow-xl group/btn overflow-hidden relative text-xs uppercase tracking-widest ${showSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'}`}
                    >
                        <span className="relative z-10">Add Cart</span>
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
