import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import type { useWidgetStore } from './useWidgetStore';
import type { WidgetConfig } from './types';
import { WidgetRenderer } from './WidgetRenderer';

interface DashboardGridProps {
  store: ReturnType<typeof useWidgetStore>;
  onOpenAddWidget: (column: number) => void;
}

// active drag state tracking pointer position, target insertion index, and dimensions
interface ActiveDragState {
  widgetId: string;
  widget: WidgetConfig;
  sourceIndex: number;
  targetIndex: number;
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

// maps numerical column span to responsive tailwind grid column utility classes
function getColSpanClass(span = 1): string {
  switch (span) {
    case 2:
      return 'col-span-1 md:col-span-2';
    case 3:
      return 'col-span-1 md:col-span-2 lg:col-span-3';
    case 4:
      return 'col-span-1 md:col-span-2 lg:col-span-4';
    default:
      return 'col-span-1';
  }
}

// unified 4-column css grid with horizontal widget spanning, top-to-bottom auto-flow, and zero-repaint dragging
export const DashboardGrid: React.FC<DashboardGridProps> = ({
  store,
  onOpenAddWidget,
}) => {
  const {
    state,
    removeWidget,
    updateWidget,
    updateWidgetTitle,
    updateWidgetColSpan,
    reorderWidgets,
  } = store;

  const [dragState, setDragState] = useState<ActiveDragState | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<ActiveDragState | null>(null);
  dragStateRef.current = dragState;

  // sorted widgets list respecting sequential order
  const sortedWidgets = [...state.widgets].sort((a, b) => a.order - b.order);

  // initiates drag sequence when a widget header grip is grabbed
  const handleStartDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, widget: WidgetConfig, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const itemIdx = sortedWidgets.findIndex((w) => w.id === widget.id);

      const initialDrag: ActiveDragState = {
        widgetId: widget.id,
        widget,
        sourceIndex: itemIdx >= 0 ? itemIdx : 0,
        targetIndex: itemIdx >= 0 ? itemIdx : 0,
        clientX: e.clientX,
        clientY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        width: rect.width,
        height: rect.height,
      };

      setDragState(initialDrag);
    },
    [sortedWidgets]
  );

  // global pointer move and up listeners while dragging is active
  useEffect(() => {
    if (!dragState) return;

    // calculates target insertion slot in the grid based on cursor 2d coordinates
    const handlePointerMove = (e: PointerEvent) => {
      const current = dragStateRef.current;
      if (!current || !gridContainerRef.current) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      const cards = Array.from(
        gridContainerRef.current.querySelectorAll<HTMLElement>('[data-widget-id]')
      ).filter((card) => card.dataset.widgetId !== current.widgetId);

      let targetIndex = cards.length;

      for (let i = 0; i < cards.length; i++) {
        const cardRect = cards[i].getBoundingClientRect();
        // check if cursor is above or to the left of the card center
        if (clientY < cardRect.top) {
          targetIndex = i;
          break;
        } else if (clientY <= cardRect.bottom) {
          if (clientX < cardRect.left + cardRect.width / 2) {
            targetIndex = i;
            break;
          }
        }
      }

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              clientX,
              clientY,
              targetIndex,
            }
          : null
      );
    };

    // commits widget move to new slot when pointer is released
    const handlePointerUp = () => {
      const current = dragStateRef.current;
      if (current) {
        reorderWidgets(current.widgetId, current.targetIndex);
      }
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, reorderWidgets]);

  // empty state when user has zero widgets
  if (state.widgets.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 py-28 flex flex-col items-center justify-center text-center select-none">
        <div className="w-12 h-12 rounded-xl bg-[#1e1e1e] border border-[#2d2d2d] flex items-center justify-center text-[#858585] mb-4">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold text-[#cccccc]">Your Dashboard is Empty</h2>
        <p className="text-xs text-[#858585] max-w-sm mt-1.5 leading-relaxed">
          Add live charts, weather forecasts, quick bookmarks, or notes. Expand them across columns or drag to reorder.
        </p>
        <button
          type="button"
          onClick={() => onOpenAddWidget(0)}
          className="mt-5 px-4 py-2 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>
    );
  }

  // filter out dragged item from normal rendering flow so placeholder can take its spot
  const filteredWidgets = dragState
    ? sortedWidgets.filter((w) => w.id !== dragState.widgetId)
    : sortedWidgets;

  return (
    <div
      ref={gridContainerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start w-full max-w-[1680px] mx-auto px-4 sm:px-6 py-2 select-none"
    >
      {/* render widgets and drop placeholder at calculated target slot */}
      {filteredWidgets.map((widget, itemIdx) => {
        const showPlaceholderBeforeThis = dragState && dragState.targetIndex === itemIdx;

        return (
          <React.Fragment key={widget.id}>
            {/* dynamic vscode blue dashed drop placeholder spanning target column width */}
            {showPlaceholderBeforeThis && (
              <div
                className={`w-full rounded-xl border-2 border-dashed border-[#007acc] bg-[#007acc]/15 transition-all duration-150 flex items-center justify-center pointer-events-none select-none my-1 ${getColSpanClass(
                  dragState.widget.colSpan || 1
                )}`}
                style={{ height: `${Math.min(dragState.height, 240)}px` }}
              >
                <div className="w-16 h-1 bg-[#007acc]/60 rounded-full" />
              </div>
            )}

            <div
              data-widget-id={widget.id}
              className={`w-full transition-all duration-150 ${getColSpanClass(widget.colSpan || 1)}`}
            >
              <WidgetRenderer
                widget={widget}
                onRemove={removeWidget}
                onUpdate={updateWidget}
                onUpdateTitle={updateWidgetTitle}
                onUpdateColSpan={updateWidgetColSpan}
                onStartDrag={handleStartDrag}
                isDraggingThis={false}
              />
            </div>
          </React.Fragment>
        );
      })}

      {/* dynamic drop placeholder at the very end of the grid */}
      {dragState && dragState.targetIndex >= filteredWidgets.length && (
        <div
          className={`w-full rounded-xl border-2 border-dashed border-[#007acc] bg-[#007acc]/15 transition-all duration-150 flex items-center justify-center pointer-events-none select-none my-1 ${getColSpanClass(
            dragState.widget.colSpan || 1
          )}`}
          style={{ height: `${Math.min(dragState.height, 240)}px` }}
        >
          <div className="w-16 h-1 bg-[#007acc]/60 rounded-full" />
        </div>
      )}

      {/* lightweight floating ghost card with unrendered body during active drag */}
      {dragState && (
        <div
          style={{
            position: 'fixed',
            left: `${dragState.clientX - dragState.offsetX}px`,
            top: `${dragState.clientY - dragState.offsetY}px`,
            width: `${dragState.width}px`,
            height: `${dragState.height}px`,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'scale(1.02) rotate(0.8deg)',
            transition: 'transform 0.05s ease',
          }}
          className="rounded-xl border-2 border-[#007acc] bg-[#1e1e1e] shadow-2xl overflow-hidden select-none"
        >
          {/* seamless header sharing the exact same background with zero divider line */}
          <div className="bg-transparent px-4 pt-3 pb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#cccccc] truncate">
              {dragState.widget.title}
            </span>
          </div>

          {/* unrendered inner body: clean wireframe placeholder prevents heavy canvas repainting */}
          <div className="w-full h-[calc(100%-41px)] bg-transparent flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2 opacity-30">
              <div className="w-20 h-1 bg-[#cccccc]/40 rounded-full" />
              <div className="w-12 h-1 bg-[#cccccc]/20 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
