import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface LoaderProps {
  onComplete?: () => void;
  onExitStart?: () => void;
}

// Customize this to control how long the video plays (in seconds) before transitioning
const PLAYBACK_DURATION = 4.30; 

const Loader: React.FC<LoaderProps> = ({ onComplete, onExitStart }) => {
  const { isDark } = useTheme();
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger onExitStart when phase transitions to exit
  useEffect(() => {
    if (phase === "exit" && onExitStart) {
      onExitStart();
    }
  }, [phase, onExitStart]);

  // Set fallback timer when metadata loads (failsafe in case onPlay is delayed)
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const duration = Math.min(video.duration || 3, PLAYBACK_DURATION);
    const totalTimeMs = duration * 1000;

    if (!fallbackTimerRef.current) {
      fallbackTimerRef.current = setTimeout(() => {
        setPhase("exit");
      }, totalTimeMs);
    }
  };

  // Precise play duration cutoff when video starts playing
  const handlePlay = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }

    fallbackTimerRef.current = setTimeout(() => {
      setPhase("exit");
    }, PLAYBACK_DURATION * 1000);
  };

  // If video ends naturally before cutoff, trigger exit immediately
  const handleVideoEnded = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    setPhase("exit");
  };

  // Track video playback progress to sync with the progress bar
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const targetDuration = Math.min(video.duration || 3, PLAYBACK_DURATION);
    
    if (video.currentTime) {
      const currentProgress = (video.currentTime / targetDuration) * 100;
      setProgress(Math.min(currentProgress, 100));

      // Cut off if currentTime exceeds target playback duration
      if (video.currentTime >= PLAYBACK_DURATION && phase === "loading") {
        setPhase("exit");
      }
    }
  };

  // Absolute fallback timer (6s) in case video completely fails to load or play
  useEffect(() => {
    const backupTimer = setTimeout(() => {
      setPhase("exit");
    }, 6000);

    return () => {
      if (backupTimer) clearTimeout(backupTimer);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  // Try to play video programmatically on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by the browser. A fallback timer is active.", err);
      });
    }
  }, []);

  // Keep background pure dark/cinematic for the video loader to prevent light flash
  const bgColor = "bg-black";
  const textColor = "text-white";
  const borderColor = "border-white/5";
  const barBg = "bg-white/10";
  const barFill = "bg-red-600";

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
          opacity: phase === "exit" ? 0 : 1,
          scale: phase === "exit" ? 0.98 : 1
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* Center / Main Logo Video Container */}
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div
            className="w-[320px] xs:w-[420px] sm:w-[560px] md:w-[760px] lg:w-[960px] max-w-[90%] aspect-video z-20 overflow-hidden flex items-center justify-center rounded-lg relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Elegant ambient glow behind the logo */}
            <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full scale-75 animate-pulse pointer-events-none"></div>

            <video
              ref={videoRef}
              className="w-full h-full object-contain relative z-10"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src="/Logo-loader.webm" type="video/webm" />
              <source src="/Logo-loader.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>

        {/* Bottom Right Progress Bar */}
        {/* <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20">
          <div className={`w-32 sm:w-48 h-[3px] ${barBg} relative overflow-hidden rounded-full`}>
            <motion.div
              className={`absolute inset-y-0 left-0 ${barFill}`}
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>
        </div> */}
      </motion.div>
    </motion.div>
  );
};

export default Loader;