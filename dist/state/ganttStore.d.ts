import type { Task, Dependency, Baseline, Resource, Calendar, GanttViewState } from '../types/domain';
export interface GanttStoreState {
    tasks: Task[];
    dependencies: Dependency[];
    baselines: Baseline[];
    resources: Resource[];
    calendars: Calendar[];
    viewState: GanttViewState;
}
export type GanttStoreListener = (state: GanttStoreState) => void;
export interface GanttStore {
    getState: () => GanttStoreState;
    setState: (partial: Partial<GanttStoreState> | ((prev: GanttStoreState) => Partial<GanttStoreState>)) => void;
    subscribe: (listener: GanttStoreListener) => () => void;
}
export declare const createGanttStore: (initial?: Partial<GanttStoreState>) => GanttStore;
export declare const getGanttStore: () => GanttStore;
export declare function useGanttStore<T>(selector: (state: GanttStoreState) => T): T;
export declare function useGanttStoreActions(): {
    setState: (partial: Partial<GanttStoreState> | ((prev: GanttStoreState) => Partial<GanttStoreState>)) => void;
    getState: () => GanttStoreState;
};
