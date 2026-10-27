# ColorWall Extension

A modern, high-performance new tab dashboard and live video wallpaper engine for Chromium browsers (Chrome, Edge, Brave, Opera).

![ColorWall Dashboard Preview](https://private-user-images.githubusercontent.com/204142083/686684926-03bc831c-cf7c-401b-96ac-34676be0c95f.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTMxMzE4NjUsIm5iZiI6MTc5MzEzMTU2NSwicGF0aCI6Ii8yMDQxNDIwODMvNjg2Njg0OTI2LTAzYmM4MzFjLWNmN2MtNDAxYi05NmFjLTM0Njc2YmUwYzk1Zi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAyN1QyMDA2MDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03M2NhMDYwM2JlZjQ1MGQzMGZiNzcxZmY2OGMwZWNmZTgxYjhhMmEwNDdiOGU0ZWJhN2JiMmI4MDA1ZmYwMmQzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.3KQxOCbNyYOU0oiv3fWcBCXyVcU3KtB3auYyx3HVjUQ)

---

## Overview

ColorWall transforms your default browser new tab into a customizable, responsive dashboard powered by offline video wallpapers, real-time widget layouts, and direct access to online live wallpaper repositories.

Built with React 19, TypeScript, and Vite under Chrome Manifest V3, ColorWall bypasses browser storage limitations using a dual-tier storage architecture and delivers zero-repaint widget dragging.

---

## Features

### 1. Live Video Wallpaper Engine
- **Offline Binary Caching**: Uses native **IndexedDB** (`archive_walls_media_db`) to store 50MB to 100MB+ 4K/60FPS video blobs locally, completely bypassing the browser's 5MB `localStorage` ceiling.
- **Instant Playback**: Video Blobs are loaded directly into hardware-accelerated HTML5 `<video>` tags via object URLs with autoplay, looping, and muted playback.
- **Graceful Fallbacks**: Decodes streams safely with error boundary handlers that fall back to curated alpine landscape presets or 3D kinetic rock simulations if a file stream errors.

### 2. Built-in Wallpaper Store
- **Catalog Browsing**: Direct client-side category feeds for **Games**, **Anime**, **Fantasy**, **Landscape**, and **Sci-Fi**.
- **Live Search**: Instant keyword querying to find live wallpapers across online libraries.
- **Automated Stream Resolver**: Paste any detail page URL or click **Download & Set** in the store. ColorWall parses the page DOM, resolves the obfuscated video download endpoint, and fetches the raw MP4 stream automatically.

### 3. Cyber-Matte Download HUD
- **Real-Time Stream Metrics**: Floating HUD displaying live download progression, transferred bytes (`18.4 MB / 84.1 MB`), download speed (`4.2 MB/s`), and dynamic percentage.
- **Abort Controls**: Integrated `AbortController` cancellation allows users to cleanly cancel background downloads at any time.
- **Error Surfacing**: Surfaces descriptive error cards if a target URL is unreachable or not a valid video stream.

### 4. Zero-Repaint Modular Widget Grid
- **4-Column CSS Grid**: Widgets drag and drop with sticky top-to-bottom auto-arrangement. Widget contents unrender during drag operations to eliminate unnecessary layout repainting.
- **Horizontal Column Expansion**: Widgets can dynamically span from 1 to 4 columns.
- **VS Code Matte Dark Aesthetic**: Unified single-color backgrounds (`#181818`, `#1e1e1e`) without harsh separator lines or clipping issues.
- **Built-in Widgets**:
  - **Clock**: Time and date display.
  - **Bookmarks**: Visual bookmarks with custom categorisation.
  - **Notes**: Persistent sticky scratchpad.
  - **Weather**: Forecast metrics.
  - **Embeds**: Web frame embedding.

### 5. Multi-Engine Search
- Fast search bar matching modern clean aesthetic.
- Includes official brand vector icons for **Google**, **Bing**, **Yahoo**, **ChatGPT**, and **Perplexity**.
- Custom search engine manager allowing arbitrary query URL templates (`%s` or `?q=`).

---

## Technical Architecture

```
src/
├── background/
│   └── service-worker.ts      # manifest v3 service worker for context menus & clipping
├── newtab/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── widgets/              # clock, bookmarks, notes, weather, embed widgets
│   │   │   ├── DashboardGrid.tsx     # direct 4-column zero-repaint grid layout
│   │   │   ├── SearchBar.tsx         # multi-engine search bar with vector svgs
│   │   │   ├── BackgroundPickerModal # modal for presets, store, uploads, and links
│   │   │   ├── VideoDownloadContext  # chunked stream fetcher and download state
│   │   │   ├── VideoDownloadHUD.tsx  # cyber-matte floating progress hud
│   │   │   ├── videoStorage.ts       # indexeddb layer for 50mb+ video blob storage
│   │   │   ├── useBackgroundStore    # unified background provider react context
│   │   │   ├── useWidgetStore.ts     # persistent widget grid state
│   │   │   └── wallpaperStore.ts     # category scraper and download resolver
│   │   └── rock-sequence/            # 3d kinetic rocks canvas background
│   ├── styles/                       # tailwind and global dark theme styles
│   ├── App.tsx                       # root application mount with unified providers
│   └── main.tsx                      # client react entrypoint
└── manifest.json                     # chrome extension manifest v3 configuration
```

### Storage Strategy
| Data Layer | Engine | Capacity | Purpose |
| :--- | :--- | :--- | :--- |
| **Media Blobs** | IndexedDB | Multiple GBs | Raw binary MP4/WebM video files for offline wallpaper playback |
| **Video Metadata** | `localStorage` | < 100 KB | Custom titles, byte sizes, timestamps, and IndexedDB key references |
| **Widget Layout** | `localStorage` | < 50 KB | Widget catalog state, column assignments, and custom widget data |
| **Search Settings**| `localStorage` | < 10 KB | Selected search engine and custom search URL templates |

---

## Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler**: Vite 6 with `@crxjs/vite-plugin`
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React + custom vector SVGs
- **Database**: Browser-native IndexedDB (`IDBDatabase`)
- **Package Manager**: `pnpm`

---

## Development & Installation

### Prerequisites
- Node.js (v18 or higher)
- `pnpm` (`npm install -g pnpm`)

### Setup
```bash
# clone repository
git clone https://github.com/LaxentaInc/ArchiveWalls.git
cd ArchiveWalls

# install dependencies
pnpm install
```

### Build & Watch
```bash
# start development build in watch mode
pnpm dev

# or generate a production build
pnpm build
```

### Load in Chromium Browsers
1. Navigate to `chrome://extensions/` in your browser.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `./dist` folder inside the project directory.
5. Open a new tab (`Ctrl + T`) to launch ColorWall.

---

## License

Private repository &bull; ColorWall &copy; LaxentaInc.