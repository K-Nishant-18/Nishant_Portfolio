import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCode, FiServer, FiDatabase, FiLayers } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoCarouselRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoCarouselRef2 = useRef<HTMLDivElement>(null);
  const logoContainerRef2 = useRef<HTMLDivElement>(null);

  const skillCategories = [
    {
      title: 'Frontend',
      icon: <FiLayers size={28} />,
      skills: [
        { name: 'React.js', level: 90 },
        { name: 'Vite', level: 85 },
        { name: 'HTML5 / CSS3', level: 90 },
        { name: 'Tailwind CSS', level: 80 },
      ],
    },
    {
      title: 'Backend & DevOps',
      icon: <FiServer size={28} />,
      skills: [
        { name: 'Spring Boot / MVC', level: 90 },
        { name: 'Docker', level: 75 },
        { name: 'JWT / Spring Security', level: 85 },
        { name: 'Git & GitHub', level: 90 },
      ],
    },
    {
      title: 'Databases & Cloud',
      icon: <FiDatabase size={28} />,
      skills: [
        { name: 'MySQL', level: 85 },
        { name: 'MongoDB', level: 75 },
        { name: 'Vercel', level: 80 },
        { name: 'Heroku', level: 70 },
      ],
    },
    {
      title: 'Tools & Productivity',
      icon: <FiCode size={28} />,
      skills: [
        { name: 'Postman / API Testing', level: 85 },
        { name: 'Figma / Canva / Spline', level: 80 },
        { name: 'Notion / MS Office', level: 90 },
        { name: 'AI Tools (ChatGPT, Claude, etc.)', level: 85 },
      ],
    },
  ];
  

  const logos = [
    { name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'C', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Vite', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg' },
    { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Tailwind CSS', src: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' },
    { name: 'Spring', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'MySQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Maven', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg' },
    { name: 'Postman', src: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg' },
    { name: 'IntelliJ', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg' },
    { name: 'VS Code', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Vercel', src: 'https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg' },
    { name: 'Heroku', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg' },
    { name: 'Figma', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  ];

  // Duplicate for second carousel
  const logos2 = [
    { name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'C', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Vite', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg' },
    { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Tailwind CSS', src: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' },
    { name: 'Spring', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'MySQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Maven', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg' },
    { name: 'Postman', src: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg' },
    { name: 'IntelliJ', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg' },
    { name: 'VS Code', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Vercel', src: 'https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg' },
    { name: 'Heroku', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg' },
    { name: 'Figma', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  ];

  // Responsive grid: fixed for large screens, square for mobile
  const [gridConfig, setGridConfig] = useState({ vLines: 13, hLines: 9, dotCols: 13, dotRows: 9, totalDots: 117 });
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const updateGrid = () => {
      const mobile = window.innerWidth < 640; // sm breakpoint
      setIsMobile(mobile);
      if (!sectionRef.current) return;
      if (mobile) {
        const rect = sectionRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const minSpacing = 48;
        const vLines = Math.max(3, Math.round(width / minSpacing));
        const hLines = Math.max(2, Math.round(height / minSpacing));
        const dotCols = vLines;
        const dotRows = hLines;
        const totalDots = dotCols * dotRows;
        setGridConfig({ vLines, hLines, dotCols, dotRows, totalDots });
      } else {
        setGridConfig({ vLines: 13, hLines: 9, dotCols: 13, dotRows: 9, totalDots: 117 });
      }
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
  
      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
  
      // Category cards animation
      gsap.fromTo(
        categoryRefs.current,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
  
      // Skill bars animation
      gsap.fromTo(
        barRefs.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.8,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );
  
      // Grid lines animation
      gsap.fromTo(
        gridLineRefs.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 0.1,
          duration: 2,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
  
      // Grid dots animation
      gsap.fromTo(
        gridDotRefs.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.15,
          duration: 1.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
  
      // Logo carousel animation (first - right to left)
      if (logoCarouselRef.current && logoContainerRef.current) {
        const logoWidth = 100;
        const totalWidth = logoWidth * logos.length;
        logoCarouselRef.current.style.width = `${totalWidth * 2}px`;
  
        gsap.to(logoCarouselRef.current, {
          x: `-=${totalWidth}`,
          duration: 60,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
          },
        });
      }
  
      // Logo carousel animation (second - left to right)
      if (logoCarouselRef2.current && logoContainerRef2.current) {
        const logoWidth = 100;
        const totalWidth = logoWidth * logos2.length;
        logoCarouselRef2.current.style.width = `${totalWidth * 2}px`;
  
        gsap.to(logoCarouselRef2.current, {
          x: `+=${totalWidth}`,
          duration: 60,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => (parseFloat(x) % totalWidth) - totalWidth),
          },
        });
      }
    }, sectionRef);
  
    return () => ctx.revert();
  }, []);
  

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen flex items-center px-2 sm:px-8 py-20 sm:py-32 pb-16 sm:pb-24 max-w-full sm:max-w-7xl mx-auto text-center overflow-hidden"
    >
      {/* Swiss Grid Background - Fixed for large screens, square for mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical Lines */}
        {[...Array(gridConfig.vLines)].map((_, i) => (
          <div
            key={`vline-${i}`}
            ref={el => (gridLineRefs.current[i] = el)}
            className={`absolute top-0 bottom-0 w-px bg-gray-400 dark:bg-gray-600 opacity-10`}
            style={{
              left: `${(i + 1) * (100 / (gridConfig.vLines + 1))}%`,
              transformOrigin: 'top center',
            }}
          />
        ))}
        {/* Horizontal Lines */}
        {[...Array(gridConfig.hLines)].map((_, i) => (
          <div
            key={`hline-${i}`}
            ref={el => (gridLineRefs.current[i + gridConfig.vLines] = el)}
            className={`absolute left-0 right-0 h-px bg-gray-600 dark:bg-gray-500 opacity-10`}
            style={{
              top: `${(i + 1) * (100 / (gridConfig.hLines + 1))}%`,
              transformOrigin: 'left center',
            }}
          />
        ))}
        {/* Grid Dots at Intersections */}
        {[...Array(gridConfig.totalDots)].map((_, i) => {
          const col = i % gridConfig.dotCols;
          const row = Math.floor(i / gridConfig.dotCols);
          return (
            <div
              key={`dot-${i}`}
              ref={el => (gridDotRefs.current[i] = el)}
              className={`absolute rounded-full bg-gray-800 dark:bg-gray-400 ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'}`} 
              style={{
                left: `${(col + 1) * (100 / (gridConfig.dotCols + 1))}%`,
                top: `${(row + 1) * (100 / (gridConfig.dotRows + 1))}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>

      <div className="w-full relative z-10">
        <div className="mb-10 sm:mb-20">
          <h2
            ref={titleRef}
            className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-light tracking-tight mb-4 sm:mb-6 leading-tight text-gray-900 dark:text-white"
          >
            Weapon of Choice
          </h2>
          <p
            ref={subtitleRef}
            className="text-base xs:text-lg font-light text-gray-600 dark:text-gray-400 max-w-xs xs:max-w-2xl mx-auto"
          >
            Not just tools — these are the weapons I use to build, break, and create.
          </p>
        </div>

        {/* Responsive grid: stack on mobile, grid on sm+ */}
        <div className="flex flex-col gap-6 xs:gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {skillCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              ref={(el) => (categoryRefs.current[catIndex] = el)}
              className="relative bg-white dark:bg-gray-900 p-4 xs:p-6 sm:p-8 border border-gray-100 dark:border-gray-800 rounded-lg hover:shadow-lg transition-all duration-500 group mx-6 sm:mx-0"
            >
              <div className="flex items-center mb-4 xs:mb-6">
                <div className="p-2 xs:p-3 rounded-full bg-gray-50 dark:bg-gray-800 mr-3 xs:mr-4 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300">
                  {React.cloneElement(category.icon, {
                    className:
                      'text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black transition-colors duration-300',
                  })}
                </div>
                <h3 className="text-lg xs:text-xl font-light tracking-tight text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4 xs:space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-1 xs:mb-2">
                      <span className="text-xs xs:text-sm font-light text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        ref={(el) => {
                          const index = catIndex * category.skills.length + skillIndex;
                          barRefs.current[index] = el;
                        }}
                        className="h-full rounded-full bg-gray-900 dark:bg-gray-100 origin-left group-hover:bg-red-600 dark:group-hover:bg-red-600 transition-colors duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logo Carousel - responsive size */}
        <div 
          ref={logoContainerRef}
          className="mt-12 xs:mt-10 sm:pt-2 md:pt-6 mb-0 pb-0 overflow-hidden relative"
        >
          <div 
            ref={logoCarouselRef}
            className="flex items-center py-2 xs:py-0"
          >
            {/* Duplicate logos for seamless looping */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={`loop-${i}`}>
                {logos.map((logo, index) => (
                  <div 
                    key={`${i}-${index}`}
                    className="flex flex-col items-center justify-center mx-3 xs:mx-6 sm:mx-6"
                    style={{ minWidth: '64px', maxWidth: '100px' }}
                  >
                    <div className="h-8 w-8 xs:h-12 xs:w-12 sm:h-12 sm:w-12 flex items-center justify-center">
                      <img 
                        src={logo.src} 
                        alt={logo.name}
                        className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-1 xs:mt-2 text-[10px] xs:text-xs sm:text-xs font-light text-gray-500 dark:text-gray-400">
                      {logo.name}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Logo Carousel(second) - responsive size */}
        <div 
          ref={logoContainerRef2}
          className="mt-2 xs:mt-4 sm:pt-0 md:pt-0 mb-0 overflow-hidden relative"
        >
          <div 
            ref={logoCarouselRef2}
            className="flex items-center py-2 xs:py-0"
          >
            {/* Duplicate logos for seamless looping */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={`loop2-${i}`}>
                {logos2.map((logo, index) => (
                  <div 
                    key={`2-${i}-${index}`}
                    className="flex flex-col items-center justify-center mx-3 xs:mx-6 sm:mx-6"
                    style={{ minWidth: '64px', maxWidth: '100px' }}
                  >
                    <div className="h-8 w-8 xs:h-12 xs:w-12 sm:h-12 sm:w-12 flex items-center justify-center">
                      <img 
                        src={logo.src} 
                        alt={logo.name}
                        className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-1 xs:mt-2 text-[10px] xs:text-xs sm:text-xs font-light text-gray-500 dark:text-gray-400">
                      {logo.name}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;