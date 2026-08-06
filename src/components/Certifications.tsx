import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCornerDownRight, FiArrowLeft, FiArrowRight, FiArrowUpRight, FiMaximize2, FiX } from 'react-icons/fi';
import { CERTIFICATIONS_DATA, Certification } from '../data/certifications';

gsap.registerPlugin(ScrollTrigger);

const Certifications: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [modalImage, setModalImage] = useState<Certification | null>(null);

  const totalCerts = CERTIFICATIONS_DATA.length;
  const currentCert = CERTIFICATIONS_DATA[currentIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalCerts);
  }, [totalCerts]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalCerts) % totalCerts);
  }, [totalCerts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalImage) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, modalImage]);

  // Framer Motion slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="py-16 md:py-24 bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-300 border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Minimal Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiCornerDownRight className="text-red-500 w-4 h-4" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-red-500 font-semibold">
                [04] // CERTIFICATIONS
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
              Certifications
            </h2>
          </div>

          {/* Index Counter & Navigation */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-zinc-500">
              0{currentIndex + 1} / 0{totalCerts}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-black/15 dark:border-white/15 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Previous"
              >
                <FiArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-black/15 dark:border-white/15 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Next"
              >
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Certificate Card Slider */}
        <div className="relative min-h-[380px] md:min-h-[420px] flex flex-col justify-between bg-zinc-50/80 dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden shadow-sm">
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentCert.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
            >
              {/* Certificate Image Frame */}
              <div className="md:col-span-7 relative group cursor-pointer overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-md">
                <div
                  className="aspect-[16/10] w-full overflow-hidden"
                  onClick={() => setModalImage(currentCert)}
                >
                  <img
                    src={currentCert.image}
                    alt={currentCert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Quick Expand Button overlay */}
                <button
                  onClick={() => setModalImage(currentCert)}
                  className="absolute bottom-3 right-3 p-2 bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                  title="Expand Image"
                >
                  <FiMaximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Minimal Info */}
              <div className="md:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-red-500 font-semibold mb-2">
                    {currentCert.issuer}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 leading-snug">
                    {currentCert.title}
                  </h3>
                  <p className="font-mono text-xs text-zinc-500 mb-4">
                    Issued: {currentCert.date}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {currentCert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 font-mono text-[10px] bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={currentCert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-colors"
                >
                  <span>Verify Credential</span>
                  <FiArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Dot Nav */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
            {CERTIFICATIONS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-red-500'
                    : 'w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setModalImage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white dark:bg-zinc-900 border border-black/20 dark:border-white/20 rounded-2xl p-4 overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <img
              src={modalImage.image}
              alt={modalImage.title}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />

            <div className="mt-4 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="font-bold text-black dark:text-white">{modalImage.title}</span>
                <span className="text-zinc-500 ml-2">• {modalImage.issuer}</span>
              </div>
              <a
                href={modalImage.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span>Verify</span>
                <FiArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;
