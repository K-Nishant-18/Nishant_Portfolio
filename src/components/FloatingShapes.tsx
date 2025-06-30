import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FloatingShapes: React.FC = () => {
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shapes = shapesRef.current?.children;
    if (!shapes) return;

    Array.from(shapes).forEach((shape, index) => {
      const element = shape as HTMLElement;
      
      // Initial random position
      gsap.set(element, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
      });

      // Floating animation
      gsap.to(element, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        rotation: `+=${Math.random() * 180 - 90}`,
        duration: 10 + Math.random() * 20,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: index * 2,
      });

      // Opacity animation
      gsap.to(element, {
        opacity: 0.1 + Math.random() * 0.3,
        duration: 3 + Math.random() * 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: index * 0.5,
      });
    });
  }, []);

  const shapes = [
    { size: 'w-16 h-16', color: 'bg-red-500', shape: 'rounded-full' },
    { size: 'w-12 h-12', color: 'bg-blue-500', shape: 'rounded-lg' },
    { size: 'w-20 h-20', color: 'bg-green-500', shape: 'rounded-full' },
    { size: 'w-8 h-8', color: 'bg-purple-500', shape: 'rounded-full' },
    { size: 'w-14 h-14', color: 'bg-yellow-500', shape: 'rounded-lg' },
    { size: 'w-10 h-10', color: 'bg-pink-500', shape: 'rounded-full' },
    { size: 'w-18 h-18', color: 'bg-indigo-500', shape: 'rounded-lg' },
    { size: 'w-6 h-6', color: 'bg-teal-500', shape: 'rounded-full' },
  ];

  return (
    <div
      ref={shapesRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute ${shape.size} ${shape.color} ${shape.shape} opacity-10`}
          style={{
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;