import React, { useState } from 'react';
import { Search, Globe, ChevronDown } from 'lucide-react';

interface SearchEngine {
  id: string;
  name: string;
  url: string;
}

const SEARCH_ENGINES: SearchEngine[] = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/search?q=' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
];

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `${selectedEngine.url}${encodeURIComponent(query.trim())}`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="relative w-full h-[50px] flex items-center bg-[#1e1e1e] hover:bg-[#252526] focus-within:bg-[#252526] transition-colors border border-[#2d2d2d] focus-within:border-[#007acc] rounded-full px-5 text-[#cccccc] shadow-lg"
      >
        {/* search engine selector button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1.5 text-[#858585] hover:text-[#cccccc] mr-3.5 pr-2.5 border-r border-[#333333] transition-colors focus:outline-none"
            title={`Search engine: ${selectedEngine.name}`}
          >
            <Globe className="w-4 h-4" />
            <ChevronDown className="w-3.5 h-3.5 text-[#858585]" />
          </button>

          {/* engine dropdown popover */}
          {isMenuOpen && (
            <div className="absolute top-11 left-0 z-50 bg-[#252526] border border-[#3c3c3c] rounded-lg py-1 min-w-[140px] shadow-2xl">
              {SEARCH_ENGINES.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    setSelectedEngine(engine);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedEngine.id === engine.id
                      ? 'text-[#007acc] bg-white/5 font-medium'
                      : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]'
                  }`}
                >
                  <span>{engine.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* input field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web"
          autoFocus
          className="w-full bg-transparent text-sm text-[#cccccc] placeholder-[#777777] outline-none font-normal"
        />

        {/* submit button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="p-1.5 text-[#858585] hover:text-white transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
