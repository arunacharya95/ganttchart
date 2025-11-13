# Version 1.0.3 - Critical Bug Fixes

## ✅ Fixed Issues

### 1. **Task Updates Not Working** ✅
**Problem:** When dragging tasks, updates weren't being saved.
**Cause:** Package was sending `startDate/endDate` but expecting `start/end`.
**Fix:** Updated TaskBar component to use correct field names (`start` and `end`).

### 2. **Click Opens Add Dialog Instead of Edit** ✅
**Problem:** Clicking on any task bar opened the "Add Task" dialog instead of "Edit Task".
**Cause:** Missing click event handling and task bar identification.
**Fix:** 
- Added `data-task-bar="true"` attribute to identify task bars
- Added `onClick` handler to stop event propagation
- Now clicking task bars won't trigger grid click

---

## 🚀 Update Instructions

```bash
npm install gantt-react-arunacharya95@latest
```

---

## ✅ Now Working Correctly

### Task Bar Click Behavior:
- **Single Click on Task:** Nothing happens (ready to drag)
- **Drag Task:** Moves task to new dates, updates via `onTaskUpdate`
- **Double Click on Task:** Opens edit modal for that specific task
- **Click on Empty Grid:** Opens "Add New Task" dialog
- **Drag Task Edges:** Resizes task duration, updates via `onTaskUpdate`

### Task Update Flow:
```tsx
<GanttChart 
  tasks={tasks}
  onTaskUpdate={(taskId, updates) => {
    // updates will contain: { start: '2024-01-15', end: '2024-01-30' }
    // This now works correctly!
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }}
/>
```

---

## 📋 Complete Example

```tsx
import { useState } from 'react';
import { GanttChart, GanttTask } from 'gantt-react-arunacharya95';

function App() {
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
      progress: 60
    }
  ]);

  const handleTaskUpdate = (taskId: string | number, updates: Partial<GanttTask>) => {
    console.log('Updating task:', taskId, updates);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Project Timeline</h1>
      <GanttChart 
        tasks={tasks} 
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}

export default App;
```

---

## 🐛 Bug Details

### Before v1.0.3:
- ❌ Dragging tasks didn't save changes
- ❌ Clicking task bars opened "Add Task" dialog
- ❌ No way to edit existing tasks

### After v1.0.3:
- ✅ Dragging tasks updates dates correctly
- ✅ Single click on task bar does nothing (prevents accidental dialogs)
- ✅ Double click on task bar opens edit modal
- ✅ Click on empty space opens "Add Task" dialog
- ✅ All updates flow through `onTaskUpdate` callback

---

## 📦 Changelog

### v1.0.3 (Latest)
- 🐛 Fixed task updates not working (wrong field names)
- 🐛 Fixed click on task opening add dialog (event propagation)
- ✅ Task bar clicks now properly handled
- ✅ Double click to edit works correctly
- ✅ Backward compatible with both `start/end` and `startDate/endDate`

### v1.0.2
- ✅ React 19 support
- ✅ MUI 7 support

### v1.0.1
- ✅ Fixed React bundling issue

### v1.0.0
- 🎉 Initial release

---

## 🔗 Links

- **npm Package:** https://www.npmjs.com/package/gantt-react-arunacharya95
- **Latest Version:** 1.0.3
- **Size:** 12.4 kB

---

## 💡 Tips

1. **Always use the callback:**
   ```tsx
   onTaskUpdate={(id, updates) => {
     // Update your state here
     setTasks(prev => prev.map(t => t.id === id ? {...t, ...updates} : t))
   }}
   ```

2. **Field names:** Use either `start/end` OR `startDate/endDate` - both work!

3. **Double-click to edit:** Make sure users know to double-click tasks to edit them

4. **Single click empty space:** To add new tasks, click on the empty grid area
