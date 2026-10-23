import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsTouchDevice(coarse.matches);
    setReducedMotion(reduced.matches);
    const handleCoarse = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    const handleReduced = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    coarse.addEventListener?.('change', handleCoarse);
    reduced.addEventListener?.('change', handleReduced);
    return () => {
      coarse.removeEventListener?.('change', handleCoarse);
      reduced.removeEventListener?.('change', handleReduced);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice || reducedMotion) return;

    const dot = dotRef.current;
    const trail = trailRef.current;
    const glow = glowRef.current;
    if (!dot || !trail || !glow) return;

    const x = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' });
    const y = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' });
    const tx = gsap.quickTo(trail, 'x', { duration: 0.45, ease: 'power2.out' });
    const ty = gsap.quickTo(trail, 'y', { duration: 0.45, ease: 'power2.out' });
    const gx = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power2.out' });
    const gy = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power2.out' });

    gsap.set([dot, trail, glow], { x: -100, y: -100, opacity: 0 });

    const hover = () => {
      gsap.to(dot, { scale: 2.2, backgroundColor: '#d80711', duration: 0.2, ease: 'power2.out' });
      gsap.to(trail, { scale: 1.8, borderColor: '#d80711', opacity: 0.6, duration: 0.2, ease: 'power2.out' });
      gsap.to(glow, { scale: 1.4, opacity: 0.35, duration: 0.25, ease: 'power2.out' });
    };
    const unhover = () => {
      gsap.to(dot, { scale: 1, backgroundColor: '#ffffff', duration: 0.2, ease: 'power2.out' });
      gsap.to(trail, { scale: 1, borderColor: '#ffffff', opacity: 0.4, duration: 0.25, ease: 'power2.out' });
      gsap.to(glow, { scale: 1, opacity: 0.2, duration: 0.3, ease: 'power2.out' });
    };

    const move = (e: MouseEvent) => {
      gsap.set([dot, trail, glow], { opacity: 1 });
      x(e.clientX);
      y(e.clientY);
      tx(e.clientX);
      ty(e.clientY);
      gx(e.clientX);
      gy(e.clientY);
    };

    const hide = () => {
      gsap.to([dot, trail, glow], { opacity: 0, duration: 0.25 });
    };
    const show = () => {
      gsap.set([dot, trail, glow], { opacity: 1 });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, [data-cursor="pointer"], [data-cursor-text]')) {
        hover();
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, [data-cursor="pointer"], [data-cursor-text]')) {
        unhover();
      }
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isTouchDevice, reducedMotion]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Soft ambient glow that lingers behind the dot */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9998] opacity-0 mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle, rgba(216,7,17,0.45) 0%, rgba(216,7,17,0) 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Trailing ring that follows with a slight delay */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-[24px] h-[24px] rounded-full pointer-events-none z-[9998] opacity-0 mix-blend-difference"
        style={{
          border: '2px solid rgba(255,255,255,0.4)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Primary dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[8px] h-[8px] rounded-full bg-white pointer-events-none z-[9999] opacity-0 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;
