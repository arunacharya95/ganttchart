import type { Calendar, Task } from '../types/domain';
export type TimelineScale = 'day' | 'week' | 'month' | 'quarter';
export declare const normalizeDate: (value: string | Date) => Date;
export declare const isWorkingDay: (date: Date, calendar: Calendar) => boolean;
export declare const addWorkingDays: (start: Date, days: number, calendar: Calendar) => Date;
export declare const getTimelineRange: (tasks: Task[], scale: TimelineScale) => {
    start: Date;
    end: Date;
};
export interface TimelineUnit {
    start: Date;
    end: Date;
}
export declare const generateTimelineUnits: (start: Date, end: Date, scale: TimelineScale) => TimelineUnit[];
