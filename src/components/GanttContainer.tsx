import React from 'react';
import { Box, Paper } from '@mui/material';
import { GanttHeader } from './GanttHeader';
import { TimelineGrid } from './TimelineGrid';
import { TaskListSidebar } from './TaskListSidebar';
import { TimeCostSummary } from './TimeCostSummary';

export interface GanttContainerProps {
  height?: number | string;
}

export const GanttContainer: React.FC<GanttContainerProps> = ({ height = 480 }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height,
        overflow: 'hidden',
      }}
    >
      <TimeCostSummary />
      <GanttHeader />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <TaskListSidebar />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <TimelineGrid />
        </Box>
      </Box>
    </Paper>
  );
};

export default GanttContainer;
