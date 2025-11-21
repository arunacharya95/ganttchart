# Subtasks Feature Guide

This guide explains how to use the hierarchical task (subtasks) feature in the gantt-react package.

## Table of Contents
- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Features](#features)
- [Advanced Examples](#advanced-examples)
- [API Reference](#api-reference)

## Overview

The subtasks feature allows you to organize tasks in a hierarchical structure with parent tasks and child tasks (subtasks). This is useful for:

- Breaking down large projects into smaller milestones
- Organizing work by teams or departments
- Creating multi-level project structures
- Managing complex dependencies

## Basic Usage

### Simple Parent-Child Structure

```tsx
import React, { useState } from 'react'
import { GanttChart, GanttTask } from 'gantt-react'

function SimpleSubtasksExample() {
  const [tasks] = useState<GanttTask[]>([
    {
      id: '1',
      name: 'Website Redesign',
      start: '2025-11-01',
      end: '2025-11-30',
      progress: 40,
      subtasks: [
        {
          id: '1-1',
          name: 'UI Design',
          start: '2025-11-01',
          end: '2025-11-10',
          progress: 100,
          parentId: '1'
        },
        {
          id: '1-2',
          name: 'Frontend Development',
          start: '2025-11-11',
          end: '2025-11-25',
          progress: 50,
          parentId: '1'
        },
        {
          id: '1-3',
          name: 'Content Migration',
          start: '2025-11-20',
          end: '2025-11-30',
          progress: 0,
          parentId: '1'
        }
      ]
    }
  ])

  return <GanttChart tasks={tasks} viewMode="day" height={600} />
}
```

## Features

### 1. Expand/Collapse

Parent tasks show an arrow icon (▶/▼) that allows users to expand or collapse subtasks:

- **▶**: Collapsed - subtasks are hidden
- **▼**: Expanded - subtasks are visible

```tsx
// Tasks start expanded by default
const task = {
  id: '1',
  name: 'Parent Task',
  start: '2025-11-01',
  end: '2025-11-30',
  isExpanded: true,  // Optional: control initial state
  subtasks: [...]
}
```

### 2. Visual Hierarchy

- **Task List**: Subtasks are indented (20px per level)
- **Task Bars**: 
  - Parent tasks have bold font and a subtle border
  - Subtasks are slightly transparent (90% opacity)
- **Background**: Subtasks have a light gray background in the task list

### 3. Multi-Level Nesting

You can nest subtasks within subtasks for complex project structures:

```tsx
const tasks = [
  {
    id: '1',
    name: 'Product Launch',
    start: '2025-11-01',
    end: '2025-12-31',
    subtasks: [
      {
        id: '1-1',
        name: 'Development Phase',
        start: '2025-11-01',
        end: '2025-11-30',
        parentId: '1',
        subtasks: [
          {
            id: '1-1-1',
            name: 'Backend API',
            start: '2025-11-01',
            end: '2025-11-15',
            parentId: '1-1'
          },
          {
            id: '1-1-2',
            name: 'Frontend UI',
            start: '2025-11-16',
            end: '2025-11-30',
            parentId: '1-1'
          }
        ]
      },
      {
        id: '1-2',
        name: 'Marketing Campaign',
        start: '2025-12-01',
        end: '2025-12-31',
        parentId: '1'
      }
    ]
  }
]
```

### 4. Interactive Task Creation

Users can create subtasks through the task modal:

1. Click on the chart to open the task modal
2. Fill in task details
3. Select a parent task from the dropdown (or leave as "None" for top-level)
4. Click "Add Task"

## Advanced Examples

### Example 1: Software Development Project

```tsx
const softwareProject: GanttTask[] = [
  {
    id: 'planning',
    name: 'Planning & Design',
    start: '2025-11-01',
    end: '2025-11-15',
    progress: 100,
    color: '#3b82f6',
    subtasks: [
      {
        id: 'requirements',
        name: 'Requirements Gathering',
        start: '2025-11-01',
        end: '2025-11-05',
        progress: 100,
        parentId: 'planning'
      },
      {
        id: 'design',
        name: 'System Design',
        start: '2025-11-06',
        end: '2025-11-15',
        progress: 100,
        parentId: 'planning'
      }
    ]
  },
  {
    id: 'development',
    name: 'Development',
    start: '2025-11-16',
    end: '2025-12-20',
    progress: 45,
    color: '#10b981',
    subtasks: [
      {
        id: 'backend',
        name: 'Backend Development',
        start: '2025-11-16',
        end: '2025-12-10',
        progress: 60,
        parentId: 'development',
        subtasks: [
          {
            id: 'api',
            name: 'REST API',
            start: '2025-11-16',
            end: '2025-11-30',
            progress: 80,
            parentId: 'backend'
          },
          {
            id: 'database',
            name: 'Database Schema',
            start: '2025-12-01',
            end: '2025-12-10',
            progress: 40,
            parentId: 'backend'
          }
        ]
      },
      {
        id: 'frontend',
        name: 'Frontend Development',
        start: '2025-12-01',
        end: '2025-12-20',
        progress: 30,
        parentId: 'development'
      }
    ]
  },
  {
    id: 'testing',
    name: 'Testing & QA',
    start: '2025-12-21',
    end: '2025-12-31',
    progress: 0,
    color: '#f59e0b'
  }
]
```

### Example 2: Editable Tasks with State Management

```tsx
import React, { useState } from 'react'
import { GanttChart, GanttTask, updateTaskInHierarchy, addSubtask } from 'gantt-react'

function EditableGanttExample() {
  const [tasks, setTasks] = useState<GanttTask[]>([...])

  const handleTaskUpdate = (updatedTasks: GanttTask[]) => {
    setTasks(updatedTasks)
  }

  const handleAddSubtask = (parentId: string) => {
    const newSubtask: GanttTask = {
      id: `subtask-${Date.now()}`,
      name: 'New Subtask',
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      progress: 0
    }
    
    const updatedTasks = addSubtask(tasks, parentId, newSubtask)
    setTasks(updatedTasks)
  }

  return (
    <div>
      <GanttChart
        tasks={tasks}
        onChange={handleTaskUpdate}
        viewMode="day"
        height={600}
      />
    </div>
  )
}
```

### Example 3: Custom Colors for Hierarchy Levels

```tsx
import { GanttChart, GanttTask, FlattenedTask } from 'gantt-react'

function ColorCodedHierarchy() {
  const [tasks] = useState<GanttTask[]>([...])

  const getTaskColor = (task: FlattenedTask) => {
    // Color by hierarchy level
    if ('level' in task) {
      switch (task.level) {
        case 0: return '#3b82f6' // Blue for top-level
        case 1: return '#10b981' // Green for first-level subtasks
        case 2: return '#f59e0b' // Orange for second-level
        default: return '#6b7280' // Gray for deeper levels
      }
    }
    return '#3b82f6'
  }

  return (
    <GanttChart
      tasks={tasks}
      getTaskColor={getTaskColor}
      viewMode="day"
    />
  )
}
```

## API Reference

### Types

#### GanttTask (Extended)

```typescript
interface GanttTask {
  id: string | number
  name: string
  start: string | Date
  end: string | Date
  status?: 'Not Started' | 'In Progress' | 'Done'
  progress?: number
  color?: string
  assignedTo?: string
  dependencies?: (string | number)[]
  
  // Subtask fields
  parentId?: string | number | null
  subtasks?: GanttTask[]
  isExpanded?: boolean
}
```

#### FlattenedTask

```typescript
interface FlattenedTask extends GanttTask {
  level: number         // Depth in hierarchy (0 = root)
  hasChildren: boolean  // Whether task has subtasks
  isVisible: boolean    // Whether task is currently visible
}
```

### Utility Functions

#### flattenTasks

Converts hierarchical task structure to flat array for rendering.

```typescript
flattenTasks(
  tasks: GanttTask[],
  expandedTaskIds?: Set<string | number>
): FlattenedTask[]
```

**Example:**
```tsx
const flattened = flattenTasks(tasks, new Set(['task-1', 'task-2']))
```

#### toggleTaskExpansion

Toggles a task's expansion state.

```typescript
toggleTaskExpansion(
  taskId: string | number,
  expandedTaskIds: Set<string | number>
): Set<string | number>
```

**Example:**
```tsx
const [expanded, setExpanded] = useState(new Set())
const newExpanded = toggleTaskExpansion('task-1', expanded)
setExpanded(newExpanded)
```

#### findTaskById

Finds a task by ID in hierarchical structure.

```typescript
findTaskById(
  tasks: GanttTask[],
  taskId: string | number
): GanttTask | null
```

**Example:**
```tsx
const task = findTaskById(tasks, 'task-1-2')
if (task) {
  console.log('Found:', task.name)
}
```

#### updateTaskInHierarchy

Updates a task anywhere in the hierarchy (immutable).

```typescript
updateTaskInHierarchy(
  tasks: GanttTask[],
  taskId: string | number,
  updates: Partial<GanttTask>
): GanttTask[]
```

**Example:**
```tsx
const updated = updateTaskInHierarchy(tasks, 'task-1', {
  progress: 100,
  status: 'Done'
})
setTasks(updated)
```

#### addSubtask

Adds a subtask to a parent task.

```typescript
addSubtask(
  tasks: GanttTask[],
  parentId: string | number,
  subtask: GanttTask
): GanttTask[]
```

**Example:**
```tsx
const newSubtask = {
  id: 'new-subtask',
  name: 'New Task',
  start: '2025-11-01',
  end: '2025-11-05',
  progress: 0
}

const updated = addSubtask(tasks, 'parent-1', newSubtask)
setTasks(updated)
```

#### getParentTaskOptions

Gets all available parent tasks (excluding a specific task to prevent circular references).

```typescript
getParentTaskOptions(
  tasks: GanttTask[],
  excludeTaskId?: string | number
): GanttTask[]
```

**Example:**
```tsx
const availableParents = getParentTaskOptions(tasks, currentTaskId)
```

#### getIndentation

Calculates indentation pixels for a given hierarchy level.

```typescript
getIndentation(
  level: number,
  indentSize?: number  // default: 20
): number
```

**Example:**
```tsx
const indent = getIndentation(2)  // Returns 40 (2 levels * 20px)
```

## Best Practices

1. **Consistent ID Structure**: Use a hierarchical ID pattern (e.g., '1', '1-1', '1-1-1') for easier debugging
2. **Set parentId**: Always set the `parentId` field on subtasks for proper relationship tracking
3. **Date Ranges**: Ensure parent task dates encompass all subtask dates
4. **Progress Calculation**: Consider auto-calculating parent task progress based on subtasks
5. **Limit Nesting**: Keep hierarchy depth reasonable (3-4 levels max) for better UX

## Troubleshooting

### Subtasks not appearing?
- Ensure parent task has `isExpanded: true` or user has expanded it
- Verify `parentId` matches the parent task's `id`
- Check that subtasks array is properly set

### Indentation not showing?
- The TaskList component handles indentation automatically
- Verify you're using the latest version of gantt-react

### Updates not reflecting?
- Use immutable update functions (`updateTaskInHierarchy`, `addSubtask`)
- Ensure you're updating state correctly in React

## Migration Guide

If you have existing flat task structures, you can migrate to hierarchical:

```tsx
// Before (flat)
const flatTasks = [
  { id: '1', name: 'Parent' },
  { id: '2', name: 'Child 1' },
  { id: '3', name: 'Child 2' }
]

// After (hierarchical)
const hierarchicalTasks = [
  {
    id: '1',
    name: 'Parent',
    subtasks: [
      { id: '2', name: 'Child 1', parentId: '1' },
      { id: '3', name: 'Child 2', parentId: '1' }
    ]
  }
]
```

## Examples Repository

For more examples, check out the `/example` directory in the package repository.
