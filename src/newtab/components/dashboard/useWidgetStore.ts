import { useState, useEffect, useCallback } from 'react';
import type { WidgetConfig, DashboardState } from './types';

const STORAGE_KEY = 'archive_walls_dashboard';

// generates a short random id for new widgets
function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// default empty dashboard state for first-time users
function getDefaultState(): DashboardState {
  return { widgets: [], columns: 4 };
}

// loads persisted dashboard from local storage or chrome.storage
function loadState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DashboardState;
      if (Array.isArray(parsed.widgets)) return parsed;
    }
  } catch {}
  return getDefaultState();
}

// persists current dashboard state to local storage
function saveState(state: DashboardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// central store managing widget lifecycle: add, remove, reorder, update
export function useWidgetStore() {
  const [state, setState] = useState<DashboardState>(loadState);

  // sync to local storage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addWidget = useCallback((widget: Omit<WidgetConfig, 'id' | 'order'>) => {
    setState((prev) => {
      // place at end of the target column
      const columnWidgets = prev.widgets.filter((w) => w.column === widget.column);
      const order = columnWidgets.length;
      const newWidget: WidgetConfig = {
        ...widget,
        id: genId(),
        order,
      };
      return { ...prev, widgets: [...prev.widgets, newWidget] };
    });
  }, []);

  const removeWidget = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
  }, []);

  const updateWidget = useCallback((id: string, data: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, data: { ...w.data, ...data } } : w
      ),
    }));
  }, []);

  const updateWidgetTitle = useCallback((id: string, title: string) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, title } : w
      ),
    }));
  }, []);

  const moveWidgetColumn = useCallback((id: string, newColumn: number) => {
    setState((prev) => {
      const targetColumnWidgets = prev.widgets.filter((w) => w.column === newColumn);
      const newOrder = targetColumnWidgets.length;
      return {
        ...prev,
        widgets: prev.widgets.map((w) =>
          w.id === id ? { ...w, column: newColumn, order: newOrder } : w
        ),
      };
    });
  }, []);

  // returns widgets sorted by order for a given column index
  const getColumnWidgets = useCallback(
    (column: number) => {
      return state.widgets
        .filter((w) => w.column === column)
        .sort((a, b) => a.order - b.order);
    },
    [state.widgets]
  );

  return {
    state,
    addWidget,
    removeWidget,
    updateWidget,
    updateWidgetTitle,
    moveWidgetColumn,
    getColumnWidgets,
  };
}
