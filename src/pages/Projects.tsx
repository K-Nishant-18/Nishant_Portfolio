import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiGithub, FiExternalLink } from 'react-icons/fi';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const techRefs = useRef<(HTMLDivElement | null)[]>([]);
  const impactRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const projects = [
    {
      number: '01',
      title: 'Collegia',
      description: 'A comprehensive student platform for academic management and collaboration with real-time features.',
      longDescription: 'Collegia is a full-featured student management platform that streamlines academic processes. Built with Java Spring MVC and React.js, it features user authentication, course management, assignment tracking, and real-time notifications.',
      tech: ['Java', 'Spring MVC', 'React.js', 'MySQL', 'Spring Security'],
      year: '2024',
      status: 'Live',
      category: 'Full-Stack',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      github: 'https://github.com/K-Nishant-18',
      live: 'https://github.com/K-Nishant-18',
      impact: ['500+ Students', '15+ Institutions', '99.9% Uptime'],
    },
    {
      number: '02',
      title: 'The Cultural Circuit',
      description: 'A platform dedicated to preserving and sharing cultural heritage with interactive features.',
      longDescription: 'The Cultural Circuit connects communities through cultural preservation and sharing. Features include cultural event management, heritage documentation, community forums, and multimedia galleries.',
      tech: ['Spring Boot', 'React.js', 'JWT', 'MongoDB', 'AWS S3'],
      year: '2024',
      status: 'Development',
      category: 'Full-Stack',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
      github: 'https://github.com/K-Nishant-18',
      live: null,
      impact: ['Cultural Preservation', 'Community Building', 'Heritage Documentation'],
    },
    {
      number: '03',
      title: 'SkillBloom+',
      description: 'An advanced learning platform with integrated GitHub tracking and skill assessment.',
      longDescription: 'SkillBloom+ is a comprehensive learning management system that tracks student progress through GitHub integration. Features include course management, skill assessments, progress tracking, and automated certificate generation.',
      tech: ['Spring Boot', 'React.js', 'Docker', 'GitHub API', 'PostgreSQL'],
      year: '2023',
      status: 'Live',
      category: 'EdTech',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      github: 'https://github.com/K-Nishant-18',
      live: 'https://github.com/K-Nishant-18',
      impact: ['1000+ Learners', 'GitHub Integration', 'Automated Assessments'],
    },
    {
      number: '04',
      title: 'E-Commerce API',
      description: 'RESTful API for e-commerce platform with advanced security and payment integration.',
      longDescription: 'A robust e-commerce API built with Spring Boot, featuring user management, product catalog, order processing, payment integration, and comprehensive security measures.',
      tech: ['Spring Boot', 'Spring Security', 'JWT', 'MySQL', 'Stripe API'],
      year: '2023',
      status: 'Live',
      category: 'Backend',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      github: 'https://github.com/K-Nishant-18',
      live: null,
      impact: ['Secure Payments', 'RESTful Design', 'Scalable Architecture'],
    },
    {
      number: '05',
      title: 'Task Management System',
      description: 'Collaborative task management with real-time updates and team collaboration features.',
      longDescription: 'A comprehensive task management system for teams with real-time collaboration, project tracking, deadline management, and performance analytics.',
      tech: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
      year: '2023',
      status: 'Live',
      category: 'Full-Stack',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      github: 'https://github.com/K-Nishant-18',
      live: 'https://github.com/K-Nishant-18',
      impact: ['Real-time Collaboration', 'Team Productivity', 'Project Tracking'],
    },
    {
      number: '06',
      title: 'Weather Dashboard',
      description: 'Interactive weather dashboard with location-based forecasts and data visualization.',
      longDescription: 'A modern weather dashboard providing detailed weather information, forecasts, and interactive maps. Features location-based weather, historical data, and customizable widgets.',
      tech: ['React.js', 'TypeScript', 'Chart.js', 'Weather API', 'Tailwind CSS'],
      year: '2022',
      status: 'Live',
      category: 'Frontend',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
      github: 'https://github.com/K-Nishant-18',
      live: 'https://github.com/K-Nishant-18',
      impact: ['Location-based Data', 'Data Visualization', 'Responsive Design'],
    },
  ];

  useEffect(() => {
    // Initial animations
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    // Project item animations
    const projectItems = projectsRef.current?.children;
    
    if (projectItems) {
      gsap.utils.toArray(projectItems).forEach((item: any, i) => {
        // Create a timeline for each project
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          }
        });

        // Number animation
        tl.fromTo(
          item.querySelector('.project-number'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
          0
        );

        // Image animation (parallax + scale)
        tl.fromTo(
          imageRefs.current[i],
          { y: 80, opacity: 0, scale: 0.9 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRefs.current[i],
              start: 'top 75%',
              scrub: 1
            }
          },
          0.1
        );

        // Title animation
        tl.fromTo(
          titleRefs.current[i],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.2
        );

        // Description animation
        tl.fromTo(
          item.querySelectorAll('.project-description p'),
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.1,
            ease: 'power2.out' 
          },
          0.3
        );

        // Tech tags animation
        tl.fromTo(
          techRefs.current[i]?.children,
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.05,
            ease: 'power2.out' 
          },
          0.4
        );

        // Impact animation
        tl.fromTo(
          impactRefs.current[i]?.children,
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.05,
            ease: 'power2.out' 
          },
          0.5
        );

        // Meta info animation
        tl.fromTo(
          metaRefs.current[i]?.children,
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.1,
            ease: 'power2.out' 
          },
          0.6
        );

        // Button animations
        tl.fromTo(
          buttonRefs.current[i * 2],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.7
        );

        if (projects[i].live) {
          tl.fromTo(
            buttonRefs.current[i * 2 + 1],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            0.8
          );
        }

        // Hover effects for the entire project item
        gsap.to(item, {
          borderTopColor: '#d1d5db',
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          }
        });

        // Image hover effect
        if (imageRefs.current[i]) {
          imageRefs.current[i]?.addEventListener('mouseenter', () => {
            gsap.to(imageRefs.current[i], {
              scale: 1.03,
              duration: 0.5,
              ease: 'power2.out'
            });
          });
          
          imageRefs.current[i]?.addEventListener('mouseleave', () => {
            gsap.to(imageRefs.current[i], {
              scale: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
          });
        }
      });
    }

    // GitHub link animation
    const githubLink = document.querySelector('.github-link');
    if (githubLink) {
      gsap.from(githubLink, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: githubLink,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-16 overflow-hidden">
      <section
        ref={sectionRef}
        className="px-8 max-w-7xl mx-auto"
      >
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
            All Projects
          </h1>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            A comprehensive collection of my work, showcasing various technologies and problem-solving approaches
          </p>
        </div>

        <div ref={projectsRef} className="space-y-24">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group border-t border-gray-200 dark:border-gray-800 pt-12 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-500"
              data-cursor="-opaque"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-2">
                  <span 
                    className="project-number text-6xl font-light text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-colors duration-500"
                  >
                    {project.number}
                  </span>
                </div>

                <div className="lg:col-span-4">
                  <img
                    ref={el => imageRefs.current[index] = el}
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-[4/3] object-cover border border-gray-200 dark:border-gray-800 group-hover:border-gray-400 dark:group-hover:border-gray-600 transition-all duration-300"
                    data-cursor="-opaque"
                  />
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 
                        ref={el => titleRefs.current[index] = el}
                        className="text-2xl font-light tracking-tight"
                      >
                        {project.title}
                      </h3>
                      <span className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase">
                        {project.category}
                      </span>
                    </div>
                    <div className="project-description">
                      <p className="text-lg font-light leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                        {project.description}
                      </p>
                      <p className="text-sm font-light leading-relaxed text-gray-600 dark:text-gray-400">
                        {project.longDescription}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div ref={el => techRefs.current[index] = el}>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="tech-tag text-sm font-light tracking-wide text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                            data-cursor="-opaque"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div ref={el => impactRefs.current[index] = el}>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">
                        Impact
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.impact.map((item, impactIndex) => (
                          <span
                            key={impactIndex}
                            className="impact-item text-sm font-light tracking-wide text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                            data-cursor="-opaque"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div ref={el => metaRefs.current[index] = el} className="space-y-4">
                    <div>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-1">
                        Year
                      </p>
                      <p className="font-light">{project.year}</p>
                    </div>
                    <div>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-1">
                        Status
                      </p>
                      <p className="font-light">{project.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <a
                      ref={el => buttonRefs.current[index * 2] = el}
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-button inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
                      data-cursor="-opaque"
                    >
                      <FiGithub size={16} />
                      <span className="text-sm font-light">Code</span>
                    </a>
                    {project.live && (
                      <a
                        ref={el => buttonRefs.current[index * 2 + 1] = el}
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-button inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
                        data-cursor="-opaque"
                      >
                        <FiExternalLink size={16} />
                        <span className="text-sm font-light">Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <a
            href="https://github.com/K-Nishant-18"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link inline-flex items-center text-lg font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            data-cursor="-opaque"
          >
            View GitHub profile
            <FiArrowUpRight className="ml-2" size={20} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects;