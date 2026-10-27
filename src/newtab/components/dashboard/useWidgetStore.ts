import { useState, useEffect, useCallback } from 'react';
import type { WidgetConfig, DashboardState } from './types';
import { TRADINGVIEW_DEFAULT_URL } from './widgets/EmbedWidget';

const STORAGE_KEY = 'archive_walls_dashboard';

// generates a short random id for newly created widgets
function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// default starter widgets with vscode cool black layout and horizontal span
function getDefaultState(): DashboardState {
  return {
    columns: 4,
    widgets: [
      {
        id: 'w-notes',
        type: 'notes',
        title: 'RSS/News widget',
        column: 0,
        order: 0,
        colSpan: 1,
        data: {
          content: 'Add your live feeds, notes, and alerts here.',
        },
      },
      {
        id: 'w-weather',
        type: 'weather',
        title: 'Weather',
        column: 0,
        order: 1,
        colSpan: 1,
        data: {
          city: 'Tokyo, JP',
          lat: 35.6762,
          lon: 139.6503,
        },
      },
      {
        id: 'w-market',
        type: 'embed',
        title: 'S&P 500 - Realtime',
        column: 1,
        order: 2,
        colSpan: 2,
        height: 380,
        data: {
          url: TRADINGVIEW_DEFAULT_URL,
        },
      },
      {
        id: 'w-shopping',
        type: 'bookmarks',
        title: 'Shopping',
        column: 3,
        order: 3,
        colSpan: 1,
        data: {
          items: [
            { id: 's1', title: 'Amazon', url: 'https://amazon.com' },
            { id: 's2', title: 'Flipkart', url: 'https://flipkart.com' },
            { id: 's3', title: 'Rediff', url: 'https://rediff.com' },
            { id: 's4', title: 'Myntra', url: 'https://myntra.com' },
            { id: 's5', title: 'Paytm Mall', url: 'https://paytmmall.com' },
          ],
        },
      },
      {
        id: 'w-popular',
        type: 'bookmarks',
        title: 'Popular',
        column: 0,
        order: 4,
        colSpan: 2,
        data: {
          items: [
            { id: 'p1', title: 'ChatGPT', url: 'https://chatgpt.com' },
            { id: 'p2', title: 'Gmail', url: 'https://mail.google.com' },
            { id: 'p3', title: 'Google', url: 'https://google.com' },
            { id: 'p4', title: 'Facebook', url: 'https://facebook.com' },
            { id: 'p5', title: 'WhatsApp', url: 'https://web.whatsapp.com' },
            { id: 'p6', title: 'LinkedIn', url: 'https://linkedin.com' },
            { id: 'p7', title: 'YouTube', url: 'https://youtube.com' },
          ],
        },
      },
      {
        id: 'w-travel',
        type: 'bookmarks',
        title: 'Travel',
        column: 2,
        order: 5,
        colSpan: 2,
        data: {
          items: [
            { id: 't1', title: 'Booking.com', url: 'https://booking.com' },
            { id: 't2', title: 'Emirates', url: 'https://emirates.com' },
            { id: 't3', title: 'Hotels.com', url: 'https://hotels.com' },
            { id: 't4', title: 'TripAdvisor', url: 'https://tripadvisor.com' },
            { id: 't5', title: 'MakeMyTrip', url: 'https://makemytrip.com' },
          ],
        },
      },
    ],
  };
}

// loads persisted dashboard state from local storage and normalizes column assignment and span
function loadState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DashboardState;
      if (Array.isArray(parsed.widgets) && parsed.widgets.length > 0) {
        const normalizedWidgets: WidgetConfig[] = parsed.widgets.map((w, idx) => ({
          ...w,
          column: typeof w.column === 'number' ? w.column : idx % 4,
          order: typeof w.order === 'number' ? w.order : idx,
          colSpan: typeof w.colSpan === 'number' ? Math.max(1, Math.min(4, w.colSpan)) : (w.type === 'embed' ? 2 : 1),
        }));

        return {
          columns: 4,
          widgets: normalizedWidgets.sort((a, b) => a.order - b.order),
        };
      }
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

// central state store managing widget lifecycle, multi-column spanning, and reordering
export function useWidgetStore() {
  const [state, setState] = useState<DashboardState>(loadState);

  // sync to local storage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // appends a new widget to the layout with optional horizontal column span
  const addWidget = useCallback(
    (
      widget: Omit<WidgetConfig, 'id' | 'order'> & { column?: number; colSpan?: number },
      targetColumn = 0
    ) => {
      setState((prev) => {
        const nextOrder = prev.widgets.length;
        const newWidget: WidgetConfig = {
          ...widget,
          id: genId(),
          column: widget.column ?? targetColumn ?? 0,
          order: nextOrder,
          colSpan: widget.colSpan ?? 1,
        };

        return { ...prev, widgets: [...prev.widgets, newWidget] };
      });
    },
    []
  );

  // removes a widget by its id and recalibrates order indices
  const removeWidget = useCallback((id: string) => {
    setState((prev) => {
      const remaining = prev.widgets
        .filter((w) => w.id !== id)
        .map((w, idx) => ({ ...w, order: idx }));
      return { ...prev, widgets: remaining };
    });
  }, []);

  // updates horizontal column span of a widget (1 to 4 columns)
  const updateWidgetColSpan = useCallback((id: string, colSpan: number) => {
    const clampedSpan = Math.max(1, Math.min(4, colSpan));
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, colSpan: clampedSpan } : w
      ),
    }));
  }, []);

  // reorders widgets by placing dragged widget at target index
  const reorderWidgets = useCallback((widgetId: string, targetIndex: number) => {
    setState((prev) => {
      const itemToMove = prev.widgets.find((w) => w.id === widgetId);
      if (!itemToMove) return prev;

      const remaining = prev.widgets.filter((w) => w.id !== widgetId);
      const clampedIndex = Math.max(0, Math.min(remaining.length, targetIndex));

      remaining.splice(clampedIndex, 0, itemToMove);
      const reIndexed = remaining.map((w, idx) => ({
        ...w,
        order: idx,
      }));

      return { ...prev, widgets: reIndexed };
    });
  }, []);

  // legacy column move adapter ensuring backwards compatibility
  const moveWidget = useCallback(
    (widgetId: string, _targetCol: number, targetSlot: number) => {
      reorderWidgets(widgetId, targetSlot);
    },
    [reorderWidgets]
  );

  // updates widget data payload
  const updateWidget = useCallback((id: string, data: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, data: { ...w.data, ...data } } : w
      ),
    }));
  }, []);

  // updates widget title in header
  const updateWidgetTitle = useCallback((id: string, title: string) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, title } : w
      ),
    }));
  }, []);

  // adjusts custom height parameter for widgets like embed
  const updateWidgetHeight = useCallback((id: string, height: number) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, height } : w
      ),
    }));
  }, []);

  return {
    state,
    addWidget,
    removeWidget,
    moveWidget,
    reorderWidgets,
    updateWidgetColSpan,
    updateWidget,
    updateWidgetTitle,
    updateWidgetHeight,
  };
}

export default useWidgetStore;
