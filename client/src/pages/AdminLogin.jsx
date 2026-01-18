import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Reveal from '../components/motion/Reveal';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/admin/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <Reveal>
                    <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-8 text-center italic">
                        Admin <span className="text-accent">Portal</span>
                    </h2>
                </Reveal>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2 px-1">Username / Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-all font-medium"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2 px-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-all font-medium"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center px-1">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40">
                    Proprietary Access Only
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
