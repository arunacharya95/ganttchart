import type { GanttViewState } from '../types/domain';
export declare const useTimeline: () => {
    scale: "day" | "week" | "month" | "quarter";
    zoomLevel: number;
    visibleStart: Date;
    visibleEnd: Date;
    timelineUnits: import("../utils/dateMath").TimelineUnit[];
    setScale: (nextScale: GanttViewState["scale"]) => void;
    setZoomLevel: (nextZoom: number | ((prev: number) => number)) => void;
    setVisibleRange: (start: Date, end: Date) => void;
};
