import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const activeLabel = useRef<{ el: HTMLElement; text: string } | null>(null);

  // --- Touch Device Detection ---
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const determineTouchDevice = () => {
      if (mediaQuery.matches) {
        setIsTouchDevice(true);
      }
    };
    determineTouchDevice();
  }, []);

  // --- Cursor Animation Logic ---
  useEffect(() => {
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    const text = textRef.current;
    const arrow = arrowRef.current;

    if (!cursor || !follower || !label || !text || !arrow) return;

    // Place the pill in a quadrant-aware spot so it never clips off-screen
    const labelPos = (clientX: number, clientY: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let dx = 34;
      let dy = 34;
      if (clientX > w - 190) dx = -34;
      if (clientY > h - 70) dy = -34;
      return { x: clientX + dx, y: clientY + dy };
    };

    const restCursor = (duration = 0.3) => {
      gsap.to(cursor, { backgroundColor: '', scale: 1, duration });
      gsap.to(follower, { borderColor: '', scale: 1, duration });
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
      gsap.to(cursor, { backgroundColor: '#d80711', scale: 2.6, duration: 0.3 });
      gsap.to(follower, { borderColor: '#d80711', scale: 0, duration: 0.3, ease: 'power2.in' });
    };

    const hideLabel = () => {
      activeLabel.current = null;
      gsap.to(label, { opacity: 0, scale: 0.55, duration: 0.18, ease: 'power2.in', overwrite: 'auto' });
      restCursor();
    };

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' });
      if (activeLabel.current) {
        const pos = labelPos(e.clientX, e.clientY);
        gsap.to(label, { x: pos.x, y: pos.y, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      }
    };

    const setLinkHover = (link: HTMLElement) => {
      gsap.to(cursor, { backgroundColor: '#CB0404', scale: 5.8, duration: 0.2 });
      gsap.to(follower, { borderColor: '#8A0000', scale: 1.5, duration: 0.2 });
      link.style.color = '#DC2525';
    };

    const handleMouseOver = (e: Event) => {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      // Labeled elements take priority over all default hover styles
      const labeled = target.closest<HTMLElement>('[data-cursor-text]');
      if (labeled) {
        if (activeLabel.current?.el === labeled) return;
        const val = labeled.dataset.cursorText || '';
        const isLink = !!labeled.closest('a, [data-cursor-arrow]');
        activeLabel.current = { el: labeled, text: val };
        showLabel(val, isLink, event.clientX, event.clientY);
        return;
      }

      // Default hover styles for everything else
      const link = target.closest<HTMLElement>('a, button, [data-cursor="pointer"]');
      if (link) {
        setLinkHover(link);
      } else if (target.closest<HTMLElement>('h1, h2, h3')) {
        gsap.to(cursor, { scale: 19.5, duration: 0.3 });
        gsap.to(follower, { scale: 5, duration: 0.3 });
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

      if (target && target.closest('a, button, [data-cursor="pointer"]')) {
        gsap.to(cursor, { backgroundColor: '', scale: 1, duration: 0.2 });
        gsap.to(follower, { borderColor: '', scale: 1, duration: 0.2 });
        target.style.color = '';
      }
    };

    gsap.set(label, { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0, scale: 0.5 });
    gsap.set(arrow, { opacity: 0, transform: 'translateX(-5px)' });

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouchDevice]);

  // --- Component Render ---
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gray-700 dark:bg-gray-100 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-gray-700 dark:border-gray-100 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={labelRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none opacity-0"
      >
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