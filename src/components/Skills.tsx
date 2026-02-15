import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiServer, FiDatabase, FiTerminal, FiLayers } from 'react-icons/fi';
import ScrollRevealText from './ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoCarouselRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoCarouselRef2 = useRef<HTMLDivElement>(null);
  const logoContainerRef2 = useRef<HTMLDivElement>(null);

  // New Data Structure (Backend/DevOps Focused) - 4 Categories
  const skillCategories = [
    {
      id: '01',
      title: 'Backend Engineering',
      icon: <FiServer size={24} />,
      skills: [
        { name: 'Java (Core & Advanced)', level: 95 },
        { name: 'Spring Boot / MVC', level: 90 },
        { name: 'Spring Security / JWT', level: 85 },
        { name: 'Microservices Arch.', level: 85 },
        { name: 'RESTful API Design', level: 90 },
      ],
    },
    {
      id: '02',
      title: 'Database & Storage',
      icon: <FiDatabase size={24} />,
      skills: [
        { name: 'MySQL / PostgreSQL', level: 85 },
        { name: 'Hibernate / JPA', level: 85 },
        { name: 'Redis / Caching', level: 80 },
        { name: 'Database Design', level: 85 },
        { name: 'Query Optimization', level: 75 },
      ],
    },
    {
      id: '03',
      title: 'DevOps & Cloud',
      icon: <FiTerminal size={24} />,
      skills: [
        { name: 'Docker / Kubernetes', level: 80 },
        { name: 'AWS (EC2, S3, RDS)', level: 75 },
        { name: 'CI/CD (Jenkins)', level: 75 },
        { name: 'Nginx / Reverse Proxy', level: 70 },
        { name: 'Linux Administration', level: 80 },
      ],
    },
    {
      id: '04',
      title: 'Architecture & Core',
      icon: <FiLayers size={24} />,
      skills: [
        { name: 'System Design', level: 80 },
        { name: 'Data Structures & Algo', level: 85 },
        { name: 'Message Queues (Kafka)', level: 75 },
        { name: 'Shell Scripting', level: 75 },
        { name: 'Git / Version Control', level: 90 },
      ],
    },
  ];

  const logos = [
    { name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Spring', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'AWS', src: 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg' },
    { name: 'Linux', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    { name: 'Jenkins', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
    { name: 'MySQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Redis', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Nginx', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
  ];

  const logos2 = [...logos].reverse();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Initial Reveal (Header)
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // 2. Category Cards Reveal (From Original)
      gsap.fromTo(
        categoryRefs.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // 3. Skill Bars Animation (From Original)
      gsap.fromTo(
        barRefs.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          stagger: 0.05,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );

      // 4. Kinetic Ticker Animation
      // Use function to handle dynamic width calculation
      const animateTicker = (ref: React.RefObject<HTMLDivElement>, reverse: boolean = false) => {
        if (!ref.current) return;
        const el = ref.current;
        // Clone children to ensure seamless loop if not already enough
        // (Assuming we rendered 2 sets in JSX, but GSAP needs to know total scrolling width)
        const totalWidth = el.scrollWidth / 2; // Since we doubled it in JSX

        gsap.set(el, { x: reverse ? -totalWidth : 0 }); // Start position

        gsap.to(el, {
          x: reverse ? 0 : -totalWidth,
          duration: 80, // Slower for smoother infinite loop effect
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => {
              const val = parseFloat(x);
              return reverse
                ? (val % totalWidth) - totalWidth
                : val % totalWidth;
            })
          }
        });
      };

      animateTicker(logoCarouselRef, false);
      animateTicker(logoCarouselRef2, true);

      // Scroll Velocity Skew Effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const skew = self.getVelocity() / 300;
          gsap.to([logoCarouselRef.current, logoCarouselRef2.current], {
            skewX: skew,
            overwrite: 'auto',
            duration: 0.1
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen py-24 md:py-32 md:pt-16 px-4 md:px-0 bg-gray-50 dark:bg-black overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* --- Header (Preserved) --- */}
        <div className="mb-20 px-6 md:px-12 border-b border-black/10 dark:border-white/10 pb-12">
          <h2 ref={titleRef} className="text-[12vw] md:text-[8vw] leading-[0.8] font-bold uppercase tracking-tighter text-transparent text-stroke-responsive opacity-40 select-none pointer-events-none mb-4">
            <ScrollRevealText text="TECHNICAL" />
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <span className="text-[12vw] md:text-[8vw] leading-[0.8] font-bold uppercase tracking-tighter text-black dark:text-white">
              <ScrollRevealText text="STACK_" />
            </span>
            <p className="font-mono text-sm max-w-md text-gray-500 text-right pb-2">
                            // SYSTEM_INVENTORY_V2.2<br />
              OPTIMIZED FOR SCALABILITY & PERFORMANCE
            </p>
          </div>
        </div>

        {/* --- Swiss Design Card Layout --- */}
        <div className="flex flex-col md:px-20 gap-6 xs:gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {skillCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              ref={(el) => (categoryRefs.current[catIndex] = el)}
              className="relative bg-white dark:bg-black border border-black dark:border-white p-6 md:p-8 group hover:-translate-y-2 transition-transform duration-500"
            >
              {/* Corner Markers */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black dark:border-white -translate-x-px -translate-y-px"></span>
              <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black dark:border-white translate-x-px -translate-y-px"></span>
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black dark:border-white -translate-x-px translate-y-px"></span>
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black dark:border-white translate-x-px translate-y-px"></span>

              <div className="flex flex-col mb-8">
                <span className="font-mono text-xs text-gray-400 mb-2">
                  [{category.id}] DEVICE_NODE
                </span>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black text-white dark:bg-white dark:text-black">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-black dark:text-white">
                    {category.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2 items-baseline">
                      <span className="font-mono text-xs uppercase tracking-wider text-black dark:text-white">
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs text-gray-500">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full h-[2px] bg-black/10 dark:bg-white/10 overflow-hidden relative">
                      {/* Measuring Ticks */}
                      <div className="absolute top-0 left-0 w-full h-full flex justify-between px-[1px]">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-[1px] h-full bg-black/5 dark:bg-white/5"></div>
                        ))}
                      </div>
                      <div
                        ref={(el) => {
                          const index = catIndex * 10 + skillIndex;
                          barRefs.current[index] = el;
                        }}
                        className="h-full bg-black dark:bg-white origin-left relative"
                        style={{ width: `${skill.level}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-black dark:bg-white"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* --- Creative Kinetic Ticker --- */}
        <div
          className="mt-24 pt-4 pb-12 overflow-hidden relative cursor-crosshair"
          onMouseEnter={() => {
            gsap.to([logoCarouselRef.current, logoCarouselRef2.current], { timeScale: 0, duration: 0.5, overwrite: true });
          }}
          onMouseLeave={() => {
            gsap.to([logoCarouselRef.current, logoCarouselRef2.current], { timeScale: 1, duration: 0.5, overwrite: true });
          }}
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 dark:from-black to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 dark:from-black to-transparent z-20 pointer-events-none"></div>

          {/* Row 1: Left - Enhanced Glow & Infinite Loop */}
          <div className="ticker-wrapper mb-8">
            <div
              ref={logoCarouselRef}
              className="flex gap-8 w-max"
            >
              {[...Array(4)].map((_, i) => ( // Increased to 4 sets for seamless infinite loop on large screens
                <React.Fragment key={`loop-${i}`}>
                  {logos.map((logo, index) => (
                    <div
                      key={`${i}-${index}`}
                      className="group/chip flex items-center gap-3 px-6 py-3 
                               bg-white/50 dark:bg-black/50 backdrop-blur-sm
                               border border-black/10 dark:border-white/10 
                               rounded-full transition-all duration-300
                               shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]
                               hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
                               hover:border-black/30 dark:hover:border-white/30
                               hover:scale-105"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-6 w-6 grayscale group-hover/chip:grayscale-0 transition-all duration-300"
                      />
                      <span className="font-mono text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 group-hover/chip:text-black dark:group-hover/chip:text-white transition-colors">{logo.name}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Row 2: Right - Enhanced Glow & Infinite Loop */}
          <div className="ticker-wrapper">
            <div
              ref={logoCarouselRef2}
              className="flex gap-8 w-max"
            >
              {[...Array(4)].map((_, i) => ( // Increased to 4 sets
                <React.Fragment key={`loop2-${i}`}>
                  {logos2.map((logo, index) => (
                    <div
                      key={`2-${i}-${index}`}
                      className="group/chip flex items-center gap-3 px-6 py-3 
                               bg-white/50 dark:bg-black/50 backdrop-blur-sm
                               border border-black/10 dark:border-white/10 
                               rounded-full transition-all duration-300
                               shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]
                               hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
                               hover:border-black/30 dark:hover:border-white/30
                               hover:scale-105"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-6 w-6 grayscale group-hover/chip:grayscale-0 transition-all duration-300"
                      />
                      <span className="font-mono text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 group-hover/chip:text-black dark:group-hover/chip:text-white transition-colors">{logo.name}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div>


    </section>
  );
};

export default Skills;