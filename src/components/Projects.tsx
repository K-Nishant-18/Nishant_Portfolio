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
      className="relative min-h-screen flex items-center px-6 py-32 max-w-7xl mx-auto"
    >
      <div className="w-full">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6 leading-tight">
            Work Showcase
          </h2>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-xl">
            A curated collection of projects blending creativity, logic, and engineering.
          </p>
        </div>

        <div ref={projectsRef} className="space-y-28 relative z-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative border-t border-gray-300 dark:border-gray-700 pt-14 cursor-pointer transition-colors duration-500"
              onMouseMove={(e) => handleMouseEnter(e, project, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-2">
                  <span className="text-6xl font-light text-gray-300 dark:text-gray-700 group-hover:text-gray-500 transition-colors duration-500">
                    {project.number}
                  </span>
                </div>

                <div className="lg:col-span-6 space-y-5">
                  <h3 className="text-3xl md:text-4xl font-light tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-lg font-light text-gray-700 dark:text-gray-300">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 mb-1">YEAR</p>
                    <p className="font-light">{project.year}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 mb-1">STATUS</p>
                    <p className="font-light">{project.status}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 flex justify-end">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
                  >
                    <FiArrowUpRight size={20} />
                  </a>
                </div>
              </div>

              {/* Preview Image at Hover Location */}
              {hoverData?.index === index && (
                <div
                  ref={previewRef}
                  className="absolute z-30 w-72 h-48 overflow-hidden rounded-xl shadow-xl pointer-events-none"
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
          ))}
        </div>

        <div className="mt-28 text-center z-10 relative">
          <Link
            to="/projects"
            className="inline-flex items-center text-lg font-light tracking-wide hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
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