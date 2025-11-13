# @your-org/gantt-react

A powerful, feature-rich Gantt Chart component for React with TypeScript and Material-UI.

## Features

- 📅 Interactive timeline with drag-and-drop task scheduling
- 🎨 Beautiful Material-UI design
- 📊 Progress tracking with visual indicators
- 🔗 Task dependencies
- ✏️ Click-to-edit functionality
- 🎯 TypeScript support with full type definitions
- 📦 Works with any data array

## Installation

```bash
npm install @your-org/gantt-react @mui/material @emotion/react @emotion/styled date-fns
```

## Quick Start

```tsx
import { GanttChart } from '@your-org/gantt-react';
import type { GanttTask } from '@your-org/gantt-react';

function App() {
  const tasks: GanttTask[] = [
    {
      id: '1',
      name: 'Project Planning',
      start: '2024-01-01',
      end: '2024-01-15',
      status: 'Done',
      progress: 100,
      assignedTo: 'John Doe'
    },
    {
      id: '2',
      name: 'Development',
      start: '2024-01-16',
      end: '2024-02-28',
      status: 'In Progress',
      progress: 45,
      assignedTo: 'Jane Smith',
      dependencies: ['1']
    }
  ];

  const handleTaskUpdate = (taskId, updates) => {
    console.log('Task updated:', taskId, updates);
    // Update your state/backend here
  };

  return (
    <GanttChart
      tasks={tasks}
      onTaskUpdate={handleTaskUpdate}
      config={{
        dayWidth: 40,
        showWeekends: true,
        enableDragDrop: true,
        enableEdit: true
      }}
    />
  );
}
```

## Props

### GanttChartProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tasks` | `GanttTask[]` | **required** | Array of tasks to display |
| `config` | `GanttConfig` | `{}` | Configuration options |
| `onTaskUpdate` | `(taskId, updates) => void` | `undefined` | Callback when task is updated |
| `onTaskClick` | `(task) => void` | `undefined` | Callback when task is clicked |
| `enableEdit` | `boolean` | `true` | Enable click-to-edit |
| `height` | `string \| number` | `'auto'` | Chart container height |
| `showTaskList` | `boolean` | `true` | Show task list on left |
| `taskListWidth` | `number` | `320` | Task list column width |

### GanttTask

```typescript
interface GanttTask {
  id: string | number;
  name: string;
  start: string | Date;
  end: string | Date;
  status?: 'Not Started' | 'In Progress' | 'Done';
  progress?: number; // 0-100
  assignedTo?: string;
  dependencies?: (string | number)[];
}
```

### GanttConfig

```typescript
interface GanttConfig {
  dayWidth?: number; // default: 40
  rowHeight?: number; // default: 50
  monthsToShow?: number; // default: 12
  showWeekends?: boolean; // default: true
  enableDragDrop?: boolean; // default: true
  enableResize?: boolean; // default: true
  showGridLines?: boolean; // default: true
  showTodayLine?: boolean; // default: true
}
```

## Usage Examples

### With State Management

```tsx
import { useState } from 'react';
import { GanttChart, GanttTask } from '@your-org/gantt-react';

function ProjectManager() {
  const [tasks, setTasks] = useState<GanttTask[]>([
    // your tasks
  ]);

  const handleUpdate = (taskId: string | number, updates: Partial<GanttTask>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  return <GanttChart tasks={tasks} onTaskUpdate={handleUpdate} />;
}
```

### With API Integration

```tsx
const handleUpdate = async (taskId, updates) => {
  try {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    // Update local state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  } catch (error) {
    console.error('Failed to update task:', error);
  }
};
```

## Features

### Drag and Drop
Tasks can be dragged horizontally to reschedule them. The `onTaskUpdate` callback will be called with the new dates.

### Progress Tracking
For tasks with `status: 'In Progress'`, set a `progress` value (0-100) to show a visual progress bar inside the task.

### Click to Edit
Click any task to open an edit modal where you can modify task details, change status, update progress, and manage dependencies.

### Dependencies
Set task dependencies using the `dependencies` array. Dependency lines will be drawn automatically.

## TypeScript Support

Full TypeScript definitions are included. Import types:

```typescript
import type { GanttTask, GanttChartProps, GanttConfig } from '@your-org/gantt-react';
```

## License

MIT

## Support

For issues or questions, contact your team maintainer or open an issue in the team repository.
