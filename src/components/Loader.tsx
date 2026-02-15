import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface LoaderProps {
  onComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit">("loading");

  useEffect(() => {
    // Increment counter
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for a "digital" feel
        const jump = Math.random() > 0.8 ? 5 : 1;
        return Math.min(prev + jump, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

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
  const barFill = isDark ? "bg-white" : "bg-gray-900";

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