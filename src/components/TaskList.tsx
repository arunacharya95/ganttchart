import React from 'react'
import { FlattenedTask } from '../types'
import { getDaysBetween, getIndentation } from '../utils'

type TaskListProps = {
  tasks: FlattenedTask[]
  rowHeight: number
  onToggleExpand?: (taskId: string | number) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, rowHeight, onToggleExpand }) => {
  return (
    <div>
      {tasks.map((task, i) => {
        const indentation = getIndentation(task.level)
        
        return (
          <div
            key={task.id}
            style={{
              height: `${rowHeight}px`,
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f3f4f6',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: task.level > 0 ? '#f9fafb' : '#fff',
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              paddingLeft: `${indentation}px`
            }}>
              {/* Expand/Collapse Icon */}
              {task.hasChildren && (
                <button
                  onClick={() => onToggleExpand?.(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    marginRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                    color: '#6b7280',
                  }}
                  title={task.isExpanded ? 'Collapse' : 'Expand'}
                >
                  {task.isExpanded ? '▼' : '▶'}
                </button>
              )}
              
              {/* Spacer for tasks without children (align with expanded/collapsed tasks) */}
              {!task.hasChildren && (
                <span style={{ width: '28px', display: 'inline-block' }} />
              )}
              
              {/* Task Name */}
              <span style={{ 
                fontWeight: task.hasChildren ? 600 : 500,
                color: task.hasChildren ? '#111827' : '#374151'
              }}>
                {task.name}
              </span>
            </div>
            
            {/* Duration */}
            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
              {getDaysBetween(new Date(task.start || task.startDate), new Date(task.end || task.endDate))}d
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default TaskList
