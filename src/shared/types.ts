// core types for wallpaper assets, widget state, and user preferences

export type WallpaperType = 'video' | 'image';

export interface Wallpaper {
  id: string;
  title: string;
  type: WallpaperType;
  src: string;
  thumbnail?: string;
  author?: string;
  sourceUrl?: string;
  resolution?: string;
  fps?: number;
}

export type ClockFormat = '12h' | '24h';
export type SearchEngine = 'google' | 'duckduckgo' | 'bing';

export interface NewTabSettings {
  activeWallpaperId: string;
  clockFormat: ClockFormat;
  showClock: boolean;
  showSearch: boolean;
  searchEngine: SearchEngine;
  showBookmarks: boolean;
  blurWallpaperOnSearch: boolean;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  parentId?: string;
}
