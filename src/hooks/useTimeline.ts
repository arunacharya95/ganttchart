import { useCallback, useMemo } from 'react'
import { useGanttStore, useGanttStoreActions } from '../state/ganttStore'
import type { GanttViewState } from '../types/domain'
import { getTimelineRange, generateTimelineUnits } from '../utils/dateMath'
import type { TimelineScale } from '../utils/dateMath'

export const useTimeline = () => {
  const { setState } = useGanttStoreActions()

  const tasks = useGanttStore((s) => s.tasks)
  const viewState = useGanttStore((s) => s.viewState)

  const { scale, zoomLevel, visibleStart, visibleEnd } = viewState

  const fullRange = useMemo(() => getTimelineRange(tasks, scale as TimelineScale), [tasks, scale])

  const effectiveStart = visibleStart || fullRange.start
  const effectiveEnd = visibleEnd || fullRange.end

  const timelineUnits = useMemo(
    () => generateTimelineUnits(effectiveStart, effectiveEnd, scale as TimelineScale),
    [effectiveStart, effectiveEnd, scale],
  )

  const setScale = useCallback(
    (nextScale: GanttViewState['scale']) => {
      setState((prev) => ({
        viewState: {
          ...prev.viewState,
          scale: nextScale,
          visibleStart: fullRange.start,
          visibleEnd: fullRange.end,
        },
      }))
    },
    [setState, fullRange.start, fullRange.end],
  )

  const setZoomLevel = useCallback(
    (nextZoom: number | ((prev: number) => number)) => {
      setState((prev) => {
        const current = prev.viewState.zoomLevel
        const value = typeof nextZoom === 'function' ? nextZoom(current) : nextZoom
        const clamped = Math.min(Math.max(value, 0.25), 4)

        return {
          viewState: {
            ...prev.viewState,
            zoomLevel: clamped,
          },
        }
      })
    },
    [setState],
  )

  const setVisibleRange = useCallback(
    (start: Date, end: Date) => {
      setState((prev) => ({
        viewState: {
          ...prev.viewState,
          visibleStart: start,
          visibleEnd: end,
        },
      }))
    },
    [setState],
  )

  return {
    scale,
    zoomLevel,
    visibleStart: effectiveStart,
    visibleEnd: effectiveEnd,
    timelineUnits,
    setScale,
    setZoomLevel,
    setVisibleRange,
  }
}
