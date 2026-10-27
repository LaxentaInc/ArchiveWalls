// widget system type definitions for scalable dashboard architecture
// each widget is a user-placed unit that persists across sessions

export type WidgetType =
  | 'bookmarks'
  | 'weather'
  | 'embed'
  | 'notes'
  | 'clock';

export type WidgetCategory =
  | 'all'
  | 'basics'
  | 'finance'
  | 'productivity'
  | 'utilities';

// bookmark link item used by the bookmarks widget
export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

// bookmark widget configuration payload
export interface BookmarkData {
  items: BookmarkItem[];
}

// embed widget configuration payload for tradingview or custom iframes
export interface EmbedData {
  url: string;
  height?: number;
}

// notes widget configuration payload
export interface NotesData {
  content: string;
}

// clock widget configuration payload
export interface ClockData {
  format: '12h' | '24h';
  showSeconds: boolean;
  timezone?: string;
}

// daily forecast row used by weather widget
export interface DailyForecast {
  day: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

// localized weather state data
export interface LocalizedWeather {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
  daily: DailyForecast[];
  isLoading: boolean;
}

// weather widget configuration payload
export interface WeatherData {
  city: string;
  lat: number;
  lon: number;
}

// individual widget configuration stored in user's layout
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  column: number;
  order: number;
  colSpan?: number;
  width?: number;
  height?: number;
  // widget-specific configuration payload
  data: Record<string, unknown>;
}

// full persisted dashboard state
export interface DashboardState {
  widgets: WidgetConfig[];
  columns: number;
}

// widget catalog entry shown in the add widget modal
export interface WidgetCatalogEntry {
  type: WidgetType;
  name: string;
  description: string;
  iconName: string;
  category: WidgetCategory;
  defaultTitle: string;
  defaultData: Record<string, unknown>;
}
