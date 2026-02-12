import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCornerDownRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const AwardWinningAbout: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

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
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                }
            });

            // 1. Grid Lines Reveal
            tl.from(".grid-line", {
                scaleY: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.inOut",
                transformOrigin: "top"
            })
                // 2. Crosshairs Reveal
                .from(".grid-crosshair", {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "back.out(1.7)"
                }, "-=0.8")
                // 3. Title Reveal
                .fromTo(".about-title-char", {
                    y: 100,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.03,
                    ease: "power4.out"
                }, "-=0.5")
                // 4. Content Reveal
                .from(".about-content-item", {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }, "-=0.8");

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
        img.className = 'absolute w-24 h-40 object-cover grayscale brightness-125 contrast-125 border border-black dark:border-white pointer-events-none z-[60]';
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transform = `translate(-50%, -50%) scale(0.8)`; // Center on cursor and start smaller
        img.style.opacity = '0';

        stackContainerRef.current.appendChild(img);

        // Animate the image in and out
        gsap.timeline({ onComplete: () => img.remove() })
            .to(img, {
                opacity: 0.8,
                scale: 1,
                rotation: gsap.utils.random(-5, 5),
                duration: 0.2,
                ease: 'power2.out',
            })
            .to(img, {
                opacity: 0,
                scale: 0.5,
                duration: 0.3,
                ease: 'power2.in',
            }, ">0.2"); // Start fading out after 0.2s
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

    const stats = [
        { label: "EXP_YRS", value: "02+", desc: "Years Experience" },
        { label: "PRJ_CMP", value: "05+", desc: "Projects Completed" },
        { label: "AI_RDY", value: "YES", desc: "Future Ready" },
        { label: "STATUS", value: "ACT", desc: "Always Learning", active: true },
    ];

    return (
        <section
            ref={sectionRef}
            id="about"
            onMouseMove={!isTouch ? handleMouseMove : undefined}
            onMouseLeave={!isTouch ? handleMouseLeave : undefined}
            className="relative font-sans py-24 md:py-32 px-6 md:px-12 overflow-hidden cursor-crosshair min-h-screen flex flex-col justify-center"
        >
            {/* --- Swiss Grid Background --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Vertical Lines */}
                <div className="absolute inset-0 flex justify-between px-6 md:px-12 max-w-[1800px] mx-auto w-full h-full">
                    {[...Array(6)].map((_, i) => (
                        <div key={`v-${i}`} className="relative h-full">
                            <div className="grid-line w-px h-full bg-black/5 dark:bg-white/5"></div>
                            {/* Crosshairs at intersections */}
                            {[...Array(5)].map((_, j) => (
                                <div key={`ch-${i}-${j}`} className="grid-crosshair absolute -left-[3px] w-[7px] h-[7px] border-l border-t border-black/20 dark:border-white/20" style={{ top: `${(j + 1) * 20}%` }}></div>
                            ))}
                        </div>
                    ))}
                </div>
                {/* Horizontal Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-24 h-full">
                    {[...Array(5)].map((_, i) => (
                        <div key={`h-${i}`} className="grid-line h-px w-full bg-black/5 dark:bg-white/5"></div>
                    ))}
                </div>
            </div>

            {/* --- Image Trail Container --- */}
            {!isTouch && <div ref={stackContainerRef} className="absolute inset-0 z-[50] pointer-events-none" />}

            {/* --- Main Content --- */}
            <div ref={contentRef} className="relative z-10 max-w-[1800px] mx-auto w-full">

                {/* Header: Monumental Outline Text */}
                <div className="mb-16 md:mb-24 relative">
                    <div className="flex items-center gap-4 mb-4">
                        <FiCornerDownRight className="text-red-500 w-6 h-6" />
                        <span className="font-mono text-xs uppercase tracking-widest text-red-500">Identity // Bio</span>
                    </div>
                    <h2 ref={titleRef} className="text-[10vw] leading-[0.8] font-bold uppercase tracking-tighter text-transparent text-stroke-responsive opacity-20 select-none pointer-events-none">
                        {"WHO_I_AM".split('').map((char, i) => (
                            <span key={i} className="about-title-char inline-block">{char}</span>
                        ))}
                    </h2>
                    <div className="absolute top-1/2 left-0 md:left-1/4 transform -translate-y-1/2 w-full md:w-2/3 pl-6 border-l-2 border-red-500">
                        <p className="about-content-item text-lg md:text-2xl font-light leading-relaxed text-black dark:text-white mix-blend-difference">
                            I architect <span className="font-bold">high-performance backend ecosystems</span> using <span className="font-bold text-red-500">Java</span> and <span className="font-bold text-red-500">Spring Boot</span>. My expertise lies in leveraging <span className="font-bold">Spring MVC</span>, <span className="font-bold">Spring Security</span>, and <span className="font-bold">JPA</span> to engineer robust APIs and optimize complex data layers.
                        </p>
                        <p className="about-content-item text-lg md:text-2xl font-light leading-relaxed text-black dark:text-white mix-blend-difference mt-6">
                            Beyond key-strokes, I leverage <span className="font-bold">DevOps</span> principles to bridge development and operations. I utilize <span className="font-bold">CI/CD</span>, <span className="font-bold">Linux</span>, and <span className="font-bold">AWS</span> alongside <span className="font-bold">Docker</span> to orchestrate resilient infrastructure, ensuring seamless, automated delivery.
                        </p>
                    </div>
                </div>

                {/* --- Stats Section: Datasheet Grid --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-black/10 dark:border-white/10">
                    {stats.map((stat, index) => (
                        <div key={index} className="about-content-item border-r border-b border-black/10 dark:border-white/10 p-6 md:p-8 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-red-500 transition-colors">{stat.label}</span>
                                {stat.active && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                            </div>
                            <div className="text-4xl md:text-5xl font-mono font-light mb-2">{stat.value}</div>
                            <div className="text-xs font-mono uppercase text-gray-400">{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                 .text-stroke-responsive {
                    -webkit-text-stroke: 1px black;
                 }
                 .dark .text-stroke-responsive {
                    -webkit-text-stroke: 1px white;
                 }
            `}</style>
        </section>
    );
};

export default AwardWinningAbout;