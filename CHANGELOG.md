# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-11-20

### Added
- **Hierarchical Task Support (Subtasks)** - Major new feature
  - Added `parentId` and `subtasks` fields to `GanttTask` interface
  - Implemented expand/collapse functionality for parent tasks
  - Visual hierarchy in task list with indentation
  - Parent tasks show expand/collapse arrows (▶/▼)
  - Multi-level nesting support (unlimited depth)
  - Visual differentiation: parent tasks have bold font and borders, subtasks are slightly transparent
  - New `FlattenedTask` type for internal rendering
  
- **New Utility Functions**
  - `flattenTasks()` - Convert hierarchical structure to flat array for rendering
  - `toggleTaskExpansion()` - Toggle task expand/collapse state
  - `getParentTaskOptions()` - Get available parent tasks for dropdown
  - `findTaskById()` - Find task by ID in hierarchy
  - `updateTaskInHierarchy()` - Update task anywhere in hierarchy (immutable)
  - `addSubtask()` - Add subtask to parent task
  - `getIndentation()` - Calculate indentation for hierarchy levels

- **Enhanced TaskModal**
  - Parent task selection dropdown
  - Create subtasks by selecting a parent task
  - "None" option for top-level tasks

- **Documentation**
  - Comprehensive `SUBTASKS-GUIDE.md` with examples and API reference
  - `SUBTASKS-EXAMPLE.tsx` - Full working example
  - Updated README with subtasks section and examples
  - Added subtasks to keywords for better discoverability

### Changed
- `TaskList` component now displays hierarchical structure with indentation
- `TaskBar` component supports visual differentiation for parent tasks vs subtasks
- `GanttChart` component manages expand/collapse state internally
- Updated type exports to include `FlattenedTask`

### Technical Details
- Backward compatible - existing flat task structures continue to work
- No breaking changes to existing APIs
- All new features are opt-in via the subtasks structure

## [1.3.1] - Previous Release

### Features
- Custom color palettes
- Task progress tracking
- Drag and drop support
- Interactive timeline
- TypeScript support
