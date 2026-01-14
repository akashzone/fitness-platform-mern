import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Loader2, Package, Calendar, Phone, Mail, User, IndianRupee, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/motion/Reveal';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState(null);
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchDashboardData = async (period) => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        setLoading(true);
        try {
            const [ordersRes, analyticsRes] = await Promise.all([
                api.get(`/admin/orders?period=${period}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get(`/admin/analytics?period=${period}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setOrders(ordersRes.data.orders);
            setSummary(analyticsRes.data.summary);
            setError('');
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
            setError('Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData(filterPeriod);
    }, [navigate, filterPeriod]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handlePeriodChange = (e) => {
        setFilterPeriod(e.target.value);
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filterOptions = [
        { label: 'All Time', value: 'all' },
        { label: 'Last 24 Hours', value: '1' },
        { label: 'Last 15 Days', value: '15' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 45 Days', value: '45' }
    ];

    const currentFilterLabel = filterOptions.find(opt => opt.value === filterPeriod)?.label;

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-page pt-8 pb-12 lg:py-24 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-16">
                    <Reveal>
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-5xl font-black text-text-primary uppercase tracking-tighter italic text-glow-subtle">
                                Order <span className="text-accent">Control</span>
                            </h1>
                            <p className="text-text-secondary text-sm font-black uppercase tracking-[0.3em] opacity-60">
                                Management & Fulfillment Dashboard
                            </p>
                        </div>
                    </Reveal>

                    <div className="flex flex-wrap items-center gap-4 relative">
                        {/* Custom Dropdown */}
                        <div className="relative z-[60]">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest focus:outline-none hover:border-accent/50 transition-all cursor-pointer flex items-center space-x-3 group"
                            >
                                <span>{currentFilterLabel}</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                                    >
                                        {filterOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setFilterPeriod(option.value);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${filterPeriod === option.value ? 'text-accent bg-accent/5' : 'text-text-secondary'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] border border-white/10 transition-all shadow-xl"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {summary && (
                    <Reveal>
                        <div className="glass-card mb-6 md:mb-12 rounded-xl md:rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
                                {/* Total Orders */}
                                <div className="p-3 md:p-8 space-y-1 md:space-y-3">
                                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Orders</p>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-1.5 md:p-2.5 bg-accent/10 rounded-lg">
                                            <Package size={18} className="text-accent" />
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-black text-white italic">{summary.totalOrders}</h3>
                                    </div>
                                </div>

                                {/* Total Revenue */}
                                <div className="p-3 md:p-8 space-y-1 md:space-y-3">
                                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Revenue</p>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-1.5 md:p-2.5 bg-accent text-white rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                            <IndianRupee size={18} />
                                        </div>
                                        <h3 className="text-lg md:text-3xl font-black text-accent italic tracking-tighter">
                                            {summary.totalRevenue.toLocaleString('en-IN')}
                                        </h3>
                                    </div>
                                </div>

                                {/* Course Sales */}
                                <div className="p-3 md:p-8 space-y-1 md:space-y-3">
                                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Course Sales</p>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-1.5 md:p-2.5 bg-white/5 rounded-lg border border-white/5">
                                            <User size={18} className="text-white/40" />
                                        </div>
                                        <h3 className="text-lg md:text-3xl font-black text-white italic tracking-tighter">
                                            {summary.courseRevenue.toLocaleString('en-IN')}
                                        </h3>
                                    </div>
                                </div>

                                {/* Ebook Sales */}
                                <div className="p-3 md:p-8 space-y-1 md:space-y-3">
                                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Ebook Sales</p>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-1.5 md:p-2.5 bg-white/5 rounded-lg border border-white/5">
                                            <Package size={18} className="text-white/40" />
                                        </div>
                                        <h3 className="text-lg md:text-3xl font-black text-white italic tracking-tighter">
                                            {summary.ebookRevenue.toLocaleString('en-IN')}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl mb-12 font-black uppercase text-xs tracking-widest">
                        {error}
                    </div>
                )}

                <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Purchase Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Amount</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-8">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <User size={14} className="text-accent opacity-50" />
                                                    <span className="text-sm font-black text-text-primary uppercase tracking-tight">{order.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Mail size={14} className="text-accent opacity-50" />
                                                    <span className="text-[11px] font-medium text-text-secondary">{order.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Phone size={14} className="text-accent opacity-50" />
                                                    <span className="text-[11px] font-medium text-text-secondary">{order.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-2">
                                                {order.products.map((p, idx) => (
                                                    <div key={idx} className="flex items-center space-x-3">
                                                        <Package size={14} className="text-accent opacity-50" />
                                                        <span className="text-xs font-bold text-text-primary tracking-tight">
                                                            {p.title}
                                                            <span className="ml-2 text-[10px] py-0.5 px-2 bg-accent/10 text-accent rounded-full uppercase font-black tracking-widest">
                                                                {p.type}
                                                            </span>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center space-x-1 text-accent font-black">
                                                <IndianRupee size={14} />
                                                <span className="text-lg tracking-tighter">
                                                    {order.totalAmount.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="inline-flex items-center px-3 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-lg border border-accent/20 uppercase tracking-[0.1em]">
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center space-x-3 text-text-secondary">
                                                <Calendar size={14} className="opacity-50" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center space-y-4 opacity-30">
                                                <Package size={48} className="text-text-secondary" />
                                                <p className="text-sm font-black uppercase tracking-[0.4em]">No Orders Captured</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
