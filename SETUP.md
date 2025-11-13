# Complete Setup Instructions for MUI Gantt Package

## Step 1: Install Dependencies

Navigate to the gantt-react package and install dependencies:

```bash
cd /Users/navadhiti-admin/Desktop/kanban/packages/gantt-react
npm install date-fns@^3.0.0 @mui/material@^5.15.0 @emotion/react@^11.11.0 @emotion/styled@^11.11.0
```

## Step 2: Build the Package

After dependencies are installed, build the package:

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Generate type declarations (.d.ts files)
- Create both ESM and CJS bundles in the `dist` folder

## Step 3: Use in Your Project

### Option A: Link Locally (for development)

```bash
# In the gantt-react package directory
npm link

# In your project directory
npm link @your-org/gantt-react
```

### Option B: Install from File System

```bash
# In your project
npm install /Users/navadhiti-admin/Desktop/kanban/packages/gantt-react
```

### Option C: Publish to NPM (for team sharing)

```bash
# Login to npm
npm login

# Publish the package
npm publish --access public
```

## Step 4: Import and Use

```tsx
import { GanttChart } from '@your-org/gantt-react';
import type { GanttTask } from '@your-org/gantt-react';

const tasks: GanttTask[] = [
  {
    id: 1,
    name: 'Task 1',
    start: '2024-01-01',
    end: '2024-01-10',
    status: 'In Progress',
    progress: 50,
    assignedTo: 'John Doe'
  }
];

function MyApp() {
  const handleUpdate = (id, updates) => {
    console.log('Task updated:', id, updates);
  };

  return (
    <GanttChart 
      tasks={tasks}
      onTaskUpdate={handleUpdate}
    />
  );
}
```

## Key Files Updated

1. **package.json** - Added MUI and date-fns dependencies
2. **src/types.ts** - Complete TypeScript interfaces for GanttTask, GanttChartProps, GanttConfig
3. **src/utils.ts** - Utility functions for date calculations and task positioning

## Package Features

✅ **Fully Typed** - Complete TypeScript support
✅ **MUI Components** - Uses Material-UI for consistent design
✅ **Drag & Drop** - Reschedule tasks by dragging
✅ **Progress Tracking** - Visual progress bars for in-progress tasks
✅ **Task Editing** - Click to edit functionality
✅ **Configurable** - Extensive configuration options
✅ **Zero Backend** - Pure frontend component, you control the data

## Configuration Options

```tsx
<GanttChart
  tasks={tasks}
  config={{
    dayWidth: 40,           // Width of each day column
    rowHeight: 50,          // Height of each task row
    monthsToShow: 12,       // Timeline span
    showWeekends: true,     // Include weekends
    enableDragDrop: true,   // Allow drag and drop
    enableResize: true,     // Allow task resizing
    showGridLines: true,    // Show grid
    showTodayLine: true     // Highlight today
  }}
  onTaskUpdate={(id, updates) => {
    // Your update logic
  }}
  enableEdit={true}
  height="600px"
  showTaskList={true}
  taskListWidth={320}
/>
```

## Data Format

Your team should provide data in this format:

```typescript
const tasks: GanttTask[] = [
  {
    id: string | number,    // Unique identifier
    name: string,           // Task name
    start: string | Date,   // Start date
    end: string | Date,     // End date
    status?: 'Not Started' | 'In Progress' | 'Done',
    progress?: number,      // 0-100
    assignedTo?: string,    // Assignee name
    dependencies?: (string | number)[]  // Array of task IDs
  }
];
```

## Publishing to NPM (for team use)

1. Update package name in `package.json`:
   ```json
   {
     "name": "@your-company/gantt-react",
     "version": "1.0.0"
   }
   ```

2. Create `.npmrc` file:
   ```
   @your-company:registry=https://registry.npmjs.org/
   ```

3. Publish:
   ```bash
   npm publish
   ```

4. Team members install:
   ```bash
   npm install @your-company/gantt-react
   ```

## Troubleshooting

### Progress not updating
Make sure to:
1. Pass the updated tasks array to the component
2. Implement the `onTaskUpdate` callback to update your state

### Drag and drop not working
Ensure:
1. `enableDragDrop: true` in config
2. `onTaskUpdate` callback is implemented
3. You're updating the tasks array with the new dates

### Build errors
Run:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. Install dependencies
2. Build the package (`npm run build`)
3. Test in your project
4. Share with your team (via npm or file system)
5. Document your specific usage patterns

The package is now ready to use! Your team can simply import it and pass an array of tasks.
