import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Bookmark,
  TrendingUp,
  CloudSun,
  FileText,
  Clock,
  Code,
  Layers,
} from 'lucide-react';
import type { WidgetCatalogEntry, WidgetCategory } from './types';
import { WIDGET_CATALOG } from './WidgetCatalog';
import { BookmarksWidget } from './widgets/BookmarksWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { EmbedWidget } from './widgets/EmbedWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { ClockWidget } from './widgets/ClockWidget';

interface WidgetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (entry: WidgetCatalogEntry, column: number) => void;
  totalColumns?: number;
  defaultTargetColumn?: number;
}

// category filter definitions for the modal left sidebar matching startme reference
const CATEGORIES: { id: WidgetCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Widgets', icon: <Layers className="w-4 h-4 text-white/50" /> },
  { id: 'basics', label: 'Basics', icon: <Bookmark className="w-4 h-4 text-blue-400" /> },
  { id: 'finance', label: 'Finance', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
  { id: 'productivity', label: 'Productivity', icon: <FileText className="w-4 h-4 text-amber-400" /> },
  { id: 'utilities', label: 'Utilities', icon: <Code className="w-4 h-4 text-purple-400" /> },
];

// renders clean startme-style icon tiles with a white squircle base
function renderStartMeIcon(iconName: string) {
  switch (iconName) {
    case 'Bookmark':
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600/20" />
        </div>
      );
    case 'TrendingUp':
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
      );
    case 'CloudSun':
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <CloudSun className="w-5 h-5 text-cyan-600" />
        </div>
      );
    case 'FileText':
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-amber-600" />
        </div>
      );
    case 'Clock':
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-indigo-600" />
        </div>
      );
    case 'Code':
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Code className="w-5 h-5 text-violet-600" />
        </div>
      );
    default:
      return (
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-gray-700" />
        </div>
      );
  }
}

export const WidgetSelectorModal: React.FC<WidgetSelectorModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
  // totalColumns = 4,
  defaultTargetColumn = 0,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWidget, setSelectedWidget] = useState<WidgetCatalogEntry>(WIDGET_CATALOG[0]);
  const [targetColumn, setTargetColumn] = useState(defaultTargetColumn);

  // syncs target column when opened with a specific default column
  useEffect(() => {
    if (isOpen) {
      setTargetColumn(defaultTargetColumn);
    }
  }, [isOpen, defaultTargetColumn]);

  // closes modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // filtered catalog entries based on active category and query
  const filteredWidgets = useMemo(() => {
    return WIDGET_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // commits selected widget addition to target column
  const handleAdd = () => {
    onAddWidget(selectedWidget, targetColumn);
    onClose();
  };

  // renders live interactive preview for the right side panel
  const renderPreview = (entry: WidgetCatalogEntry) => {
    switch (entry.type) {
      case 'bookmarks':
        return <BookmarksWidget data={entry.defaultData} onUpdate={() => {}} />;
      case 'embed':
        return <EmbedWidget data={entry.defaultData} onUpdate={() => {}} />;
      case 'weather':
        return <WeatherWidget data={entry.defaultData} onUpdate={() => {}} />;
      case 'notes':
        return <NotesWidget data={entry.defaultData} onUpdate={() => {}} />;
      case 'clock':
        return <ClockWidget data={entry.defaultData} onUpdate={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 select-none">
      {/* modal box strictly constrained in vscode cool dark */}
      <div className="relative w-full max-w-5xl h-[82vh] max-h-[700px] bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl flex flex-col overflow-hidden text-[#cccccc] shadow-2xl">
        
        {/* clean top header in vscode #181818 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2d2d2d] bg-[#181818] shrink-0">
          <div className="w-52 shrink-0">
            <h2 className="text-base font-semibold text-white tracking-normal">
              Add widget
            </h2>
          </div>

          {/* search bar in vscode input styling */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#858585]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search widgets and feeds, or paste a URL"
                className="w-full bg-[#252526] border border-[#3c3c3c] rounded px-3 pl-8 py-1.5 text-xs text-[#cccccc] placeholder-[#666666] outline-none focus:border-[#007acc] transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#858585] hover:text-[#cccccc] rounded hover:bg-white/5 transition-colors shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-column body layout strictly overflow-x hidden */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* left column: categories sidebar */}
          <div className="w-52 border-r border-[#2d2d2d] p-3 flex flex-col space-y-1 bg-[#181818] shrink-0 overflow-y-auto">
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === 'all'
                  ? WIDGET_CATALOG.length
                  : WIDGET_CATALOG.filter((w) => w.category === cat.id).length;

              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-[#2a2d2e] text-[#007acc] font-medium'
                      : 'text-[#858585] hover:text-[#cccccc] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {cat.icon}
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[11px] text-[#666666]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* middle column: widget selection list */}
          <div className="w-84 sm:w-92 border-r border-[#2d2d2d] flex flex-col bg-[#252526] shrink-0 overflow-y-auto p-3 space-y-2">
            {filteredWidgets.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#858585]">
                No widgets found matching your query.
              </div>
            ) : (
              filteredWidgets.map((item) => {
                const isSelected = selectedWidget.name === item.name;

                return (
                  <div
                    key={item.name}
                    onClick={() => setSelectedWidget(item)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-[#2a2d2e] border-[#007acc]'
                        : 'bg-[#1e1e1e] border-[#333333] hover:bg-[#252526]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {renderStartMeIcon(item.iconName)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#cccccc] tracking-normal truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#858585] line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* right column: preview & placement configuration */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-y-auto p-5 min-w-0">
            <div className="flex-1 flex flex-col">
              {/* preview header */}
              <div className="pb-3 mb-3 border-b border-[#2d2d2d]">
                <div className="flex items-center space-x-3">
                  {renderStartMeIcon(selectedWidget.iconName)}
                  <div>
                    <h3 className="text-sm font-semibold text-white">{selectedWidget.name}</h3>
                    <p className="text-xs text-[#858585] mt-0.5">{selectedWidget.description}</p>
                  </div>
                </div>
              </div>

              {/* visual preview box */}
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-[#858585] tracking-wider mb-2">
                  Live Preview
                </span>
                <div className="w-full bg-[#252526] border border-[#333333] rounded-xl p-4">
                  <div className="text-xs font-semibold text-[#cccccc] pb-2 mb-2 border-b border-[#333333]">
                    {selectedWidget.defaultTitle}
                  </div>
                  {renderPreview(selectedWidget)}
                </div>
              </div>

              {/* commit action */}
              <div className="pt-4 mt-4 border-t border-[#2d2d2d] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-[#858585] hover:text-[#cccccc] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded transition-colors shadow-sm"
                >
                  Add to Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetSelectorModal;
