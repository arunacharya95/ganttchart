# Publishing to GitHub Packages - Step by Step

## ✅ Package Setup Complete

Your package is now configured for GitHub Packages!

---

## 📋 Steps to Publish

### Step 1: Update Repository Information

Edit `package.json` and replace:
```json
"repository": {
  "url": "git+https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME.git"
}
```

With your actual GitHub repository URL. For example:
```json
"repository": {
  "url": "git+https://github.com/mycompany/gantt-react-package.git"
}
```

**Important:** The `@your-org` in the package name should match your GitHub username or organization name.

---

### Step 2: Create a GitHub Personal Access Token

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "npm-publish"
4. Select scopes:
   - ✅ `write:packages` (to publish packages)
   - ✅ `read:packages` (to download packages)
   - ✅ `delete:packages` (optional, to delete packages)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

---

### Step 3: Login to GitHub Packages

Run this command in the package directory:

```bash
cd /Users/navadhiti-admin/Desktop/kanban/packages/gantt-react
npm login --registry=https://npm.pkg.github.com
```

When prompted:
- **Username:** Your GitHub username
- **Password:** Your personal access token (from Step 2)
- **Email:** Your email address

---

### Step 4: Publish the Package

```bash
npm publish
```

That's it! Your package is now published to GitHub Packages.

---

## 👥 For Your Colleague to Install

### Step 1: Create .npmrc in Their Project

Your colleague needs to tell npm to use GitHub Packages for your scope:

```bash
echo "@your-org:registry=https://npm.pkg.github.com" >> .npmrc
```

### Step 2: Authenticate (One-Time Setup)

```bash
npm login --registry=https://npm.pkg.github.com
# Use GitHub username and personal access token
```

### Step 3: Install the Package

```bash
npm install @your-org/gantt-react
npm install @mui/material @emotion/react @emotion/styled date-fns
```

---

## 📦 Usage

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
      progress: 45
    }
  ];

  return <GanttChart tasks={tasks} onTaskUpdate={(id, updates) => {
    console.log('Updated:', id, updates);
  }} />;
}
```

---

## 🔄 Updating the Package

When you make changes:

1. Update the version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Publish:
   ```bash
   npm publish
   ```

---

## 🌐 Making It Public

By default, GitHub Packages are private. To make it public:

1. Go to your GitHub repository
2. Click on "Packages" in the right sidebar
3. Click on your package
4. Go to "Package settings"
5. Scroll down to "Danger Zone"
6. Click "Change visibility" → "Public"

---

## 🆘 Troubleshooting

### Error: 404 Not Found
- Make sure the package name matches your GitHub org/username
- Check that you're logged in: `npm whoami --registry=https://npm.pkg.github.com`

### Error: 403 Forbidden
- Your personal access token needs `write:packages` permission
- Try logging in again with `npm login --registry=https://npm.pkg.github.com`

### Error: Package already exists
- Increment the version in package.json
- You cannot republish the same version

---

## 📚 Quick Reference

**Publish:**
```bash
npm publish
```

**Check login:**
```bash
npm whoami --registry=https://npm.pkg.github.com
```

**Logout:**
```bash
npm logout --registry=https://npm.pkg.github.com
```

---

## ✨ What's Configured

✅ Package name: `@your-org/gantt-react`
✅ Registry: GitHub Packages
✅ Version: 1.0.0
✅ Build output: Ready in `dist/` folder
✅ TypeScript definitions: Included
✅ Size: 23.4 KB

**Next:** Follow the steps above to publish!
