import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronRight, Activity, Zap, Flame, Info, RotateCcw, TrendingDown, Target, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalorieCalculator = () => {
    const [formData, setFormData] = useState({
        gender: 'male',
        age: '',
        weight: '',
        height: '',
        activityLevel: 'moderate'
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activityMultipliersArray = [
        { value: 'sedentary', label: 'Sedentary (Little or no exercise)' },
        { value: 'light', label: 'Light (Exercise 1-3 times/week)' },
        { value: 'moderate', label: 'Moderate (Exercise 4-5 times/week)' },
        { value: 'active', label: 'Active (Daily exercise or intense 3-4x/week)' },
        { value: 'very_active', label: 'Very Active (Intense exercise 6 times/week)' },
        { value: 'extra_active', label: 'Extra Active (Very intense daily/Physical job)' }
    ];

    // Standard Mifflin-St Jeor Activity Multipliers
    // Aligned with Calculator.net
    const activityMultipliers = {
        sedentary: 1.2,      // Little or no exercise
        light: 1.375,        // Exercise 1-3 times/week
        moderate: 1.55,      // Exercise 4-5 times/week
        active: 1.55,        // Daily exercise or intense exercise 3-4 times/week (Often grouped with moderate or high) - adjusting to 1.55 or 1.725 depending on interpretation. 
        // Calculator.net usually has: Moderate (1.465?), Active (1.55?), Very Active (1.725)
        // Let's stick to the standard 5-tier for clarity:
        // Sedentary: 1.2
        // Light: 1.375
        // Moderate: 1.55
        // Very Active: 1.725
        // Extra Active: 1.9
        very_active: 1.725,  // Intense exercise 6-7 times/week
        extra_active: 1.9    // Very intense exercise daily, or physical job
    };

    // To handle the specific user request: "6 times a week" for Very Active
    // And aligning values.

    // Revised Multipliers used in calculation
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.465, // Calculator.net moderate
        active: 1.55,    // Calculator.net active
        very_active: 1.725,
        extra_active: 1.9
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const calculateCalories = () => {
        const { gender, age, weight, height, activityLevel } = formData;

        if (!age || !weight || !height) {
            setError('Please fill in all fields');
            return;
        }

        const ageNum = parseInt(age);
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);

        if (ageNum < 10 || ageNum > 100) {
            setError('Age must be between 10 and 100 years');
            return;
        }

        if (weightNum < 20 || weightNum > 300) {
            setError('Weight must be between 20kg and 300kg');
            return;
        }

        if (heightNum < 50 || heightNum > 300) {
            setError('Height must be between 50cm and 300cm');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
            } else {
                bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
            }

            // Ensure BMR isn't negative
            bmr = Math.max(0, bmr);

            const multiplier = multipliers[activityLevel];
            const tdee = Math.round(bmr * multiplier);

            setResult(tdee);
            setShowResults(true);
            setLoading(false);
        }, 800);
    };

    const isFormValid = formData.age && formData.weight && formData.height;

    const resetCalculator = () => {
        setShowResults(false);
        setResult(null);
    };

    const ResultCard = ({ title, calories, weightChange, percent, color }) => (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${color}`}>{title}</h3>
                <p className="text-xs text-text-secondary">{weightChange}</p>
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-white italic">{calories}</div>
                <div className="text-[10px] text-text-secondary font-bold">{percent}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                layout
                className="max-w-md w-full relative z-10"
            >
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500 relative">
                    <Link to="/" className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <ArrowLeft size={20} />
                    </Link>

                    <AnimatePresence mode="wait">
                        {!showResults ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4 border border-accent/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        <Calculator size={32} />
                                    </div>
                                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
                                        Calorie <span className="text-accent">Calculator</span>
                                    </h1>
                                    <p className="text-text-secondary text-sm">
                                        Calculate your optimal daily calorie intake.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* Gender Selection */}
                                    <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 rounded-xl">
                                        {['male', 'female'].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                                                className={`py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${formData.gender === g
                                                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Input Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                placeholder="years"
                                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Weight</label>
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleInputChange}
                                                    placeholder="kg"
                                                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Height</label>
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={handleInputChange}
                                                    placeholder="cm"
                                                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Activity Level</label>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className={`w-full bg-surface border ${isDropdownOpen ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white flex items-center justify-between outline-none transition-all duration-300 hover:border-white/20`}
                                                >
                                                    <span className="text-sm">
                                                        {activityMultipliersArray.find(opt => opt.value === formData.activityLevel)?.label}
                                                    </span>
                                                    <ChevronRight className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl"
                                                        >
                                                            {activityMultipliersArray.map((option) => (
                                                                <button
                                                                    key={option.value}
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, activityLevel: option.value }));
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 ${formData.activityLevel === option.value
                                                                        ? 'bg-accent/10 text-accent font-bold'
                                                                        : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                                                        }`}
                                                                >
                                                                    {option.label}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs font-bold text-center mt-4">{error}</p>
                                )}

                                <button
                                    onClick={calculateCalories}
                                    disabled={!isFormValid || loading}
                                    className={`w-full py-4 mt-6 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${isFormValid && !loading
                                        ? 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20 hover:shadow-accent/40 transform hover:-translate-y-1 active:scale-95'
                                        : 'bg-white/5 text-text-secondary cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Zap size={20} className="fill-current" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <span>Calculate</span>
                                            <Flame size={18} />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                                        <Target size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                                        Your <span className="text-accent">Results</span>
                                    </h2>
                                    <p className="text-text-secondary text-xs mt-1">
                                        Estimated daily calorie needs
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <ResultCard
                                        title="Maintain Weight"
                                        weightChange="0 kg/week"
                                        calories={result}
                                        percent="100%"
                                        color="text-white"
                                    />
                                    <ResultCard
                                        title="Mild Weight Loss"
                                        weightChange="-0.25 kg/week"
                                        calories={Math.max(0, result - 250)}
                                        percent="90%"
                                        color="text-accent"
                                    />
                                    <ResultCard
                                        title="Weight Loss"
                                        weightChange="-0.5 kg/week"
                                        calories={Math.max(0, result - 500)}
                                        percent="81%"
                                        color="text-yellow-500"
                                    />
                                    <ResultCard
                                        title="Extreme Weight Loss"
                                        weightChange="-1 kg/week"
                                        calories={Math.max(0, result - 1000)}
                                        percent="61%"
                                        color="text-red-500"
                                    />
                                </div>

                                <button
                                    onClick={resetCalculator}
                                    className="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                                >
                                    <RotateCcw size={16} />
                                    <span>Recalculate</span>
                                </button>

                                <div className="text-[10px] text-center text-text-secondary leading-relaxed px-4">
                                    *Estimates based on Mifflin-St Jeor equation. Consult a professional for personalized advice.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default CalorieCalculator;
