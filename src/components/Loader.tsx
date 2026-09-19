import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  onComplete?: () => void;
  onExitStart?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete, onExitStart }) => {
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [gifSrc] = useState<string>("/Name-Logo.gif");

  // Trigger onExitStart when phase transitions to exit
  useEffect(() => {
    if (phase === "exit" && onExitStart) {
      onExitStart();
    }
  }, [phase, onExitStart]);

  // Handle GIF playback timing (4 seconds total: 3.5s full opacity + 0.5s fade out)
  useEffect(() => {
    // Start 0.5s fade out at 3.5s (3500ms)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3500);

    // Transition phase to "exit" at 4.0s (4000ms)
    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  // Pure dark/cinematic background to match loader theme
  const bgColor = "bg-black";
  const textColor = "text-white";
  const borderColor = "border-white/5";

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] pointer-events-auto flex font-['Inter',sans-serif] ${bgColor} overflow-hidden`}
    >
      {/* Column exit wipes */}
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
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: phase === "exit" ? col.delay * 0.4 : 0,
          }}
          onAnimationComplete={() => {
            if (i === 4 && phase === "exit" && onComplete) {
              onComplete();
            }
          }}
        />
      ))}

      {/* Content Layer */}
      <motion.div
        className={`absolute inset-0 z-10 p-4 md:p-12 ${textColor} flex flex-col justify-between`}
        animate={{
          opacity: phase === "exit" || isFadingOut ? 0 : 1,
          scale: phase === "exit" ? 0.98 : 1
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Center / Main Logo GIF Container */}
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div
            className="w-[320px] xs:w-[420px] sm:w-[560px] md:w-[760px] lg:w-[960px] max-w-[90%] aspect-video z-20 overflow-hidden flex items-center justify-center rounded-lg relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Elegant ambient glow behind the logo */}
            <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full scale-75 animate-pulse pointer-events-none"></div>

            {gifSrc && (
              <img
                src={gifSrc}
                alt="Loading..."
                className="w-full h-full object-contain relative z-10"
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;