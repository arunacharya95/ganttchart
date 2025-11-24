import React, { useMemo } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useGanttStore, useGanttStoreActions } from '../state/ganttStore';
import type { Task } from '../types/domain';

interface TaskWithChildren extends Task {
  children?: TaskWithChildren[];
}

const buildHierarchy = (tasks: Task[]): TaskWithChildren[] => {
  const byId = new Map<string, TaskWithChildren>();
  const roots: TaskWithChildren[] = [];

  tasks.forEach(task => {
    byId.set(task.id, { ...task, children: [] });
  });

  byId.forEach(task => {
    if (task.parentId && byId.has(task.parentId)) {
      byId.get(task.parentId)!.children!.push(task);
    } else {
      roots.push(task);
    }
  });

  return roots;
};

const renderTaskItems = (
  tasks: TaskWithChildren[],
  selectedTaskIds: string[],
  onSelect: (taskId: string) => void,
  depth = 0,
) => {
  return tasks.map(task => {
    const isSelected = selectedTaskIds.includes(task.id);
    return (
      <React.Fragment key={task.id}>
        <ListItem
          sx={{
            pl: 2 + depth * 2,
            bgcolor: isSelected ? 'action.selected' : 'transparent',
            cursor: 'pointer',
          }}
          data-task-id={task.id}
          onClick={() => onSelect(task.id)}
        >
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontWeight={task.parentId ? 400 : 600}>
                {task.name}
              </Typography>
            </Box>
          }
          secondary={
            task.start && task.end
              ? `${new Date(task.start).toLocaleDateString()} - ${new Date(task.end).toLocaleDateString()}`
              : undefined
          }
        />
        </ListItem>
        {task.children && task.children.length > 0 &&
          renderTaskItems(task.children, selectedTaskIds, onSelect, depth + 1)}
      </React.Fragment>
    );
  });
};

export interface TaskListSidebarProps {
  width?: number;
}

export const TaskListSidebar: React.FC<TaskListSidebarProps> = ({ width = 260 }) => {
  const tasks = useGanttStore(state => state.tasks);
  const selectedTaskIds = useGanttStore(state => state.viewState.selectedTaskIds);
  const { setState } = useGanttStoreActions();

  const tree = useMemo(() => buildHierarchy(tasks), [tasks]);

  const handleSelect = (taskId: string) => {
    setState(prev => ({
      ...prev,
      viewState: {
        ...prev.viewState,
        selectedTaskIds: [taskId],
      },
    }));
  };

  return (
    <Box
      sx={{
        width,
        borderRight: '1px solid rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <Box px={2} py={1.5} borderBottom="1px solid rgba(0,0,0,0.08)">
        <Typography variant="subtitle2" color="text.secondary">
          Tasks
        </Typography>
      </Box>
      <List dense disablePadding>
        {tree.length === 0 ? (
          <ListItem>
            <ListItemText primary={<Typography variant="body2" color="text.secondary">No tasks</Typography>} />
          </ListItem>
        ) : (
          renderTaskItems(tree, selectedTaskIds, handleSelect)
        )}
      </List>
    </Box>
  );
};

export default TaskListSidebar;
