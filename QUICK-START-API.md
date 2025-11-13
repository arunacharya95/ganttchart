# Quick Start - API Integration

## Install
```bash
npm install gantt-react-arunacharya95@latest
```

## Usage with Your API

```tsx
import { GanttChart, transformToGanttTasks, transformFromGanttTask } from 'gantt-react-arunacharya95';

function MyGantt() {
  const [tasks, setTasks] = useState([]);

  // Load from API
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        const ganttTasks = transformToGanttTasks(data.data); // ✅ Auto-converts your API format
        setTasks(ganttTasks);
      });
  }, []);

  // Save to API
  const handleUpdate = async (taskId, updates) => {
    const apiUpdates = transformFromGanttTask(taskId, updates); // ✅ Converts back to API format
    
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(apiUpdates)
    });
    
    setTasks(prev => prev.map(t => t.id === taskId ? {...t, ...updates} : t));
  };

  return <GanttChart tasks={tasks} onTaskUpdate={handleUpdate} />;
}
```

## What It Transforms

**Your API:**
```json
{
  "_id": "123",
  "title": "Task Name",
  "startDate": "2025-11-13",
  "endDate": "2025-11-20",
  "progress": "50%",
  "assignees": ["user123"]
}
```

**→ Gantt Format:**
```json
{
  "id": "123",
  "name": "Task Name",
  "start": "2025-11-13",
  "end": "2025-11-20",
  "progress": 50,
  "assignedTo": "user123"
}
```

## That's It!
No manual mapping needed. The package handles everything automatically. 🎉
