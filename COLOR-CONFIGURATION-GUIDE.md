# Color Configuration Guide

This guide shows you how to configure colors for task bars in the Gantt chart component. There are multiple ways to customize colors, each with different priority levels.

## 🔑 License Requirement

**Most color customization features require a Pro license.**

To use custom colors, palettes, and advanced color configuration:

```tsx
import { setLicense } from 'gantt-react-arunacharya95';

// Activate your Pro license
setLicense({
  key: 'PRO-YOUR-LICENSE-KEY',
  type: 'pro',
  email: 'your@email.com'
});
```

**Free tier** includes only default progress-based colors (green for 100%, blue for in-progress, gray for not started).

**Pro tier** ($49/month) unlocks all color customization features shown in this guide.

[Get Pro License →](https://your-website.com/pricing) | [View Pricing](https://your-website.com/pricing)

---

## Color Priority System

The component uses the following priority order (highest to lowest):

1. **Task's `color` property** - Individual task color
2. **`getTaskColor` callback** - Dynamic color function
3. **`config.statusColors`** - Status-based color mapping
4. **`config.assigneeColors`** - Assignee-based color mapping
5. **`config.colorPalette.colors`** - Custom color array
6. **`config.colorPalette` progress colors** - Completed/InProgress/NotStarted
7. **`config.colorPalette.preset`** - Predefined palette
8. **Default progress-based colors** - Fallback

---

## Method 1: Using Predefined Color Palettes

**🔒 Requires Pro License**

Choose from 8 beautiful predefined color palettes:

### Available Palettes

- `default` - Standard blue, green, gray scheme
- `vivid` - Bright, saturated colors
- `pastel` - Soft, muted colors
- `warm` - Reds, oranges, yellows
- `cool` - Blues, purples, cyans
- `earth` - Greens, browns, natural tones
- `ocean` - Teals, blues, aquas
- `forest` - Deep greens and earth tones

### Example Usage

```tsx
import { GanttChart } from 'gantt-react';

function App() {
  const tasks = [
    { id: '1', name: 'Task A', start: '2025-11-01', end: '2025-11-10', progress: 100 },
    { id: '2', name: 'Task B', start: '2025-11-11', end: '2025-11-20', progress: 50 },
    { id: '3', name: 'Task C', start: '2025-11-21', end: '2025-11-30', progress: 0 },
  ];

  return (
    <GanttChart
      tasks={tasks}
      config={{
        colorPalette: {
          preset: 'vivid' // Use the vivid color palette
        }
      }}
    />
  );
}
```

**Try Different Palettes:**

```tsx
// Pastel colors for a softer look
config={{ colorPalette: { preset: 'pastel' } }}

// Ocean theme for aquatic projects
config={{ colorPalette: { preset: 'ocean' } }}

// Warm colors for energetic feel
config={{ colorPalette: { preset: 'warm' } }}
```

---

## Method 2: Custom Color Array

**🔒 Requires Pro License**

Provide your own array of colors. Tasks will cycle through these colors:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    colorPalette: {
      colors: [
        '#FF6B6B', // Red
        '#4ECDC4', // Turquoise
        '#45B7D1', // Blue
        '#FFA07A', // Light Salmon
        '#98D8C8', // Mint
        '#F7DC6F', // Yellow
        '#BB8FCE', // Purple
        '#85C1E2', // Sky Blue
      ]
    }
  }}
/>
```

**Result:** 
- Task 0: Red (#FF6B6B)
- Task 1: Turquoise (#4ECDC4)
- Task 2: Blue (#45B7D1)
- Task 3: Light Salmon (#FFA07A)
- Task 4: Mint (#98D8C8)
- ...cycles back to Red for task 8

---

## Method 3: Progress-Based Colors

**🔒 Requires Pro License**

Customize colors for different progress states:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    colorPalette: {
      completed: '#22c55e',   // Green for 100% complete
      inProgress: '#f59e0b',  // Orange for 1-99%
      notStarted: '#94a3b8'   // Light gray for 0%
    }
  }}
/>
```

---

## Method 4: Status-Based Color Mapping

**🔒 Requires Pro License**

Map task statuses to specific colors:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    statusColors: {
      'Done': '#22c55e',         // Green
      'In Progress': '#3b82f6',  // Blue
      'Not Started': '#6b7280',  // Gray
      'Blocked': '#ef4444',      // Red
      'On Hold': '#f59e0b'       // Orange
    }
  }}
/>
```

**Task Data:**
```tsx
const tasks = [
  { id: '1', name: 'Task A', start: '2025-11-01', end: '2025-11-10', status: 'Done' },
  { id: '2', name: 'Task B', start: '2025-11-11', end: '2025-11-20', status: 'In Progress' },
  { id: '3', name: 'Task C', start: '2025-11-21', end: '2025-11-30', status: 'Blocked' },
];
```

---

## Method 5: Assignee-Based Color Mapping

**🔒 Requires Pro License**

Different colors for different team members:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    assigneeColors: {
      'Alice': '#ef4444',   // Red
      'Bob': '#3b82f6',     // Blue
      'Charlie': '#22c55e', // Green
      'Diana': '#f59e0b',   // Orange
      'Eve': '#8b5cf6',     // Purple
    }
  }}
/>
```

**Task Data:**
```tsx
const tasks = [
  { id: '1', name: 'Frontend', start: '2025-11-01', end: '2025-11-10', assignedTo: 'Alice' },
  { id: '2', name: 'Backend', start: '2025-11-11', end: '2025-11-20', assignedTo: 'Bob' },
  { id: '3', name: 'Database', start: '2025-11-21', end: '2025-11-30', assignedTo: 'Charlie' },
];
```

---

## Method 6: Dynamic Color Function

**🔒 Requires Pro License**

For complex logic, use the `getTaskColor` callback:

```tsx
<GanttChart
  tasks={tasks}
  getTaskColor={(task) => {
    // Combine multiple factors
    if (task.priority === 'high') return '#ef4444';
    if (task.assignedTo === 'Alice') return '#3b82f6';
    if (task.progress === 100) return '#22c55e';
    return '#6b7280';
  }}
/>
```

---

## Method 7: Individual Task Colors

**🔒 Requires Pro License**

Set color directly on each task (highest priority):

```tsx
const tasks = [
  { 
    id: '1', 
    name: 'Critical Task', 
    start: '2025-11-01', 
    end: '2025-11-10',
    color: '#dc2626' // Always red, overrides all other settings
  },
  { 
    id: '2', 
    name: 'Normal Task', 
    start: '2025-11-11', 
    end: '2025-11-20'
    // Will use configured colors
  },
];
```

---

## Combining Multiple Methods

You can combine different methods - they follow the priority order:

```tsx
<GanttChart
  tasks={tasks}
  config={{
    colorPalette: {
      preset: 'vivid',
      completed: '#22c55e',  // Override vivid's completed color
    },
    statusColors: {
      'Blocked': '#ef4444'   // Red for blocked (overrides palette)
    },
    assigneeColors: {
      'Alice': '#8b5cf6'     // Purple for Alice (overrides status)
    }
  }}
  getTaskColor={(task) => {
    // This overrides config but not task.color
    if (task.name.includes('URGENT')) return '#dc2626';
    return undefined; // Fall through to config
  }}
/>
```

**Priority example:**
```tsx
const tasks = [
  { id: '1', name: 'Task', assignedTo: 'Alice', color: '#FF0000' },
  // Result: #FF0000 (task.color wins)
  
  { id: '2', name: 'URGENT Task', assignedTo: 'Alice' },
  // Result: #dc2626 (getTaskColor wins)
  
  { id: '3', name: 'Task', assignedTo: 'Alice' },
  // Result: #8b5cf6 (assigneeColors wins)
  
  { id: '4', name: 'Task', status: 'Blocked' },
  // Result: #ef4444 (statusColors wins)
  
  { id: '5', name: 'Task', progress: 100 },
  // Result: #22c55e (palette.completed wins)
];
```

---

## Complete Example: Team Project

```tsx
import { GanttChart, GanttTask, COLOR_PALETTES } from 'gantt-react';

function TeamGanttChart() {
  const tasks: GanttTask[] = [
    {
      id: '1',
      name: 'Planning Phase',
      start: '2025-11-01',
      end: '2025-11-07',
      status: 'Done',
      assignedTo: 'Alice',
      progress: 100
    },
    {
      id: '2',
      name: 'Design System',
      start: '2025-11-08',
      end: '2025-11-21',
      status: 'In Progress',
      assignedTo: 'Bob',
      progress: 65
    },
    {
      id: '3',
      name: 'URGENT: Security Patch',
      start: '2025-11-15',
      end: '2025-11-18',
      status: 'In Progress',
      assignedTo: 'Charlie',
      progress: 40,
      color: '#dc2626' // Force red for urgent
    },
    {
      id: '4',
      name: 'API Development',
      start: '2025-11-22',
      end: '2025-12-10',
      status: 'Not Started',
      assignedTo: 'Alice',
      progress: 0
    },
  ];

  return (
    <GanttChart
      tasks={tasks}
      config={{
        // Use ocean palette as base
        colorPalette: {
          preset: 'ocean',
        },
        // Override with status colors
        statusColors: {
          'Done': '#22c55e',
          'In Progress': '#3b82f6',
          'Not Started': '#94a3b8',
          'Blocked': '#ef4444',
        },
        // Team member colors (overrides status)
        assigneeColors: {
          'Alice': '#8b5cf6',   // Purple
          'Bob': '#06b6d4',     // Cyan
          'Charlie': '#f59e0b', // Orange
        },
      }}
      // Handle urgent tasks (overrides assignee but not task.color)
      getTaskColor={(task) => {
        if (task.name.startsWith('URGENT:')) {
          return '#dc2626'; // Red for urgent
        }
        return undefined; // Use config colors
      }}
    />
  );
}
```

**Results:**
- Task 1 (Alice): Purple (#8b5cf6) - assigneeColors
- Task 2 (Bob): Cyan (#06b6d4) - assigneeColors
- Task 3 (URGENT): Red (#dc2626) - task.color (highest priority)
- Task 4 (Alice): Purple (#8b5cf6) - assigneeColors

---

## Accessing Color Palettes

You can import and use the predefined palettes in your code:

```tsx
import { COLOR_PALETTES, getPaletteColor, getProgressColor } from 'gantt-react';

// View all colors in a palette
console.log(COLOR_PALETTES.vivid);
// Output: { completed: '#22c55e', inProgress: '#3b82f6', notStarted: '#94a3b8', colors: [...] }

// Get a specific color by index
const color = getPaletteColor('ocean', 2);
// Returns the 3rd color from ocean palette

// Get color based on progress
const color = getProgressColor('vivid', 100);
// Returns vivid's completed color (#22c55e)
```

---

## Color Reference

### All Predefined Palettes

```typescript
{
  default: {
    completed: '#10b981',
    inProgress: '#3b82f6',
    notStarted: '#6b7280',
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  },
  vivid: {
    completed: '#22c55e',
    inProgress: '#3b82f6',
    notStarted: '#94a3b8',
    colors: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899']
  },
  pastel: {
    completed: '#86efac',
    inProgress: '#93c5fd',
    notStarted: '#cbd5e1',
    colors: ['#fca5a5', '#fdba74', '#fcd34d', '#bef264', '#86efac', '#5eead4', '#67e8f9', '#93c5fd', '#a5b4fc', '#c4b5fd', '#f0abfc', '#f9a8d4']
  },
  warm: {
    completed: '#fb923c',
    inProgress: '#f59e0b',
    notStarted: '#a8a29e',
    colors: ['#dc2626', '#ea580c', '#f59e0b', '#facc15', '#fb923c', '#f87171', '#fbbf24', '#fde047']
  },
  cool: {
    completed: '#06b6d4',
    inProgress: '#0ea5e9',
    notStarted: '#94a3b8',
    colors: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#0891b2', '#0284c7', '#2563eb']
  },
  earth: {
    completed: '#84cc16',
    inProgress: '#a3e635',
    notStarted: '#a8a29e',
    colors: ['#78716c', '#a3e635', '#84cc16', '#65a30d', '#facc15', '#eab308', '#ca8a04', '#92400e']
  },
  ocean: {
    completed: '#14b8a6',
    inProgress: '#06b6d4',
    notStarted: '#64748b',
    colors: ['#0891b2', '#06b6d4', '#0ea5e9', '#0284c7', '#14b8a6', '#2dd4bf', '#22d3ee', '#38bdf8']
  },
  forest: {
    completed: '#22c55e',
    inProgress: '#10b981',
    notStarted: '#78716c',
    colors: ['#15803d', '#16a34a', '#22c55e', '#10b981', '#059669', '#84cc16', '#65a30d', '#4d7c0f']
  }
}
```

---

## Tips & Best Practices

1. **Consistency**: Choose one primary method and stick with it for consistency
2. **Accessibility**: Ensure sufficient contrast for readability
3. **Team Colors**: Assignee colors are great for seeing who's working on what at a glance
4. **Status Colors**: Use red for blocked/critical, green for done, blue for in-progress
5. **Custom Properties**: Extend `GanttTask` type for custom color logic:
   ```typescript
   interface MyTask extends GanttTask {
     priority: 'low' | 'medium' | 'high';
     department: string;
   }
   ```

6. **Performance**: Color calculations happen during render, so keep logic simple
7. **Testing Palettes**: Preview all palettes before choosing one for production

---

## Quick Reference

| Method | Priority | License | Use Case |
|--------|----------|---------|----------|
| `task.color` | 1 (Highest) | Pro | Override specific tasks |
| `getTaskColor()` | 2 | Pro | Complex dynamic logic |
| `config.statusColors` | 3 | Pro | Status-based coloring |
| `config.assigneeColors` | 4 | Pro | Team member coloring |
| `config.colorPalette.colors[]` | 5 | Pro | Custom color rotation |
| `config.colorPalette.{completed/inProgress/notStarted}` | 6 | Pro | Progress-based |
| `config.colorPalette.preset` | 7 | Pro | Predefined themes |
| Default | 8 (Lowest) | Free | Fallback |

---

## 🚀 Upgrade to Pro

Unlock all color customization features:

- ✅ 8 predefined color palettes
- ✅ Custom color arrays
- ✅ Status-based colors
- ✅ Assignee-based colors
- ✅ Dynamic color functions
- ✅ Individual task colors
- ✅ Export to PDF/Image *(coming soon)*
- ✅ Priority email support

**$49/month** or **$490/year** (save 17%)

[Get Pro License →](https://your-website.com/pricing)

Questions? Contact: sales@your-company.com
