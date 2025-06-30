import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';

const TestimonialPreview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: 'Prashant Kumar',
      role: 'Product Manager',
      company: 'Tech Startup',
      testimonial: 'Nishant delivered exceptional work on our platform. His attention to detail and technical expertise made all the difference.',
      initial: 'P',
    },
    {
      name: 'Gaurav Shaw',
      role: 'Senior Developer',
      company: 'Software Solutions',
      testimonial: 'Working with Nishant was a pleasure. He brings innovative solutions and maintains high code quality throughout.',
      initial: 'G',
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
      id="testimonials"
      ref={sectionRef}
      className="min-h-screen flex items-center px-8 py-32 max-w-7xl mx-auto"
    >
      <div className="w-full">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
            Words of Appreciation
          </h2>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            What people say about working with me
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 p-8 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 relative group"
              data-cursor="pointer"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 dark:bg-gray-100 flex items-center justify-center text-white dark:text-gray-900 font-light text-lg">
                {testimonial.initial}
              </div>

              <div className="pt-4">
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8 italic">
                  "{testimonial.testimonial}"
                </p>

                <div>
                  <h4 className="font-light text-lg tracking-tight">{testimonial.name}</h4>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-500">
                    {testimonial.role}
                  </p>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-500">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/guestbook"
            className="inline-flex items-center text-lg font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            data-cursor="pointer"
          >
            View all testimonials
            <FiArrowUpRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialPreview;