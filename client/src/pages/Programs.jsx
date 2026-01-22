import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courses } from '../data/courses';
import api from '../utils/api';
import CourseCard from '../components/CourseCard';
import Reveal from '../components/motion/Reveal';
import CinematicTicker from '../components/motion/CinematicTicker';
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';

const Programs = () => {
    const navigate = useNavigate();
    const [slotInfo, setSlotInfo] = useState(null);
    const [products, setProducts] = useState(courses);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Only fetch slot info from backend
                const response = await api.get('/products');
                if (response.data.slotInfo) setSlotInfo(response.data.slotInfo);
            } catch (err) {
                console.error('Data Load Error:', err);
                // We don't block the UI if slot info fails
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-black text-white uppercase mb-4">{error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-accent text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-accent-hover transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const isSoldOut = slotInfo?.isSoldOut;

    return (
        <div className="bg-bg-page pt-8 pb-10 md:pt-12 md:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-3 text-text-secondary hover:text-accent mb-12 transition-all font-black uppercase tracking-[0.2em] text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                    <span>Back to Home</span>
                </button>

                {/* Cinematic Slot Tracker */}
                {slotInfo && (
                    <CinematicTicker
                        text={`Current Availability: ${slotInfo.slotsLeft} / 20 SLOTS REMAINING — SECURE YOUR ELITE TRAINING SPOT — `}
                        speed={window.innerWidth < 768 ? 12 : 20}
                    />
                )}

                {/* Training Programs - Priority 1 */}
                <div className="mb-12">
                    <Reveal className="mb-12">
                        <div className="flex items-end justify-between border-l-4 border-accent pl-6">
                            <h2 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-wider">
                                Training <span className="text-accent">Programs</span>
                            </h2>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                        {products.map((course, index) => (
                            <Reveal key={course.id} delay={index * 0.1} scale={0.9} y={40} width="100%">
                                <CourseCard course={course} isSoldOut={isSoldOut} slotsLeft={slotInfo?.slotsLeft} hideOriginalPrice={false} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Programs;
