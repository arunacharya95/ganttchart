import React, { useMemo } from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { useGanttStore } from '../state/ganttStore';

export const TimeCostSummary: React.FC = () => {
  const tasks = useGanttStore(state => state.tasks);
  const statusFilter = useGanttStore(state => state.viewState.statusFilter);
  const textSearch = useGanttStore(state => state.viewState.textSearch);

  const { totals, byAssignee } = useMemo(() => {
    const filtered = tasks.filter(task => {
      if (statusFilter && statusFilter.length && task.status && !statusFilter.includes(task.status)) {
        return false;
      }
      if (textSearch && textSearch.trim()) {
        const q = textSearch.toLowerCase();
        if (!task.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    let totalEstimatedHours = 0;
    let totalActualHours = 0;
    let totalEstimatedCost = 0;
    let totalActualCost = 0;

    const assigneeMap = new Map<string, {
      estimatedHours: number;
      actualHours: number;
      estimatedCost: number;
      actualCost: number;
    }>();

    filtered.forEach(task => {
      const estimatedHours = task.estimatedHours ?? 0;
      const actualHours = task.actualHours ?? 0;
      const hourlyRate = task.hourlyRate ?? 0;

      const estimatedCost = estimatedHours * hourlyRate;
      const actualCost = actualHours * hourlyRate;

      totalEstimatedHours += estimatedHours;
      totalActualHours += actualHours;
      totalEstimatedCost += estimatedCost;
      totalActualCost += actualCost;

      (task.assignees ?? []).forEach(assigneeId => {
        const key = String(assigneeId);
        const current = assigneeMap.get(key) ?? {
          estimatedHours: 0,
          actualHours: 0,
          estimatedCost: 0,
          actualCost: 0,
        };
        current.estimatedHours += estimatedHours;
        current.actualHours += actualHours;
        current.estimatedCost += estimatedCost;
        current.actualCost += actualCost;
        assigneeMap.set(key, current);
      });
    });

    const totals = {
      totalEstimatedHours,
      totalActualHours,
      totalEstimatedCost,
      totalActualCost,
    };

    const byAssignee = Array.from(assigneeMap.entries()).map(([assigneeId, value]) => ({
      assigneeId,
      ...value,
    }));

    return { totals, byAssignee };
  }, [tasks, statusFilter, textSearch]);

  if (!tasks.length) return null;

  return (
    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: 'background.paper' }}>
      <Stack direction="row" spacing={4} alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Time & Cost (visible tasks)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Est: {totals.totalEstimatedHours.toFixed(1)}h · {totals.totalEstimatedCost.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Act: {totals.totalActualHours.toFixed(1)}h · {totals.totalActualCost.toFixed(2)}
          </Typography>
        </Box>
        {byAssignee.length > 0 && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              By assignee
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {byAssignee.map(row => (
                <Box key={row.assigneeId} sx={{ minWidth: 140 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {row.assigneeId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Est: {row.estimatedHours.toFixed(1)}h · {row.estimatedCost.toFixed(2)}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Act: {row.actualHours.toFixed(1)}h · {row.actualCost.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default TimeCostSummary;
