// src/components/Transition.jsx
// SOTD-style page transition: an inverted full-screen curtain slides up carrying
// giant kinetic typography of the destination page, holds briefly, then the
// curtain tears apart (top/bottom halves) to reveal the new route.

import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '../context/TransitionContext';

// Index numbers shown in the transition metadata.
const INDEX = {
  HOME: '01',
  ENGINEERING: '02',
  PROJECT: '03',
  GUESTBOOK: '04',
};

const Transition = () => {
  const { label, setTimeline } = useTransition();
  const rootRef = useRef(null);
  const halfTopRef = useRef(null);
  const halfBottomRef = useRef(null);
  const wordRef = useRef(null);
  const navLabelRef = useRef(null);
  const metaRef = useRef(null);
  const idxRef = useRef(null);
  const cornerLRef = useRef(null);
  const cornerRRef = useRef(null);
  const watermarkRef = useRef(null);

  // Keep the curtain's destination word + index in sync with the pending route.
  useEffect(() => {
    if (label) {
      if (wordRef.current) wordRef.current.textContent = label;
      if (idxRef.current) idxRef.current.textContent = INDEX[label] || '—';
    }
  }, [label]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    const meta = metaRef.current;
    const watermark = watermarkRef.current;

    const tl = gsap.timeline({ paused: true });

    tl.set(root, { autoAlpha: 1 })
      // Reset pieces that linger in their end-state between replays.
      .set([halfTopRef.current, halfBottomRef.current], { yPercent: 0 })
      // 1 — Curtain slides up from the bottom, carrying everything.
      .fromTo(
        root,
        { yPercent: 103 },
        { yPercent: 0, duration: 0.85, ease: 'power4.out' }
      )
      // 2 — Giant watermark rotates in behind the type.
      .fromTo(
        watermark,
        { yPercent: 26, opacity: 0, rotate: -4 },
        { yPercent: 0, opacity: 1, rotate: 0, duration: 0.95, ease: 'power3.out' },
        '<0.08'
      )
      // 3 — The destination word rises through its clip.
      .fromTo(
        word,
        { yPercent: 132, rotate: 4, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '<0.18'
      )
      // 4 — Corner metadata materialises.
      .fromTo(
        meta,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        '-=0.3'
      )
      // 5 — Brief hold so the word registers.
      .to({}, { duration: 0.15 }, '+=0.0')
      // 6 — Word flees upward with a skew while the curtain tears apart.
      .to(
        word,
        { yPercent: -95, rotate: -6, opacity: 0, duration: 0.35, ease: 'power2.in' },
        '<0.05'
      )
      .to(watermark, { yPercent: -46, opacity: 0, duration: 0.5, ease: 'power2.in' }, '<0.06')
      .to(
        [meta, navLabelRef.current, cornerLRef.current, cornerRRef.current],
        { opacity: 0, duration: 0.25 },
        '<'
      )
      .fromTo(
        [halfTopRef.current, halfBottomRef.current],
        { yPercent: 0 },
        {
          yPercent: (i) => (i === 0 ? -100 : 100),
          duration: 0.85,
          ease: 'power4.inOut',
          stagger: 0.1,
        },
        '<'
      )
      .set(root, { autoAlpha: 0 });

    setTimeline(tl);
  }, [setTimeline]);

  return (
    <div
      ref={rootRef}
      className="fixed top-0 left-0 w-full h-screen z-[9998] pointer-events-none invisible overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Curtain halves — inverted theme (cream on dark site, near-black on light). */}
      <div
        ref={halfTopRef}
        className="absolute top-0 left-0 w-full h-1/2 dark:bg-[#faf9f7] bg-gray-950"
      />
      <div
        ref={halfBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 dark:bg-[#faf9f7] bg-gray-950"
      />

      {/* Watermark: KUMAR NISHANT. set huge in the background. */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-0"
        aria-hidden="true"
      >
        <span className="text-[22vw] lg:text-[16vw] leading-none font-bold tracking-tighter uppercase text-[#faf9f7]/[0.16] dark:text-gray-950/[0.12] whitespace-nowrap">
          NISHANT'S
        </span>
      </div>

      {/* Giant destination word + details. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={navLabelRef}
          className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-red-600 mb-5 "
        >
          NAVIGATING TO
        </span>
        <span
          ref={wordRef}
          className="text-[clamp(2.75rem,13vw,6.5rem)] lg:text-[clamp(5rem,9vw,9rem)] leading-none font-bold tracking-tighter uppercase whitespace-nowrap opacity-0 text-white dark:text-black"
        >
          HOME
        </span>
      </div>

      {/* Corner metadata. */}
      <div
        ref={metaRef}
        className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-gray-950/70 dark:text-[#faf9f7]/70 opacity-0"
      >
        <span className="font-bold text-red-600">KN</span>
        <span className="hidden sm:block h-px w-8 bg-current opacity-40" />
        <span>Portfolio</span>
      </div>
      <div
        ref={idxRef}
        className="absolute top-6 right-6 md:top-10 md:right-12 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-gray-950/70 dark:text-[#faf9f7]/70 opacity-0"
      >
        <span className="hidden sm:inline">Index / </span>
        <span className="text-red-600 font-bold">—</span>
      </div>
      <div
        ref={cornerLRef}
        className="absolute bottom-6 left-6 md:bottom-10 md:left-12 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-gray-950/50 dark:text-[#faf9f7]/50"
      >
        <span>Redirecting…</span>
      </div>
      <div
        ref={cornerRRef}
        className="absolute bottom-6 right-6 md:bottom-10 md:right-12 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-gray-950/50 dark:text-[#faf9f7]/50"
      >
        <span>© {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default Transition;