import React, { useMemo, useRef } from 'react';
import { Box, Tooltip } from '@mui/material';
import { differenceInCalendarDays } from 'date-fns';
import { useGanttStore, useGanttStoreActions } from '../state/ganttStore';
import type { Task, TaskStatus, Dependency } from '../types/domain';
import { useTimeline } from '../hooks/useTimeline';
import { normalizeDate } from '../utils/dateMath';

const ROW_HEIGHT = 32;
const ROW_GAP = 8;

const sortTasksForRows = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const aStart = a.start ? normalizeDate(a.start).getTime() : 0;
    const bStart = b.start ? normalizeDate(b.start).getTime() : 0;
    if (aStart !== bStart) return aStart - bStart;
    return a.name.localeCompare(b.name);
  });
};

const getRowIndex = (task: Task, ordered: Task[]): number => {
  return ordered.findIndex(t => t.id === task.id);
};

export const TaskBars: React.FC = () => {
  const tasks = useGanttStore(state => state.tasks);
  const baselines = useGanttStore(state => state.baselines);
  const dependencies = useGanttStore(state => state.dependencies);
  const selectedTaskIds = useGanttStore(state => state.viewState.selectedTaskIds);
  const criticalTaskIds = useGanttStore(state => state.viewState.criticalTaskIds ?? []);
  const showCriticalPath = useGanttStore(state => state.viewState.showCriticalPath);
  const showBaselines = useGanttStore(state => state.viewState.showBaselines);
  const statusFilter = useGanttStore(state => state.viewState.statusFilter);
  const textSearch = useGanttStore(state => state.viewState.textSearch);
  const { setState, recomputeCriticalPath } = useGanttStoreActions();
  const { visibleStart, visibleEnd, scale } = useTimeline();

  const { orderedTasks, totalDays } = useMemo(() => {
    const filtered = tasks.filter(task => {
      if (statusFilter && statusFilter.length && task.status && !statusFilter.includes(task.status)) {
        return false;
      }
      if (textSearch && textSearch.trim()) {
        const q = textSearch.toLowerCase();
        if (!task.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    const ordered = sortTasksForRows(filtered);
    const days = differenceInCalendarDays(visibleEnd, visibleStart) || 1;
    return { orderedTasks: ordered, totalDays: days };
  }, [tasks, visibleStart, visibleEnd]);

  const dayWidth = useMemo(() => {
    switch (scale) {
      case 'day':
        return 32;
      case 'week':
        return 12;
      case 'month':
        return 4;
      case 'quarter':
        return 2;
      default:
        return 24;
    }
  }, [scale]);

  const totalWidth = totalDays * dayWidth;
  const dragStateRef = useRef<{
    mode: 'move' | 'resize-start' | 'resize-end' | null;
    taskId: string | null;
    startX: number;
    originalStart: Date;
    originalEnd: Date;
  } | null>(null);

  const snapDeltaToDays = (deltaPx: number) => {
    if (totalWidth === 0) return 0;
    const fraction = deltaPx / totalWidth;
    const days = Math.round(fraction * totalDays);
    return days;
  };

  // Recompute critical path whenever tasks or dependencies change
  React.useEffect(() => {
    recomputeCriticalPath();
  }, [tasks, dependencies, recomputeCriticalPath]);

  const commitDrag = () => {
    const state = dragStateRef.current;
    if (!state || !state.taskId) return;
    const movedTaskId = state.taskId;
    dragStateRef.current = null;

    setState(prev => {
      let tasks = [...prev.tasks];
      const deps = dependencies ?? [];

      const findTask = (id: string) => tasks.find(t => t.id === id);

      const applyFsRule = (from: Task, to: Task): Task => {
        if (!from.end || !to.start || !to.end) return to;
        const fromEnd = normalizeDate(from.end);
        const toStart = normalizeDate(to.start);
        const toEnd = normalizeDate(to.end);
        if (toStart > fromEnd) return to;
        const duration = Math.max(1, differenceInCalendarDays(toEnd, toStart));
        const newStart = new Date(fromEnd);
        newStart.setDate(newStart.getDate() + 1);
        const newEnd = new Date(newStart);
        newEnd.setDate(newEnd.getDate() + duration);
        return { ...to, start: newStart, end: newEnd };
      };

      const applySsRule = (from: Task, to: Task): Task => {
        if (!from.start || !to.start || !to.end) return to;
        const fromStart = normalizeDate(from.start);
        const toStart = normalizeDate(to.start);
        const toEnd = normalizeDate(to.end);
        if (toStart >= fromStart) return to;
        const duration = Math.max(1, differenceInCalendarDays(toEnd, toStart));
        const newStart = fromStart;
        const newEnd = new Date(newStart);
        newEnd.setDate(newEnd.getDate() + duration);
        return { ...to, start: newStart, end: newEnd };
      };

      const applyFfRule = (from: Task, to: Task): Task => {
        if (!from.end || !to.start || !to.end) return to;
        const fromEnd = normalizeDate(from.end);
        const toStart = normalizeDate(to.start);
        const toEnd = normalizeDate(to.end);
        if (toEnd >= fromEnd) return to;
        const duration = Math.max(1, differenceInCalendarDays(toEnd, toStart));
        const newEnd = fromEnd;
        const newStart = new Date(newEnd);
        newStart.setDate(newStart.getDate() - duration);
        return { ...to, start: newStart, end: newEnd };
      };

      const applySfRule = (from: Task, to: Task): Task => {
        if (!from.start || !to.start || !to.end) return to;
        const fromStart = normalizeDate(from.start);
        const toStart = normalizeDate(to.start);
        const toEnd = normalizeDate(to.end);
        if (toEnd >= fromStart) return to;
        const duration = Math.max(1, differenceInCalendarDays(toEnd, toStart));
        const newEnd = fromStart;
        const newStart = new Date(newEnd);
        newStart.setDate(newStart.getDate() - duration);
        return { ...to, start: newStart, end: newEnd };
      };

      const applyRule = (dep: Dependency, from: Task, to: Task): Task => {
        switch (dep.type) {
          case 'FS':
            return applyFsRule(from, to);
          case 'SS':
            return applySsRule(from, to);
          case 'FF':
            return applyFfRule(from, to);
          case 'SF':
            return applySfRule(from, to);
          default:
            return to;
        }
      };

      const queue: string[] = [movedTaskId];
      const visited = new Set<string>();

      while (queue.length) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        const currentTask = findTask(currentId);
        if (!currentTask) continue;

        const outgoing = deps.filter(dep => dep.fromTaskId === currentId);
        if (!outgoing.length) continue;

        outgoing.forEach(dep => {
          const toTask = findTask(dep.toTaskId);
          if (!toTask) return;
          const updated = applyRule(dep, currentTask, toTask);
          if (updated === toTask) return;
          tasks = tasks.map(t => (t.id === updated.id ? updated : t));
          queue.push(updated.id);
        });
      }

      return {
        ...prev,
        tasks,
      };
    });
  };

  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const state = dragStateRef.current;
      if (!state || !state.taskId || !state.mode) return;

      const deltaPx = e.clientX - state.startX;
      const deltaDays = snapDeltaToDays(deltaPx);
      if (!deltaDays) return;

      setState(prev => {
        const tasks = prev.tasks.map(task => {
          if (task.id !== state.taskId || !task.start || !task.end) return task;

          const startDate = normalizeDate(task.start);
          const endDate = normalizeDate(task.end);

          if (state.mode === 'move') {
            const nextStart = new Date(state.originalStart);
            nextStart.setDate(nextStart.getDate() + deltaDays);
            const nextEnd = new Date(state.originalEnd);
            nextEnd.setDate(nextEnd.getDate() + deltaDays);
            return { ...task, start: nextStart, end: nextEnd };
          }

          if (state.mode === 'resize-start') {
            const nextStart = new Date(state.originalStart);
            nextStart.setDate(nextStart.getDate() + deltaDays);
            if (nextStart >= endDate) return task;
            return { ...task, start: nextStart };
          }

          if (state.mode === 'resize-end') {
            const nextEnd = new Date(state.originalEnd);
            nextEnd.setDate(nextEnd.getDate() + deltaDays);
            if (nextEnd <= startDate) return task;
            return { ...task, end: nextEnd };
          }

          return task;
        });

        return { ...prev, tasks };
      });
    };

    const handleUp = () => {
      if (!dragStateRef.current) return;
      commitDrag();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    if (dragStateRef.current) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [setState, totalDays, totalWidth]);

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Baseline bars */}
      {showBaselines && baselines.length > 0 && orderedTasks.map(task => {
        const activeBaseline = baselines[0];
        const snapshot = activeBaseline.taskSnapshots.find(s => s.taskId === task.id);
        if (!snapshot) return null;

        const start = normalizeDate(snapshot.start);
        const end = normalizeDate(snapshot.end);

        const clampedStart = start < visibleStart ? visibleStart : start;
        const clampedEnd = end > visibleEnd ? visibleEnd : end;

        const offsetDays = differenceInCalendarDays(clampedStart, visibleStart);
        const durationDays = Math.max(1, differenceInCalendarDays(clampedEnd, clampedStart));

        const left = (offsetDays / totalDays) * totalWidth;
        const width = (durationDays / totalDays) * totalWidth;

        const rowIndex = getRowIndex(task, orderedTasks);
        const top = rowIndex * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2;

        return (
          <Box
            key={`${task.id}-baseline`}
            sx={{
              position: 'absolute',
              left,
              top,
              width,
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(148,163,184,0.9)',
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
            }}
          />
        );
      })}

      {orderedTasks.map(task => {
        if (!task.start || !task.end) return null;

        const taskStart = normalizeDate(task.start);
        const taskEnd = normalizeDate(task.end);

        const clampedStart = taskStart < visibleStart ? visibleStart : taskStart;
        const clampedEnd = taskEnd > visibleEnd ? visibleEnd : taskEnd;

        const offsetDays = differenceInCalendarDays(clampedStart, visibleStart);
        const durationDays = Math.max(1, differenceInCalendarDays(clampedEnd, clampedStart));

        const left = (offsetDays / totalDays) * totalWidth;
        const width = (durationDays / totalDays) * totalWidth;

        const rowIndex = getRowIndex(task, orderedTasks);
        const top = rowIndex * (ROW_HEIGHT + ROW_GAP);

        const status = task.status as TaskStatus | undefined;
        const isCritical = showCriticalPath && criticalTaskIds.includes(task.id);
        const backgroundColor = isCritical
          ? '#ef4444'
          : status === 'Done'
          ? '#10b981'
          : status === 'InProgress'
          ? '#3b82f6'
          : '#6b7280';

        const isSelected = selectedTaskIds.includes(task.id);

        const handleBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          dragStateRef.current = {
            mode: 'move',
            taskId: task.id,
            startX: e.clientX,
            originalStart: taskStart,
            originalEnd: taskEnd,
          };
        };

        const handleResizeMouseDown = (
          e: React.MouseEvent<HTMLDivElement>,
          mode: 'resize-start' | 'resize-end',
        ) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          dragStateRef.current = {
            mode,
            taskId: task.id,
            startX: e.clientX,
            originalStart: taskStart,
            originalEnd: taskEnd,
          };
        };

        return (
          <Tooltip key={task.id} title={task.name} placement="top">
            <Box
              sx={{
                position: 'absolute',
                left,
                top,
                width,
                height: ROW_HEIGHT,
                borderRadius: 1,
                bgcolor: backgroundColor,
                border: isSelected
                  ? '2px solid #0ea5e9'
                  : isCritical
                  ? '2px solid rgba(239,68,68,0.9)'
                  : '1px solid rgba(15,23,42,0.25)',
                color: '#fff',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                px: 1,
                boxShadow: 1,
                pointerEvents: 'auto',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                setState(prev => ({
                  ...prev,
                  viewState: {
                    ...prev.viewState,
                    selectedTaskIds: [task.id],
                  },
                }));
              }}
              onMouseDown={handleBarMouseDown}
            >
              <Box
                sx={{
                  width: 6,
                  height: '70%',
                  borderRadius: 1,
                  bgcolor: 'rgba(15,23,42,0.4)',
                  mr: 0.5,
                  cursor: 'ew-resize',
                  flexShrink: 0,
                }}
                onMouseDown={e => handleResizeMouseDown(e, 'resize-start')}
              />
              {task.name}
              <Box
                sx={{
                  width: 6,
                  height: '70%',
                  borderRadius: 1,
                  bgcolor: 'rgba(15,23,42,0.4)',
                  ml: 0.5,
                  cursor: 'ew-resize',
                  flexShrink: 0,
                }}
                onMouseDown={e => handleResizeMouseDown(e, 'resize-end')}
              />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default TaskBars;
