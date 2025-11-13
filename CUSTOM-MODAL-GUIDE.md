# Custom Modal Integration - v1.0.6

## ✅ New Feature: Use Your Own Modal

You can now use your own custom modal instead of the built-in one!

---

## 📦 Install

```bash
npm install gantt-react-arunacharya95@latest
```

---

## 🎯 Usage with Custom Modal

```tsx
import { useState } from 'react';
import { GanttChart } from 'gantt-react-arunacharya95';
import type { GanttTask } from 'gantt-react-arunacharya95';
import YourCustomModal from './YourCustomModal'; // Your modal component

function App() {
  const [tasks, setTasks] = useState<GanttTask[]>([...]);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle single click on task bar
  const handleTaskClick = (task: GanttTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle updates from your modal
  const handleSaveTask = (updatedTask: GanttTask) => {
    setTasks(prevTasks =>
      prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    );
    setIsModalOpen(false);
  };

  return (
    <>
      <GanttChart 
        tasks={tasks}
        onTaskClick={handleTaskClick}  // ✅ Single click opens YOUR modal
        onTaskUpdate={(id, updates) => {
          // Handle drag/drop updates
          setTasks(prev => prev.map(t => t.id === id ? {...t, ...updates} : t));
        }}
      />

      {/* Your Custom Modal */}
      <YourCustomModal
        open={isModalOpen}
        task={selectedTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}
```

---

## 🎨 Example: Material-UI Dialog

```tsx
import { useState } from 'react';
import { GanttChart, transformToGanttTasks } from 'gantt-react-arunacharya95';
import type { GanttTask } from 'gantt-react-arunacharya95';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

function ProjectGantt() {
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Open your modal on single click
  const handleTaskClick = (task: GanttTask) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  // Handle drag and drop
  const handleTaskUpdate = async (taskId: string | number, updates: Partial<GanttTask>) => {
    // Send to API
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    // Update local state
    setTasks(prev => prev.map(t => t.id === taskId ? {...t, ...updates} : t));
  };

  // Handle modal save
  const handleSave = async () => {
    if (!selectedTask) return;
    
    // Send to API
    await fetch(`/api/tasks/${selectedTask.id}`, {
      method: 'PATCH',
      body: JSON.stringify(selectedTask)
    });
    
    // Update local state
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? selectedTask : t));
    setModalOpen(false);
  };

  return (
    <>
      <GanttChart
        tasks={tasks}
        onTaskClick={handleTaskClick}      // Single click
        onTaskUpdate={handleTaskUpdate}    // Drag/drop
      />

      {/* Your Custom Material-UI Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Name"
            value={selectedTask?.name || ''}
            onChange={(e) => setSelectedTask(prev => prev ? {...prev, name: e.target.value} : null)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={selectedTask?.start || ''}
            onChange={(e) => setSelectedTask(prev => prev ? {...prev, start: e.target.value} : null)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={selectedTask?.end || ''}
            onChange={(e) => setSelectedTask(prev => prev ? {...prev, end: e.target.value} : null)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Progress (%)"
            type="number"
            value={selectedTask?.progress || 0}
            onChange={(e) => setSelectedTask(prev => prev ? {...prev, progress: Number(e.target.value)} : null)}
            margin="normal"
            inputProps={{ min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

---

## 🔄 Click Behavior

### Single Click
- **Triggers:** `onTaskClick(task)`
- **Use for:** Opening your custom modal
- **Only fires if:** User didn't drag (distinguishes click from drag)

### Drag and Drop
- **Triggers:** `onTaskUpdate(taskId, updates)`
- **Fires when:** User drags task to new dates
- **Updates include:** `{ start: '2024-01-15', end: '2024-01-30' }`

### Double Click (Optional)
- **Triggers:** `onTaskDoubleClick(task)`
- **Use for:** Alternative action or built-in modal

---

## 💡 Tips

1. **Prevent Accidental Clicks:** The package automatically distinguishes between clicks and drags (3px threshold)

2. **API Integration:**
   ```tsx
   const handleTaskClick = async (task) => {
     // Fetch full task details from API
     const response = await fetch(`/api/tasks/${task.id}`);
     const fullTask = await response.json();
     
     setSelectedTask(fullTask);
     setModalOpen(true);
   };
   ```

3. **Use Both Callbacks:**
   ```tsx
   <GanttChart
     onTaskClick={handleClick}        // Your modal
     onTaskUpdate={handleDragDrop}    // Auto-save on drag
   />
   ```

4. **TypeScript Support:**
   ```tsx
   import type { GanttTask } from 'gantt-react-arunacharya95';
   
   const handleTaskClick = (task: GanttTask) => {
     // task is fully typed!
   };
   ```

---

## 📋 Props Summary

| Prop | Type | Description |
|------|------|-------------|
| `onTaskClick` | `(task: GanttTask) => void` | **NEW** - Single click opens your modal |
| `onTaskUpdate` | `(id, updates) => void` | Drag/drop updates |
| `onTaskDoubleClick` | `(task) => void` | Double click (optional) |

---

## 🚀 Migration from v1.0.5

**Before (built-in modal):**
```tsx
<GanttChart tasks={tasks} onChange={handleChange} />
```

**After (your custom modal):**
```tsx
<GanttChart 
  tasks={tasks}
  onTaskClick={task => openYourModal(task)}
  onTaskUpdate={handleDragDrop}
/>
```

---

## ✅ What's New in v1.0.6

- ✅ `onTaskClick` callback for custom modals
- ✅ Smart click vs drag detection (3px threshold)
- ✅ Drag only updates if user actually moved the task
- ✅ Backward compatible with `onTaskDoubleClick`

---

**Package:** https://www.npmjs.com/package/gantt-react-arunacharya95  
**Version:** 1.0.6
