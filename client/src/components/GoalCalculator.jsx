import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Info, CheckCircle2, AlertCircle, RotateCcw, ChevronRight } from 'lucide-react';
import Reveal from './motion/Reveal';

const GoalCalculator = () => {
    const [mode, setMode] = useState(null); // 'bulk' or 'cut'
    const [maintenance, setMaintenance] = useState('');
    const [weeklyTarget, setWeeklyTarget] = useState('0.5'); // Default to 0.5kg
    const [result, setResult] = useState(null);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        const savedMaintenance = localStorage.getItem('maintenanceCalories');
        if (savedMaintenance) {
            setMaintenance(savedMaintenance);
        }
    }, []);

    const calculateResult = () => {
        const maintValue = parseFloat(maintenance);
        const weeklyChange = parseFloat(weeklyTarget);

        if (isNaN(maintValue) || maintValue <= 0) {
            setWarning('Please enter a valid maintenance calorie value.');
            return;
        }

        // Validation Rules: >= 1200 (female/general safety), >= 1500 (male)
        // Since we don't know gender here unless we store it, we'll use a general warning
        if (maintValue < 1200) {
            setWarning('Maintenance calories seem very low. Please double-check.');
        } else {
            setWarning('');
        }

        // 1 kg per week change ≈ 1000 kcal per day (Matches Calculator.net standards)
        const dailyDelta = weeklyChange * 1000;

        let targetCalories;
        if (mode === 'bulk') {
            targetCalories = maintValue + dailyDelta;
        } else {
            targetCalories = maintValue - dailyDelta;
        }

        const calories = Math.round(targetCalories);

        // Macro Calculation (50% Carbs, 30% Protein, 20% Fats)
        const carbsKcal = calories * 0.50;
        const proteinKcal = calories * 0.30;
        const fatKcal = calories * 0.20;

        setResult({
            maintenance: Math.round(maintValue),
            target: calories,
            delta: Math.round(dailyDelta),
            weeklyChange: weeklyChange,
            macros: {
                carbs: { kcal: Math.round(carbsKcal), grams: Math.round(carbsKcal / 4) },
                protein: { kcal: Math.round(proteinKcal), grams: Math.round(proteinKcal / 4) },
                fats: { kcal: Math.round(fatKcal), grams: Math.round(fatKcal / 9) }
            }
        });
    };

    const reset = () => {
        setResult(null);
        setWeeklyTarget('0.5');
        // We keep maintenance calories if they were pre-filled or edited
    };

    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
        setResult(null);
        setWarning('');
    };

    const bulkTips = [
        "Track weekly average weight to monitor progress.",
        "If weight doesn't increase in 2 weeks → add +150 kcal.",
        "Focus on strength training & high protein intake (1.6g-2.2g per kg bodyweight)."
    ];

    const cutTips = [
        "Aim for 8k–10k steps daily to maintain non-exercise activity.",
        "Keep protein high to preserve muscle mass while losing fat.",
        "If fat loss stalls for 2+ weeks → reduce daily intake by 100–150 kcal."
    ];

    const targets = [
        { label: '0.25 kg / week', value: '0.25' },
        { label: '0.5 kg / week', value: '0.5' },
        { label: '1.0 kg / week', value: '1.0' }
    ];

    return (
        <section id="goal-calculator" className="py-20 bg-bg-page relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="text-center mb-12">
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Transform Your Body</span>
                        <h2 className="text-4xl md:text-6xl font-black mt-4 text-text-primary tracking-tighter uppercase italic">
                            What is your <span className="text-accent">goal?</span>
                        </h2>
                    </div>
                </Reveal>

                {!mode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleModeSelect('bulk')}
                            className="relative group p-8 rounded-3xl bg-surface border border-white/5 hover:border-accent/30 transition-all overflow-hidden text-left"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={120} className="text-accent" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter italic">Bulk</h3>
                                <p className="text-text-secondary font-medium leading-relaxed">Build muscle mass and increase strength with a controlled calorie surplus.</p>
                                <div className="mt-8 flex items-center text-accent font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                                    Start Bulk Calculation <ChevronRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleModeSelect('cut')}
                            className="relative group p-8 rounded-3xl bg-surface border border-white/5 hover:border-red-500/30 transition-all overflow-hidden text-left"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingDown size={120} className="text-red-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform">
                                    <TrendingDown size={32} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter italic">Fat Loss</h3>
                                <p className="text-text-secondary font-medium leading-relaxed">Reduce body fat while preserving muscle mass through a calorie deficit.</p>
                                <div className="mt-8 flex items-center text-red-500 font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                                    Start Cut Calculation <ChevronRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.button>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-3xl p-6 md:p-10 border border-white/10 relative"
                        >
                            <button
                                onClick={() => setMode(null)}
                                className="absolute top-6 right-6 text-text-secondary hover:text-white transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>

                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Left Side: Inputs */}
                                <div className="flex-1 space-y-8">
                                    <div>
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${mode === 'bulk' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'}`}>
                                            {mode === 'bulk' ? 'Bulking Mode' : 'Fat Loss Mode'}
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">
                                            Calculator Settings
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-text-secondary mb-3 ml-1">Maintenance Calories (kcal/day)</label>
                                            <input
                                                type="number"
                                                value={maintenance}
                                                onChange={(e) => setMaintenance(e.target.value)}
                                                placeholder="e.g. 2500"
                                                className="w-full bg-surface border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none transition-all font-bold text-lg"
                                            />
                                            {warning && (
                                                <div className="flex items-center gap-2 mt-3 text-red-400 text-xs font-bold px-1 animate-pulse">
                                                    <AlertCircle size={14} />
                                                    <span>{warning}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-text-secondary mb-3 ml-1">Weekly {mode === 'bulk' ? 'Gain' : 'Loss'} Target</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {targets.map((target) => (
                                                    <button
                                                        key={target.value}
                                                        onClick={() => setWeeklyTarget(target.value)}
                                                        className={`py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${weeklyTarget === target.value
                                                            ? (mode === 'bulk' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20')
                                                            : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'
                                                            }`}
                                                    >
                                                        {target.label.replace(' / week', '')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={calculateResult}
                                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-95 ${mode === 'bulk'
                                                ? 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20'
                                                : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                                                }`}
                                        >
                                            Calculate Results
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Results */}
                                <div className="flex-1">
                                    <AnimatePresence mode="wait">
                                        {result ? (
                                            <motion.div
                                                key="result"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="h-full flex flex-col"
                                            >
                                                <div className={`p-8 rounded-[2.5rem] border ${mode === 'bulk' ? 'bg-accent/5 border-accent/20' : 'bg-red-500/5 border-red-500/20'} flex-1 flex flex-col justify-center text-center relative overflow-hidden`}>
                                                    <div className="relative z-10">
                                                        <span className="text-text-secondary text-xs font-black uppercase tracking-widest block mb-1">Your Maintenance</span>
                                                        <div className="text-xl font-bold text-white mb-6 italic">{result.maintenance} <span className="text-[10px] uppercase not-italic opacity-50">kcal/day</span></div>

                                                        <div className={`w-20 h-px mx-auto mb-8 ${mode === 'bulk' ? 'bg-accent/20' : 'bg-red-500/20'}`} />

                                                        <span className={`text-xs font-black uppercase tracking-[0.2em] block mb-2 ${mode === 'bulk' ? 'text-accent' : 'text-red-500'}`}>
                                                            To {mode === 'bulk' ? 'gain' : 'lose'} {result.weeklyChange} kg/week:
                                                        </span>
                                                        <div className={`text-6xl md:text-7xl font-black italic tracking-tighter ${mode === 'bulk' ? 'text-accent' : 'text-red-500'} text-glow mb-4`}>
                                                            {result.target}
                                                        </div>
                                                        <span className="text-text-secondary text-xs font-black uppercase tracking-widest">Calories Per Day</span>
                                                    </div>

                                                    {/* Goal visualization */}
                                                    <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">
                                                        <div className="flex items-center gap-1">
                                                            <div className={`w-2 h-2 rounded-full ${mode === 'bulk' ? 'bg-accent' : 'bg-red-500'}`} />
                                                            {mode === 'bulk' ? 'Surplus' : 'Deficit'}: {mode === 'bulk' ? '+' : '-'}{result.delta} kcal
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Daily Macro Targets Card */}
                                                <div className="mt-4 p-6 rounded-[2rem] bg-surface border border-white/5 space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">Daily Macro Targets</h4>
                                                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">50/30/20 Split</div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3">
                                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                                                                <div>
                                                                    <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Carbohydrates (50%)</div>
                                                                    <div className="text-xs font-bold text-white/50">{result.macros.carbs.kcal} kcal</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xl font-black text-orange-500 italic">{result.macros.carbs.grams}g</div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-8 bg-accent rounded-full" />
                                                                <div>
                                                                    <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Protein (30%)</div>
                                                                    <div className="text-xs font-bold text-white/50">{result.macros.protein.kcal} kcal</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xl font-black text-accent italic">{result.macros.protein.grams}g</div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-8 bg-white/20 rounded-full" />
                                                                <div>
                                                                    <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Fats (20%)</div>
                                                                    <div className="text-xs font-bold text-white/50">{result.macros.fats.kcal} kcal</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xl font-black text-white/80 italic">{result.macros.fats.grams}g</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] text-text-secondary/60 text-center uppercase tracking-widest font-bold">
                                                        *Macros are calculated from your total daily calorie target.
                                                    </p>
                                                </div>

                                                <div className="mt-6 grid grid-cols-1 gap-3">
                                                    {(mode === 'bulk' ? bulkTips : cutTips).map((tip, i) => (
                                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                                                            <div className={`mt-0.5 ${mode === 'bulk' ? 'text-accent' : 'text-red-500'}`}>
                                                                <CheckCircle2 size={16} />
                                                            </div>
                                                            <p className="text-xs text-text-secondary leading-relaxed font-medium">{tip}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-white/20">
                                                    <Target size={32} />
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-2 italic">Ready to Calculate?</h4>
                                                <p className="text-text-secondary text-xs leading-relaxed max-w-[200px] mx-auto">
                                                    Enter your maintenance calories and select a target to see your personalized results.
                                                </p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <p className="mt-10 pt-8 border-t border-white/5 text-[10px] text-center text-text-secondary/60 leading-relaxed italic max-w-2xl mx-auto uppercase tracking-widest">
                                Disclaimer: These calculations are estimates. Actual results may vary based on metabolism, training intensity, and consistency.
                            </p>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GoalCalculator;
