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
        className="relative w-full flex items-center bg-[#1a1a20]/90 hover:bg-[#202028]/95 focus-within:bg-[#202028] transition-colors border border-white/10 focus-within:border-white/25 rounded-full px-4 py-2 text-white shadow-sm"
      >
        {/* search engine selector button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1 text-white/50 hover:text-white mr-3 pr-2 border-r border-white/10 transition-colors focus:outline-none"
            title={`Search engine: ${selectedEngine.name}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <ChevronDown className="w-3 h-3 text-white/30" />
          </button>

          {/* engine dropdown popover */}
          {isMenuOpen && (
            <div className="absolute top-8 left-0 z-50 bg-[#16161a] border border-white/10 rounded-lg py-1 shadow-xl min-w-[130px]">
              {SEARCH_ENGINES.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    setSelectedEngine(engine);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    selectedEngine.id === engine.id
                      ? 'text-white bg-white/10 font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
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
          className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none font-normal"
        />

        {/* submit button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="p-1 text-white/40 hover:text-white transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
