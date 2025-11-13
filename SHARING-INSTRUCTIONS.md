# Sharing @your-org/gantt-react Package

## For the Package Creator (You)

The package has been built and packaged as: **`your-org-gantt-react-1.0.0.tgz`**

### Ways to Share with Your Colleague:

#### Option 1: Share the Tarball File (Recommended)
1. Send the file `your-org-gantt-react-1.0.0.tgz` to your colleague via:
   - Email
   - Slack/Teams
   - Shared drive
   - Cloud storage (Dropbox, Google Drive, etc.)

#### Option 2: Share via Git Repository
1. Commit the `packages/gantt-react` folder to a Git repository
2. Your colleague can clone and install from there

#### Option 3: Set Up Private npm Registry
- Use services like:
  - **Verdaccio** (free, self-hosted)
  - **GitHub Packages** (free for private repos)
  - **JFrog Artifactory** (enterprise)
  - **npm private packages** (paid)

---

## For Your Colleague (Installation)

### Method 1: Install from Tarball File
```bash
# Install from the .tgz file
npm install ./path/to/your-org-gantt-react-1.0.0.tgz

# Or if received via URL
npm install https://your-server.com/your-org-gantt-react-1.0.0.tgz
```

### Method 2: Install from Git Repository
```bash
npm install git+https://github.com/your-org/your-repo.git#path:packages/gantt-react
```

### Method 3: Install from Local Directory
```bash
# If you have the source folder
npm install /path/to/packages/gantt-react
```

---

## Usage

After installation, use it in your React project:

```tsx
import { GanttChart } from '@your-org/gantt-react';
import type { GanttTask } from '@your-org/gantt-react';

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

  const handleTaskUpdate = (taskId, updates) => {
    console.log('Task updated:', taskId, updates);
    // Update your state/backend here
  };

  return (
    <GanttChart
      tasks={tasks}
      onTaskUpdate={handleTaskUpdate}
      config={{
        dayWidth: 40,
        showWeekends: true,
        enableDragDrop: true
      }}
    />
  );
}
```

### Install Required Dependencies

Your colleague also needs to install peer dependencies:

```bash
npm install @mui/material @emotion/react @emotion/styled date-fns
```

---

## Package Contents

- Full TypeScript support with type definitions
- Material-UI styled components
- Drag-and-drop task scheduling
- Progress tracking with visual indicators
- Click-to-edit functionality
- Task dependencies support

## Version

Current version: **1.0.0**

## Support

For questions or issues, contact the package maintainer.
