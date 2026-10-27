import React, { useState } from 'react';
import { RockBackground } from './components/rock-sequence';
import { ClockWidget } from './components/ClockWidget';
import { DEFAULT_SETTINGS } from '@/shared/constants';
import type { NewTabSettings } from '@/shared/types';

// main new tab dashboard orchestrating 3d rock sequence and widgets
export const App: React.FC = () => {
  const [settings] = useState<NewTabSettings>(DEFAULT_SETTINGS);

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3d rock sequence live background */}
      <RockBackground />

      {/* centered widgets container */}
      <div className="relative z-20 flex flex-col items-center justify-center p-6 pointer-events-auto">
        {settings.showClock && <ClockWidget format={settings.clockFormat} />}
      </div>

      {/* minimal bottom brand watermark */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-2 text-xs text-white/40 tracking-wider font-light pointer-events-none">
        <span>ARCHIVE WALLS</span>
        <span>•</span>
        <span className="text-white/20">COLORWALL ECOSYSTEM</span>
      </div>
    </main>
  );
};

export default App;
