import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGithub, FiExternalLink, FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { projects } from '../data/projects';
import SystemArchitecture from '../components/SystemArchitecture';

gsap.registerPlugin(ScrollTrigger);

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const project = projects.find(p => p.id === id);

    useEffect(() => {
        if (!project) return;
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            // Massive Title Animation
            gsap.from('.massive-title', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                stagger: 0.1
            });

            // Grid Lines Animation
            gsap.from('.swiss-grid-line', {
                scaleX: 0,
                duration: 1.5,
                ease: 'expo.out',
                stagger: 0.1
            });

            // Content Reveal
            gsap.from('.content-block', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.content-wrapper',
                    start: 'top 80%'
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [project]);

    if (!project) return <div>Project not found</div>;

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* Navigation Overlay */}
            <div className="fixed top-8 left-8 z-50">
                <button
                    onClick={() => navigate('/projects')}
                    className="group flex items-center gap-3 backdrop-blur-md bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full border border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-black transition-all"
                >
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-xs font-mono uppercase tracking-widest hidden md:inline-block">Back to Index</span>
                </button>
            </div>

            {/* Swiss Grid Background (Subtle) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="w-full h-full grid grid-cols-12 gap-0">
                    {[...Array(13)].map((_, i) => (
                        <div key={i} className="swiss-grid-line h-full w-px bg-black/5 dark:bg-white/5 mx-auto" />
                    ))}
                </div>
            </div>

            {/* Hero Section: Massive Typography */}
            <section className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto min-h-[80vh] flex flex-col justify-end">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase break-words mix-blend-difference text-black dark:text-white">
                            {project.title.split(' ').map((word, i) => (
                                <span key={i} className="massive-title block">{word}</span>
                            ))}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mt-12 border-t border-black dark:border-white pt-6">
                    <div className="col-span-12 md:col-span-4 content-block">
                        <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-2">Project ID</span>
                        <span className="text-xl font-light">{project.id}</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 content-block">
                        <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-2">Category</span>
                        <span className="text-xl font-light">{project.category}</span>
                    </div>
                    <div className="col-span-6 md:col-span-4 text-right content-block">
                        <span className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-2">Year</span>
                        <span className="text-xl font-light">{project.year}</span>
                    </div>
                </div>
            </section>

            {/* Asymmetric Content Layout */}
            <div className="content-wrapper relative z-10 px-6 md:px-12 max-w-[1800px] mx-auto pb-40">

                {/* 1. The Brief & Image */}
                <div className="grid grid-cols-12 gap-6 md:gap-12 mb-40">
                    <div className="col-span-12 md:col-span-4 content-block">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">The Brief</h2>
                        <p className="text-2xl md:text-3xl font-light leading-snug">
                            {project.longDescription}
                        </p>

                        <div className="mt-12 flex flex-col gap-4">
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-gray-200 dark:border-gray-800 py-4 hover:border-black dark:hover:border-white transition-colors">
                                <span className="text-lg font-light">View Source Code</span>
                                <FiArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            </a>
                            {project.live && (
                                <a href={project.live} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-gray-200 dark:border-gray-800 py-4 hover:border-black dark:hover:border-white transition-colors">
                                    <span className="text-lg font-light">Live Deployment</span>
                                    <FiArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-8 content-block">
                        <div className="relative aspect-[16/9] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                            <img src={project.image} alt="Project Preview" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                    </div>
                </div>

                {/* 2. Technical Blueprint (Architecture) */}
                <div className="grid grid-cols-12 gap-6 mb-40">
                    <div className="col-span-12 mb-8 content-block">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">Core Architecture</h2>
                        <div className="h-px w-full bg-black dark:bg-white mb-2" />
                        <span className="font-mono text-xs uppercase tracking-widest">System Diagram v1.0</span>
                    </div>
                    <div className="col-span-12 content-block">
                        <SystemArchitecture />
                    </div>
                </div>

                {/* 3. The Engine Room (Data Models & Code) */}
                <div className="grid grid-cols-12 gap-6 md:gap-12">
                    <div className="col-span-12 md:col-span-5 content-block">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">Data Models</h2>

                        {/* Code Block Style Data Model */}
                        <div className="bg-gray-100 dark:bg-gray-900 p-6 md:p-8 font-mono text-xs md:text-sm overflow-x-auto">
                            <div className="flex gap-2 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <pre className="text-gray-600 dark:text-gray-400">
                                <span className="text-purple-600 dark:text-purple-400">model</span> <span className="text-blue-600 dark:text-blue-400">User</span> {'{'} <br />
                                {'  '}<span className="text-red-500">id</span>        UUID <span className="text-green-600 dark:text-green-400">@id @default(uuid())</span><br />
                                {'  '}email     String <span className="text-green-600 dark:text-green-400">@unique</span><br />
                                {'  '}password  String<br />
                                {'  '}role      Role   <span className="text-green-600 dark:text-green-400">@default(USER)</span><br />
                                {'  '}posts     Post[]<br />
                                {'  '}createdAt DateTime <span className="text-green-600 dark:text-green-400">@default(now())</span><br />
                                {'}'}
                            </pre>
                            <br />
                            <pre className="text-gray-600 dark:text-gray-400">
                                <span className="text-purple-600 dark:text-purple-400">model</span> <span className="text-blue-600 dark:text-blue-400">Project</span> {'{'} <br />
                                {'  '}<span className="text-red-500">id</span>        UUID <span className="text-green-600 dark:text-green-400">@id</span><br />
                                {'  '}title     String<br />
                                {'  '}techStack String[]<br />
                                {'  '}owner     User <span className="text-green-600 dark:text-green-400">@relation(fields: [userId])</span><br />
                                {'}'}
                            </pre>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-7 flex flex-col justify-between content-block">
                        <div>
                            <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">Tech Stack</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                                {project.tech.map((tech, i) => (
                                    <div key={i} className="group">
                                        <span className="block font-mono text-[10px] text-gray-400 mb-1">0{i + 1}</span>
                                        <span className="text-xl md:text-2xl font-light group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-default">{tech}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 md:mt-0">
                            <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">Impact & Metrics</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {project.impact?.map((item, i) => (
                                    <div key={i} className="flex items-baseline gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <span className="font-mono text-blue-600 dark:text-blue-400">→</span>
                                        <span className="text-xl font-light">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectDetail;
