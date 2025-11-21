import { ColorPaletteName } from './types';
/**
 * Predefined color palettes for task bars
 */
export declare const COLOR_PALETTES: Record<ColorPaletteName, {
    completed: string;
    inProgress: string;
    notStarted: string;
    colors: string[];
}>;
/**
 * Get a color from a palette by index (cycles through colors)
 */
export declare function getPaletteColor(paletteName: ColorPaletteName, index: number): string;
/**
 * Get progress-based color from a palette
 */
export declare function getProgressColor(paletteName: ColorPaletteName, progress: number): string;
