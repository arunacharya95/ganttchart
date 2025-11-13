# Update to v1.0.2 - React 19 & MUI 7 Support

## ✅ Version 1.0.2 Published

Now supports React 19 and Material-UI 7!

---

## Tell Your Colleague to Update

```bash
npm install gantt-react-arunacharya95@latest
```

---

## Supported Versions

### ✅ React
- React 18.x ✅
- React 19.x ✅

### ✅ Material-UI
- MUI 5.x ✅
- MUI 6.x ✅
- MUI 7.x ✅

### ✅ Emotion
- @emotion/react 11.x ✅
- @emotion/styled 11.x ✅

---

## No More Peer Dependency Warnings!

The package now works with:
- ✅ React 19.1.1 (your colleague's version)
- ✅ Material-UI 7.3.1 (your colleague's version)

---

## Installation (Clean Install)

```bash
# Remove old version
npm uninstall gantt-react-arunacharya95

# Install latest
npm install gantt-react-arunacharya95@latest
```

---

## Usage Remains the Same

```tsx
import { GanttChart } from 'gantt-react-arunacharya95';
import type { GanttTask } from 'gantt-react-arunacharya95';

function App() {
  const tasks: GanttTask[] = [
    {
      id: '1',
      name: 'Task 1',
      start: '2024-01-01',
      end: '2024-01-15',
      status: 'In Progress',
      progress: 45
    }
  ];

  return (
    <GanttChart 
      tasks={tasks} 
      onTaskUpdate={(id, updates) => console.log(id, updates)}
    />
  );
}
```

---

## Changelog

### v1.0.2 (Latest)
- ✅ Added React 19 support
- ✅ Added MUI 7 support
- ✅ Added MUI 6 support
- ✅ No peer dependency warnings

### v1.0.1
- ✅ Fixed React bundling issue
- ✅ Reduced package size to 12 kB

### v1.0.0
- 🎉 Initial release

---

## Package Info

- **npm:** https://www.npmjs.com/package/gantt-react-arunacharya95
- **Latest Version:** 1.0.2
- **Size:** 12.3 kB
- **License:** MIT
