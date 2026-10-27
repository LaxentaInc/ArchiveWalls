// default presets, storage keys, and starter wallpaper assets

import type { NewTabSettings, Wallpaper, SearchEngine } from './types';

export const STORAGE_KEYS = {
  SETTINGS: 'archive_walls_settings',
  WALLPAPERS: 'archive_walls_wallpapers',
} as const;

export const SEARCH_ENGINE_URLS: Record<SearchEngine, string> = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  bing: 'https://www.bing.com/search?q=',
};

export const DEFAULT_WALLPAPERS: Wallpaper[] = [
  {
    id: 'test1',
    title: 'test1',
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-skyscrapers-41551-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    author: 'ColorWall Archive',
    resolution: '1080p',
    fps: 60,
  },
  {
    id: 'test2',
    title: 'test2',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    author: 'Colorwall Thingy',
    resolution: '4K',
  },
];

export const DEFAULT_SETTINGS: NewTabSettings = {
  activeWallpaperId: 'test1',
  clockFormat: '12h',
  showClock: true,
  showSearch: true,
  searchEngine: 'google',
  showBookmarks: true,
  blurWallpaperOnSearch: true,
};
