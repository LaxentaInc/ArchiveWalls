import React, { useState } from 'react';
import { MoreHorizontal, Trash2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import type { WidgetConfig } from './types';

interface WidgetWrapperProps {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onMoveColumn?: (id: string, newColumn: number) => void;
  totalColumns?: number;
  children: React.ReactNode;
}

// unified container wrapper providing consistent chrome, controls, and spacious padding for all dashboard widgets
export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  widget,
  onRemove,
  onUpdateTitle,
  onMoveColumn,
  totalColumns = 4,
  children,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(widget.title);
  const [showMenu, setShowMenu] = useState(false);

  // saves the modified widget header title to persistent store
  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTitle(widget.id, titleInput.trim());
    } else {
      setTitleInput(widget.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="group/widget relative w-full bg-[#15171e]/95 border border-white/10 hover:border-white/20 rounded-xl p-4 sm:p-5 transition-all duration-200 select-none">
      {/* widget action and title header bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        {isEditingTitle ? (
          <div className="flex items-center space-x-1.5 flex-1 mr-2">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setTitleInput(widget.title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="bg-black/40 border border-white/20 rounded px-2 py-0.5 text-xs text-white outline-none focus:border-white/50 w-full"
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="p-1 text-white/80 hover:text-white"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setTitleInput(widget.title);
                setIsEditingTitle(false);
              }}
              className="p-1 text-white/40 hover:text-white"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <h3
            onClick={() => setIsEditingTitle(true)}
            className="text-xs font-semibold text-white/90 hover:text-white cursor-pointer tracking-wide flex items-center space-x-1.5"
            title="Click to rename"
          >
            <span>{widget.title}</span>
          </h3>
        )}

        {/* top right utility buttons */}
        <div className="relative flex items-center space-x-1">
          {/* column relocation controls */}
          {onMoveColumn && widget.column > 0 && (
            <button
              type="button"
              onClick={() => onMoveColumn(widget.id, widget.column - 1)}
              className="p-1 text-white/30 hover:text-white/80 transition-colors opacity-0 group-hover/widget:opacity-100"
              title="Move column left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {onMoveColumn && widget.column < totalColumns - 1 && (
            <button
              type="button"
              onClick={() => onMoveColumn(widget.id, widget.column + 1)}
              className="p-1 text-white/30 hover:text-white/80 transition-colors opacity-0 group-hover/widget:opacity-100"
              title="Move column right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* options menu toggle */}
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-white/40 hover:text-white transition-colors"
            title="Widget options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* dropdown menu */}
          {showMenu && (
            <div
              className="absolute right-0 top-7 z-20 w-36 bg-[#1e2029] border border-white/10 rounded-lg py-1 text-xs text-white/80"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setIsEditingTitle(true);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 hover:text-white transition-colors"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onRemove(widget.id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* widget body content */}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default WidgetWrapper;
