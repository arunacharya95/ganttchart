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
  return {
    setState: store.setState,
    getState: store.getState,
  }
}
