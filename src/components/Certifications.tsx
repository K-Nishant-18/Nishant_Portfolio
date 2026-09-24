import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { FiX, FiCheck, FiArrowUpRight, FiLock } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import AsciiBanner from './AsciiBanner';
import { CERTIFICATIONS_DATA, Certification } from '../data/certifications';

gsap.registerPlugin(ScrollTrigger);

const count = CERTIFICATIONS_DATA.length;
const pad = (n: number) => String(n).padStart(2, '0');

/* Single accent that matches the site-wide language (Tailwind red-500). */
const ACCENT = '#ef4444';

/* â”€â”€ Rotating notary seal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Seal: React.FC<{ label: string; color: string; className?: string }> = ({ label, color, className }) => {
  const id = useRef(`seal-${Math.random().toString(36).slice(2, 8)}`);
  return (
    <div className={`relative shrink-0 select-none ${className ?? ''}`}>
      <div className="absolute inset-0 animate-[seal-spin_14s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color }}>
          <defs>
            <path id={id.current} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
          </defs>
          <text className="fill-current" style={{ fontSize: '8.2px', letterSpacing: '1.6px', fontFamily: 'ui-monospace, monospace' }}>
            <textPath href={`#${id.current}`}>{label.toUpperCase()} â€¢ 100% VERIFIED â€¢ </textPath>
          </text>
        </svg>
      </div>
      <span className="absolute inset-0 m-auto w-[42%] h-[42%] rounded-full border-2 border-dashed grid place-items-center" style={{ borderColor: color, color }}>
        <FiCheck className="w-[55%]" style={{ strokeWidth: 3 }} />
      </span>
    </div>
  );
};

/* â”€â”€ Contactless waves mark â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Contactless: React.FC = () => (
  <span className="inline-flex items-center">
    <span className="relative w-6 h-6">
      <span className="absolute inset-0 rounded-full border-[1.5px] border-current opacity-80" />
      <span className="absolute inset-[5px] rounded-full border-[1.5px] border-current opacity-50" />
      <span className="absolute inset-[10px] rounded-full border-[1.5px] border-current opacity-25" />
    </span>
  </span>
);

/* â”€â”€ Barcode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Barcode: React.FC = () => (
  <div
    className="h-8 w-full"
    style={{
      backgroundImage:
        'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px, currentColor 5px 6px, transparent 6px 9px, currentColor 9px 12px, transparent 12px 14px, currentColor 14px 15px, transparent 15px 18px)',
    }}
  />
);

const cardNumber = (cert: Certification) => {
  const num = cert.code.replace(/[^A-Z0-9-]/g, '').slice(0, 6).padEnd(6, 'X');
  return `PAN 4283 0${cert.code.slice(-1) || 0} 7${num}`;
};


/* â”€â”€ Card placements in the vault (normalised 0-100) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const LAYOUT = [
  { left: '50%', top: '47%', tx: '-50%', ty: '-50%', rx: -2, ry: 0, rz: -3, scale: 1, z: 30 },
  { left: '61%', top: '40%', tx: '-50%', ty: '-50%', rx: -3, ry: -8, rz: 5, scale: 0.9, z: 25 },
  { left: '40%', top: '63%', tx: '-50%', ty: '-50%', rx: 7, ry: 12, rz: 9, scale: 0.82, z: 20 },
  { left: '33%', top: '31%', tx: '-50%', ty: '-50%', rx: 5, ry: 14, rz: -13, scale: 0.78, z: 16 },
  { left: '73%', top: '64%', tx: '-50%', ty: '-50%', rx: -9, ry: -16, rz: -15, scale: 0.74, z: 12 },
  { left: '79%', top: '24%', tx: '-50%', ty: '-50%', rx: 8, ry: 6, rz: 18, scale: 0.66, z: 8 },
];

interface CardProps {
  cert: Certification;
  index: number;
  dimmed: boolean;
  isDark: boolean;
  onHover: (i: number | null) => void;
  onOpen: (cert: Certification) => void;
}

const AccessCard: React.FC<CardProps> = ({ cert, index, dimmed, isDark, onHover, onOpen }) => {
  const [hover, setHover] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 240, damping: 22, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 240, damping: 22, mass: 0.6 });

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(py * -10);
    ry.set(px * 14);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    setHover(false);
    onHover(null);
  };

  return (
    <motion.article
      data-cursor-text="SCAN"
      onClick={() => onOpen(cert)}
      onMouseMove={handleMove}
      onMouseEnter={() => {
        setHover(true);
        onHover(index);
      }}
      onMouseLeave={handleLeave}
      animate={{ y: hover ? -14 : 0, scale: hover ? 1.05 : 1, opacity: dimmed && !hover ? 0.22 : 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      style={{
        rotateX: srx,
        rotateY: sry,
        boxShadow: hover
          ? isDark
            ? `0 40px 90px -22px ${ACCENT}66, 0 10px 26px -12px rgba(0,0,0,0.6)`
            : `0 36px 80px -24px ${ACCENT}55, 0 14px 30px -14px rgba(0,0,0,0.35)`
          : isDark
            ? '0 22px 44px -20px rgba(0,0,0,0.7)'
            : '0 18px 40px -22px rgba(0,0,0,0.28)',
      }}
      className="group relative aspect-[8/5] cursor-pointer bg-white dark:bg-zinc-900 border border-black/15 dark:border-white/15 p-3 sm:p-4 flex flex-col justify-between overflow-hidden text-black dark:text-white"
    >
      <div className="absolute inset-x-0 top-0 h-[3px] pointer-events-none" style={{ backgroundColor: ACCENT }} />

      <div className="relative z-10 flex items-center justify-between gap-3 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em]">
        <span className="font-bold text-black dark:text-white">
          Permit {pad(index + 1)}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 truncate">
          {cert.code}
        </span>
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-black uppercase tracking-tight leading-[0.9] text-lg md:text-2xl line-clamp-2">
            {cert.title}
          </h3>
          <p className="mt-1.5 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 truncate">
            {cert.issuer} / {cert.date}
          </p>
        </div>
        <Seal label={`${cert.issuer} — ${cert.code}`} color={ACCENT} className="w-10 h-10 md:w-14 md:h-14 text-red-500" />
      </div>

      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="max-w-[60%] flex flex-col gap-0.5">
          <span className="font-mono text-[7px] md:text-[8px] tracking-[0.2em] text-zinc-500 uppercase truncate">
            {cardNumber(cert)}
          </span>
          <div className="text-black/80 dark:text-white/80">
            <Barcode />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-8 h-6 md:w-10 md:h-7 rounded-[4px] bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 dark:from-zinc-400 dark:via-zinc-600 dark:to-zinc-800 transition-all duration-300 ${hover ? 'brightness-125 scale-105' : 'brightness-95'}`} />
          <span className="hidden sm:flex items-center text-zinc-400 dark:text-zinc-500">
            <Contactless />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white font-mono text-[8px] font-bold uppercase tracking-[0.22em] shadow-lg"
            style={{ backgroundColor: ACCENT }}
          >
            <FiArrowUpRight className="w-3 h-3" />
            Verify
          </motion.span>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

const VaultStage: React.FC<{
  scan: number;
  setScan: (i: number) => void;
  isDark: boolean;
  onOpen: (cert: Certification) => void;
}> = ({ scan, setScan, isDark, onOpen }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const darkRef = useRef(isDark);
  const scanRef = useRef(scan);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const light = useRef({ x: 50, y: 48, tx: 50, ty: 48 });
  const parallax = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    darkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    scanRef.current = scan;
  }, [scan]);

  // Fetch card centre (%) within the stage
  const centreOf = useCallback((i: number) => {
    const stage = stageRef.current;
    const el = cardRefs.current[i];
    if (!stage || !el) return { x: 50, y: 48 };
    const sr = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: ((r.left + r.width / 2 - sr.left) / sr.width) * 100,
      y: ((r.top + r.height / 2 - sr.top) / sr.height) * 100,
    };
  }, []);

  // Spotlight rAF loop (lerp + CSS mask + cluster parallax)
  useEffect(() => {
    const loop = () => {
      light.current.x += (light.current.tx - light.current.x) * 0.14;
      light.current.y += (light.current.ty - light.current.y) * 0.14;
      parallax.current.x += (parallax.current.tx - parallax.current.x) * 0.06;
      parallax.current.y += (parallax.current.ty - parallax.current.y) * 0.06;

      if (lightRef.current) {
        const { x, y } = light.current;
        const veil = darkRef.current ? '7,7,9' : '249,250,251';
        const mask = `radial-gradient(circle at ${x.toFixed(2)}% ${y.toFixed(2)}%, transparent 0px, transparent 150px, rgba(${veil},0.9) 320px, rgba(${veil},0.96) 380px)`;
        lightRef.current.style.maskImage = mask;
        lightRef.current.style.webkitMaskImage = mask;
      }
      if (cardsWrapRef.current) {
        cardsWrapRef.current.style.transform = `translate3d(${parallax.current.x.toFixed(2)}px, ${parallax.current.y.toFixed(2)}px, 0)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Auto-scan the vault (moves the light card-to-card)
  useEffect(() => {
    const id = window.setInterval(() => {
      setScan((scanRef.current + 1) % count);
    }, 4200);
    return () => window.clearInterval(id);
  }, [setScan]);

  // Point the light at the scanned card — unless the user is hovering a card
  useEffect(() => {
    const c = hoverIdx !== null ? centreOf(hoverIdx) : centreOf(scan);
    light.current.tx = c.x;
    light.current.ty = c.y;
  }, [scan, hoverIdx, centreOf]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    light.current.tx = ((e.clientX - sr.left) / sr.width) * 100;
    light.current.ty = ((e.clientY - sr.top) / sr.height) * 100;
    parallax.current.tx = ((e.clientX - sr.left) / sr.width - 0.5) * -14;
    parallax.current.ty = ((e.clientY - sr.top) / sr.height - 0.5) * -10;
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
    const c = centreOf(scan);
    light.current.tx = c.x;
    light.current.ty = c.y;
    parallax.current.tx = 0;
    parallax.current.ty = 0;
  };

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full cursor-crosshair"
    >
      {/* Cards cluster */}
      <div ref={cardsWrapRef} className="absolute inset-0 will-change-transform">
        {CERTIFICATIONS_DATA.map((cert, i) => {
          const l = LAYOUT[i];
          return (
            <div
              key={cert.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute"
              style={{ left: l.left, top: l.top, zIndex: hoverIdx === i ? 70 : scan === i ? 60 : l.z }}
            >
              <div
                className="w-[min(76vw,230px)] sm:w-[260px] md:w-[280px]"
                style={{
                  transform: `translate(${l.tx}, ${l.ty}) rotateX(${l.rx}deg) rotateY(${l.ry}deg) rotateZ(${l.rz}deg) scale(${l.scale}) perspective(1300px)`,
                  perspective: '1300px',
                }}
              >
                <AccessCard cert={cert} index={i} dimmed={hoverIdx !== null && hoverIdx !== i} isDark={isDark} onHover={setHoverIdx} onOpen={onOpen} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Spotlight veil overlay */}
      <div
        ref={lightRef}
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ backgroundColor: isDark ? 'rgba(7,7,9,0.97)' : 'rgba(249,250,251,0.9)' }}
      />

      {/* Corner HUD frame */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-black/30 dark:border-white/30 z-40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-black/30 dark:border-white/30 z-40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-black/30 dark:border-white/30 z-40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-black/30 dark:border-white/30 z-40 pointer-events-none" />

      {/* Scan hint */}
      <div className="absolute top-4 right-10 z-40 pointer-events-none hidden md:flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-black/45 dark:text-white/45">
        Move cursor over cards to scan <FiArrowUpRight className="w-3 h-3" />
      </div>
    </div>
  );
};

const Certifications: React.FC = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [scan, setScan] = useState(0);
  const [lightbox, setLightbox] = useState<Certification | null>(null);
  const cert = CERTIFICATIONS_DATA[scan];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.reveal-el');
      if (els && els.length) {
        gsap.fromTo(
          els,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
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

    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="certifications"
        className="relative bg-gray-50 dark:bg-black text-black dark:text-white font-sans overflow-hidden border-t border-black/10 dark:border-white/10 transition-colors duration-300"
      >
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-12 py-16 md:py-24 md:pt-0">

          {/* â”€â”€ HEADER â”€â”€ */}
          <div className="reveal-el mb-10 md:mb-0 border-b border-black/10 dark:border-white/10 pb-0">
            

            <div className="flex justify-center">
              <div className="leading-none">
                <AsciiBanner className="block max-w-xl md:max-w-5xl md:mb-[-20px]" />
              </div>
            </div>
          </div>

          {/* â”€â”€ STAGE + DOSSIER â”€â”€ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Vault stage */}
            <div className="reveal-el lg:col-span-8 relative h-[58vh] min-h-[420px] order-1 lg:order-none">
              <VaultStage scan={scan} setScan={setScan} isDark={isDark} onOpen={setLightbox} />
            </div>

            {/* HUD dossier */}
            <div className="reveal-el lg:col-span-4 order-2">
              <div className="relative border border-black/15 dark:border-white/25 bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-sm p-6 md:p-7">
                {/* <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" /> */}

               

                <AnimatePresence mode="wait">
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="text-2xl md:text-3xl font-black uppercase leading-[0.95] tracking-tight">
                      {cert.title}
                    </h3>

                    <div className="mt-6 space-y-4 border-t border-black/10 dark:border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.15em]">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-black/40 dark:text-white/40">Issuer</span>
                        <span className="font-bold text-black dark:text-white text-right">{cert.issuer}</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-black/40 dark:text-white/40">Granted</span>
                        <span className="text-black dark:text-white text-right">{cert.date}</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-black/40 dark:text-white/40">Serial</span>
                        <span className="text-black dark:text-white text-right">{cardNumber(cert)}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {cert.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider bg-black/[0.03] border border-black/10 rounded-full text-black/60 dark:bg-white/5 dark:border-white/10 dark:text-white/60">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 flex items-center gap-3">
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-text="VERIFY"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-colors"
                    style={{ borderBottom: `4px solid ${ACCENT}` }}
                  >
                    Verify Credential <FiArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* â”€â”€ INDEX RAIL â”€â”€ */}
          <div className="reveal-el mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-stretch justify-center gap-2">
              {CERTIFICATIONS_DATA.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setScan(i)}
                  data-cursor-text={pad(i + 1)}
                  className={`w-10 h-12 font-mono text-[10px] font-bold border transition-all duration-300 flex items-center justify-center ${
                    i === scan
                      ? 'bg-black text-white dark:bg-white dark:text-black scale-110'
                      : 'border-black/15 text-black/40 hover:border-black/40 hover:text-black dark:border-white/15 dark:text-white/40 dark:hover:border-white/40 dark:hover:text-white'
                  }`}
                  style={i === scan ? { boxShadow: `0 0 18px ${ACCENT}55` } : undefined}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* â”€â”€ LIGHTBOX â”€â”€ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#0b0b0e] border border-black/10 dark:border-white/15 shadow-2xl text-black dark:text-white font-sans overflow-hidden dark:shadow-black/60"
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />

              <button
                onClick={() => setLightbox(null)}
                data-cursor-text="CLOSE"
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/5 hover:bg-red-500 hover:text-white transition-colors dark:bg-white/10"
                title="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between gap-6 mb-10">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-red-500 font-bold uppercase tracking-[0.25em] bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
                    <FiLock />
                    <span>{lightbox.code} // OFFICIAL PERMIT</span>
                  </div>
                  <div className="hidden md:block">
                    <Seal label={`${lightbox.issuer} â€” ${lightbox.code}`} color={ACCENT} className="w-24 h-24" />
                  </div>
                </div>

                <h3 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[0.95] tracking-tight">
                  {lightbox.title}
                </h3>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 border-t border-l border-black/10 dark:border-white/10">
                  <div className="border-r border-b border-black/10 dark:border-white/10 p-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/40 dark:text-white/40 block mb-1.5">Issuer</span>
                    <span className="font-bold uppercase text-sm tracking-tight">{lightbox.issuer}</span>
                  </div>
                  <div className="border-r border-b border-black/10 dark:border-white/10 p-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/40 dark:text-white/40 block mb-1.5">Granted On</span>
                    <span className="font-bold uppercase text-sm tracking-tight">{lightbox.date}</span>
                  </div>
                  <div className="border-b border-black/10 dark:border-white/10 p-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/40 dark:text-white/40 block mb-1.5">Credentials</span>
                    <span className="font-mono text-sm text-black/60 dark:text-white/60">{lightbox.code} Â· VERIFIED</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {lightbox.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider bg-black/[0.03] border border-black/10 rounded-full text-black/60 dark:bg-white/5 dark:border-white/10 dark:text-white/60">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="max-w-[220px]">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-black/40 dark:text-white/40 uppercase block mb-2">{cardNumber(lightbox)}</span>
                    <div className="text-black/80 dark:text-white/80">
                      <Barcode />
                    </div>
                  </div>
                  <a
                    href={lightbox.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-text="VERIFY"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] shrink-0 hover:bg-red-500 hover:text-white transition-colors"
                    style={{ borderLeft: `6px solid ${ACCENT}` }}
                  >
                    <span>Verify Credential</span>
                    <FiArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certifications;
