import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Image data
const images = [
  { id: 1, url: '/portfolio.png', className: 'w-[80vw] h-[40vh] top-[15vh] left-[10vw] lg:w-[32vw] lg:h-[45vh] lg:top-[15vh] lg:left-[5vw]', dataSpeed: 1.3, rotation: -6, zIndex: 10 },
  { id: 2, url: 'https://images.pexels.com/photos/17131046/pexels-photo-17131046.jpeg', className: 'w-[80vw] h-[40vh] top-[70vh] left-[10vw] lg:w-[28vw] lg:h-[38vh] lg:top-[60vh] lg:right-[8vw] lg:left-auto', dataSpeed: 0.8, rotation: 4, zIndex: 15 },
  { id: 3, url: 'https://images.pexels.com/photos/33114015/pexels-photo-33114015.jpeg', className: 'w-[80vw] h-[45vh] top-[125vh] left-[10vw] lg:w-[24vw] lg:h-[50vh] lg:top-[30vh] lg:right-[22vw] lg:left-auto', dataSpeed: 1.1, rotation: -3, zIndex: 12 },
  { id: 4, url: 'https://images.pexels.com/photos/10110994/pexels-photo-10110994.jpeg', className: 'w-[80vw] h-[38vh] top-[185vh] left-[10vw] lg:w-[40vw] lg:h-[34vh] lg:top-[90vh] lg:left-[12vw]', dataSpeed: 1.2, rotation: 5, zIndex: 14 },
  { id: 5, url: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop', className: 'w-[80vw] h-[48vh] top-[240vh] left-[10vw] lg:w-[30vw] lg:h-[52vh] lg:top-[120vh] lg:right-[5vw] lg:left-auto', dataSpeed: 0.9, rotation: -4, zIndex: 11 },
  { id: 6, url: 'https://images.pexels.com/photos/12372675/pexels-photo-12372675.jpeg', className: 'w-[80vw] h-[40vh] top-[305vh] left-[10vw] lg:w-[26vw] lg:h-[36vh] lg:top-[150vh] lg:left-[25vw]', dataSpeed: 1.0, rotation: 3, zIndex: 13 },
  { id: 7, url: 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2070&auto=format&fit=crop', className: 'w-[80vw] h-[40vh] top-[360vh] left-[10vw] lg:w-[36vw] lg:h-[35vh] lg:top-[170vh] lg:left-[8vw]', dataSpeed: 1.25, rotation: -5, zIndex: 16 },
  { id: 8, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', className: 'w-[80vw] h-[42vh] top-[415vh] left-[10vw] lg:w-[31vw] lg:h-[40vh] lg:top-[190vh] lg:right-[12vw] lg:left-auto', dataSpeed: 0.85, rotation: 6, zIndex: 10 },
  { id: 9, url: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?q=80&w=2070&auto=format&fit=crop', className: 'w-[80vw] h-[38vh] top-[470vh] left-[10vw] lg:w-[27vw] lg:h-[33vh] lg:top-[210vh] lg:left-[10vw]', dataSpeed: 1.3, rotation: -2, zIndex: 15 },
  { id: 10, url: 'https://images.pexels.com/photos/20180722/pexels-photo-20180722.jpeg', className: 'w-[80vw] h-[45vh] top-[525vh] left-[10vw] lg:w-[33vw] lg:h-[44vh] lg:top-[230vh] lg:right-[18vw] lg:left-auto', dataSpeed: 1.0, rotation: 4, zIndex: 12 },
];

// ✅ UPDATED: Added more shapes for a denser background effect
const backgroundShapes = [
    { id: 1, className: 'top-[5vh] left-[5vw] w-[22rem] h-[22rem] bg-cyan-400/10 rounded-full', dataSpeed: 0.2 },
    { id: 2, className: 'top-[40vh] right-[10vw] w-[32rem] h-[32rem] bg-purple-400/10 rounded-full', dataSpeed: 0.35 },
    { id: 3, className: 'top-[90vh] left-[15vw] w-[28rem] h-[28rem] bg-yellow-400/10 rounded-full', dataSpeed: 0.25 },
    { id: 4, className: 'top-[130vh] right-[20vw] w-[18rem] h-[18rem] bg-teal-400/10 rounded-full', dataSpeed: 0.45 },
    { id: 5, className: 'top-[180vh] left-[10vw] w-[35rem] h-[35rem] bg-pink-400/10 rounded-full', dataSpeed: 0.4 },
    { id: 6, className: 'top-[240vh] right-[5vw] w-[26rem] h-[26rem] bg-indigo-400/10 rounded-full', dataSpeed: 0.3 },
    { id: 7, className: 'top-[280vh] left-[25vw] w-[20rem] h-[20rem] bg-green-400/10 rounded-full', dataSpeed: 0.22 },
    { id: 8, className: 'top-[350vh] right-[15vw] w-[30rem] h-[30rem] bg-orange-400/10 rounded-full', dataSpeed: 0.38 },
    { id: 9, className: 'top-[420vh] left-[5vw] w-[24rem] h-[24rem] bg-sky-400/10 rounded-full', dataSpeed: 0.33 },
    { id: 10, className: 'top-[490vh] right-[10vw] w-[28rem] h-[28rem] bg-rose-400/10 rounded-full', dataSpeed: 0.28 },
    { id: 11, className: 'top-[540vh] left-[20vw] w-[22rem] h-[22rem] bg-lime-400/10 rounded-full', dataSpeed: 0.42 },
];

// Component for rendering and animating background elements
const BackgroundElements = () => {
  const shapesContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.bg-shape').forEach(shape => {
        const speed = parseFloat(shape.dataset.speed || '1');
        gsap.to(shape, {
          yPercent: -60 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      });
    }, shapesContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={shapesContainerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {backgroundShapes.map(shape => (
        <div
          key={shape.id}
          data-speed={shape.dataSpeed}
          className={`bg-shape absolute filter blur-3xl ${shape.className}`}
        ></div>
      ))}
    </div>
  );
};


export default function Gallery() {
  const component = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  useLayoutEffect(() => {
    // Initialize Lenis for ultra-smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -12 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Custom cursor with dynamic scaling and color shift
    const cursor = cursorRef.current;
    const mouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power4.out',
      });
    };
    window.addEventListener('mousemove', mouseMove);

    // Cursor hover interactions with glow effect
    const interactiveElements = document.querySelectorAll('.interactive');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 4,
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, rgba(255, 215, 0, 0) 70%)',
          mixBlendMode: 'screen',
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
          mixBlendMode: 'normal',
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });

    // GSAP animations with context
    let ctx = gsap.context(() => {
      // Hero title animation with 3D letter effect - SAME AS HERO COMPONENT
      const title = document.querySelector('.hero-title');
      if (title) {
        const spans = title.querySelectorAll('span');
        spans.forEach(span => {
          if (span.textContent) {
            const chars = span.textContent.split('');
            span.innerHTML = chars.map(char => 
              `<span class="char inline-block" style="transform-style: preserve-3d;">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
          }
        });

        gsap.from('.char', {
          yPercent: 150,
          opacity: 0,
          rotateX: 360,
          stagger: 0.1,
          duration: 2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 90%',
          },
        });
      }

      // Asymmetrical image reveal with 3D rotation and layered parallax
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item) => {
        const image = item.querySelector('img');
        const speed = parseFloat(item.dataset.speed || '1');
        const rotation = parseFloat(item.dataset.rotation || '0');
        const itemId = parseInt(item.dataset.id || '0');

        // Image reveal with 3D effect
        gsap.fromTo(
          item,
          { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 200, rotate: rotation * 1.8, rotateY: 30 },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            y: 0,
            rotate: rotation,
            rotateY: 0,
            duration: 2.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Parallax effect with depth
        gsap.to(image, {
          yPercent: -15 * speed,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3,
          },
        });

        // Micro-interaction on hover with 3D tilt
        item.addEventListener('mouseenter', () => {
          setHoveredImage(itemId);
          gsap.to(item, {
            scale: 1.08,
            zIndex: 200,
            rotate: rotation + 3,
            rotateY: 10,
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
            duration: 0.5,
            ease: 'power3.out',
          });
        });
        item.addEventListener('mouseleave', () => {
          setHoveredImage(null);
          gsap.to(item, {
            scale: 1,
            rotate: rotation,
            rotateY: 0,
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
            duration: 0.5,
            ease: 'power3.out',
          });
        });
      });


      // Background gradient animation
      gsap.to('.bg-gradient', {
        backgroundPosition: '200% center',
        ease: 'none',
        scrollTrigger: {
          trigger: component.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    }, component);

    // Cleanup
    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', mouseMove);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={component} className="bg-gradient min-h-screen font-sans relative overflow-hidden">
      <BackgroundElements />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      >💖</div>

      <main className="relative z-10">
        <div className="container mx-auto px-8">
          {/* Hero Section */}
          <header className="min-h-screen flex items-center justify-center text-center relative">
            <h1 className="hero-title text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] font-extrabold uppercase tracking-tighter font-serif perspective-1000 leading-none">
              <span>Beyond </span>
              <br className="lg:hidden" /> 
              <span>the</span>
              <br />
              <span>Frame</span>
            </h1>
            <div className="absolute bottom-10 text-base sm:text-lg font-mono opacity-70 animate-bounce">Scroll to Unravel</div>
          </header>

          {/* Gallery Section */}
          <section className="gallery-container relative min-h-[575vh] lg:min-h-[275vh] py-24">
            {images.map((img) => (
              <div
                key={img.id}
                className={`gallery-item absolute overflow-hidden rounded-xl shadow-2xl transition-all interactive ${img.className}`}
                data-speed={img.dataSpeed}
                data-rotation={img.rotation}
                data-id={img.id}
                style={{ zIndex: img.zIndex }}
              >
                <img
                  src={img.url}
                  alt={`Gallery image ${img.id}`}
                  className="w-full h-full object-cover transform transition-transform duration-500"
                />
                {hoveredImage === img.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                    <span className="text-white text-lg font-mono mb-6 tracking-wide">Frame #{img.id}</span>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Parallax Text Section */}
          <section className="min-h-screen flex items-center justify-center py-32">
            <h2
              className="parallax-text text-4xl sm:text-5xl md:text-6xl text-center w-11/12 md:w-4/5 font-light leading-snug md:leading-tight"
            >
              Each image is a portal to a fleeting moment, captured in a symphony of light and chaos.
            </h2>
          </section>
        </div>
      </main>

      {/* Background Overlay for Depth */}
      <div className="absolute inset-0 z-5 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.2)_0%,transparent_70%)]"></div>
      </div>
    </div>
  );
}