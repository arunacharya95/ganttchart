# gantt-react

A lightweight, interactive React Gantt chart component library built with TypeScript.

## Features

- 📅 **Interactive Timeline**: View tasks across days, weeks, or months
- 📊 **Task Bars**: Visual representation of task duration and progress
- 🌳 **Hierarchical Tasks**: Support for parent tasks and subtasks with expand/collapse
- 🎨 **Custom Colors**: Set task bar colors based on progress, status, or custom logic
- 🖱️ **Smooth Scrolling**: Independent horizontal (dates) and vertical (tasks) scrolling
- 📝 **TypeScript**: Full type definitions included
- ⚡ **Lightweight**: Minimal dependencies
- 🎨 **Customizable**: Easy to style and extend
- ⚛️ **React 18**: Built for modern React

## Installation

```bash
npm install gantt-react
```

## Usage

```tsx
import React, { useState } from 'react'
import { GanttChart } from 'gantt-react'
import type { Task } from 'gantt-react'

function App() {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Project Planning',
      startDate: '2025-11-01',
      endDate: '2025-11-10',
      progress: 100
    },
    {
      id: '2',
      name: 'Development Phase',
      startDate: '2025-11-11',
      endDate: '2025-11-30',
      progress: 60
    },
    {
      id: '3',
      name: 'Testing',
      startDate: '2025-12-01',
      endDate: '2025-12-15',
      progress: 30
    }
  ])

  return (
    <div>
      <h1>Project Timeline</h1>
      <GanttChart 
        tasks={tasks} 
        viewMode="day"
        height={600}
      />
    </div>
  )
}
```

## Subtasks & Hierarchical Tasks

The Gantt chart supports hierarchical task structures with parent tasks and subtasks. This is useful for breaking down large projects into smaller, manageable pieces.

### Basic Subtask Structure

```tsx
import React, { useState } from 'react'
import { GanttChart } from 'gantt-react'
import type { GanttTask } from 'gantt-react'

function App() {
  const [tasks] = useState<GanttTask[]>([
    {
      id: '1',
      name: 'Project Phase 1',
      start: '2025-11-01',
      end: '2025-11-30',
      progress: 50,
      subtasks: [
        {
          id: '1-1',
          name: 'Design',
          start: '2025-11-01',
          end: '2025-11-10',
          progress: 100,
          parentId: '1'
        },
        {
          id: '1-2',
          name: 'Development',
          start: '2025-11-11',
          end: '2025-11-25',
          progress: 60,
          parentId: '1'
        },
        {
          id: '1-3',
          name: 'Testing',
          start: '2025-11-26',
          end: '2025-11-30',
          progress: 0,
          parentId: '1'
        }
      ]
    },
    {
      id: '2',
      name: 'Project Phase 2',
      start: '2025-12-01',
      end: '2025-12-31',
      progress: 0,
      subtasks: [
        {
          id: '2-1',
          name: 'Marketing Campaign',
          start: '2025-12-01',
          end: '2025-12-15',
          progress: 0,
          parentId: '2'
        },
        {
          id: '2-2',
          name: 'Launch',
          start: '2025-12-20',
          end: '2025-12-31',
          progress: 0,
          parentId: '2'
        }
      ]
    }
  ])

  return (
    <div>
      <h1>Project Timeline with Subtasks</h1>
      <GanttChart tasks={tasks} viewMode="day" height={600} />
    </div>
  )
}
```

### Features of Hierarchical Tasks

- **Expand/Collapse**: Click the arrow icon next to parent tasks to show/hide subtasks
- **Visual Differentiation**: 
  - Parent tasks have a bold font and border
  - Subtasks are slightly transparent and indented in the task list
- **Indentation**: Task list shows hierarchy with automatic indentation
- **Multi-level Nesting**: Support for deeply nested subtasks (subtasks can have their own subtasks)

### Adding Subtasks Dynamically

You can add subtasks through the task modal by selecting a parent task:

```tsx
function App() {
  const [tasks, setTasks] = useState<GanttTask[]>([...])

  const handleTaskUpdate = (updatedTasks: GanttTask[]) => {
    setTasks(updatedTasks)
  }

  return (
    <GanttChart
      tasks={tasks}
      onChange={handleTaskUpdate}
      viewMode="day"
    />
  )
}
```

When creating or editing a task, you can:
1. Select "None" to create a top-level task
2. Select any existing task to make the new/edited task a subtask

### Programmatically Managing Subtasks

Use the utility functions to manage hierarchical tasks:

```tsx
import { addSubtask, findTaskById, updateTaskInHierarchy } from 'gantt-react'

// Add a subtask to a parent
const updatedTasks = addSubtask(tasks, parentId, newSubtask)

// Find a task by ID in hierarchy
const task = findTaskById(tasks, taskId)

// Update a task anywhere in the hierarchy
const updatedTasks = updateTaskInHierarchy(tasks, taskId, { progress: 100 })
```

## API

### `<GanttChart />`

Main Gantt chart component with synchronized scrolling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tasks` | `Task[]` | Required | Array of task objects |
| `onChange` | `(tasks: Task[]) => void` | - | Callback when tasks change (future drag-drop) |
| `config` | `GanttConfig` | - | Configuration object for colors, palette, and behavior |
| `getTaskColor` | `(task: Task) => string` | - | Function to dynamically determine task bar color |
| `viewMode` | `'day' \| 'week' \| 'month'` | `'day'` | Timeline granularity |
| `locale` | `string` | `'en-US'` | Locale for date formatting |
| `height` | `number` | `600` | Chart height in pixels |

### Types

```typescript
type Task = {
  id: string
  name: string
  startDate: string  // ISO date string or parseable date
  endDate: string
  progress?: number  // 0-100
  color?: string     // Custom color for task bar (CSS color value)
  dependencies?: string[]  // Array of task IDs (future feature)
  parentId?: string | number | null  // Parent task ID for subtasks
  subtasks?: Task[]  // Array of child tasks
  isExpanded?: boolean  // Whether parent task shows its subtasks
}

type GanttConfig = {
  dayWidth?: number
  rowHeight?: number
  monthsToShow?: number
  showWeekends?: boolean
  enableDragDrop?: boolean
  enableResize?: boolean
  showGridLines?: boolean
  showTodayLine?: boolean
  colorPalette?: TaskColorPalette
  statusColors?: Record<string, string>
  assigneeColors?: Record<string, string>
}

type TaskColorPalette = {
  preset?: 'default' | 'vivid' | 'pastel' | 'warm' | 'cool' | 'earth' | 'ocean' | 'forest'
  colors?: string[]
  completed?: string
  inProgress?: string
  notStarted?: string
}

type ViewMode = 'day' | 'week' | 'month'
```

## Features

### Scrolling

- **Horizontal Scroll**: Navigate through dates/timeline
- **Vertical Scroll**: Browse through task list
- **Synchronized Scrolling**: Task list and chart scroll together vertically
- **Timeline Sync**: Timeline header scrolls with chart horizontally

### Visual Elements

- Task bars with progress indicators
- Grid lines for date/task alignment
- Hover effects on tasks
- Responsive task labels

### Color Customization

You can customize task bar colors in three ways (in order of priority):

#### 1. Direct Color Property
Set a `color` property directly on each task:

```tsx
const tasks = [
  {
    id: '1',
    name: 'Critical Task',
    startDate: '2025-11-01',
    endDate: '2025-11-10',
    color: '#ef4444' // Red
  },
  {
    id: '2',
    name: 'Normal Task',
    startDate: '2025-11-11',
    endDate: '2025-11-20',
    color: '#3b82f6' // Blue
  }
]
```

#### 2. Configuration-Based Colors

Use the `config` prop to set colors by status, assignee, or use predefined palettes:

**Predefined Palettes** (8 themes available):

```tsx
<GanttChart
  tasks={tasks}
  config={{
    colorPalette: {
      preset: 'vivid' // 'default' | 'vivid' | 'pastel' | 'warm' | 'cool' | 'earth' | 'ocean' | 'forest'
    }
  }}
/>
```

**Custom Color Array** (cycles through colors):

```tsx
<GanttChart
  tasks={tasks}
  config={{
    colorPalette: {
      colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    }
  }}
/>
```

**Progress-Based Colors**:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    colorPalette: {
      completed: '#22c55e',   // 100% complete
      inProgress: '#f59e0b',  // 1-99%
      notStarted: '#94a3b8'   // 0%
    }
  }}
/>
```

**Status-Based Colors**:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    statusColors: {
      'Done': '#22c55e',
      'In Progress': '#3b82f6',
      'Not Started': '#6b7280',
      'Blocked': '#ef4444'
    }
  }}
/>
```

**Assignee-Based Colors**:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    assigneeColors: {
      'Alice': '#ef4444',
      'Bob': '#3b82f6',
      'Charlie': '#10b981'
    }
  }}
/>
```

#### 3. Dynamic Color Function
Use the `getTaskColor` prop to dynamically determine colors based on task properties:

```tsx
<GanttChart
  tasks={tasks}
  getTaskColor={(task) => {
    // Color based on progress
    if (task.progress === 100) return '#10b981' // Green
    if (task.progress > 50) return '#3b82f6'    // Blue
    if (task.progress > 0) return '#f59e0b'     // Orange
    return '#6b7280'                             // Gray
  }}
/>
```

```tsx
// Color based on status
<GanttChart
  tasks={tasks}
  getTaskColor={(task) => {
    switch(task.status) {
      case 'Done': return '#10b981'        // Green
      case 'In Progress': return '#3b82f6' // Blue
      case 'Not Started': return '#6b7280' // Gray
      default: return '#8b5cf6'            // Purple
    }
  }}
/>
```

```tsx
// Color based on assignee
<GanttChart
  tasks={tasks}
  getTaskColor={(task) => {
    const colors = {
      'John': '#ef4444',
      'Jane': '#3b82f6',
      'Bob': '#10b981'
    }
    return colors[task.assignedTo] || '#6b7280'
  }}
/>
```

#### 4. Default Progress-Based Colors
If no color is specified, the component uses default colors based on progress:
- **100% complete**: Green (#10b981)
- **1-99% complete**: Blue (#3b82f6)
- **0% or undefined**: Gray (#6b7280)

**For detailed examples and all 8 palette previews, see [COLOR-CONFIGURATION-GUIDE.md](COLOR-CONFIGURATION-GUIDE.md)**

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## Requirements

- React >= 18.0.0
- react-dom >= 18.0.0

## Roadmap

- [ ] Drag to resize task duration
- [ ] Drag to move tasks
- [ ] Task dependencies visualization
- [ ] Milestone markers
- [x] Custom task colors
- [x] Hierarchical tasks with subtasks
- [ ] Zoom in/out timeline
- [ ] Export to image/PDF
- [ ] Touch/mobile support

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
# ganttchart
