import React from 'react';

/**
 * Film-grain texture overlay (Swiss "print" detail).
 * Uses an inline SVG feTurbulence noise, tiled across the viewport.
 * pointer-events-none so it never blocks clicks; mix-blend-overlay + low
 * opacity so it only adds subtle tactile grain on top of the design.
 */
const GrainTexture: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
    ></div>
  );
};

export default GrainTexture;
