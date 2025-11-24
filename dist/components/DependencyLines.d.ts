import React from 'react';
import { GanttTask, TaskDependency } from '../types';
interface DependencyLinesProps {
    tasks: GanttTask[];
    dependencies?: TaskDependency[];
    getTaskPosition: (taskId: string | number) => {
        left: number;
        width: number;
        top: number;
        height: number;
    } | null;
    style?: 'straight' | 'curved';
    color?: string;
    thickness?: number;
    showLabels?: boolean;
    criticalPathEnabled?: boolean;
    criticalPathColor?: string;
}
export declare const DependencyLines: React.FC<DependencyLinesProps>;
export default DependencyLines;
