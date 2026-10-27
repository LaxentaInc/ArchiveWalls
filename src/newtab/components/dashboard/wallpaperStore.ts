// live wallpaper store service for browsing and extracting high-definition video wallpapers
// ports extraction and category discovery logic directly from desktop scraper architecture

export interface StoreWallpaperItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  resolution: string;
  detailUrl: string;
  category?: string;
}

export const STORE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'games', label: 'Games' },
  { id: 'anime', label: 'Anime' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'sci-fi', label: 'Sci-Fi' },
] as const;

// default fallback items to provide immediate catalog rendering upon opening
const FALLBACK_STORE_ITEMS: StoreWallpaperItem[] = [
  {
    id: 'k-da-ahri-league-of-legends',
    title: 'K/DA Ahri League of Legends',
    thumbnailUrl: 'https://wallpaperwaifu.com/wp-content/uploads/2020/09/k-da-ahri-league-of-legends-thumb-300x169.jpg',
    resolution: '3840x2160',
    detailUrl: 'https://wallpaperwaifu.com/games/k-da-ahri-league-of-legends-live-wallpaper-2682/',
    category: 'games',
  },
  {
    id: 'cyberpunk-city-flying-cars',
    title: 'Cyberpunk Metropolis Flight',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=75',
    resolution: '1920x1080',
    detailUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-skyscrapers-41551-large.mp4',
    category: 'sci-fi',
  },
  {
    id: 'coven-ahri-league-of-legends',
    title: 'Coven Ahri Live Wallpaper',
    thumbnailUrl: 'https://wallpaperwaifu.com/wp-content/uploads/2021/08/coven-ahri-league-of-legends-thumb-300x169.jpg',
    resolution: '1920x1080',
    detailUrl: 'https://wallpaperwaifu.com/games/coven-ahri-league-of-legends-live-wallpaper-1473/',
    category: 'games',
  },
  {
    id: 'spirit-blossom-ahri',
    title: 'Spirit Blossom Ahri LoL',
    thumbnailUrl: 'https://wallpaperwaifu.com/wp-content/uploads/2020/08/spirit-blossom-ahri-league-of-legends-thumb-300x169.jpg',
    resolution: '1920x1080',
    detailUrl: 'https://wallpaperwaifu.com/games/spirit-blossom-ahri-league-of-legends-live-wallpaper-1185/',
    category: 'games',
  },
  {
    id: 'snow-moon-ahri',
    title: 'Snow Moon Ahri Live Wallpaper',
    thumbnailUrl: 'https://wallpaperwaifu.com/wp-content/uploads/2022/06/snow-moon-ahri-league-of-legends-thumb-300x169.jpg',
    resolution: '1920x1080',
    detailUrl: 'https://wallpaperwaifu.com/games/snow-moon-ahri-league-of-legends-live-wallpaper-2283/',
    category: 'games',
  },
  {
    id: 'misty-forest-pine',
    title: 'Deep Misty Evergreen Forest',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=75',
    resolution: '2560x1440',
    detailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=85',
    category: 'landscape',
  },
];

// fetches live store wallpaper catalog with category filtering and keyword search
export async function fetchStoreWallpapers(
  category = 'all',
  query = ''
): Promise<StoreWallpaperItem[]> {
  try {
    let targetUrl = 'https://wallpaperwaifu.com/';

    if (query.trim()) {
      targetUrl = `https://wallpaperwaifu.com/?s=${encodeURIComponent(query.trim())}`;
    } else if (category && category !== 'all') {
      targetUrl = `https://wallpaperwaifu.com/category/${encodeURIComponent(category)}/`;
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return FALLBACK_STORE_ITEMS;
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // select articles within wallpaperwaifu grid container
    const items = doc.querySelectorAll('div.wall-grid article.wall-grid-item');
    if (!items || items.length === 0) {
      return FALLBACK_STORE_ITEMS;
    }

    const results: StoreWallpaperItem[] = [];

    items.forEach((item, index) => {
      const anchor = item.querySelector('a[href]');
      const href = anchor?.getAttribute('href');
      if (!href) return;

      const img = item.querySelector('img');
      const thumbnail =
        img?.getAttribute('data-src') ||
        img?.getAttribute('src') ||
        '';

      const resElem = item.querySelector('div.wall-res a') || item.querySelector('div.wall-res');
      const resolution = resElem?.textContent?.trim() || '1080p';

      const captionElem = item.querySelector('div.wall-caption');
      const title =
        captionElem?.textContent?.trim() ||
        img?.getAttribute('alt')?.trim() ||
        `Wallpaper ${index + 1}`;

      const id = href.replace(/\/+$/, '').split('/').pop() || `store-${index}`;

      results.push({
        id,
        title,
        thumbnailUrl: thumbnail,
        resolution,
        detailUrl: href,
        category,
      });
    });

    return results.length > 0 ? results : FALLBACK_STORE_ITEMS;
  } catch {
    return FALLBACK_STORE_ITEMS;
  }
}

// resolves actual direct downloadable mp4 video stream url from a store detail webpage
export async function resolveStoreVideoUrl(detailUrl: string): Promise<string> {
  // if url is already a direct video stream link return directly
  if (
    detailUrl.endsWith('.mp4') ||
    detailUrl.endsWith('.webm') ||
    detailUrl.includes('download.php?video=')
  ) {
    return detailUrl;
  }

  try {
    const response = await fetch(detailUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch detail page: HTTP ${response.status}`);
    }

    const html = await response.text();

    // 1. inspect download button data-url attribute
    const dataUrlMatch =
      html.match(/id=["']wf-download["'][^>]*data-url=["']([^"']+)["']/i) ||
      html.match(/data-url=["']([^"']+)["'][^>]*id=["']wf-download["']/i) ||
      html.match(/data-url=["']([^"']+)["']/i);

    if (dataUrlMatch && dataUrlMatch[1]) {
      const rawDataUrl = dataUrlMatch[1];
      return `https://go.wallpaperwaifu.com/download.php?video=${rawDataUrl}`;
    }

    // 2. inspect embedded video preview source regex
    const previewMatch = html.match(/"src":\s*"([^"]+preview\.(?:webm|mp4))"/i);
    if (previewMatch && previewMatch[1]) {
      return previewMatch[1].replace(/\\\//g, '/');
    }

    // 3. inspect direct video tag or source tag
    const sourceMatch = html.match(/<source[^>]*src=["']([^"']+\.(?:mp4|webm))["']/i);
    if (sourceMatch && sourceMatch[1]) {
      return sourceMatch[1];
    }

    // 4. regex scan for any embedded mp4 or webm link
    const anyVideoMatch = html.match(/https?:\/\/[^\s"'<>]+\.(?:mp4|webm)/i);
    if (anyVideoMatch && anyVideoMatch[0]) {
      return anyVideoMatch[0];
    }

    throw new Error('Unable to find direct video download stream on page');
  } catch (err: unknown) {
    throw new Error((err as Error).message || 'Failed to extract video stream');
  }
}
