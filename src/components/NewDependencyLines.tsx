import React, { useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { useGanttStore, useGanttStoreActions } from '../state/ganttStore';
import type { Task, Dependency } from '../types/domain';
import { useTimeline } from '../hooks/useTimeline';
import { normalizeDate } from '../utils/dateMath';

interface BarPosition {
  taskId: string;
  left: number;
  top: number;
  width: number;
}

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

export const NewDependencyLines: React.FC = () => {
  const tasks = useGanttStore(state => state.tasks);
  const dependencies = useGanttStore(state => state.dependencies);
  const selectedDependencyIds = useGanttStore(state => state.viewState.selectedDependencyIds);
  const { setState } = useGanttStoreActions();
  const { visibleStart, visibleEnd, scale } = useTimeline();

  const { positions, totalWidth, totalDays } = useMemo(() => {
    const ordered = sortTasksForRows(tasks);
    const days = Math.max(1, (visibleEnd.getTime() - visibleStart.getTime()) / (1000 * 60 * 60 * 24));

    const dayWidth = (() => {
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
    })();

    const width = days * dayWidth;

    const map = new Map<string, BarPosition>();

    ordered.forEach((task, index) => {
      if (!task.start || !task.end) return;
      const startDate = normalizeDate(task.start);
      const endDate = normalizeDate(task.end);

      const clampedStart = startDate < visibleStart ? visibleStart : startDate;
      const clampedEnd = endDate > visibleEnd ? visibleEnd : endDate;

      const offsetDays = (clampedStart.getTime() - visibleStart.getTime()) / (1000 * 60 * 60 * 24);
      const durationDays = Math.max(1, (clampedEnd.getTime() - clampedStart.getTime()) / (1000 * 60 * 60 * 24));

      const left = (offsetDays / days) * width;
      const barWidth = (durationDays / days) * width;
      const top = index * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2;

      map.set(task.id, {
        taskId: task.id,
        left,
        top,
        width: barWidth,
      });
    });

    return { positions: map, totalWidth: width, totalDays: days };
  }, [tasks, visibleStart, visibleEnd, scale]);

  if (!dependencies.length || !positions.size) {
    return null;
  }

  const strokeColor = '#9ca3af';

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <defs>
          <marker
            id="gantt-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 z" fill={strokeColor} />
          </marker>
        </defs>
        {dependencies.map(dep => {
          const from = positions.get(dep.fromTaskId);
          const to = positions.get(dep.toTaskId);
          if (!from || !to) return null;

          const startX = from.left + from.width;
          const startY = from.top;
          const endX = to.left;
          const endY = to.top;

          const midX = (startX + endX) / 2;
          const isSelected = selectedDependencyIds.includes(dep.id);

          const handleClick: React.MouseEventHandler<SVGPathElement> = (e) => {
            e.stopPropagation();
            setState(prev => ({
              ...prev,
              viewState: {
                ...prev.viewState,
                selectedDependencyIds: [dep.id],
              },
            }));
          };

          const label = (() => {
            const fromTask = tasks.find(t => t.id === dep.fromTaskId);
            const toTask = tasks.find(t => t.id === dep.toTaskId);
            return `${fromTask?.name ?? dep.fromTaskId} → ${toTask?.name ?? dep.toTaskId} (${dep.type})`;
          })();

          return (
            <Tooltip key={dep.id} title={label} arrow>
              <path
                d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke={isSelected ? '#2563eb' : strokeColor}
                strokeWidth={isSelected ? 2.5 : 1.5}
                markerEnd="url(#gantt-arrow)"
                style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                onClick={handleClick}
              />
            </Tooltip>
          );
        })}
      </svg>
    </Box>
  );
};

export default NewDependencyLines;
