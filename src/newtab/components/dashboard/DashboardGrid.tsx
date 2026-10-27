import React from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import type { useWidgetStore } from './useWidgetStore';
import { WidgetRenderer } from './WidgetRenderer';

interface DashboardGridProps {
  store: ReturnType<typeof useWidgetStore>;
  onOpenAddWidget: (column: number) => void;
}

// 4-column dashboard layout rendering user configured widgets with calm spacious styling
export const DashboardGrid: React.FC<DashboardGridProps> = ({
  store,
  onOpenAddWidget,
}) => {
  const { state, removeWidget, updateWidget, updateWidgetTitle, moveWidgetColumn, getColumnWidgets } =
    store;

  const totalColumns = state.columns || 4;

  // empty state when user hasn't added any widgets yet
  if (state.widgets.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-4">
          <LayoutGrid className="w-7 h-7" />
        </div>
        <h2 className="text-base font-medium text-white/90">Your Dashboard is Fresh</h2>
        <p className="text-xs text-white/50 max-w-sm mt-1.5 leading-relaxed">
          Customize your workspace. Add live TradingView charts, weather forecasts, custom bookmarks, or quick notes.
        </p>
        <button
          type="button"
          onClick={() => onOpenAddWidget(0)}
          className="mt-6 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium rounded-md flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your First Widget</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {Array.from({ length: totalColumns }).map((_, colIdx) => {
          const colWidgets = getColumnWidgets(colIdx);

          return (
            <div key={colIdx} className="flex flex-col space-y-5 min-h-[180px]">
              {colWidgets.map((widget) => (
                <WidgetRenderer
                  key={widget.id}
                  widget={widget}
                  onRemove={removeWidget}
                  onUpdate={updateWidget}
                  onUpdateTitle={updateWidgetTitle}
                  onMoveColumn={moveWidgetColumn}
                  totalColumns={totalColumns}
                />
              ))}

              {/* quick add button per column */}
              <button
                type="button"
                onClick={() => onOpenAddWidget(colIdx)}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-white/25 hover:bg-white/5 text-white/30 hover:text-white/70 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
                title={`Add widget to column ${colIdx + 1}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add widget</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardGrid;
