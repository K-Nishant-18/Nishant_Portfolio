import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiMapPin } from 'react-icons/fi';

// Register plugin
gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const milestones = [
    {
      year: '2018',
      title: 'First Lines of Code',
      description: 'Discovered programming through Java fundamentals',
      tags: ['Java', 'OOP'],
    },
    {
      year: '2020',
      title: 'Web Development Beginnings',
      description: 'Built first full-stack project with Spring MVC',
      tags: ['Spring', 'MySQL', 'Thymeleaf'],
    },
    {
      year: '2021',
      title: 'Freelance Journey',
      description: 'Started taking client projects on Upwork',
      tags: ['Freelancing', 'Client Work'],
    },
    {
      year: '2022',
      title: 'React Specialization',
      description: 'Focused on modern frontend development',
      tags: ['React.js', 'TypeScript'],
    },
    {
      year: '2023',
      title: 'Full-Stack Mastery',
      description: 'Developed complex applications with Spring Boot + React',
      tags: ['Spring Boot', 'JWT', 'Docker'],
    },
    {
      year: '2024',
      title: 'Open Source Contributions',
      description: 'Started contributing to OSS and publishing packages',
      tags: ['GitHub', 'NPM'],
    },
  ];

  useEffect(() => {
    const timeline = timelineRef.current;
    const section = sectionRef.current;
    const items = gsap.utils.toArray('.timeline-item') as HTMLElement[];

    if (window.innerWidth >= 1024) {
      // Desktop: horizontal scroll, pin, horizontal line
      const ctx = gsap.context(() => {
        const totalWidth = items.length * 400;
        if (timeline && section) {
          // Horizontal scroll with smoother easing
          gsap.to(timeline, {
            x: () => -Math.max(0, totalWidth - window.innerWidth + 200),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 0.5, // Reduced for smoother scrubbing
              start: 'top top',
              end: () => `+=${totalWidth}`,
              anticipatePin: 1, // Prevents jerky pinning
            },
          });

          // Line animation (horizontal) with better timing
          if (lineRef.current) {
            gsap.fromTo(
              lineRef.current,
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: 'left center',
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top center',
                  end: () => `+=${totalWidth}`,
                  scrub: 0.5,
                },
              }
            );
          }

          // Animate each item with staggered timing and better triggers
          items.forEach((item) => {
            gsap.fromTo(
              item,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'left 85%',
                  end: 'left 15%',
                  toggleActions: 'play none none reverse',
                  scrub: false, // Disable scrub for individual items
                },
              }
            );
          });

          ScrollTrigger.refresh();
        }
      }, sectionRef);

      const delayRefresh = setTimeout(() => ScrollTrigger.refresh(), 1000);
      return () => {
        ctx.revert();
        clearTimeout(delayRefresh);
      };
    } else {
      // Mobile: vertical scroll, vertical line
      const ctx = gsap.context(() => {
        // Animate vertical line with better timing
        if (lineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'top center',
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'bottom bottom',
                scrub: 0.5,
              },
            }
          );
        }
        
        // Animate each item with better timing and easing
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 15%',
                toggleActions: 'play none none reverse',
                scrub: false, // Disable scrub for individual items
              },
            }
          );
        });
        
        ScrollTrigger.refresh();
      }, sectionRef);
      
      const delayRefresh = setTimeout(() => ScrollTrigger.refresh(), 1000);
      return () => {
        ctx.revert();
        clearTimeout(delayRefresh);
      };
    }
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center px-4 sm:px-8 py-16 sm:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight mb-4 sm:mb-8">
          Changelog
        </h2>
        <p className="text-base sm:text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
          A chronological journey through my development career
        </p>
      </div>

      {/* Timeline line: horizontal for large screens, vertical for small screens */}
      <div className="relative w-full sm:h-1 h-full sm:w-full flex sm:block justify-center mb-10 sm:mb-24">
        {/* Vertical line for mobile */}
        <div
          ref={lineRef}
          className="absolute sm:hidden left-6 top-0 w-1 h-full bg-gray-200 dark:bg-gray-800 origin-top"
        ></div>
        {/* Horizontal line for desktop */}
        <div
          ref={lineRef}
          className="hidden sm:block absolute top-0 left-0 h-full w-full bg-gray-900 dark:bg-gray-100 origin-left"
        ></div>
      </div>

      {/* Timeline items: vertical for mobile, horizontal scroll for desktop */}
      <div className="relative">
        <div
          ref={timelineRef}
          className="flex sm:flex-row flex-col sm:space-x-24 space-x-0 sm:pl-8 pl-0"
        >
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="timeline-item flex-shrink-0 sm:w-80 w-full relative flex sm:block items-start sm:items-stretch mb-12 sm:mb-0"
            >
              {/* Connector pin */}
              <FiMapPin
                className="absolute sm:-top-7 sm:left-3 sm:-translate-x-1/2 left-1.5 top-1.5 text-gray-900 dark:text-gray-100"
                size={24}
              />
              <div className="ml-10 sm:ml-0">
                <div className="mb-2 sm:mb-6">
                  <span className="text-3xl sm:text-6xl font-light text-gray-300 dark:text-gray-700">
                    {milestone.year}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-light tracking-tight mb-2 sm:mb-4">
                  {milestone.title}
                </h3>

                <p className="text-base sm:text-lg font-light text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  {milestone.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {milestone.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs sm:text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 px-3 py-1 border border-gray-200 dark:border-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Final card */}
          <div className="timeline-item flex-shrink-0 sm:w-80 w-full flex flex-col justify-center relative mb-12 sm:mb-0">
            {/* Connector pin */}
            <FiMapPin
              className="absolute sm:-top-7 sm:left-3 sm:-translate-x-1/2 left-1.5 top-1.5 text-gray-900 dark:text-gray-100"
              size={24}
            />
            <div className="ml-10 sm:ml-0">
              <div className="border rounded-md border-red-600 dark:border-red-800 p-6 sm:p-8 group hover:border-green-600 dark:hover:border-green-600 transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-light tracking-tight mb-2 sm:mb-4">
                  What's Next?
                </h3>
                <p className="text-base sm:text-lg font-light text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  Let's build something remarkable together
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-base sm:text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                >
                  Get in touch
                  <FiArrowUpRight className="ml-2" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
