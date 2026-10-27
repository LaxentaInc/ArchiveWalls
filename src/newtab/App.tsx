import React, { useState } from 'react';
import { WallpaperBackground } from './components/WallpaperBackground';
import { ClockWidget } from './components/ClockWidget';
import { DEFAULT_WALLPAPERS, DEFAULT_SETTINGS } from '@/shared/constants';
import type { Wallpaper, NewTabSettings } from '@/shared/types';

// main new tab dashboard orchestrating wallpaper and widgets
export const App: React.FC = () => {
  const [settings] = useState<NewTabSettings>(DEFAULT_SETTINGS);
  const [wallpapers] = useState<Wallpaper[]>(DEFAULT_WALLPAPERS);

  const activeWallpaper =
    wallpapers.find((w) => w.id === settings.activeWallpaperId) || wallpapers[0] || null;

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* background live wallpaper layer */}
      <WallpaperBackground wallpaper={activeWallpaper} />

      {/* centered widgets container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6">
        {settings.showClock && <ClockWidget format={settings.clockFormat} />}
      </div>

      {/* minimal bottom brand pill */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center space-x-2 text-xs text-white/40 tracking-wider font-light">
        <span>ARCHIVE WALLS</span>
        <span>•</span>
        <span className="text-white/20">COLORWALL ECOSYSTEM</span>
      </div>
    </main>
  );
};

export default App;
