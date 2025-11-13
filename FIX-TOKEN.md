# Fix: GitHub Token Permissions

## The Problem
Your current token doesn't have `write:packages` permission.

## Solution: Create a New Token

### Step 1: Go to GitHub Token Settings
Open this URL: https://github.com/settings/tokens/new

### Step 2: Configure the Token
- **Note:** `npm-publish-gantt-react`
- **Expiration:** Choose your preference (90 days, 1 year, or no expiration)
- **Select scopes:** ✅ Check these:
  - ✅ `write:packages` - Upload packages
  - ✅ `read:packages` - Download packages
  - ✅ `delete:packages` - (Optional) Delete packages
  - ✅ `repo` - (Optional) If your repo is private

### Step 3: Generate and Copy Token
1. Click "Generate token" at the bottom
2. **COPY THE TOKEN** - You won't see it again!

### Step 4: Login with New Token
```bash
cd /Users/navadhiti-admin/Desktop/kanban/packages/gantt-react
npm logout --registry=https://npm.pkg.github.com
npm login --registry=https://npm.pkg.github.com
```

When prompted:
- **Username:** arunacharya95
- **Password:** [PASTE YOUR NEW TOKEN HERE]
- **Email:** your@email.com

### Step 5: Publish
```bash
npm publish
```

---

## ✅ Package Name Updated

Your package is now correctly configured:
- **Name:** `@arunacharya95/gantt-react`
- **Repository:** `https://github.com/arunacharya95/ganttchart.git`
- **Registry:** GitHub Packages

---

## For Your Colleague to Install

After you publish, your colleague can install with:

```bash
# Create .npmrc in their project
echo "@arunacharya95:registry=https://npm.pkg.github.com" >> .npmrc

# Login to GitHub Packages (one-time)
npm login --registry=https://npm.pkg.github.com
# Username: arunacharya95 (or their own GitHub username)
# Password: their-github-token

# Install
npm install @arunacharya95/gantt-react
npm install @mui/material @emotion/react @emotion/styled date-fns
```

Then use it:
```tsx
import { GanttChart } from '@arunacharya95/gantt-react';

<GanttChart tasks={tasks} onTaskUpdate={handleUpdate} />
```
