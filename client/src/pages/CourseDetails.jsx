import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    CheckCircle,
    ArrowLeft,
    Play,
    Zap,
    Loader2,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedProduct, setRecommendedProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, allProductsRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get('/products')
                ]);

                const currentProduct = productRes.data;
                const allProducts = allProductsRes.data.products.filter(
                    p => p._id !== id
                );

                setCourse(currentProduct);

                const targetType =
                    currentProduct.type === 'course' ? 'ebook' : 'course';

                const pool =
                    allProducts.filter(p => p.type === targetType).length > 0
                        ? allProducts.filter(p => p.type === targetType)
                        : allProducts;

                if (pool.length > 0) {
                    setRecommendedProduct(
                        pool[Math.floor(Math.random() * pool.length)]
                    );
                }
            } catch (err) {
                console.error(err);
                setError('Product not found or connection error.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-black text-white uppercase mb-4">
                    Product Not Found
                </h2>
                <button
                    onClick={() => navigate('/programs')}
                    className="text-accent underline font-bold uppercase tracking-widest"
                >
                    Back to Programs
                </button>
            </div>
        );
    }

    return (
        <div className="py-12 lg:py-24 bg-bg-page min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-text-secondary hover:text-accent mb-16 font-black uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={18} />
                    Back to Programs
                </button>

                {/* ================= MOBILE ================= */}
                <div className="lg:hidden space-y-6">
                    <Reveal>
                        <h1 className="text-2xl font-black uppercase">
                            {course.title}
                        </h1>
                        <StarRating rating={course.rating || 4.9} size={12} />
                    </Reveal>

                    <div className="relative aspect-video rounded-xl overflow-hidden">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play size={24} fill="white" />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-xl font-black">
                            ₹{course.price.toLocaleString('en-IN')}
                        </div>
                        <button
                            disabled={course.slotInfo?.isSoldOut}
                            onClick={() =>
                                navigate(`/checkout/${course._id}`)
                            }
                            className={`px-6 py-3 rounded-full font-black text-xs uppercase ${course.slotInfo?.isSoldOut
                                ? 'bg-white/10 text-white/40'
                                : 'bg-accent text-white'
                                }`}
                        >
                            {course.slotInfo?.isSoldOut
                                ? 'Sold Out'
                                : 'Secure My Spot'}
                        </button>
                    </div>

                    {/* Cross Sell */}
                    {recommendedProduct && (
                        <div className="mt-6">
                            <h3 className="text-xs font-black uppercase mb-3">
                                Similar Product
                            </h3>
                            <div
                                onClick={() =>
                                    navigate(
                                        `/course/${recommendedProduct._id}`
                                    )
                                }
                                className="bg-white/5 p-4 rounded-xl cursor-pointer"
                            >
                                <h4 className="font-black text-sm mb-2">
                                    {recommendedProduct.title}
                                </h4>
                                <div className="flex gap-4">
                                    <img
                                        src={recommendedProduct.image}
                                        className="w-16 h-20 object-cover rounded-lg"
                                        alt=""
                                    />
                                    <div className="flex-1 text-xs flex flex-col justify-between">
                                        <div>
                                            <p className="opacity-70 mb-2 line-clamp-2">
                                                {recommendedProduct.description ||
                                                    'Perfect add-on'}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="font-black text-accent text-sm">
                                                ₹{recommendedProduct.price}
                                            </span>
                                            <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/5">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 p-4 rounded-xl">
                        <h3 className="text-xs font-black uppercase mb-2">
                            Executive Summary
                        </h3>
                        <p className="text-xs opacity-80">
                            {course.fullDescription}
                        </p>
                    </div>
                </div>

                {/* ================= DESKTOP ================= */}
                <div className="hidden lg:grid grid-cols-3 gap-20 mt-20">
                    {/* LEFT */}
                    <div className="col-span-2 space-y-16">
                        <Reveal>
                            <h1 className="text-6xl font-black uppercase">
                                {course.title}
                            </h1>
                        </Reveal>

                        <div className="relative aspect-video rounded-3xl overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <Reveal>
                            <h3 className="text-3xl font-black uppercase">
                                Executive Summary
                            </h3>
                            <p className="text-xl opacity-80 mt-4">
                                {course.fullDescription}
                            </p>
                        </Reveal>

                        {course.features && (
                            <div className="space-y-6">
                                {course.features.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-4"
                                    >
                                        <CheckCircle
                                            size={20}
                                            className="text-accent"
                                        />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="sticky top-32 glass-card p-10 rounded-3xl">
                        <div className="text-center mb-10">
                            <div className="text-6xl font-black">
                                ₹{course.price.toLocaleString('en-IN')}
                            </div>
                        </div>

                        <button
                            disabled={course.slotInfo?.isSoldOut}
                            onClick={() =>
                                navigate(`/checkout/${course._id}`)
                            }
                            className={`w-full py-5 rounded-2xl font-black uppercase ${course.slotInfo?.isSoldOut
                                ? 'bg-white/10 text-white/40'
                                : 'bg-accent text-white'
                                }`}
                        >
                            {course.slotInfo?.isSoldOut
                                ? 'Sold Out'
                                : 'Secure My Spot'}
                        </button>

                        <button
                            onClick={() => addToCart(course)}
                            className="w-full mt-4 py-4 rounded-2xl border border-white/10 uppercase font-black flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={18} />
                            Add to Cart
                        </button>

                        {course.features && (
                            <ul className="mt-10 space-y-4">
                                {course.features.map((f, i) => (
                                    <li key={i} className="flex gap-3">
                                        <Zap size={14} className="text-accent" />
                                        <span className="text-sm">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
