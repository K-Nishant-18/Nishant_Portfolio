// src/components/AwardWinningProjects.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

// --- Project Data (No Changes) ---
const projectsData = [
    { number: '01', title: 'Collegia', description: 'Collegia is an all-in-one platform designed to enhance the overall student experience in colleges by integrating several essential features.', tech: ['Java', 'Spring MVC', 'React.js', 'MySQL'], year: '2024', status: 'Live', link: '#', preview: '/collegiaMockup.png' },
    { number: '02', title: '0xKid', description: 'A0xKid is a futuristic edtech platform that merges interactive gameplay, real coding challenges, and AI guidance to help children learn programming in a fun, visual, and structured way.', tech: ['Spring Boot', 'React.js', 'JWT', 'MongoDB'], year: '2024', status: 'Development', link: '#', preview: '/0xkidMockup.png' },
    { number: '03', title: 'SkillBloom+', description: 'SkillBloom+ is a gamified platform that rewards learning with points, badges, and career perks—helping users Learn → Earn → Grow through challenges, mentoring, and collaboration.', tech: ['Spring Boot', 'React.js', 'Docker', 'GitHub API'], year: '2023', status: 'Live', link: '#', preview: '/skillbloom.png' },
    { number: '04', title: 'Portfolio v3', description: 'My personal craftboard—a portfolio built to be a product in itself, reflecting my passion for clean code, user experience, and modern web technologies.', tech: ['TypeScript', 'Next.js', 'Tailwind CSS'], year: '2025', status: 'Live', link: 'https://your-portfolio-url.com', preview: '/portfolio.png' },
];

// --- Fallback for SplitText (No Changes) ---
const simpleSplitText = (element: HTMLElement) => {
    const text = element.textContent || "";
    element.innerHTML = "";
    for (let char of text) {
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
            
            const xImgTo = gsap.quickTo(previewImage, "x", { duration: 1.2, ease: "power4.out" });
            const yImgTo = gsap.quickTo(previewImage, "y", { duration: 1.2, ease: "power4.out" });

            const handleMouseMove = (e: MouseEvent) => {
                xTo(e.clientX);
                yTo(e.clientY);
                const rect = sectionRef.current!.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;
                xImgTo(gsap.utils.mapRange(0, rect.width, -100, 100, relX));
                yImgTo(gsap.utils.mapRange(0, rect.height, -75, 75, relY));
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
        <section ref={sectionRef} className={`relative md:min-h-screen text-[#f1f1f1] px-4 sm:px-8 py-20 md:py-32 ${isDesktop ? 'cursor-none' : ''}`}>
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
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-item group block border-b border-neutral-600"
                                data-project-number={project.number}
                                onClick={(e) => handleMobileProjectClick(e, project.number)}
                            >
                                <div className="relative py-6 md:py-8 transition-colors duration-300">
                                    <h3 className="text-4xl md:text-8xl font-bold tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px #333' }}>
                                        {project.title}
                                    </h3>
                                    <h3 className="text-mask absolute inset-0 py-6 md:py-8 text-4xl md:text-8xl font-bold tracking-tighter text-[#bdbbbb]">
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
                                             <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF4D00] text-white rounded-md text-sm font-semibold">
                                                View Project <FiArrowUpRight />
                                            </a>
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
                <div ref={detailsRef} className="fixed bottom-8 right-8 z-30 pointer-events-none">
                    <div className="text-white p-4 bg-black/30 backdrop-blur-sm rounded-lg">
                        <p className="text-lg">Nº - {activeProject.number}</p>
                        <p className="max-w-sm mt-2">{activeProject.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {activeProject.tech.map(t => <span key={t} className="px-2 py-1 text-sm border border-white/50 rounded-full">{t}</span>)}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AwardWinningProjects;