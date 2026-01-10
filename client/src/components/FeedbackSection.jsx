import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackSection = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // UI only - do not persist
        setSubmitted(true);
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-8 pt-8 border-t border-white/10">
            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.div
                        key="feedback-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 blur-3xl pointer-events-none" />

                        <h2 className="text-3xl font-black text-white text-center mb-10 tracking-tighter uppercase italic">
                            Rate Your Experience
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Star Rating */}
                            <div className="flex flex-col items-center space-y-4">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-60">
                                    Quality of Service
                                </label>
                                <div className="flex space-x-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            className="focus:outline-none transition-transform active:scale-95"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-all duration-300 ${(hover || rating) >= star
                                                    ? 'fill-accent text-accent'
                                                    : 'text-white/10'
                                                    } ${(hover === star || rating === star) ? 'scale-125' : 'scale-100'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment Area */}
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] pl-2 opacity-60">
                                    <MessageSquare size={14} />
                                    <span>Share your experience (optional)</span>
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you liked or what we can improve..."
                                    className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-5 focus:bg-white/10 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all font-medium text-text-primary placeholder:text-white/10 min-h-[120px] resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={rating === 0}
                                className={`w-full py-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all transform flex items-center justify-center space-x-4 shadow-2xl ${rating > 0
                                    ? 'bg-accent text-white hover:bg-accent-hover hover:scale-[1.02] active:scale-95 btn-glow'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                    }`}
                            >
                                <Send size={20} />
                                <span>Submit Feedback</span>
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success-message"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-accent/10 border border-accent/20 rounded-[2.5rem] p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star className="text-accent fill-accent" size={32} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">
                            Thank you for your feedback!
                        </h3>
                        <p className="text-text-secondary font-medium">
                            Your input helps us maintain our elite standards.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeedbackSection;
