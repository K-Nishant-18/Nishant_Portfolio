import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useTheme } from "../context/ThemeContext";

interface LoaderProps {
  onComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit">("loading");

  useEffect(() => {
    // Smooth Counter Animation
    const ctx = gsap.context(() => {
      const target = { val: 0 };
      gsap.to(target, {
        val: 100,
        duration: 3.5, // Slower, more deliberate
        ease: "power3.inOut", // Stronger ease-in-out for "premium" feel
        onUpdate: () => {
          setCount(Math.round(target.val));
        }
      });
    });
    return () => ctx.revert();
  }, []);

  // GSAP GRID ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Setup Elements
      const vLines = gsap.utils.toArray<HTMLElement>('.loader-grid-line-y');
      const hLines = gsap.utils.toArray<HTMLElement>('.loader-grid-line-x');

      // Asymmetry Logic (Matching Hero)
      const vAnimate = vLines.filter((_, i) => i % 2 !== 0 || i === 0);
      const vStatic = vLines.filter((_, i) => i % 2 === 0 && i !== 0);

      const hAnimate = hLines.filter((_, i) => i % 3 !== 0);
      const hStatic = hLines.filter((_, i) => i % 3 === 0);

      // Initial State
      gsap.set(vAnimate, { scaleY: 0, opacity: 0.2 });
      gsap.set(hAnimate, { scaleX: 0, opacity: 0.2 });
      gsap.set(vStatic, { scaleY: 1, opacity: 0.1 });
      gsap.set(hStatic, { scaleX: 1, opacity: 0.1 });

      // Reveal Animation
      const tl = gsap.timeline();

      tl.to(vAnimate, {
        scaleY: 1,
        duration: 2.2, // Slower
        stagger: { from: "center", amount: 0.8 }, // More spread out
        ease: 'power3.inOut', // Smoother ease
        transformOrigin: 'top'
      })
        .to(hAnimate, {
          scaleX: 1,
          duration: 2.2, // Slower
          stagger: { from: "start", amount: 0.8 },
          ease: 'power3.inOut',
          transformOrigin: 'left'
        }, "<")

        // Fade to subtle state
        .to([...vAnimate, ...hAnimate], {
          opacity: 0.1, // Match static opacity
          duration: 1.0,
          ease: "power2.out"
        });

    }); // No scope ref needed as we target unique classes

    return () => ctx.revert();
  }, []); // Run on mount

  // GRID EXIT
  useEffect(() => {
    if (phase === "exit") {
      gsap.to(['.loader-grid-line-y', '.loader-grid-line-x'], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [phase]);

  useEffect(() => {
    if (count === 100) {
      // Small delay before starting exit animation to let user register 100%
      const timer = setTimeout(() => {
        setPhase("exit");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [count]);

  // Theme-aware colors
  const bgColor = isDark ? "bg-black" : "bg-gray-50";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const borderColor = isDark ? "border-white/5" : "border-gray-900/5";
  const accentColor = isDark ? "text-green-400" : "text-green-600";
  const barBg = isDark ? "bg-white/20" : "bg-gray-900/20";
  const barFill = isDark ? "bg-red-600" : "bg-red-600";

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] pointer-events-auto flex font-['Inter',sans-serif] ${bgColor} overflow-hidden`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 
        IMPROVED REVEAL: Diagonal/Multi-directional columns
        Alternating directions for more dynamic reveal
      */}
      {[
        { width: 20, delay: 0, direction: "top" },
        { width: 15, delay: 0.08, direction: "bottom" },
        { width: 25, delay: 0.16, direction: "top" },
        { width: 18, delay: 0.24, direction: "bottom" },
        { width: 22, delay: 0.32, direction: "top" },
      ].map((col, i) => (
        <motion.div
          key={i}
          className={`h-full ${bgColor} border-r ${borderColor} relative`}
          style={{
            width: `${col.width}%`,
            transformOrigin: col.direction === "top" ? "top" : "bottom"
          }}
          initial={{
            scaleY: 1
          }}
          animate={{
            scaleY: phase === "exit" ? 0 : 1
          }}
          transition={{
            duration: 1.2,
            ease: [0.87, 0, 0.13, 1], // Stronger easing for more dramatic effect
            delay: phase === "exit" ? col.delay : 0,
          }}
          onAnimationComplete={() => {
            // When the LAST column finishes, trigger parent onComplete
            if (i === 4 && phase === "exit" && onComplete) {
              onComplete();
            }
          }}
        />
      ))}

      {/* 
        CONTENT LAYER
        Absolute positioned over the grid.
      */}
      <motion.div
        className={`absolute inset-0 z-10 p-4 md:p-12 ${textColor} flex flex-col justify-between`}
        animate={{
          opacity: phase === "exit" ? 0 : 1,
          scale: phase === "exit" ? 0.95 : 1
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight uppercase">Nishant Portfolio</h1>
            <span className="text-xs font-mono opacity-50">© 2026</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono block">SYSTEM_CHECK</span>
            <span className={`text-xs font-mono ${accentColor}`}>OPTIMAL</span>
          </div>
        </div>

        {/* 
          GRID CONTAINER
          This is an overlay on top of the columns, but behind the main content.
        */}
        <div className="absolute inset-0 z-[5] pointer-events-none grid-layer overflow-hidden">
          {/* 
              Swiss Asymmetrical Grid
              Manually positioned lines to break symmetry.
            */}

          {/* Vertical Lines - Irregular Spacing */}
          <div className="absolute top-0 bottom-0 w-px bg-current opacity-10 left-[12%] loader-grid-line-y"></div>
          <div className="absolute top-0 bottom-0 w-px bg-current opacity-10 left-[28%] loader-grid-line-y"></div>
          <div className="absolute top-0 bottom-0 w-px bg-current opacity-10 left-[45%] loader-grid-line-y"></div>
          <div className="absolute top-0 bottom-0 w-px bg-current opacity-10 left-[62%] loader-grid-line-y"></div>
          <div className="absolute top-0 bottom-0 w-px bg-current opacity-10 left-[88%] loader-grid-line-y"></div>

          {/* Horizontal Lines - Golden Ratio / Irregular */}
          <div className="absolute left-0 right-0 h-px bg-current opacity-10 top-[15%] loader-grid-line-x"></div>
          <div className="absolute left-0 right-0 h-px bg-current opacity-10 top-[38%] loader-grid-line-x"></div>
          <div className="absolute left-0 right-0 h-px bg-current opacity-10 top-[62%] loader-grid-line-x"></div>
          <div className="absolute left-0 right-0 h-px bg-current opacity-10 top-[85%] loader-grid-line-x"></div>
        </div>

        {/* Center / Main */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-10 pointer-events-none">
            {/* Decorative background grid lines/boxes */}
            <motion.div
              className={`col-span-3 border ${borderColor} h-32 mt-12`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={`col-start-8 col-span-2 border ${borderColor} h-64 -mt-12 rounded-full`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.h2
            className="text-[12vw] md:text-[10rem] font-black leading-none tracking-tighter z-20"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {count}%
          </motion.h2>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono uppercase opacity-70">
          <div>
            <span className="block opacity-50">Status</span>
            <span>{count < 100 ? "Loading Resources" : "Initialized"}</span>
          </div>
          <div className="hidden md:block">
            <span className="block opacity-50">Location</span>
            <span>New Delhi, IN</span>
          </div>
          <div className="hidden md:block">
            <span className="block opacity-50">Mode</span>
            <span>{isDark ? "Dark" : "Light"}</span>
          </div>
          <div className="text-right flex flex-col justify-end">
            <div className={`w-full h-1 ${barBg} mt-1 relative overflow-hidden`}>
              <motion.div
                className={`absolute inset-0 ${barFill}`}
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;