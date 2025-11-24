import React from 'react';
import { FlattenedTask, TaskListColumn } from '../types';
type TaskListProps = {
    tasks: FlattenedTask[];
    rowHeight: number;
    onToggleExpand?: (taskId: string | number) => void;
    columns?: TaskListColumn[];
    headerHeight?: number;
};
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
