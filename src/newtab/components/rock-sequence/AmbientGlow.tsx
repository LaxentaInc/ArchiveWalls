import React from 'react';

// lightweight gpu accelerated organic aurora plumes (top left and bottom right)
export const AmbientGlow: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[1] transition-opacity duration-700"
      style={{
        opacity: 'var(--green-factor, 0)',
      }}
    >
      {/* ========================================================
          TOP-LEFT AURORA PLUME (ELECTRIC AQUA & CYAN)
      ======================================================== */}
      {/* primary outer cyan atmospheric plume */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] md:w-[1150px] md:h-[1150px] rounded-full pointer-events-none transition-transform duration-300"
        style={{
          transform: 'translate(-50%, -50%) rotate(var(--rock-angle, 0deg))',
          background:
            'radial-gradient(circle at 44% 45%, transparent 0px, transparent 235px, rgba(34, 211, 238, 0.42) 280px, rgba(6, 182, 212, 0.22) 380px, rgba(14, 116, 144, 0.08) 520px, transparent 700px)',
          filter: 'blur(34px)',
        }}
      />

      {/* secondary emerald light sweep layered behind cyan */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] md:w-[1200px] md:h-[1200px] rounded-full pointer-events-none transition-transform duration-300"
        style={{
          transform: 'translate(-50%, -50%) rotate(calc(var(--rock-angle, 0deg) * 1.1 + 14deg))',
          background:
            'radial-gradient(ellipse at 52% 46%, transparent 0px, transparent 240px, rgba(74, 222, 128, 0.38) 290px, rgba(16, 185, 129, 0.18) 410px, transparent 680px)',
          filter: 'blur(40px)',
        }}
      />

      {/* ========================================================
          BOTTOM-RIGHT AURORA PLUME (MINT, EMERALD & TURQUOISE)
      ======================================================== */}
      {/* bottom right organic diffuse aurora cloud */}
      <div
        className="absolute -bottom-16 -right-16 w-[700px] h-[550px] md:w-[950px] md:h-[700px] rounded-full pointer-events-none transition-transform duration-500"
        style={{
          transform: 'rotate(calc(var(--rock-angle, 0deg) * -0.4))',
          background:
            'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.28) 0%, rgba(45, 212, 191, 0.20) 35%, rgba(74, 222, 128, 0.12) 60%, transparent 80%)',
          filter: 'blur(55px)',
        }}
      />

      {/* secondary bottom right rim flare */}
      <div
        className="absolute -bottom-10 -right-10 w-[600px] h-[450px] md:w-[800px] md:h-[550px] rounded-full pointer-events-none transition-transform duration-300"
        style={{
          transform: 'rotate(calc(var(--rock-angle, 0deg) * 0.25 - 8deg))',
          background:
            'radial-gradient(ellipse at 60% 60%, transparent 0px, transparent 180px, rgba(52, 211, 153, 0.32) 230px, rgba(20, 184, 166, 0.15) 350px, transparent 550px)',
          filter: 'blur(35px)',
        }}
      />
    </div>
  );
};

export default AmbientGlow;
