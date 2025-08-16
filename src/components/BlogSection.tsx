import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const BlogSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const headerRef = useRef(null);
  const subheaderRef = useRef(null);

  const blogs = [
    {
      number: '01',
      date: 'Dec 15, 2024',
      readTime: '8 min read',
      title: 'Optimizing Spring Boot Applications',
      excerpt: 'Learn advanced techniques to boost your Spring Boot application performance and scalability.',
      category: 'Backend',
      link: 'https://medium.com/@me.knishant',
    },
    {
      number: '02',
      date: 'Dec 10, 2024',
      readTime: '6 min read',
      title: 'Building Secure React Applications',
      excerpt: 'Best practices for implementing security in modern React applications with real-world examples.',
      category: 'Frontend',
      link: 'https://medium.com/@me.knishant',
    },
    {
      number: '03',
      date: 'Dec 5, 2024',
      readTime: '10 min read',
      title: 'Docker for Full-Stack Developers',
      excerpt: 'Complete guide to containerizing your full-stack applications with Docker and deployment strategies.',
      category: 'DevOps',
      link: 'https://medium.com/@me.knishant',
    },
  ];

  useEffect(() => {
    // Section entrance animation
    gsap.fromTo(
      headerRef.current,
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      subheaderRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );

    // Card animations
    gsap.fromTo(
      cardsRef.current.children,
      { 
        y: 100, 
        opacity: 0, 
        scale: 0.95,
        rotationX: 5,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
      }
    );

    // Individual card hover effects
    Array.from(cardsRef.current.children).forEach((card) => {
      const number = card.querySelector('.number');
      const link = card.querySelector('.read-link');
      const icon = card.querySelector('.read-icon');

      // Card hover
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(number, {
          y: -20,
          scale: 1.5,
          opacity: 0.7,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(number, {
          y: 0,
          scale: 1,
          opacity: 0.5,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      // Link hover
      link.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          x: 5,
          rotation: 45,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          x: 0,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    // View all link animation
    const viewAllLink = sectionRef.current.querySelector('.view-all-link');
    const viewAllIcon = sectionRef.current.querySelector('.view-all-icon');

    viewAllLink.addEventListener('mouseenter', () => {
      gsap.to(viewAllIcon, {
        x: 5,
        rotation: 45,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    viewAllLink.addEventListener('mouseleave', () => {
      gsap.to(viewAllIcon, {
        x: 0,
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="min-h-screen flex items-center px-8 py-32 max-w-7xl mx-auto"
    >
      <div className="w-full">
        <div className="mb-16">
          <h2 ref={headerRef} className="text-4xl md:text-6xl font-light tracking-tight mb-8">
            Web Journals
          </h2>
          <p ref={subheaderRef} className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            Thoughts on development, technology, and the craft of building digital experiences
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <article
              key={index}
              className="group backdrop-blur-xl bg-gray-200 dark:bg-gray-900/30 border border-white/20 dark:border-gray-300/30 rounded-lg shadow-lg hover:shadow-sm transition-all duration-300 relative overflow-hidden"
              style={{ boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}
              data-cursor="pointer"
            >
              <div className="number absolute top-6 right-6 text-6xl font-light text-gray-100 dark:text-gray-800 opacity-50 group-hover:opacity-70 transition-opacity duration-300">
                {blog.number}
              </div>
              
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase">
                    {blog.category}
                  </span>
                  <div className="flex items-center text-sm font-light text-gray-500 dark:text-gray-500">
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-light tracking-tight mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                  {blog.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">
                  {blog.excerpt}
                </p>

                <a
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-link inline-flex items-center text-sm font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                  data-cursor="pointer"
                >
                  Read article
                  <FiArrowUpRight className="read-icon ml-2" size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://medium.com/@me.knishant"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all-link inline-flex items-center text-lg font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            data-cursor="pointer"
          >
            View all articles
            <FiArrowUpRight className="view-all-icon ml-2" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;