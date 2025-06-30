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
        y: 20, 
        opacity: 0, 
        scale: 0.8, 
        rotationX: 30 
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
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
      className="min-h-screen flex items-center px-8 py-22 pb-25 max-w-7xl mx-auto"
    >
      <div className="w-full">
        <div ref={contentRef} className="space-y-16 pt-0">
          <div>
            <h2 ref={headingRef} className="font-bold pt-0 pb-8">
              <span className="block text-6xl md:text-8xl lg:text-[10rem] leading-[1] tracking-[-0.08em]">Let's</span>
              <span className="block text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] -mt-8 tracking-[-0.08em]">Collaborate</span>
            </h2>
            <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
              I'm always interested in new opportunities and collaborations. 
              Whether you have a project in mind or just want to say hello, feel free to reach out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-6">
                  Get in touch
                </h3>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="group">
                      <p className="text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 mb-2">
                        {method.label}
                      </p>
                      <a
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
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
                <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-6">
                  Location & Availability
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FiMapPin size={16} />
                    <div>
                      <p className="font-light">Bhagalpur, India</p>
                      <p className="text-sm font-light text-gray-600 dark:text-gray-400">UTC +5:30</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiClock size={16} />
                    <div>
                      <p className="font-light">Available for projects</p>
                      <p className="text-sm font-light text-green-600 dark:text-green-400">Open to new opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-6">
                  Services
                </h3>
                <div className="space-y-4">
                  {[
                    'Full-Stack Development',
                    'API Development & Integration',
                    'Database Design & Optimization',
                    'Technical Consulting',
                    'Code Review & Mentoring',
                  ].map((service, index) => (
                    <p key={index} className="text-lg font-light">
                      {service}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-6">
                  Response Time
                </h3>
                <p className="font-light text-gray-600 dark:text-gray-400 leading-relaxed">
                  I typically respond to inquiries within 24 hours. For urgent projects, 
                  please mention it in your message and I'll prioritize accordingly.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-16 pb-16 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={startConversation}
              className="inline-flex items-center text-2xl md:text-5xl font-light tracking-tight hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300 group"
              data-cursor="pointer"
            >
              Start a conversation
              <FiArrowUpRight className="ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;