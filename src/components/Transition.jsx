// src/components/Transition.jsx

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTransition } from '../context/TransitionContext';

const Transition = () => {
  const { setTimeline } = useTransition();
  const transitionRef = useRef(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ paused: true });
    const panels = transitionRef.current.children;
    
    // Animate In: Panels grow from the bottom-left corner
    tl.to(panels, {
      scaleY: 1,
      duration: 0.4,
      ease: 'power3.inOut',
      stagger: 0.1,
    })
    // Set the transform origin to the top-left for the exit animation
    .set(panels, { transformOrigin: 'top left' }, '+=0.4')
    // Animate Out: Panels shrink towards the top-left corner
    .to(panels, {
      scaleY: 0,
      duration: 0.4,
      ease: 'power3.inOut',
      stagger: -0.1,
    });

    setTimeline(tl);
  }, [setTimeline]);

  return (
  <div ref={transitionRef} className="fixed top-0 left-0 w-full h-screen z-[9998] pointer-events-none flex">
    {/* TEST: We are now using an inline style to force the transform origin.
      This helps determine if the issue is with Tailwind CSS or the animation logic itself.
    */}
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
    <div
      className="w-1/4 h-full bg-[#faf9f7] scale-y-0"
      style={{ transformOrigin: 'left bottom' }}
    />
  </div>
);
};

export default Transition;