// Core domain types for the advanced Gantt implementation.
// These are additive and do not replace existing public types yet.

// Custom fields and formulas
export type CustomFieldType = 'text' | 'number' | 'checkbox' | 'date'

export type CustomFieldValue = string | number | boolean | Date | null

export interface FormulaFieldDefinition {
  id: string
  /** Expression language is evaluated by higher-level utilities, not here. */
  expression: string
  /** IDs of fields this formula depends on (task fields or custom fields). */
  dependsOn: string[]
}

// Calendars / non-working rules
export interface NonWorkingRule {
  /** ISO date string (yyyy-MM-dd) or full ISO timestamp */
  date: string
  /** Optional resource this rule applies to (for PTO). */
  resourceId?: string
  reason?: string
}

export interface Calendar {
  id: string
  name: string
  timezone?: string
  /** 0-6 (Sunday-Saturday) */
  weekendDays: number[]
  /** List of ISO dates (yyyy-MM-dd) that are holidays. */
  holidays: string[]
  /** Personal time-off entries. */
  personalTimeOff: NonWorkingRule[]
}

// Resources / users
export type ResourceId = string

export interface Resource {
  id: ResourceId
  name: string
  email?: string
  avatarUrl?: string
  role?: string
  hourlyRate?: number
  calendarId?: string
  color?: string
}

// Task core enums
export type TaskStatus = 'NotStarted' | 'InProgress' | 'Blocked' | 'Done'

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'

// Constraints
export type TaskConstraintType =
  | 'StartNoEarlierThan'
  | 'StartNoLaterThan'
  | 'FinishNoEarlierThan'
  | 'FinishNoLaterThan'

export interface TaskConstraint {
  type: TaskConstraintType
  /** Constraint date as ISO string or Date. */
  date: string | Date
}

// Core Task model
export interface Task {
  id: string
  projectId?: string
  parentId?: string | null
  /** Optional embedded children for hierarchical views. */
  children?: Task[]
  /** Order within its sibling list. */
  orderIndex?: number

  // Core scheduling
  name: string
  start: string | Date
  end: string | Date
  /** Optional explicit duration in working days. If omitted, derived from start/end. */
  durationDays?: number
  isMilestone?: boolean
  isLocked?: boolean
  constraints?: TaskConstraint[]

  // Status / assignment
  status?: TaskStatus
  progress?: number // 0-100
  priority?: TaskPriority
  assignees?: ResourceId[]
  tags?: string[]

  // Custom + formula fields
  customFields?: Record<string, CustomFieldValue>
  formulaFields?: Record<string, FormulaFieldDefinition>

  // Time tracking & cost
  estimatedHours?: number
  actualHours?: number
  hourlyRate?: number
  /** If provided, overrides any computed cost. */
  costOverride?: number

  // Baseline linkage
  baselineId?: string

  // Visual / UX
  rowColorOverride?: string
  collapsed?: boolean
  /** Value used when grouping by a custom field or project/team. */
  groupByFieldValue?: string
}

// Dependencies
export type DependencyType = 'FS' | 'FF' | 'SS' | 'SF'

export interface DependencyLag {
  value: number
  unit: 'minute' | 'hour' | 'day'
}

export interface Dependency {
  id: string
  fromTaskId: string
  toTaskId: string
  type: DependencyType
  lag?: DependencyLag
  isCrossProject?: boolean
  /** Soft constraints may be allowed to violate schedule with warnings only. */
  isSoftConstraint?: boolean
}

// Baselines
export interface BaselineTaskSnapshot {
  taskId: string
  start: string | Date
  end: string | Date
  durationDays?: number
  statusAtBaseline?: TaskStatus
}

export interface Baseline {
  id: string
  name: string
  createdAt: string | Date
  createdBy?: ResourceId
  taskSnapshots: BaselineTaskSnapshot[]
}

// Time & cost summaries
export interface CostSummary {
  scope: { type: 'task' | 'project'; id: string }
  estimatedHoursTotal: number
  actualHoursTotal: number
  estimatedCostTotal: number
  actualCostTotal: number
}

// Saved views & view state
export interface SavedView {
  id: string
  name: string
  ownerId?: ResourceId
  scope: 'personal' | 'team'
  /** Serialized subset of view state. */
  state: Partial<GanttViewState>
}

export interface GanttViewState {
  // Timeline / zoom
  scale: 'day' | 'week' | 'month' | 'quarter'
  zoomLevel: number
  visibleStart: Date
  visibleEnd: Date

  // Layout
  sidebarWidth: number
  rowHeight: number
  taskBarHeight: number

  // Selection / hover
  selectedTaskIds: string[]
  selectedDependencyIds: string[]
  hoveredTaskId?: string

  // Filters
  assigneeFilterIds?: ResourceId[]
  statusFilter?: TaskStatus[]
  tagFilter?: string[]
  dateRangeFilter?: { from?: Date; to?: Date }
  customFieldFilters?: Record<string, unknown>
  textSearch?: string

  // Saved views
  activeViewId?: string
  views: SavedView[]

  // Grouping / portfolio
  groupBy?: 'project' | 'team' | { fieldId: string }

  // Feature toggles
  showCriticalPath: boolean
  showBaselines: boolean
  showNonWorkingShading: boolean
}
