import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Reveal from './motion/Reveal';

const faqs = [
    {
        question: "Is this beginner friendly?",
        answer: "Absolutely. Whether you've never stepped into a gym or are returning after a long break, our programs—especially the Foundation Plan—are designed to build your basics from scratch."
    },
    {
        question: "Veg / non-veg diet available?",
        answer: "Yes, we provide fully customized nutrition plans based on your dietary preferences, including vegetarian, non-vegetarian, and egg-based options."
    },
    {
        question: "How fast can I see results?",
        answer: "While results vary by individual, most clients see noticeable changes in energy and strength within 2-3 weeks, with visible body transformation appearing around the 4-6 week mark."
    },
    {
        question: "One-time or monthly payment?",
        answer: "We offer both. The Foundation Plan is a one-time payment, while our coaching programs (Guided, Structured, Elite) have monthly and multi-month options."
    },
    {
        question: "Is there a refund?",
        answer: "Due to the digital nature of our plans and the time invested in customization, we do not offer refunds. However, we are committed to your success and will work with you to ensure you're satisfied with your plan."
    },
    {
        question: "What’s the difference between Guided and Elite?",
        answer: "Guided focuses on weekly accountability with monthly calls, while Elite provides maximum personal involvement with weekly calls, faster text support, and higher accountability."
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-20 md:py-40 bg-bg-page relative overflow-hidden text-left">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16 md:mb-24">
                    <span className="text-accent font-black uppercase tracking-[0.4em] text-sm md:text-base">Support</span>
                    <h2 className="text-3xl md:text-8xl font-black mt-6 mb-8 text-text-primary tracking-tighter uppercase leading-[0.9]">Common <span className="text-accent italic">Questions</span></h2>
                </Reveal>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Reveal key={index} delay={index * 0.1} y={20} width="100%">
                            <div className={`glass border rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 ${openIndex === index ? 'border-accent/30 bg-white/[0.04]' : 'border-white/5 hover:border-white/10'}`}>
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-sm md:text-xl font-black uppercase tracking-tight transition-colors duration-500 ${openIndex === index ? 'text-accent' : 'text-white/80 group-hover:text-white'}`}>
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        className={`transition-colors duration-500 ${openIndex === index ? 'text-accent' : 'text-white/20'}`}
                                    >
                                        <ChevronDown size={24} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 md:px-8 md:pb-8 text-sm md:text-lg text-text-secondary leading-relaxed font-medium opacity-80 border-t border-white/5 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
