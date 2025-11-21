import { ColorPaletteName } from './types';

/**
 * Predefined color palettes for task bars
 */
export const COLOR_PALETTES: Record<ColorPaletteName, {
  completed: string;
  inProgress: string;
  notStarted: string;
  colors: string[];
}> = {
  default: {
    completed: '#10b981',   // Green
    inProgress: '#3b82f6',  // Blue
    notStarted: '#6b7280',  // Gray
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  },
  vivid: {
    completed: '#22c55e',   // Bright Green
    inProgress: '#3b82f6',  // Bright Blue
    notStarted: '#94a3b8',  // Light Gray
    colors: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899']
  },
  pastel: {
    completed: '#86efac',   // Pastel Green
    inProgress: '#93c5fd',  // Pastel Blue
    notStarted: '#cbd5e1',  // Pastel Gray
    colors: ['#fca5a5', '#fdba74', '#fcd34d', '#bef264', '#86efac', '#5eead4', '#67e8f9', '#93c5fd', '#a5b4fc', '#c4b5fd', '#f0abfc', '#f9a8d4']
  },
  warm: {
    completed: '#fb923c',   // Orange
    inProgress: '#f59e0b',  // Amber
    notStarted: '#a8a29e',  // Warm Gray
    colors: ['#dc2626', '#ea580c', '#f59e0b', '#facc15', '#fb923c', '#f87171', '#fbbf24', '#fde047']
  },
  cool: {
    completed: '#06b6d4',   // Cyan
    inProgress: '#0ea5e9',  // Sky Blue
    notStarted: '#94a3b8',  // Cool Gray
    colors: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#0891b2', '#0284c7', '#2563eb']
  },
  earth: {
    completed: '#84cc16',   // Lime
    inProgress: '#a3e635',  // Light Lime
    notStarted: '#a8a29e',  // Stone
    colors: ['#78716c', '#a3e635', '#84cc16', '#65a30d', '#facc15', '#eab308', '#ca8a04', '#92400e']
  },
  ocean: {
    completed: '#14b8a6',   // Teal
    inProgress: '#06b6d4',  // Cyan
    notStarted: '#64748b',  // Slate
    colors: ['#0891b2', '#06b6d4', '#0ea5e9', '#0284c7', '#14b8a6', '#2dd4bf', '#22d3ee', '#38bdf8']
  },
  forest: {
    completed: '#22c55e',   // Green
    inProgress: '#10b981',  // Emerald
    notStarted: '#78716c',  // Stone
    colors: ['#15803d', '#16a34a', '#22c55e', '#10b981', '#059669', '#84cc16', '#65a30d', '#4d7c0f']
  }
};

/**
 * Get a color from a palette by index (cycles through colors)
 */
export function getPaletteColor(paletteName: ColorPaletteName, index: number): string {
  const palette = COLOR_PALETTES[paletteName];
  return palette.colors[index % palette.colors.length];
}

/**
 * Get progress-based color from a palette
 */
export function getProgressColor(paletteName: ColorPaletteName, progress: number): string {
  const palette = COLOR_PALETTES[paletteName];
  if (progress === 100) return palette.completed;
  if (progress > 0) return palette.inProgress;
  return palette.notStarted;
}
