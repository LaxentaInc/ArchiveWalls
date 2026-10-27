import type { WidgetCatalogEntry } from './types';
import { TRADINGVIEW_DEFAULT_URL } from './widgets/EmbedWidget';

// catalog definition of all available widgets available for user dashboard placement
export const WIDGET_CATALOG: WidgetCatalogEntry[] = [
  {
    type: 'bookmarks',
    name: 'Bookmarks',
    description: 'Save and organize your favorite links, quick web shortcuts, and everyday sites.',
    iconName: 'Bookmark',
    category: 'basics',
    defaultTitle: 'Bookmarks',
    defaultData: {
      items: [
        { id: 'b1', title: 'GitHub', url: 'https://github.com' },
        { id: 'b2', title: 'YouTube', url: 'https://youtube.com' },
        { id: 'b3', title: 'Google', url: 'https://google.com' },
        { id: 'b4', title: 'Reddit', url: 'https://reddit.com' },
      ],
    },
  },
  {
    type: 'embed',
    name: 'TradingView Market Chart',
    description: 'Live interactive financial candlestick chart powered by TradingView.',
    iconName: 'TrendingUp',
    category: 'finance',
    defaultTitle: 'S&P 500 Market',
    defaultData: {
      url: TRADINGVIEW_DEFAULT_URL,
      height: 260,
    },
  },
  {
    type: 'weather',
    name: 'Weather Forecast',
    description: 'Accurate conditions and 5-day forecast. Search and select any city worldwide without location tracking.',
    iconName: 'CloudSun',
    category: 'basics',
    defaultTitle: 'Weather',
    defaultData: {
      city: 'Tokyo',
      lat: 35.6762,
      lon: 139.6503,
    },
  },
  {
    type: 'notes',
    name: 'Notes & Scratchpad',
    description: 'Instant scratchpad for thoughts, quick to-dos, drafts, or temporary text.',
    iconName: 'FileText',
    category: 'productivity',
    defaultTitle: 'Quick Notes',
    defaultData: {
      content: '',
    },
  },
  {
    type: 'clock',
    name: 'Clock & Date',
    description: 'Clean digital time display with date and customizable 12h/24h toggle.',
    iconName: 'Clock',
    category: 'utilities',
    defaultTitle: 'Time',
    defaultData: {
      format: '12h',
      showSeconds: false,
    },
  },
  {
    type: 'embed',
    name: 'Custom Web Embed',
    description: 'Embed any web page, player, live monitor, or iframe into your dashboard.',
    iconName: 'Code',
    category: 'utilities',
    defaultTitle: 'Custom Embed',
    defaultData: {
      url: 'https://en.wikipedia.org/wiki/Main_Page',
      height: 260,
    },
  },
];
