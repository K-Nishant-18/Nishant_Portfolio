import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiDownload } from 'react-icons/fi';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const rolesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Manual SplitText implementation
    const titleElement = titleRef.current;
    if (titleElement) {
      const spans = titleElement.querySelectorAll('span');
      spans.forEach(span => {
        if (span.textContent) {
          const chars = span.textContent.split('');
          span.innerHTML = chars.map(char => 
            `<span class="char inline-block" style="transform-style: preserve-3d;">${char === ' ' ? '&nbsp;' : char}</span>`
          ).join('');
        }
      });
    }

    const tl = gsap.timeline({ delay: 0.8 });

    // SplitText 3D reveal animation - exactly like your example
    tl.from('.char', {
      yPercent: 150,
      opacity: 0,
      rotateX: 360,
      stagger: 0.1,
      duration: 2,
      ease: 'expo.out'
    })
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
        '-=1.5'
      )
      .fromTo(
        rolesRef.current,
        { y: 30, opacity: 0, x: 50 },
        { y: 0, opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
        '-=1'
      )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.6'
      );

    // Enhanced hover effects for characters
    const characters = document.querySelectorAll('.char');
    characters.forEach((char, index) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          y: -15,
          scale: 1.2,
          rotationZ: index % 2 === 0 ? 5 : -5,
          duration: 0.4,
          ease: 'back.out(1.2)'
        });
      });
      
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          y: 0,
          scale: 1,
          rotationZ: 0,
          color: 'inherit',
          textShadow: 'none',
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });

    // Scroll indicator animation
    gsap.to(scrollIndicatorRef.current, {
      y: 15,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center md:items-start px-3 xs:px-4 sm:px-6 py-20 sm:py-8 md:py-24 max-w-7xl mx-auto pb-0 overflow-hidden w-full"
    >
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start md:relative overflow-hidden">
        {/* Left side - Name */}
        <div className="w-full md:w-2/3 flex flex-col items-center md:items-start overflow-hidden">
                    <div ref={titleRef} className="mb-2 sm:mb-4 w-full overflow-hidden max-w-full">
            <h1 className="font-bold text-center md:text-left w-full overflow-hidden max-w-full">
              <span className="block text-7xl xs:text-7xl sm:text-6xl md:text-8xl lg:text-[15rem] leading-[1] tracking-[-0.02em] xs:tracking-[-0.04em] sm:tracking-[-0.08em] overflow-hidden max-w-full">Kumar</span>
              <span className="block text-7xl xs:text-7xl sm:text-6xl md:text-8xl lg:text-[15rem] leading-[0.95] sm:leading-[0.85] -mt-1 xs:-mt-1 sm:-mt-3 md:-mt-12 tracking-[-0.02em] xs:tracking-[-0.04em] sm:tracking-[-0.08em] lg:hidden overflow-hidden max-w-full">Nishant`</span>
              <span className="hidden lg:block text-7xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-[15rem] leading-[0.95] sm:leading-[0.85] -mt-1 xs:-mt-1 sm:-mt-3 md:-mt-12 tracking-[-0.02em] xs:tracking-[-0.04em] sm:tracking-[-0.08em] overflow-hidden max-w-full">Nishant`</span>
            </h1>
          </div>

          <div ref={subtitleRef} className="mb-6 sm:mb-10 ml-0 sm:ml-5 w-full overflow-hidden max-w-full">
            <p className="text-sm xs:text-base sm:text-xl md:text-2xl font- uppercase tracking-wider text-gray-600 dark:text-gray-400 text-center md:text-left w-full max-w-full">
              Full-Stack Developer
            </p>
          </div>

          <div className="ml-0 sm:ml-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-xs sm:text-sm font-light tracking-wide w-full text-center md:text-left overflow-hidden max-w-full">
            <div>
              <p className="text-gray-500 dark:text-gray-500 mb-1 sm:mb-2">CURRENTLY</p>
              <p>Freelancer at Upwork</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-500 mb-1 sm:mb-2">LOCATION</p>
              <p>Bhagalpur, India</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-500 mb-1 sm:mb-2">AVAILABILITY</p>
              <p className='text-green-700 dark:text-green-600 '>Open for projects</p>
            </div>
          </div>
        </div>

        {/* Right side - Roles */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-8 md:mt-0 md:absolute md:bottom-[25%] md:right-0 overflow-hidden">
          <div className="text-center md:text-left w-full md:w-auto overflow-hidden">
            <ul
              ref={rolesRef}
              className="text-sm xs:text-base sm:text-xl md:text-2xl font- uppercase tracking-wider text-gray-950 dark:text-gray-400 space-y-1 sm:space-y-2 text-center md:text-left"
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
        className="relative flex-col items-center mt-12 sm:mt-0 bottom-0 sm:bottom-[130px] left-0 sm:left-[-70px] w-full sm:w-auto hidden sm:flex"
      >
        <div className="w-px h-10 sm:h-16 bg-gray-400 dark:bg-gray-600 mb-2 sm:mb-4"></div>
        <p className="text-[10px] sm:text-xs font-light tracking-widest transform -rotate-90 sm:origin-center origin-top-left">
          SCROLL
        </p>
      </div>

      {/* Download Resume Button for small screens only */}
      <div className="w-full flex justify-center mt-6 pt-10 lg:hidden">
        <a
          href="/previews/resume.pdf"
          download
          className="inline-flex items-center space-x-2 px-6 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 font-light tracking-wide rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300 shadow-sm"
        >
          <FiDownload size={18} />
          <span>Download Resume</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;