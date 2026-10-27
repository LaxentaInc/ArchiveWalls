import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Plus,
  X,
} from 'lucide-react';

export interface SearchEngineItem {
  id: string;
  name: string;
  url: string;
  iconType: 'google' | 'bing' | 'yahoo' | 'chatgpt' | 'perplexity' | 'custom';
}

// default search engines matching start.me reference screenshot
const DEFAULT_SEARCH_ENGINES: SearchEngineItem[] = [
  {
    id: 'google',
    name: 'Google (Custom Search)',
    url: 'https://www.google.com/search?q=',
    iconType: 'google',
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    iconType: 'bing',
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p=',
    iconType: 'yahoo',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/?q=',
    iconType: 'chatgpt',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/search?q=',
    iconType: 'perplexity',
  },
];

const SEARCH_STORAGE_KEY = 'archive_walls_active_search_engine';

// renders official authentic vector svgs matching brand guidelines
function renderEngineIcon(iconType: SearchEngineItem['iconType'], name: string) {
  switch (iconType) {
    case 'google':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      );
    case 'bing':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <path
            fill="#008373"
            d="M5.1 2.8L10.7 4.8V17.3L15.9 14.3L13.8 9.3L19.4 11.2L19.4 15.6L10.7 20.6L5.1 17.5V2.8Z"
          />
        </svg>
      );
    case 'yahoo':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#6001d2] shrink-0">
          <span className="text-white font-black text-[10px] tracking-tighter">Y!</span>
        </div>
      );
    case 'chatgpt':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10a37f] shrink-0 text-white p-0.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M22.28 10.45a5.97 5.97 0 0 0-.52-4.94 6.05 6.05 0 0 0-4.47-3.05 6.03 6.03 0 0 0-5.3 1.2A6.03 6.03 0 0 0 7.42 2.5a6.05 6.05 0 0 0-4.47 3.05 5.99 5.99 0 0 0-.52 4.95 6.03 6.03 0 0 0 1.25 5.29 6.05 6.05 0 0 0 .52 4.94 6.05 6.05 0 0 0 4.47 3.05 6.03 6.03 0 0 0 5.3-1.2 6.03 6.03 0 0 0 4.57 1.16 6.05 6.05 0 0 0 4.47-3.05 5.99 5.99 0 0 0 .52-4.95 6.03 6.03 0 0 0-1.25-5.29zm-7.6 10.66a4.48 4.48 0 0 1-2.92-1.07l.15-.08 4.88-2.82a.79.79 0 0 0 .4-.68v-6.9l2.08 1.2a.08.08 0 0 1 .04.06v5.82a4.5 4.5 0 0 1-4.63 4.47zM3.97 18.06a4.48 4.48 0 0 1-.58-3.13l.15.09 4.88 2.82a.78.78 0 0 0 .78 0l5.98-3.45v2.4a.08.08 0 0 1-.03.07l-5.04 2.91a4.5 4.5 0 0 1-6.18-1.71zm-1.42-8.5a4.48 4.48 0 0 1 2.34-2.07v.17l-.01 5.64a.78.78 0 0 0 .39.68l5.98 3.45-2.08 1.2a.08.08 0 0 1-.07 0L4.05 15.7a4.5 4.5 0 0 1-1.5-6.14zm15.82 2.38l-5.98-3.45 2.08-1.2a.08.08 0 0 1 .07 0l5.04 2.91a4.5 4.5 0 0 1-1.2 8.16v-5.74a.79.79 0 0 0-.41-.68zm2.08-3.52l-.15-.09-4.88-2.82a.78.78 0 0 0-.78 0L8.66 9.46V7.06a.08.08 0 0 1 .03-.07l5.04-2.91a4.5 4.5 0 0 1 6.76 4.84zm-9.35 1.54l2.4-1.39 2.4 1.39v2.77l-2.4 1.39-2.4-1.39v-2.77z" />
          </svg>
        </div>
      );
    case 'perplexity':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#17232b] shrink-0 text-[#20b8cd] p-0.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12 2L10.5 7.5L5 6L8 11L3 13.5L8.5 15L7 20.5L12 17L17 20.5L15.5 15L21 13.5L16 11L19 6L13.5 7.5L12 2Z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#252526] shrink-0 text-[#cccccc] font-semibold text-[10px] border border-[#333333]">
          {name.slice(0, 1).toUpperCase()}
        </div>
      );
  }
}

// authentic start.me search bar with official vector svgs and explicit hand pointer cursors
export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [engines, setEngines] = useState<SearchEngineItem[]>(() => {
    try {
      const saved = localStorage.getItem('archive_walls_custom_engines');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SEARCH_ENGINES;
  });

  const [selectedEngine, setSelectedEngine] = useState<SearchEngineItem>(() => {
    try {
      const savedId = localStorage.getItem(SEARCH_STORAGE_KEY);
      if (savedId) {
        const found = DEFAULT_SEARCH_ENGINES.find((e) => e.id === savedId);
        if (found) return found;
      }
    } catch {}
    return DEFAULT_SEARCH_ENGINES[0];
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [newEngineName, setNewEngineName] = useState('');
  const [newEngineUrl, setNewEngineUrl] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // syncs selected search engine to local storage
  const handleSelectEngine = (engine: SearchEngineItem) => {
    setSelectedEngine(engine);
    setIsMenuOpen(false);
    try {
      localStorage.setItem(SEARCH_STORAGE_KEY, engine.id);
    } catch {}
  };

  // submits search query to active search engine url
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `${selectedEngine.url}${encodeURIComponent(query.trim())}`;
  };

  // dismisses dropdown menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  // adds custom search engine to list
  const handleAddCustomEngine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEngineName.trim() || !newEngineUrl.trim()) return;

    let targetUrl = newEngineUrl.trim();
    if (!targetUrl.includes('%s') && !targetUrl.includes('?q=') && !targetUrl.includes('&q=')) {
      targetUrl = `${targetUrl}${targetUrl.includes('?') ? '&q=' : '?q='}`;
    }

    const custom: SearchEngineItem = {
      id: Math.random().toString(36).slice(2, 10),
      name: newEngineName.trim(),
      url: targetUrl,
      iconType: 'custom',
    };

    const updated = [...engines, custom];
    setEngines(updated);
    try {
      localStorage.setItem('archive_walls_custom_engines', JSON.stringify(updated));
    } catch {}
    setNewEngineName('');
    setNewEngineUrl('');
    setIsManaging(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* sleek rounded search container matching start.me reference */}
      <form
        onSubmit={handleSearch}
        className="relative w-full h-[52px] flex items-center bg-[#1c1c1c] hover:bg-[#202020] focus-within:bg-[#202020] transition-colors border border-white/5 focus-within:border-[#383838] rounded-2xl px-4 text-[#cccccc] shadow-xl"
      >
        {/* left engine selector trigger with globe icon and chevron */}
        <div ref={menuRef} className="relative shrink-0 flex items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1.5 text-white/60 hover:text-white mr-3.5 pr-2.5 border-r border-[#2e2e2e] h-5 transition-colors focus:outline-none cursor-pointer"
            title={`Active Engine: ${selectedEngine.name}`}
          >
            <Globe className="w-4 h-4 text-white/80" />
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>

          {/* branded search engine dropdown popover matching screenshot */}
          {isMenuOpen && (
            <div className="absolute top-10 left-0 z-50 w-64 bg-[#181818] border border-[#2a2a2a] rounded-xl p-1.5 shadow-2xl text-xs text-[#cccccc]">
              <div className="space-y-0.5">
                {engines.map((engine) => {
                  const isSelected = selectedEngine.id === engine.id;

                  return (
                    <button
                      key={engine.id}
                      type="button"
                      onClick={() => handleSelectEngine(engine)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {renderEngineIcon(engine.iconType, engine.name)}
                        <span className="truncate text-white/90 text-xs font-normal">
                          {engine.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#007acc] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* separator line */}
              <div className="my-1.5 border-t border-[#262626]" />

              {/* manage search engines action */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsManaging(true);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors text-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-white/50" />
                <span>Manage search engines</span>
              </button>
            </div>
          )}
        </div>

        {/* search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web"
          autoFocus
          className="w-full bg-transparent text-sm text-white/90 placeholder-white/40 outline-none font-normal"
        />

        {/* submit search magnifying icon */}
        <button
          type="submit"
          aria-label="Submit search"
          className="p-1.5 text-white/40 hover:text-white transition-colors shrink-0 cursor-pointer"
        >
          <Search className="w-4.5 h-4.5" />
        </button>
      </form>

      {/* manage / add custom search engines modal */}
      {isManaging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-md bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 text-[#cccccc] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#282828]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#007acc]" />
                <h3 className="text-sm font-semibold text-white">Search Engines</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManaging(false)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* active list */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {engines.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#202020] border border-[#2c2c2c] text-xs"
                >
                  <div className="flex items-center space-x-2">
                    {renderEngineIcon(e.iconType, e.name)}
                    <span className="text-white/90 font-medium">{e.name}</span>
                  </div>
                  <span className="text-[10px] text-white/40 truncate max-w-[150px]">
                    {e.url}
                  </span>
                </div>
              ))}
            </div>

            {/* add new engine form */}
            <form onSubmit={handleAddCustomEngine} className="space-y-2.5 pt-2 border-t border-[#282828]">
              <span className="text-xs font-semibold text-white/80 block">Add Custom Engine</span>
              <div>
                <label className="block text-[10px] text-white/50 mb-1">Name</label>
                <input
                  type="text"
                  value={newEngineName}
                  onChange={(e) => setNewEngineName(e.target.value)}
                  placeholder="e.g. DuckDuckGo"
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#007acc]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/50 mb-1">Search URL</label>
                <input
                  type="text"
                  value={newEngineUrl}
                  onChange={(e) => setNewEngineUrl(e.target.value)}
                  placeholder="https://duckduckgo.com/?q="
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#007acc]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManaging(false)}
                  className="px-3 py-1.5 text-xs text-white/50 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded-lg flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Engine</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
