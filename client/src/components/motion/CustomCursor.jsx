import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, useAnimationFrame } from 'framer-motion';

const CustomCursor = ({ enabled = true }) => {
    // Mouse position state (raw)
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth lerp movement config
    const lerpConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, lerpConfig);
    const springY = useSpring(mouseY, lerpConfig);

    // Trail positions (delayed lerp for fluid lag)
    const trail1X = useSpring(mouseX, { damping: 20, stiffness: 100 });
    const trail1Y = useSpring(mouseY, { damping: 20, stiffness: 100 });
    const trail2X = useSpring(mouseX, { damping: 15, stiffness: 60 });
    const trail2Y = useSpring(mouseY, { damping: 15, stiffness: 60 });

    // Component states
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            setIsMobile(isTouch);
        };
        checkMobile();

        if (isMobile || !enabled) {
            document.body.style.cursor = 'auto';
            return;
        }

        const onMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const onMouseDown = (e) => {
            setIsClicked(true);
            const id = Date.now();
            setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== id));
            }, 1000);
        };

        const onMouseUp = () => setIsClicked(false);

        const onMouseOver = (e) => {
            const target = e.target;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer');

            setIsHovered(isInteractive);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseover', onMouseOver);

        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseover', onMouseOver);
            document.body.style.cursor = 'auto';
        };
    }, [isMobile, enabled, mouseX, mouseY, isVisible]);

    if (isMobile || !enabled) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
            <AnimatePresence>
                {/* Click Ripples */}
                {ripples.map(ripple => (
                    <motion.div
                        key={ripple.id}
                        initial={{ width: 0, height: 0, opacity: 0.5, border: '2px solid #00ff88' }}
                        animate={{ width: 150, height: 150, opacity: 0, border: '0px solid #00ff88' }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                        style={{ left: ripple.x, top: ripple.y }}
                    />
                ))}
            </AnimatePresence>

            {/* Motion Trail 2 (Heaviest lag) */}
            <motion.div
                className="absolute w-2 h-2 rounded-full border border-accent/20"
                style={{ x: trail2X, y: trail2Y, translateX: '-50%', translateY: '-50%' }}
            />

            {/* Motion Trail 1 (Medium lag) */}
            <motion.div
                className="absolute w-4 h-4 rounded-full border border-accent/40"
                style={{ x: trail1X, y: trail1Y, translateX: '-50%', translateY: '-50%' }}
            />

            {/* Trailing Glow Layer */}
            <motion.div
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute w-64 h-64 mix-blend-screen"
            >
                <motion.div
                    animate={{
                        scale: isHovered ? 1.5 : 1,
                        opacity: [0.35, 0.45, 0.35],
                    }}
                    transition={{
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 0.3 }
                    }}
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0) 70%)',
                        filter: isHovered ? 'blur(30px)' : 'blur(20px)',
                    }}
                />
            </motion.div>

            {/* Main Core Dot */}
            <motion.div
                animate={{
                    scale: isClicked ? 0.8 : (isHovered ? 2 : 1),
                    backgroundColor: isHovered ? '#98ffed' : '#00ff88', // Neo Green to Mint Green
                    boxShadow: isHovered ? '0 0 20px #00ff88' : '0 0 10px #00ff88',
                }}
                transition={{ duration: 0.2 }}
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute w-2 h-2 rounded-full z-[100] mix-blend-difference"
            />
        </div>
    );
};

export default CustomCursor;

