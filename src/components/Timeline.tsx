// src/components/Timeline.tsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// --- Milestone Data ---
const milestones = [
    { year: '2018', title: 'First Lines of Code', description: 'Discovered programming through Java fundamentals.', tags: ['Java', 'OOP'] },
    { year: '2020', title: 'Web Development Beginnings', description: 'Built first full-stack project with Spring MVC.', tags: ['Spring', 'MySQL', 'Thymeleaf'] },
    { year: '2021', title: 'Freelance Journey', description: 'Started taking client projects on Upwork.', tags: ['Freelancing', 'Client Work'] },
    { year: '2022', title: 'React Specialization', description: 'Focused on modern frontend development.', tags: ['React.js', 'TypeScript'] },
    { year: '2023', title: 'Full-Stack Mastery', description: 'Developed complex applications with Spring Boot + React.', tags: ['Spring Boot', 'JWT', 'Docker'] },
    { year: '2024', title: 'Open Source Contributions', description: 'Started contributing to OSS and publishing packages.', tags: ['GitHub', 'NPM'] },
];

const Timeline: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const timelineLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timelineItems = gsap.utils.toArray('.timeline-item') as HTMLElement[];
        if (!timelineItems.length) return;

        // Use a GSAP context for safe cleanup
        const ctx = gsap.context(() => {
            // Animate the main timeline spine (this is not responsive, it's the same for all)
            gsap.from(timelineLineRef.current, {
                scaleY: 0,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    end: 'top 40%',
                    scrub: 1,
                }
            });

            // CORRECTED: Use matchMedia for responsive animations
            ScrollTrigger.matchMedia({
                
                // --- DESKTOP ANIMATION ---
                "(min-width: 1024px)": function() {
                    timelineItems.forEach((item) => {
                        const isLeft = item.classList.contains('timeline-item-left');
                        gsap.from(item, {
                            opacity: 0,
                            x: isLeft ? -50 : 50, // Horizontal animation is active
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse',
                            }
                        });
                    });
                },

                // --- MOBILE ANIMATION ---
                "(max-width: 1023px)": function() {
                    timelineItems.forEach((item) => {
                        gsap.from(item, {
                            opacity: 0,
                            y: 20, // No horizontal 'x' animation
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse',
                            }
                        });
                    });
                }
            });

        }, sectionRef);

        return () => ctx.revert(); // Cleanup GSAP context
    }, []);

    return (
        // The `overflow-hidden` class is no longer needed here
        <section ref={sectionRef} className="font-sans py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* --- Header Section --- */}
                <div className="max-w-3xl mx-auto mb-16 lg:mb-24 text-center">
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white">
                        Changelog
                    </h2>
                    <p className="mt-6 text-lg font-light text-gray-600 dark:text-gray-400">
                        A chronological journey through my development career.
                    </p>
                </div>

                {/* --- Timeline Structure --- */}
                <div className="relative pb-4">
                    {/* The central timeline spine */}
                    <div
                        ref={timelineLineRef}
                        className="absolute left-4 lg:left-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-800 origin-top"
                    ></div>

                    <div className="space-y-12 lg:space-y-0">
                        {milestones.map((item, index) => {
                            const isLeft = index % 2 === 0;
                            return (
                                <div
                                    key={index}
                                    className={`timeline-item ${isLeft ? 'timeline-item-left' : 'timeline-item-right'} 
                                     relative flex items-start lg:grid lg:grid-cols-12 gap-x-8 mb-0 lg:mb-0`}
                                >
                                    {/* --- Content Block --- */}
                                    <div className={`
                                        col-span-12 lg:col-span-5
                                        ${isLeft ? 'lg:col-start-1' : 'lg:col-start-8'}
                                        ${isLeft ? 'lg:text-right' : 'lg:text-left'}
                                        pl-10 lg:pl-0 lg:pr-0
                                    `}>
                                        <p className="text-5xl font-light text-red-700 dark:text-red-700">{item.year}</p>
                                        <h3 className="mt-4 text-2xl font-light tracking-tight text-gray-900 dark:text-white">{item.title}</h3>
                                        <p className="mt-3 text-lg font-light text-gray-600 dark:text-gray-400">{item.description}</p>
                                        <div className={`mt-4 flex flex-wrap gap-2 ${isLeft ? 'lg:justify-end' : 'lg:justify-start'}`}>
                                            {item.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-sm font-light tracking-wide text-gray-500 px-3 py-1 border border-gray-200 dark:border-gray-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* --- Connector Dot --- */}
                                    <div className={`
                                        absolute lg:relative w-full 
                                        ${isLeft ? 'lg:col-start-6' : 'lg:col-start-7'}
                                        flex justify-start lg:justify-center items-center h-full
                                    `}>
                                        <div className="absolute left-4 lg:left-1/2 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800"></div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;