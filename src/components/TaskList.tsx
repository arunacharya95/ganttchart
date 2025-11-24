import React from 'react'
import { FlattenedTask, TaskListColumn } from '../types'
import { getIndentation } from '../utils'

type TaskListProps = {
  tasks: FlattenedTask[]
  rowHeight: number
  onToggleExpand?: (taskId: string | number) => void
  columns?: TaskListColumn[]
  headerHeight?: number
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  rowHeight, 
  onToggleExpand,
  columns,
  headerHeight = 40
}) => {
  // Default column if none provided
  const cols = columns || [{ id: 'name', label: 'Task Name', width: 280 }];

  return (
    <div style={{ minWidth: 'fit-content' }}>
      {/* Header Row - rendered by parent usually, but we can render it here if we want sticky headers inside the scrollable area */}
      {/* Actually, GanttChart.tsx renders the header separately. We should probably just render the rows here to match existing structure, 
          OR update GanttChart to let TaskList handle the header. 
          Looking at GanttChart.tsx, it renders a header div. Let's stick to rendering rows here, 
          but we need to know the columns to render the cells correctly. 
      */}
      
      {tasks.map((task) => {
        const isParent = task.hasChildren
        
        return (
          <div
            key={task.id}
            style={{
              height: `${rowHeight}px`,
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '13px',
              color: '#1f2937',
              backgroundColor: isParent ? '#f0f9ff' : (task.level > 0 ? '#fafafa' : '#fff'),
            }}
          >
            {cols.map((col, index) => {
              const isTreeColumn = index === 0;
              const width = col.width || 100;
              
              return (
                <div 
                  key={`${task.id}-${col.id}`}
                  style={{
                    width: `${width}px`,
                    minWidth: `${width}px`,
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRight: '1px solid #f3f4f6',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {isTreeColumn ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      flex: 1,
                      paddingLeft: `${getIndentation(task.level)}px`,
                      gap: '8px',
                      overflow: 'hidden'
                    }}>
                      {/* Checkbox */}
                      <input 
                        type="checkbox" 
                        style={{
                          width: '14px',
                          height: '14px',
                          cursor: 'pointer',
                          accentColor: '#3b82f6',
                          flexShrink: 0
                        }}
                      />
                      
                      {/* Expand/Collapse Icon */}
                      <div style={{ width: '16px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                        {isParent && (
                          <button
                            onClick={() => onToggleExpand?.(task.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '10px',
                              color: '#6b7280',
                            }}
                            title={task.isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {task.isExpanded ? '▼' : '▶'}
                          </button>
                        )}
                      </div>
                      
                      {/* Content */}
                      <span style={{ 
                        fontWeight: isParent ? 600 : 400,
                        color: isParent ? '#1e40af' : '#374151',
                        fontSize: '13px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {col.render ? col.render(task) : task[col.id as keyof FlattenedTask]}
                      </span>
                    </div>
                  ) : (
                    // Regular column
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {col.render ? col.render(task) : task[col.id as keyof FlattenedTask]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )
      })}
    </div>
  )
}

export default TaskList
