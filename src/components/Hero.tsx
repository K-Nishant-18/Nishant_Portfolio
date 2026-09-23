import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useScroll, useTransform, type Transition } from "framer-motion";

// ─── Replace these with your actual image imports or URLs ───────────────────
const PHOTO_1 = "/Hero-2.png"; // smiling, arms open
const PHOTO_2 = "/Hero-1.png"; // standing with bag
// ────────────────────────────────────────────────────────────────────────────

interface HeroProps {
  startAnimation?: boolean;
}

export default function Hero({ startAnimation = true }: HeroProps) {
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const maskMouseX = useMotionValue(0);
  const maskMouseY = useMotionValue(0);
  const smoothMaskX = useSpring(maskMouseX, { damping: 30, stiffness: 250, mass: 0.5 });
  const smoothMaskY = useSpring(maskMouseY, { damping: 30, stiffness: 250, mass: 0.5 });
  const maskRadius = useSpring(0, { damping: 20, stiffness: 200 });

  const globalMouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const globalMouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  useEffect(() => {
    maskRadius.set(isQuoteHovered ? 75 : 0);
  }, [isQuoteHovered, maskRadius]);

  const maskImage = useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${smoothMaskX}px ${smoothMaskY}px, black 100%, transparent 100%)`;

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    globalMouseX.set(e.clientX);
    globalMouseY.set(e.clientY);
  };

  const handleQuoteMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    maskMouseX.set(e.clientX - rect.left + 150);
    maskMouseY.set(e.clientY - rect.top + 150);
  };

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const photo1ScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const photo2ScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const heroLeftY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const arrowY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const pMouseX = useSpring(globalMouseX, { damping: 50, stiffness: 400 });
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

  const photo1X = useTransform(pMouseX, [0, windowWidth], ["-2%", "2%"]);

  const photo2X = useTransform(pMouseX, [0, windowWidth], ["2%", "-2%"]);

  const transitionSettings: Transition = { duration: 1.4, ease: [0.16, 1, 0.3, 1] };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500;600&family=Syncopate:wght@400;700&display=swap');
        @import url('https://fonts.cdnfonts.com/css/aileron');

        .hero-root {
          position: relative;
          width: 100%;
          height: 160vh;
          background: #F9FAFB; /* Light theme background */
          color: #000000;      /* Light theme text */
          overflow: hidden;
          font-family: 'Bebas Neue', Impact, sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* --- DARK THEME OVERRIDES --- */
        .dark .hero-root {
          background: #000000;
          color: #ffffff;
        }

        /* BIG NAME */
        .hero-name {
          position: absolute;
          top: 14vh;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 4vw;
          font-size: 14vw;
          line-height: 0.8;
          letter-spacing: -0.01em;
          font-family: 'Anton', sans-serif;
          z-index: 5;
        }

        /* WATERMARK */
        .bg-outline-text {
          position: absolute;
          top: 14vh;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 4vw;
          font-size: 14vw;
          line-height: 0.8;
          letter-spacing: -0.01em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(0, 0, 0, 1); /* Subtle black outline in light mode */
          font-family: 'Anton', sans-serif;
          z-index: 15; /* Above big name (5) and photos (6, 8) */
          pointer-events: none;
        }

        .dark .bg-outline-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 1); /* White outline in dark mode */
        }

        /* LEFT COLUMN */
        .hero-left-container {
          position: absolute;
          top: 100vh;
          left: 7vw;
          z-index: 10;
        }
        .hero-left {
          transform: rotate(-90deg);
          transform-origin: left top;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          white-space: nowrap;
        }
        .hero-left-word {
          font-family: 'Degular Display', 'Bebas Neue', sans-serif;
          font-size: 8.5vw;
          line-height: 0.75; /* Reduced from 0.82 to tighten vertical spacing */
          letter-spacing: -0.02em;
        }
        .w1 { margin-left: 0; margin-top: 2.5vw;}
        .w2 { margin-left: 0; }
        .w3 { margin-left: 0; }

        /* PHOTOS & ARROW CONTAINER */
        .hero-graphics {
          position: absolute;
          top: 2vw;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none; /* Allows clicking through empty space */
          z-index: 6; 
        }
        .hero-graphics > * {
          pointer-events: auto; /* Restores clicks on actual elements */
        }

        .photo2-wrapper {
          position: absolute;
          top: 22vh;
          right: 23vw;
          width: 20vw;
          aspect-ratio: 3/4;
          z-index: 6;
        }
        .photo2-outline {
          position: absolute;
          top: 175px;
          left: -210px;
          right: 40px;
          width: 150%;
          height: 62%;
          bottom: 20px;
          border: 1.5px solid rgba(0, 0, 0, 1); /* Dark outline in light mode */
          z-index: 1;
          pointer-events: none;
        }
        .dark .photo2-outline {
          border: 1.5px solid rgba(255, 255, 255, 1);
        }
        .photo2-img {
          width: 100%;
          height: 100%;
          left: -10px;
          object-fit: cover;
          filter: grayscale(100%);
          position: relative;
          z-index: 2;
        }

        .photo1-wrapper {
          position: absolute;
          top: 45vh;
          left: 31vw;
          width: 25vw; /* Reduced from 29vw */
          aspect-ratio: 16/10;
          z-index: 8;
        }
        .photo1-outline {
          position: absolute;
          /* Align exactly with the image's new space */
          top: 25px;
          right: -38px;
          bottom: -25px;
          left: 30px;
          border: 10px solid #F9FAFB; /* White border in light mode */
          z-index: 1;
          pointer-events: none;
        }

        .dark .photo1-outline {
          border: 8px solid rgba(0, 0, 0, 1); /* Black border in dark mode */
        }
        .photo1-img {
          /* Shift the image slightly so it sits right on top visually */
          position: absolute;
          top: 33px;
          right: -30px;
          bottom: -25px;
          left: 2px;
          z-index: 2;
          overflow: hidden;
        }
        .photo1-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
        }

        /* ARROW IMAGE */
        .hero-arrow {
          position: absolute;
          top: 82vh;
          left: 32vw;
          width: 7vw;
          z-index: 9;
        }

        /* META INFO */
        .hero-meta {
          position: absolute;
          top: 75vh;
          right: 5vw;
          text-align: right;
          z-index: 10;
          font-family: 'Syncopate', 'Courier New', Courier, monospace;
          font-weight: 500;
          font-size: 0.9vw;
          letter-spacing: 0.1em;
          line-height: 1.5;
          color: #000000ff; /* Darker gray for light mode */
        }
        .dark .hero-meta {
          color: #eeeeeeff; /* Lighter gray for dark mode */
        }
        .meta-gap { margin-top: 2rem; }

        /* QUOTES AND TEXT */
        .quotes-container {
          position: absolute;
          bottom: 12vh;
          right: 5vw;
          display: flex;
          align-items: flex-end;
          gap: 1.5vw;
          z-index: 10;
        }
        .quote-text-container {
          position: relative;
          width: 29vw; /* Increased width to fit larger text */
          text-align: right;
          font-family: 'Aileron', 'Inter', sans-serif;
          font-size: clamp(20px, 2.6vw, 44px); /* Increased from 1.8vw to 2.3vw */
          line-height: 1.1; /* Tighter line height to reduce vertical space */
          letter-spacing: 0.02em;
          font-weight: 600;
          cursor: none; /* Hide default cursor to show the red circle cleanly */
        }

        /* Default Philosophical Quote */
        .quote-default {
          color: #000000;
        }
        .dark .quote-default { color: #ffffff; }

        /* Reality Check Quote Reveal */
        .quote-reveal {
          color: #ffffff;
        }
        .dark .quote-reveal { color: #000000; }

        /* INVERT IMAGES FOR LIGHT/DARK IF THEY ARE WHITE BY DEFAULT */
        /* Assuming arrow.png and quote.png are white PNGs because the background was previously black.
           We invert them in light mode so they become black. */
        html:not(.dark) .hero-arrow img,
        html:not(.dark) .quotes-container img {
          filter: invert(1);
        }

        /* --- MOBILE RESPONSIVE OVERRIDES --- */
        @media (max-width: 768px) {
          .hero-root { 
            height: 100vh; /* Tighter layout for mobile */
          }
          
          .hero-name, .bg-outline-text {
            top: 13vh;
            font-size: 20vw;
            line-height: 1.01;
            padding-top: 0px;
            padding-bottom: 0px;
          }

          .hero-left-container { 
            top: 85vh; 
            left: 8vw; 
          }
          .hero-left-word { 
            font-size: 12vw; /* Larger for readability when rotated */
          }
          .w1 { margin-top: 5vw; }

          .photo2-wrapper { 
            top: 22vh; 
            right: 8vw; 
            width: 38vw; 
          }
          .photo2-outline { 
          display: none;
            top: 40px; 
            left: -60px; 
            width: 150%; 
            height: 70%; 
          }

          .photo1-wrapper { 
            top: 36vh; 
            left: 10vw; 
            width: 45vw; 
          }
          .photo1-outline { 
            border-width: 4px; 
            top: 15px; right: -15px; bottom: -15px; left: 15px; 
          }
          .photo1-img { 
            top: 20px; left: 40px; right: -15px; bottom: -15px; 
          }

          .hero-arrow { 
            top: 58vh; 
            left: 10vw; 
            width: 14vw; 
          }

          .hero-meta { 
            top: 54vh; 
            right: 6vw; 
            font-size: 2.5vw; 
          }

          .quotes-container { 
            bottom: 1vh; 
            right: 6vw; 
            flex-direction: column; 
            align-items: flex-end; 
            gap: 2vh; 
          }
          .quotes-container img {
            height: 20vh !important; /* Override inline 36vh for mobile */
          }
          .quote-text-container { 
            width: 70vw; 
            font-size: clamp(16px, 4vw, 24px); 
          }
        }
      `}</style>

      <section className="hero-root" ref={heroRef} onMouseMove={handleGlobalMouseMove}>

        {/* WATERMARK */}
        <div className="bg-outline-text">
          <span>KUMAR NISHANT</span>
        </div>

        {/* BIG NAME */}
        <div className="hero-name">
          <span>KUMAR NISHANT</span>

        </div>

        {/* LEFT COLUMN */}
        <motion.div className="hero-left-container" style={{ y: heroLeftY }}>
          <div className="hero-left">
            <span className="hero-left-word w1" style={{ overflow: "hidden" }}>
              <motion.span
                initial={{ y: "100%" }}
                animate={startAnimation ? { y: "0%" } : { y: "100%" }}
                transition={{ ...transitionSettings, delay: 0.4 }}
                style={{ display: "inline-block" }}
              >
                BACKEND
              </motion.span>
            </span>
            <span className="hero-left-word w2" style={{ overflow: "hidden" }}>
              <motion.span
                initial={{ y: "100%" }}
                animate={startAnimation ? { y: "0%" } : { y: "100%" }}
                transition={{ ...transitionSettings, delay: 0.45 }}
                style={{ display: "inline-block" }}
              >
                AND
              </motion.span>
            </span>
            <span className="hero-left-word w3" style={{ overflow: "hidden" }}>
              <motion.span
                initial={{ y: "100%" }}
                animate={startAnimation ? { y: "0%" } : { y: "100%" }}
                transition={{ ...transitionSettings, delay: 0.5 }}
                style={{ display: "inline-block" }}
              >
                DEVOPS.
              </motion.span>
            </span>
          </div>
        </motion.div>

        {/* GROUPED GRAPHICS: PHOTOS + ARROW */}
        <div className="hero-graphics">
          {/* PHOTO 2 – behind */}
          <motion.div className="photo2-wrapper" style={{ y: photo2ScrollY, x: photo2X }}>
            <motion.div
              className="photo2-outline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={startAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ ...transitionSettings, delay: 0.6 }}
            />
            <motion.div
              style={{ width: "100%", height: "100%", left: "-10px", position: "relative", overflow: "hidden", zIndex: 2 }}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={startAnimation ? { clipPath: "inset(0% 0 0 0)" } : { clipPath: "inset(100% 0 0 0)" }}
              transition={{ ...transitionSettings, delay: 0.6 }}
            >
              <motion.img
                src={PHOTO_2}
                className="photo2-img"
                alt="Kumar Nishant standing"
                initial={{ scale: 1.9 }}
                animate={startAnimation ? { scale: 1 } : { scale: 1.9 }}
                transition={{ ...transitionSettings, delay: 0.6 }}
                style={{ left: 0 }}
              />
            </motion.div>
          </motion.div>

          {/* PHOTO 1 – front */}
          <motion.div className="photo1-wrapper" style={{ y: photo1ScrollY, x: photo1X }}>
            <motion.div
              className="photo1-outline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={startAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ ...transitionSettings, delay: 0.7 }}
            />
            <motion.div
              className="photo1-img"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={startAnimation ? { clipPath: "inset(0% 0 0 0)" } : { clipPath: "inset(100% 0 0 0)" }}
              transition={{ ...transitionSettings, delay: 0.7 }}
            >
              <motion.img
                src={PHOTO_1}
                alt="Kumar Nishant smiling"
                initial={{ scale: 1.3 }}
                animate={startAnimation ? { scale: 1 } : { scale: 1.3 }}
                transition={{ ...transitionSettings, delay: 0.7 }}
                style={{
                  position: "relative",
                  top: 0, left: 0, right: "auto", bottom: "auto",
                  width: '100%', height: '100%', objectFit: 'cover'
                }}
              />
            </motion.div>
          </motion.div>

          {/* ARROW */}
          <motion.div
            className="hero-arrow"
            data-cursor-text="SCROLL"
            style={{ y: arrowY }}
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={startAnimation ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -15 }}
            transition={{ ...transitionSettings, delay: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="/arrow.png" alt="Arrow pointing down-left" style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
          </motion.div>
        </div>

        {/* META INFO */}
        <motion.div
          className="hero-meta"
          initial={{ opacity: 0, x: 20 }}
          animate={startAnimation ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ ...transitionSettings, delay: 0.8 }}
        >
          <p>
            AVAILABLE FOR<br />
            FULL-TIME ROLES<br />
            FREELANCE PROJECT
          </p>
          <p className="meta-gap">
            BASED IN<br />
            BHAGALPUR, INDIA
          </p>
        </motion.div>

        <motion.div
          className="quotes-container"
          initial={{ opacity: 0, y: 30 }}
          animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ ...transitionSettings, delay: 0.9 }}
        >
          <img src="/quote.png" alt="quote marks" style={{ width: 'auto', height: '36vh', objectFit: 'contain' }} />
          <div
            className="quote-text-container"
            onMouseEnter={() => setIsQuoteHovered(true)}
            onMouseLeave={() => setIsQuoteHovered(false)}
            onMouseMove={handleQuoteMouseMove}
          >
            {/* BOTTOM LAYER: Philosophical Quote (Default) */}
            <div className="quote-default">
              In a world where complexity is inevitable and failure is expected, engineering is the act of preparation.
            </div>

            {/* TOP LAYER: Reality Check Quote (Revealed via Red Circle Mask) */}
            <motion.div
              className="quote-reveal"
              style={{
                position: "absolute",
                top: -150,    // Drastically expanded bounds so the circle doesn't clip
                left: -150,   //
                right: -150,  //
                bottom: -150, //
                padding: 150, // Counters the absolute expansion to keep text aligned
                backgroundColor: "#d80711ff", // Vibrant Red background
                WebkitMaskImage: maskImage,
                maskImage: maskImage,
                pointerEvents: "none",
                zIndex: 100,
              }}
            >
              In a world where deadlines are tomorrow and bugs are ‘minor’, engineering is damage control.
            </motion.div>
          </div>
        </motion.div>

      </section>
    </>
  );
}
