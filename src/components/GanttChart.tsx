import React, { useMemo, useRef, useState } from 'react'
import { GanttChartProps, Task, FlattenedTask, TaskDependency } from '../types'
import { getDateRange, generateTimeline, flattenTasks, toggleTaskExpansion, calculateCriticalPath, calculateTaskPosition, autoScheduleTasks } from '../utils'
import Timeline from './Timeline'
import TaskList from './TaskList'
import TaskBar from './TaskBar'
import TaskModal from './TaskModal'
import DependencyLines from './DependencyLines'

export const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  dependencies,
  onChange,
  onTaskClick,
  onTaskDoubleClick,
  getTaskColor,
  config,
  viewMode = 'day',
  locale = 'en-US',
  height = 600,
  onTaskUpdate,
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
  const [filterText, setFilterText] = useState('')
  const [currentViewMode, setCurrentViewMode] = useState(viewMode)

  // Update view mode when prop changes
  React.useEffect(() => {
    setCurrentViewMode(viewMode)
  }, [viewMode])

  // Apply critical path calculation and filtering
  const processedTasks = useMemo(() => {
    let result = tasks;
    
    // Simple filter implementation - if filter text exists, filter tasks
    // Note: This is a basic filter. For complex hierarchy filtering, more logic is needed.
    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      const filterRecursive = (taskList: Task[]): Task[] => {
        return taskList.filter(t => {
          const match = t.name.toLowerCase().includes(lowerFilter);
          const subtasks = t.subtasks ? filterRecursive(t.subtasks) : [];
          return match || subtasks.length > 0;
        }).map(t => ({
          ...t,
          subtasks: t.subtasks ? filterRecursive(t.subtasks) : undefined,
          isExpanded: true // Auto-expand on filter
        }));
      };
      result = filterRecursive(result);
    }

    if (config?.showCriticalPath) {
      return calculateCriticalPath(result)
    }
    return result
  }, [tasks, config?.showCriticalPath, filterText])

  // Flatten tasks for rendering (maintains hierarchy info)
  const flattenedTasks = useMemo(() => flattenTasks(processedTasks, expandedTaskIds), [processedTasks, expandedTaskIds])

  const dateRange = useMemo(() => getDateRange(flattenedTasks), [flattenedTasks])
  const timelineUnits = useMemo(() => 
    generateTimeline(dateRange.start, dateRange.end, currentViewMode), 
    [dateRange, currentViewMode]
  )

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "gantt-data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

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
    
    // 1. Call onTaskUpdate prop if available
    if (onTaskUpdate) {
      onTaskUpdate(taskId, updates)
    }

    // 2. Call onChange prop if available (legacy support)
    if (onChange) {
      let updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          // If task uses startDate/endDate format, convert updates to that format
          if ('startDate' in t) {
            const updatedTask: any = { ...t }
            
            // Apply all updates
            Object.keys(updates).forEach(key => {
              if (key === 'start' && updates.start) {
                updatedTask.startDate = updates.start
                updatedTask.start = updates.start
              } else if (key === 'end' && updates.end) {
                updatedTask.endDate = updates.end
                updatedTask.end = updates.end
              } else {
                updatedTask[key] = (updates as any)[key]
              }
            })
            return updatedTask
          }
          // Default: just merge updates
          return { ...t, ...updates }
        }
        return t
      })
      
      // Apply auto-scheduling if enabled
      if (config?.autoSchedule) {
        updatedTasks = autoScheduleTasks(
          updatedTasks,
          dependencies || [],
          taskId,
          config.holidays,
          config.showWeekends
        );
      }
      
      onChange(updatedTasks)
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

  const columns = config?.columns || [{ id: 'name', label: 'Task Name', width: 280 }];
  const taskListWidth = columns.reduce((sum, col) => sum + (col.width || 100), 0);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#fff',
    height: height,
    position: 'relative'
  }
  
  const mainContainerStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  }
  
  const taskListContainerStyle: React.CSSProperties = {
    width: taskListWidth,
    borderRight: '1px solid #d1d5db',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  }

  const taskListHeaderStyle: React.CSSProperties = {
    height: 84, // Match timeline height (32 + 24 + 28)
    borderBottom: '2px solid #d1d5db',
    background: '#f9fafb',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0 0 8px 0', // Removed horizontal padding to align with cells
    fontSize: '11px',
    color: '#6b7280',
    flexShrink: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
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

  const toolbarStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  }

  const toolbarGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  }

  const inputStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    width: '200px',
    outline: 'none'
  }

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s'
  }

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6'
  }

  return (
    <div style={containerStyle}>
      {/* Toolbar */}
      <div style={toolbarStyle}>
        <div style={toolbarGroupStyle}>
          <input 
            type="text" 
            placeholder="Filter tasks..." 
            style={inputStyle}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button style={buttonStyle} onClick={handleExport} title="Export to JSON">
            Export
          </button>
        </div>
        
        <div style={toolbarGroupStyle}>
          <button 
            style={currentViewMode === 'day' ? activeButtonStyle : buttonStyle} 
            onClick={() => setCurrentViewMode('day')}
          >
            Day
          </button>
          <button 
            style={currentViewMode === 'week' ? activeButtonStyle : buttonStyle} 
            onClick={() => setCurrentViewMode('week')}
          >
            Week
          </button>
          <button 
            style={currentViewMode === 'month' ? activeButtonStyle : buttonStyle} 
            onClick={() => setCurrentViewMode('month')}
          >
            Month
          </button>
          <button 
            style={currentViewMode === 'quarter' ? activeButtonStyle : buttonStyle} 
            onClick={() => setCurrentViewMode('quarter')}
          >
            Quarter
          </button>
          <button 
            style={activeButtonStyle}
            onClick={() => {
              const today = new Date()
              // Scroll to today logic
              if (timelineScrollRef.current) {
                // Simple approximation for now
                timelineScrollRef.current.scrollLeft = 0;
              }
            }}
          >
            Today
          </button>
        </div>
      </div>
      
      <div style={mainContainerStyle}>
        {/* Left side: Task List */}
        <div style={taskListContainerStyle}>
          <div style={taskListHeaderStyle}>
            {columns.map(col => (
              <div 
                key={col.id} 
                style={{ 
                  width: col.width || 100, 
                  minWidth: col.width || 100,
                  padding: '0 8px', 
                  boxSizing: 'border-box',
                  borderRight: '1px solid #e5e7eb',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {col.label}
              </div>
            ))}
          </div>
          <div 
            ref={listScrollRef}
            onScroll={handleListScroll}
            style={taskListScrollStyle}
          >
            <TaskList 
              tasks={flattenedTasks} 
              rowHeight={ROW_HEIGHT} 
              onToggleExpand={handleToggleExpand} 
              columns={columns}
            />
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
            
            {/* Dependency lines */}
            {(config?.showDependencies !== false) && (
              <DependencyLines
                tasks={flattenedTasks}
                dependencies={dependencies}
                getTaskPosition={(taskId) => {
                  const taskIndex = flattenedTasks.findIndex(t => t.id === taskId);
                  if (taskIndex === -1) return null;
                  const task = flattenedTasks[taskIndex];
                  const { left, width } = calculateTaskPosition(task, dateRange.start, dateRange.end, CHART_WIDTH);
                  return {
                    left,
                    width,
                    top: taskIndex * ROW_HEIGHT + 10,
                    height: ROW_HEIGHT - 20
                  };
                }}
                style={config?.dependencyStyle}
                color={config?.dependencyColor}
                thickness={config?.dependencyThickness}
                showLabels={config?.showDependencyLabels}
                criticalPathEnabled={config?.showCriticalPath}
                criticalPathColor={config?.criticalPathColor}
              />
            )}
          </div>
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
