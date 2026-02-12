import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const SystemArchitecture: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Grid Lines
            gsap.fromTo('.grid-line',
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 0.2, duration: 1.5, stagger: 0.1, ease: "power2.out" }
            );

            // Animate Nodes (Blueprint drawing effect)
            gsap.from('.arch-node', {
                strokeDashoffset: 1000,
                strokeDasharray: 1000,
                duration: 2,
                ease: "power2.inOut",
                stagger: 0.2
            });

            gsap.from('.node-label', {
                opacity: 0,
                y: 10,
                duration: 0.8,
                delay: 1,
                stagger: 0.1
            });

            // Animate Data Flow Lines
            gsap.to('.flow-line', {
                strokeDashoffset: -20,
                duration: 1,
                repeat: -1,
                ease: "none"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[400px] md:h-[500px] bg-gray-50 dark:bg-black border border-black/10 dark:border-white/10 overflow-hidden flex items-center justify-center font-mono">

            {/* Metric Grid Background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div key={`h-${i}`} className="grid-line absolute w-full h-px bg-black/10 dark:bg-white/10" style={{ top: `${i * 5}%` }} />
                ))}
                {[...Array(20)].map((_, i) => (
                    <div key={`v-${i}`} className="grid-line absolute h-full w-px bg-black/10 dark:bg-white/10 origin-top" style={{ left: `${i * 5}%` }} />
                ))}
            </div>

            {/* Blueprint Diagram */}
            <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 400">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-black dark:text-white" />
                    </marker>
                </defs>

                {/* Connection Lines */}
                <path d="M100,200 L200,200" className="stroke-black dark:stroke-white flow-line" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
                <path d="M300,200 L400,200" className="stroke-black dark:stroke-white flow-line" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
                <path d="M500,150 L600,150" className="stroke-black dark:stroke-white flow-line" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
                <path d="M500,250 L600,250" className="stroke-black dark:stroke-white flow-line" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />

                {/* Branching from API Gateway */}
                <path d="M450,200 L450,150 L500,150" className="stroke-black dark:stroke-white" fill="none" strokeWidth="1" />
                <path d="M450,200 L450,250 L500,250" className="stroke-black dark:stroke-white" fill="none" strokeWidth="1" />


                {/* Nodes (Geometric Shapes) */}
                {/* Client */}
                <g className="arch-node">
                    <rect x="20" y="160" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white" />
                    <text x="60" y="205" textAnchor="middle" className="node-label text-[10px] fill-black dark:fill-white uppercase tracking-widest">Client</text>
                </g>

                {/* Load Balancer */}
                <g className="arch-node">
                    <circle cx="250" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white" />
                    <text x="250" y="205" textAnchor="middle" className="node-label text-[10px] fill-black dark:fill-white uppercase tracking-widest">LB</text>
                </g>

                {/* API Gateway */}
                <g className="arch-node">
                    <rect x="400" y="150" width="50" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white" />
                    <text x="425" y="205" textAnchor="middle" className="node-label text-[10px] fill-black dark:fill-white uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>GATEWAY</text>
                </g>

                {/* Service A */}
                <g className="arch-node">
                    <rect x="600" y="120" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white" />
                    <rect x="605" y="125" width="90" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/50 dark:text-white/50" />
                    <text x="650" y="155" textAnchor="middle" className="node-label text-[10px] fill-black dark:fill-white uppercase tracking-widest">AUTH SVC</text>
                </g>

                {/* Service B */}
                <g className="arch-node">
                    <rect x="600" y="220" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white" />
                    <rect x="605" y="225" width="90" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/50 dark:text-white/50" />
                    <text x="650" y="255" textAnchor="middle" className="node-label text-[10px] fill-black dark:fill-white uppercase tracking-widest">CORE API</text>
                </g>

            </svg>

            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-black/40 dark:text-white/40 tracking-widest uppercase">
                Figure 1.1: High-Level Architecture
            </div>
        </div>
    );
};

export default SystemArchitecture;
