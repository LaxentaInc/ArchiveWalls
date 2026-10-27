import React, { useRef } from 'react';
import { SpaceDustCanvas } from './SpaceDustCanvas';
import { RockCanvas } from './RockCanvas';
import { AmbientGlow } from './AmbientGlow';

// complete full screen 3d rock sequence background layer with lightweight gpu aurora plumes
export const RockBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#050507] select-none pointer-events-none"
      style={
        {
          '--green-factor': '0',
          '--rock-angle': '0deg',
        } as React.CSSProperties
      }
    >
      {/* background cosmic star dust */}
      <SpaceDustCanvas />

      {/* lightweight organic dual polar aurora plumes */}
      <AmbientGlow />

      {/* 3d interactive rock sequence */}
      <RockCanvas containerRef={containerRef} />

      {/* subtle radial vignette overlays for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
    </div>
  );
};

export default RockBackground;
