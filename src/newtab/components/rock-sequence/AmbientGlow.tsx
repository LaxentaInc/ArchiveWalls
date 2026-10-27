import React from 'react';

// dynamic rim corona that only blooms outside the rock perimeter when green moss appears
export const AmbientGlow: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[1] transition-opacity duration-500"
      style={{
        opacity: 'var(--green-factor, 0)',
      }}
    >
      {/* primary hollow core rim aura radiating outside the rock silhouette */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] md:w-[1100px] md:h-[1100px] rounded-full pointer-events-none transition-transform duration-300"
        style={{
          transform: 'translate(-50%, -50%) rotate(var(--rock-angle, 0deg))',
          background:
            'radial-gradient(circle, transparent 0px, transparent 230px, rgba(74, 222, 128, 0.42) 280px, rgba(34, 197, 94, 0.22) 390px, rgba(16, 185, 129, 0.08) 540px, transparent 720px)',
          filter: 'blur(30px)',
        }}
      />

      {/* secondary outer atmospheric flare tracking the rock orientation */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] md:w-[1300px] md:h-[1300px] rounded-full pointer-events-none"
        style={{
          transform: 'translate(-50%, -50%) rotate(calc(var(--rock-angle, 0deg) * 0.5))',
          background:
            'radial-gradient(ellipse at center, transparent 0px, transparent 280px, rgba(52, 211, 153, 0.20) 340px, rgba(5, 150, 105, 0.06) 550px, transparent 800px)',
          filter: 'blur(55px)',
        }}
      />
    </div>
  );
};

export default AmbientGlow;
