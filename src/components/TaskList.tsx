import React from 'react'
import { TaskType } from '../types'
import { getDaysBetween } from '../utils'

type TaskListProps = {
  tasks: TaskType[]
  rowHeight: number
}

const TaskList: React.FC<TaskListProps> = ({ tasks, rowHeight }) => {
  return (
    <div>
      {tasks.map((task, i) => (
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
          }}
        >
          <span style={{ fontWeight: 500 }}>{task.name}</span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {getDaysBetween(new Date(task.start || task.startDate), new Date(task.end || task.endDate))}d
          </span>
        </div>
      ))}
    </div>
  )
}

export default TaskList
