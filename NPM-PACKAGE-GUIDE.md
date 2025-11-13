# Publishing @your-org/gantt-react as an NPM Package

## Current Status
✅ Package built successfully: `your-org-gantt-react-1.0.0.tgz`
✅ All TypeScript types included
✅ Ready to publish

## Publishing Options

### Option 1: GitHub Packages (FREE - Recommended)

GitHub Packages is free for public repositories and works just like npm.

#### Setup:
1. Create a `.npmrc` file in your package root:
```bash
cd /Users/navadhiti-admin/Desktop/kanban/packages/gantt-react
echo "@your-org:registry=https://npm.pkg.github.com" > .npmrc
```

2. Update `package.json` - change the name to match your GitHub username/org:
```json
{
  "name": "@your-github-username/gantt-react",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-github-username/your-repo.git"
  }
}
```

3. Authenticate with GitHub:
```bash
npm login --registry=https://npm.pkg.github.com
# Username: your-github-username
# Password: your-github-personal-access-token
```

4. Publish:
```bash
npm publish
```

#### Your colleague installs with:
```bash
# Create .npmrc in their project
echo "@your-github-username:registry=https://npm.pkg.github.com" >> .npmrc

# Install
npm install @your-github-username/gantt-react
```

---

### Option 2: Verdaccio (FREE - Self-Hosted Private Registry)

Run your own private npm registry.

#### Setup:
```bash
# Install Verdaccio globally
npm install -g verdaccio

# Start the server (runs on http://localhost:4873)
verdaccio
```

#### Publish:
```bash
# Point to your registry
npm set registry http://localhost:4873

# Publish
npm publish

# Reset to default registry when done
npm set registry https://registry.npmjs.org
```

#### Your colleague installs with:
```bash
npm install @your-org/gantt-react --registry http://your-verdaccio-server:4873
```

---

### Option 3: NPM Public Package (FREE - Unscoped)

Remove the `@your-org/` scope to publish for free.

#### Update package.json:
```json
{
  "name": "gantt-react-yourcompany",  // Must be unique on npm
  "version": "1.0.0"
}
```

#### Publish:
```bash
npm login  # Use your npmjs.com account
npm publish --access public
```

#### Your colleague installs with:
```bash
npm install gantt-react-yourcompany
```

---

### Option 4: NPM Private Packages (PAID - $7/month)

Official npm private packages.

#### Setup:
```bash
npm login
npm publish --access restricted
```

---

### Option 5: Install from Tarball (NO SETUP NEEDED)

**Easiest if you don't want to set up a registry:**

#### Share the file:
Send `your-org-gantt-react-1.0.0.tgz` to your colleague

#### Your colleague installs with:
```bash
npm install ./your-org-gantt-react-1.0.0.tgz
```

Or upload to a web server and install via URL:
```bash
npm install https://your-server.com/packages/your-org-gantt-react-1.0.0.tgz
```

---

### Option 6: Install from Git Repository (FREE)

Push to GitHub/GitLab and install directly.

#### Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/your-repo.git
git push -u origin main
```

#### Your colleague installs with:
```bash
# From GitHub
npm install git+https://github.com/your-org/your-repo.git#main:packages/gantt-react

# Or with a specific tag/version
npm install git+https://github.com/your-org/your-repo.git#v1.0.0:packages/gantt-react
```

---

## Recommendation

**For most teams:** Use **GitHub Packages** (Option 1) or **Git Repository** (Option 6)
- Both are free
- Easy to set up
- Works well with private repositories
- Your team already uses GitHub

**For quick sharing:** Use **Tarball** (Option 5)
- No setup required
- Just send the .tgz file
- Works immediately

---

## Current Package Info

- **Package Name:** `@your-org/gantt-react`
- **Version:** `1.0.0`
- **Size:** 23.4 KB (81.6 KB unpacked)
- **Files:** 12 (including TypeScript definitions)
- **Tarball:** `your-org-gantt-react-1.0.0.tgz`

---

## After Installation

Your colleague needs peer dependencies:
```bash
npm install @mui/material @emotion/react @emotion/styled date-fns
```

Then use it:
```tsx
import { GanttChart } from '@your-org/gantt-react';
// or if unscoped: import { GanttChart } from 'gantt-react-yourcompany';

<GanttChart tasks={tasks} onTaskUpdate={handleUpdate} />
```
