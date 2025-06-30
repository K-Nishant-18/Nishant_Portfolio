import React, { useEffect, useRef } from 'react';
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

  const skillCategories = [
    {
      title: 'Frontend Architecture',
      icon: <FiLayers size={28} />,
      skills: [
        { name: 'React Ecosystem', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'State Management', level: 85 },
        { name: 'Performance Optimization', level: 80 },
      ],
    },
    {
      title: 'Backend Systems',
      icon: <FiServer size={28} />,
      skills: [
        { name: 'Spring Framework', level: 90 },
        { name: 'REST API Design', level: 85 },
        { name: 'Microservices', level: 80 },
        { name: 'Authentication', level: 85 },
      ],
    },
    {
      title: 'Data Engineering',
      icon: <FiDatabase size={28} />,
      skills: [
        { name: 'Database Design', level: 85 },
        { name: 'SQL Optimization', level: 80 },
        { name: 'NoSQL Solutions', level: 75 },
        { name: 'Data Pipelines', level: 70 },
      ],
    },
    {
      title: 'Development Practices',
      icon: <FiCode size={28} />,
      skills: [
        { name: 'Clean Code', level: 90 },
        { name: 'Testing', level: 85 },
        { name: 'CI/CD', level: 80 },
        { name: 'Agile Methodologies', level: 85 },
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
    { name: 'Tailwind CSS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
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

      // Logo carousel animation
      if (logoCarouselRef.current && logoContainerRef.current) {
        const logoWidth = 100; // Width of each logo container
        const totalWidth = logoWidth * logos.length;
        
        // Set container width to fit all logos
        logoCarouselRef.current.style.width = `${totalWidth * 2}px`;
        
        // Infinite loop animation
        gsap.to(logoCarouselRef.current, {
          x: `-=${totalWidth}`,
          duration: 30,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen flex items-center px-4 sm:px-8 py-32 pb-24 max-w-7xl mx-auto text-center overflow-hidden"
    >
      {/* Swiss Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical Lines */}
        {[...Array(13)].map((_, i) => (
          <div
            key={`vline-${i}`}
            ref={el => (gridLineRefs.current[i] = el)}
            className="absolute top-0 bottom-0 w-px bg-gray-400 dark:bg-gray-600"
            style={{
              left: `${(i + 1) * 8}%`,
              transformOrigin: 'top center',
            }}
          />
        ))}
        
        {/* Horizontal Lines */}
        {[...Array(9)].map((_, i) => (
          <div
            key={`hline-${i}`}
            ref={el => (gridLineRefs.current[i + 13] = el)}
            className="absolute left-0 right-0 h-px bg-gray-600 dark:bg-gray-500"
            style={{
              top: `${(i + 1) * 10}%`,
              transformOrigin: 'left center',
            }}
          />
        ))}
        
        {/* Grid Dots at Intersections */}
        {[...Array(117)].map((_, i) => {
          const col = i % 13;
          const row = Math.floor(i / 13);
          return (
            <div
              key={`dot-${i}`}
              ref={el => (gridDotRefs.current[i] = el)}
              className="absolute w-1 h-1 rounded-full bg-gray-800 dark:bg-gray-400"
              style={{
                left: `${(col + 1) * 8}%`,
                top: `${(row + 1) * 10}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>

      <div className="w-full relative z-10">
        <div className="mb-20">
          <h2
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight mb-6 leading-tight text-gray-900 dark:text-white"
          >
            Weapon of Choice
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            A systematic approach to modern software development
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {skillCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              ref={(el) => (categoryRefs.current[catIndex] = el)}
              className="relative bg-white dark:bg-gray-900 p-6 sm:p-8 border border-gray-100 dark:border-gray-800 rounded-lg hover:shadow-lg transition-all duration-500 group"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 mr-4 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300">
                  {React.cloneElement(category.icon, {
                    className:
                      'text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black transition-colors duration-300',
                  })}
                </div>
                <h3 className="text-xl font-light tracking-tight text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">
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

        {/* Logo Carousel */}
        <div 
          ref={logoContainerRef}
          className="mt-20 mb-0 overflow-hidden relative"
        >
          <div 
            ref={logoCarouselRef}
            className="flex items-center py-0"
          >
            {/* Duplicate logos for seamless looping */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={`loop-${i}`}>
                {logos.map((logo, index) => (
                  <div 
                    key={`${i}-${index}`}
                    className="flex flex-col items-center justify-center mx-6"
                    style={{ minWidth: '100px' }}
                  >
                    <div className="h-12 w-12 flex items-center justify-center">
                      <img 
                        src={logo.src} 
                        alt={logo.name}
                        className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-2 text-xs font-light text-gray-500 dark:text-gray-400">
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