# API Integration Guide

## Using with Your API Response

Your API returns data in this format:
```json
{
  "status": true,
  "message": "Task fetched successfully",
  "code": 200,
  "data": [
    {
      "_id": "6915a1837f57c1a2b92ab6ac",
      "title": "what",
      "assignees": ["69049a0e73399ff70163eea1"],
      "startDate": "2025-11-13T00:00:00.000Z",
      "endDate": "2025-11-13T00:00:00.000Z",
      "progress": "50%"
    }
  ]
}
```

---

## ✅ Automatic Transformation

Use `transformToGanttTasks` to convert your API data:

```tsx
import { useState, useEffect } from 'react';
import { GanttChart, transformToGanttTasks, transformFromGanttTask } from 'gantt-react-arunacharya95';
import type { GanttTask } from 'gantt-react-arunacharya95';

function ProjectGantt() {
  const [tasks, setTasks] = useState<GanttTask[]>([]);

  // Fetch data from API
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(response => {
        // Transform API data to Gantt format
        const ganttTasks = transformToGanttTasks(response.data);
        setTasks(ganttTasks);
      });
  }, []);

  // Handle updates from Gantt chart
  const handleTaskUpdate = async (taskId: string | number, updates: Partial<GanttTask>) => {
    // Transform back to API format
    const apiUpdates = transformFromGanttTask(taskId, updates);
    
    // Send to your API
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiUpdates)
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

  return (
    <GanttChart 
      tasks={tasks}
      onTaskUpdate={handleTaskUpdate}
    />
  );
}
```

---

## 🔄 What Gets Transformed

### API → Gantt Chart

| API Field | Gantt Field | Notes |
|-----------|-------------|-------|
| `_id` | `id` | Unique identifier |
| `title` | `name` | Task name |
| `startDate` | `start` | Start date |
| `endDate` | `end` | End date |
| `progress: "50%"` | `progress: 50` | Converts string to number |
| `assignees: [...]` | `assignedTo` | Takes first assignee |

### Gantt Chart → API

| Gantt Field | API Field | Notes |
|-------------|-----------|-------|
| `name` | `title` | Task name |
| `start` | `startDate` | Start date |
| `end` | `endDate` | End date |
| `progress: 50` | `progress: "50%"` | Converts number to string |
| `assignedTo` | `assignees: [...]` | Wraps in array |

---

## 📋 Complete Example

```tsx
import { useState, useEffect } from 'react';
import { 
  GanttChart, 
  transformToGanttTasks, 
  transformFromGanttTask 
} from 'gantt-react-arunacharya95';
import type { GanttTask } from 'gantt-react-arunacharya95';

function App() {
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const json = await response.json();
      
      if (json.status && json.data) {
        const ganttTasks = transformToGanttTasks(json.data);
        setTasks(ganttTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: string | number, updates: Partial<GanttTask>) => {
    // Transform to API format
    const apiUpdates = transformFromGanttTask(taskId, updates);
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiUpdates)
      });

      if (response.ok) {
        // Update succeeded - update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      // Optionally: show error message to user
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Project Timeline</h1>
      <GanttChart 
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        config={{
          dayWidth: 40,
          showWeekends: true,
          enableDragDrop: true
        }}
      />
    </div>
  );
}

export default App;
```

---

## 🎯 Field Mapping Details

### Progress Field
```tsx
// API returns: "50%" or "100%"
// Gantt uses: 50 or 100 (number)

// Transformation handles both:
transformToGanttTasks(apiData)
// "50%" → 50
// "100%" → 100
// 75 → 75 (already number)
```

### Status Field
```tsx
// Automatically determined from progress:
// progress === 100 → 'Done'
// progress > 0 → 'In Progress'  
// progress === 0 → 'Not Started'
```

### Assignees Field
```tsx
// API: assignees: ["id1", "id2", "id3"]
// Gantt: assignedTo: "id1" (first one)

// When updating:
// Gantt: assignedTo: "id1"
// API: assignees: ["id1"]
```

---

## 🔧 Manual Transformation (Alternative)

If you prefer manual control:

```tsx
// From API to Gantt
const ganttTasks = apiResponse.data.map(item => ({
  id: item._id,
  name: item.title,
  start: item.startDate,
  end: item.endDate,
  progress: parseInt(item.progress?.replace('%', '') || '0'),
  status: item.progress === '100%' ? 'Done' : 
          item.progress !== '0%' ? 'In Progress' : 'Not Started',
  assignedTo: item.assignees?.[0]
}));

// From Gantt to API
const apiUpdate = {
  title: updates.name,
  startDate: updates.start,
  endDate: updates.end,
  progress: `${updates.progress}%`,
  assignees: updates.assignedTo ? [updates.assignedTo] : undefined
};
```

---

## 💡 Tips

1. **Preserve Original Data**: The transformed task includes `_original` field with the full API response
   ```tsx
   const originalData = task._original;
   ```

2. **Handle Missing Fields**: Transformation handles missing fields gracefully
   ```tsx
   // If API doesn't have progress:
   // progress defaults to 0
   // status defaults to 'Not Started'
   ```

3. **Type Safety**: Use TypeScript types for better IDE support
   ```tsx
   import type { GanttTask } from 'gantt-react-arunacharya95';
   ```

4. **Error Handling**: Always wrap API calls in try-catch
   ```tsx
   try {
     await updateTask(id, updates);
   } catch (error) {
     // Show error to user
     alert('Failed to update task');
   }
   ```

---

## 🚀 Quick Start

```bash
npm install gantt-react-arunacharya95@latest
```

```tsx
import { GanttChart, transformToGanttTasks } from 'gantt-react-arunacharya95';

// In your component:
const ganttTasks = transformToGanttTasks(apiResponse.data);
<GanttChart tasks={ganttTasks} onTaskUpdate={handleUpdate} />
```

That's it! Your API data is now fully compatible with the Gantt chart. 🎉
