import React from 'react'
import { Box, Stack, Typography, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { format } from 'date-fns'
import { useTimeline } from '../hooks/useTimeline'

export const GanttHeader: React.FC = () => {
  const {
    scale,
    zoomLevel,
    visibleStart,
    visibleEnd,
    timelineUnits,
    setScale,
    setZoomLevel,
  } = useTimeline()

  const handleScaleChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: 'day' | 'week' | 'month' | 'quarter' | null,
  ) => {
    if (!next) return
    setScale(next)
  }

  const handleZoomIn = () => setZoomLevel((prev) => prev * 1.25)
  const handleZoomOut = () => setZoomLevel((prev) => prev / 1.25)

  const rangeLabel = `${format(visibleStart, 'MMM dd, yyyy')} – ${format(visibleEnd, 'MMM dd, yyyy')}`

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        px: 2,
        py: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            Timeline
          </Typography>
          <ToggleButtonGroup
            color="primary"
            size="small"
            exclusive
            value={scale}
            onChange={handleScaleChange}
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="quarter">Quarter</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOutIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {Math.round(zoomLevel * 100)}%
          </Typography>
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {rangeLabel}
        </Typography>
      </Stack>

      {/* Simple bottom row of labels for now */}
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {timelineUnits.map((unit, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              minWidth: 80,
              borderRight: 1,
              borderColor: 'divider',
              px: 1,
              py: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {format(unit.start, scale === 'day' ? 'MMM dd' : scale === 'week' ? 'wo' : scale === 'month' ? 'MMM yyyy' : "'Q'Q yyyy")}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

