// src/components/Transition.jsx

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useTransition } from '../context/TransitionContext';

// A simple hook to detect if a media query matches.
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};


const Transition = () => {
  const { setTimeline } = useTransition();
  const transitionRef = useRef(null);
  
  // Check if the screen is "small" (768px or less). You can change this value.
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  
  // Set the number of panels based on screen size.
  const panelCount = isSmallScreen ? 4 : 8;

  useLayoutEffect(() => {
    const tl = gsap.timeline({ paused: true });
    const panels = transitionRef.current.children;
    
    tl.to(panels, {
      scaleY: 1,
      duration: 0.4,
      ease: 'power3.inOut',
      stagger: 0.1,
    })
    .set(panels, { transformOrigin: 'top left' }, '+=0.1')
    .to(panels, {
      scaleY: 0,
      duration: 0.4,
      ease: 'power3.inOut',
      stagger: 0.1,
    });

    setTimeline(tl);
  }, [panelCount, setTimeline]);

  return (
    <div ref={transitionRef} className="fixed top-0 left-0 w-full h-screen z-[9998] pointer-events-none flex">
      {/* Dynamically create the correct number of panels */}
      {Array.from({ length: panelCount }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-full dark:bg-[#faf9f7] bg-gray-950 scale-y-0"
          // CHANGE: Set the origin to 'left top' to make panels appear from that corner.
          style={{ transformOrigin: 'left top' }}
        />
      ))}
    </div>
  );
};

export default Transition;