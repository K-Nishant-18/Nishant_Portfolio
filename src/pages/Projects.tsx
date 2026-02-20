import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGithub, FiExternalLink, FiArrowUpRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import Footer from '../components/Footer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.hero-word', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.1
      });

      // Grid Lines & content stagger
      gsap.from('.grid-cell', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 85%'
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* Swiss Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="w-full h-full grid grid-cols-6 lg:grid-cols-12 gap-0">
          {[...Array(13)].map((_, i) => (
            <div key={i} className="h-full w-px bg-black/5 dark:bg-white/5 mx-auto" />
          ))}
        </div>
      </div>

      {/* Hero Section: Monumental Typography */}
      <section className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="border-b border-black dark:border-white pb-6 mb-12">
          <h1 className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase mix-blend-difference text-black dark:text-white">
            <span className="hero-word block">Engineer</span>
            <span className="hero-word block pl-[10vw]">ing_</span>
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <p className="font-mono text-sm leading-relaxed uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Directory of Technical Solutions<br />
              System Architectures &<br />
              Full-Stack Implementations
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-9 text-right">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Index v2.4 — {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>

      {/* Datasheet Grid */}
      <section className="relative z-10 px-6 md:px-12 pb-32 max-w-[1800px] mx-auto">

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-0 border-b border-black dark:border-white py-2 font-mono text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-0">
          <div className="col-span-1 md:col-span-1 text-center">ID</div>
          <div className="col-span-8 md:col-span-5">Project Name</div>
          <div className="hidden md:block col-span-4">Tech Stack</div>
          <div className="hidden md:block col-span-2 text-right">Year</div>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="grid-cell group grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors duration-300 cursor-pointer overflow-hidden relative"
            >

              {/* Background Hover Effect */}
              <div className="absolute inset-0 bg-gray-100 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* ID */}
              <div className="col-span-12 md:col-span-1 py-6 md:py-8 flex items-center justify-center font-mono text-xs text-gray-400 group-hover:text-black dark:group-hover:text-white relative z-10">
                {`0${index + 1}`}
              </div>

              {/* Main Content (Image + Title) */}
              <div className="col-span-12 md:col-span-5 py-6 md:py-8 px-4 flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-16 bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight group-hover:translate-x-2 transition-transform duration-300">{project.title}</h2>
                  <span className="md:hidden font-mono text-xs text-gray-400 uppercase tracking-widest mt-1 block">{project.category}</span>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="hidden md:flex col-span-4 py-8 items-center relative z-10">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {project.tech.slice(0, 3).map((t, i) => (
                    <span key={i} className="font-mono text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="font-mono text-xs text-gray-400 uppercase">+ {project.tech.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Year & Arrow */}
              <div className="hidden md:flex col-span-2 py-8 px-4 items-center justify-end font-mono text-sm relative z-10">
                <span className="mr-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{project.year}</span>
                <FiArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>

            </div>
          ))}
        </div>

      </section>
      <Footer />
    </div>
  );
};

export default Projects;