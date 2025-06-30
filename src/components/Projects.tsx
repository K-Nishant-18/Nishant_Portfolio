import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number | null>(null);
  const [hoverData, setHoverData] = useState<{
    preview: string;
    x: number;
    y: number;
    index: number;
  } | null>(null);

  const projects = [
    {
      number: '01',
      title: 'Collegia',
      description: 'A comprehensive student platform for academic management and collaboration.',
      tech: ['Java', 'Spring MVC', 'React.js', 'MySQL'],
      year: '2024',
      status: 'Live',
      link: 'https://github.com/K-Nishant-18',
      preview: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg',
    },
    {
      number: '02',
      title: 'The Cultural Circuit',
      description: 'A platform dedicated to preserving and sharing cultural heritage.',
      tech: ['Spring Boot', 'React.js', 'JWT', 'MongoDB'],
      year: '2024',
      status: 'Development',
      link: 'https://github.com/K-Nishant-18',
      preview: 'https://images.pexels.com/photos/318238/pexels-photo-318238.jpeg',
    },
    {
      number: '03',
      title: 'SkillBloom+',
      description: 'An advanced learning platform with integrated GitHub tracking.',
      tech: ['Spring Boot', 'React.js', 'Docker', 'GitHub API'],
      year: '2023',
      status: 'Live',
      link: 'https://github.com/K-Nishant-18',
      preview: 'https://images.pexels.com/photos/3584994/pexels-photo-3584994.jpeg',
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      projectsRef.current?.children,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.25,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  useEffect(() => {
    if (hoverData && previewRef.current && prevIndexRef.current !== null && prevIndexRef.current !== hoverData.index) {
      gsap.fromTo(
        previewRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }
      );
    }
    prevIndexRef.current = hoverData?.index ?? null;
  }, [hoverData]);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    project: any,
    index: number
  ) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverData({ preview: project.preview, x, y, index });
  };

  const handleMouseLeave = () => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setHoverData(null);
          prevIndexRef.current = null;
        },
      });
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-2 sm:px-4 md:px-6 py-20 md:py-32 max-w-7xl mx-auto"
    >
      <div className="w-full">
        <div className="mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-4 md:mb-6 leading-tight">
            Work Showcase
          </h2>
          <p className="text-base sm:text-lg font-light text-gray-600 dark:text-gray-400 max-w-xl">
            A curated collection of projects blending creativity, logic, and engineering.
          </p>
        </div>

        {/* Mobile Layout: Card style, only visible on small screens */}
        <div className="flex flex-col gap-8 md:hidden px-2 sm:px-4">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
            >
              <img
                src={project.preview}
                alt={project.title + ' preview'}
                className="w-full h-40 object-cover"
              />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-gray-300 dark:text-gray-700">
                    {project.number}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                    {project.status}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Year: {project.year}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    View <FiArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Desktop Layout: Only visible on md and up */}
        <div ref={projectsRef} className="hidden md:block space-y-16 md:space-y-28 relative z-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative border-t border-gray-300 dark:border-gray-700 pt-8 md:pt-14 cursor-pointer transition-colors duration-500"
              onMouseMove={(e) => handleMouseEnter(e, project, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col md:grid md:lg:grid-cols-12 gap-6 md:gap-10 items-start">
                <div className="md:col-span-2 mb-2 md:mb-0 flex md:block justify-between items-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-300 dark:text-gray-700 group-hover:text-gray-500 transition-colors duration-500">
                    {project.number}
                  </span>
                  <div className="block md:hidden ml-4 md:ml-0">
                    <img
                      src={project.preview}
                      alt="Preview"
                      className="w-32 h-20 rounded-lg object-cover shadow-md mt-0"
                    />
                  </div>
                </div>
                <div className="md:col-span-6 space-y-3 md:space-y-5">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-base sm:text-lg font-light text-gray-700 dark:text-gray-300">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 md:px-3 md:py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-row md:flex-col gap-4 md:gap-0 mt-4 md:mt-0">
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 mb-1">YEAR</p>
                    <p className="font-light">{project.year}</p>
                  </div>
                  <div className="ml-8 md:ml-0">
                    <p className="text-xs tracking-wide text-gray-500 mb-1">STATUS</p>
                    <p className="font-light">{project.status}</p>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end mt-4 md:mt-0">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
                  >
                    <FiArrowUpRight size={18} className="md:size-20" />
                  </a>
                </div>
                {hoverData?.index === index && (
                  <div
                    ref={previewRef}
                    className="hidden md:block absolute z-30 w-72 h-48 overflow-hidden rounded-xl shadow-xl pointer-events-none"
                    style={{
                      top: hoverData.y,
                      left: hoverData.x,
                      transform: 'translate(30%, -50%)',
                    }}
                  >
                    <img
                      src={hoverData.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-28 text-center z-10 relative">
          <Link
            to="/projects"
            className="inline-flex items-center text-base sm:text-lg font-light tracking-wide hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
          >
            View all Projects
            <FiArrowUpRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;