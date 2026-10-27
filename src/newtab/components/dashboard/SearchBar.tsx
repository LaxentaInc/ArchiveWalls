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

// renders official brand icon tiles matching start.me search dropdown
function renderEngineIcon(iconType: SearchEngineItem['iconType'], name: string) {
  switch (iconType) {
    case 'google':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#1a73e8] shrink-0 text-white font-bold text-[11px]">
          G
        </div>
      );
    case 'bing':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#008272] shrink-0 text-white font-bold text-[11px]">
          b
        </div>
      );
    case 'yahoo':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#6001d2] shrink-0 text-white font-bold text-[10px]">
          Y!
        </div>
      );
    case 'chatgpt':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10a37f] shrink-0 text-white font-bold text-[10px]">
          AI
        </div>
      );
    case 'perplexity':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#194857] shrink-0 text-cyan-300 font-bold text-[10px]">
          P
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

// authentic start.me search bar with branded engine selector and custom engine management
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
            className="flex items-center space-x-1.5 text-white/60 hover:text-white mr-3.5 pr-2.5 border-r border-[#2e2e2e] h-5 transition-colors focus:outline-none"
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
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
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
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors text-xs"
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
          className="p-1.5 text-white/40 hover:text-white transition-colors shrink-0"
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
                className="text-white/40 hover:text-white"
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
                  className="px-3 py-1.5 text-xs text-white/50 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded-lg flex items-center space-x-1.5"
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
