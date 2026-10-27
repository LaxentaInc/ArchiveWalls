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

// export const DEFAULT_WALLPAPERS: Wallpaper[] = [
// {}

// ];

export const DEFAULT_SETTINGS: NewTabSettings = {
  activeWallpaperId: 'cinematic-cyber-loop',
  clockFormat: '12h',
  showClock: true,
  showSearch: true,
  searchEngine: 'google',
  showBookmarks: true,
  blurWallpaperOnSearch: true,
};
