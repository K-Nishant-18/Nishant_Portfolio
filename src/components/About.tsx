import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);
  const hoverIndicatorRef = useRef<HTMLDivElement>(null);
  const [showHoverIndicator, setShowHoverIndicator] = useState(true);
  const idleTimerRef = useRef<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  const images = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.png`);


  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
          },
        }
      );
    }

    // Floating animation for hover indicator
    if (hoverIndicatorRef.current) {
      gsap.to(hoverIndicatorRef.current, {
        y: 16,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'power1.inOut',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (hoverIndicatorRef.current) {
        gsap.killTweensOf(hoverIndicatorRef.current);
      }
    };

    // Hover indicator animation
  
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowHoverIndicator(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowHoverIndicator(true);
    }, 1500);
    const now = Date.now();
    if (now - lastTimeRef.current < 50) return; // Throttle: every 50ms
    lastTimeRef.current = now;

    if (!sectionRef.current || !stackContainerRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const segment = rect.width / images.length;
    const index = Math.min(Math.floor(x / segment), images.length - 1);

    const img = document.createElement('img');
    img.src = images[index];
    img.alt = `Trail ${index}`;
    img.className =
      'absolute w-20 h-32 md:w-24 md:h-40 object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 pointer-events-none';
    img.style.zIndex = '100';
    img.style.left = `${x + 20}px`;
    img.style.top = `${y - 20}px`;
    img.style.opacity = '0';
    img.style.transform = 'scale(0.8)';

    stackContainerRef.current.appendChild(img);

    gsap.to(img, {
      opacity: 1,
      scale: 1,
      rotation: gsap.utils.random(-4, 4),
      duration: 0.2,
      ease: 'power2.out',
    });

    gsap.to(img, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => img.remove(),
    });
  };

  const handleMouseLeave = () => {
    setShowHoverIndicator(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!stackContainerRef.current) return;
    const allImgs = stackContainerRef.current.querySelectorAll('img');
    allImgs.forEach(img => {
      gsap.to(img, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => img.remove(),
      });
    });
  };

  useEffect(() => {
    if (hoverIndicatorRef.current) {
      gsap.to(hoverIndicatorRef.current, {
        autoAlpha: showHoverIndicator ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out',
        pointerEvents: showHoverIndicator ? 'auto' : 'none',
      });
    }
  }, [showHoverIndicator]);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={!isTouch ? handleMouseMove : undefined}
      onMouseLeave={!isTouch ? handleMouseLeave : undefined}
      className=" relative px-7 sm:px-6 md:px-8 py-16 sm:py-0 md:py-12 pb-16 flex items-center justify-center text-center max-w-full mx-auto overflow-hidden z-1000"
    >
      {/* Trail container */}
      {!isTouch && <div ref={stackContainerRef} className="absolute inset-0 z-30" />}

      {/* Main content */}
      <div ref={contentRef} className="space-y-6 sm:space-y-8 relative z-10 w-full max-w-xl sm:max-w-2xl md:max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight mb-8 sm:mb-16">
          About Me
        </h2>
        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-2xl text-gray-700 dark:text-gray-300 font-light leading-relaxed">
          <p>
            I'm a passionate Full-Stack Developer who thrives on building seamless digital experiences with elegance and functionality.
          </p>
          <p>
            From Spring Boot APIs to React front-ends, I craft performant and intuitive web applications that solve real-world problems.
          </p>
          <p>
            My work philosophy is inspired by Swiss design — clean, purposeful, and minimal. Every pixel and line of code has intention.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 pt-6 sm:pt-10">
          <div className="flex flex-col items-center sm:items-center">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
              EXPERIENCE
            </p>
            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              2+ Years
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-center">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
              PROJECTS
            </p>
            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              5+ Completed
            </p>
          </div>
        </div>
      </div>
      {/* MOVE CURSOR Indicator: right side, vertically centered, floating, fades in/out */}
      {!isTouch && (
        <div
          ref={hoverIndicatorRef}
          style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
          className="hidden sm:flex absolute flex-col items-center z-40"
        >
          <div className="w-px h-16 bg-gray-400 dark:bg-gray-600 mb-10"></div>
          <p className="text-xs font-light tracking-widest transform -rotate-90 origin-center">
            MOVE CURSOR
          </p>
        </div>
      )}
    </section>
  );
};

export default About;
