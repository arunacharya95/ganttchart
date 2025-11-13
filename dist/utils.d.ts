import type { GanttTask, TaskStatus, DateRange } from './types';
/**
 * Default configuration values
 */
export declare const DEFAULT_CONFIG: {
    dayWidth: number;
    rowHeight: number;
    monthsToShow: number;
    showWeekends: boolean;
    enableDragDrop: boolean;
    enableResize: boolean;
    showGridLines: boolean;
    showTodayLine: boolean;
    taskListWidth: number;
};
/**
 * Convert date string or Date object to Date
 */
export declare const toDate: (date: string | Date) => Date;
/**
 * Generate timeline dates for the Gantt chart
 */
export declare const generateTimelineDates: (monthsToShow?: number, showWeekends?: boolean) => Date[];
/**
 * Calculate task position on timeline (with function overloads)
 */
export declare function calculateTaskPosition(task: any, timelineStart: Date, timelineEnd: Date, totalWidth: number): {
    left: number;
    width: number;
};
export declare function calculateTaskPosition(taskStart: Date, timelineStart: Date, dayWidth: number): number;
/**
 * Calculate task width based on duration
 */
export declare const calculateTaskWidth: (taskStart: Date, taskEnd: Date, dayWidth: number) => number;
/**
 * Convert position to date
 */
export declare const positionToDate: (position: number, timelineStart: Date, dayWidth: number) => Date;
/**
 * Check if a date is today
 */
export declare const isToday: (date: Date) => boolean;
/**
 * Format date for display
 */
export declare const formatDate: (date: Date | string, formatString?: string) => string;
/**
 * Get status color (MUI color variants)
 */
export declare const getStatusColor: (status?: TaskStatus) => string;
/**
 * Get status background color
 */
export declare const getStatusBgColor: (status?: TaskStatus) => string;
/**
 * Calculate duration in days
 */
export declare const calculateDuration: (start: string | Date, end: string | Date) => number;
/**
 * Validate task dates
 */
export declare const validateTaskDates: (start: string | Date, end: string | Date) => {
    valid: boolean;
    error?: string;
};
/**
 * Group dates by month for timeline headers
 */
export declare const groupDatesByMonth: (dates: Date[]) => Map<string, Date[]>;
/**
 * Normalize task data to ensure consistent format
 */
export declare const normalizeTask: (task: GanttTask) => GanttTask;
/**
 * Calculate the date range that encompasses all tasks
 */
export declare const getTasksDateRange: (tasks: GanttTask[]) => DateRange | null;
/**
 * Get days between two dates (legacy compatibility)
 */
export declare const getDaysBetween: (start: Date, end: Date) => number;
/**
 * Get date range from tasks (legacy compatibility)
 */
export declare const getDateRange: (tasks: any[]) => {
    start: Date;
    end: Date;
};
/**
 * Generate timeline (legacy compatibility)
 */
export declare const generateTimeline: (start: Date, end: Date, mode: "day" | "week" | "month") => any[];
/**
 * Transform API response data to GanttTask format
 * Handles various API response structures automatically
 */
export declare const transformToGanttTasks: (data: any[]) => GanttTask[];
/**
 * Transform GanttTask updates back to API format
 * Use this when sending updates back to your API
 */
export declare const transformFromGanttTask: (taskId: string | number, updates: Partial<GanttTask>) => any;
