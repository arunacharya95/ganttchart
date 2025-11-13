import React from 'react';
import { Task } from '../types';
type TaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id'> | Task) => void;
    initialDate?: string;
    editingTask?: Task | null;
};
export declare const TaskModal: React.FC<TaskModalProps>;
export default TaskModal;
