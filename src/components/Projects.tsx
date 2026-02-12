// src/components/AwardWinningProjects.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';



gsap.registerPlugin(ScrollTrigger);

// --- Project Data (No Changes) ---
// --- Project Data (Backend & DevOps Focused) ---
const projectsData = [
  {
    number: '01',
    title: 'Collegia',
    description: 'A scalable campus management ERP system built with Microservices architecture, handling distinct academic modules independently.',
    longDescription: 'Designed a distributed system for campus management using Java and Spring Boot. Decomposed monolithic logic into loose couplings (User Auth, Course Service, Assignment Service). Implemented centralized logging and monitoring for effective debugging.',
    tech: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'REST API'],
    category: 'System Design',
    year: '2024',
    status: 'Live',
    liveLink: '#',
    githubLink: '#',
    preview: '/collegiaMockup.png',
    impact: ['Decoupled Services', 'Optimized DB Queries', 'Role-Based Access Control']
  },
  {
    number: '02',
    title: '0xKid',
    description: 'Interactive edtech platform featuring AI-driven code analysis and real-time execution environments for young learners.',
    longDescription: 'Engineered the backend execution engine to safely run user-submitted code in isolated environments (Sandboxing). Integrated OpenAI API for intelligent code feedback. utilized MongoDB for flexible content schema storage involved in gamified learning paths.',
    tech: ['Spring Boot', 'MongoDB', 'Docker', 'OpenAI API', 'WebSocket'],
    category: 'Backend Engineering',
    year: '2024',
    status: 'Development',
    liveLink: '#',
    githubLink: '#',
    preview: '/0xkidMockup.png',
    impact: ['Code Sandboxing', 'Real-time Socket.io', 'Scalable NoSQL Schema']
  },
  {
    number: '03',
    title: 'SkillBloom+',
    description: 'Gamified LMS with automated GitHub verification and real-time progress tracking via webhooks.',
    longDescription: 'Built a robust integration with GitHub API to verify coding challenges aimatedly. Implemented heavy background job processing for calculating user scores and leaderboard rankings without blocking the main thread. Secured endpoints using JWT and OAuth2.',
    tech: ['Spring Boot', 'PostgreSQL', 'GitHub API', 'Docker', 'Redis'],
    category: 'API Integration',
    year: '2023',
    status: 'Live',
    liveLink: '#',
    githubLink: '#',
    preview: '/skillbloom.png',
    impact: ['Webhook Handling', 'Redis Caching', 'Oauth2 Security']
  },
  {
    number: '04',
    title: 'Cloud Portfolio',
    description: 'This portfolio itself—deployed via CI/CD pipelines, containerized with Docker, and optimized for performance.',
    longDescription: 'While visually frontend-heavy, the infrastructure is managed as code. Configured automated build and deploy pipelines using GitHub Actions. Implemented strict CSP headers and optimized asset delivery via CDN strategies.',
    tech: ['CI/CD', 'Docker', 'Nginx', 'Linux', 'React'],
    category: 'DevOps',
    year: '2025',
    status: 'Live',
    liveLink: 'https://your-portfolio-url.com',
    githubLink: '#',
    preview: '/portfolio.png',
    impact: ['Automated Deployment', 'Containerization', 'Infrastructure as Code']
  },
];

// --- Fallback for SplitText (No Changes) ---
const simpleSplitText = (element: HTMLElement) => {
  const text = element.textContent || "";
  element.innerHTML = "";
  for (const char of text) {
    const span = document.createElement('span');
    span.className = 'char inline-block';
    span.textContent = char === ' ' ? '\u00A0' : char;
    element.appendChild(span);
  }
  return Array.from(element.children) as HTMLElement[];
};

// --- NEW: Custom Hook for Media Queries ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

const AwardWinningProjects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // --- State for both Desktop and Mobile ---
  const [activeProject, setActiveProject] = useState<typeof projectsData[0] | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // --- Detect if we're on a large screen (md: 768px and up) ---
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // --- EFFECT: Handles all GSAP animations for DESKTOP ONLY ---
  useEffect(() => {
    // If not on desktop, do nothing.
    if (!isDesktop) {
      gsap.set(previewContainerRef.current, { autoAlpha: 0 });
      gsap.set(cursorRef.current, { scale: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const projectItems = gsap.utils.toArray('.project-item') as HTMLElement[];
      const previewContainer = previewContainerRef.current!;
      const previewImage = previewImageRef.current!;
      const cursor = cursorRef.current!;
      const detailsEl = detailsRef.current!;

      gsap.set(cursor, { scale: 0 });
      gsap.set(previewContainer, { autoAlpha: 0 });

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

      // const xImgTo = gsap.quickTo(previewImage, "x", { duration: 1.2, ease: "power4.out" });
      // const yImgTo = gsap.quickTo(previewImage, "y", { duration: 1.2, ease: "power4.out" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        // const rect = sectionRef.current!.getBoundingClientRect();
        // const relX = e.clientX - rect.left;
        // const relY = e.clientY - rect.top;
        // xImgTo(gsap.utils.mapRange(0, rect.width, -100, 100, relX));
        // yImgTo(gsap.utils.mapRange(0, rect.height, -75, 75, relY));
      };

      const headerChars = simpleSplitText(sectionRef.current!.querySelector('h2')!);
      gsap.from(headerChars, {
        yPercent: 100, opacity: 0, stagger: 0.03, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });

      projectItems.forEach(item => {
        const textMask = item.querySelector('.text-mask')!;
        const otherItems = projectItems.filter(p => p !== item);
        const projectData = projectsData.find(p => p.number === item.dataset.projectNumber);

        item.addEventListener('mouseenter', () => {
          setActiveProject(projectData || null);
          document.addEventListener('mousemove', handleMouseMove);
          gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'expo.out' });
          gsap.to(previewContainer, { autoAlpha: 1, duration: 0.4, ease: 'expo.out' });
          if (previewImage) previewImage.src = projectData?.preview || '';
          gsap.to(textMask, { color: 'transparent', duration: 0.4, ease: 'expo.out' });
          gsap.to(otherItems, { opacity: 0.2, duration: 0.4, ease: 'expo.out' });
          gsap.fromTo(detailsEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
        });

        item.addEventListener('mouseleave', () => {
          setActiveProject(null);
          document.removeEventListener('mousemove', handleMouseMove);
          gsap.to(cursor, { scale: 0, duration: 0.3, ease: 'expo.out' });
          gsap.to(previewContainer, { autoAlpha: 0, duration: 0.4, ease: 'expo.out' });
          gsap.to(textMask, { color: '#bdbbbb', duration: 0.4, ease: 'expo.out' });
          gsap.to(otherItems, { opacity: 1, duration: 0.4, ease: 'expo.out' });
          gsap.to(detailsEl, { opacity: 0, y: 20, duration: 0.5, ease: 'expo.out' });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]); // Re-run effect if viewport size changes across the breakpoint

  // --- HANDLER: For project clicks on MOBILE ---
  const handleMobileProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, projectNumber: string) => {
    if (!isDesktop) {
      e.preventDefault(); // Prevent navigation on first click
      setExpandedProject(prev => (prev === projectNumber ? null : projectNumber));
    }
  };

  return (
    <section ref={sectionRef} className={`relative md:min-h-screen  px-4 sm:px-8 py-20 md:py-32 ${isDesktop ? 'cursor-none' : ''} `}>
      {/* These elements are only used by the desktop animations */}
      {isDesktop && (
        <>
          <div ref={cursorRef} className="fixed top-0 left-0 w-24 h-24 rounded-full bg-[#FF4D00] pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white">
            View
          </div>
          <div ref={previewContainerRef} className="fixed inset-0 z-0 pointer-events-none">
            <img ref={previewImageRef} src="" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-4 sm:mb-20">
            My Selected Works
          </h2>
        </div>

        <div className="">
          {projectsData.map((project) => {
            const isExpanded = expandedProject === project.number;
            return (
              <a
                key={project.number}
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-item group block border-b border-neutral-600"
                data-project-number={project.number}
                onClick={(e) => handleMobileProjectClick(e, project.number)}
              >
                <div className="relative py-6 md:py-8 transition-colors duration-300">
                  <h3 className="text-4xl md:text-8xl font-bold tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                    {project.title}
                  </h3>
                  <h3 className="text-mask absolute inset-0 py-6 md:py-8 text-4xl md:text-8xl font-bold tracking-tighter text-[black] dark:text-white">
                    {project.title}
                  </h3>
                </div>

                {/* --- NEW: Mobile-only expandable section --- */}
                {!isDesktop && (
                  <div className={`transition-[max-height,padding] duration-700 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] pb-6' : 'max-h-0'}`}>
                    <div className="px-1">
                      <img
                        src={project.preview}
                        alt={`${project.title} preview`}
                        className="w-full h-auto object-cover rounded-lg mb-4 border border-neutral-700"
                      />
                      <p className="text-neutral-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map(t => <span key={t} className="px-3 py-1 text-xs text-white bg-neutral-800 border border-neutral-700 rounded-full">{t}</span>)}
                      </div>

                      {/* --- IMPROVED BUTTON CONTAINER --- */}
                      <div className="flex justify-center gap-x-8 mt-4">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-40 inline-flex justify-center items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-md text-sm font-semibold transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                          >
                            Live Demo <FiArrowUpRight />
                          </a>
                        )}

                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-40 inline-flex justify-center items-center gap-2 px-4 py-2 bg-transparent border border-neutral-600 text-neutral-300 rounded-md text-sm font-semibold transition-colors hover:bg-neutral-800 hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                          >
                            <FaGithub /> GitHub
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* --- Fixed Project Details Panel (Desktop Only) --- */}
      {isDesktop && activeProject && (
        <div ref={detailsRef} className="fixed bottom-8 right-8 z-30 pointer-events-none max-w-sm">
          <div className="lg:col-span-4 space-y-6 relative backdrop-blur-md bg-white/5 dark:bg-white/3 border border-white/10 dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-black/10 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-white/3 before:to-transparent before:pointer-events-none">
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-2xl font-light tracking-tight text-white">
                  {activeProject.title}
                </h3>
                <span className="text-xs font-light tracking-widest text-gray-400 uppercase">
                  {activeProject.category}
                </span>
              </div>
              <div className="project-description">
                <p className="text-lg font-light leading-relaxed text-gray-200 mb-4">
                  {activeProject.description}
                </p>
                <p className="text-sm font-light leading-relaxed text-gray-300">
                  {activeProject.longDescription}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-xs font-light tracking-widest text-gray-400 uppercase mb-2">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="tech-tag text-sm font-light tracking-wide text-gray-300 backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 px-3 py-1 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                      data-cursor="-opaque"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      <div className="text-center sm:text-right mt-8 sm:mt-16 sm:pr-8 ">
        <Link
          to="/projects"
          className="inline-flex items-center text-base sm:text-lg font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          View more of my work
          <FiArrowUpRight className="ml-2" size={50} />
        </Link>
      </div>

    </section>
  );
};

export default AwardWinningProjects;