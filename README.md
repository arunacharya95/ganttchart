# gantt-react

A lightweight, interactive React Gantt chart component library built with TypeScript.

## Features

- 📅 **Interactive Timeline**: View tasks across days, weeks, or months
- 📊 **Task Bars**: Visual representation of task duration and progress
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

## API

### `<GanttChart />`

Main Gantt chart component with synchronized scrolling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tasks` | `Task[]` | Required | Array of task objects |
| `onChange` | `(tasks: Task[]) => void` | - | Callback when tasks change (future drag-drop) |
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
  dependencies?: string[]  // Array of task IDs (future feature)
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
- [ ] Custom task colors
- [ ] Zoom in/out timeline
- [ ] Export to image/PDF
- [ ] Touch/mobile support

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
# ganttchart
