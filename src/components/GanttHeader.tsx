import React from 'react'
import { Box, Stack, Typography, IconButton, ToggleButton, ToggleButtonGroup, FormControlLabel, Switch, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { format } from 'date-fns'
import { useTimeline } from '../hooks/useTimeline'
import { useGanttStore, useGanttStoreActions } from '../state/ganttStore'

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

  const showBaselines = useGanttStore(state => state.viewState.showBaselines)
  const showCriticalPath = useGanttStore(state => state.viewState.showCriticalPath)
  const statusFilter = useGanttStore(state => state.viewState.statusFilter)
  const textSearch = useGanttStore(state => state.viewState.textSearch)
  const views = useGanttStore(state => state.viewState.views)
  const activeViewId = useGanttStore(state => state.viewState.activeViewId)
  const { setState } = useGanttStoreActions()

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

  const handleApplyView = (viewId: string) => {
    const view = views.find(v => v.id === viewId)
    if (!view) return
    setState(prev => ({
      ...prev,
      viewState: {
        ...prev.viewState,
        ...view.state,
        activeViewId: viewId,
      },
    }))
  }

  const handleSaveView = () => {
    const name = prompt('View name')?.trim()
    if (!name) return
    setState(prev => {
      const current = prev.viewState
      const id = `${Date.now()}`
      const nextViews = [
        ...current.views,
        {
          id,
          name,
          scope: 'personal' as const,
          state: {
            scale: current.scale,
            zoomLevel: current.zoomLevel,
            statusFilter: current.statusFilter,
            textSearch: current.textSearch,
            showBaselines: current.showBaselines,
            showCriticalPath: current.showCriticalPath,
          },
        },
      ]
      return {
        viewState: {
          ...current,
          views: nextViews,
          activeViewId: id,
        },
      }
    })
  }

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
          <FormControl size="small" sx={{ ml: 2, minWidth: 160 }}>
            <InputLabel id="view-select-label">View</InputLabel>
            <Select
              labelId="view-select-label"
              label="View"
              value={activeViewId ?? ''}
              displayEmpty
              onChange={(event) => {
                const id = event.target.value as string
                if (!id) return
                handleApplyView(id)
              }}
              renderValue={(selected) => {
                if (!selected) return 'Default'
                const v = views.find(v => v.id === selected)
                return v?.name ?? 'Default'
              }}
            >
              {views.map(v => (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton size="small" sx={{ ml: 1 }} onClick={handleSaveView}>
            <Typography variant="caption">Save</Typography>
          </IconButton>
          <FormControl size="small" sx={{ ml: 2, minWidth: 140 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Status"
              multiple
              value={statusFilter ?? []}
              onChange={(event) => {
                const value = event.target.value as string[]
                setState(prev => ({
                  ...prev,
                  viewState: {
                    ...prev.viewState,
                    statusFilter: value.length ? (value as any) : undefined,
                  },
                }))
              }}
              renderValue={(selected) => (selected as string[]).join(', ') || 'All'
              }
            >
              <MenuItem value="NotStarted">NotStarted</MenuItem>
              <MenuItem value="InProgress">InProgress</MenuItem>
              <MenuItem value="Blocked">Blocked</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            sx={{ ml: 2, width: 200 }}
            label="Search"
            value={textSearch ?? ''}
            onChange={(event) =>
              setState(prev => ({
                ...prev,
                viewState: {
                  ...prev.viewState,
                  textSearch: event.target.value || undefined,
                },
              }))
            }
          />
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
          <FormControlLabel
            sx={{ ml: 2 }}
            control={
              <Switch
                size="small"
                checked={showBaselines}
                onChange={(_, checked) =>
                  setState(prev => ({
                    ...prev,
                    viewState: {
                      ...prev.viewState,
                      showBaselines: checked,
                    },
                  }))
                }
              />
            }
            label="Baselines"
          />
          <FormControlLabel
            sx={{ ml: 1 }}
            control={
              <Switch
                size="small"
                checked={showCriticalPath}
                onChange={(_, checked) =>
                  setState(prev => ({
                    ...prev,
                    viewState: {
                      ...prev.viewState,
                      showCriticalPath: checked,
                    },
                  }))
                }
              />
            }
            label="Critical path"
          />
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

