import React from 'react';
import { Box } from '@mui/material';
import { useTimeline } from '../hooks/useTimeline';
import { TaskBars } from './TaskBars';

const COLUMN_MIN_WIDTH = 80;

export const TimelineGrid: React.FC = () => {
  const { timelineUnits, scale } = useTimeline();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        borderTop: '1px solid rgba(0,0,0,0.12)',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}
    >
      {timelineUnits.map((unit, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            minWidth: COLUMN_MIN_WIDTH,
            borderLeft: index === 0 ? 'none' : '1px solid rgba(0,0,0,0.08)',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: index % 2 === 0 ? 'background.default' : 'background.paper',
            '&:last-of-type': {
              borderRight: 'none',
            },
          }}
        />
      ))}
      <TaskBars />
    </Box>
  );
};

export default TimelineGrid;
