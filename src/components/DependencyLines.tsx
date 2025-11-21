import React from 'react';
import { GanttTask } from '../types';

interface DependencyLinesProps {
  tasks: GanttTask[];
  getTaskPosition: (taskId: string | number) => { left: number; width: number; top: number } | null;
  style?: 'straight' | 'curved';
  color?: string;
}

export const DependencyLines: React.FC<DependencyLinesProps> = ({
  tasks,
  getTaskPosition,
  style = 'curved',
  color = '#94a3b8'
}) => {
  const renderDependencyLine = (fromTask: GanttTask, toTask: GanttTask) => {
    const fromPos = getTaskPosition(fromTask.id);
    const toPos = getTaskPosition(toTask.id);

    if (!fromPos || !toPos) return null;

    // Start point: right edge of the from task, middle height
    const startX = fromPos.left + fromPos.width;
    const startY = fromPos.top + 15; // Half of task bar height (30px)

    // End point: left edge of the to task, middle height
    const endX = toPos.left;
    const endY = toPos.top + 15;

    const key = `dep-${fromTask.id}-${toTask.id}`;

    if (style === 'straight') {
      return (
        <line
          key={key}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    } else {
      // Curved path
      const midX = (startX + endX) / 2;
      
      // Create a path with horizontal lines and vertical connector
      const path = `
        M ${startX} ${startY}
        L ${midX} ${startY}
        L ${midX} ${endY}
        L ${endX} ${endY}
      `;

      return (
        <path
          key={key}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    }
  };

  // Collect all dependency lines
  const lines: JSX.Element[] = [];

  tasks.forEach(task => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach(depId => {
        const dependencyTask = tasks.find(t => t.id === depId);
        if (dependencyTask) {
          const line = renderDependencyLine(dependencyTask, task);
          if (line) lines.push(line);
        }
      });
    }
  });

  if (lines.length === 0) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill={color}
          />
        </marker>
      </defs>
      {lines}
    </svg>
  );
};

export default DependencyLines;
