import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollRevealText from './ScrollRevealText';

const Collaborate: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });


      .fromTo(
      buttonRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    );
}, []);

const scrollToContact = () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
};

return (
  <section
    id="collaborate"
    ref={sectionRef}
    className="py-32 px-6 bg-gray-100 dark:bg-gray-900"
  >
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
        <ScrollRevealText text="Let's Collaborate" />
      </h2>

      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
        I'm available for freelance projects and always excited to work on
        innovative solutions. Let's build something amazing together.
      </p>

      <a
        ref={buttonRef}
        onClick={scrollToContact}
        className="inline-flex items-center px-8 py-4 bg-red-600 text-white text-lg font-medium rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        Contact Me
      </a>
    </div>
  </section>
);
};

export default Collaborate;