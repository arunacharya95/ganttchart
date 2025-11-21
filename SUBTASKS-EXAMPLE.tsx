import React, { useState } from 'react'
import { GanttChart } from '../src/components/GanttChart'
import type { GanttTask } from '../src/types'

/**
 * Example demonstrating the Subtasks feature
 * Shows a software development project with hierarchical task structure
 */
function SubtasksExample() {
  const [tasks, setTasks] = useState<GanttTask[]>([
    {
      id: 'phase-1',
      name: 'Planning & Design Phase',
      start: '2025-11-01',
      end: '2025-11-20',
      progress: 100,
      color: '#3b82f6',
      assignedTo: 'Project Manager',
      isExpanded: true,
      subtasks: [
        {
          id: 'phase-1-1',
          name: 'Requirements Gathering',
          start: '2025-11-01',
          end: '2025-11-08',
          progress: 100,
          assignedTo: 'Business Analyst',
          parentId: 'phase-1'
        },
        {
          id: 'phase-1-2',
          name: 'System Architecture Design',
          start: '2025-11-09',
          end: '2025-11-15',
          progress: 100,
          assignedTo: 'Tech Lead',
          parentId: 'phase-1'
        },
        {
          id: 'phase-1-3',
          name: 'UI/UX Design',
          start: '2025-11-10',
          end: '2025-11-20',
          progress: 100,
          assignedTo: 'Designer',
          parentId: 'phase-1'
        }
      ]
    },
    {
      id: 'phase-2',
      name: 'Development Phase',
      start: '2025-11-21',
      end: '2025-12-25',
      progress: 55,
      color: '#10b981',
      assignedTo: 'Development Team',
      isExpanded: true,
      subtasks: [
        {
          id: 'phase-2-1',
          name: 'Backend Development',
          start: '2025-11-21',
          end: '2025-12-15',
          progress: 70,
          assignedTo: 'Backend Team',
          parentId: 'phase-2',
          isExpanded: true,
          subtasks: [
            {
              id: 'phase-2-1-1',
              name: 'Database Schema',
              start: '2025-11-21',
              end: '2025-11-28',
              progress: 100,
              assignedTo: 'Database Engineer',
              parentId: 'phase-2-1'
            },
            {
              id: 'phase-2-1-2',
              name: 'REST API Development',
              start: '2025-11-29',
              end: '2025-12-10',
              progress: 80,
              assignedTo: 'Backend Developer',
              parentId: 'phase-2-1'
            },
            {
              id: 'phase-2-1-3',
              name: 'Authentication & Security',
              start: '2025-12-11',
              end: '2025-12-15',
              progress: 40,
              assignedTo: 'Security Engineer',
              parentId: 'phase-2-1'
            }
          ]
        },
        {
          id: 'phase-2-2',
          name: 'Frontend Development',
          start: '2025-12-01',
          end: '2025-12-20',
          progress: 50,
          assignedTo: 'Frontend Team',
          parentId: 'phase-2',
          isExpanded: true,
          subtasks: [
            {
              id: 'phase-2-2-1',
              name: 'Component Library Setup',
              start: '2025-12-01',
              end: '2025-12-05',
              progress: 100,
              assignedTo: 'Frontend Lead',
              parentId: 'phase-2-2'
            },
            {
              id: 'phase-2-2-2',
              name: 'Page Development',
              start: '2025-12-06',
              end: '2025-12-15',
              progress: 60,
              assignedTo: 'Frontend Developers',
              parentId: 'phase-2-2'
            },
            {
              id: 'phase-2-2-3',
              name: 'API Integration',
              start: '2025-12-16',
              end: '2025-12-20',
              progress: 20,
              assignedTo: 'Frontend Developers',
              parentId: 'phase-2-2'
            }
          ]
        },
        {
          id: 'phase-2-3',
          name: 'Mobile App Development',
          start: '2025-12-10',
          end: '2025-12-25',
          progress: 30,
          assignedTo: 'Mobile Team',
          parentId: 'phase-2'
        }
      ]
    },
    {
      id: 'phase-3',
      name: 'Testing & QA Phase',
      start: '2025-12-26',
      end: '2026-01-10',
      progress: 0,
      color: '#f59e0b',
      assignedTo: 'QA Team',
      isExpanded: true,
      subtasks: [
        {
          id: 'phase-3-1',
          name: 'Unit Testing',
          start: '2025-12-26',
          end: '2025-12-30',
          progress: 0,
          assignedTo: 'Developers',
          parentId: 'phase-3'
        },
        {
          id: 'phase-3-2',
          name: 'Integration Testing',
          start: '2026-01-01',
          end: '2026-01-05',
          progress: 0,
          assignedTo: 'QA Engineers',
          parentId: 'phase-3'
        },
        {
          id: 'phase-3-3',
          name: 'User Acceptance Testing',
          start: '2026-01-06',
          end: '2026-01-10',
          progress: 0,
          assignedTo: 'Product Owner',
          parentId: 'phase-3'
        }
      ]
    },
    {
      id: 'phase-4',
      name: 'Deployment & Launch',
      start: '2026-01-11',
      end: '2026-01-20',
      progress: 0,
      color: '#8b5cf6',
      assignedTo: 'DevOps Team',
      isExpanded: false,
      subtasks: [
        {
          id: 'phase-4-1',
          name: 'Production Environment Setup',
          start: '2026-01-11',
          end: '2026-01-13',
          progress: 0,
          assignedTo: 'DevOps Engineer',
          parentId: 'phase-4'
        },
        {
          id: 'phase-4-2',
          name: 'Deploy to Production',
          start: '2026-01-14',
          end: '2026-01-15',
          progress: 0,
          assignedTo: 'DevOps Team',
          parentId: 'phase-4'
        },
        {
          id: 'phase-4-3',
          name: 'Post-Launch Monitoring',
          start: '2026-01-16',
          end: '2026-01-20',
          progress: 0,
          assignedTo: 'Support Team',
          parentId: 'phase-4'
        }
      ]
    }
  ])

  const handleTaskUpdate = (updatedTasks: GanttTask[]) => {
    console.log('Tasks updated:', updatedTasks)
    setTasks(updatedTasks)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Software Development Project - Gantt Chart with Subtasks
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Click the arrow icons (▶/▼) to expand/collapse subtasks. 
          Double-click tasks to edit. Try creating new subtasks!
        </p>
      </div>

      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <GanttChart
          tasks={tasks}
          onChange={handleTaskUpdate}
          viewMode="day"
          height={700}
          config={{
            showWeekends: true,
            showTodayLine: true,
            showGridLines: true
          }}
        />
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          Subtasks Feature Highlights
        </h2>
        <ul style={{ color: '#374151', fontSize: '14px', lineHeight: '1.8' }}>
          <li><strong>Hierarchical Structure:</strong> Tasks organized in parent-child relationships</li>
          <li><strong>Expand/Collapse:</strong> Click arrow icons to show/hide subtasks</li>
          <li><strong>Visual Indicators:</strong> Parent tasks are bold with borders, subtasks are indented</li>
          <li><strong>Multi-level Nesting:</strong> Supports deeply nested task hierarchies</li>
          <li><strong>Interactive Creation:</strong> Create subtasks via the task modal</li>
          <li><strong>Progress Tracking:</strong> Track progress at each level of the hierarchy</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
          💡 Try These Features:
        </h3>
        <ul style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.6', margin: 0 }}>
          <li>Expand "Development Phase" to see nested backend and frontend tasks</li>
          <li>Collapse "Deployment & Launch" to hide its subtasks</li>
          <li>Double-click any task to edit and change its parent task</li>
          <li>Click on the chart background to create a new task with a parent</li>
        </ul>
      </div>
    </div>
  )
}

export default SubtasksExample
