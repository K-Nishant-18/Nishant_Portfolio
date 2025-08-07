import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null); // Ref for the h2 element

  const contactMethods = [
    {
      label: 'Email',
      value: 'me.knishant@gmail.com',
      href: 'mailto:me.knishant@gmail.com',
      icon: FiMail,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/k-nishant-18',
      href: 'https://linkedin.com/in/k-nishant-18',
      icon: FiArrowUpRight,
    },
    {
      label: 'GitHub',
      value: 'github.com/K-Nishant-18',
      href: 'https://github.com/K-Nishant-18',
      icon: FiArrowUpRight,
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Existing animation for contentRef children
    gsap.fromTo(
      contentRef.current?.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animation for "Let's Collaborate" heading
    gsap.fromTo(
      headingRef.current?.querySelectorAll('span'),
      { 
        y: 40, 
        opacity: 0, 
        scale: 0.8, 
        rotationX: 30 
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 2.2,
        stagger: 0.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  const startConversation = () => {
    const subject = encodeURIComponent('Project Collaboration Inquiry');
    const body = encodeURIComponent(`Hi Nishant,

I'm interested in discussing a potential project collaboration. Here are some initial details:

Project Type: [Please specify]
Timeline: [Your preferred timeline]
Budget Range: [Your budget range]

I'd love to schedule a call to discuss this further.

Best regards,
[Your name]`);
    
    window.location.href = `mailto:me.knishant@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen flex items-center px-4 sm:px-6 md:px-8 py-14 sm:py-18 md:py-22 pb-20 sm:pb-22 md:pb-25 max-w-7xl mx-auto"
    >
      <div className="w-full">
        <div ref={contentRef} className="space-y-12 sm:space-y-14 md:space-y-16 pt-0">
          <div>
            <h2 ref={headingRef} className="font-bold pt-0 pb-6 sm:pb-8">
              <span className="block text-6xl sm:text-6xl md:text-8xl lg:text-[10rem] leading-[1] tracking-[-0.04em] sm:tracking-[-0.08em]">Let's</span>
              <span className="block text-6xl sm:text-6xl md:text-8xl lg:text-[10rem] leading-[0.95] sm:leading-[0.85] -mt-3 sm:-mt-8 tracking-[-0.04em] sm:tracking-[-0.08em]">Collaborate</span>
            </h2>
            <p className="text-base sm:text-lg font-light text-gray-600 dark:text-gray-400 max-w-full sm:max-w-2xl">
              I'm always interested in new opportunities and collaborations. 
              Whether you have a project in mind or just want to say hello, feel free to reach out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 md:gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs sm:text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4 sm:mb-6">
                  Get in touch
                </h3>
                <div className="space-y-5 sm:space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="group">
                      <p className="text-xs sm:text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 mb-1 sm:mb-2">
                        {method.label}
                      </p>
                      <a
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center text-base sm:text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                        data-cursor="pointer"
                      >
                        {method.value}
                        <method.icon className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4 sm:mb-6">
                  Location & Availability
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <FiMapPin size={16} />
                    <div>
                      <p className="font-light text-sm sm:text-base">Bhagalpur, India</p>
                      <p className="text-xs sm:text-sm font-light text-gray-600 dark:text-gray-400">UTC +5:30</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <FiClock size={16} />
                    <div>
                      <p className="font-light text-sm sm:text-base">Available for projects</p>
                      <p className="text-xs sm:text-sm font-light text-green-600 dark:text-green-400">Open to new opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs sm:text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4 sm:mb-6">
                  Services
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    'Full-Stack Development',
                    'API Development & Integration',
                    'Database Design & Optimization',
                    'Technical Consulting',
                    'Code Review & Mentoring',
                  ].map((service, index) => (
                    <p key={index} className="text-base sm:text-lg font-light">
                      {service}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4 sm:mb-6">
                  Response Time
                </h3>
                <p className="font-light text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                  I typically respond to inquiries within 24 hours. For urgent projects, 
                  please mention it in your message and I'll prioritize accordingly.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-10 sm:pt-16 pb-5 sm:pb-8 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={startConversation}
              className="inline-flex items-center text-xl sm:text-2xl md:text-5xl font-light tracking-tight hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300 group px-4 py-2 sm:px-6 sm:py-3 rounded-md"
              data-cursor="pointer"
            >
              Start a conversation
              <FiArrowUpRight className="ml-3 sm:ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;