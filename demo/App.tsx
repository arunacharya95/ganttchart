import React, { useState } from 'react'
import { GanttChart } from '../src/components/GanttChart'
import type { GanttTask, TaskDependency } from '../src/types'
import { autoScheduleTasks } from '../src/utils'
import './demo.css'

function App() {
  const [tasks, setTasks] = useState<GanttTask[]>([
    {
      id: '1',
      name: 'Project Planning',
      start: '2025-11-01',
      end: '2025-11-10',
      progress: 100,
      status: 'Done',
      baseline: {
        start: '2025-11-01',
        end: '2025-11-08'
      },
      subtasks: [
        {
          id: '1-1',
          name: 'Requirements Gathering',
          start: '2025-11-01',
          end: '2025-11-05',
          progress: 100,
          status: 'Done',
          parentId: '1'
        },
        {
          id: '1-2',
          name: 'Technical Design',
          start: '2025-11-06',
          end: '2025-11-10',
          progress: 100,
          status: 'Done',
          parentId: '1'
        }
      ]
    },
    {
      id: '2',
      name: 'Development Phase',
      start: '2025-11-11',
      end: '2025-11-30',
      progress: 60,
      status: 'In Progress',
      baseline: {
        start: '2025-11-11',
        end: '2025-11-28'
      },
      subtasks: [
        {
          id: '2-1',
          name: 'Frontend Development',
          start: '2025-11-11',
          end: '2025-11-25',
          progress: 75,
          status: 'In Progress',
          parentId: '2'
        },
        {
          id: '2-2',
          name: 'Backend Development',
          start: '2025-11-11',
          end: '2025-11-30',
          progress: 50,
          status: 'In Progress',
          parentId: '2',
          isLocked: true
        },
        {
          id: '2-3',
          name: 'Database Setup',
          start: '2025-11-11',
          end: '2025-11-15',
          progress: 100,
          status: 'Done',
          parentId: '2'
        }
      ]
    },
    {
      id: '3',
      name: 'Testing & QA',
      start: '2025-12-01',
      end: '2025-12-15',
      progress: 30,
      status: 'In Progress',
      baseline: {
        start: '2025-12-01',
        end: '2025-12-12'
      },
      subtasks: [
        {
          id: '3-1',
          name: 'Unit Testing',
          start: '2025-12-01',
          end: '2025-12-08',
          progress: 50,
          status: 'In Progress',
          parentId: '3'
        },
        {
          id: '3-2',
          name: 'Integration Testing',
          start: '2025-12-09',
          end: '2025-12-15',
          progress: 0,
          status: 'Not Started',
          parentId: '3'
        }
      ]
    },
    {
      id: '4',
      name: 'Deployment',
      start: '2025-12-16',
      end: '2025-12-20',
      progress: 0,
      status: 'Not Started'
    }
  ])

  const [dependencies] = useState<TaskDependency[]>([
    { from: '1', to: '2', type: 'FS' },           // Planning -> Development (Finish-to-Start)
    { from: '2', to: '3', type: 'FS' },           // Development -> Testing (Finish-to-Start)
    { from: '3', to: '4', type: 'FS' },           // Testing -> Deployment (Finish-to-Start)
    { from: '1-1', to: '1-2', type: 'FS' },       // Requirements -> Design (Finish-to-Start)
    { from: '2-3', to: '2-1', type: 'SS' },       // Database -> Frontend (Start-to-Start)
    { from: '3-1', to: '3-2', type: 'FS' },       // Unit -> Integration (Finish-to-Start)
  ])

  const handleTaskUpdate = (taskId: string | number, updates: Partial<GanttTask>) => {
    console.log('Task updated:', taskId, updates)
    setTasks(prevTasks => {
      const updateTaskRecursive = (taskList: GanttTask[]): GanttTask[] => {
        return taskList.map(task => {
          if (task.id === taskId) {
            return { ...task, ...updates }
          }
          if (task.subtasks) {
            return { ...task, subtasks: updateTaskRecursive(task.subtasks) }
          }
          return task
        })
      }
      
      const updatedTasks = updateTaskRecursive(prevTasks)
      
      // Apply auto-scheduling
      return autoScheduleTasks(
        updatedTasks,
        dependencies,
        taskId,
        ['2025-12-25', '2026-01-01'], // holidays
        true // showWeekends
      )
    })
  }

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <GanttChart
          tasks={tasks}
          dependencies={dependencies}
          onTaskUpdate={handleTaskUpdate}
          config={{
            autoSchedule: true,
            holidays: ['2025-12-25', '2026-01-01'],
            columns: [
              { id: 'name', label: 'Task Name', width: 250 },
              { id: 'status', label: 'Status', width: 100, render: (task) => (
                <span style={{ 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '11px',
                  backgroundColor: task.status === 'Done' ? '#dcfce7' : task.status === 'In Progress' ? '#dbeafe' : '#f3f4f6',
                  color: task.status === 'Done' ? '#166534' : task.status === 'In Progress' ? '#1e40af' : '#374151'
                }}>
                  {task.status}
                </span>
              )},
              { id: 'progress', label: '%', width: 60, render: (task) => <span>{task.progress}%</span> }
            ],
            colorPalette: {
              preset: 'vivid'
            },
            dayWidth: 40,
            rowHeight: 50,
            monthsToShow: 3,
            showWeekends: true,
            showGridLines: true,
            showTodayLine: true,
            showDependencies: true,
            dependencyStyle: 'curved',
            dependencyColor: '#64748b',
            dependencyThickness: 2,
            showDependencyLabels: true,
            showCriticalPath: true,
            criticalPathColor: '#ef4444',
            showBaseline: true,
            baselineOpacity: 0.6,
            showMilestones: true,
            milestoneColor: '#f59e0b'
          }}
          viewMode="day"
          height={700}
        />
      </div>
    </div>
  )
}

export default App
