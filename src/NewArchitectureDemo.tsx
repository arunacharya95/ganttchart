import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Container, Typography } from '@mui/material';
import { GanttContainer } from './components/GanttContainer';
import { getGanttStore } from './state/ganttStore';
import type { Task, Dependency, Baseline } from './types/domain';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

// Seed the store with a small sample so the timeline has data
const store = getGanttStore();

if (store.getState().tasks.length === 0) {
  const sampleTasks: Task[] = [
    {
      id: '1',
      name: 'Architecture & Planning',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-10'),
    },
    {
      id: '2',
      name: 'Implementation',
      start: new Date('2024-01-11'),
      end: new Date('2024-01-25'),
      parentId: '1',
    },
  ];

      const baseline: Baseline = {
        id: 'b1',
        name: 'Initial Plan',
        createdAt: new Date(),
        taskSnapshots: sampleTasks.map(t => ({
          taskId: t.id,
          start: t.start,
          end: t.end,
        })),
      };

      store.setState(prev => ({
        ...prev,
        tasks: sampleTasks,
        dependencies: [
          {
            id: 'd1',
            fromTaskId: '1',
            toTaskId: '2',
            type: 'FS',
          } as Dependency,
        ],
        baselines: [baseline],
      }));
}

const NewArchitectureDemo: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            New Gantt Architecture (Timeline Shell)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This demo shows the new store + timeline + header + grid shell.
          </Typography>
        </Box>
        <GanttContainer height={500} />
      </Container>
    </ThemeProvider>
  );
};

export default NewArchitectureDemo;
