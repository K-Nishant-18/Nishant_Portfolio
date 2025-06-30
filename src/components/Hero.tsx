import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const rolesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }
    )
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        rolesRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );

    // Scroll indicator animation
    gsap.to(scrollIndicatorRef.current, {
      y: 50,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-start px-8 py-32 max-w-7xl mx-auto pb-0"
    >
      <div className="w-full flex flex-col md:flex-row justify-between items-start relative">
        {/* Left side - Name */}
        <div className="w-full md:w-2/3">
          <div ref={titleRef} className="mb-4">
            <h1 className="font-bold ">
              <span className="block text-6xl md:text-8xl lg:text-[15rem] leading-[1] tracking-[-0.08em]">Kumar</span>
              <span className="block text-6xl md:text-8xl lg:text-[15rem] leading-[0.85] -mt-12 tracking-[-0.08em]">Nishant`</span>
            </h1>

          </div>

          <div ref={subtitleRef} className="mb-10 ml-5">
            <p className="text-xl md:text-2xl font- uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Full-Stack Developer
            </p>
          </div>

          <div className="ml-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-light tracking-wide">
            <div>
              <p className="text-gray-500 dark:text-gray-500 mb-2">CURRENTLY</p>
              <p>Freelancer at Upwork</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-500 mb-2">LOCATION</p>
              <p>Bhagalpur, India</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-500 mb-2">AVAILABILITY</p>
              <p className='text-green-700 dark:text-green-600 '>Open for projects</p>
            </div>
          </div>
        </div>

        {/* Right side - Roles */}
        <div className="w-full md:w-1/3 flex justify-end mt-8 md:mt-0 md:absolute md:bottom-[25%] md:right-0">
          <div className="text-left">
            <ul
              ref={rolesRef}
              className="text-xl md:md:text-2xl font- uppercase tracking-wider text-gray-950 dark:text-gray-400 space-y-2"
            >
              <li>Web Designer</li>
              <li>Web Developer</li>
              <li>Freelancer</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="relative bottom-[130px] left-[-70px] flex flex-col items-center"
      >
        <div className="w-px h-16 bg-gray-400 dark:bg-gray-600 mb-4"></div>
        <p className="text-xs font-light tracking-widest transform -rotate-90 origin-center">
          SCROLL
        </p>
      </div>
    </section>
  );
};

export default Hero;