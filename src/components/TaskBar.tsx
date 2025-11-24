import React, { useState, useRef } from 'react'
import { TaskType, GanttConfig, FlattenedTask } from '../types'
import { calculateTaskPosition } from '../utils'
import { COLOR_PALETTES, getProgressColor } from '../colorPalettes'

type TaskBarProps = {
  task: TaskType | FlattenedTask
  timelineStart: Date
  timelineEnd: Date
  chartWidth: number
  rowHeight: number
  index: number
  onTaskUpdate?: (taskId: string, updates: Partial<TaskType>) => void
  onClick?: (task: TaskType) => void
  onDoubleClick?: (task: TaskType) => void
  getTaskColor?: (task: TaskType) => string
  config?: GanttConfig
}

const TaskBar: React.FC<TaskBarProps> = ({ 
  task, 
  timelineStart, 
  timelineEnd, 
  chartWidth, 
  rowHeight, 
  index,
  onTaskUpdate,
  onClick,
  onDoubleClick,
  getTaskColor,
  config
}) => {
  const { left, width } = calculateTaskPosition(task, timelineStart, timelineEnd, chartWidth)
  const progress = task.progress || 0
  
  // Determine task bar color
  const getBarColor = (): string => {
    // Priority 1: Use task's explicit color property
    if (task.color) {
      return task.color
    }
    
    // Priority 2: Use custom getTaskColor function if provided
    if (getTaskColor) {
      return getTaskColor(task)
    }
    
    // Priority 3: Check config for color mappings
    if (config) {
      // Check statusColors mapping
      if (config.statusColors && task.status && config.statusColors[task.status]) {
        return config.statusColors[task.status]
      }
      
      // Check assigneeColors mapping
      if (config.assigneeColors && task.assignedTo && config.assigneeColors[task.assignedTo]) {
        return config.assigneeColors[task.assignedTo]
      }
      
      // Check colorPalette configuration
      if (config.colorPalette) {
        const palette = config.colorPalette
        
        // Use custom colors if provided
        if (palette.colors && palette.colors.length > 0) {
          return palette.colors[index % palette.colors.length]
        }
        
        // Use progress-specific colors if provided
        if (progress === 100 && palette.completed) return palette.completed
        if (progress > 0 && palette.inProgress) return palette.inProgress
        if (progress === 0 && palette.notStarted) return palette.notStarted
        
        // Use preset palette
        if (palette.preset) {
          return getProgressColor(palette.preset, progress)
        }
      }
    }
    
    // Priority 4: Default color based on progress
    if (progress === 100) {
      return '#10b981' // green for completed
    } else if (progress > 0) {
      return '#f97316' // orange for in progress  
    } else {
      return '#94a3b8' // gray for not started
    }
  }
  
  const taskColor = getBarColor()
  
  // Check if task is a milestone
  const isMilestone = task.isMilestone || false
  const showBaseline = config?.showBaseline && task.baseline
  const isCriticalPath = config?.showCriticalPath && task.isCritical
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [tempPosition, setTempPosition] = useState({ left, width })
  const [hasMoved, setHasMoved] = useState(false)
  const dragStartRef = useRef({ left, width, mouseX: 0 })
  const currentPositionRef = useRef({ left, width })
  const chartScrollRef = useRef<HTMLDivElement | null>(null)
  const prevPropsRef = useRef({ left, width })
  const animationFrameRef = useRef<number | null>(null)

  // Refs to keep track of latest state/props for event handlers
  const stateRef = useRef({ isDragging, isResizingLeft, isResizingRight })
  stateRef.current = { isDragging, isResizingLeft, isResizingRight }
  
  const dataRef = useRef({ task, timelineStart, timelineEnd, chartWidth, onTaskUpdate })
  dataRef.current = { task, timelineStart, timelineEnd, chartWidth, onTaskUpdate }

  // Get the chart scroll container
  React.useEffect(() => {
    const chartElement = document.querySelector('[data-gantt-chart-scroll]') as HTMLDivElement
    if (chartElement) {
      chartScrollRef.current = chartElement
    }
  }, [])

  // Define event handlers with stable references
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    const { isDragging, isResizingLeft, isResizingRight } = stateRef.current
    const { chartWidth } = dataRef.current

    if (!isDragging && !isResizingLeft && !isResizingRight) return
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const scrollLeft = chartScrollRef.current?.scrollLeft || 0
      const mouseX = e.clientX + scrollLeft
      const delta = mouseX - dragStartRef.current.mouseX
      
      // Mark as moved if threshold exceeded
      if (Math.abs(delta) > 3) {
        setHasMoved(true)
      }
      
      if (isDragging) {
        // Calculate new position for dragging
        const newLeft = Math.max(0, Math.min(dragStartRef.current.left + delta, chartWidth - dragStartRef.current.width))
        setTempPosition({ left: newLeft, width: dragStartRef.current.width })
        currentPositionRef.current = { left: newLeft, width: dragStartRef.current.width }
      } else if (isResizingLeft) {
        // Resize from left (change start date)
        const newLeft = Math.max(0, Math.min(dragStartRef.current.left + delta, dragStartRef.current.left + dragStartRef.current.width - 20))
        const newWidth = dragStartRef.current.width - (newLeft - dragStartRef.current.left)
        setTempPosition({ left: newLeft, width: newWidth })
        currentPositionRef.current = { left: newLeft, width: newWidth }
      } else if (isResizingRight) {
        // Resize from right (change end date)
        const newWidth = Math.max(20, dragStartRef.current.width + delta)
        setTempPosition({ left: dragStartRef.current.left, width: newWidth })
        currentPositionRef.current = { left: dragStartRef.current.left, width: newWidth }
      }
    })
  }, [])

  const handleMouseUp = React.useCallback(function onMouseUp(e: MouseEvent) {
    const { isDragging, isResizingLeft, isResizingRight } = stateRef.current
    const { onTaskUpdate, task, timelineStart, timelineEnd, chartWidth } = dataRef.current

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    // Always remove listeners on mouse up
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    
    if (isDragging || isResizingLeft || isResizingRight) {
      // Check if the position actually changed (more than 2px to avoid micro-movements)
      const positionChanged = Math.abs(currentPositionRef.current.left - dragStartRef.current.left) > 2 || 
                             Math.abs(currentPositionRef.current.width - dragStartRef.current.width) > 2
      
      // Only update if the task position actually changed
      if (positionChanged && onTaskUpdate) {
        // Calculate days based on pixels
        // Use Math.max(1, ...) to avoid division by zero
        const totalDays = Math.max(1, (timelineEnd.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000))
        const pxPerDay = chartWidth / totalDays
        
        const daysOffset = Math.round(currentPositionRef.current.left / pxPerDay)
        const durationDays = Math.round(currentPositionRef.current.width / pxPerDay)
        
        // Calculate new dates
        const newStart = new Date(timelineStart)
        newStart.setDate(newStart.getDate() + daysOffset)
        
        const newEnd = new Date(newStart)
        newEnd.setDate(newEnd.getDate() + Math.max(1, durationDays) - 1)
        
        // Format as YYYY-MM-DD manually to avoid timezone issues
        const formatDate = (d: Date) => {
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        
        const newStartDate = formatDate(newStart)
        const newEndDate = formatDate(newEnd)
        
        onTaskUpdate(String(task.id), {
          start: newStartDate,
          end: newEndDate
        })
      }
    }
    
    setIsDragging(false)
    setIsResizingLeft(false)
    setIsResizingRight(false)
  }, [handleMouseMove])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Only trigger onClick if the user didn't drag/resize
    if (!hasMoved && onClick) {
      onClick(task)
    }
  }
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDoubleClick) {
      onDoubleClick(task)
    }
  }

  const handleMouseDown = (e: React.MouseEvent, action: 'move' | 'resize-left' | 'resize-right') => {
    e.stopPropagation()
    e.preventDefault()
    
    // Don't allow dragging if task is locked
    if (task.isLocked) {
      return
    }
    
    const scrollLeft = chartScrollRef.current?.scrollLeft || 0
    const mouseX = e.clientX + scrollLeft
    
    setHasMoved(false)
    dragStartRef.current = { left, width, mouseX }
    currentPositionRef.current = { left, width }
    
    // Add listeners immediately
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = action === 'move' ? 'grabbing' : 'ew-resize'
    
    if (action === 'move') {
      setIsDragging(true)
    } else if (action === 'resize-left') {
      setIsResizingLeft(true)
    } else if (action === 'resize-right') {
      setIsResizingRight(true)
    }
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [handleMouseMove, handleMouseUp])

  React.useEffect(() => {
    // Reset temp position when props change (after update from parent)
    if (!isDragging && !isResizingLeft && !isResizingRight) {
      if (prevPropsRef.current.left !== left || prevPropsRef.current.width !== width) {
        setTempPosition({ left, width })
        currentPositionRef.current = { left, width }
        prevPropsRef.current = { left, width }
      }
    }
  }, [left, width, isDragging, isResizingLeft, isResizingRight])

  const currentLeft = isDragging || isResizingLeft || isResizingRight ? tempPosition.left : left
  const currentWidth = isDragging || isResizingLeft || isResizingRight ? tempPosition.width : width

  // Check if this is a subtask (has level property and level > 0)
  const isSubtask = 'level' in task && task.level > 0
  const hasChildren = 'hasChildren' in task && task.hasChildren
  
  // Calculate baseline position if enabled
  let baselineLeft = 0
  let baselineWidth = 0
  if (showBaseline && task.baseline) {
    const baselinePos = calculateTaskPosition(
      { ...task, start: task.baseline.start, end: task.baseline.end } as any,
      timelineStart,
      timelineEnd,
      chartWidth
    )
    baselineLeft = baselinePos.left
    baselineWidth = baselinePos.width
  }
  
  // Milestone rendering
  if (isMilestone) {
    const milestoneColor = config?.milestoneColor || '#f59e0b'
    const size = rowHeight - 20
    const diamondStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${currentLeft}px`,
      top: `${index * rowHeight + 10}px`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: milestoneColor,
      transform: 'rotate(45deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 3
    }
    
    const labelStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${currentLeft + size + 8}px`,
      top: `${index * rowHeight + 10}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      fontWeight: 600,
      color: '#374151',
      whiteSpace: 'nowrap'
    }
    
    return (
      <>
        <div
          data-task-bar="true"
          style={diamondStyle}
          title={`Milestone: ${task.name} - ${new Date(task.start || task.startDate).toLocaleDateString()}`}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        />
        <div style={labelStyle}>{task.name}</div>
      </>
    )
  }

  const barStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${currentLeft}px`,
    top: `${index * rowHeight + 10}px`,
    width: `${currentWidth}px`,
    height: `${rowHeight - 20}px`,
    backgroundColor: isCriticalPath ? (config?.criticalPathColor || '#ef4444') : taskColor,
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: hasChildren ? 600 : 500,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: task.isLocked ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
    boxShadow: isDragging || isResizingLeft || isResizingRight 
      ? '0 4px 12px rgba(0,0,0,0.15)' 
      : (isCriticalPath ? '0 2px 6px rgba(239, 68, 68, 0.3)' : '0 1px 3px rgba(0,0,0,0.08)'),
    transition: isDragging || isResizingLeft || isResizingRight ? 'none' : 'transform 0.1s, box-shadow 0.2s',
    userSelect: 'none',
    opacity: isSubtask ? 0.95 : 1,
    border: hasChildren ? '1px solid rgba(255,255,255,0.2)' : (isCriticalPath ? '1px solid #dc2626' : 'none')
  }
  
  const baselineStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${baselineLeft}px`,
    top: `${index * rowHeight + rowHeight - 15}px`,
    width: `${baselineWidth}px`,
    height: '4px',
    backgroundColor: '#9ca3af',
    borderRadius: '2px',
    opacity: config?.baselineOpacity || 0.5,
    pointerEvents: 'none',
    zIndex: 2
  }

  const progressStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: `${progress}%`,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    transition: 'width 0.3s',
    pointerEvents: 'none'
  }

  const resizeHandleStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [side]: 0,
    top: 0,
    bottom: 0,
    width: '10px',
    cursor: 'ew-resize',
    zIndex: 2,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })
  
  const resizeHandleIndicator: React.CSSProperties = {
    width: '3px',
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '1px',
    opacity: 0,
    transition: 'opacity 0.2s'
  }

  return (
    <>
      {/* Baseline bar (shown below main task bar) */}
      {showBaseline && <div style={baselineStyle} />}
      
      <style>{`
        .task-bar:hover .resize-handle .resize-indicator {
          opacity: 1;
        }
      `}</style>
      
      <div
        data-task-bar="true"
        className="task-bar"
        style={barStyle}
        title={`${task.name} (${new Date(task.start || task.startDate).toLocaleDateString()} - ${new Date(task.end || task.endDate).toLocaleDateString()})${task.isLocked ? ' [LOCKED]' : ''}\n${task.isLocked ? 'Schedule locked' : 'Drag to move, drag edges to resize, double-click to edit'}${isCriticalPath ? '\n⚠️ CRITICAL PATH' : ''}`}
        onClick={handleClick}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={(e) => !isDragging && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => !isDragging && (e.currentTarget.style.transform = 'translateY(0)')}
      >
        {/* Left resize handle */}
        {!task.isLocked && (
          <div
            className="resize-handle"
            style={resizeHandleStyle('left')}
            onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
            title="Drag to change start date"
          >
            <div className="resize-indicator" style={resizeHandleIndicator} />
          </div>
        )}
        
        {progress > 0 && <div style={progressStyle} />}
        <span style={{ position: 'relative', zIndex: 1 }}>{task.name}</span>
        
        {/* Right resize handle */}
        {!task.isLocked && (
          <div
            className="resize-handle"
            style={resizeHandleStyle('right')}
            onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
            title="Drag to change end date"
          >
            <div className="resize-indicator" style={resizeHandleIndicator} />
          </div>
        )}
      </div>
    </>
  )
}

export default TaskBar
