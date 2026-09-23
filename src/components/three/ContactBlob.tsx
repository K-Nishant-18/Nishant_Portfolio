import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

const ContactBlobScene = lazy(() => import('./ContactBlobScene'));

const ContactBlob: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!coarse && !reduceMotion);
  }, []);

  useEffect(() => {
    if (!enabled || !wrapRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { rootMargin: '700px 0px' }
    );
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none z-[1]"
      style={{
        maskImage: 'radial-gradient(ellipse 70% 60% at 62% 55%, black 20%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 62% 55%, black 20%, transparent 78%)',
      }}
    >
      {enabled && inView && (
        <Suspense fallback={null}>
          <ContactBlobScene />
        </Suspense>
      )}
    </div>
  );
};

export default ContactBlob;