export { GanttChart } from './components/GanttChart';
export { GanttContainer } from './components/GanttContainer';
export { TaskModal } from './components/TaskModal';
export { DependencyLines } from './components/DependencyLines';
export type { GanttChartProps, TaskType, Task, ViewMode, TimelineUnit, GanttTask, GanttConfig, TaskColorPalette, ColorPaletteName, FlattenedTask, TaskDependency, DependencyType, TaskStatus } from './types';
export { transformToGanttTasks, transformFromGanttTask, flattenTasks, toggleTaskExpansion, getParentTaskOptions, findTaskById, updateTaskInHierarchy, addSubtask, getIndentation, calculateCriticalPath, generateTimeline } from './utils';
export { COLOR_PALETTES, getPaletteColor, getProgressColor } from './colorPalettes';
