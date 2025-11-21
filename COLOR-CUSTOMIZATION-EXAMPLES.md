# Task Bar Color Customization Examples

The Gantt chart package now supports three ways to customize task bar colors based on progress, status, or any custom logic.

## Priority Order

1. **Task's `color` property** (highest priority)
2. **`getTaskColor` callback function**
3. **Default progress-based colors** (lowest priority)

---

## Example 1: Direct Color Property

Set a `color` property directly on each task for complete control:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

const tasks: GanttTask[] = [
  {
    id: '1',
    name: 'Critical Task',
    start: '2025-11-01',
    end: '2025-11-10',
    color: '#ef4444', // Red - high priority
    progress: 50
  },
  {
    id: '2',
    name: 'Normal Task',
    start: '2025-11-11',
    end: '2025-11-20',
    color: '#3b82f6', // Blue - normal priority
    progress: 75
  },
  {
    id: '3',
    name: 'Low Priority Task',
    start: '2025-11-21',
    end: '2025-11-30',
    color: '#10b981', // Green - low priority
    progress: 25
  }
];

function App() {
  return <GanttChart tasks={tasks} />;
}
```

---

## Example 2: Dynamic Colors by Progress

Use `getTaskColor` to automatically color tasks based on their progress percentage:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

const tasks: GanttTask[] = [
  { id: '1', name: 'Task A', start: '2025-11-01', end: '2025-11-10', progress: 100 },
  { id: '2', name: 'Task B', start: '2025-11-11', end: '2025-11-20', progress: 75 },
  { id: '3', name: 'Task C', start: '2025-11-21', end: '2025-11-30', progress: 40 },
  { id: '4', name: 'Task D', start: '2025-12-01', end: '2025-12-10', progress: 0 },
];

function App() {
  return (
    <GanttChart
      tasks={tasks}
      getTaskColor={(task) => {
        if (task.progress === 100) return '#10b981'; // Green - completed
        if (task.progress >= 75) return '#3b82f6';   // Blue - mostly done
        if (task.progress >= 50) return '#f59e0b';   // Orange - halfway
        if (task.progress > 0) return '#ef4444';     // Red - just started
        return '#6b7280';                            // Gray - not started
      }}
    />
  );
}
```

**Result:**
- Task A (100%): Green
- Task B (75%): Blue  
- Task C (40%): Red
- Task D (0%): Gray

---

## Example 3: Dynamic Colors by Status

Color tasks based on their status field:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

const tasks: GanttTask[] = [
  {
    id: '1',
    name: 'Requirements',
    start: '2025-11-01',
    end: '2025-11-10',
    status: 'Done',
    progress: 100
  },
  {
    id: '2',
    name: 'Development',
    start: '2025-11-11',
    end: '2025-11-30',
    status: 'In Progress',
    progress: 60
  },
  {
    id: '3',
    name: 'Testing',
    start: '2025-12-01',
    end: '2025-12-15',
    status: 'Not Started',
    progress: 0
  },
];

function App() {
  return (
    <GanttChart
      tasks={tasks}
      getTaskColor={(task) => {
        switch (task.status) {
          case 'Done':
            return '#10b981'; // Green
          case 'In Progress':
            return '#3b82f6'; // Blue
          case 'Not Started':
            return '#6b7280'; // Gray
          default:
            return '#8b5cf6'; // Purple - unknown status
        }
      }}
    />
  );
}
```

---

## Example 4: Dynamic Colors by Assignee

Different colors for different team members:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

const tasks: GanttTask[] = [
  {
    id: '1',
    name: 'Frontend Development',
    start: '2025-11-01',
    end: '2025-11-20',
    assignedTo: 'Alice',
    progress: 70
  },
  {
    id: '2',
    name: 'Backend API',
    start: '2025-11-05',
    end: '2025-11-25',
    assignedTo: 'Bob',
    progress: 50
  },
  {
    id: '3',
    name: 'Database Design',
    start: '2025-11-10',
    end: '2025-11-30',
    assignedTo: 'Charlie',
    progress: 30
  },
];

function App() {
  const teamColors: Record<string, string> = {
    'Alice': '#ef4444',   // Red
    'Bob': '#3b82f6',     // Blue
    'Charlie': '#10b981', // Green
    'Diana': '#f59e0b',   // Orange
    'Eve': '#8b5cf6',     // Purple
  };

  return (
    <GanttChart
      tasks={tasks}
      getTaskColor={(task) => teamColors[task.assignedTo || ''] || '#6b7280'}
    />
  );
}
```

---

## Example 5: Combined Logic (Priority + Progress)

Complex color logic combining multiple factors:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

interface CustomTask extends GanttTask {
  priority?: 'high' | 'medium' | 'low';
}

const tasks: CustomTask[] = [
  {
    id: '1',
    name: 'Critical Bug Fix',
    start: '2025-11-01',
    end: '2025-11-05',
    priority: 'high',
    progress: 30
  },
  {
    id: '2',
    name: 'Feature Development',
    start: '2025-11-06',
    end: '2025-11-20',
    priority: 'medium',
    progress: 60
  },
  {
    id: '3',
    name: 'Code Cleanup',
    start: '2025-11-21',
    end: '2025-11-30',
    priority: 'low',
    progress: 0
  },
];

function App() {
  return (
    <GanttChart
      tasks={tasks}
      getTaskColor={(task: CustomTask) => {
        // High priority tasks are always red
        if (task.priority === 'high') {
          return '#ef4444'; // Red
        }
        
        // Medium priority - color by progress
        if (task.priority === 'medium') {
          if (task.progress >= 75) return '#3b82f6'; // Blue
          if (task.progress >= 50) return '#f59e0b'; // Orange
          return '#ef4444'; // Red (behind schedule)
        }
        
        // Low priority - always gray
        return '#6b7280';
      }}
    />
  );
}
```

---

## Example 6: Overriding with Direct Color

The `color` property always takes precedence:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

const tasks: GanttTask[] = [
  {
    id: '1',
    name: 'Task with direct color',
    start: '2025-11-01',
    end: '2025-11-10',
    color: '#ec4899', // This will be used
    progress: 100
  },
  {
    id: '2',
    name: 'Task without color',
    start: '2025-11-11',
    end: '2025-11-20',
    progress: 100 // Will use getTaskColor logic
  },
];

function App() {
  return (
    <GanttChart
      tasks={tasks}
      getTaskColor={(task) => {
        // This applies to tasks without a direct color property
        return task.progress === 100 ? '#10b981' : '#6b7280';
      }}
    />
  );
}
```

**Result:**
- Task 1: Pink (#ec4899) - uses direct color property
- Task 2: Green (#10b981) - uses getTaskColor function

---

## Default Behavior (No Customization)

If you don't specify colors, the component uses default progress-based colors:

```tsx
import { GanttChart, GanttTask } from 'gantt-react';

const tasks: GanttTask[] = [
  { id: '1', name: 'Completed', start: '2025-11-01', end: '2025-11-10', progress: 100 },
  { id: '2', name: 'In Progress', start: '2025-11-11', end: '2025-11-20', progress: 50 },
  { id: '3', name: 'Not Started', start: '2025-11-21', end: '2025-11-30', progress: 0 },
];

// No color customization
function App() {
  return <GanttChart tasks={tasks} />;
}
```

**Default Colors:**
- 100% progress: Green (#10b981)
- 1-99% progress: Blue (#3b82f6)
- 0% progress: Gray (#6b7280)

---

## Color Palette Reference

Common Tailwind CSS colors you can use:

```typescript
const colors = {
  red: '#ef4444',
  orange: '#f59e0b',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#10b981',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  gray: '#6b7280',
  slate: '#64748b',
};
```

---

## Tips

1. **Performance**: The `getTaskColor` function is called during render, so keep it lightweight.

2. **Consistency**: Use a consistent color scheme across your application for better UX.

3. **Accessibility**: Ensure sufficient contrast between text and background colors.

4. **Priority**: Remember the priority order:
   - Task's `color` property (highest)
   - `getTaskColor` callback
   - Default progress-based colors (lowest)

5. **TypeScript**: Extend the `GanttTask` type for custom properties:
   ```typescript
   interface MyTask extends GanttTask {
     priority: 'high' | 'medium' | 'low';
     category: string;
   }
   ```
