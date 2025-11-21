import React, { useMemo, useRef, useState } from 'react'
import { GanttChartProps, Task, FlattenedTask } from '../types'
import { getDateRange, generateTimeline, flattenTasks, toggleTaskExpansion } from '../utils'
import Timeline from './Timeline'
import TaskList from './TaskList'
import TaskBar from './TaskBar'
import TaskModal from './TaskModal'

export const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  onChange,
  onTaskClick,
  onTaskDoubleClick,
  getTaskColor,
  config,
  viewMode = 'day',
  locale = 'en-US',
  height = 600
}) => {
  const ROW_HEIGHT = 50
  const UNIT_WIDTH = 80 // Width per timeline unit (day/week/month)
  
  const chartScrollRef = useRef<HTMLDivElement>(null)
  const listScrollRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string | number>>(new Set())

  // Flatten tasks for rendering (maintains hierarchy info)
  const flattenedTasks = useMemo(() => flattenTasks(tasks, expandedTaskIds), [tasks, expandedTaskIds])

  const dateRange = useMemo(() => getDateRange(flattenedTasks), [flattenedTasks])
  const timelineUnits = useMemo(() => 
    generateTimeline(dateRange.start, dateRange.end, viewMode), 
    [dateRange, viewMode]
  )

  // Handle expand/collapse
  const handleToggleExpand = (taskId: string | number) => {
    setExpandedTaskIds(prevIds => toggleTaskExpansion(taskId, prevIds))
  }

  const CHART_WIDTH = timelineUnits.length * UNIT_WIDTH

  // Sync vertical scroll between task list and chart
  const handleChartScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (listScrollRef.current) {
      listScrollRef.current.scrollTop = e.currentTarget.scrollTop
    }
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollTop = e.currentTarget.scrollTop
    }
  }

  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    console.log('🔄 GanttChart.handleTaskUpdate called:', { taskId, updates })
    console.log('📋 Current tasks:', tasks)
    console.log('🎯 onChange prop:', onChange ? 'defined' : 'NOT DEFINED')
    
    if (onChange) {
      const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          console.log('📝 Found task to update:', t.id)
          console.log('   Old values:', { 
            startDate: (t as any).startDate, 
            start: (t as any).start,
            endDate: (t as any).endDate,
            end: (t as any).end
          })
          
          // If task uses startDate/endDate format, convert updates to that format
          if ('startDate' in t) {
            console.log('   Task uses startDate/endDate format')
            const updatedTask: any = { ...t }
            
            // Apply all updates
            Object.keys(updates).forEach(key => {
              if (key === 'start' && updates.start) {
                updatedTask.startDate = updates.start
                updatedTask.start = updates.start
                console.log('   Setting startDate & start to:', updates.start)
              } else if (key === 'end' && updates.end) {
                updatedTask.endDate = updates.end
                updatedTask.end = updates.end
                console.log('   Setting endDate & end to:', updates.end)
              } else {
                updatedTask[key] = (updates as any)[key]
              }
            })
            
            console.log('   Updated task:', { 
              startDate: updatedTask.startDate, 
              endDate: updatedTask.endDate 
            })
            return updatedTask
          } else {
            console.log('   Task uses start/end format')
          }
          // Default: just merge updates
          return { ...t, ...updates }
        }
        return t
      })
      
      console.log('📤 Calling onChange with updated tasks')
      console.log('   Updated tasks count:', updatedTasks.length)
      onChange(updatedTasks)
    } else {
      console.error('❌ onChange is NOT DEFINED!')
    }
  }

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only open modal if clicking on empty space, not on a task bar
    if ((e.target as HTMLElement).closest('[data-task-bar]')) {
      return
    }
    
    // Don't open built-in modal if user provided custom onTaskClick
    if (onTaskClick) {
      return
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left + (chartScrollRef.current?.scrollLeft || 0)
    
    // Calculate which date was clicked
    const unitIndex = Math.floor(clickX / UNIT_WIDTH)
    const clickedUnit = timelineUnits[unitIndex]
    
    if (clickedUnit) {
      // Format date as YYYY-MM-DD without timezone issues
      const date = clickedUnit.startDate
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const clickedDate = `${year}-${month}-${day}`
      
      setSelectedDate(clickedDate)
      setEditingTask(null)
      setIsModalOpen(true)
    }
  }

  const handleTaskDoubleClick = (task: Task) => {
    setEditingTask(task)
    const taskStart = task.start || task.startDate
    setSelectedDate(typeof taskStart === 'string' ? taskStart : taskStart.toISOString().split('T')[0])
    setIsModalOpen(true)
  }

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    if (onChange) {
      if ('id' in taskData) {
        // Editing existing task
        const updatedTasks = tasks.map(t => 
          t.id === taskData.id ? taskData as Task : t
        )
        onChange(updatedTasks)
      } else {
        // Adding new task
        const newTask: Task = {
          name: '',
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          ...taskData,
          id: `task-${Date.now()}`
        }
        onChange([...tasks, newTask])
      }
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#fff',
    height: height
  }

  const taskListContainerStyle: React.CSSProperties = {
    width: 250,
    borderRight: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }

  const taskListHeaderStyle: React.CSSProperties = {
    height: 60,
    borderBottom: '2px solid #e5e7eb',
    background: '#f9fafb',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    fontSize: '14px',
    color: '#374151',
    flexShrink: 0
  }

  const taskListScrollStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden'
  }

  const chartContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }

  const timelineContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    overflowY: 'hidden',
    borderBottom: '2px solid #e5e7eb',
    backgroundColor: '#fff',
    flexShrink: 0
  }

  const chartAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowX: 'auto',
    overflowY: 'auto',
  }

  const gridStyle: React.CSSProperties = {
    position: 'relative',
    height: `${flattenedTasks.length * ROW_HEIGHT}px`,
    width: `${CHART_WIDTH}px`,
    minWidth: '100%',
    backgroundColor: '#fff',
  }

  const gridLinesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
  }

  return (
    <div style={containerStyle}>
      {/* Left side: Task List */}
      <div style={taskListContainerStyle}>
        <div style={taskListHeaderStyle}>
          Task Name
        </div>
        <div 
          ref={listScrollRef}
          onScroll={handleListScroll}
          style={taskListScrollStyle}
        >
          <TaskList tasks={flattenedTasks} rowHeight={ROW_HEIGHT} onToggleExpand={handleToggleExpand} />
        </div>
      </div>

      {/* Right side: Gantt Chart */}
      <div style={chartContainerStyle}>
        {/* Timeline header - synced horizontal scroll */}
        <div 
          ref={timelineScrollRef}
          onScroll={handleTimelineScroll}
          style={timelineContainerStyle}
        >
          <Timeline units={timelineUnits} chartWidth={CHART_WIDTH} unitWidth={UNIT_WIDTH} />
        </div>

        {/* Chart area - both scrolls */}
        <div 
          ref={chartScrollRef}
          data-gantt-chart-scroll="true"
          onScroll={handleChartScroll}
          style={chartAreaStyle}
        >
          <div 
            style={gridStyle}
            onClick={handleGridClick}
          >
            {/* Vertical grid lines */}
            <div style={gridLinesStyle}>
              {timelineUnits.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: `${UNIT_WIDTH}px`,
                    minWidth: `${UNIT_WIDTH}px`,
                    maxWidth: `${UNIT_WIDTH}px`,
                    borderRight: i < timelineUnits.length - 1 ? '1px solid #f3f4f6' : 'none',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>

            {/* Horizontal grid lines */}
            {flattenedTasks.map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${i * ROW_HEIGHT}px`,
                  height: `${ROW_HEIGHT}px`,
                  borderBottom: i < flattenedTasks.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              />
            ))}

            {/* Task bars */}
            {flattenedTasks.map((task, i) => (
              <TaskBar
                key={task.id}
                task={task}
                timelineStart={dateRange.start}
                timelineEnd={dateRange.end}
                chartWidth={CHART_WIDTH}
                rowHeight={ROW_HEIGHT}
                index={i}
                onTaskUpdate={handleTaskUpdate}
                onClick={onTaskClick}
                onDoubleClick={onTaskDoubleClick || (onTaskClick ? undefined : handleTaskDoubleClick)}
                getTaskColor={getTaskColor}
                config={config}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        initialDate={selectedDate}
        editingTask={editingTask}
        allTasks={tasks}
      />
    </div>
  )
}

export default GanttChart
