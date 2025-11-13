import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  differenceInDays,
  addDays,
  isSameDay,
  isWeekend as dateFnsIsWeekend,
} from 'date-fns';
import type { GanttTask, TaskStatus, DateRange } from './types';

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  dayWidth: 40,
  rowHeight: 50,
  monthsToShow: 12,
  showWeekends: true,
  enableDragDrop: true,
  enableResize: true,
  showGridLines: true,
  showTodayLine: true,
  taskListWidth: 320,
};

/**
 * Convert date string or Date object to Date
 */
export const toDate = (date: string | Date): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

/**
 * Generate timeline dates for the Gantt chart
 */
export const generateTimelineDates = (monthsToShow: number = 12, showWeekends: boolean = true): Date[] => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(addMonths(today, monthsToShow - 1));

  const allDates = eachDayOfInterval({ start, end });
  
  if (showWeekends) {
    return allDates;
  }
  
  return allDates.filter(date => !dateFnsIsWeekend(date));
};

/**
 * Calculate task position on timeline (with function overloads)
 */
export function calculateTaskPosition(
  task: any,
  timelineStart: Date,
  timelineEnd: Date,
  totalWidth: number
): { left: number; width: number };

export function calculateTaskPosition(
  taskStart: Date,
  timelineStart: Date,
  dayWidth: number
): number;

export function calculateTaskPosition(
  taskOrDate: any,
  timelineStart: Date,
  dayWidthOrEnd: number | Date,
  totalWidth?: number
): number | { left: number; width: number } {
  // Legacy signature: (task, timelineStart, timelineEnd, totalWidth)
  if (totalWidth !== undefined && dayWidthOrEnd instanceof Date) {
    const task = taskOrDate;
    const timelineEnd = dayWidthOrEnd;
    
    const taskStartDate = new Date(task.startDate || task.start);
    const taskEndDate = new Date(task.endDate || task.end);
    
    const normalizeDate = (date: Date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };
    
    const timelineStartNorm = normalizeDate(timelineStart);
    const taskStartNorm = normalizeDate(taskStartDate);
    const taskEndNorm = normalizeDate(taskEndDate);
    
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const startOffsetDays = Math.round((taskStartNorm.getTime() - timelineStartNorm.getTime()) / MS_PER_DAY);
    const durationDays = Math.round((taskEndNorm.getTime() - taskStartNorm.getTime()) / MS_PER_DAY) + 1;
    const totalDays = Math.round((timelineEnd.getTime() - timelineStartNorm.getTime()) / MS_PER_DAY) + 1;
    
    const unitWidth = totalWidth / totalDays;
    const left = startOffsetDays * unitWidth;
    const width = durationDays * unitWidth;

    return { left, width: Math.max(width, unitWidth) };
  }
  
  // New signature: (taskStart, timelineStart, dayWidth)
  const taskStart = taskOrDate as Date;
  const dayWidth = dayWidthOrEnd as number;
  const daysFromStart = differenceInDays(taskStart, timelineStart);
  return daysFromStart * dayWidth;
}

/**
 * Calculate task width based on duration
 */
export const calculateTaskWidth = (
  taskStart: Date,
  taskEnd: Date,
  dayWidth: number
): number => {
  const duration = differenceInDays(taskEnd, taskStart) + 1;
  return Math.max(dayWidth, duration * dayWidth);
};

/**
 * Convert position to date
 */
export const positionToDate = (
  position: number,
  timelineStart: Date,
  dayWidth: number
): Date => {
  const daysFromStart = Math.round(position / dayWidth);
  return addDays(timelineStart, daysFromStart);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, formatString: string = 'MMM dd, yyyy'): string => {
  const dateObj = toDate(date);
  return format(dateObj, formatString);
};

/**
 * Get status color (MUI color variants)
 */
export const getStatusColor = (status?: TaskStatus): string => {
  switch (status) {
    case 'Done':
      return 'success';
    case 'In Progress':
      return 'primary';
    case 'Not Started':
    default:
      return 'default';
  }
};

/**
 * Get status background color
 */
export const getStatusBgColor = (status?: TaskStatus): string => {
  switch (status) {
    case 'Done':
      return '#4caf50'; // Green
    case 'In Progress':
      return '#2196f3'; // Blue
    case 'Not Started':
    default:
      return '#9e9e9e'; // Grey
  }
};

/**
 * Calculate duration in days
 */
export const calculateDuration = (start: string | Date, end: string | Date): number => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  return differenceInDays(endDate, startDate) + 1;
};

/**
 * Validate task dates
 */
export const validateTaskDates = (
  start: string | Date,
  end: string | Date
): { valid: boolean; error?: string } => {
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (isNaN(startDate.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }

  if (isNaN(endDate.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }

  if (endDate < startDate) {
    return { valid: false, error: 'End date cannot be before start date' };
  }

  return { valid: true };
};

/**
 * Group dates by month for timeline headers
 */
export const groupDatesByMonth = (dates: Date[]): Map<string, Date[]> => {
  const grouped = new Map<string, Date[]>();

  dates.forEach((date) => {
    const monthKey = format(date, 'MMMM yyyy');
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(date);
  });

  return grouped;
};

/**
 * Normalize task data to ensure consistent format
 */
export const normalizeTask = (task: GanttTask): GanttTask => {
  return {
    ...task,
    start: toDate(task.start).toISOString(),
    end: toDate(task.end).toISOString(),
    status: task.status || 'Not Started',
    progress: task.progress ?? (task.status === 'Done' ? 100 : task.status === 'In Progress' ? 0 : 0),
    assignedTo: task.assignedTo || 'Unassigned',
    dependencies: task.dependencies || [],
  };
};

/**
 * Calculate the date range that encompasses all tasks
 */
export const getTasksDateRange = (tasks: GanttTask[]): DateRange | null => {
  if (tasks.length === 0) return null;

  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  tasks.forEach(task => {
    const start = toDate(task.start);
    const end = toDate(task.end);

    if (!minDate || start < minDate) minDate = start;
    if (!maxDate || end > maxDate) maxDate = end;
  });

  return minDate && maxDate ? { start: minDate, end: maxDate } : null;
};

/**
 * Get days between two dates (legacy compatibility)
 */
export const getDaysBetween = (start: Date, end: Date): number => {
  return differenceInDays(end, start);
};

/**
 * Get date range from tasks (legacy compatibility)
 */
export const getDateRange = (tasks: any[]): { start: Date; end: Date } => {
  if (tasks.length === 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);
    return { start: today, end: endDate };
  }

  const allDates = tasks.flatMap(t => [
    new Date(t.startDate || t.start),
    new Date(t.endDate || t.end)
  ]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(0, 0, 0, 0);

  return { start: minDate, end: maxDate };
};

/**
 * Generate timeline (legacy compatibility)
 */
export const generateTimeline = (
  start: Date,
  end: Date,
  mode: 'day' | 'week' | 'month'
): any[] => {
  const units: any[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);

  while (current <= end) {
    const unitStart = new Date(current);
    let unitEnd: Date;
    let label: string;

    if (mode === 'day') {
      label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      unitEnd = new Date(current);
      unitEnd.setDate(unitEnd.getDate() + 1);
    } else if (mode === 'week') {
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 7);
      label = `Week ${Math.ceil((current.getTime() - new Date(current.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
      unitEnd = weekEnd;
    } else {
      label = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      unitEnd = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    units.push({ label, startDate: unitStart, endDate: unitEnd });

    if (mode === 'day') {
      current.setDate(current.getDate() + 1);
    } else if (mode === 'week') {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }

  return units;
};

/**
 * Transform API response data to GanttTask format
 * Handles various API response structures automatically
 */
export const transformToGanttTasks = (data: any[]): GanttTask[] => {
  return data.map(item => {
    // Handle progress as percentage string (e.g., "50%")
    let progressValue = 0;
    if (item.progress) {
      if (typeof item.progress === 'string') {
        progressValue = parseInt(item.progress.replace('%', ''));
      } else if (typeof item.progress === 'number') {
        progressValue = item.progress;
      }
    }

    // Determine task status
    let taskStatus: 'Not Started' | 'In Progress' | 'Done' = 'Not Started';
    if (progressValue === 100) {
      taskStatus = 'Done';
    } else if (progressValue > 0) {
      taskStatus = 'In Progress';
    }

    return {
      // Map API fields to GanttTask format
      id: item._id || item.id,
      name: item.title || item.name,
      start: item.startDate || item.start,
      end: item.endDate || item.end,
      status: taskStatus,
      progress: progressValue,
      assignedTo: Array.isArray(item.assignees) ? item.assignees[0] : item.assignedTo,
      
      // Preserve original data for reference
      _original: item
    };
  });
};

/**
 * Transform GanttTask updates back to API format
 * Use this when sending updates back to your API
 */
export const transformFromGanttTask = (taskId: string | number, updates: Partial<GanttTask>): any => {
  const apiUpdates: any = {};

  // Map GanttTask fields back to API fields
  if (updates.name !== undefined) apiUpdates.title = updates.name;
  if (updates.start !== undefined) apiUpdates.startDate = updates.start;
  if (updates.end !== undefined) apiUpdates.endDate = updates.end;
  if (updates.progress !== undefined) apiUpdates.progress = `${updates.progress}%`;
  if (updates.assignedTo !== undefined) apiUpdates.assignees = [updates.assignedTo];

  return apiUpdates;
};

