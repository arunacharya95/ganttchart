import React from 'react';
import { FlattenedTask } from '../types';
type TaskListProps = {
    tasks: FlattenedTask[];
    rowHeight: number;
    onToggleExpand?: (taskId: string | number) => void;
};
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
