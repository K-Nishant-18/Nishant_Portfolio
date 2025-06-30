import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = (e?: Event) => {
      // If hovering a link, make cursor red and link text blue
      if (e && (e.target as HTMLElement).tagName.toLowerCase() === 'a') {
        gsap.to(cursor, {
          backgroundColor: '#CB0404', // Tailwind blue-500
          scale: 5.8, // Cursor scale for links
          duration: 0.2,
        });
        gsap.to(follower, {
          borderColor: '#8A0000',
          scale: 1.5, // Follower scale for links
          duration: 0.2,
        });
        // Change link text color to blue
        (e.target as HTMLElement).style.color = '#DC2525'; // Tailwind blue-500
      } else {
        gsap.to(cursor, {
          scale: 5.8, // Cursor scale for other interactive elements
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(follower, {
          scale: 1.5, // Follower scale for other interactive elements
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = (e?: Event) => {
      // Restore default color and scale
      gsap.to(cursor, {
        backgroundColor: '', // revert to original
        scale: 1,
        duration: 0.2,
      });
      gsap.to(follower, {
        borderColor: '',
        scale: 1,
        duration: 0.2,
      });
      gsap.to([cursor, follower], {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      // Restore link text color if leaving a link
      if (e && (e.target as HTMLElement).tagName.toLowerCase() === 'a') {
        (e.target as HTMLElement).style.color = '';
      }
    };

    const handleTextEnter = () => {
      gsap.to(cursor, {
        scale: 19.5,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(follower, {
        scale: 5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleTextLeave = () => {
      gsap.to([cursor, follower], {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', moveCursor);

    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor="pointer"]');
    interactiveElements.forEach((el) => {
      if (el.tagName.toLowerCase() === 'a') {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      } else {
        el.addEventListener('mouseenter', () => handleMouseEnter());
        el.addEventListener('mouseleave', () => handleMouseLeave());
      }
    });

    // Text elements
    const textElements = document.querySelectorAll('h1, h2, h3');
    textElements.forEach((el) => {
      el.addEventListener('mouseenter', handleTextEnter);
      el.addEventListener('mouseleave', handleTextLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      textElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleTextEnter);
        el.removeEventListener('mouseleave', handleTextLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gray-700 dark:bg-gray-100 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-gray-700 dark:border-gray-100 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;