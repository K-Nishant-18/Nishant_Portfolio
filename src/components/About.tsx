// src/components/AwardWinningAbout.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AwardWinningAbout: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // --- Refs and State from Original for Cursor Trail ---
    const stackContainerRef = useRef<HTMLDivElement>(null);
    const lastTimeRef = useRef<number>(0);
    const [isTouch, setIsTouch] = useState(false);

    // --- Image array for the trail effect ---
    const images = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.png`);

    // --- Effect for all GSAP animations and event listeners ---
    useEffect(() => {
        // --- Check for touch device once ---
        const checkTouch = () => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();
        window.addEventListener('resize', checkTouch);

        // --- GSAP Context for proper setup and cleanup ---
        const ctx = gsap.context(() => {
            // --- Animate Grid Lines on Scroll (from new layout) ---
            gsap.from(".grid-line", {
                scale: 0,
                stagger: { from: "center", amount: 0.5 },
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });

            // --- Animate Content on Scroll (inspired by original) ---
            if (contentRef.current) {
                gsap.from(contentRef.current.children, {
                    yPercent: 50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 80%",
                    }
                });
            }
        }, sectionRef);

        // --- Cleanup function ---
        return () => {
            ctx.revert();
            window.removeEventListener('resize', checkTouch);
        };
    }, []);

    // --- Mouse Move Handler for Image Trail (from original) ---
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const now = Date.now();
        if (now - lastTimeRef.current < 50) return; // Throttle: run every 50ms max
        lastTimeRef.current = now;

        if (!sectionRef.current || !stackContainerRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Determine which image to show based on horizontal position
        const segment = rect.width / images.length;
        const index = Math.min(Math.floor(x / segment), images.length - 1);

        const img = document.createElement('img');
        img.src = images[index];
        img.alt = `Trail image ${index}`;
        // Styling for the trailing image (from original)
        img.className = 'absolute w-24 h-40 object-cover rounded-lg shadow-xl border border-neutral-300 pointer-events-none';
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transform = `translate(-50%, -50%) scale(0.8)`; // Center on cursor and start smaller
        img.style.opacity = '0';

        stackContainerRef.current.appendChild(img);

        // Animate the image in and out
        gsap.timeline({ onComplete: () => img.remove() })
            .to(img, {
                opacity: 1,
                scale: 1,
                rotation: gsap.utils.random(-10, 10),
                duration: 0.3,
                ease: 'power2.out',
            })
            .to(img, {
                opacity: 0,
                scale: 0.5,
                duration: 0.5,
                ease: 'power2.in',
            }, ">0.4"); // Start fading out after 0.4s
    };

    // --- Mouse Leave Handler to clean up images (from original) ---
    const handleMouseLeave = () => {
        if (!stackContainerRef.current) return;
        // Fade out all currently visible images quickly
        gsap.to(stackContainerRef.current.children, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.05,
            onComplete: () => {
                if (stackContainerRef.current) {
                    stackContainerRef.current.innerHTML = '';
                }
            }
        });
    };

    return (
        <section
            ref={sectionRef}
            id="about"
            onMouseMove={!isTouch ? handleMouseMove : undefined}
            onMouseLeave={!isTouch ? handleMouseLeave : undefined}
            className="relative font-sans py-20 px-4 md:py-40 overflow-hidden cursor-none "
        >
            {/* --- Animated Grid Background (from new layout) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`v-${i}`}
                        className="grid-line absolute top-0 bottom-0 w-px"
                        style={{
                            left: `${(i + 1) * 9}%`,
                            background: 'linear-gradient(to bottom, rgba(217, 217, 217,0.3) 0%, rgba(217, 217, 217,0) 100%)'
                        }}
                    />
                ))}
                {[...Array(5)].map((_, i) => {
                    const opacity = 0.8 - (i * 0.20); // Decreasing opacity for each line
                    return (
                        <div
                            key={`h-${i}`}
                            className="grid-line absolute left-0 right-0 h-px"
                            style={{
                                top: `${(i + 1) * 15}%`,
                                background: `linear-gradient(to bottom, rgba(217, 217, 217,${opacity}) 0%, rgba(217, 217, 217,0) 100%)`
                            }}
                        />
                    );
                })}
            </div>

            {/* --- Image Trail Container (from original) --- */}
            {/* Placed with a z-index between grid and content. pointer-events-none is crucial. */}
            {!isTouch && <div ref={stackContainerRef} className="absolute inset-0 z-[50] pointer-events-none" />}

            {/* --- Main Content (styled like new layout) --- */}
            <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-sm font-bold tracking-widest uppercase text-red-500 mb-8">About Me</h2>
                <div className="space-y-6 text-2xl md:text-5xl font-light leading-snug md:leading-tight">
                    <p>I'm a <span className="text-red-500">Backend & DevOps Engineer</span> who loves building robust, scalable systems that power the web.
                    From designing <span className="text-red-500">distributed microservices</span> to orchestrating <span className="text-red-500">cloud infrastructure</span>, I focus on performance, security, and reliability under the hood.</p>
                    {/* <p>My philosophy: Simple architecture, clean code, and automated deployments.</p> */}
                </div>

                {/* --- Stats Section (from new layout) --- */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t-2 border-neutral-300">
                    <div className="flex flex-col items-center sm:items-start justify-center">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-light">2+</p>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-1">Years Experience</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-start justify-center">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-light">5+</p>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-1">Projects Completed</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-start justify-center">
                        <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-light">AI Literate</p>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-1">Future Ready</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-start justify-center">
                        <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-light">Learning</p>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-1">Always</p>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default AwardWinningAbout;