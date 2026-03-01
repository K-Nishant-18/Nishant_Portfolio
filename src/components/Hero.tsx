import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

// ─── Replace these with your actual image imports or URLs ───────────────────
const PHOTO_1 = "/Hero-2.png"; // smiling, arms open
const PHOTO_2 = "/Hero-1.png"; // standing with bag
// ────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 250, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 250, mass: 0.5 });

  const maskRadius = useSpring(0, { damping: 20, stiffness: 200 });

  useEffect(() => {
    maskRadius.set(isQuoteHovered ? 75 : 0); // Increased from 120 to accommodate larger text
  }, [isQuoteHovered, maskRadius]);

  const maskImage = useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${smoothX}px ${smoothY}px, black 100%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left + 60); // 60px offset for the expanded mask container
    mouseY.set(e.clientY - rect.top + 60);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
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
          right: -30px;
          bottom: -25px;
          left: 30px;
          border: 8px solid rgba(255, 255, 255, 1); /* White border in light mode */
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
          left: 22px;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          z-index: 2;
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
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9vw;
          letter-spacing: 0.1em;
          line-height: 1.5;
          color: #444444; /* Darker gray for light mode */
        }
        .dark .hero-meta {
          color: #cccccc; /* Lighter gray for dark mode */
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
          line-height: 1.4;
          letter-spacing: 0.02em;
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
            top: 10vh;
            font-size: 18vw; /* Slightly larger on mobile */
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
            top: 18vh; 
            right: 8vw; 
            width: 38vw; 
          }
          .photo2-outline { 
            top: 40px; 
            left: -60px; 
            width: 150%; 
            height: 70%; 
          }

          .photo1-wrapper { 
            top: 36vh; 
            left: 20vw; 
            width: 45vw; 
          }
          .photo1-outline { 
            border-width: 4px; 
            top: 15px; right: -15px; bottom: -15px; left: 15px; 
          }
          .photo1-img { 
            top: 20px; left: 10px; right: -15px; bottom: -15px; 
          }

          .hero-arrow { 
            top: 58vh; 
            left: 10vw; 
            width: 14vw; 
          }

          .hero-meta { 
            top: 66vh; 
            right: 6vw; 
            font-size: 2.8vw; 
          }

          .quotes-container { 
            bottom: 4vh; 
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

      <section className="hero-root">

        {/* WATERMARK */}
        <div className="bg-outline-text">
          <span>KUMAR NISHANT</span>
        </div>

        {/* BIG NAME */}
        <div className="hero-name">
          <span>KUMAR NISHANT</span>

        </div>

        {/* LEFT COLUMN */}
        <div className="hero-left-container">
          <div className="hero-left">
            <span className="hero-left-word w1">BACKEND</span>
            <span className="hero-left-word w2">AND</span>
            <span className="hero-left-word w3">DEVOPS.</span>
          </div>
        </div>

        {/* GROUPED GRAPHICS: PHOTOS + ARROW */}
        <div className="hero-graphics">
          {/* PHOTO 2 – behind */}
          <div className="photo2-wrapper">
            <div className="photo2-outline" />
            <img src={PHOTO_2} className="photo2-img" alt="Kumar Nishant standing" />
          </div>

          {/* PHOTO 1 – front */}
          <div className="photo1-wrapper">
            <div className="photo1-outline" />
            <img src={PHOTO_1} className="photo1-img" alt="Kumar Nishant smiling" />
          </div>

          {/* ARROW */}
          <div className="hero-arrow">
            <img src="/arrow.png" alt="Arrow pointing down-left" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* META INFO */}
        <div className="hero-meta">
          <p>
            AVAILABLE FOR<br />
            FULL-TIME ROLES<br />
            FREELANCE PROJECT
          </p>
          <p className="meta-gap">
            BASED IN<br />
            BHAGALPUR, INDIA
          </p>
        </div>

        <div className="quotes-container">
          <img src="/quote.png" alt="quote marks" style={{ width: 'auto', height: '36vh', objectFit: 'contain' }} />
          <div
            className="quote-text-container"
            onMouseEnter={() => setIsQuoteHovered(true)}
            onMouseLeave={() => setIsQuoteHovered(false)}
            onMouseMove={handleMouseMove}
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
                top: -60,
                left: -60,
                right: -60,
                bottom: -60,
                padding: 60,
                backgroundColor: "#e50914", // Vibrant Red background
                WebkitMaskImage: maskImage,
                maskImage: maskImage,
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              In a world where deadlines are tomorrow and bugs are ‘minor’, engineering is damage control.
            </motion.div>
          </div>
        </div>

      </section>
    </>
  );
}
