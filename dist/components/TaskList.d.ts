import React from 'react';
import { TaskType } from '../types';
type TaskListProps = {
    tasks: TaskType[];
    rowHeight: number;
};
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
