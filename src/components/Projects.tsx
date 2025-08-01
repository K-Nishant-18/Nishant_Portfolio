// src/components/AwardWinningProjects.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // Premium plugin, or use the fallback
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger, SplitText);

// --- Project Data ---
const projectsData = [
    { number: '01', title: 'Collegia', description: 'Collegia is an all-in-one platform designed to enhance the overall student experience in colleges by integrating several essential features.', tech: ['Java', 'Spring MVC', 'React.js', 'MySQL'], year: '2024', status: 'Live', link: '#', preview: '/collegiaMockup.png' },
    { number: '02', title: '0xKid', description: 'A0xKid is a futuristic edtech platform that merges interactive gameplay, real coding challenges, and AI guidance to help children learn programming in a fun, visual, and structured way.', tech: ['Spring Boot', 'React.js', 'JWT', 'MongoDB'], year: '2024', status: 'Development', link: '#', preview: '/0xkidMockup.png' },
    { number: '03', title: 'SkillBloom+', description: 'SkillBloom+ is a gamified platform that rewards learning with points, badges, and career perks—helping users Learn → Earn → Grow through challenges, mentoring, and collaboration.', tech: ['Spring Boot', 'React.js', 'Docker', 'GitHub API'], year: '2023', status: 'Live', link: '#', preview: '/skillbloom.png' },
    {
      "number": "04",
      "title": "Portfolio v3",
      "description": "My personal craftboard—a portfolio built to be a product in itself, reflecting my passion for clean code, user experience, and modern web technologies.",
      "tech": ["TypeScript", "Next.js", "Tailwind CSS"],
      "year": "2025",
      "status": "Live",
      "link": "https://your-portfolio-url.com",
      "preview": "/portfolio.png"
    }
  ];

// Fallback for GSAP's premium SplitText plugin
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


const AwardWinningProjects: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const previewImageRef = useRef<HTMLImageElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const [activeProject, setActiveProject] = useState<typeof projectsData[0] | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const projectItems = gsap.utils.toArray('.project-item') as HTMLElement[];
            const previewContainer = previewContainerRef.current!;
            const previewImage = previewImageRef.current!;
            const cursor = cursorRef.current!;
            const detailsEl = detailsRef.current!;

            // --- Initial Setup ---
            gsap.set(cursor, { scale: 0 });
            gsap.set(previewContainer, { autoAlpha: 0 });

            // --- Smooth Cursor Following ---
            const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
            const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
            const scaleTo = gsap.quickTo(cursor, "scale", { duration: 0.5, ease: "power3" });

            // --- Parallax Image Movement ---
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

            // --- Animate Section Header ---
            const headerChars = simpleSplitText(sectionRef.current!.querySelector('h2')!);
            gsap.from(headerChars, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.03,
                duration: 1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            });

            // --- Setup Hover Interactions for each item ---
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
    }, []);

    return (
        <div className=''>
            <section ref={sectionRef} className="relative min-h-screen text-[#f1f1f1] px-4 sm:px-8 py-20 md:py-32 cursor-none">
                {/* --- Custom Cursor --- */}
                <div ref={cursorRef} className="fixed top-0 left-0 w-24 h-24 rounded-full bg-[#FF4D00] pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white">
                    View
                </div>
                
                {/* --- Background Image Preview --- */}
                <div ref={previewContainerRef} className="fixed inset-0 z-0 pointer-events-none">
                    <img ref={previewImageRef} src="" alt="" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                <div className="mb-10 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight mb-4 sm:mb-28 text-red-800">
                  My Selected Works
                </h2>
                
              </div>

                    <div className="border-b border-neutral-400">
                        {projectsData.map((project) => (
                            <a
                                key={project.number}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                // MODIFICATION 1: Add `group` and `relative` classes
                                className="project-item group relative block border-b border-neutral-400"
                                data-project-number={project.number}
                            >
                                <div className="relative py-8">
                                    <h3 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px #1A1A1A' }}>
                                        {project.title}
                                    </h3>
                                    <h3 className="text-mask absolute inset-0 py-8 text-5xl md:text-8xl font-bold tracking-tighter ">
                                        {project.title}
                                    </h3>
                                </div>

                                {/* MODIFICATION 2: Add the hover-activated button */}
                                <div className="
                                    absolute right-4 top-1/2 -translate-y-1/2
                                    flex h-12 w-12 items-center justify-center rounded-md border-2 border-black
                                    opacity-0 scale-75 transition-all duration-300 ease-out
                                    group-hover:opacity-100 group-hover:scale-100
                                ">
                                    <FiArrowUpRight className="h-6 w-6 text-black" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                
                {/* --- Fixed Project Details Panel --- */}
                <div ref={detailsRef} className="fixed bottom-8 right-8 z-30 pointer-events-none">
                    {activeProject && (
                        <div className="text-white">
                            <p className="text-lg">Nº - {activeProject.number}</p>
                            <p className="max-w-md mt-2">{activeProject.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {activeProject.tech.map(t => <span key={t} className="px-2 py-1 text-sm border-2 border-red-600 rounded-full">{t}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AwardWinningProjects;