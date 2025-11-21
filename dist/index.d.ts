export { GanttChart } from './components/GanttChart';
export { TaskModal } from './components/TaskModal';
export type { GanttChartProps, TaskType, Task, ViewMode, TimelineUnit, GanttTask, GanttConfig, TaskColorPalette, ColorPaletteName, FlattenedTask } from './types';
export { transformToGanttTasks, transformFromGanttTask, flattenTasks, toggleTaskExpansion, getParentTaskOptions, findTaskById, updateTaskInHierarchy, addSubtask, getIndentation } from './utils';
export { COLOR_PALETTES, getPaletteColor, getProgressColor } from './colorPalettes';
