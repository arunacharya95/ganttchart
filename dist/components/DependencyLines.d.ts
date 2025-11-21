import React from 'react';
import { GanttTask } from '../types';
interface DependencyLinesProps {
    tasks: GanttTask[];
    getTaskPosition: (taskId: string | number) => {
        left: number;
        width: number;
        top: number;
    } | null;
    style?: 'straight' | 'curved';
    color?: string;
}
export declare const DependencyLines: React.FC<DependencyLinesProps>;
export default DependencyLines;
