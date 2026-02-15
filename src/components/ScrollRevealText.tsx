import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
    text: string;
    className?: string; // Class for the container/text style (e.g. font size, bold)
    charClassName?: string; // Class for individual chars (e.g. text-stroke)
    triggerStart?: string;
    stagger?: number;
    duration?: number;
}

const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
    text,
    className = "",
    charClassName = "",
    triggerStart = "top 90%",
    stagger = 0.05,
    duration = 0.5
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const spans = containerRef.current?.querySelectorAll('.reveal-char');
            if (!spans || spans.length === 0) return;

            // Force initial state immediately to prevent FOUC
            gsap.set(spans, {
                opacity: 0,
                filter: "blur(12px)",
                y: 20,
                scale: 1.1
            });

            // Blur Reveal Animation (Apple/Modern Style)
            gsap.to(spans,
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: stagger,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: triggerStart,
                        toggleActions: "play none none reverse"
                    }
                }
            );

        }, containerRef);

        // Refresh ScrollTrigger to ensure correct positions after layout calculation
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            ctx.revert();
            clearTimeout(timer);
        };
    }, [text, triggerStart, stagger]);

    return (
        <div ref={containerRef} className={`inline-block ${className}`}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className={`reveal-char inline-block ${charClassName}`}
                    style={{ minWidth: char === ' ' ? '0.3em' : 'auto' }} // Preserve space width
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
};

export default ScrollRevealText;
