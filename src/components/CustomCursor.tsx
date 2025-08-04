import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // --- Touch Device Detection ---
  // We'll use state to track if the device is touch-capable.
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // This effect checks for a touch-first device using a media query.
    // It runs only once when the component mounts.
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const determineTouchDevice = () => {
      if (mediaQuery.matches) {
        setIsTouchDevice(true);
      }
    };

    determineTouchDevice();
  }, []);
  // -----------------------------


  // --- Cursor Animation Logic ---
  useEffect(() => {
    // If it's a touch device, we stop here and do nothing.
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // The rest of your animation logic goes here.
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a') {
        gsap.to(cursor, { backgroundColor: '#CB0404', scale: 5.8, duration: 0.2 });
        gsap.to(follower, { borderColor: '#8A0000', scale: 1.5, duration: 0.2 });
        target.style.color = '#DC2525';
      } else {
        gsap.to(cursor, { scale: 5.8, duration: 0.3 });
        gsap.to(follower, { scale: 1.5, duration: 0.3 });
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      gsap.to(cursor, { backgroundColor: '', scale: 1, duration: 0.2 });
      gsap.to(follower, { borderColor: '', scale: 1, duration: 0.2 });
      if (target.tagName.toLowerCase() === 'a') {
        target.style.color = '';
      }
    };

    const handleTextEnter = () => {
      gsap.to(cursor, { scale: 19.5, duration: 0.3 });
      gsap.to(follower, { scale: 5, duration: 0.3 });
    };

    const handleTextLeave = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.3 });
    };

    // Add all event listeners
    document.addEventListener('mousemove', moveCursor);
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor="pointer"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    const textElements = document.querySelectorAll('h1, h2, h3');
    textElements.forEach((el) => {
      el.addEventListener('mouseenter', handleTextEnter);
      el.addEventListener('mouseleave', handleTextLeave);
    });

    // Cleanup function to remove listeners
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      textElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleTextEnter);
        el.removeEventListener('mouseleave', handleTextLeave);
      });
    };
  }, [isTouchDevice]); // This effect depends on the device type.


  // --- Component Render ---
  // This is the key: if it's a touch device, we render nothing.
  if (isTouchDevice) {
    return null;
  }

  // Otherwise, we render the cursor elements for desktop.
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
    </>
  );
};

export default CustomCursor;