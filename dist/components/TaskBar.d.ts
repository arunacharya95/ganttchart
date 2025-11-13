import React from 'react';
import { TaskType } from '../types';
type TaskBarProps = {
    task: TaskType;
    timelineStart: Date;
    timelineEnd: Date;
    chartWidth: number;
    rowHeight: number;
    index: number;
    onTaskUpdate?: (taskId: string, updates: Partial<TaskType>) => void;
    onClick?: (task: TaskType) => void;
    onDoubleClick?: (task: TaskType) => void;
};
declare const TaskBar: React.FC<TaskBarProps>;
export default TaskBar;
