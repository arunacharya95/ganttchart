import React from 'react';
import { GanttTask, TaskDependency, DependencyType } from '../types';

interface DependencyLinesProps {
  tasks: GanttTask[];
  dependencies?: TaskDependency[];
  getTaskPosition: (taskId: string | number) => { left: number; width: number; top: number; height: number } | null;
  style?: 'straight' | 'curved';
  color?: string;
  thickness?: number;
  showLabels?: boolean;
  criticalPathEnabled?: boolean;
  criticalPathColor?: string;
}

export const DependencyLines: React.FC<DependencyLinesProps> = ({
  tasks,
  dependencies = [],
  getTaskPosition,
  style = 'curved',
  color = '#94a3b8',
  thickness = 2,
  showLabels = false,
  criticalPathEnabled = false,
  criticalPathColor = '#ef4444'
}) => {
  const renderDependencyLine = (
    fromTaskId: string | number,
    toTaskId: string | number,
    depType: DependencyType = 'FS',
    isCritical: boolean = false
  ) => {
    const fromPos = getTaskPosition(fromTaskId);
    const toPos = getTaskPosition(toTaskId);

    if (!fromPos || !toPos) return null;

    const fromTask = tasks.find(t => t.id === fromTaskId);
    const toTask = tasks.find(t => t.id === toTaskId);
    const lineColor = (criticalPathEnabled && isCritical) ? criticalPathColor : color;

    let startX: number, startY: number, endX: number, endY: number;
    let label = '';

    // Calculate connection points based on dependency type
    switch (depType) {
      case 'FS': // Finish to Start
        startX = fromPos.left + fromPos.width; // Right edge of from task
        startY = fromPos.top + fromPos.height / 2;
        endX = toPos.left; // Left edge of to task
        endY = toPos.top + toPos.height / 2;
        label = 'FS';
        break;
      case 'FF': // Finish to Finish
        startX = fromPos.left + fromPos.width; // Right edge of from task
        startY = fromPos.top + fromPos.height / 2;
        endX = toPos.left + toPos.width; // Right edge of to task
        endY = toPos.top + toPos.height / 2;
        label = 'FF';
        break;
      case 'SF': // Start to Finish
        startX = fromPos.left; // Left edge of from task
        startY = fromPos.top + fromPos.height / 2;
        endX = toPos.left + toPos.width; // Right edge of to task
        endY = toPos.top + toPos.height / 2;
        label = 'SF';
        break;
      case 'SS': // Start to Start
        startX = fromPos.left; // Left edge of from task
        startY = fromPos.top + fromPos.height / 2;
        endX = toPos.left; // Left edge of to task
        endY = toPos.top + toPos.height / 2;
        label = 'SS';
        break;
    }

    const key = `dep-${fromTaskId}-${toTaskId}-${depType}`;

    if (style === 'straight') {
      return (
        <g key={key}>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={lineColor}
            strokeWidth={thickness}
            markerEnd={`url(#arrowhead-${isCritical ? 'critical' : 'normal'})`}
          />
          {showLabels && (
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2 - 5}
              fill={lineColor}
              fontSize="10"
              fontWeight="500"
            >
              {label}
            </text>
          )}
        </g>
      );
    } else {
      // Curved path with right-angle connectors
      const midX = (startX + endX) / 2;
      
      const path = `
        M ${startX} ${startY}
        L ${midX} ${startY}
        L ${midX} ${endY}
        L ${endX} ${endY}
      `;

      return (
        <g key={key}>
          <path
            d={path}
            fill="none"
            stroke={lineColor}
            strokeWidth={thickness}
            markerEnd={`url(#arrowhead-${isCritical ? 'critical' : 'normal'})`}
          />
          {showLabels && (
            <text
              x={midX}
              y={(startY + endY) / 2 - 5}
              fill={lineColor}
              fontSize="10"
              fontWeight="500"
              textAnchor="middle"
            >
              {label}
            </text>
          )}
        </g>
      );
    }
  };

  // Collect all dependency lines
  const lines: JSX.Element[] = [];

  // Use explicit dependencies array if provided
  if (dependencies && dependencies.length > 0) {
    dependencies.forEach(dep => {
      const fromTask = tasks.find(t => t.id === dep.from);
      const toTask = tasks.find(t => t.id === dep.to);
      const isCritical = criticalPathEnabled && fromTask?.isCritical && toTask?.isCritical;
      const line = renderDependencyLine(dep.from, dep.to, dep.type, isCritical);
      if (line) lines.push(line);
    });
  } else {
    // Fall back to task.dependencies array (default FS type)
    tasks.forEach(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          const dependencyTask = tasks.find(t => t.id === depId);
          if (dependencyTask) {
            const isCritical = criticalPathEnabled && dependencyTask?.isCritical && task?.isCritical;
            const line = renderDependencyLine(depId, task.id, 'FS', isCritical);
            if (line) lines.push(line);
          }
        });
      }
    });
  }

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
      {/* Arrow marker definitions */}
      <defs>
        <marker
          id="arrowhead-normal"
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
        <marker
          id="arrowhead-critical"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill={criticalPathColor}
          />
        </marker>
      </defs>
      {lines}
    </svg>
  );
};

export default DependencyLines;
