# Installing gantt-react-arunacharya95

## ✅ Fixed Version 1.0.1 Published

The React version conflict has been fixed. Your colleague should update to the latest version.

---

## Installation

```bash
# Uninstall old version if already installed
npm uninstall gantt-react-arunacharya95

# Install latest version
npm install gantt-react-arunacharya95@latest

# Install peer dependencies
npm install @mui/material @emotion/react @emotion/styled date-fns
```

---

## Usage

```tsx
import { GanttChart } from 'gantt-react-arunacharya95';
import type { GanttTask } from 'gantt-react-arunacharya95';

function App() {
  const tasks: GanttTask[] = [
    {
      id: '1',
      name: 'Project Planning',
      start: '2024-01-01',
      end: '2024-01-15',
      status: 'In Progress',
      progress: 45,
      assignedTo: 'John Doe'
    },
    {
      id: '2',
      name: 'Development',
      start: '2024-01-16',
      end: '2024-02-28',
      status: 'Not Started',
      assignedTo: 'Jane Smith',
      dependencies: ['1']
    }
  ];

  const handleTaskUpdate = (taskId: string | number, updates: Partial<GanttTask>) => {
    console.log('Task updated:', taskId, updates);
    // Update your state here
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Project Timeline</h1>
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
    </div>
  );
}

export default App;
```

---

## Configuration Options

```tsx
interface GanttConfig {
  dayWidth?: number;          // default: 40
  rowHeight?: number;         // default: 50
  monthsToShow?: number;      // default: 12
  showWeekends?: boolean;     // default: true
  enableDragDrop?: boolean;   // default: true
  enableResize?: boolean;     // default: true
  showGridLines?: boolean;    // default: true
  showTodayLine?: boolean;    // default: true
}
```

---

## Task Data Structure

```tsx
interface GanttTask {
  id: string | number;
  name: string;
  start: string | Date;      // ISO date string or Date object
  end: string | Date;
  status?: 'Not Started' | 'In Progress' | 'Done';
  progress?: number;         // 0-100
  assignedTo?: string;
  dependencies?: (string | number)[];
}
```

---

## Features

- ✅ **Drag and Drop** - Reschedule tasks by dragging
- ✅ **Progress Tracking** - Visual progress bars for tasks
- ✅ **Click to Edit** - Click any task to open edit modal
- ✅ **Task Dependencies** - Define task relationships
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Material-UI Design** - Beautiful, modern interface

---

## Example with State Management

```tsx
import { useState } from 'react';
import { GanttChart, GanttTask } from 'gantt-react-arunacharya95';

function ProjectManager() {
  const [tasks, setTasks] = useState<GanttTask[]>([
    {
      id: '1',
      name: 'Design Phase',
      start: '2024-01-01',
      end: '2024-01-15',
      status: 'Done',
      progress: 100
    },
    {
      id: '2',
      name: 'Development',
      start: '2024-01-16',
      end: '2024-02-28',
      status: 'In Progress',
      progress: 60,
      dependencies: ['1']
    }
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

---

## Troubleshooting

### Error: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')
**Fixed in v1.0.1** - Update to latest version:
```bash
npm install gantt-react-arunacharya95@latest
```

### Peer Dependencies Warning
Install all required peer dependencies:
```bash
npm install @mui/material @emotion/react @emotion/styled date-fns
```

### TypeScript Errors
Make sure you have the types:
```tsx
import type { GanttTask, GanttChartProps, GanttConfig } from 'gantt-react-arunacharya95';
```

---

## Package Info

- **npm Package:** https://www.npmjs.com/package/gantt-react-arunacharya95
- **Version:** 1.0.1 (Latest)
- **Size:** 12.2 kB (gzipped: ~4 kB)
- **License:** MIT

---

## Support

For issues or questions, contact the package maintainer or open an issue on the GitHub repository.
