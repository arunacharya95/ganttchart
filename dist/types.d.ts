/**
 * Task status types
 */
export type TaskStatus = 'Not Started' | 'In Progress' | 'Done';
/**
 * Predefined color palettes for task bars
 */
export type ColorPaletteName = 'default' | 'vivid' | 'pastel' | 'warm' | 'cool' | 'earth' | 'ocean' | 'forest';
/**
 * Color palette configuration - can be a preset name or custom colors
 */
export interface TaskColorPalette {
    /** Preset palette name */
    preset?: ColorPaletteName;
    /** Custom color array (overrides preset) */
    colors?: string[];
    /** Color for completed tasks (100% progress) */
    completed?: string;
    /** Color for in-progress tasks (1-99% progress) */
    inProgress?: string;
    /** Color for not started tasks (0% progress) */
    notStarted?: string;
}
/**
 * Gantt Task interface - the data structure your team will pass to the component
 */
export interface GanttTask {
    /** Unique identifier for the task */
    id: string | number;
    /** Task name/title */
    name: string;
    /** Start date (ISO string or Date object) */
    start: string | Date;
    /** End date (ISO string or Date object) */
    end: string | Date;
    /** Task status */
    status?: TaskStatus;
    /** Progress percentage (0-100) - shown for In Progress tasks */
    progress?: number;
    /** Custom color for the task bar (CSS color value) */
    color?: string;
    /** Person assigned to the task */
    assignedTo?: string;
    /** Array of task IDs that this task depends on */
    dependencies?: (string | number)[];
    /** Parent task ID - for subtasks */
    parentId?: string | number | null;
    /** Array of child tasks (subtasks) */
    subtasks?: GanttTask[];
    /** Whether this parent task is expanded (showing subtasks) */
    isExpanded?: boolean;
    /** Any additional custom data */
    [key: string]: any;
}
/**
 * Gantt Chart configuration options
 */
export interface GanttConfig {
    /** Width of each day column in pixels (default: 40) */
    dayWidth?: number;
    /** Height of each task row in pixels (default: 50) */
    rowHeight?: number;
    /** Number of months to display in the timeline (default: 12) */
    monthsToShow?: number;
    /** Show/hide weekends (default: true) */
    showWeekends?: boolean;
    /** Allow drag and drop to reschedule tasks (default: true) */
    enableDragDrop?: boolean;
    /** Allow resizing task bars (default: true) */
    enableResize?: boolean;
    /** Show grid lines (default: true) */
    showGridLines?: boolean;
    /** Show today line (default: true) */
    showTodayLine?: boolean;
    /** Show task dependencies (default: true) */
    showDependencies?: boolean;
    /** Dependency line style */
    dependencyStyle?: 'straight' | 'curved';
    /** Dependency line color */
    dependencyColor?: string;
    /** Color palette for task bars - predefined or custom colors */
    colorPalette?: TaskColorPalette;
    /** Mapping of status to color (overrides palette) */
    statusColors?: Record<string, string>;
    /** Mapping of assignee to color (overrides palette) */
    assigneeColors?: Record<string, string>;
}
/**
 * Gantt Chart Props - Main component interface
 */
export interface GanttChartProps {
    /** Array of tasks to display in the Gantt chart */
    tasks: GanttTask[];
    /** Configuration options for appearance and behavior */
    config?: GanttConfig;
    /** Callback when a task is updated (via drag/drop, resize, or edit) */
    onTaskUpdate?: (taskId: string | number, updates: Partial<GanttTask>) => void;
    /** Callback when a task is clicked (single click) - use this to open your custom modal */
    onTaskClick?: (task: GanttTask) => void;
    /** Callback when a task is double-clicked - legacy support */
    onTaskDoubleClick?: (task: GanttTask) => void;
    /** Function to dynamically determine task bar color based on task properties (progress, status, etc.) */
    getTaskColor?: (task: GanttTask) => string;
    /** Enable edit mode - allows clicking tasks to open edit dialog (default: true) */
    enableEdit?: boolean;
    /** Custom height for the chart container (default: 'auto') */
    height?: string | number;
    /** Show task list column on the left (default: true) */
    showTaskList?: boolean;
    /** Width of the task list column in pixels (default: 320) */
    taskListWidth?: number;
    /** @deprecated Use onTaskUpdate instead */
    onChange?: (tasks: GanttTask[]) => void;
    /** @deprecated Use config.dayWidth/monthsToShow instead */
    viewMode?: ViewMode;
    /** @deprecated Locale string */
    locale?: string;
}
/**
 * Internal task bar position data
 */
export interface TaskBarPosition {
    left: number;
    width: number;
    top: number;
    height: number;
}
/**
 * Date range for timeline
 */
export interface DateRange {
    start: Date;
    end: Date;
}
/**
 * Task modal props
 */
export interface TaskModalProps {
    open: boolean;
    task: GanttTask | null;
    allTasks: GanttTask[];
    onClose: () => void;
    onSave: (taskId: string | number, updates: Partial<GanttTask>) => void;
}
export type Task = GanttTask;
export type TaskType = GanttTask;
/**
 * View mode for legacy components
 */
export type ViewMode = 'day' | 'week' | 'month';
/**
 * Timeline unit for legacy components
 */
export type TimelineUnit = {
    label: string;
    startDate: Date;
    endDate: Date;
};
/**
 * Flattened task with hierarchy metadata
 */
export interface FlattenedTask extends GanttTask {
    /** Depth level in hierarchy (0 = root, 1 = first level subtask, etc.) */
    level: number;
    /** Whether this task has children */
    hasChildren: boolean;
    /** Whether the parent task is expanded */
    isVisible: boolean;
}
