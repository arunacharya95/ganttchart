import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import { GanttChart } from '@your-org/gantt-react';
import type { GanttTask } from '@your-org/gantt-react';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
});

// Sample data - this is what your team will provide
const initialTasks: GanttTask[] = [
  {
    id: '1',
    name: 'Project Planning & Requirements',
    start: '2024-01-01',
    end: '2024-01-14',
    status: 'Done',
    progress: 100,
    assignedTo: 'Alice Johnson',
    dependencies: [],
  },
  {
    id: '2',
    name: 'Design System Architecture',
    start: '2024-01-15',
    end: '2024-01-28',
    status: 'Done',
    progress: 100,
    assignedTo: 'Bob Smith',
    dependencies: ['1'],
  },
  {
    id: '3',
    name: 'Database Schema Design',
    start: '2024-01-15',
    end: '2024-01-21',
    status: 'Done',
    progress: 100,
    assignedTo: 'Charlie Brown',
    dependencies: ['1'],
  },
  {
    id: '4',
    name: 'Backend API Development',
    start: '2024-01-29',
    end: '2024-02-18',
    status: 'In Progress',
    progress: 65,
    assignedTo: 'Bob Smith',
    dependencies: ['2', '3'],
  },
  {
    id: '5',
    name: 'Frontend UI Components',
    start: '2024-01-29',
    end: '2024-02-25',
    status: 'In Progress',
    progress: 45,
    assignedTo: 'Diana Prince',
    dependencies: ['2'],
  },
  {
    id: '6',
    name: 'Authentication Module',
    start: '2024-02-19',
    end: '2024-03-03',
    status: 'Not Started',
    progress: 0,
    assignedTo: 'Eve Wilson',
    dependencies: ['4'],
  },
  {
    id: '7',
    name: 'Payment Integration',
    start: '2024-02-26',
    end: '2024-03-10',
    status: 'Not Started',
    progress: 0,
    assignedTo: 'Frank Miller',
    dependencies: ['5'],
  },
  {
    id: '8',
    name: 'Testing & QA',
    start: '2024-03-11',
    end: '2024-03-24',
    status: 'Not Started',
    progress: 0,
    assignedTo: 'Grace Lee',
    dependencies: ['6', '7'],
  },
];

function App() {
  // State management - this is what you need to implement
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);

  /**
   * Handle task updates from drag/drop, resize, or edit
   * This is called automatically by the Gantt component
   */
  const handleTaskUpdate = (taskId: string | number, updates: Partial<GanttTask>) => {
    console.log('Task updated:', taskId, updates);
    
    // Update local state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );

    // TODO: Also sync with your backend/API
    // Example:
    // api.updateTask(taskId, updates).then(() => {
    //   console.log('Task saved to backend');
    // });
  };

  /**
   * Handle task clicks
   * This is called when a task bar is clicked
   */
  const handleTaskClick = (task: GanttTask) => {
    console.log('Task clicked:', task);
    // You can add custom logic here
  };

  /**
   * Example: Add a new task
   */
  const handleAddTask = () => {
    const newTask: GanttTask = {
      id: Date.now().toString(),
      name: 'New Task',
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Not Started',
      progress: 0,
      assignedTo: 'Unassigned',
      dependencies: [],
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Project Gantt Chart
            </Typography>
            <Button variant="contained" onClick={handleAddTask}>
              Add Task
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Drag tasks to reschedule, resize to adjust duration, click to edit details
          </Typography>
        </Box>

        {/* This is the main component - just pass tasks array and callbacks */}
        <GanttChart
          tasks={tasks}
          config={{
            dayWidth: 40,
            rowHeight: 50,
            monthsToShow: 12,
            showWeekends: true,
            enableDragDrop: true,
            enableResize: true,
            showGridLines: true,
            showTodayLine: true,
          }}
          onTaskUpdate={handleTaskUpdate}
          onTaskClick={handleTaskClick}
          enableEdit={true}
          height="600px"
          showTaskList={true}
          taskListWidth={320}
        />

        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📊 Current Tasks: {tasks.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Completed: {tasks.filter(t => t.status === 'Done').length} | 
            🔄 In Progress: {tasks.filter(t => t.status === 'In Progress').length} | 
            ⏸️ Not Started: {tasks.filter(t => t.status === 'Not Started').length}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
