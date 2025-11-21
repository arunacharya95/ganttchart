import React from 'react';
import { TaskType, GanttConfig, FlattenedTask } from '../types';
type TaskBarProps = {
    task: TaskType | FlattenedTask;
    timelineStart: Date;
    timelineEnd: Date;
    chartWidth: number;
    rowHeight: number;
    index: number;
    onTaskUpdate?: (taskId: string, updates: Partial<TaskType>) => void;
    onClick?: (task: TaskType) => void;
    onDoubleClick?: (task: TaskType) => void;
    getTaskColor?: (task: TaskType) => string;
    config?: GanttConfig;
};
declare const TaskBar: React.FC<TaskBarProps>;
export default TaskBar;
