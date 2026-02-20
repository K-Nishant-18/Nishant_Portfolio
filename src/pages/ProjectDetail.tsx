import { useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { projects } from '../data/projects';
import ArchitectureTabs from '../components/ArchitectureTabs';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const project = projects.find(p => p.id === id);

    useLayoutEffect(() => {
        if (!project) return;
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.from('.massive-title', {
                y: 100, opacity: 0, duration: 1.5, ease: 'power4.out', stagger: 0.1
            });
            gsap.from('.swiss-grid-line', {
                scaleX: 0, duration: 1.5, ease: 'expo.out', stagger: 0.1
            });
            gsap.from('.content-block', {
                y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
                scrollTrigger: { trigger: '.content-wrapper', start: 'top 80%' }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [project]);

    if (!project) return <div>Project not found</div>;

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* Navigation Overlay */}
            <div className="fixed top-24 left-6 md:top-32 md:left-12 z-50">
                <button
                    onClick={() => navigate('/projects')}
                    className="group flex items-center gap-3 backdrop-blur-md bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] hover:bg-white dark:hover:bg-black transition-all duration-300"
                >
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-red-500" />
                    <span className="text-xs font-mono uppercase tracking-widest hidden md:inline-block text-black dark:text-white">Back to Index</span>
                </button>
            </div>

            {/* Swiss Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="w-full h-full grid grid-cols-6 md:grid-cols-12 gap-0">
                    {[...Array(13)].map((_, i) => (
                        <div key={i} className={`swiss-grid-line h-full w-px bg-black/10 dark:bg-white/10 mx-auto ${i % 2 !== 0 ? 'hidden md:block' : ''}`} />
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-36 md:pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto min-h-[50vh] md:min-h-[80vh] flex flex-col justify-end">
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

            {/* Content */}
            <div className="content-wrapper relative z-10 px-6 md:px-12 max-w-[1800px] mx-auto pb-40">

                {/* 1. The Brief & Image */}
                <div className="grid grid-cols-12 gap-6 md:gap-12 mb-40">
                    <div className="col-span-12 md:col-span-4 content-block">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">The Brief</h2>
                        <p className="text-2xl md:text-3xl font-light leading-snug">{project.longDescription}</p>
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

                {/* 2. The Engine Room */}
                <div className="grid grid-cols-12 gap-6 md:gap-12 mb-40">

                    {/* LEFT: Tech Stack & Impact */}
                    <div className="col-span-12 md:col-span-7 content-block flex flex-col gap-20">

                        {/* Tech Stack — Mosaic Grid Cells */}
                        <div>
                            <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">Tech Stack</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-black/10 dark:border-white/10">
                                {project.tech.map((tech, i) => (
                                    <div
                                        key={i}
                                        className="group border-b border-r border-black/10 dark:border-white/10 p-5 relative overflow-hidden cursor-default bg-white dark:bg-black hover:bg-black dark:hover:bg-white transition-colors duration-300"
                                    >
                                        {/* Background index number */}
                                        <span className="absolute right-3 bottom-2 text-5xl font-bold text-black/5 dark:text-white/5 group-hover:text-white/5 dark:group-hover:text-black/5 pointer-events-none select-none leading-none transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="block font-mono text-[9px] text-gray-400 group-hover:text-white/50 dark:group-hover:text-black/50 mb-2 tracking-widest uppercase transition-colors">
                                            tech.{String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="block text-base md:text-lg font-semibold tracking-tight group-hover:text-white dark:group-hover:text-black transition-colors">
                                            {tech}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Impact — Horizontal stats */}
                        <div>
                            <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">Impact & Metrics</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10 border border-black/10 dark:border-white/10 mt-4 bg-white dark:bg-black">
                                {project.impact?.map((item, i) => {
                                    const match = item.match(/^([^\s]+)\s+(.+)$/);
                                    const big = match ? match[1] : null;
                                    const rest = match ? match[2] : item;
                                    return (
                                        <div key={i} className="group flex flex-col justify-between gap-3 p-5 hover:bg-black dark:hover:bg-white transition-colors duration-300 cursor-default">
                                            <span className="font-mono text-[9px] text-gray-400 group-hover:text-white/50 dark:group-hover:text-black/50 tracking-widest uppercase transition-colors">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            {big ? (
                                                <span className="text-2xl md:text-3xl font-bold tabular-nums tracking-tighter text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300 leading-none">
                                                    {big}
                                                </span>
                                            ) : null}
                                            <span className="text-xs font-light text-gray-500 dark:text-gray-400 group-hover:text-white/70 dark:group-hover:text-black/70 transition-colors leading-snug">{rest}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Key Challenges & Solutions */}
                    <div className="col-span-12 md:col-span-5 content-block">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-8 text-black dark:text-white border-b border-black dark:border-white pb-4 inline-block">Key Challenges & Solutions</h2>
                        <div className="flex flex-col gap-4">
                            {project.challenges?.map((challenge, i) => (
                                <div key={i} className="group border border-black/10 dark:border-white/10 p-4 md:p-5 hover:border-black dark:hover:border-white transition-colors duration-300 bg-white dark:bg-black relative overflow-hidden">
                                    <div className="absolute -right-3 -top-4 text-[5rem] font-bold text-black/5 dark:text-white/5 pointer-events-none select-none transition-transform group-hover:scale-110 duration-500">
                                        0{i + 1}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                                            <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">Critical Challenge</span>
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold mb-2 leading-tight">{challenge.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 font-light leading-relaxed border-l-2 border-red-500/20 pl-3">
                                            {challenge.description}
                                        </p>
                                        <div className="pt-4 border-t border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                                                <span className="font-mono text-[10px] text-green-600 dark:text-green-400 tracking-widest uppercase">Engineered Solution</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-medium leading-relaxed">{challenge.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Technical Blueprint */}
                <div className="grid grid-cols-12 gap-6 mb-16">
                    <div className="col-span-12 mb-6 content-block">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">Core Architecture</h2>
                        <div className="h-px w-full bg-black dark:bg-white mb-2" />
                        <div className="flex items-center gap-4 mt-2">
                            <span className="font-mono text-xs uppercase tracking-widest text-gray-400">System Design</span>
                            <span className="font-mono text-xs text-gray-300 dark:text-gray-600">— 4 views</span>
                        </div>
                    </div>
                    <div className="col-span-12">
                        {project.architecture ? (
                            <ArchitectureTabs architecture={project.architecture} projectId={project.id} />
                        ) : (
                            <div className="border border-black/10 dark:border-white/10 p-12 text-center">
                                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Architecture diagram coming soon</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ProjectDetail;
