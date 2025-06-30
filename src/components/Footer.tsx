import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current?.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
      }
    );
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="px-8 pb-12 pt-0"
    >
      <div className="max-w-full mx-auto border-t-2 border-gray-200 dark:border-gray-600 ">
        <div ref={contentRef} className="space-y-12 max-w-7xl justify-between mx-auto">
          {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4">
                Navigation
              </h3>
              <div className="space-y-2">
                {['Home', 'About', 'Work', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'work' ? 'projects' : item.toLowerCase())}
                    className="block text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4">
                Connect
              </h3>
              <div className="space-y-2">
                <a
                  href="mailto:me.knishant@gmail.com"
                  className="block text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                >
                  Email
                </a>
                <a
                  href="https://linkedin.com/in/k-nishant-18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/K-Nishant-18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4">
                Location
              </h3>
              <p className="text-lg font-light">
                Bhagalpur, India
              </p>
            </div>

            <div>
              <h3 className="text-sm font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-4">
                Status
              </h3>
              <p className="text-lg font-light">
                Available for projects
              </p>
            </div>
          </div> */}

          <div className="max-w-7xl pt-10  flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xl font-light tracking-wider">
              <Link 
                          to="/" 
                          className="text-xl font-light tracking-wider"
                          style={{ cursor: 'none' }} // Added cursor none to logo link
                        >
                         <span className='text-red-600 font-bold'>KUMAR </span>NISHANT
                        </Link>
            </div>
            <div className=" flex flex-wrap justify-center gap-6">
                {['Home', 'About', 'Work', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'work' ? 'projects' : item.toLowerCase())}
                    className="block text-lg font-light hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;