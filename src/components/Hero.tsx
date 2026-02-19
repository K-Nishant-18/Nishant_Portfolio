// src/components/Hero.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FiArrowDown, FiGlobe, FiDatabase, FiServer, FiCpu } from 'react-icons/fi';

interface HeroProps {
  startAnimation?: boolean;
}

const Hero: React.FC<HeroProps> = ({ startAnimation = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Initial Animation - Triggered by startAnimation
    const ctx = gsap.context(() => {
      // 1. Setup Elements
      const vLines = gsap.utils.toArray<HTMLElement>('.grid-line-y');
      const hLines = gsap.utils.toArray<HTMLElement>('.grid-line-x');

      // Swiss Asymmetry: Randomly pick which lines animate vs stay static
      // We'll use a deterministic pattern for consistency or random for chaos.
      // Let's go Pattern: Alternate or skipping.

      const vAnimate = vLines.filter((_, i) => i % 2 !== 0 || i === 0); // Animate 0, 2, 4... actually i%2!==0 is 1,3,5. Let's animate odds + first.
      const vStatic = vLines.filter((_, i) => i % 2 === 0 && i !== 0);

      const hAnimate = hLines.filter((_, i) => i % 3 !== 0); // Animate most, leave 0 and 3 static
      const hStatic = hLines.filter((_, i) => i % 3 === 0);

      // Hide Animated lines initially
      gsap.set(vAnimate, { scaleY: 0, opacity: 0.1 });
      gsap.set(hAnimate, { scaleX: 0, opacity: 0.1 });

      // Static lines start visible (but maybe slightly lower opacity for hierarchy)
      gsap.set(vStatic, { scaleY: 1, opacity: 0.05 });
      gsap.set(hStatic, { scaleX: 1, opacity: 0.05 });

      gsap.set('.hero-char', { y: 200, opacity: 0 });
      gsap.set('.meta-item', { opacity: 0, y: 20 });

      if (startAnimation) {
        const tl = gsap.timeline();

        // 1. Grid Reveal (Smoother, Liquid Feel)
        tl.to(vAnimate, {
          scaleY: 1,
          duration: 1.8,
          stagger: { from: "center", amount: 0.8 },
          ease: 'power2.inOut',
          transformOrigin: 'top'
        })
          .to(hAnimate, {
            scaleX: 1,
            duration: 1.8,
            stagger: { from: "start", amount: 0.8 },
            ease: 'power2.inOut',
            transformOrigin: 'left'
          }, "<")

          // 2. Fade ONLY Animated Grid to match static background (if needed)
          // Actually, let's keep them at 0.1 or fade them to 0.05 to match static.
          .to([...vAnimate, ...hAnimate], {
            opacity: 0.05,
            duration: 1.0,
            ease: "power2.out"
          })

          // 3. Name Reveal (Staggered Up)
          .to('.hero-char', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: 'power4.out'
          }, "-=1.2") // Contrast with grid fade

          // 4. Metadata Reveal
          .to('.meta-item', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
          }, "-=0.5");
      }

    }, containerRef);

    // Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;

      gsap.to(nameRef.current, {
        x: x * 30,
        y: y * 30,
        duration: 1,
        ease: 'power2.out'
      });


    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timer);
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [startAnimation]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* --- Swiss Grid Background --- */}
      <div className="absolute inset-0 z-0 grid-layer pointer-events-none">

        {/* Vertical Lines */}
        <div className="absolute inset-0 flex justify-between px-6 md:px-12 max-w-[1800px] mx-auto w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div key={`v-${i}`} className="relative h-full">
              <div className="grid-line-y w-px h-full bg-black dark:bg-white origin-top"></div>
            </div>
          ))}
        </div>

        {/* Horizontal Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-24 h-full pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={`h-${i}`} className="grid-line-x h-px w-full bg-black dark:bg-white origin-left"></div>
          ))}
        </div>
      </div>

      {/* --- Content Layer --- */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 md:px-12 py-8 max-w-[1800px] mx-auto">

        {/* Top Bar: Technical Metadata */}
        <div className="flex justify-between items-start pt-24 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="meta-item text-left">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">System Status</p>
            <p className="font-mono text-xs uppercase flex items-center gap-2 text-black dark:text-white">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              OPERATIONAL
            </p>
          </div>

          <div className="hidden md:flex gap-12">
            <div className="meta-item text-right">
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Location</p>
              <p className="font-mono text-xs uppercase flex items-center gap-2">
                <FiGlobe className="w-3 h-3" /> IN, Bhagalpur
              </p>
            </div>
            <div className="meta-item text-right">
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Local Time (IST)</p>
              <p className="font-mono text-xs uppercase tabular-nums">
                {time}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Monumental Typography */}
        <div className="flex-1 flex flex-col justify-center items-center w-full relative">
          <h1 ref={nameRef} className="font-bold tracking-[-0.1em] uppercase text-center z-20 whitespace-nowrap text-black dark:text-white flex flex-col items-start leading-[0.85]">
            <span className="text-[12vw] md:text-[4vw] block mb-2 md:-mb-2 self-center md:self-start ml-6 md:ml-4">
              {"KUMAR".split('').map((char, i) => (
                <span key={`k-${i}`} className="hero-char inline-block text-transparent text-stroke-responsive transition-all duration-300 cursor-default hover:text-black dark:hover:text-white">
                  {char}
                </span>
              ))}
            </span>
            <span className="text-[21vw] md:text-[19vw] block -mt-4 opacity-95">
              {"NISHANT_".split('').map((char, i) => (
                <span key={`n-${i}`} className="hero-char inline-block tracking-[-0.08em] hover:text-transparent hover:text-stroke-black dark:hover:text-stroke-white transition-all duration-300 cursor-default">
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* Role Badge - Floating */}
          <div className="flex md:flex relative mt-12 md:absolute md:mt-0 md:-bottom-10 left-auto md:left-1/2 md:-translate-x-1/2 meta-item flex-col items-center z-10">
            <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-mono uppercase tracking-widest mb-2">
              Backend & DevOps Engineer
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1"><FiServer /> Backend</span>
              <span className="flex items-center gap-1"><FiDatabase /> Database</span>
              <span className="flex items-center gap-1"><FiCpu /> DevOps</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Navigation & Specs */}
        <div className="flex justify-between items-end pb-8 border-t border-black/10 dark:border-white/10 pt-6">
          <div className="meta-item w-1/3">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">Available for</p>
            <ul className="text-xs font-mono space-y-1">
              <li>Freelance Projects</li>
              <li>Full-time Roles</li>
            </ul>
          </div>

          <div className="meta-item w-1/3 flex justify-center">
            <div className="animate-bounce p-3 rounded-full border border-black/10 dark:border-white/10">
              <FiArrowDown className="w-5 h-5 opacity-50" />
            </div>
          </div>

          <div className="meta-item w-1/3 text-right">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">Scroll to explore</p>
            <p className="text-xs font-mono">
              Portfolio v2.0 <br />
              Developed by Kumar Nishant
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Hero;
