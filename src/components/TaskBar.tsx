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
      return '#3b82f6' // blue for in progress
    } else {
      return '#6b7280' // gray for not started
    }
  }
  
  const taskColor = getBarColor()
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tempPosition, setTempPosition] = useState({ left, width })
  const [initialMouseX, setInitialMouseX] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)
  const dragStartRef = useRef({ left, width })
  const chartScrollRef = useRef<HTMLDivElement | null>(null)
  const prevPropsRef = useRef({ left, width })

  // Get the chart scroll container
  React.useEffect(() => {
    const chartElement = document.querySelector('[data-gantt-chart-scroll]') as HTMLDivElement
    if (chartElement) {
      chartScrollRef.current = chartElement
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent, action: 'move' | 'resize-left' | 'resize-right') => {
    e.stopPropagation()
    e.preventDefault()
    
    const scrollLeft = chartScrollRef.current?.scrollLeft || 0
    setHasMoved(false)
    
    if (action === 'move') {
      setIsDragging(true)
      setInitialMouseX(e.clientX)
      setDragOffset({ x: e.clientX - left + scrollLeft, y: 0 })
    } else if (action === 'resize-left') {
      setIsResizingLeft(true)
      setInitialMouseX(e.clientX)
    } else if (action === 'resize-right') {
      setIsResizingRight(true)
      setInitialMouseX(e.clientX)
    }
    
    dragStartRef.current = { left, width }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent grid click from firing
    
    // Only trigger onClick if the user didn't drag and wasn't resizing
    if (!hasMoved && !isDragging && !isResizingLeft && !isResizingRight && onClick) {
      onClick(task)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    const scrollLeft = chartScrollRef.current?.scrollLeft || 0
    
    // Mark that mouse has moved (for distinguishing click from drag)
    if (!hasMoved && Math.abs(e.clientX - initialMouseX) > 5) {
      setHasMoved(true)
    }
    
    if (isDragging) {
      const mouseX = e.clientX + scrollLeft
      const newLeft = Math.max(0, Math.min(mouseX - dragOffset.x, chartWidth - width))
      setTempPosition({ left: newLeft, width })
    } else if (isResizingLeft) {
      const mouseX = e.clientX + scrollLeft
      const delta = e.clientX - initialMouseX
      const newLeft = Math.max(0, dragStartRef.current.left + delta)
      const newWidth = dragStartRef.current.width - delta
      if (newWidth >= 20) {
        setTempPosition({ left: newLeft, width: newWidth })
      }
    } else if (isResizingRight) {
      const delta = e.clientX - initialMouseX
      const newWidth = Math.max(20, dragStartRef.current.width + delta)
      setTempPosition({ left: dragStartRef.current.left, width: newWidth })
    }
  }

  const handleMouseUp = () => {
    console.log('🖱️ TaskBar.handleMouseUp')
    console.log('   isDragging:', isDragging)
    console.log('   isResizingLeft:', isResizingLeft)
    console.log('   isResizingRight:', isResizingRight)
    
    if (isDragging || isResizingLeft || isResizingRight) {
      // Check if the position actually changed
      const positionChanged = tempPosition.left !== dragStartRef.current.left || 
                             tempPosition.width !== dragStartRef.current.width
      
      console.log('📏 Position check:')
      console.log('   positionChanged:', positionChanged)
      console.log('   tempPosition:', tempPosition)
      console.log('   dragStartRef:', dragStartRef.current)
      console.log('   onTaskUpdate:', onTaskUpdate ? 'defined' : 'NOT DEFINED')
      
      // Only update if the task position actually changed
      if (positionChanged && onTaskUpdate) {
        const totalDuration = timelineEnd.getTime() - timelineStart.getTime()
        const msPerPixel = totalDuration / chartWidth
        
        const newStartMs = timelineStart.getTime() + (tempPosition.left * msPerPixel)
        const newEndMs = timelineStart.getTime() + ((tempPosition.left + tempPosition.width) * msPerPixel)
        
        const newStartDate = new Date(newStartMs).toISOString().split('T')[0]
        const newEndDate = new Date(newEndMs).toISOString().split('T')[0]
        
        console.log('🎯 Calling onTaskUpdate')
        console.log('   taskId:', task.id)
        console.log('   new start:', newStartDate)
        console.log('   new end:', newEndDate)
        
        onTaskUpdate(String(task.id), {
          start: newStartDate,
          end: newEndDate
        })
      } else {
        console.log('❌ NOT calling onTaskUpdate')
        console.log('   Reason: positionChanged =', positionChanged, ', onTaskUpdate =', !!onTaskUpdate)
      }
    } else {
      console.log('⏭️ Skipping - not dragging or resizing')
    }
    
    setIsDragging(false)
    setIsResizingLeft(false)
    setIsResizingRight(false)
  }

  React.useEffect(() => {
    if (isDragging || isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizingLeft, isResizingRight, tempPosition])

  React.useEffect(() => {
    // Only reset tempPosition when props actually change (parent updated)
    // Not just when dragging stops
    if (!isDragging && !isResizingLeft && !isResizingRight) {
      if (prevPropsRef.current.left !== left || prevPropsRef.current.width !== width) {
        setTempPosition({ left, width })
        prevPropsRef.current = { left, width }
      }
    }
  }, [left, width, isDragging, isResizingLeft, isResizingRight])

  const currentLeft = isDragging || isResizingLeft || isResizingRight ? tempPosition.left : left
  const currentWidth = isDragging || isResizingLeft || isResizingRight ? tempPosition.width : width

  // Check if this is a subtask (has level property and level > 0)
  const isSubtask = 'level' in task && task.level > 0
  const hasChildren = 'hasChildren' in task && task.hasChildren

  const barStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${currentLeft}px`,
    top: `${index * rowHeight + 10}px`,
    width: `${currentWidth}px`,
    height: `${rowHeight - 20}px`,
    backgroundColor: taskColor,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: hasChildren ? 600 : 500,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: isDragging || isResizingLeft || isResizingRight 
      ? '0 4px 6px rgba(0,0,0,0.3)' 
      : '0 1px 3px rgba(0,0,0,0.2)',
    transition: isDragging || isResizingLeft || isResizingRight ? 'none' : 'transform 0.1s',
    userSelect: 'none',
    opacity: isSubtask ? 0.9 : 1,
    border: hasChildren ? '2px solid rgba(255,255,255,0.3)' : 'none'
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
    width: '8px',
    cursor: 'ew-resize',
    zIndex: 2,
    backgroundColor: 'transparent'
  })

  return (
    <>
      <div
        data-task-bar="true"
        style={barStyle}
        title={`${task.name} (${new Date(task.start || task.startDate).toLocaleDateString()} - ${new Date(task.end || task.endDate).toLocaleDateString()})\nDrag to move, drag edges to resize, double-click to edit`}
        onClick={handleClick}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
        onDoubleClick={() => onDoubleClick?.(task)}
        onMouseEnter={(e) => !isDragging && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => !isDragging && (e.currentTarget.style.transform = 'translateY(0)')}
      >
        {/* Left resize handle */}
        <div
          style={resizeHandleStyle('left')}
          onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
          title="Drag to change start date"
        />
        
        {progress > 0 && <div style={progressStyle} />}
        <span style={{ position: 'relative', zIndex: 1 }}>{task.name}</span>
        
        {/* Right resize handle */}
        <div
          style={resizeHandleStyle('right')}
          onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
          title="Drag to change end date"
        />
      </div>
    </>
  )
}

export default TaskBar
