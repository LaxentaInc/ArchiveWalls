// widget layout constraints and dimension boundary definitions
// maps every widget type to strict min, default, and max grid dimensions to prevent overflow or overlapping
import type { WidgetType, WidgetCategory } from './types';

export interface WidgetConstraint {
  minWidth: number;
  defaultWidth: number;
  maxWidth: number;
  minHeight: number;
  defaultHeight: number;
  maxHeight: number;
  allowEdgeToEdge: boolean;
  category: WidgetCategory;
}

// global constraint mapping ensuring widgets adhere to safe responsive bounds
export const WIDGET_CONSTRAINTS: Record<WidgetType, WidgetConstraint> = {
  embed: {
    minWidth: 360,
    defaultWidth: 540,
    maxWidth: 820,
    minHeight: 260,
    defaultHeight: 380,
    maxHeight: 560,
    allowEdgeToEdge: true,
    category: 'finance',
  },
  weather: {
    minWidth: 280,
    defaultWidth: 320,
    maxWidth: 480,
    minHeight: 180,
    defaultHeight: 220,
    maxHeight: 320,
    allowEdgeToEdge: false,
    category: 'basics',
  },
  bookmarks: {
    minWidth: 280,
    defaultWidth: 340,
    maxWidth: 580,
    minHeight: 140,
    defaultHeight: 190,
    maxHeight: 360,
    allowEdgeToEdge: false,
    category: 'basics',
  },
  notes: {
    minWidth: 260,
    defaultWidth: 320,
    maxWidth: 520,
    minHeight: 160,
    defaultHeight: 220,
    maxHeight: 380,
    allowEdgeToEdge: false,
    category: 'productivity',
  },
  clock: {
    minWidth: 240,
    defaultWidth: 280,
    maxWidth: 360,
    minHeight: 130,
    defaultHeight: 160,
    maxHeight: 220,
    allowEdgeToEdge: false,
    category: 'utilities',
  },
};

// clamps requested width within safe boundaries for a given widget type
export function clampWidth(type: WidgetType, width: number): number {
  const constraint = WIDGET_CONSTRAINTS[type] || { minWidth: 260, maxWidth: 820 };
  return Math.max(constraint.minWidth, Math.min(constraint.maxWidth, width));
}

// clamps requested height within safe boundaries for a given widget type
export function clampHeight(type: WidgetType, height: number): number {
  const constraint = WIDGET_CONSTRAINTS[type] || { minHeight: 130, maxHeight: 560 };
  return Math.max(constraint.minHeight, Math.min(constraint.maxHeight, height));
}
