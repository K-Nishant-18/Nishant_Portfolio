import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCornerDownRight, FiArrowUpRight, FiX, FiMaximize2, FiShield, FiChevronDown } from 'react-icons/fi';
import { CERTIFICATIONS_DATA, Certification } from '../data/certifications';

gsap.registerPlugin(ScrollTrigger);

const Certifications: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Certification | null>(null);
  const [lightbox, setLightbox] = useState<Certification | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  // Smooth image follow cursor
  const rawX = useRef<number | null>(null);
  const rawY = useRef<number | null>(null);
  const animX = useRef<number>(0);
  const animY = useRef<number>(0);
  const rafId = useRef<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const runLerp = useCallback(() => {
    if (rawX.current !== null && rawY.current !== null) {
      animX.current = lerp(animX.current, rawX.current, 0.15);
      animY.current = lerp(animY.current, rawY.current, 0.15);

      if (imgRef.current) {
        const winW = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
        const clampedX = Math.min(Math.max(animX.current, 140), winW - 140);
        const clampedY = Math.min(Math.max(animY.current, 100), winH - 100);

        imgRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) translate(-50%, -60%)`;
      }
    }
    rafId.current = requestAnimationFrame(runLerp);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(runLerp);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [runLerp]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (rawX.current === null) {
      rawX.current = e.clientX;
      rawY.current = e.clientY;
      animX.current = e.clientX;
      animY.current = e.clientY;
    } else {
      rawX.current = e.clientX;
      rawY.current = e.clientY;
    }
  };

  // Robust GSAP header entrance with refresh
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.reveal-el');
      if (els && els.length > 0) {
        gsap.fromTo(
          els,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            clearProps: 'transform,opacity',
          }
        );
      }
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  // Limit displayed certifications to 4 unless showAll is toggled
  const displayedCerts = showAll ? CERTIFICATIONS_DATA : CERTIFICATIONS_DATA.slice(0, 4);

  return (
    <>
      <section
        ref={sectionRef}
        id="certifications"
        className="relative py-16 md:py-24 bg-white dark:bg-black text-black dark:text-white font-sans border-t border-black/10 dark:border-white/10 transition-colors duration-300 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* ── FLOATING PREVIEW IMAGE ── */}
        <div
          ref={imgRef}
          className="fixed top-0 left-0 z-40 pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <AnimatePresence mode="wait">
            {hovered && (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-xl shadow-2xl border-2 border-black dark:border-white bg-zinc-900"
                style={{ width: 280, height: 180 }}
              >
                <img
                  src={hovered.image}
                  alt={hovered.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Accent Color Bottom Bar */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-full"
                  style={{ background: hovered.accentColor }}
                />
                {/* Code Tag Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] font-bold rounded backdrop-blur-sm border border-white/20">
                  {hovered.code}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10">

          {/* ── DUAL TONE HEADER ── */}
          <div className="reveal-el grid grid-cols-12 items-end gap-y-3 mb-10 pb-6 border-b border-black/15 dark:border-white/15">
            {/* Left: Section Label & Numeral */}
            <div className="col-span-12 md:col-span-3 font-mono">
              <div className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-1 flex items-center gap-1.5">
                <FiCornerDownRight className="w-4 h-4" />
                <span>[04] // CREDENTIALS</span>
              </div>
              <div className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white mt-1">
                0{CERTIFICATIONS_DATA.length} <span className="text-zinc-400 font-normal text-xl">CERTS</span>
              </div>
            </div>

            {/* Center: Dual-Tone Title "Licenses & Certifications" */}
            <div className="col-span-12 md:col-span-6 md:pl-4">
              <h2 className="font-black uppercase tracking-tight leading-[0.9] text-3xl sm:text-4xl md:text-5xl">
                <span>Licenses &amp;</span> <br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px currentColor', opacity: 0.4 }}>
                  Certifications
                </span>
              </h2>
            </div>

            {/* Right: Subtitle */}
            <div className="col-span-12 md:col-span-3 md:text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                Hover row to preview credential.<br />100% Verified Accreditations.
              </p>
            </div>
          </div>

          {/* ── CERTIFICATION INDEX LIST ── */}
          <div className="space-y-1">
            <AnimatePresence>
              {displayedCerts.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onMouseEnter={() => setHovered(cert)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setLightbox(cert)}
                  data-cursor-text="VIEW"
                  className={`reveal-el group relative grid grid-cols-12 items-center gap-x-4 py-4 md:py-5 px-3 md:px-4 border-b border-black/10 dark:border-white/10 cursor-pointer rounded-lg transition-all duration-300 ${
                    hovered?.id === cert.id
                      ? 'bg-black/[0.04] dark:bg-white/[0.05]'
                      : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Accent Color Left Edge Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${
                      hovered?.id === cert.id ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                    }`}
                    style={{ background: cert.accentColor }}
                  />

                  {/* Index number */}
                  <div className="col-span-2 sm:col-span-1 font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-red-500 transition-colors">
                    0{idx + 1}
                  </div>

                  {/* Title */}
                  <div className="col-span-10 sm:col-span-7 md:col-span-6">
                    <h3 className="font-bold uppercase tracking-tight text-base md:text-xl group-hover:translate-x-1.5 transition-transform duration-300">
                      {cert.title}
                    </h3>
                    {/* Mobile Issuer & Date line */}
                    <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 md:hidden mt-1">
                      <span>{cert.issuer}</span>
                      <span>•</span>
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  {/* Issuer (Desktop) */}
                  <div className="hidden md:block md:col-span-3 text-right">
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Date & Action Buttons */}
                  <div className="hidden sm:flex col-span-2 md:col-span-2 items-center justify-end gap-3 font-mono text-xs">
                    <span className="text-zinc-400 text-[11px]">{cert.date}</span>

                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 hover:text-red-500 transition-colors"
                      title="Verify Link"
                    >
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightbox(cert);
                      }}
                      className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 hover:text-red-500 transition-colors"
                      title="Inspect Certificate"
                    >
                      <FiMaximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tag Pills */}
                  <div className="col-span-12 flex flex-wrap gap-1.5 mt-2">
                    {cert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider bg-black/5 dark:bg-white/10 rounded text-zinc-600 dark:text-zinc-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── SHOW ALL / SHOW LESS BUTTON ── */}
          {CERTIFICATIONS_DATA.length > 4 && (
            <div className="reveal-el mt-8 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors duration-300 shadow-sm"
              >
                <span>{showAll ? 'Show Less' : `Show All Certifications (${CERTIFICATIONS_DATA.length})`}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {/* ── FOOTER BAR ── */}
          <div className="reveal-el mt-8 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-xs text-zinc-500">
            <span>{CERTIFICATIONS_DATA.length} Verified Credentials</span>
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              100% Authenticated
            </span>
          </div>

        </div>
      </section>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightbox && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setLightbox(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 border border-black/20 dark:border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl text-black dark:text-white font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 font-mono text-xs text-red-500 font-bold uppercase tracking-widest">
                <FiShield />
                <span>{lightbox.code} // OFFICIAL CERTIFICATE</span>
              </div>

              {/* Certificate Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black border border-black/10 dark:border-white/10 mb-6">
                <img
                  src={lightbox.image}
                  alt={lightbox.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <h4 className="text-xl font-bold font-sans text-black dark:text-white leading-tight">
                    {lightbox.title}
                  </h4>
                  <p className="text-zinc-500 mt-1">
                    Issued by <span className="text-black dark:text-white font-bold">{lightbox.issuer}</span> • {lightbox.date}
                  </p>
                </div>

                <a
                  href={lightbox.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-text="VERIFY"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors shrink-0"
                >
                  <span>Verify Credential</span>
                  <FiArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certifications;
