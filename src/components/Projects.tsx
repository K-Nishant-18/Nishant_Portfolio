import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const projects = [
  {
    id: '01',
    title: 'COLLEGIA',
    category: 'System\nArchitecture',
    year: '2024',
    description: 'A scalable campus ERP system built with Microservices (Spring Boot). Handles discrete academic modules with independent scaling.',
    tech: ['Java', 'Microservices', 'Docker'],
    link: '#',
    color: '#FF4D00', // A vibrant Swiss orange/red
  },
  {
    id: '02',
    title: '0XKID',
    category: 'Backend\nEngineering',
    year: '2024',
    description: 'Interactive ed-tech platform with AI code analysis. Sandboxed execution environments for safe code running.',
    tech: ['MongoDB', 'WebSockets', 'OpenAI'],
    link: '#',
    color: '#FF4D00', // International Klein Blue
  },
  {
    id: '03',
    title: 'SKILL\nBLOOM',
    category: 'API\nIntegration',
    year: '2023',
    description: 'Gamified LMS with automated GitHub verification Webhooks and Redis caching for leaderboards.',
    tech: ['PostgreSQL', 'Redis', 'OAuth2'],
    link: '#',
    color: '#FF4D00', // Jade
  }
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative bg-gray-50 dark:bg-black text-black dark:text-white min-h-[100vh] py-12 px-4 sm:px-8 font-sans overflow-hidden md:px-12">

      {/* Background Decor: massive Swiss Grid */}
      <div
        className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 pointer-events-none opacity-10"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`border-r border-black dark:border-white h-full last:border-r-0 ${i % 2 !== 0 ? 'hidden md:block' : ''}`}></div>
        ))}
      </div>

      <div className="max-w-[1920px] mx-auto relative z-10 w-full">

        {/* Header: Small, Technical */}
        <div className="text-center  mb-24 md:pb-12 border-b border-black/50 dark:border-white/50 pb-4">
          <h2 className="text-xl font-mono uppercase tracking-widest">[ My Selected Works ]</h2>

        </div>

        {/* --- PROJECT 01: COLLEGIA (Left Heavy) --- */}
        <div className="group relative mb-24 md:mb-8 grid grid-cols-1 md:grid-cols-12 gap-x-8 items-start">
          {/* Meta (Absolute Left) */}
          <div className="col-span-12 md:col-span-2 md:sticky md:top-32 self-start mb-8 md:mb-0">
            <span className="text-sm font-mono block mb-2 text-red-600">01 / 2024</span>
            <h4 className="text-xl font-bold uppercase leading-tight whitespace-pre-wrap text-black dark:text-white">{projects[0].category}</h4>
            <div className="h-px w-8 bg-black dark:bg-white my-4"></div>
            <ul className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-1">
              {projects[0].tech.map(t => <li key={t}>{t}</li>)}
            </ul>
          </div>

          {/* Title (Massive, Spanning) */}
          <div className="col-span-12 md:col-span-10 md:col-start-3 relative z-20">
            <Link to={projects[0].link} className="block">
              <h3 className="text-[14vw] md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] transition-all duration-300 text-black dark:text-white hover:italic hover:text-transparent hover:[-webkit-text-stroke:1px_black] dark:hover:[-webkit-text-stroke:1px_white]">
                {projects[0].title}
              </h3>
            </Link>
            <div className="mt-8 max-w-md text-black dark:text-white">
              <p className="text-lg leading-snug">{projects[0].description}</p>
              <div className="mt-6 flex gap-4">
                <Link to={projects[0].link} className="flex items-center gap-2 text-xs font-bold uppercase border-b border-current pb-1 hover:text-[#FF4D00]">Live <FiArrowUpRight /></Link>
              </div>
            </div>
          </div>
        </div>


        {/* --- PROJECT 02: 0XKID (Right Heavy) --- */}
        <div className="group relative mb-24 md:mb-8 grid grid-cols-1 md:grid-cols-12 gap-x-8 items-start">
          {/* Title (Massive, Right Aligned) */}
          <div className="col-span-12 md:col-span-10 md:col-start-1 order-2 md:order-2 text-right relative z-20">
            <Link to={projects[1].link} className="block">
              <h3 className="text-[14vw] md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] transition-all duration-300 text-right text-black dark:text-white hover:italic hover:text-transparent hover:[-webkit-text-stroke:1px_black] dark:hover:[-webkit-text-stroke:1px_white]">
                {projects[1].title}
              </h3>
            </Link>
            <div className="mt-8 max-w-md ml-auto text-left text-black dark:text-white">
              <p className="text-lg leading-snug">{projects[1].description}</p>
              <div className="mt-6 flex gap-4">
                <Link to={projects[1].link} className="flex items-center gap-2 text-xs font-bold uppercase border-b border-current pb-1 hover:text-[#0057FF]">Live <FiArrowUpRight /></Link>
              </div>
            </div>
          </div>

          {/* Meta (Right) */}
          <div className="col-span-12 md:col-span-2 order-1 md:order-3 md:sticky md:top-32 self-start mb-8 md:mb-0 text-right flex flex-col items-end">
            <span className="text-sm font-mono block mb-2 text-red-600">02 / 2024</span>
            <h4 className="text-xl font-bold uppercase leading-tight whitespace-pre-wrap text-black dark:text-white">{projects[1].category}</h4>
            <div className="h-px w-8 bg-black dark:bg-white my-4"></div>
            <ul className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-1">
              {projects[1].tech.map(t => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>


        {/* --- PROJECT 03: SKILLBLOOM (Left Heavy) --- */}
        <div className="group relative mb-4 grid grid-cols-1 md:grid-cols-12 gap-x-8 items-start pb-24">
          {/* Meta (Absolute Left) */}
          <div className="col-span-12 md:col-span-2 md:sticky md:top-32 self-start mb-8 md:mb-0">
            <span className="text-sm font-mono block mb-2 text-red-600">03 / 2023</span>
            <h4 className="text-xl font-bold uppercase leading-tight whitespace-pre-wrap text-black dark:text-white">{projects[2].category}</h4>
            <div className="h-px w-8 bg-black dark:bg-white my-4"></div>
            <ul className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-1">
              {projects[2].tech.map(t => <li key={t}>{t}</li>)}
            </ul>
          </div>

          {/* Title (Massive, Spanning) */}
          <div className="col-span-12 md:col-span-10 md:col-start-3 relative z-20">
            <Link to={projects[2].link} className="block">
              <h3 className="text-[14vw] md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] transition-all duration-300 text-black dark:text-white hover:italic hover:text-transparent hover:[-webkit-text-stroke:1px_black] dark:hover:[-webkit-text-stroke:1px_white]">
                SKILL<br />BLOOM+
              </h3>
            </Link>
            <div className="mt-8 max-w-md text-black dark:text-white">
              <p className="text-lg leading-snug">{projects[2].description}</p>
              <div className="mt-6 flex gap-4">
                <Link to={projects[2].link} className="flex items-center gap-2 text-xs font-bold uppercase border-b border-current pb-1 hover:text-[#00A86B]">Live <FiArrowUpRight /></Link>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Projects;
