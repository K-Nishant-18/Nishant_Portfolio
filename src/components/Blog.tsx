import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';

const Blog: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const blogs = [
    {
      number: '01',
      date: 'Dec 15, 2024',
      readTime: '8 min read',
      title: 'Optimizing Spring Boot Applications',
      excerpt: 'Learn advanced techniques to boost your Spring Boot application performance.',
      link: 'https://medium.com/@me.knishant',
    },
    {
      number: '02',
      date: 'Dec 10, 2024',
      readTime: '6 min read',
      title: 'Building Secure React Applications',
      excerpt: 'Best practices for implementing security in modern React applications.',
      link: 'https://medium.com/@me.knishant',
    },
    {
      number: '03',
      date: 'Dec 5, 2024',
      readTime: '10 min read',
      title: 'Docker for Full-Stack Developers',
      excerpt: 'Complete guide to containerizing your full-stack applications with Docker.',
      link: 'https://medium.com/@me.knishant',
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current?.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="py-20 px-6 bg-gray-100 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Latest Insights</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Thoughts on development and technology
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <article
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 dark:text-gray-700 opacity-50">
                {blog.number}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{blog.date}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.readTime}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {blog.excerpt}
                </p>

                <a
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  Read more
                  <FiArrowRight className="ml-2" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://medium.com/@me.knishant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Read more blogs
            <FiArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;