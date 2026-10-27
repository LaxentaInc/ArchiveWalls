import React from 'react';
import { SpaceDustCanvas } from './SpaceDustCanvas';
import { RockCanvas } from './RockCanvas';

export const RockBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#050507] select-none pointer-events-none">
      {/* background cosmic star dust */}
      <SpaceDustCanvas />
      {/* 3d interactive cock sequence */}
      <RockCanvas />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-10" />
    </div>
  );
};

export default RockBackground;
