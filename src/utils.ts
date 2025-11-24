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
import type { GanttTask, TaskStatus, DateRange, FlattenedTask } from './types';

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
  mode: 'day' | 'week' | 'month' | 'quarter'
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
    } else if (mode === 'quarter') {
      const quarter = Math.floor(current.getMonth() / 3) + 1;
      label = `Q${quarter} ${current.getFullYear()}`;
      unitEnd = new Date(current.getFullYear(), current.getMonth() + 3, 1);
    } else {
      label = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      unitEnd = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    units.push({ label, startDate: unitStart, endDate: unitEnd });

    if (mode === 'day') {
      current.setDate(current.getDate() + 1);
    } else if (mode === 'week') {
      current.setDate(current.getDate() + 7);
    } else if (mode === 'quarter') {
      current.setMonth(current.getMonth() + 3);
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

/**
 * Flatten hierarchical task structure for rendering
 * Converts nested tasks with subtasks into a flat array with level metadata
 */
export const flattenTasks = (tasks: GanttTask[], expandedTaskIds: Set<string | number> = new Set()): FlattenedTask[] => {
  const flattened: FlattenedTask[] = [];
  
  const flatten = (task: GanttTask, level: number = 0, parentExpanded: boolean = true) => {
    const hasChildren = !!task.subtasks && task.subtasks.length > 0;
    const isExpanded = task.isExpanded ?? expandedTaskIds.has(task.id);
    const isVisible = level === 0 || parentExpanded;
    
    flattened.push({
      ...task,
      level,
      hasChildren,
      isVisible,
      isExpanded
    });
    
    // Recursively flatten subtasks if parent is expanded
    if (hasChildren && isExpanded && isVisible) {
      task.subtasks!.forEach(subtask => {
        flatten(subtask, level + 1, true);
      });
    }
  };
  
  tasks.forEach(task => flatten(task));
  return flattened.filter(task => task.isVisible);
};

/**
 * Toggle task expansion state
 */
export const toggleTaskExpansion = (
  taskId: string | number,
  expandedTaskIds: Set<string | number>
): Set<string | number> => {
  const newSet = new Set(expandedTaskIds);
  if (newSet.has(taskId)) {
    newSet.delete(taskId);
  } else {
    newSet.add(taskId);
  }
  return newSet;
};

/**
 * Get all parent task IDs for creating a parent selection list
 */
export const getParentTaskOptions = (tasks: GanttTask[], excludeTaskId?: string | number): GanttTask[] => {
  const options: GanttTask[] = [];
  
  const collectTasks = (taskList: GanttTask[]) => {
    taskList.forEach(task => {
      if (task.id !== excludeTaskId) {
        options.push(task);
        if (task.subtasks && task.subtasks.length > 0) {
          collectTasks(task.subtasks);
        }
      }
    });
  };
  
  collectTasks(tasks);
  return options;
};

/**
 * Find a task by ID in hierarchical structure
 */
export const findTaskById = (tasks: GanttTask[], taskId: string | number): GanttTask | null => {
  for (const task of tasks) {
    if (task.id === taskId) {
      return task;
    }
    if (task.subtasks && task.subtasks.length > 0) {
      const found = findTaskById(task.subtasks, taskId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Update a task in hierarchical structure (immutable)
 */
export const updateTaskInHierarchy = (
  tasks: GanttTask[],
  taskId: string | number,
  updates: Partial<GanttTask>
): GanttTask[] => {
  return tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, ...updates };
    }
    if (task.subtasks && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: updateTaskInHierarchy(task.subtasks, taskId, updates)
      };
    }
    return task;
  });
};

/**
 * Add a subtask to a parent task
 */
export const addSubtask = (
  tasks: GanttTask[],
  parentId: string | number,
  subtask: GanttTask
): GanttTask[] => {
  return tasks.map(task => {
    if (task.id === parentId) {
      const subtasks = task.subtasks || [];
      return {
        ...task,
        subtasks: [...subtasks, { ...subtask, parentId }],
        isExpanded: true // Auto-expand when adding subtask
      };
    }
    if (task.subtasks && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: addSubtask(task.subtasks, parentId, subtask)
      };
    }
    return task;
  });
};

/**
 * Calculate critical path for project tasks
 * Returns tasks marked as critical based on dependencies
 */
export const calculateCriticalPath = (tasks: GanttTask[]): GanttTask[] => {
  // Build dependency graph
  const taskMap = new Map<string | number, GanttTask>();
  const inDegree = new Map<string | number, number>();
  const outEdges = new Map<string | number, (string | number)[]>();
  
  // Initialize task map
  tasks.forEach(task => {
    taskMap.set(task.id, task);
    inDegree.set(task.id, 0);
    outEdges.set(task.id, []);
  });
  
  // Build edges from dependencies
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach(depId => {
        const edges = outEdges.get(depId) || [];
        edges.push(task.id);
        outEdges.set(depId, edges);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      });
    }
  });
  
  // Calculate earliest start/finish times (forward pass)
  const earliestStart = new Map<string | number, number>();
  const earliestFinish = new Map<string | number, number>();
  const queue: (string | number)[] = [];
  
  tasks.forEach(task => {
    if (inDegree.get(task.id) === 0) {
      queue.push(task.id);
      const startTime = toDate(task.start || task.startDate).getTime();
      earliestStart.set(task.id, startTime);
      earliestFinish.set(task.id, toDate(task.end || task.endDate).getTime());
    }
  });
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const edges = outEdges.get(currentId) || [];
    
    edges.forEach(nextId => {
      const currentFinish = earliestFinish.get(currentId)!;
      const nextTask = taskMap.get(nextId)!;
      const nextDuration = toDate(nextTask.end || nextTask.endDate).getTime() - 
                          toDate(nextTask.start || nextTask.startDate).getTime();
      
      const newStart = Math.max(
        earliestStart.get(nextId) || 0,
        currentFinish
      );
      
      earliestStart.set(nextId, newStart);
      earliestFinish.set(nextId, newStart + nextDuration);
      
      inDegree.set(nextId, (inDegree.get(nextId) || 0) - 1);
      if (inDegree.get(nextId) === 0) {
        queue.push(nextId);
      }
    });
  }
  
  // Find project end time
  let projectEnd = 0;
  tasks.forEach(task => {
    const finish = earliestFinish.get(task.id) || 0;
    if (finish > projectEnd) {
      projectEnd = finish;
    }
  });
  
  // Calculate latest start/finish times (backward pass)
  const latestStart = new Map<string | number, number>();
  const latestFinish = new Map<string | number, number>();
  
  tasks.forEach(task => {
    if ((outEdges.get(task.id) || []).length === 0) {
      latestFinish.set(task.id, projectEnd);
      const duration = toDate(task.end || task.endDate).getTime() - 
                      toDate(task.start || task.startDate).getTime();
      latestStart.set(task.id, projectEnd - duration);
    }
  });
  
  // Backward pass
  const reverseQueue = tasks.filter(t => (outEdges.get(t.id) || []).length === 0).map(t => t.id);
  const processed = new Set<string | number>();
  
  while (reverseQueue.length > 0) {
    const currentId = reverseQueue.shift()!;
    if (processed.has(currentId)) continue;
    processed.add(currentId);
    
    const currentTask = taskMap.get(currentId)!;
    const currentLatestStart = latestStart.get(currentId)!;
    
    if (currentTask.dependencies) {
      currentTask.dependencies.forEach(depId => {
        const depTask = taskMap.get(depId)!;
        const depDuration = toDate(depTask.end || depTask.endDate).getTime() - 
                           toDate(depTask.start || depTask.startDate).getTime();
        
        const newLatestFinish = Math.min(
          latestFinish.get(depId) || Number.MAX_SAFE_INTEGER,
          currentLatestStart
        );
        
        latestFinish.set(depId, newLatestFinish);
        latestStart.set(depId, newLatestFinish - depDuration);
        
        reverseQueue.push(depId);
      });
    }
  }
  
  // Mark critical tasks (slack = 0)
  return tasks.map(task => {
    const es = earliestStart.get(task.id) || 0;
    const ls = latestStart.get(task.id) || 0;
    const slack = ls - es;
    
    return {
      ...task,
      isCritical: Math.abs(slack) < 1000 // Within 1 second (accounting for rounding)
    };
  });
};


/**
 * Calculate indentation for hierarchical display
 */
export const getIndentation = (level: number, indentSize: number = 20): number => {
  return level * indentSize;
};

/**
 * Check if a date is a holiday
 */
export const isHoliday = (date: Date, holidays?: string[]): boolean => {
  if (!holidays || holidays.length === 0) return false;
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.includes(dateStr);
};

/**
 * Get the next working day (skipping weekends and holidays)
 */
export const getNextWorkingDay = (
  date: Date, 
  holidays?: string[], 
  showWeekends: boolean = true
): Date => {
  let nextDate = new Date(date);
  // Safety break to prevent infinite loops
  let checks = 0;
  while (checks < 365) {
    const isWeekend = !showWeekends && dateFnsIsWeekend(nextDate);
    const isHol = isHoliday(nextDate, holidays);
    
    if (!isWeekend && !isHol) {
      return nextDate;
    }
    nextDate = addDays(nextDate, 1);
    checks++;
  }
  return nextDate;
};

/**
 * Automatically reschedule dependent tasks
 * Returns a new array of tasks with updated dates
 */
export const autoScheduleTasks = (
  tasks: GanttTask[],
  dependencies: any[], // TaskDependency[]
  changedTaskId: string | number,
  holidays?: string[],
  showWeekends: boolean = true
): GanttTask[] => {
  // Deep clone the entire tree to avoid mutation
  const cloneTree = (items: GanttTask[]): GanttTask[] => {
    return items.map(item => ({
      ...item,
      subtasks: item.subtasks ? cloneTree(item.subtasks) : undefined
    }));
  };
  const updatedTasks = cloneTree(tasks);
  
  // Build map of all tasks for quick access
  const taskMap = new Map<string | number, GanttTask>();
  const buildMap = (items: GanttTask[]) => {
    items.forEach(item => {
      taskMap.set(item.id, item);
      if (item.subtasks) buildMap(item.subtasks);
    });
  };
  buildMap(updatedTasks);
  
  // Build adjacency list for dependencies
  const outEdges = new Map<string | number, any[]>();
  dependencies.forEach(dep => {
    const edges = outEdges.get(dep.from) || [];
    edges.push(dep);
    outEdges.set(dep.from, edges);
  });
  
  // Queue for BFS
  const queue: (string | number)[] = [changedTaskId];
  const processed = new Set<string | number>();
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (processed.has(currentId)) continue;
    processed.add(currentId);
    
    const currentTask = taskMap.get(currentId);
    if (!currentTask) continue;
    
    const edges = outEdges.get(currentId) || [];
    
    edges.forEach(dep => {
      const nextTask = taskMap.get(dep.to);
      if (!nextTask || nextTask.isLocked) return; // Don't move locked tasks
      
      // Calculate new start date based on dependency type
      let newStartDate = new Date(nextTask.start || nextTask.startDate);
      const currentStart = new Date(currentTask.start || currentTask.startDate);
      const currentEnd = new Date(currentTask.end || currentTask.endDate);
      
      let shouldUpdate = false;
      
      if (dep.type === 'FS') { // Finish to Start
        if (newStartDate < currentEnd) {
          newStartDate = getNextWorkingDay(addDays(currentEnd, 1), holidays, showWeekends);
          shouldUpdate = true;
        }
      } else if (dep.type === 'SS') { // Start to Start
        if (newStartDate < currentStart) {
          newStartDate = getNextWorkingDay(currentStart, holidays, showWeekends);
          shouldUpdate = true;
        }
      } else if (dep.type === 'FF') { // Finish to Finish
        // Complex: implies end date constraint, simplified here to start date push
      }
      
      if (shouldUpdate) {
        const duration = differenceInDays(
          new Date(nextTask.end || nextTask.endDate),
          new Date(nextTask.start || nextTask.startDate)
        );
        
        const newEndDate = addDays(newStartDate, duration);
        
        // Update task
        nextTask.start = newStartDate.toISOString();
        nextTask.end = newEndDate.toISOString();
        if ('startDate' in nextTask) nextTask.startDate = nextTask.start;
        if ('endDate' in nextTask) nextTask.endDate = nextTask.end;
        
        // Add to queue to propagate changes
        queue.push(nextTask.id);
      }
    });
  }
  
  return updatedTasks;
};

