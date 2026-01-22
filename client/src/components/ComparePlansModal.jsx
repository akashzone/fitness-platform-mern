import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';

const features = [
    "Custom Diet Plan",
    "Workout Plan",
    "Weekly Check-ins",
    "Monthly Sessions",
    "Text Support",
    "1:1 Support",
    "One-time Payment"
];

const planComparison = {
    "FOUNDATION PLAN": [true, true, false, false, "8 hrs", false, true],
    "GUIDED TRANSFORMATION": [true, true, true, "1 / mo", "8 hrs", false, false],
    "STRUCTURED COACHING": [true, true, true, "2 / mo", "12 hrs", true, false],
    "ELITE 1:1 COACHING": [true, true, true, "Weekly", "24 hrs", true, false]
};

const ComparePlansModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-surface border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 md:p-12 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6 md:mb-12">
                                <h2 className="text-xl md:text-4xl font-black text-white uppercase tracking-tighter">Compare <span className="text-accent italic">Plans</span></h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 md:p-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all border border-white/10 text-white"
                                >
                                    <X size={20} className="md:w-6 md:h-6" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                                <table className="w-full min-w-[700px] border-collapse table-fixed">
                                    <thead>
                                        <tr>
                                            <th className="w-1/3 text-left py-3 px-2 text-[8px] md:text-xs font-black text-text-secondary uppercase tracking-widest border-b border-white/5">Features</th>
                                            {Object.keys(planComparison).map((plan) => (
                                                <th key={plan} className="text-center py-3 px-2 text-[8px] md:text-xs font-black text-white uppercase tracking-tighter md:tracking-widest border-b border-white/5">
                                                    {plan}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {features.map((feature, fIdx) => (
                                            <tr key={feature} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 md:py-6 px-2 text-[10px] md:text-sm font-bold text-text-secondary border-b border-white/5 break-words">
                                                    {feature}
                                                </td>
                                                {Object.keys(planComparison).map((plan) => {
                                                    const val = planComparison[plan][fIdx];
                                                    return (
                                                        <td key={plan} className="py-3 md:py-6 px-2 text-center border-b border-white/5">
                                                            {typeof val === 'boolean' ? (
                                                                val ? (
                                                                    <Check className="mx-auto text-accent" size={14} />
                                                                ) : (
                                                                    <Minus className="mx-auto text-white/20" size={14} />
                                                                )
                                                            ) : (
                                                                <span className="text-[8px] md:text-xs font-black text-white uppercase">{val}</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 md:mt-12 flex justify-center pb-2">
                                <button
                                    onClick={onClose}
                                    className="w-full md:w-auto px-10 py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all btn-glow shadow-xl"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComparePlansModal;
