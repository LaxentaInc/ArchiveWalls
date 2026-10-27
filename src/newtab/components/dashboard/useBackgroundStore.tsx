import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type BackgroundType = 'preset' | 'rock' | 'custom_image' | 'custom_video';

export interface BackgroundPreset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'rock' | 'minimal';
  url?: string;
  thumbnail: string;
}

// curated background presets including start.me alpine mountain landscape and 3d rock sequence
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'alpine_valley',
    title: 'Alpine Mountain Valley',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'kinetic_rocks',
    title: '3D Kinetic Rocks',
    type: 'rock',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'misty_forest',
    title: 'Misty Pine Forest',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'cyberpunk_city',
    title: 'Cyberpunk Metropolis',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-skyscrapers-41551-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'obsidian_dark',
    title: 'Obsidian Minimal Dark',
    type: 'minimal',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=70',
  },
];

const STORAGE_KEY = 'archive_walls_background_config';

export interface BackgroundConfig {
  type: BackgroundType;
  presetId?: string;
  customUrl?: string;
}

// default initial background set to alpine valley matching start.me reference
function getDefaultConfig(): BackgroundConfig {
  return {
    type: 'preset',
    presetId: 'alpine_valley',
  };
}

// loads persisted background preference from local storage
function loadConfig(): BackgroundConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return getDefaultConfig();
}

interface BackgroundContextType {
  config: BackgroundConfig;
  selectPreset: (presetId: string) => void;
  setCustomImage: (urlOrData: string) => void;
  setCustomVideo: (videoUrl: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | null>(null);

// shared background context provider eliminating isolated state between background view and picker
export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<BackgroundConfig>(loadConfig);

  // syncs configuration changes to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  // sets background to one of the curated presets
  const selectPreset = useCallback((presetId: string) => {
    const preset = BACKGROUND_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    if (preset.type === 'rock') {
      setConfig({ type: 'rock', presetId });
    } else {
      setConfig({ type: 'preset', presetId });
    }
  }, []);

  // sets background to a custom user-provided image data url or direct link
  const setCustomImage = useCallback((urlOrData: string) => {
    setConfig({
      type: 'custom_image',
      customUrl: urlOrData,
    });
  }, []);

  // sets background to a custom direct video url
  const setCustomVideo = useCallback((videoUrl: string) => {
    setConfig({
      type: 'custom_video',
      customUrl: videoUrl,
    });
  }, []);

  return (
    <BackgroundContext.Provider
      value={{
        config,
        selectPreset,
        setCustomImage,
        setCustomVideo,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

// custom hook to access unified background configuration across dashboard
export function useBackgroundStore(): BackgroundContextType {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackgroundStore must be used within a BackgroundProvider');
  }
  return context;
}

export default useBackgroundStore;
