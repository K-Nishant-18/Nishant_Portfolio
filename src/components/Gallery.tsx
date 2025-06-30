import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop',
      alt: 'Coding workspace',
      size: 'w-64 h-80',
      position: 'top-10 left-10',
      speed: '2',
    },
    {
      src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=400&fit=crop',
      alt: 'Team collaboration',
      size: 'w-80 h-60',
      position: 'top-20 right-20',
      speed: '-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=350&h=500&fit=crop',
      alt: 'Mobile development',
      size: 'w-56 h-72',
      position: 'top-80 left-32',
      speed: '1.5',
    },
    {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=450&h=350&fit=crop',
      alt: 'Team meeting',
      size: 'w-72 h-56',
      position: 'top-96 right-32',
      speed: '-0.5',
    },
    {
      src: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=300&h=400&fit=crop',
      alt: 'Design process',
      size: 'w-48 h-64',
      position: 'top-[30rem] left-1/2',
      speed: '1',
    },
    {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      alt: 'Code review',
      size: 'w-64 h-48',
      position: 'top-[35rem] right-10',
      speed: '-2',
    },
  ];

  useEffect(() => {
    // Parallax effect for images
    images.forEach((_, index) => {
      const img = galleryRef.current?.children[index] as HTMLElement;
      if (img) {
        gsap.to(img, {
          y: `${parseFloat(img.dataset.speed || '0') * 100}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });

    // Hover animations
    const imageElements = galleryRef.current?.children;
    if (imageElements) {
      Array.from(imageElements).forEach((img) => {
        const element = img as HTMLElement;
        
        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            scale: 1.1,
            rotation: 5,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            scale: 1,
            rotation: 0,
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });
    }
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-20 px-6 relative min-h-screen overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Gallery</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Behind the scenes of development
          </p>
        </div>

        <div ref={galleryRef} className="relative h-[150vh]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              data-speed={image.speed}
              className={`absolute ${image.size} ${image.position} object-cover rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:z-10`}
            />
          ))}
        </div>

        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500 rounded-full opacity-10 animate-pulse delay-500"></div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;