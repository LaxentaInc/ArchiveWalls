import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Trash2,
  Check,
  X,
  GripVertical,
  Edit2,
  Maximize2,
  Minimize2,
  Columns,
} from 'lucide-react';
import type { WidgetConfig } from './types';
import { WIDGET_CONSTRAINTS } from './widgetConstraints';

interface WidgetWrapperProps {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateColSpan?: (id: string, colSpan: number) => void;
  onStartDrag?: (e: React.PointerEvent<HTMLDivElement>, widget: WidgetConfig, el: HTMLElement) => void;
  isDraggingThis?: boolean;
  children: React.ReactNode;
}

// seamless single-color matte dark card container with zero internal separation lines
export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  widget,
  onRemove,
  onUpdateTitle,
  onUpdateColSpan,
  onStartDrag,
  isDraggingThis = false,
  children,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(widget.title);
  const [showMenu, setShowMenu] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // automatically dismisses dropdown options when clicking anywhere outside the menu
  useEffect(() => {
    if (!showMenu) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showMenu]);

  const constraints = WIDGET_CONSTRAINTS[widget.type];
  const isEdgeToEdge = constraints?.allowEdgeToEdge ?? false;
  const colSpan = widget.colSpan || 1;

  // commits new widget title to local storage
  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTitle(widget.id, titleInput.trim());
    } else {
      setTitleInput(widget.title);
    }
    setIsEditingTitle(false);
  };

  // cycles horizontal column span: 1 col to 2 cols to 4 cols (full width) then back to 1 col
  const handleCycleColSpan = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateColSpan) return;
    const nextSpan = colSpan === 1 ? 2 : colSpan === 2 ? 4 : 1;
    onUpdateColSpan(widget.id, nextSpan);
  };

  // sets explicit column span from options menu
  const handleSetColSpan = (targetSpan: number) => {
    if (!onUpdateColSpan) return;
    onUpdateColSpan(widget.id, targetSpan);
    setShowMenu(false);
  };

  // initiates pointer drag sequence when user grabs the header
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isEditingTitle) return;
    if ((e.target as HTMLElement).closest('button, input, form, a')) return;

    if (onStartDrag && cardRef.current) {
      onStartDrag(e, widget, cardRef.current);
    }
  };

  // interactive right-edge horizontal drag resize handler snapping between 1, 2, 3, and 4 columns
  const handleHorizontalResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onUpdateColSpan || !cardRef.current) return;

    const parentGrid = cardRef.current.parentElement;
    if (!parentGrid) return;

    const gridRect = parentGrid.getBoundingClientRect();
    const colWidth = gridRect.width / 4;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const cardLeft = cardRef.current ? cardRef.current.getBoundingClientRect().left : 0;
      const targetWidth = moveEvent.clientX - cardLeft;
      const calculatedSpan = Math.max(1, Math.min(4, Math.round(targetWidth / colWidth)));
      if (calculatedSpan !== colSpan) {
        onUpdateColSpan(widget.id, calculatedSpan);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // hide the original card in place while actively floating as a ghost
  if (isDraggingThis) {
    return (
      <div
        ref={cardRef}
        className="w-full rounded-xl border-2 border-dashed border-[#007acc] bg-[#007acc]/15 transition-all duration-150 flex items-center justify-center min-h-[140px]"
        style={{ height: widget.height ? `${widget.height + 40}px` : undefined }}
      >
        <span className="text-xs font-medium text-[#007acc]/80 select-none">
          Moving {widget.title}...
        </span>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`relative w-full select-none bg-[#181818] border border-[#282828] rounded-xl transition-all duration-150 ${
        showMenu ? 'z-40' : 'z-10'
      }`}
    >
      {/* seamless header sharing the exact same background with zero divider line */}
      <div
        onPointerDown={handlePointerDown}
        className="px-3.5 pt-2.5 pb-1 flex items-center justify-between cursor-grab active:cursor-grabbing select-none bg-transparent"
      >
        {/* drag grip and title rename input */}
        <div className="flex items-center space-x-1.5 flex-1 min-w-0 mr-2">
          <div
            className="p-1 -ml-1 text-[#666666] hover:text-[#cccccc] rounded hover:bg-white/5 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {isEditingTitle ? (
            <div className="flex items-center space-x-1.5 flex-1">
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
                className="bg-[#222222] border border-[#333333] rounded px-2 py-0.5 text-xs text-[#cccccc] outline-none focus:border-[#007acc] w-full"
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-1 text-[#cccccc] hover:text-white"
                title="Save title"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitleInput(widget.title);
                  setIsEditingTitle(false);
                }}
                className="p-1 text-[#666666] hover:text-[#cccccc]"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-[#cccccc] hover:text-white cursor-pointer tracking-normal truncate select-none"
              title="Click to rename"
            >
              {widget.title}
            </h3>
          )}
        </div>

        {/* top right utility actions: horizontal width expander and options menu */}
        <div className="relative flex items-center space-x-1 shrink-0">
          {/* horizontal width expander button */}
          {onUpdateColSpan && (
            <button
              type="button"
              onClick={handleCycleColSpan}
              className="px-2 py-0.5 text-[10px] font-medium text-[#888888] hover:text-white bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] rounded transition-colors flex items-center space-x-1"
              title={
                colSpan === 1
                  ? 'Expand width to 2 columns'
                  : colSpan === 2
                  ? 'Expand width to 4 columns (full row)'
                  : 'Contract width to 1 column'
              }
            >
              {colSpan >= 4 ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>Full</span>
                </>
              ) : colSpan === 2 ? (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>2 Cols</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>1 Col</span>
                </>
              )}
            </button>
          )}

          {/* options menu dropdown trigger */}
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-[#666666] hover:text-[#cccccc] transition-colors"
            title="Widget options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* options menu dropdown */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-8 z-50 w-44 bg-[#222222] border border-[#333333] rounded-lg py-1 text-xs text-[#cccccc] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setIsEditingTitle(true);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#2a2a2a] hover:text-white transition-colors flex items-center space-x-1.5"
              >
                <Edit2 className="w-3 h-3 text-[#888888]" />
                <span>Rename</span>
              </button>

              {onUpdateColSpan && (
                <>
                  <div className="my-1 border-t border-[#2a2a2a]" />
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#888888] uppercase tracking-wider flex items-center space-x-1">
                    <Columns className="w-3 h-3" />
                    <span>Column Width</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetColSpan(1)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#2a2a2a] transition-colors flex items-center justify-between ${
                      colSpan === 1 ? 'text-[#007acc] font-medium' : 'text-[#cccccc]'
                    }`}
                  >
                    <span>1 Column (Standard)</span>
                    {colSpan === 1 && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetColSpan(2)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#2a2a2a] transition-colors flex items-center justify-between ${
                      colSpan === 2 ? 'text-[#007acc] font-medium' : 'text-[#cccccc]'
                    }`}
                  >
                    <span>2 Columns (Wide)</span>
                    {colSpan === 2 && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetColSpan(4)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#2a2a2a] transition-colors flex items-center justify-between ${
                      colSpan === 4 ? 'text-[#007acc] font-medium' : 'text-[#cccccc]'
                    }`}
                  >
                    <span>4 Columns (Full Row)</span>
                    {colSpan === 4 && <Check className="w-3 h-3" />}
                  </button>
                  <div className="my-1 border-t border-[#2a2a2a]" />
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onRemove(widget.id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* widget body seamlessly attached without separation lines */}
      <div className={isEdgeToEdge ? 'w-full rounded-b-xl overflow-hidden' : 'px-3.5 pb-3 pt-1'}>{children}</div>

      {/* invisible interactive right border resize grip without visual divider lines */}
      {onUpdateColSpan && (
        <div
          onMouseDown={handleHorizontalResizeMouseDown}
          className="absolute right-0 top-0 bottom-0 w-2 hover:w-2.5 cursor-col-resize hover:bg-[#007acc]/20 transition-all z-20"
          title="Drag horizontally to resize columns"
        />
      )}
    </div>
  );
};

export default WidgetWrapper;
