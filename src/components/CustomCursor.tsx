import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const haloRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const activeLabel = useRef<{ el: HTMLElement; text: string } | null>(null);
  const magEl = useRef<HTMLElement | null>(null);

  // --- Device / Motion Preferences ---
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsTouchDevice(coarse.matches);
    setReducedMotion(reduced.matches);

    const handleCoarse = (e: MediaQueryListEvent) => {
      if (e.matches) setIsTouchDevice(true);
    };
    const handleReduced = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    coarse.addEventListener?.('change', handleCoarse);
    reduced.addEventListener?.('change', handleReduced);
    return () => {
      coarse.removeEventListener?.('change', handleCoarse);
      reduced.removeEventListener?.('change', handleReduced);
    };
  }, []);

  // --- Cursor Dynamics ---
  useEffect(() => {
    if (isTouchDevice) return;

    const halo = haloRef.current;
    const ringWrap = ringWrapRef.current;
    const ring = ringRef.current;
    const dash = dashRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const text = textRef.current;
    const arrow = arrowRef.current;

    if (!halo || !ringWrap || !ring || !dash || !dot || !label || !text || !arrow) return;

    const normal = !reducedMotion;

    // Efficient per-frame setters (no GC churn on mousemove).
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power3.out' });
    const ringX = gsap.quickTo(ringWrap, 'x', { duration: 0.42, ease: 'power3.out' });
    const ringY = gsap.quickTo(ringWrap, 'y', { duration: 0.42, ease: 'power3.out' });
    const haloX = gsap.quickTo(halo, 'x', { duration: 1.05, ease: 'power2.out' });
    const haloY = gsap.quickTo(halo, 'y', { duration: 1.05, ease: 'power2.out' });
    const ringSX = gsap.quickTo(ringWrap, 'scaleX', { duration: 0.18, ease: 'power2.out' });
    const ringSY = gsap.quickTo(ringWrap, 'scaleY', { duration: 0.18, ease: 'power2.out' });
    const ringRot = gsap.quickTo(ringWrap, 'rotation', { duration: 0.18, ease: 'power2.out' });

    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let firstMove = true;

    // Hide everything off-screen until the first real movement.
    gsap.set([dot, ringWrap, halo], { x: -100, y: -100, opacity: 0 });

    const setHoverState = (opts: {
      ringScale?: number;
      ringColor?: string;
      dash?: boolean;
      haloScale?: number;
      haloOpacity?: number;
      dotScale?: number;
      dotOpacity?: number;
    }) => {
      const s = opts.ringScale ?? 1;
      gsap.to(ring, {
        scale: s,
        borderColor: opts.ringColor ?? 'rgba(255,255,255,0.85)',
        backgroundColor: 'transparent',
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(dash, {
        opacity: opts.dash ? 1 : 0,
        scale: s + 0.35,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(halo, {
        scale: opts.haloScale ?? 1,
        opacity: opts.haloOpacity ?? 0.22,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, {
        scale: opts.dotScale ?? 1,
        opacity: opts.dotOpacity ?? 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    // Place the pill in a quadrant-aware spot so it never clips off-screen.
    const labelPos = (clientX: number, clientY: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let dx = 34;
      let dy = 34;
      if (clientX > w - 190) dx = -34;
      if (clientY > h - 70) dy = -34;
      return { x: clientX + dx, y: clientY + dy };
    };

    const showLabel = (textVal: string, isLink: boolean, clientX: number, clientY: number) => {
      text.textContent = textVal;
      arrow.style.opacity = isLink ? '1' : '0';
      arrow.style.transform = isLink ? 'translateX(0)' : 'translateX(-5px)';

      const pos = labelPos(clientX, clientY);
      gsap.fromTo(
        label,
        { opacity: 0, scale: 0.5, x: pos.x, y: pos.y + 18 },
        {
          opacity: 1,
          scale: 1,
          x: pos.x,
          y: pos.y,
          duration: 0.42,
          ease: 'back.out(2)',
          overwrite: 'auto',
        }
      );
      setHoverState({
        ringScale: 2.1,
        ringColor: 'rgba(255,255,255,0.95)',
        dash: true,
        haloScale: 1.15,
        haloOpacity: 0.38,
        dotScale: 0.55,
        dotOpacity: 0.55,
      });
    };

    const hideLabel = () => {
      activeLabel.current = null;
      gsap.to(label, {
        opacity: 0,
        scale: 0.55,
        duration: 0.18,
        ease: 'power2.in',
        overwrite: 'auto',
      });
      resetInteractive();
    };

    const releaseMagnetic = () => {
      if (magEl.current) {
        gsap.to(magEl.current, { x: 0, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        magEl.current = null;
      }
    };

    const resetInteractive = () => {
      releaseMagnetic();
      setHoverState({ ringScale: 1 });
    };

    const moveCursor = (e: MouseEvent) => {
      if (firstMove) {
        firstMove = false;
        gsap.to([dot, ringWrap, halo], { opacity: 1, duration: 0.3 });
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastT || 16);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      haloX(e.clientX);
      haloY(e.clientY);

      if (normal) {
        // Velocity-based stretch/squash oriented along the movement axis.
        const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px / ms
        const factor = Math.min(1, speed * 0.55);
        ringSX(1 + factor * 0.5);
        ringSY(Math.max(1 - factor * 0.5, 0.5));
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        ringRot(speed > 0.02 ? angle : 0);
      } else {
        ringSX(1);
        ringSY(1);
      }

      // Magnetic pull on the hovered interactive element.
      if (magEl.current) {
        const r = magEl.current.getBoundingClientRect();
        const ox = Math.max(-12, Math.min(12, (e.clientX - (r.left + r.width / 2)) * 0.18));
        const oy = Math.max(-12, Math.min(12, (e.clientY - (r.top + r.height / 2)) * 0.18));
        gsap.to(magEl.current, {
          x: ox,
          y: oy,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }

      if (activeLabel.current) {
        const pos = labelPos(e.clientX, e.clientY);
        gsap.to(label, { x: pos.x, y: pos.y, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      }
    };

    const setLinkHover = (link: HTMLElement) => {
      releaseMagnetic();
      magEl.current = link;
      setHoverState({
        ringScale: 2.35,
        ringColor: 'rgba(255,255,255,0.9)',
        dash: true,
        haloScale: 1.22,
        haloOpacity: 0.4,
      });
    };

    const setHeadingHover = () => {
      releaseMagnetic();
      setHoverState({
        ringScale: 5.2,
        ringColor: 'transparent',
        dash: false,
        haloScale: 1.5,
        haloOpacity: 0.5,
        dotScale: 0.35,
        dotOpacity: 0.4,
      });
      gsap.to(ring, { backgroundColor: 'rgba(255,255,255,0.14)', duration: 0.35 });
    };

    const handleMouseOver = (e: Event) => {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      // Labeled elements take priority over all default hover styles.
      const labeled = target.closest<HTMLElement>('[data-cursor-text]');
      if (labeled) {
        if (activeLabel.current?.el === labeled) return;
        const val = labeled.dataset.cursorText || '';
        const isLink = !!labeled.closest('a, [data-cursor-arrow]');
        activeLabel.current = { el: labeled, text: val };
        showLabel(val, isLink, event.clientX, event.clientY);
        return;
      }

      const link = target.closest<HTMLElement>('a, button, [data-cursor="pointer"]');
      if (link) {
        setLinkHover(link);
      } else if (target.closest<HTMLElement>('h1, h2, h3')) {
        setHeadingHover();
      } else {
        resetInteractive();
      }
    };

    const handleMouseOut = (e: Event) => {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement | null;
      const related = event.relatedTarget as HTMLElement | null;

      if (activeLabel.current) {
        const stillInside =
          related && typeof related.closest === 'function' && related.closest('[data-cursor-text]');
        if (!stillInside) {
          hideLabel();
        }
        if (!target) return;
      }

      const leavingInteractive =
        target && typeof target.closest === 'function' && target.closest('a, button, [data-cursor="pointer"], h1, h2, h3');
      if (leavingInteractive && !(related && typeof related.closest === 'function' && (related.closest('a, button, [data-cursor="pointer"], h1, h2, h3') || related.closest('[data-cursor-text]')))) {
        resetInteractive();
      }
    };

    const hideCursor = () => {
      gsap.to([dot, ringWrap, halo, label], { opacity: 0, duration: 0.25, overwrite: 'auto' });
    };
    const showCursor = () => {
      gsap.to([dot, ringWrap, halo], { opacity: 1, duration: 0.35, overwrite: 'auto' });
    };

    const compress = () => {
      gsap.to(dot, { scale: 0.6, duration: 0.12, overwrite: 'auto' });
      gsap.to(ring, { scale: '*=0.85', duration: 0.15, overwrite: 'auto' });
    };
    const release = () => {
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'back.out(3)', overwrite: 'auto' });
      gsap.to(ring, { scale: '*=1.05', duration: 0.25, ease: 'back.out(2.5)', overwrite: 'auto' });
    };

    // Continuous spin for the dashed accent ring.
    if (normal) gsap.to(dash, { rotation: 360, duration: 2.2, repeat: -1, ease: 'none' });

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', compress);
    document.addEventListener('mouseup', release);
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', showCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', compress);
      document.removeEventListener('mouseup', release);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mouseenter', showCursor);
    };
  }, [isTouchDevice, reducedMotion]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Soft trailing aura — slow lag, brand-red tint, no blend so it reads on both themes. */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-[9998] -ml-32 -mt-32 opacity-0"
        style={{
          background:
            'radial-gradient(closest-side, rgba(216,7,17,0.30), rgba(216,7,17,0.12) 55%, transparent 75%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Elastic ring with velocity stretch. Wrapper owns rotation + squash. */}
      <div
        ref={ringWrapRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -ml-[19px] -mt-[19px]"
      >
        <div
          ref={ringRef}
          className="w-[38px] h-[38px] rounded-full border mix-blend-difference"
          style={{ borderColor: 'rgba(255,255,255,0.85)' }}
        />
        <div
          ref={dashRef}
          className="absolute inset-0 rounded-full border border-dashed mix-blend-difference opacity-0"
          style={{ borderColor: 'rgba(255,255,255,0.5)' }}
        />
      </div>

      {/* Precision dot — snappy, difference-blended so it inverts underneath. */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-white mix-blend-difference pointer-events-none z-[9999] opacity-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Signature label pill — keep the existing behaviour untouched. */}
      <div ref={labelRef} className="fixed top-0 left-0 z-[9997] pointer-events-none opacity-0">
        <div className="flex items-center gap-2.5 pl-4 pr-4 py-2 rounded-full bg-[#d80711] text-white font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap border border-white/20 shadow-[0_6px_24px_rgba(216,7,17,0.45)]">
          <span className="w-1 h-1 rounded-full bg-white/90 animate-pulse" />
          <span ref={textRef} className="leading-none" />
          <span ref={arrowRef} className="text-sm leading-none transition-all duration-200">
            ↗
          </span>
        </div>
      </div>
    </>
  );
};

export default CustomCursor;