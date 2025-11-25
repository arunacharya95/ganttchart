import { useSyncExternalStore } from 'react'
import type {
  Task,
  Dependency,
  Baseline,
  Resource,
  Calendar,
  GanttViewState,
} from '../types/domain'

export interface GanttStoreState {
  tasks: Task[]
  dependencies: Dependency[]
  baselines: Baseline[]
  resources: Resource[]
  calendars: Calendar[]
  viewState: GanttViewState
}

export type GanttStoreListener = (state: GanttStoreState) => void

export interface GanttStore {
  getState: () => GanttStoreState
  setState: (partial: Partial<GanttStoreState> | ((prev: GanttStoreState) => Partial<GanttStoreState>)) => void
  subscribe: (listener: GanttStoreListener) => () => void
}

const createInitialViewState = (): GanttViewState => ({
  scale: 'day',
  zoomLevel: 1,
  visibleStart: new Date(),
  visibleEnd: new Date(),
  sidebarWidth: 280,
  rowHeight: 40,
  taskBarHeight: 20,
  selectedTaskIds: [],
  selectedDependencyIds: [],
    criticalTaskIds: [],
  views: [],
  showCriticalPath: false,
  showBaselines: false,
  showNonWorkingShading: true,
})

export const createGanttStore = (initial?: Partial<GanttStoreState>): GanttStore => {
  let state: GanttStoreState = {
    tasks: [],
    dependencies: [],
    baselines: [],
    resources: [],
    calendars: [],
    viewState: {
      ...createInitialViewState(),
      ...(initial?.viewState ?? {}),
    },
    ...initial,
  }

  const listeners = new Set<GanttStoreListener>()

  const getState = () => state

  const setState: GanttStore['setState'] = (partial) => {
    const nextPartial =
      typeof partial === 'function' ? partial(state) : partial

    const next: GanttStoreState = {
      ...state,
      ...nextPartial,
      viewState: {
        ...state.viewState,
        ...(nextPartial.viewState ?? {}),
      },
    }

    if (next === state) return

    state = next
    listeners.forEach((listener) => listener(state))
  }

  const subscribe: GanttStore['subscribe'] = (listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return { getState, setState, subscribe }
}

// Default singleton store used by hooks/components
const defaultStore = createGanttStore()

export const getGanttStore = () => defaultStore

// React hook wrapper compatible with React 18/19
export function useGanttStore<T>(selector: (state: GanttStoreState) => T): T {
  const store = defaultStore

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  )
}

export function useGanttStoreActions() {
  const store = defaultStore
  const recomputeCriticalPath = () => {
      const { tasks, dependencies, viewState } = store.getState()

      if (!tasks.length) {
        store.setState({
          viewState: { ...viewState, criticalTaskIds: [] },
        })
        return
      }

      const byId = new Map<string, Task>()
      tasks.forEach((t) => byId.set(t.id, t))

      const succ = new Map<string, string[]>()
      const preds = new Map<string, string[]>()
      tasks.forEach((t) => {
        succ.set(t.id, [])
        preds.set(t.id, [])
      })

      dependencies.forEach((d) => {
        if (!succ.has(d.fromTaskId)) return
        if (!preds.has(d.toTaskId)) return
        succ.get(d.fromTaskId)!.push(d.toTaskId)
        preds.get(d.toTaskId)!.push(d.fromTaskId)
      })

      const duration = (task: Task): number => {
        const start = task.start
        const end = task.end
        if (!start || !end) return 0
        const s = typeof start === 'string' ? new Date(start) : start
        const e = typeof end === 'string' ? new Date(end) : end
        return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)))
      }

      const inDegree = new Map<string, number>()
      tasks.forEach((t) => inDegree.set(t.id, preds.get(t.id)!.length))

      const topo: string[] = []
      const queue: string[] = []
      inDegree.forEach((deg, id) => {
        if (deg === 0) queue.push(id)
      })

      while (queue.length) {
        const id = queue.shift()!
        topo.push(id)
        succ.get(id)!.forEach((to) => {
          const nextDeg = (inDegree.get(to) || 0) - 1
          inDegree.set(to, nextDeg)
          if (nextDeg === 0) queue.push(to)
        })
      }

      const dist = new Map<string, number>()
      const parent = new Map<string, string | null>()
      tasks.forEach((t) => {
        dist.set(t.id, -Infinity)
        parent.set(t.id, null)
      })

      topo.forEach((id) => {
        const t = byId.get(id)!
        const d = duration(t)
        if ((preds.get(id) || []).length === 0) {
          dist.set(id, d)
        }
        const currentDist = dist.get(id) ?? -Infinity
        succ.get(id)!.forEach((to) => {
          const toTask = byId.get(to)!
          const cand = currentDist + duration(toTask)
          if (cand > (dist.get(to) ?? -Infinity)) {
            dist.set(to, cand)
            parent.set(to, id)
          }
        })
      })

      let endId: string | null = null
      let best = -Infinity
      dist.forEach((value, id) => {
        if (value > best) {
          best = value
          endId = id
        }
      })

      const criticalIds: string[] = []
      let cursor: string | null = endId
      while (cursor) {
        criticalIds.unshift(cursor)
        const next = parent.get(cursor)
        cursor = next === undefined ? null : next
      }

      store.setState({
        viewState: { ...viewState, criticalTaskIds: criticalIds },
      })
    }

  return {
    setState: store.setState,
    getState: store.getState,
    recomputeCriticalPath,
  }
}
