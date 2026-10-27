import React, { useState } from 'react';
import { Plus, X, Globe } from 'lucide-react';
import type { BookmarkData, BookmarkItem } from '../types';

interface BookmarksWidgetProps {
  data: Partial<BookmarkData>;
  onUpdate: (data: Partial<BookmarkData>) => void;
}

// default starter bookmarks for a newly added bookmark group
const DEFAULT_STARTER_BOOKMARKS: BookmarkItem[] = [
  { id: 'b1', title: 'GitHub', url: 'https://github.com' },
  { id: 'b2', title: 'YouTube', url: 'https://youtube.com' },
  { id: 'b3', title: 'Google', url: 'https://google.com' },
  { id: 'b4', title: 'Reddit', url: 'https://reddit.com' },
];

// extracts clean domain hostname for fetching official favicons
function getDomain(rawUrl: string): string {
  try {
    const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    return new URL(url).hostname;
  } catch {
    return rawUrl;
  }
}

// scalable bookmarks group widget allowing custom bookmark addition and deletion
export const BookmarksWidget: React.FC<BookmarksWidgetProps> = ({ data, onUpdate }) => {
  const items = data.items || DEFAULT_STARTER_BOOKMARKS;

  const [isAdding, setIsAdding] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  // adds a new bookmark entry to this widget's collection
  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !urlInput.trim()) return;

    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newItem: BookmarkItem = {
      id: Math.random().toString(36).slice(2, 10),
      title: titleInput.trim(),
      url: formattedUrl,
    };

    onUpdate({ items: [...items, newItem] });
    setTitleInput('');
    setUrlInput('');
    setIsAdding(false);
  };

  // removes a bookmark entry by id
  const handleRemoveBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({ items: items.filter((item) => item.id !== id) });
  };

  return (
    <div className="w-full flex flex-col space-y-3 select-none">
      {/* bookmarks grid with generous touch targets and clean typography */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {items.map((item) => {
          const domain = getDomain(item.url);
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

          return (
            <div key={item.id} className="group relative flex flex-col items-center">
              {/* link anchor */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${item.title} (${item.url})`}
                className="flex flex-col items-center w-full focus:outline-none"
              >
                {/* rounded icon square */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 group-hover:bg-white/10 transition-colors p-2 border border-white/10 group-hover:border-white/20">
                  <img
                    src={faviconUrl}
                    alt={item.title}
                    className="w-6 h-6 object-contain pointer-events-none rounded"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* bookmark label */}
                <span className="text-xs text-white/70 group-hover:text-white transition-colors truncate max-w-[64px] text-center mt-1.5 font-normal">
                  {item.title}
                </span>
              </a>

              {/* delete bookmark button visible on hover */}
              <button
                type="button"
                onClick={(e) => handleRemoveBookmark(item.id, e)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove shortcut"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        {/* add bookmark trigger button */}
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex flex-col items-center w-full group focus:outline-none"
          title="Add new bookmark"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-dashed border-white/20 group-hover:border-white/40 group-hover:bg-white/5 transition-all">
            <Plus className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </div>
          <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors mt-1.5">
            Add
          </span>
        </button>
      </div>

      {/* inline add bookmark modal/form */}
      {isAdding && (
        <form
          onSubmit={handleAddBookmark}
          className="mt-2 p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5"
        >
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <span className="text-xs font-semibold text-white/80 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Add Shortcut</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] text-white/50 mb-1">Title</label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g. GitHub"
              autoFocus
              className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/50 mb-1">URL</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. github.com"
              className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-white/30"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-medium transition-colors"
            >
              Add Shortcut
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookmarksWidget;
