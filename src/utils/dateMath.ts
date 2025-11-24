import {
  addDays,
  isWeekend,
  startOfDay,
  endOfDay,
  min as minDate,
  max as maxDate,
} from 'date-fns'
import type { Calendar, Task } from '../types/domain'

export type TimelineScale = 'day' | 'week' | 'month' | 'quarter'

export const normalizeDate = (value: string | Date): Date => {
  const d = typeof value === 'string' ? new Date(value) : value
  return startOfDay(d)
}

export const isWorkingDay = (date: Date, calendar: Calendar): boolean => {
  const d = startOfDay(date)
  const iso = d.toISOString().slice(0, 10)

  const isWeekendDay = calendar.weekendDays.includes(d.getDay()) || isWeekend(d)
  const isHoliday = calendar.holidays.includes(iso)
  const hasGlobalPTO = calendar.personalTimeOff.some((r) => !r.resourceId && r.date.startsWith(iso))

  return !isWeekendDay && !isHoliday && !hasGlobalPTO
}

export const addWorkingDays = (
  start: Date,
  days: number,
  calendar: Calendar,
): Date => {
  let current = startOfDay(start)
  let remaining = days
  const step = days >= 0 ? 1 : -1

  while (remaining !== 0) {
    current = addDays(current, step)
    if (isWorkingDay(current, calendar)) {
      remaining -= step
    }
  }

  return current
}

export const getTimelineRange = (
  tasks: Task[],
  scale: TimelineScale,
): { start: Date; end: Date } => {
  if (tasks.length === 0) {
    const today = startOfDay(new Date())
    return { start: today, end: addDays(today, 30) }
  }

  const starts = tasks.map((t) => normalizeDate(t.start))
  const ends = tasks.map((t) => normalizeDate(t.end))

  let start = starts.reduce((a, b) => minDate([a, b]))
  let end = ends.reduce((a, b) => maxDate([a, b]))

  // pad range a bit depending on scale
  if (scale === 'day') {
    start = addDays(start, -3)
    end = addDays(end, 3)
  } else if (scale === 'week') {
    start = addDays(start, -14)
    end = addDays(end, 14)
  } else if (scale === 'month') {
    start = addDays(start, -30)
    end = addDays(end, 30)
  } else if (scale === 'quarter') {
    start = addDays(start, -90)
    end = addDays(end, 90)
  }

  return { start: startOfDay(start), end: endOfDay(end) }
}

export interface TimelineUnit {
  start: Date
  end: Date
}

export const generateTimelineUnits = (
  start: Date,
  end: Date,
  scale: TimelineScale,
): TimelineUnit[] => {
  const units: TimelineUnit[] = []
  let cursor = startOfDay(start)
  const endDay = startOfDay(end)

  while (cursor <= endDay) {
    if (scale === 'day') {
      const unitStart = cursor
      const unitEnd = endOfDay(cursor)
      units.push({ start: unitStart, end: unitEnd })
      cursor = addDays(cursor, 1)
    } else if (scale === 'week') {
      const unitStart = cursor
      const unitEnd = endOfDay(addDays(cursor, 6))
      units.push({ start: unitStart, end: unitEnd })
      cursor = addDays(cursor, 7)
    } else if (scale === 'month') {
      const unitStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
      const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
      const unitEnd = endOfDay(addDays(nextMonth, -1))
      units.push({ start: unitStart, end: unitEnd })
      cursor = nextMonth
    } else {
      // quarter
      const quarter = Math.floor(cursor.getMonth() / 3)
      const unitStart = new Date(cursor.getFullYear(), quarter * 3, 1)
      const nextQuarter = new Date(cursor.getFullYear(), (quarter + 1) * 3, 1)
      const unitEnd = endOfDay(addDays(nextQuarter, -1))
      units.push({ start: unitStart, end: unitEnd })
      cursor = nextQuarter
    }
  }

  return units
}
