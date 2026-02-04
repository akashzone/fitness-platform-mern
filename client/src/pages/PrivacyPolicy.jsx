import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, Eye, ShieldAlert, FileText, Database, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-8 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8 bg-bg-page relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center space-x-2 text-text-secondary hover:text-white transition-colors mb-8 group">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="inline-flex items-center space-x-2 w-fit px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                            <ShieldCheck size={16} className="text-accent" />
                            <span className="text-accent text-xs font-black uppercase tracking-widest">Privacy First</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                            Privacy <span className="text-accent">Policy</span>
                        </h1>
                        <p className="text-text-secondary text-lg max-w-2xl">
                            Your privacy is our priority. This policy outlines how we handle your data and ensure your information remains secure.
                        </p>
                    </motion.div>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                >
                    <Section icon={<Database size={20} className="text-accent" />} title="1. Information We Collect">
                        <p>
                            We collect information that you provide directly to us when you:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-text-secondary opacity-80">
                            <li>Purchase a fitness program (Name, Email, Phone Number).</li>
                            <li>Use our Calorie/Bulk & Cut calculators (Age, Weight, Height, Activity Level).</li>
                            <li>Contact us for support or feedback.</li>
                        </ul>
                    </Section>

                    <Section icon={<Eye size={20} className="text-accent" />} title="2. How We Use Your Data">
                        <p>
                            The information we collect is used to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-text-secondary opacity-80">
                            <li>Process your orders and provide access to programs.</li>
                            <li>Personalize your fitness and nutrition recommendations.</li>
                            <li>Send important updates regarding your purchases.</li>
                            <li>Improve our website functionality and user experience.</li>
                        </ul>
                    </Section>

                    <Section icon={<Lock size={20} className="text-accent" />} title="3. Data Security">
                        <p>
                            We implement industry-standard security measures to protect your personal information. Your payment data is handled securely by our payment partner, Cashfree, and is never stored on our servers.
                        </p>
                    </Section>

                    <Section icon={<Share2 size={20} className="text-accent" />} title="4. Third-Party Services">
                        <p>
                            We may share your data with trusted third-party service providers who assist us in operating our website and processing payments, such as:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-text-secondary opacity-80">
                            <li><strong>Cashfree:</strong> For secure payment processing.</li>
                            <li><strong>Google Analytics:</strong> To understand how visitors interact with our site.</li>
                        </ul>
                    </Section>

                    <Section icon={<ShieldAlert size={20} className="text-accent" />} title="5. Your Rights">
                        <p>
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-text-secondary opacity-80">
                            <li>Access the personal information we hold about you.</li>
                            <li>Request the correction or deletion of your data.</li>
                            <li>Opt-out of any marketing communications.</li>
                        </ul>
                    </Section>

                    <Section icon={<FileText size={20} className="text-accent" />} title="6. Contact Information">
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:fitwithpravinn@gmail.com" className="text-accent hover:underline">fitwithpravinn@gmail.com</a>
                        </p>
                    </Section>

                    <div className="pt-8 border-t border-white/5 text-center text-text-secondary text-sm">
                        Last updated: {new Date().getFullYear()}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const Section = ({ title, icon, children }) => (
    <div className="bg-surface border border-white/5 rounded-2xl p-6 md:p-8 hover:bg-white/5 transition-colors duration-300">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            {icon}
            {title}
        </h3>
        <div className="text-text-secondary leading-relaxed space-y-4 font-medium">
            {children}
        </div>
    </div>
);

export default PrivacyPolicy;
