import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
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
                            <Scale size={16} className="text-accent" />
                            <span className="text-accent text-xs font-black uppercase tracking-widest">Legal</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                            Terms & <span className="text-accent">Conditions</span>
                        </h1>
                        <p className="text-text-secondary text-lg max-w-2xl">
                            Please read these terms carefully before using our services. By using FitWithPravinn, you agree to be bound by these conditions.
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
                    <Section title="1. Acceptance of Terms">
                        <p>
                            By accessing and using this website and purchasing our fitness programs, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not accept these terms, please do not use our services.
                        </p>
                    </Section>

                    <Section title="2. Medical Disclaimer">
                        <p>
                            FitWithPravinn provides fitness and nutrition information for educational purposes only. You should consult your physician or other health care professional before starting this or any other fitness program to determine if it is right for your needs. Do not disregard, avoid or delay obtaining medical or health related advice from your health-care professional because of something you may have read on this site.
                        </p>
                    </Section>

                    <Section title="3. Purchase & Refund Policy">
                        <p>
                            All purchases of digital products (training programs, diet plans, eBooks) are final. Due to the nature of digital content, we generally do not offer refunds once the content has been accessed or downloaded. Exceptions may be made in extenuating circumstances at our sole discretion.
                        </p>
                    </Section>

                    <Section title="4. Intellectual Property">
                        <p>
                            All content included on this site, such as text, graphics, logos, images, and software, is the property of FitWithPravinn or its content suppliers and protected by international copyright laws. You may not reproduce, modify, distribute, or republish materials contained on this site without our prior written permission.
                        </p>
                    </Section>

                    <Section title="5. User Conduct">
                        <p>
                            You agree specifically not to access specific secured pages without authorization or to disable, damage, or interfere with the proper functioning of the website or our services. You agree not to attempt to reverse engineer any of the code used on the website.
                        </p>
                    </Section>

                    <Section title="6. Contact Information">
                        <p>
                            If you have any questions about these Terms, please contact us at: <a href="mailto:fitwithpravinn@gmail.com" className="text-accent hover:underline">fitwithpravinn@gmail.com</a>
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

const Section = ({ title, children }) => (
    <div className="bg-surface border border-white/5 rounded-2xl p-6 md:p-8 hover:bg-white/5 transition-colors duration-300">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FileText size={20} className="text-accent" />
            {title}
        </h3>
        <div className="text-text-secondary leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

export default TermsAndConditions;
