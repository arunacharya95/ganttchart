import Wn, { jsxs as z, jsx as b, Fragment as Kr } from "react/jsx-runtime";
import * as ee from "react";
import He, { useState as Oe, useRef as Ae, useEffect as No, useMemo as Fe, useSyncExternalStore as zo, useCallback as ur } from "react";
import { differenceInDays as Fn, addDays as me, isWeekend as Lo, format as nt, getWeek as Xr, startOfDay as wt, min as jo, max as Wo, endOfDay as xt, differenceInCalendarDays as dr } from "date-fns";
import { Box as we, Stack as fr, Typography as rt, ToggleButtonGroup as Fo, ToggleButton as It, IconButton as Jr, Tooltip as Bo, List as Uo, ListItem as Bn, ListItemText as Un, Paper as Vo } from "@mui/material";
import Yo from "@emotion/styled";
import { CacheProvider as qo, Global as Ho, ThemeContext as Go, css as Ko, keyframes as Xo } from "@emotion/react";
const qe = (e) => typeof e == "string" ? new Date(e) : e;
function Cr(e, t, r, n) {
  if (n !== void 0 && r instanceof Date) {
    const c = e, u = r, d = new Date(c.startDate || c.start), h = new Date(c.endDate || c.end), f = (R) => {
      const _ = new Date(R);
      return _.setHours(0, 0, 0, 0), _;
    }, l = f(t), p = f(d), m = f(h), a = 24 * 60 * 60 * 1e3, y = Math.round((p.getTime() - l.getTime()) / a), x = Math.round((m.getTime() - p.getTime()) / a) + 1, E = Math.round((u.getTime() - l.getTime()) / a) + 1, S = n / E, O = y * S, g = x * S;
    return { left: O, width: Math.max(g, S) };
  }
  const o = e, i = r;
  return Fn(o, t) * i;
}
const Jo = (e) => {
  if (e.length === 0) {
    const o = /* @__PURE__ */ new Date();
    o.setHours(0, 0, 0, 0);
    const i = new Date(o);
    return i.setDate(i.getDate() + 7), { start: o, end: i };
  }
  const t = e.flatMap((o) => [
    new Date(o.startDate || o.start),
    new Date(o.endDate || o.end)
  ]), r = new Date(Math.min(...t.map((o) => o.getTime()))), n = new Date(Math.max(...t.map((o) => o.getTime())));
  return r.setHours(0, 0, 0, 0), n.setHours(0, 0, 0, 0), { start: r, end: n };
}, Zo = (e, t, r) => {
  const n = [], o = new Date(e);
  for (o.setHours(0, 0, 0, 0); o <= t; ) {
    const i = new Date(o);
    let s, c;
    if (r === "day")
      c = o.toLocaleDateString("en-US", { month: "short", day: "numeric" }), s = new Date(o), s.setDate(s.getDate() + 1);
    else if (r === "week") {
      const u = new Date(o);
      u.setDate(u.getDate() + 7), c = `Week ${Math.ceil((o.getTime() - new Date(o.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1e3))}`, s = u;
    } else r === "quarter" ? (c = `Q${Math.floor(o.getMonth() / 3) + 1} ${o.getFullYear()}`, s = new Date(o.getFullYear(), o.getMonth() + 3, 1)) : (c = o.toLocaleDateString("en-US", { month: "short", year: "numeric" }), s = new Date(o.getFullYear(), o.getMonth() + 1, 1));
    n.push({ label: c, startDate: i, endDate: s }), r === "day" ? o.setDate(o.getDate() + 1) : r === "week" ? o.setDate(o.getDate() + 7) : r === "quarter" ? o.setMonth(o.getMonth() + 3) : o.setMonth(o.getMonth() + 1);
  }
  return n;
}, jl = (e) => e.map((t) => {
  let r = 0;
  t.progress && (typeof t.progress == "string" ? r = parseInt(t.progress.replace("%", "")) : typeof t.progress == "number" && (r = t.progress));
  let n = "Not Started";
  return r === 100 ? n = "Done" : r > 0 && (n = "In Progress"), {
    // Map API fields to GanttTask format
    id: t._id || t.id,
    name: t.title || t.name,
    start: t.startDate || t.start,
    end: t.endDate || t.end,
    status: n,
    progress: r,
    assignedTo: Array.isArray(t.assignees) ? t.assignees[0] : t.assignedTo,
    // Preserve original data for reference
    _original: t
  };
}), Wl = (e, t) => {
  const r = {};
  return t.name !== void 0 && (r.title = t.name), t.start !== void 0 && (r.startDate = t.start), t.end !== void 0 && (r.endDate = t.end), t.progress !== void 0 && (r.progress = `${t.progress}%`), t.assignedTo !== void 0 && (r.assignees = [t.assignedTo]), r;
}, Qo = (e, t = /* @__PURE__ */ new Set()) => {
  const r = [], n = (o, i = 0, s = !0) => {
    const c = !!o.subtasks && o.subtasks.length > 0, u = o.isExpanded ?? t.has(o.id), d = i === 0 || s;
    r.push({
      ...o,
      level: i,
      hasChildren: c,
      isVisible: d,
      isExpanded: u
    }), c && u && d && o.subtasks.forEach((h) => {
      n(h, i + 1, !0);
    });
  };
  return e.forEach((o) => n(o)), r.filter((o) => o.isVisible);
}, es = (e, t) => {
  const r = new Set(t);
  return r.has(e) ? r.delete(e) : r.add(e), r;
}, ts = (e, t) => {
  const r = [], n = (o) => {
    o.forEach((i) => {
      i.id !== t && (r.push(i), i.subtasks && i.subtasks.length > 0 && n(i.subtasks));
    });
  };
  return n(e), r;
}, rs = (e, t) => {
  for (const r of e) {
    if (r.id === t)
      return r;
    if (r.subtasks && r.subtasks.length > 0) {
      const n = rs(r.subtasks, t);
      if (n) return n;
    }
  }
  return null;
}, ns = (e, t, r) => e.map((n) => n.id === t ? { ...n, ...r } : n.subtasks && n.subtasks.length > 0 ? {
  ...n,
  subtasks: ns(n.subtasks, t, r)
} : n), os = (e, t, r) => e.map((n) => {
  if (n.id === t) {
    const o = n.subtasks || [];
    return {
      ...n,
      subtasks: [...o, { ...r, parentId: t }],
      isExpanded: !0
      // Auto-expand when adding subtask
    };
  }
  return n.subtasks && n.subtasks.length > 0 ? {
    ...n,
    subtasks: os(n.subtasks, t, r)
  } : n;
}), ss = (e) => {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  e.forEach((l) => {
    t.set(l.id, l), r.set(l.id, 0), n.set(l.id, []);
  }), e.forEach((l) => {
    l.dependencies && l.dependencies.length > 0 && l.dependencies.forEach((p) => {
      const m = n.get(p) || [];
      m.push(l.id), n.set(p, m), r.set(l.id, (r.get(l.id) || 0) + 1);
    });
  });
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = [];
  for (e.forEach((l) => {
    if (r.get(l.id) === 0) {
      s.push(l.id);
      const p = qe(l.start || l.startDate).getTime();
      o.set(l.id, p), i.set(l.id, qe(l.end || l.endDate).getTime());
    }
  }); s.length > 0; ) {
    const l = s.shift();
    (n.get(l) || []).forEach((m) => {
      const a = i.get(l), y = t.get(m), x = qe(y.end || y.endDate).getTime() - qe(y.start || y.startDate).getTime(), E = Math.max(
        o.get(m) || 0,
        a
      );
      o.set(m, E), i.set(m, E + x), r.set(m, (r.get(m) || 0) - 1), r.get(m) === 0 && s.push(m);
    });
  }
  let c = 0;
  e.forEach((l) => {
    const p = i.get(l.id) || 0;
    p > c && (c = p);
  });
  const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
  e.forEach((l) => {
    if ((n.get(l.id) || []).length === 0) {
      d.set(l.id, c);
      const p = qe(l.end || l.endDate).getTime() - qe(l.start || l.startDate).getTime();
      u.set(l.id, c - p);
    }
  });
  const h = e.filter((l) => (n.get(l.id) || []).length === 0).map((l) => l.id), f = /* @__PURE__ */ new Set();
  for (; h.length > 0; ) {
    const l = h.shift();
    if (f.has(l)) continue;
    f.add(l);
    const p = t.get(l), m = u.get(l);
    p.dependencies && p.dependencies.forEach((a) => {
      const y = t.get(a), x = qe(y.end || y.endDate).getTime() - qe(y.start || y.startDate).getTime(), E = Math.min(
        d.get(a) || Number.MAX_SAFE_INTEGER,
        m
      );
      d.set(a, E), u.set(a, E - x), h.push(a);
    });
  }
  return e.map((l) => {
    const p = o.get(l.id) || 0, a = (u.get(l.id) || 0) - p;
    return {
      ...l,
      isCritical: Math.abs(a) < 1e3
      // Within 1 second (accounting for rounding)
    };
  });
}, is = (e, t = 20) => e * t, as = (e, t) => {
  if (!t || t.length === 0) return !1;
  const r = nt(e, "yyyy-MM-dd");
  return t.includes(r);
}, Zr = (e, t, r = !0) => {
  let n = new Date(e), o = 0;
  for (; o < 365; ) {
    const i = !r && Lo(n), s = as(n, t);
    if (!i && !s)
      return n;
    n = me(n, 1), o++;
  }
  return n;
}, cs = (e, t, r, n, o = !0) => {
  const i = (l) => l.map((p) => ({
    ...p,
    subtasks: p.subtasks ? i(p.subtasks) : void 0
  })), s = i(e), c = /* @__PURE__ */ new Map(), u = (l) => {
    l.forEach((p) => {
      c.set(p.id, p), p.subtasks && u(p.subtasks);
    });
  };
  u(s);
  const d = /* @__PURE__ */ new Map();
  t.forEach((l) => {
    const p = d.get(l.from) || [];
    p.push(l), d.set(l.from, p);
  });
  const h = [r], f = /* @__PURE__ */ new Set();
  for (; h.length > 0; ) {
    const l = h.shift();
    if (f.has(l)) continue;
    f.add(l);
    const p = c.get(l);
    if (!p) continue;
    (d.get(l) || []).forEach((a) => {
      const y = c.get(a.to);
      if (!y || y.isLocked) return;
      let x = new Date(y.start || y.startDate);
      const E = new Date(p.start || p.startDate), S = new Date(p.end || p.endDate);
      let O = !1;
      if (a.type === "FS" ? x < S && (x = Zr(me(S, 1), n, o), O = !0) : a.type === "SS" ? x < E && (x = Zr(E, n, o), O = !0) : a.type, O) {
        const g = Fn(
          new Date(y.end || y.endDate),
          new Date(y.start || y.startDate)
        ), R = me(x, g);
        y.start = x.toISOString(), y.end = R.toISOString(), "startDate" in y && (y.startDate = y.start), "endDate" in y && (y.endDate = y.end), h.push(y.id);
      }
    });
  }
  return s;
}, ls = ({ units: e, chartWidth: t, unitWidth: r }) => {
  const n = {};
  let o = "", i = 0;
  return e.forEach((s, c) => {
    const u = nt(s.startDate, "MMMM yyyy");
    u !== o && (o = u, i = c, n[o] = { units: [], start: i }), n[o].units.push(s);
  }), /* @__PURE__ */ z("div", { style: { backgroundColor: "#fff" }, children: [
    /* @__PURE__ */ b("div", { style: {
      display: "flex",
      borderBottom: "1px solid #d1d5db",
      backgroundColor: "#f9fafb",
      height: "32px"
    }, children: Object.entries(n).map(([s, c], u) => /* @__PURE__ */ b(
      "div",
      {
        style: {
          width: `${c.units.length * r}px`,
          minWidth: `${c.units.length * r}px`,
          padding: "6px 8px",
          textAlign: "center",
          fontSize: "11px",
          fontWeight: 600,
          color: "#374151",
          borderRight: "1px solid #d1d5db",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        },
        children: s
      },
      u
    )) }),
    /* @__PURE__ */ b("div", { style: {
      display: "flex",
      borderBottom: "1px solid #d1d5db",
      backgroundColor: "#fafafa",
      height: "24px"
    }, children: e.map((s, c) => {
      const u = Xr(s.startDate), d = c === 0 || Xr(e[c - 1].startDate) !== u;
      return /* @__PURE__ */ b(
        "div",
        {
          style: {
            width: `${r}px`,
            minWidth: `${r}px`,
            padding: "4px 2px",
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 500,
            color: "#6b7280",
            borderRight: "1px solid #e5e7eb",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: d ? `Week ${u}` : ""
        },
        c
      );
    }) }),
    /* @__PURE__ */ b("div", { style: {
      display: "flex",
      borderBottom: "2px solid #d1d5db",
      backgroundColor: "#fff",
      height: "28px"
    }, children: e.map((s, c) => {
      const u = s.startDate, d = nt(u, "EEEEEE"), h = nt(u, "d"), f = (/* @__PURE__ */ new Date()).toDateString() === u.toDateString(), l = u.getDay() === 0 || u.getDay() === 6;
      return /* @__PURE__ */ z(
        "div",
        {
          style: {
            width: `${r}px`,
            minWidth: `${r}px`,
            padding: "4px 2px",
            textAlign: "center",
            fontSize: "11px",
            fontWeight: f ? 700 : 500,
            color: f ? "#fff" : l ? "#9ca3af" : "#374151",
            backgroundColor: f ? "#3b82f6" : "transparent",
            borderRight: "1px solid #e5e7eb",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1px"
          },
          children: [
            /* @__PURE__ */ b("span", { style: { fontSize: "9px", opacity: 0.8 }, children: d }),
            /* @__PURE__ */ b("span", { children: h })
          ]
        },
        c
      );
    }) })
  ] });
}, us = ({
  tasks: e,
  rowHeight: t,
  onToggleExpand: r,
  columns: n,
  headerHeight: o = 40
}) => {
  const i = n || [{ id: "name", label: "Task Name", width: 280 }];
  return /* @__PURE__ */ b("div", { style: { minWidth: "fit-content" }, children: e.map((s) => {
    const c = s.hasChildren;
    return /* @__PURE__ */ b(
      "div",
      {
        style: {
          height: `${t}px`,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
          fontSize: "13px",
          color: "#1f2937",
          backgroundColor: c ? "#f0f9ff" : s.level > 0 ? "#fafafa" : "#fff"
        },
        children: i.map((u, d) => {
          const h = d === 0, f = u.width || 100;
          return /* @__PURE__ */ b(
            "div",
            {
              style: {
                width: `${f}px`,
                minWidth: `${f}px`,
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                borderRight: "1px solid #f3f4f6",
                boxSizing: "border-box",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              },
              children: h ? /* @__PURE__ */ z("div", { style: {
                display: "flex",
                alignItems: "center",
                flex: 1,
                paddingLeft: `${is(s.level)}px`,
                gap: "8px",
                overflow: "hidden"
              }, children: [
                /* @__PURE__ */ b(
                  "input",
                  {
                    type: "checkbox",
                    style: {
                      width: "14px",
                      height: "14px",
                      cursor: "pointer",
                      accentColor: "#3b82f6",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ b("div", { style: { width: "16px", display: "flex", justifyContent: "center", flexShrink: 0 }, children: c && /* @__PURE__ */ b(
                  "button",
                  {
                    onClick: () => r == null ? void 0 : r(s.id),
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "10px",
                      color: "#6b7280"
                    },
                    title: s.isExpanded ? "Collapse" : "Expand",
                    children: s.isExpanded ? "▼" : "▶"
                  }
                ) }),
                /* @__PURE__ */ b("span", { style: {
                  fontWeight: c ? 600 : 400,
                  color: c ? "#1e40af" : "#374151",
                  fontSize: "13px",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }, children: u.render ? u.render(s) : s[u.id] })
              ] }) : (
                // Regular column
                /* @__PURE__ */ b("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: u.render ? u.render(s) : s[u.id] })
              )
            },
            `${s.id}-${u.id}`
          );
        })
      },
      s.id
    );
  }) });
}, Vn = {
  default: {
    completed: "#10b981",
    // Green
    inProgress: "#3b82f6",
    // Blue
    notStarted: "#6b7280",
    // Gray
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]
  },
  vivid: {
    completed: "#22c55e",
    // Bright Green
    inProgress: "#3b82f6",
    // Bright Blue
    notStarted: "#94a3b8",
    // Light Gray
    colors: ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899"]
  },
  pastel: {
    completed: "#86efac",
    // Pastel Green
    inProgress: "#93c5fd",
    // Pastel Blue
    notStarted: "#cbd5e1",
    // Pastel Gray
    colors: ["#fca5a5", "#fdba74", "#fcd34d", "#bef264", "#86efac", "#5eead4", "#67e8f9", "#93c5fd", "#a5b4fc", "#c4b5fd", "#f0abfc", "#f9a8d4"]
  },
  warm: {
    completed: "#fb923c",
    // Orange
    inProgress: "#f59e0b",
    // Amber
    notStarted: "#a8a29e",
    // Warm Gray
    colors: ["#dc2626", "#ea580c", "#f59e0b", "#facc15", "#fb923c", "#f87171", "#fbbf24", "#fde047"]
  },
  cool: {
    completed: "#06b6d4",
    // Cyan
    inProgress: "#0ea5e9",
    // Sky Blue
    notStarted: "#94a3b8",
    // Cool Gray
    colors: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#0891b2", "#0284c7", "#2563eb"]
  },
  earth: {
    completed: "#84cc16",
    // Lime
    inProgress: "#a3e635",
    // Light Lime
    notStarted: "#a8a29e",
    // Stone
    colors: ["#78716c", "#a3e635", "#84cc16", "#65a30d", "#facc15", "#eab308", "#ca8a04", "#92400e"]
  },
  ocean: {
    completed: "#14b8a6",
    // Teal
    inProgress: "#06b6d4",
    // Cyan
    notStarted: "#64748b",
    // Slate
    colors: ["#0891b2", "#06b6d4", "#0ea5e9", "#0284c7", "#14b8a6", "#2dd4bf", "#22d3ee", "#38bdf8"]
  },
  forest: {
    completed: "#22c55e",
    // Green
    inProgress: "#10b981",
    // Emerald
    notStarted: "#78716c",
    // Stone
    colors: ["#15803d", "#16a34a", "#22c55e", "#10b981", "#059669", "#84cc16", "#65a30d", "#4d7c0f"]
  }
};
function Fl(e, t) {
  const r = Vn[e];
  return r.colors[t % r.colors.length];
}
function ds(e, t) {
  const r = Vn[e];
  return t === 100 ? r.completed : t > 0 ? r.inProgress : r.notStarted;
}
const fs = ({
  task: e,
  timelineStart: t,
  timelineEnd: r,
  chartWidth: n,
  rowHeight: o,
  index: i,
  onTaskUpdate: s,
  onClick: c,
  onDoubleClick: u,
  getTaskColor: d,
  config: h
}) => {
  const { left: f, width: l } = Cr(e, t, r, n), p = e.progress || 0, a = (() => {
    if (e.color)
      return e.color;
    if (d)
      return d(e);
    if (h) {
      if (h.statusColors && e.status && h.statusColors[e.status])
        return h.statusColors[e.status];
      if (h.assigneeColors && e.assignedTo && h.assigneeColors[e.assignedTo])
        return h.assigneeColors[e.assignedTo];
      if (h.colorPalette) {
        const M = h.colorPalette;
        if (M.colors && M.colors.length > 0)
          return M.colors[i % M.colors.length];
        if (p === 100 && M.completed) return M.completed;
        if (p > 0 && M.inProgress) return M.inProgress;
        if (p === 0 && M.notStarted) return M.notStarted;
        if (M.preset)
          return ds(M.preset, p);
      }
    }
    return p === 100 ? "#10b981" : p > 0 ? "#f97316" : "#94a3b8";
  })(), y = e.isMilestone || !1, x = (h == null ? void 0 : h.showBaseline) && e.baseline, E = (h == null ? void 0 : h.showCriticalPath) && e.isCritical, [S, O] = Oe(!1), [g, R] = Oe(!1), [_, I] = Oe(!1), [re, ce] = Oe({ left: f, width: l }), [de, Z] = Oe(!1), C = Ae({ left: f, width: l, mouseX: 0 }), U = Ae({ left: f, width: l }), fe = Ae(null), pe = Ae({ left: f, width: l }), ue = Ae(null), Te = Ae({ isDragging: S, isResizingLeft: g, isResizingRight: _ });
  Te.current = { isDragging: S, isResizingLeft: g, isResizingRight: _ };
  const je = Ae({ task: e, timelineStart: t, timelineEnd: r, chartWidth: n, onTaskUpdate: s });
  je.current = { task: e, timelineStart: t, timelineEnd: r, chartWidth: n, onTaskUpdate: s }, He.useEffect(() => {
    const M = document.querySelector("[data-gantt-chart-scroll]");
    M && (fe.current = M);
  }, []);
  const v = He.useCallback((M) => {
    const { isDragging: be, isResizingLeft: ke, isResizingRight: Me } = Te.current, { chartWidth: Ve } = je.current;
    !be && !ke && !Me || (ue.current && cancelAnimationFrame(ue.current), ue.current = requestAnimationFrame(() => {
      var D;
      const Ie = ((D = fe.current) == null ? void 0 : D.scrollLeft) || 0, $ = M.clientX + Ie - C.current.mouseX;
      if (Math.abs($) > 3 && Z(!0), be) {
        const Q = Math.max(0, Math.min(C.current.left + $, Ve - C.current.width));
        ce({ left: Q, width: C.current.width }), U.current = { left: Q, width: C.current.width };
      } else if (ke) {
        const Q = Math.max(0, Math.min(C.current.left + $, C.current.left + C.current.width - 20)), ve = C.current.width - (Q - C.current.left);
        ce({ left: Q, width: ve }), U.current = { left: Q, width: ve };
      } else if (Me) {
        const Q = Math.max(20, C.current.width + $);
        ce({ left: C.current.left, width: Q }), U.current = { left: C.current.left, width: Q };
      }
    }));
  }, []), T = He.useCallback(function M(be) {
    const { isDragging: ke, isResizingLeft: Me, isResizingRight: Ve } = Te.current, { onTaskUpdate: Ie, task: Ye, timelineStart: $, timelineEnd: D, chartWidth: Q } = je.current;
    if (ue.current && cancelAnimationFrame(ue.current), document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", M), document.body.style.userSelect = "", document.body.style.cursor = "", (ke || Me || Ve) && (Math.abs(U.current.left - C.current.left) > 2 || Math.abs(U.current.width - C.current.width) > 2) && Ie) {
      const se = Math.max(1, (D.getTime() - $.getTime()) / 864e5), Se = Q / se, tt = Math.round(U.current.left / Se), cr = Math.round(U.current.width / Se), ot = new Date($);
      ot.setDate(ot.getDate() + tt);
      const gt = new Date(ot);
      gt.setDate(gt.getDate() + Math.max(1, cr) - 1);
      const Mt = (lr) => {
        const Io = lr.getFullYear(), Ao = String(lr.getMonth() + 1).padStart(2, "0"), ko = String(lr.getDate()).padStart(2, "0");
        return `${Io}-${Ao}-${ko}`;
      }, Po = Mt(ot), Mo = Mt(gt);
      Ie(String(Ye.id), {
        start: Po,
        end: Mo
      });
    }
    O(!1), R(!1), I(!1);
  }, [v]), L = (M) => {
    M.stopPropagation(), !de && c && c(e);
  }, k = (M) => {
    M.stopPropagation(), u && u(e);
  }, P = (M, be) => {
    var Ve;
    if (M.stopPropagation(), M.preventDefault(), e.isLocked)
      return;
    const ke = ((Ve = fe.current) == null ? void 0 : Ve.scrollLeft) || 0, Me = M.clientX + ke;
    Z(!1), C.current = { left: f, width: l, mouseX: Me }, U.current = { left: f, width: l }, document.addEventListener("mousemove", v), document.addEventListener("mouseup", T), document.body.style.userSelect = "none", document.body.style.cursor = be === "move" ? "grabbing" : "ew-resize", be === "move" ? O(!0) : be === "resize-left" ? R(!0) : be === "resize-right" && I(!0);
  };
  He.useEffect(() => () => {
    document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", T), document.body.style.userSelect = "", document.body.style.cursor = "", ue.current && cancelAnimationFrame(ue.current);
  }, [v, T]), He.useEffect(() => {
    !S && !g && !_ && (pe.current.left !== f || pe.current.width !== l) && (ce({ left: f, width: l }), U.current = { left: f, width: l }, pe.current = { left: f, width: l });
  }, [f, l, S, g, _]);
  const W = S || g || _ ? re.left : f, A = S || g || _ ? re.width : l, j = "level" in e && e.level > 0, F = "hasChildren" in e && e.hasChildren;
  let V = 0, B = 0;
  if (x && e.baseline) {
    const M = Cr(
      { ...e, start: e.baseline.start, end: e.baseline.end },
      t,
      r,
      n
    );
    V = M.left, B = M.width;
  }
  if (y) {
    const M = (h == null ? void 0 : h.milestoneColor) || "#f59e0b", be = o - 20, ke = {
      position: "absolute",
      left: `${W}px`,
      top: `${i * o + 10}px`,
      width: `${be}px`,
      height: `${be}px`,
      backgroundColor: M,
      transform: "rotate(45deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      zIndex: 3
    }, Me = {
      position: "absolute",
      left: `${W + be + 8}px`,
      top: `${i * o + 10}px`,
      height: `${be}px`,
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      fontWeight: 600,
      color: "#374151",
      whiteSpace: "nowrap"
    };
    return /* @__PURE__ */ z(Kr, { children: [
      /* @__PURE__ */ b(
        "div",
        {
          "data-task-bar": "true",
          style: ke,
          title: `Milestone: ${e.name} - ${new Date(e.start || e.startDate).toLocaleDateString()}`,
          onClick: L,
          onDoubleClick: k
        }
      ),
      /* @__PURE__ */ b("div", { style: Me, children: e.name })
    ] });
  }
  const he = {
    position: "absolute",
    left: `${W}px`,
    top: `${i * o + 10}px`,
    width: `${A}px`,
    height: `${o - 20}px`,
    backgroundColor: E ? (h == null ? void 0 : h.criticalPathColor) || "#ef4444" : a,
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: F ? 600 : 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    cursor: e.isLocked ? "not-allowed" : S ? "grabbing" : "grab",
    boxShadow: S || g || _ ? "0 4px 12px rgba(0,0,0,0.15)" : E ? "0 2px 6px rgba(239, 68, 68, 0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
    transition: S || g || _ ? "none" : "transform 0.1s, box-shadow 0.2s",
    userSelect: "none",
    opacity: j ? 0.95 : 1,
    border: F ? "1px solid rgba(255,255,255,0.2)" : E ? "1px solid #dc2626" : "none"
  }, w = {
    position: "absolute",
    left: `${V}px`,
    top: `${i * o + o - 15}px`,
    width: `${B}px`,
    height: "4px",
    backgroundColor: "#9ca3af",
    borderRadius: "2px",
    opacity: (h == null ? void 0 : h.baselineOpacity) || 0.5,
    pointerEvents: "none",
    zIndex: 2
  }, xe = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${p}%`,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    transition: "width 0.3s",
    pointerEvents: "none"
  }, We = (M) => ({
    position: "absolute",
    [M]: 0,
    top: 0,
    bottom: 0,
    width: "10px",
    cursor: "ew-resize",
    zIndex: 2,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }), et = {
    width: "3px",
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "1px",
    opacity: 0,
    transition: "opacity 0.2s"
  };
  return /* @__PURE__ */ z(Kr, { children: [
    x && /* @__PURE__ */ b("div", { style: w }),
    /* @__PURE__ */ b("style", { children: `
        .task-bar:hover .resize-handle .resize-indicator {
          opacity: 1;
        }
      ` }),
    /* @__PURE__ */ z(
      "div",
      {
        "data-task-bar": "true",
        className: "task-bar",
        style: he,
        title: `${e.name} (${new Date(e.start || e.startDate).toLocaleDateString()} - ${new Date(e.end || e.endDate).toLocaleDateString()})${e.isLocked ? " [LOCKED]" : ""}
${e.isLocked ? "Schedule locked" : "Drag to move, drag edges to resize, double-click to edit"}${E ? `
⚠️ CRITICAL PATH` : ""}`,
        onClick: L,
        onMouseDown: (M) => P(M, "move"),
        onDoubleClick: k,
        onMouseEnter: (M) => !S && (M.currentTarget.style.transform = "translateY(-2px)"),
        onMouseLeave: (M) => !S && (M.currentTarget.style.transform = "translateY(0)"),
        children: [
          !e.isLocked && /* @__PURE__ */ b(
            "div",
            {
              className: "resize-handle",
              style: We("left"),
              onMouseDown: (M) => P(M, "resize-left"),
              title: "Drag to change start date",
              children: /* @__PURE__ */ b("div", { className: "resize-indicator", style: et })
            }
          ),
          p > 0 && /* @__PURE__ */ b("div", { style: xe }),
          /* @__PURE__ */ b("span", { style: { position: "relative", zIndex: 1 }, children: e.name }),
          !e.isLocked && /* @__PURE__ */ b(
            "div",
            {
              className: "resize-handle",
              style: We("right"),
              onMouseDown: (M) => P(M, "resize-right"),
              title: "Drag to change end date",
              children: /* @__PURE__ */ b("div", { className: "resize-indicator", style: et })
            }
          )
        ]
      }
    )
  ] });
}, ps = ({
  isOpen: e,
  onClose: t,
  onSave: r,
  initialDate: n,
  editingTask: o,
  allTasks: i = []
}) => {
  const [s, c] = Oe({
    name: "",
    description: "",
    startDate: n || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    endDate: n || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    progress: 0,
    parentId: null
  });
  No(() => {
    o ? c({
      name: o.name,
      description: o.description || "",
      startDate: o.startDate,
      endDate: o.endDate,
      progress: o.progress || 0,
      parentId: o.parentId || null
    }) : e && c({
      name: "",
      description: "",
      startDate: n || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: n || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      progress: 0,
      parentId: null
    });
  }, [o, e, n]);
  const u = (f) => {
    f.preventDefault(), s.name.trim() && (r(o ? { ...o, ...s } : s), t());
  }, d = (f) => {
    const { name: l, value: p, type: m } = f.target;
    c((a) => ({
      ...a,
      [l]: m === "number" ? Number(p) : l === "parentId" && p === "" ? null : p
    }));
  };
  if (!e) return null;
  const h = ts(i, o == null ? void 0 : o.id);
  return /* @__PURE__ */ b("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1e3
  }, children: /* @__PURE__ */ z("div", { style: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  }, children: [
    /* @__PURE__ */ b("h2", { style: { margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600 }, children: o ? "Edit Task" : "Add New Task" }),
    /* @__PURE__ */ z("form", { onSubmit: u, children: [
      /* @__PURE__ */ z("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Task Name *" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "text",
            name: "name",
            value: s.name,
            onChange: d,
            placeholder: "Enter task name",
            required: !0,
            style: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box"
            }
          }
        )
      ] }),
      /* @__PURE__ */ z("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Description" }),
        /* @__PURE__ */ b(
          "textarea",
          {
            name: "description",
            value: s.description,
            onChange: d,
            placeholder: "Enter task description (optional)",
            rows: 3,
            style: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
              fontFamily: "inherit",
              resize: "vertical"
            }
          }
        )
      ] }),
      /* @__PURE__ */ z("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Parent Task (Optional)" }),
        /* @__PURE__ */ z(
          "select",
          {
            name: "parentId",
            value: s.parentId || "",
            onChange: d,
            style: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
              backgroundColor: "#fff"
            },
            children: [
              /* @__PURE__ */ b("option", { value: "", children: "None (Top-level task)" }),
              h.map((f) => /* @__PURE__ */ b("option", { value: f.id, children: f.name }, f.id))
            ]
          }
        ),
        /* @__PURE__ */ b("p", { style: { fontSize: "12px", color: "#6b7280", marginTop: "4px" }, children: "Select a parent task to make this a subtask" })
      ] }),
      /* @__PURE__ */ z("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Start Date *" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "date",
            name: "startDate",
            value: s.startDate,
            onChange: d,
            required: !0,
            style: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box"
            }
          }
        )
      ] }),
      /* @__PURE__ */ z("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "End Date *" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "date",
            name: "endDate",
            value: s.endDate,
            onChange: d,
            required: !0,
            min: s.startDate,
            style: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box"
            }
          }
        )
      ] }),
      /* @__PURE__ */ z("div", { style: { marginBottom: "24px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Progress (%)" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "number",
            name: "progress",
            value: s.progress,
            onChange: d,
            min: "0",
            max: "100",
            style: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box"
            }
          }
        )
      ] }),
      /* @__PURE__ */ z("div", { style: { display: "flex", gap: "12px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ b(
          "button",
          {
            type: "button",
            onClick: t,
            style: {
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: "#fff",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer"
            },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            type: "submit",
            style: {
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer"
            },
            children: o ? "Update Task" : "Add Task"
          }
        )
      ] })
    ] })
  ] }) });
}, hs = ({
  tasks: e,
  dependencies: t = [],
  getTaskPosition: r,
  style: n = "curved",
  color: o = "#94a3b8",
  thickness: i = 2,
  showLabels: s = !1,
  criticalPathEnabled: c = !1,
  criticalPathColor: u = "#ef4444"
}) => {
  const d = (f, l, p = "FS", m = !1) => {
    const a = r(f), y = r(l);
    if (!a || !y) return null;
    e.find((I) => I.id === f), e.find((I) => I.id === l);
    const x = c && m ? u : o;
    let E, S, O, g, R = "";
    switch (p) {
      case "FS":
        E = a.left + a.width, S = a.top + a.height / 2, O = y.left, g = y.top + y.height / 2, R = "FS";
        break;
      case "FF":
        E = a.left + a.width, S = a.top + a.height / 2, O = y.left + y.width, g = y.top + y.height / 2, R = "FF";
        break;
      case "SF":
        E = a.left, S = a.top + a.height / 2, O = y.left + y.width, g = y.top + y.height / 2, R = "SF";
        break;
      case "SS":
        E = a.left, S = a.top + a.height / 2, O = y.left, g = y.top + y.height / 2, R = "SS";
        break;
    }
    const _ = `dep-${f}-${l}-${p}`;
    if (n === "straight")
      return /* @__PURE__ */ z("g", { children: [
        /* @__PURE__ */ b(
          "line",
          {
            x1: E,
            y1: S,
            x2: O,
            y2: g,
            stroke: x,
            strokeWidth: i,
            markerEnd: `url(#arrowhead-${m ? "critical" : "normal"})`
          }
        ),
        s && /* @__PURE__ */ b(
          "text",
          {
            x: (E + O) / 2,
            y: (S + g) / 2 - 5,
            fill: x,
            fontSize: "10",
            fontWeight: "500",
            children: R
          }
        )
      ] }, _);
    {
      const I = (E + O) / 2, re = `
        M ${E} ${S}
        L ${I} ${S}
        L ${I} ${g}
        L ${O} ${g}
      `;
      return /* @__PURE__ */ z("g", { children: [
        /* @__PURE__ */ b(
          "path",
          {
            d: re,
            fill: "none",
            stroke: x,
            strokeWidth: i,
            markerEnd: `url(#arrowhead-${m ? "critical" : "normal"})`
          }
        ),
        s && /* @__PURE__ */ b(
          "text",
          {
            x: I,
            y: (S + g) / 2 - 5,
            fill: x,
            fontSize: "10",
            fontWeight: "500",
            textAnchor: "middle",
            children: R
          }
        )
      ] }, _);
    }
  }, h = [];
  return t && t.length > 0 ? t.forEach((f) => {
    const l = e.find((y) => y.id === f.from), p = e.find((y) => y.id === f.to), m = c && (l == null ? void 0 : l.isCritical) && (p == null ? void 0 : p.isCritical), a = d(f.from, f.to, f.type, m);
    a && h.push(a);
  }) : e.forEach((f) => {
    f.dependencies && f.dependencies.length > 0 && f.dependencies.forEach((l) => {
      const p = e.find((m) => m.id === l);
      if (p) {
        const m = c && (p == null ? void 0 : p.isCritical) && (f == null ? void 0 : f.isCritical), a = d(l, f.id, "FS", m);
        a && h.push(a);
      }
    });
  }), h.length === 0 ? null : /* @__PURE__ */ z(
    "svg",
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      },
      children: [
        /* @__PURE__ */ z("defs", { children: [
          /* @__PURE__ */ b(
            "marker",
            {
              id: "arrowhead-normal",
              markerWidth: "10",
              markerHeight: "10",
              refX: "9",
              refY: "3",
              orient: "auto",
              children: /* @__PURE__ */ b(
                "polygon",
                {
                  points: "0 0, 10 3, 0 6",
                  fill: o
                }
              )
            }
          ),
          /* @__PURE__ */ b(
            "marker",
            {
              id: "arrowhead-critical",
              markerWidth: "10",
              markerHeight: "10",
              refX: "9",
              refY: "3",
              orient: "auto",
              children: /* @__PURE__ */ b(
                "polygon",
                {
                  points: "0 0, 10 3, 0 6",
                  fill: u
                }
              )
            }
          )
        ] }),
        h
      ]
    }
  );
}, Bl = ({
  tasks: e,
  dependencies: t,
  onChange: r,
  onTaskClick: n,
  onTaskDoubleClick: o,
  getTaskColor: i,
  config: s,
  viewMode: c = "day",
  locale: u = "en-US",
  height: d = 600,
  onTaskUpdate: h
}) => {
  const p = Ae(null), m = Ae(null), a = Ae(null), [y, x] = Oe(!1), [E, S] = Oe(""), [O, g] = Oe(null), [R, _] = Oe(/* @__PURE__ */ new Set()), [I, re] = Oe(""), [ce, de] = Oe(c);
  He.useEffect(() => {
    de(c);
  }, [c]);
  const Z = Fe(() => {
    let $ = e;
    if (I) {
      const D = I.toLowerCase(), Q = (ve) => ve.filter((se) => {
        const Se = se.name.toLowerCase().includes(D), tt = se.subtasks ? Q(se.subtasks) : [];
        return Se || tt.length > 0;
      }).map((se) => ({
        ...se,
        subtasks: se.subtasks ? Q(se.subtasks) : void 0,
        isExpanded: !0
        // Auto-expand on filter
      }));
      $ = Q($);
    }
    return s != null && s.showCriticalPath ? ss($) : $;
  }, [e, s == null ? void 0 : s.showCriticalPath, I]), C = Fe(() => Qo(Z, R), [Z, R]), U = Fe(() => Jo(C), [C]), fe = Fe(
    () => Zo(U.start, U.end, ce),
    [U, ce]
  ), pe = () => {
    const $ = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(e, null, 2)), D = document.createElement("a");
    D.setAttribute("href", $), D.setAttribute("download", "gantt-data.json"), document.body.appendChild(D), D.click(), D.remove();
  }, ue = ($) => {
    _((D) => es($, D));
  }, Te = fe.length * 80, je = ($) => {
    m.current && (m.current.scrollTop = $.currentTarget.scrollTop), a.current && (a.current.scrollLeft = $.currentTarget.scrollLeft);
  }, v = ($) => {
    p.current && (p.current.scrollTop = $.currentTarget.scrollTop);
  }, T = ($) => {
    p.current && (p.current.scrollLeft = $.currentTarget.scrollLeft);
  }, L = ($, D) => {
    if (console.log("🔄 GanttChart.handleTaskUpdate called:", { taskId: $, updates: D }), h && h($, D), r) {
      let Q = e.map((ve) => {
        if (ve.id === $) {
          if ("startDate" in ve) {
            const se = { ...ve };
            return Object.keys(D).forEach((Se) => {
              Se === "start" && D.start ? (se.startDate = D.start, se.start = D.start) : Se === "end" && D.end ? (se.endDate = D.end, se.end = D.end) : se[Se] = D[Se];
            }), se;
          }
          return { ...ve, ...D };
        }
        return ve;
      });
      s != null && s.autoSchedule && (Q = cs(
        Q,
        t || [],
        $,
        s.holidays,
        s.showWeekends
      )), r(Q);
    }
  }, k = ($) => {
    var Se;
    if ($.target.closest("[data-task-bar]") || n)
      return;
    const D = $.currentTarget.getBoundingClientRect(), Q = $.clientX - D.left + (((Se = p.current) == null ? void 0 : Se.scrollLeft) || 0), ve = Math.floor(Q / 80), se = fe[ve];
    if (se) {
      const tt = se.startDate, cr = tt.getFullYear(), ot = String(tt.getMonth() + 1).padStart(2, "0"), gt = String(tt.getDate()).padStart(2, "0"), Mt = `${cr}-${ot}-${gt}`;
      S(Mt), g(null), x(!0);
    }
  }, P = ($) => {
    g($);
    const D = $.start || $.startDate;
    S(typeof D == "string" ? D : D.toISOString().split("T")[0]), x(!0);
  }, W = ($) => {
    if (r)
      if ("id" in $) {
        const D = e.map(
          (Q) => Q.id === $.id ? $ : Q
        );
        r(D);
      } else {
        const D = {
          name: "",
          start: (/* @__PURE__ */ new Date()).toISOString(),
          end: (/* @__PURE__ */ new Date()).toISOString(),
          ...$,
          id: `task-${Date.now()}`
        };
        r([...e, D]);
      }
    x(!1), g(null);
  }, A = (s == null ? void 0 : s.columns) || [{ id: "name", label: "Task Name", width: 280 }], j = A.reduce(($, D) => $ + (D.width || 100), 0), F = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#fff",
    height: d,
    position: "relative"
  }, V = {
    display: "flex",
    flex: 1,
    overflow: "hidden"
  }, B = {
    width: j,
    borderRight: "1px solid #d1d5db",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#fafafa"
  }, he = {
    height: 84,
    // Match timeline height (32 + 24 + 28)
    borderBottom: "2px solid #d1d5db",
    background: "#f9fafb",
    fontWeight: 500,
    display: "flex",
    alignItems: "flex-end",
    padding: "0 0 8px 0",
    // Removed horizontal padding to align with cells
    fontSize: "11px",
    color: "#6b7280",
    flexShrink: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  }, w = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden"
  }, xe = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, We = {
    overflowX: "auto",
    overflowY: "hidden",
    borderBottom: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    flexShrink: 0
  }, et = {
    flex: 1,
    overflowX: "auto",
    overflowY: "auto"
  }, M = {
    position: "relative",
    height: `${C.length * 50}px`,
    width: `${Te}px`,
    minWidth: "100%",
    backgroundColor: "#fff"
  }, be = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex"
  }, ke = {
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between"
  }, Me = {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  }, Ve = {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "13px",
    width: "200px",
    outline: "none"
  }, Ie = {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "13px",
    backgroundColor: "#fff",
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s"
  }, Ye = {
    ...Ie,
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6"
  };
  return /* @__PURE__ */ z("div", { style: F, children: [
    /* @__PURE__ */ z("div", { style: ke, children: [
      /* @__PURE__ */ z("div", { style: Me, children: [
        /* @__PURE__ */ b(
          "input",
          {
            type: "text",
            placeholder: "Filter tasks...",
            style: Ve,
            value: I,
            onChange: ($) => re($.target.value)
          }
        ),
        /* @__PURE__ */ b("button", { style: Ie, onClick: pe, title: "Export to JSON", children: "Export" })
      ] }),
      /* @__PURE__ */ z("div", { style: Me, children: [
        /* @__PURE__ */ b(
          "button",
          {
            style: ce === "day" ? Ye : Ie,
            onClick: () => de("day"),
            children: "Day"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: ce === "week" ? Ye : Ie,
            onClick: () => de("week"),
            children: "Week"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: ce === "month" ? Ye : Ie,
            onClick: () => de("month"),
            children: "Month"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: ce === "quarter" ? Ye : Ie,
            onClick: () => de("quarter"),
            children: "Quarter"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: Ye,
            onClick: () => {
              a.current && (a.current.scrollLeft = 0);
            },
            children: "Today"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ z("div", { style: V, children: [
      /* @__PURE__ */ z("div", { style: B, children: [
        /* @__PURE__ */ b("div", { style: he, children: A.map(($) => /* @__PURE__ */ b(
          "div",
          {
            style: {
              width: $.width || 100,
              minWidth: $.width || 100,
              padding: "0 8px",
              boxSizing: "border-box",
              borderRight: "1px solid #e5e7eb",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            },
            children: $.label
          },
          $.id
        )) }),
        /* @__PURE__ */ b(
          "div",
          {
            ref: m,
            onScroll: v,
            style: w,
            children: /* @__PURE__ */ b(
              us,
              {
                tasks: C,
                rowHeight: 50,
                onToggleExpand: ue,
                columns: A
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ z("div", { style: xe, children: [
        /* @__PURE__ */ b(
          "div",
          {
            ref: a,
            onScroll: T,
            style: We,
            children: /* @__PURE__ */ b(ls, { units: fe, chartWidth: Te, unitWidth: 80 })
          }
        ),
        /* @__PURE__ */ b(
          "div",
          {
            ref: p,
            "data-gantt-chart-scroll": "true",
            onScroll: je,
            style: et,
            children: /* @__PURE__ */ z(
              "div",
              {
                style: M,
                onClick: k,
                children: [
                  /* @__PURE__ */ b("div", { style: be, children: fe.map(($, D) => /* @__PURE__ */ b(
                    "div",
                    {
                      style: {
                        width: "80px",
                        minWidth: "80px",
                        maxWidth: "80px",
                        borderRight: D < fe.length - 1 ? "1px solid #f3f4f6" : "none",
                        boxSizing: "border-box"
                      }
                    },
                    D
                  )) }),
                  C.map(($, D) => /* @__PURE__ */ b(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: `${D * 50}px`,
                        height: "50px",
                        borderBottom: D < C.length - 1 ? "1px solid #f3f4f6" : "none"
                      }
                    },
                    D
                  )),
                  C.map(($, D) => /* @__PURE__ */ b(
                    fs,
                    {
                      task: $,
                      timelineStart: U.start,
                      timelineEnd: U.end,
                      chartWidth: Te,
                      rowHeight: 50,
                      index: D,
                      onTaskUpdate: L,
                      onClick: n,
                      onDoubleClick: o || (n ? void 0 : P),
                      getTaskColor: i,
                      config: s
                    },
                    $.id
                  )),
                  (s == null ? void 0 : s.showDependencies) !== !1 && /* @__PURE__ */ b(
                    hs,
                    {
                      tasks: C,
                      dependencies: t,
                      getTaskPosition: ($) => {
                        const D = C.findIndex((Se) => Se.id === $);
                        if (D === -1) return null;
                        const Q = C[D], { left: ve, width: se } = Cr(Q, U.start, U.end, Te);
                        return {
                          left: ve,
                          width: se,
                          top: D * 50 + 10,
                          height: 30
                        };
                      },
                      style: s == null ? void 0 : s.dependencyStyle,
                      color: s == null ? void 0 : s.dependencyColor,
                      thickness: s == null ? void 0 : s.dependencyThickness,
                      showLabels: s == null ? void 0 : s.showDependencyLabels,
                      criticalPathEnabled: s == null ? void 0 : s.showCriticalPath,
                      criticalPathColor: s == null ? void 0 : s.criticalPathColor
                    }
                  )
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ b(
      ps,
      {
        isOpen: y,
        onClose: () => {
          x(!1), g(null);
        },
        onSave: W,
        initialDate: E,
        editingTask: O,
        allTasks: e
      }
    )
  ] });
};
function ms(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ue(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var r = function n() {
      return this instanceof n ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(e).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(e, n);
    Object.defineProperty(r, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[n];
      }
    });
  }), r;
}
var Ar = {}, Yn = { exports: {} };
(function(e) {
  function t(r) {
    return r && r.__esModule ? r : {
      default: r
    };
  }
  e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports;
})(Yn);
var Gt = Yn.exports, pr = {};
function K() {
  return K = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, K.apply(null, arguments);
}
function Ge(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function qn(e) {
  if (/* @__PURE__ */ ee.isValidElement(e) || !Ge(e))
    return e;
  const t = {};
  return Object.keys(e).forEach((r) => {
    t[r] = qn(e[r]);
  }), t;
}
function ze(e, t, r = {
  clone: !0
}) {
  const n = r.clone ? K({}, e) : e;
  return Ge(e) && Ge(t) && Object.keys(t).forEach((o) => {
    /* @__PURE__ */ ee.isValidElement(t[o]) ? n[o] = t[o] : Ge(t[o]) && // Avoid prototype pollution
    Object.prototype.hasOwnProperty.call(e, o) && Ge(e[o]) ? n[o] = ze(e[o], t[o], r) : r.clone ? n[o] = Ge(t[o]) ? qn(t[o]) : t[o] : n[o] = t[o];
  }), n;
}
const ys = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ze,
  isPlainObject: Ge
}, Symbol.toStringTag, { value: "Module" }));
var $r = { exports: {} }, At = { exports: {} }, H = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qr;
function gs() {
  if (Qr) return H;
  Qr = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, c = e ? Symbol.for("react.context") : 60110, u = e ? Symbol.for("react.async_mode") : 60111, d = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, f = e ? Symbol.for("react.suspense") : 60113, l = e ? Symbol.for("react.suspense_list") : 60120, p = e ? Symbol.for("react.memo") : 60115, m = e ? Symbol.for("react.lazy") : 60116, a = e ? Symbol.for("react.block") : 60121, y = e ? Symbol.for("react.fundamental") : 60117, x = e ? Symbol.for("react.responder") : 60118, E = e ? Symbol.for("react.scope") : 60119;
  function S(g) {
    if (typeof g == "object" && g !== null) {
      var R = g.$$typeof;
      switch (R) {
        case t:
          switch (g = g.type, g) {
            case u:
            case d:
            case n:
            case i:
            case o:
            case f:
              return g;
            default:
              switch (g = g && g.$$typeof, g) {
                case c:
                case h:
                case m:
                case p:
                case s:
                  return g;
                default:
                  return R;
              }
          }
        case r:
          return R;
      }
    }
  }
  function O(g) {
    return S(g) === d;
  }
  return H.AsyncMode = u, H.ConcurrentMode = d, H.ContextConsumer = c, H.ContextProvider = s, H.Element = t, H.ForwardRef = h, H.Fragment = n, H.Lazy = m, H.Memo = p, H.Portal = r, H.Profiler = i, H.StrictMode = o, H.Suspense = f, H.isAsyncMode = function(g) {
    return O(g) || S(g) === u;
  }, H.isConcurrentMode = O, H.isContextConsumer = function(g) {
    return S(g) === c;
  }, H.isContextProvider = function(g) {
    return S(g) === s;
  }, H.isElement = function(g) {
    return typeof g == "object" && g !== null && g.$$typeof === t;
  }, H.isForwardRef = function(g) {
    return S(g) === h;
  }, H.isFragment = function(g) {
    return S(g) === n;
  }, H.isLazy = function(g) {
    return S(g) === m;
  }, H.isMemo = function(g) {
    return S(g) === p;
  }, H.isPortal = function(g) {
    return S(g) === r;
  }, H.isProfiler = function(g) {
    return S(g) === i;
  }, H.isStrictMode = function(g) {
    return S(g) === o;
  }, H.isSuspense = function(g) {
    return S(g) === f;
  }, H.isValidElementType = function(g) {
    return typeof g == "string" || typeof g == "function" || g === n || g === d || g === i || g === o || g === f || g === l || typeof g == "object" && g !== null && (g.$$typeof === m || g.$$typeof === p || g.$$typeof === s || g.$$typeof === c || g.$$typeof === h || g.$$typeof === y || g.$$typeof === x || g.$$typeof === E || g.$$typeof === a);
  }, H.typeOf = S, H;
}
var G = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var en;
function bs() {
  return en || (en = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, c = e ? Symbol.for("react.context") : 60110, u = e ? Symbol.for("react.async_mode") : 60111, d = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, f = e ? Symbol.for("react.suspense") : 60113, l = e ? Symbol.for("react.suspense_list") : 60120, p = e ? Symbol.for("react.memo") : 60115, m = e ? Symbol.for("react.lazy") : 60116, a = e ? Symbol.for("react.block") : 60121, y = e ? Symbol.for("react.fundamental") : 60117, x = e ? Symbol.for("react.responder") : 60118, E = e ? Symbol.for("react.scope") : 60119;
    function S(w) {
      return typeof w == "string" || typeof w == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      w === n || w === d || w === i || w === o || w === f || w === l || typeof w == "object" && w !== null && (w.$$typeof === m || w.$$typeof === p || w.$$typeof === s || w.$$typeof === c || w.$$typeof === h || w.$$typeof === y || w.$$typeof === x || w.$$typeof === E || w.$$typeof === a);
    }
    function O(w) {
      if (typeof w == "object" && w !== null) {
        var xe = w.$$typeof;
        switch (xe) {
          case t:
            var We = w.type;
            switch (We) {
              case u:
              case d:
              case n:
              case i:
              case o:
              case f:
                return We;
              default:
                var et = We && We.$$typeof;
                switch (et) {
                  case c:
                  case h:
                  case m:
                  case p:
                  case s:
                    return et;
                  default:
                    return xe;
                }
            }
          case r:
            return xe;
        }
      }
    }
    var g = u, R = d, _ = c, I = s, re = t, ce = h, de = n, Z = m, C = p, U = r, fe = i, pe = o, ue = f, Te = !1;
    function je(w) {
      return Te || (Te = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), v(w) || O(w) === u;
    }
    function v(w) {
      return O(w) === d;
    }
    function T(w) {
      return O(w) === c;
    }
    function L(w) {
      return O(w) === s;
    }
    function k(w) {
      return typeof w == "object" && w !== null && w.$$typeof === t;
    }
    function P(w) {
      return O(w) === h;
    }
    function W(w) {
      return O(w) === n;
    }
    function A(w) {
      return O(w) === m;
    }
    function j(w) {
      return O(w) === p;
    }
    function F(w) {
      return O(w) === r;
    }
    function V(w) {
      return O(w) === i;
    }
    function B(w) {
      return O(w) === o;
    }
    function he(w) {
      return O(w) === f;
    }
    G.AsyncMode = g, G.ConcurrentMode = R, G.ContextConsumer = _, G.ContextProvider = I, G.Element = re, G.ForwardRef = ce, G.Fragment = de, G.Lazy = Z, G.Memo = C, G.Portal = U, G.Profiler = fe, G.StrictMode = pe, G.Suspense = ue, G.isAsyncMode = je, G.isConcurrentMode = v, G.isContextConsumer = T, G.isContextProvider = L, G.isElement = k, G.isForwardRef = P, G.isFragment = W, G.isLazy = A, G.isMemo = j, G.isPortal = F, G.isProfiler = V, G.isStrictMode = B, G.isSuspense = he, G.isValidElementType = S, G.typeOf = O;
  }()), G;
}
var tn;
function Hn() {
  return tn || (tn = 1, process.env.NODE_ENV === "production" ? At.exports = gs() : At.exports = bs()), At.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var hr, rn;
function vs() {
  if (rn) return hr;
  rn = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, r = Object.prototype.propertyIsEnumerable;
  function n(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function o() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var s = {}, c = 0; c < 10; c++)
        s["_" + String.fromCharCode(c)] = c;
      var u = Object.getOwnPropertyNames(s).map(function(h) {
        return s[h];
      });
      if (u.join("") !== "0123456789")
        return !1;
      var d = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(h) {
        d[h] = h;
      }), Object.keys(Object.assign({}, d)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return hr = o() ? Object.assign : function(i, s) {
    for (var c, u = n(i), d, h = 1; h < arguments.length; h++) {
      c = Object(arguments[h]);
      for (var f in c)
        t.call(c, f) && (u[f] = c[f]);
      if (e) {
        d = e(c);
        for (var l = 0; l < d.length; l++)
          r.call(c, d[l]) && (u[d[l]] = c[d[l]]);
      }
    }
    return u;
  }, hr;
}
var mr, nn;
function kr() {
  if (nn) return mr;
  nn = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return mr = e, mr;
}
var yr, on;
function Gn() {
  return on || (on = 1, yr = Function.call.bind(Object.prototype.hasOwnProperty)), yr;
}
var gr, sn;
function xs() {
  if (sn) return gr;
  sn = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = kr(), r = {}, n = Gn();
    e = function(i) {
      var s = "Warning: " + i;
      typeof console < "u" && console.error(s);
      try {
        throw new Error(s);
      } catch {
      }
    };
  }
  function o(i, s, c, u, d) {
    if (process.env.NODE_ENV !== "production") {
      for (var h in i)
        if (n(i, h)) {
          var f;
          try {
            if (typeof i[h] != "function") {
              var l = Error(
                (u || "React class") + ": " + c + " type `" + h + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[h] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw l.name = "Invariant Violation", l;
            }
            f = i[h](s, h, u, c, null, t);
          } catch (m) {
            f = m;
          }
          if (f && !(f instanceof Error) && e(
            (u || "React class") + ": type specification of " + c + " `" + h + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof f + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), f instanceof Error && !(f.message in r)) {
            r[f.message] = !0;
            var p = d ? d() : "";
            e(
              "Failed " + c + " type: " + f.message + (p ?? "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (r = {});
  }, gr = o, gr;
}
var br, an;
function Ss() {
  if (an) return br;
  an = 1;
  var e = Hn(), t = vs(), r = kr(), n = Gn(), o = xs(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(c) {
    var u = "Warning: " + c;
    typeof console < "u" && console.error(u);
    try {
      throw new Error(u);
    } catch {
    }
  });
  function s() {
    return null;
  }
  return br = function(c, u) {
    var d = typeof Symbol == "function" && Symbol.iterator, h = "@@iterator";
    function f(v) {
      var T = v && (d && v[d] || v[h]);
      if (typeof T == "function")
        return T;
    }
    var l = "<<anonymous>>", p = {
      array: x("array"),
      bigint: x("bigint"),
      bool: x("boolean"),
      func: x("function"),
      number: x("number"),
      object: x("object"),
      string: x("string"),
      symbol: x("symbol"),
      any: E(),
      arrayOf: S,
      element: O(),
      elementType: g(),
      instanceOf: R,
      node: ce(),
      objectOf: I,
      oneOf: _,
      oneOfType: re,
      shape: Z,
      exact: C
    };
    function m(v, T) {
      return v === T ? v !== 0 || 1 / v === 1 / T : v !== v && T !== T;
    }
    function a(v, T) {
      this.message = v, this.data = T && typeof T == "object" ? T : {}, this.stack = "";
    }
    a.prototype = Error.prototype;
    function y(v) {
      if (process.env.NODE_ENV !== "production")
        var T = {}, L = 0;
      function k(W, A, j, F, V, B, he) {
        if (F = F || l, B = B || j, he !== r) {
          if (u) {
            var w = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw w.name = "Invariant Violation", w;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var xe = F + ":" + j;
            !T[xe] && // Avoid spamming the console because they are often not actionable except for lib authors
            L < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + B + "` prop on `" + F + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), T[xe] = !0, L++);
          }
        }
        return A[j] == null ? W ? A[j] === null ? new a("The " + V + " `" + B + "` is marked as required " + ("in `" + F + "`, but its value is `null`.")) : new a("The " + V + " `" + B + "` is marked as required in " + ("`" + F + "`, but its value is `undefined`.")) : null : v(A, j, F, V, B);
      }
      var P = k.bind(null, !1);
      return P.isRequired = k.bind(null, !0), P;
    }
    function x(v) {
      function T(L, k, P, W, A, j) {
        var F = L[k], V = pe(F);
        if (V !== v) {
          var B = ue(F);
          return new a(
            "Invalid " + W + " `" + A + "` of type " + ("`" + B + "` supplied to `" + P + "`, expected ") + ("`" + v + "`."),
            { expectedType: v }
          );
        }
        return null;
      }
      return y(T);
    }
    function E() {
      return y(s);
    }
    function S(v) {
      function T(L, k, P, W, A) {
        if (typeof v != "function")
          return new a("Property `" + A + "` of component `" + P + "` has invalid PropType notation inside arrayOf.");
        var j = L[k];
        if (!Array.isArray(j)) {
          var F = pe(j);
          return new a("Invalid " + W + " `" + A + "` of type " + ("`" + F + "` supplied to `" + P + "`, expected an array."));
        }
        for (var V = 0; V < j.length; V++) {
          var B = v(j, V, P, W, A + "[" + V + "]", r);
          if (B instanceof Error)
            return B;
        }
        return null;
      }
      return y(T);
    }
    function O() {
      function v(T, L, k, P, W) {
        var A = T[L];
        if (!c(A)) {
          var j = pe(A);
          return new a("Invalid " + P + " `" + W + "` of type " + ("`" + j + "` supplied to `" + k + "`, expected a single ReactElement."));
        }
        return null;
      }
      return y(v);
    }
    function g() {
      function v(T, L, k, P, W) {
        var A = T[L];
        if (!e.isValidElementType(A)) {
          var j = pe(A);
          return new a("Invalid " + P + " `" + W + "` of type " + ("`" + j + "` supplied to `" + k + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return y(v);
    }
    function R(v) {
      function T(L, k, P, W, A) {
        if (!(L[k] instanceof v)) {
          var j = v.name || l, F = je(L[k]);
          return new a("Invalid " + W + " `" + A + "` of type " + ("`" + F + "` supplied to `" + P + "`, expected ") + ("instance of `" + j + "`."));
        }
        return null;
      }
      return y(T);
    }
    function _(v) {
      if (!Array.isArray(v))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), s;
      function T(L, k, P, W, A) {
        for (var j = L[k], F = 0; F < v.length; F++)
          if (m(j, v[F]))
            return null;
        var V = JSON.stringify(v, function(he, w) {
          var xe = ue(w);
          return xe === "symbol" ? String(w) : w;
        });
        return new a("Invalid " + W + " `" + A + "` of value `" + String(j) + "` " + ("supplied to `" + P + "`, expected one of " + V + "."));
      }
      return y(T);
    }
    function I(v) {
      function T(L, k, P, W, A) {
        if (typeof v != "function")
          return new a("Property `" + A + "` of component `" + P + "` has invalid PropType notation inside objectOf.");
        var j = L[k], F = pe(j);
        if (F !== "object")
          return new a("Invalid " + W + " `" + A + "` of type " + ("`" + F + "` supplied to `" + P + "`, expected an object."));
        for (var V in j)
          if (n(j, V)) {
            var B = v(j, V, P, W, A + "." + V, r);
            if (B instanceof Error)
              return B;
          }
        return null;
      }
      return y(T);
    }
    function re(v) {
      if (!Array.isArray(v))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), s;
      for (var T = 0; T < v.length; T++) {
        var L = v[T];
        if (typeof L != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + Te(L) + " at index " + T + "."
          ), s;
      }
      function k(P, W, A, j, F) {
        for (var V = [], B = 0; B < v.length; B++) {
          var he = v[B], w = he(P, W, A, j, F, r);
          if (w == null)
            return null;
          w.data && n(w.data, "expectedType") && V.push(w.data.expectedType);
        }
        var xe = V.length > 0 ? ", expected one of type [" + V.join(", ") + "]" : "";
        return new a("Invalid " + j + " `" + F + "` supplied to " + ("`" + A + "`" + xe + "."));
      }
      return y(k);
    }
    function ce() {
      function v(T, L, k, P, W) {
        return U(T[L]) ? null : new a("Invalid " + P + " `" + W + "` supplied to " + ("`" + k + "`, expected a ReactNode."));
      }
      return y(v);
    }
    function de(v, T, L, k, P) {
      return new a(
        (v || "React class") + ": " + T + " type `" + L + "." + k + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + P + "`."
      );
    }
    function Z(v) {
      function T(L, k, P, W, A) {
        var j = L[k], F = pe(j);
        if (F !== "object")
          return new a("Invalid " + W + " `" + A + "` of type `" + F + "` " + ("supplied to `" + P + "`, expected `object`."));
        for (var V in v) {
          var B = v[V];
          if (typeof B != "function")
            return de(P, W, A, V, ue(B));
          var he = B(j, V, P, W, A + "." + V, r);
          if (he)
            return he;
        }
        return null;
      }
      return y(T);
    }
    function C(v) {
      function T(L, k, P, W, A) {
        var j = L[k], F = pe(j);
        if (F !== "object")
          return new a("Invalid " + W + " `" + A + "` of type `" + F + "` " + ("supplied to `" + P + "`, expected `object`."));
        var V = t({}, L[k], v);
        for (var B in V) {
          var he = v[B];
          if (n(v, B) && typeof he != "function")
            return de(P, W, A, B, ue(he));
          if (!he)
            return new a(
              "Invalid " + W + " `" + A + "` key `" + B + "` supplied to `" + P + "`.\nBad object: " + JSON.stringify(L[k], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(v), null, "  ")
            );
          var w = he(j, B, P, W, A + "." + B, r);
          if (w)
            return w;
        }
        return null;
      }
      return y(T);
    }
    function U(v) {
      switch (typeof v) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !v;
        case "object":
          if (Array.isArray(v))
            return v.every(U);
          if (v === null || c(v))
            return !0;
          var T = f(v);
          if (T) {
            var L = T.call(v), k;
            if (T !== v.entries) {
              for (; !(k = L.next()).done; )
                if (!U(k.value))
                  return !1;
            } else
              for (; !(k = L.next()).done; ) {
                var P = k.value;
                if (P && !U(P[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function fe(v, T) {
      return v === "symbol" ? !0 : T ? T["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && T instanceof Symbol : !1;
    }
    function pe(v) {
      var T = typeof v;
      return Array.isArray(v) ? "array" : v instanceof RegExp ? "object" : fe(T, v) ? "symbol" : T;
    }
    function ue(v) {
      if (typeof v > "u" || v === null)
        return "" + v;
      var T = pe(v);
      if (T === "object") {
        if (v instanceof Date)
          return "date";
        if (v instanceof RegExp)
          return "regexp";
      }
      return T;
    }
    function Te(v) {
      var T = ue(v);
      switch (T) {
        case "array":
        case "object":
          return "an " + T;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + T;
        default:
          return T;
      }
    }
    function je(v) {
      return !v.constructor || !v.constructor.name ? l : v.constructor.name;
    }
    return p.checkPropTypes = o, p.resetWarningCache = o.resetWarningCache, p.PropTypes = p, p;
  }, br;
}
var vr, cn;
function ws() {
  if (cn) return vr;
  cn = 1;
  var e = kr();
  function t() {
  }
  function r() {
  }
  return r.resetWarningCache = t, vr = function() {
    function n(s, c, u, d, h, f) {
      if (f !== e) {
        var l = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw l.name = "Invariant Violation", l;
      }
    }
    n.isRequired = n;
    function o() {
      return n;
    }
    var i = {
      array: n,
      bigint: n,
      bool: n,
      func: n,
      number: n,
      object: n,
      string: n,
      symbol: n,
      any: n,
      arrayOf: o,
      element: n,
      elementType: n,
      instanceOf: o,
      node: n,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: r,
      resetWarningCache: t
    };
    return i.PropTypes = i, i;
  }, vr;
}
if (process.env.NODE_ENV !== "production") {
  var Es = Hn(), Ts = !0;
  $r.exports = Ss()(Es.isElement, Ts);
} else
  $r.exports = ws()();
var _s = $r.exports;
const N = /* @__PURE__ */ ms(_s);
function Et(e) {
  let t = "https://mui.com/production-error/?code=" + e;
  for (let r = 1; r < arguments.length; r += 1)
    t += "&args[]=" + encodeURIComponent(arguments[r]);
  return "Minified MUI error #" + e + "; visit " + t + " for the full message.";
}
const Cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Et
}, Symbol.toStringTag, { value: "Module" }));
var Or = { exports: {} }, X = {};
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ln;
function $s() {
  if (ln) return X;
  ln = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), i = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), l = Symbol.for("react.view_transition"), p = Symbol.for("react.client.reference");
  function m(a) {
    if (typeof a == "object" && a !== null) {
      var y = a.$$typeof;
      switch (y) {
        case e:
          switch (a = a.type, a) {
            case r:
            case o:
            case n:
            case u:
            case d:
            case l:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case s:
                case c:
                case f:
                case h:
                  return a;
                case i:
                  return a;
                default:
                  return y;
              }
          }
        case t:
          return y;
      }
    }
  }
  return X.ContextConsumer = i, X.ContextProvider = s, X.Element = e, X.ForwardRef = c, X.Fragment = r, X.Lazy = f, X.Memo = h, X.Portal = t, X.Profiler = o, X.StrictMode = n, X.Suspense = u, X.SuspenseList = d, X.isContextConsumer = function(a) {
    return m(a) === i;
  }, X.isContextProvider = function(a) {
    return m(a) === s;
  }, X.isElement = function(a) {
    return typeof a == "object" && a !== null && a.$$typeof === e;
  }, X.isForwardRef = function(a) {
    return m(a) === c;
  }, X.isFragment = function(a) {
    return m(a) === r;
  }, X.isLazy = function(a) {
    return m(a) === f;
  }, X.isMemo = function(a) {
    return m(a) === h;
  }, X.isPortal = function(a) {
    return m(a) === t;
  }, X.isProfiler = function(a) {
    return m(a) === o;
  }, X.isStrictMode = function(a) {
    return m(a) === n;
  }, X.isSuspense = function(a) {
    return m(a) === u;
  }, X.isSuspenseList = function(a) {
    return m(a) === d;
  }, X.isValidElementType = function(a) {
    return typeof a == "string" || typeof a == "function" || a === r || a === o || a === n || a === u || a === d || typeof a == "object" && a !== null && (a.$$typeof === f || a.$$typeof === h || a.$$typeof === s || a.$$typeof === i || a.$$typeof === c || a.$$typeof === p || a.getModuleId !== void 0);
  }, X.typeOf = m, X;
}
var J = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var un;
function Os() {
  return un || (un = 1, process.env.NODE_ENV !== "production" && function() {
    function e(a) {
      if (typeof a == "object" && a !== null) {
        var y = a.$$typeof;
        switch (y) {
          case t:
            switch (a = a.type, a) {
              case n:
              case i:
              case o:
              case d:
              case h:
              case p:
                return a;
              default:
                switch (a = a && a.$$typeof, a) {
                  case c:
                  case u:
                  case l:
                  case f:
                    return a;
                  case s:
                    return a;
                  default:
                    return y;
                }
            }
          case r:
            return y;
        }
      }
    }
    var t = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), s = Symbol.for("react.consumer"), c = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), h = Symbol.for("react.suspense_list"), f = Symbol.for("react.memo"), l = Symbol.for("react.lazy"), p = Symbol.for("react.view_transition"), m = Symbol.for("react.client.reference");
    J.ContextConsumer = s, J.ContextProvider = c, J.Element = t, J.ForwardRef = u, J.Fragment = n, J.Lazy = l, J.Memo = f, J.Portal = r, J.Profiler = i, J.StrictMode = o, J.Suspense = d, J.SuspenseList = h, J.isContextConsumer = function(a) {
      return e(a) === s;
    }, J.isContextProvider = function(a) {
      return e(a) === c;
    }, J.isElement = function(a) {
      return typeof a == "object" && a !== null && a.$$typeof === t;
    }, J.isForwardRef = function(a) {
      return e(a) === u;
    }, J.isFragment = function(a) {
      return e(a) === n;
    }, J.isLazy = function(a) {
      return e(a) === l;
    }, J.isMemo = function(a) {
      return e(a) === f;
    }, J.isPortal = function(a) {
      return e(a) === r;
    }, J.isProfiler = function(a) {
      return e(a) === i;
    }, J.isStrictMode = function(a) {
      return e(a) === o;
    }, J.isSuspense = function(a) {
      return e(a) === d;
    }, J.isSuspenseList = function(a) {
      return e(a) === h;
    }, J.isValidElementType = function(a) {
      return typeof a == "string" || typeof a == "function" || a === n || a === i || a === o || a === d || a === h || typeof a == "object" && a !== null && (a.$$typeof === l || a.$$typeof === f || a.$$typeof === c || a.$$typeof === s || a.$$typeof === u || a.$$typeof === m || a.getModuleId !== void 0);
    }, J.typeOf = e;
  }()), J;
}
process.env.NODE_ENV === "production" ? Or.exports = $s() : Or.exports = Os();
var dn = Or.exports;
const Rs = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;
function Kn(e) {
  const t = `${e}`.match(Rs);
  return t && t[1] || "";
}
function Xn(e, t = "") {
  return e.displayName || e.name || Kn(e) || t;
}
function fn(e, t, r) {
  const n = Xn(t);
  return e.displayName || (n !== "" ? `${r}(${n})` : r);
}
function Ds(e) {
  if (e != null) {
    if (typeof e == "string")
      return e;
    if (typeof e == "function")
      return Xn(e, "Component");
    if (typeof e == "object")
      switch (e.$$typeof) {
        case dn.ForwardRef:
          return fn(e, e.render, "ForwardRef");
        case dn.Memo:
          return fn(e, e.type, "memo");
        default:
          return;
      }
  }
}
const Ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ds,
  getFunctionName: Kn
}, Symbol.toStringTag, { value: "Module" }));
function Je(e) {
  if (typeof e != "string")
    throw new Error(process.env.NODE_ENV !== "production" ? "MUI: `capitalize(string)` expects a string argument." : Et(7));
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const Ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" }));
function Is(...e) {
  return e.reduce((t, r) => r == null ? t : function(...o) {
    t.apply(this, o), r.apply(this, o);
  }, () => {
  });
}
function As(e, t = 166) {
  let r;
  function n(...o) {
    const i = () => {
      e.apply(this, o);
    };
    clearTimeout(r), r = setTimeout(i, t);
  }
  return n.clear = () => {
    clearTimeout(r);
  }, n;
}
function ks(e, t) {
  return process.env.NODE_ENV === "production" ? () => null : (r, n, o, i, s) => {
    const c = o || "<<anonymous>>", u = s || n;
    return typeof r[n] < "u" ? new Error(`The ${i} \`${u}\` of \`${c}\` is deprecated. ${t}`) : null;
  };
}
function Ns(e, t) {
  var r, n;
  return /* @__PURE__ */ ee.isValidElement(e) && t.indexOf(
    // For server components `muiName` is avaialble in element.type._payload.value.muiName
    // relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
    // eslint-disable-next-line no-underscore-dangle
    (r = e.type.muiName) != null ? r : (n = e.type) == null || (n = n._payload) == null || (n = n.value) == null ? void 0 : n.muiName
  ) !== -1;
}
function Jn(e) {
  return e && e.ownerDocument || document;
}
function zs(e) {
  return Jn(e).defaultView || window;
}
function Ls(e, t) {
  if (process.env.NODE_ENV === "production")
    return () => null;
  const r = t ? K({}, t.propTypes) : null;
  return (o) => (i, s, c, u, d, ...h) => {
    const f = d || s, l = r == null ? void 0 : r[f];
    if (l) {
      const p = l(i, s, c, u, d, ...h);
      if (p)
        return p;
    }
    return typeof i[s] < "u" && !i[o] ? new Error(`The prop \`${f}\` of \`${e}\` can only be used together with the \`${o}\` prop.`) : null;
  };
}
function Zn(e, t) {
  typeof e == "function" ? e(t) : e && (e.current = t);
}
const Qn = typeof window < "u" ? ee.useLayoutEffect : ee.useEffect;
let pn = 0;
function js(e) {
  const [t, r] = ee.useState(e), n = e || t;
  return ee.useEffect(() => {
    t == null && (pn += 1, r(`mui-${pn}`));
  }, [t]), n;
}
const hn = ee.useId;
function Ws(e) {
  if (hn !== void 0) {
    const t = hn();
    return e ?? t;
  }
  return js(e);
}
function Fs(e, t, r, n, o) {
  if (process.env.NODE_ENV === "production")
    return null;
  const i = o || t;
  return typeof e[t] < "u" ? new Error(`The prop \`${i}\` is not supported. Please remove it.`) : null;
}
function Bs({
  controlled: e,
  default: t,
  name: r,
  state: n = "value"
}) {
  const {
    current: o
  } = ee.useRef(e !== void 0), [i, s] = ee.useState(t), c = o ? e : i;
  if (process.env.NODE_ENV !== "production") {
    ee.useEffect(() => {
      o !== (e !== void 0) && console.error([`MUI: A component is changing the ${o ? "" : "un"}controlled ${n} state of ${r} to be ${o ? "un" : ""}controlled.`, "Elements should not switch from uncontrolled to controlled (or vice versa).", `Decide between using a controlled or uncontrolled ${r} element for the lifetime of the component.`, "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.", "More info: https://fb.me/react-controlled-components"].join(`
`));
    }, [n, r, e]);
    const {
      current: d
    } = ee.useRef(t);
    ee.useEffect(() => {
      !o && !Object.is(d, t) && console.error([`MUI: A component is changing the default ${n} state of an uncontrolled ${r} after being initialized. To suppress this warning opt to use a controlled ${r}.`].join(`
`));
    }, [JSON.stringify(t)]);
  }
  const u = ee.useCallback((d) => {
    o || s(d);
  }, []);
  return [c, u];
}
function Us(e) {
  const t = ee.useRef(e);
  return Qn(() => {
    t.current = e;
  }), ee.useRef((...r) => (
    // @ts-expect-error hide `this`
    (0, t.current)(...r)
  )).current;
}
function Vs(...e) {
  return ee.useMemo(() => e.every((t) => t == null) ? null : (t) => {
    e.forEach((r) => {
      Zn(r, t);
    });
  }, e);
}
class Nr {
  constructor() {
    this.currentId = null, this.clear = () => {
      this.currentId !== null && (clearTimeout(this.currentId), this.currentId = null);
    }, this.disposeEffect = () => this.clear;
  }
  static create() {
    return new Nr();
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(t, r) {
    this.clear(), this.currentId = setTimeout(() => {
      this.currentId = null, r();
    }, t);
  }
}
let Kt = !0, Rr = !1;
const Ys = new Nr(), qs = {
  text: !0,
  search: !0,
  url: !0,
  tel: !0,
  email: !0,
  password: !0,
  number: !0,
  date: !0,
  month: !0,
  week: !0,
  time: !0,
  datetime: !0,
  "datetime-local": !0
};
function Hs(e) {
  const {
    type: t,
    tagName: r
  } = e;
  return !!(r === "INPUT" && qs[t] && !e.readOnly || r === "TEXTAREA" && !e.readOnly || e.isContentEditable);
}
function Gs(e) {
  e.metaKey || e.altKey || e.ctrlKey || (Kt = !0);
}
function xr() {
  Kt = !1;
}
function Ks() {
  this.visibilityState === "hidden" && Rr && (Kt = !0);
}
function Xs(e) {
  e.addEventListener("keydown", Gs, !0), e.addEventListener("mousedown", xr, !0), e.addEventListener("pointerdown", xr, !0), e.addEventListener("touchstart", xr, !0), e.addEventListener("visibilitychange", Ks, !0);
}
function Js(e) {
  const {
    target: t
  } = e;
  try {
    return t.matches(":focus-visible");
  } catch {
  }
  return Kt || Hs(t);
}
function Zs() {
  const e = ee.useCallback((o) => {
    o != null && Xs(o.ownerDocument);
  }, []), t = ee.useRef(!1);
  function r() {
    return t.current ? (Rr = !0, Ys.start(100, () => {
      Rr = !1;
    }), t.current = !1, !0) : !1;
  }
  function n(o) {
    return Js(o) ? (t.current = !0, !0) : !1;
  }
  return {
    isFocusVisibleRef: t,
    onFocus: n,
    onBlur: r,
    ref: e
  };
}
function Dr(e, t) {
  const r = K({}, t);
  return Object.keys(e).forEach((n) => {
    if (n.toString().match(/^(components|slots)$/))
      r[n] = K({}, e[n], r[n]);
    else if (n.toString().match(/^(componentsProps|slotProps)$/)) {
      const o = e[n] || {}, i = t[n];
      r[n] = {}, !i || !Object.keys(i) ? r[n] = o : !o || !Object.keys(o) ? r[n] = i : (r[n] = K({}, i), Object.keys(o).forEach((s) => {
        r[n][s] = Dr(o[s], i[s]);
      }));
    } else r[n] === void 0 && (r[n] = e[n]);
  }), r;
}
function Qs(e, t, r = void 0) {
  const n = {};
  return Object.keys(e).forEach(
    // `Object.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    (o) => {
      n[o] = e[o].reduce((i, s) => {
        if (s) {
          const c = t(s);
          c !== "" && i.push(c), r && r[s] && i.push(r[s]);
        }
        return i;
      }, []).join(" ");
    }
  ), n;
}
const mn = (e) => e, ei = () => {
  let e = mn;
  return {
    configure(t) {
      e = t;
    },
    generate(t) {
      return e(t);
    },
    reset() {
      e = mn;
    }
  };
}, eo = ei(), ti = {
  active: "active",
  checked: "checked",
  completed: "completed",
  disabled: "disabled",
  error: "error",
  expanded: "expanded",
  focused: "focused",
  focusVisible: "focusVisible",
  open: "open",
  readOnly: "readOnly",
  required: "required",
  selected: "selected"
};
function zr(e, t, r = "Mui") {
  const n = ti[t];
  return n ? `${r}-${n}` : `${eo.generate(e)}-${t}`;
}
function ri(e, t, r = "Mui") {
  const n = {};
  return t.forEach((o) => {
    n[o] = zr(e, o, r);
  }), n;
}
function ni(e, t = Number.MIN_SAFE_INTEGER, r = Number.MAX_SAFE_INTEGER) {
  return Math.max(t, Math.min(e, r));
}
const oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ni
}, Symbol.toStringTag, { value: "Module" }));
function Ze(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function to(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = to(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function si() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = to(e)) && (n && (n += " "), n += t);
  return n;
}
const ii = /* @__PURE__ */ ee.createContext(void 0);
process.env.NODE_ENV !== "production" && (N.node, N.object);
function ai(e) {
  const {
    theme: t,
    name: r,
    props: n
  } = e;
  if (!t || !t.components || !t.components[r])
    return n;
  const o = t.components[r];
  return o.defaultProps ? Dr(o.defaultProps, n) : !o.styleOverrides && !o.variants ? Dr(o, n) : n;
}
function ci({
  props: e,
  name: t
}) {
  const r = ee.useContext(ii);
  return ai({
    props: e,
    name: t,
    theme: {
      components: r
    }
  });
}
process.env.NODE_ENV !== "production" && (N.node, N.object.isRequired);
function li(e) {
  return ci(e);
}
var $t = {}, Sr = { exports: {} }, yn;
function ui() {
  return yn || (yn = 1, function(e) {
    function t() {
      return e.exports = t = Object.assign ? Object.assign.bind() : function(r) {
        for (var n = 1; n < arguments.length; n++) {
          var o = arguments[n];
          for (var i in o) ({}).hasOwnProperty.call(o, i) && (r[i] = o[i]);
        }
        return r;
      }, e.exports.__esModule = !0, e.exports.default = e.exports, t.apply(null, arguments);
    }
    e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports;
  }(Sr)), Sr.exports;
}
var wr = { exports: {} }, gn;
function di() {
  return gn || (gn = 1, function(e) {
    function t(r, n) {
      if (r == null) return {};
      var o = {};
      for (var i in r) if ({}.hasOwnProperty.call(r, i)) {
        if (n.indexOf(i) !== -1) continue;
        o[i] = r[i];
      }
      return o;
    }
    e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports;
  }(wr)), wr.exports;
}
function fi(e) {
  for (var t = 0, r, n = 0, o = e.length; o >= 4; ++n, o -= 4)
    r = e.charCodeAt(n) & 255 | (e.charCodeAt(++n) & 255) << 8 | (e.charCodeAt(++n) & 255) << 16 | (e.charCodeAt(++n) & 255) << 24, r = /* Math.imul(k, m): */
    (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16), r ^= /* k >>> r: */
    r >>> 24, t = /* Math.imul(k, m): */
    (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  switch (o) {
    case 3:
      t ^= (e.charCodeAt(n + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(n + 1) & 255) << 8;
    case 1:
      t ^= e.charCodeAt(n) & 255, t = /* Math.imul(h, m): */
      (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  }
  return t ^= t >>> 13, t = /* Math.imul(h, m): */
  (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
var pi = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
function hi(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return function(r) {
    return t[r] === void 0 && (t[r] = e(r)), t[r];
  };
}
var mi = /[A-Z]|^ms/g, yi = /_EMO_([^_]+?)_([^]*?)_EMO_/g, ro = function(t) {
  return t.charCodeAt(1) === 45;
}, bn = function(t) {
  return t != null && typeof t != "boolean";
}, Er = /* @__PURE__ */ hi(function(e) {
  return ro(e) ? e : e.replace(mi, "-$&").toLowerCase();
}), vn = function(t, r) {
  switch (t) {
    case "animation":
    case "animationName":
      if (typeof r == "string")
        return r.replace(yi, function(n, o, i) {
          return Ke = {
            name: o,
            styles: i,
            next: Ke
          }, o;
        });
  }
  return pi[t] !== 1 && !ro(t) && typeof r == "number" && r !== 0 ? r + "px" : r;
};
function Bt(e, t, r) {
  if (r == null)
    return "";
  var n = r;
  if (n.__emotion_styles !== void 0)
    return n;
  switch (typeof r) {
    case "boolean":
      return "";
    case "object": {
      var o = r;
      if (o.anim === 1)
        return Ke = {
          name: o.name,
          styles: o.styles,
          next: Ke
        }, o.name;
      var i = r;
      if (i.styles !== void 0) {
        var s = i.next;
        if (s !== void 0)
          for (; s !== void 0; )
            Ke = {
              name: s.name,
              styles: s.styles,
              next: Ke
            }, s = s.next;
        var c = i.styles + ";";
        return c;
      }
      return gi(e, t, r);
    }
  }
  var u = r;
  return u;
}
function gi(e, t, r) {
  var n = "";
  if (Array.isArray(r))
    for (var o = 0; o < r.length; o++)
      n += Bt(e, t, r[o]) + ";";
  else
    for (var i in r) {
      var s = r[i];
      if (typeof s != "object") {
        var c = s;
        bn(c) && (n += Er(i) + ":" + vn(i, c) + ";");
      } else if (Array.isArray(s) && typeof s[0] == "string" && t == null)
        for (var u = 0; u < s.length; u++)
          bn(s[u]) && (n += Er(i) + ":" + vn(i, s[u]) + ";");
      else {
        var d = Bt(e, t, s);
        switch (i) {
          case "animation":
          case "animationName": {
            n += Er(i) + ":" + d + ";";
            break;
          }
          default:
            n += i + "{" + d + "}";
        }
      }
    }
  return n;
}
var xn = /label:\s*([^\s;{]+)\s*(;|$)/g, Ke;
function bi(e, t, r) {
  if (e.length === 1 && typeof e[0] == "object" && e[0] !== null && e[0].styles !== void 0)
    return e[0];
  var n = !0, o = "";
  Ke = void 0;
  var i = e[0];
  if (i == null || i.raw === void 0)
    n = !1, o += Bt(r, t, i);
  else {
    var s = i;
    o += s[0];
  }
  for (var c = 1; c < e.length; c++)
    if (o += Bt(r, t, e[c]), n) {
      var u = i;
      o += u[c];
    }
  xn.lastIndex = 0;
  for (var d = "", h; (h = xn.exec(o)) !== null; )
    d += "-" + h[1];
  var f = fi(o) + d;
  return {
    name: f,
    styles: o,
    next: Ke
  };
}
function vi(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function xi(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var Si = /* @__PURE__ */ function() {
  function e(r) {
    var n = this;
    this._insertTag = function(o) {
      var i;
      n.tags.length === 0 ? n.insertionPoint ? i = n.insertionPoint.nextSibling : n.prepend ? i = n.container.firstChild : i = n.before : i = n.tags[n.tags.length - 1].nextSibling, n.container.insertBefore(o, i), n.tags.push(o);
    }, this.isSpeedy = r.speedy === void 0 ? !0 : r.speedy, this.tags = [], this.ctr = 0, this.nonce = r.nonce, this.key = r.key, this.container = r.container, this.prepend = r.prepend, this.insertionPoint = r.insertionPoint, this.before = null;
  }
  var t = e.prototype;
  return t.hydrate = function(n) {
    n.forEach(this._insertTag);
  }, t.insert = function(n) {
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(xi(this));
    var o = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var i = vi(o);
      try {
        i.insertRule(n, i.cssRules.length);
      } catch {
      }
    } else
      o.appendChild(document.createTextNode(n));
    this.ctr++;
  }, t.flush = function() {
    this.tags.forEach(function(n) {
      var o;
      return (o = n.parentNode) == null ? void 0 : o.removeChild(n);
    }), this.tags = [], this.ctr = 0;
  }, e;
}(), ge = "-ms-", Ut = "-moz-", Y = "-webkit-", no = "comm", Lr = "rule", jr = "decl", wi = "@import", oo = "@keyframes", Ei = "@layer", Ti = Math.abs, Xt = String.fromCharCode, _i = Object.assign;
function Ci(e, t) {
  return ye(e, 0) ^ 45 ? (((t << 2 ^ ye(e, 0)) << 2 ^ ye(e, 1)) << 2 ^ ye(e, 2)) << 2 ^ ye(e, 3) : 0;
}
function so(e) {
  return e.trim();
}
function $i(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function q(e, t, r) {
  return e.replace(t, r);
}
function Pr(e, t) {
  return e.indexOf(t);
}
function ye(e, t) {
  return e.charCodeAt(t) | 0;
}
function Tt(e, t, r) {
  return e.slice(t, r);
}
function Ne(e) {
  return e.length;
}
function Wr(e) {
  return e.length;
}
function kt(e, t) {
  return t.push(e), e;
}
function Oi(e, t) {
  return e.map(t).join("");
}
var Jt = 1, ft = 1, io = 0, Ee = 0, le = 0, ht = "";
function Zt(e, t, r, n, o, i, s) {
  return { value: e, root: t, parent: r, type: n, props: o, children: i, line: Jt, column: ft, length: s, return: "" };
}
function bt(e, t) {
  return _i(Zt("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function Ri() {
  return le;
}
function Di() {
  return le = Ee > 0 ? ye(ht, --Ee) : 0, ft--, le === 10 && (ft = 1, Jt--), le;
}
function Ce() {
  return le = Ee < io ? ye(ht, Ee++) : 0, ft++, le === 10 && (ft = 1, Jt++), le;
}
function Le() {
  return ye(ht, Ee);
}
function zt() {
  return Ee;
}
function Ot(e, t) {
  return Tt(ht, e, t);
}
function _t(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function ao(e) {
  return Jt = ft = 1, io = Ne(ht = e), Ee = 0, [];
}
function co(e) {
  return ht = "", e;
}
function Lt(e) {
  return so(Ot(Ee - 1, Mr(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Pi(e) {
  for (; (le = Le()) && le < 33; )
    Ce();
  return _t(e) > 2 || _t(le) > 3 ? "" : " ";
}
function Mi(e, t) {
  for (; --t && Ce() && !(le < 48 || le > 102 || le > 57 && le < 65 || le > 70 && le < 97); )
    ;
  return Ot(e, zt() + (t < 6 && Le() == 32 && Ce() == 32));
}
function Mr(e) {
  for (; Ce(); )
    switch (le) {
      case e:
        return Ee;
      case 34:
      case 39:
        e !== 34 && e !== 39 && Mr(le);
        break;
      case 40:
        e === 41 && Mr(e);
        break;
      case 92:
        Ce();
        break;
    }
  return Ee;
}
function Ii(e, t) {
  for (; Ce() && e + le !== 57; )
    if (e + le === 84 && Le() === 47)
      break;
  return "/*" + Ot(t, Ee - 1) + "*" + Xt(e === 47 ? e : Ce());
}
function Ai(e) {
  for (; !_t(Le()); )
    Ce();
  return Ot(e, Ee);
}
function ki(e) {
  return co(jt("", null, null, null, [""], e = ao(e), 0, [0], e));
}
function jt(e, t, r, n, o, i, s, c, u) {
  for (var d = 0, h = 0, f = s, l = 0, p = 0, m = 0, a = 1, y = 1, x = 1, E = 0, S = "", O = o, g = i, R = n, _ = S; y; )
    switch (m = E, E = Ce()) {
      case 40:
        if (m != 108 && ye(_, f - 1) == 58) {
          Pr(_ += q(Lt(E), "&", "&\f"), "&\f") != -1 && (x = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        _ += Lt(E);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        _ += Pi(m);
        break;
      case 92:
        _ += Mi(zt() - 1, 7);
        continue;
      case 47:
        switch (Le()) {
          case 42:
          case 47:
            kt(Ni(Ii(Ce(), zt()), t, r), u);
            break;
          default:
            _ += "/";
        }
        break;
      case 123 * a:
        c[d++] = Ne(_) * x;
      case 125 * a:
      case 59:
      case 0:
        switch (E) {
          case 0:
          case 125:
            y = 0;
          case 59 + h:
            x == -1 && (_ = q(_, /\f/g, "")), p > 0 && Ne(_) - f && kt(p > 32 ? wn(_ + ";", n, r, f - 1) : wn(q(_, " ", "") + ";", n, r, f - 2), u);
            break;
          case 59:
            _ += ";";
          default:
            if (kt(R = Sn(_, t, r, d, h, o, c, S, O = [], g = [], f), i), E === 123)
              if (h === 0)
                jt(_, t, R, R, O, i, f, c, g);
              else
                switch (l === 99 && ye(_, 3) === 110 ? 100 : l) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    jt(e, R, R, n && kt(Sn(e, R, R, 0, 0, o, c, S, o, O = [], f), g), o, g, f, c, n ? O : g);
                    break;
                  default:
                    jt(_, R, R, R, [""], g, 0, c, g);
                }
        }
        d = h = p = 0, a = x = 1, S = _ = "", f = s;
        break;
      case 58:
        f = 1 + Ne(_), p = m;
      default:
        if (a < 1) {
          if (E == 123)
            --a;
          else if (E == 125 && a++ == 0 && Di() == 125)
            continue;
        }
        switch (_ += Xt(E), E * a) {
          case 38:
            x = h > 0 ? 1 : (_ += "\f", -1);
            break;
          case 44:
            c[d++] = (Ne(_) - 1) * x, x = 1;
            break;
          case 64:
            Le() === 45 && (_ += Lt(Ce())), l = Le(), h = f = Ne(S = _ += Ai(zt())), E++;
            break;
          case 45:
            m === 45 && Ne(_) == 2 && (a = 0);
        }
    }
  return i;
}
function Sn(e, t, r, n, o, i, s, c, u, d, h) {
  for (var f = o - 1, l = o === 0 ? i : [""], p = Wr(l), m = 0, a = 0, y = 0; m < n; ++m)
    for (var x = 0, E = Tt(e, f + 1, f = Ti(a = s[m])), S = e; x < p; ++x)
      (S = so(a > 0 ? l[x] + " " + E : q(E, /&\f/g, l[x]))) && (u[y++] = S);
  return Zt(e, t, r, o === 0 ? Lr : c, u, d, h);
}
function Ni(e, t, r) {
  return Zt(e, t, r, no, Xt(Ri()), Tt(e, 2, -2), 0);
}
function wn(e, t, r, n) {
  return Zt(e, t, r, jr, Tt(e, 0, n), Tt(e, n + 1, -1), n);
}
function ut(e, t) {
  for (var r = "", n = Wr(e), o = 0; o < n; o++)
    r += t(e[o], o, e, t) || "";
  return r;
}
function zi(e, t, r, n) {
  switch (e.type) {
    case Ei:
      if (e.children.length) break;
    case wi:
    case jr:
      return e.return = e.return || e.value;
    case no:
      return "";
    case oo:
      return e.return = e.value + "{" + ut(e.children, n) + "}";
    case Lr:
      e.value = e.props.join(",");
  }
  return Ne(r = ut(e.children, n)) ? e.return = e.value + "{" + r + "}" : "";
}
function Li(e) {
  var t = Wr(e);
  return function(r, n, o, i) {
    for (var s = "", c = 0; c < t; c++)
      s += e[c](r, n, o, i) || "";
    return s;
  };
}
function ji(e) {
  return function(t) {
    t.root || (t = t.return) && e(t);
  };
}
var Wi = function(t, r, n) {
  for (var o = 0, i = 0; o = i, i = Le(), o === 38 && i === 12 && (r[n] = 1), !_t(i); )
    Ce();
  return Ot(t, Ee);
}, Fi = function(t, r) {
  var n = -1, o = 44;
  do
    switch (_t(o)) {
      case 0:
        o === 38 && Le() === 12 && (r[n] = 1), t[n] += Wi(Ee - 1, r, n);
        break;
      case 2:
        t[n] += Lt(o);
        break;
      case 4:
        if (o === 44) {
          t[++n] = Le() === 58 ? "&\f" : "", r[n] = t[n].length;
          break;
        }
      default:
        t[n] += Xt(o);
    }
  while (o = Ce());
  return t;
}, Bi = function(t, r) {
  return co(Fi(ao(t), r));
}, En = /* @__PURE__ */ new WeakMap(), Ui = function(t) {
  if (!(t.type !== "rule" || !t.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  t.length < 1)) {
    for (var r = t.value, n = t.parent, o = t.column === n.column && t.line === n.line; n.type !== "rule"; )
      if (n = n.parent, !n) return;
    if (!(t.props.length === 1 && r.charCodeAt(0) !== 58 && !En.get(n)) && !o) {
      En.set(t, !0);
      for (var i = [], s = Bi(r, i), c = n.props, u = 0, d = 0; u < s.length; u++)
        for (var h = 0; h < c.length; h++, d++)
          t.props[d] = i[u] ? s[u].replace(/&\f/g, c[h]) : c[h] + " " + s[u];
    }
  }
}, Vi = function(t) {
  if (t.type === "decl") {
    var r = t.value;
    // charcode for l
    r.charCodeAt(0) === 108 && // charcode for b
    r.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
};
function lo(e, t) {
  switch (Ci(e, t)) {
    case 5103:
      return Y + "print-" + e + e;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return Y + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return Y + e + Ut + e + ge + e + e;
    case 6828:
    case 4268:
      return Y + e + ge + e + e;
    case 6165:
      return Y + e + ge + "flex-" + e + e;
    case 5187:
      return Y + e + q(e, /(\w+).+(:[^]+)/, Y + "box-$1$2" + ge + "flex-$1$2") + e;
    case 5443:
      return Y + e + ge + "flex-item-" + q(e, /flex-|-self/, "") + e;
    case 4675:
      return Y + e + ge + "flex-line-pack" + q(e, /align-content|flex-|-self/, "") + e;
    case 5548:
      return Y + e + ge + q(e, "shrink", "negative") + e;
    case 5292:
      return Y + e + ge + q(e, "basis", "preferred-size") + e;
    case 6060:
      return Y + "box-" + q(e, "-grow", "") + Y + e + ge + q(e, "grow", "positive") + e;
    case 4554:
      return Y + q(e, /([^-])(transform)/g, "$1" + Y + "$2") + e;
    case 6187:
      return q(q(q(e, /(zoom-|grab)/, Y + "$1"), /(image-set)/, Y + "$1"), e, "") + e;
    case 5495:
    case 3959:
      return q(e, /(image-set\([^]*)/, Y + "$1$`$1");
    case 4968:
      return q(q(e, /(.+:)(flex-)?(.*)/, Y + "box-pack:$3" + ge + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + Y + e + e;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return q(e, /(.+)-inline(.+)/, Y + "$1$2") + e;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (Ne(e) - 1 - t > 6) switch (ye(e, t + 1)) {
        case 109:
          if (ye(e, t + 4) !== 45) break;
        case 102:
          return q(e, /(.+:)(.+)-([^]+)/, "$1" + Y + "$2-$3$1" + Ut + (ye(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
        case 115:
          return ~Pr(e, "stretch") ? lo(q(e, "stretch", "fill-available"), t) + e : e;
      }
      break;
    case 4949:
      if (ye(e, t + 1) !== 115) break;
    case 6444:
      switch (ye(e, Ne(e) - 3 - (~Pr(e, "!important") && 10))) {
        case 107:
          return q(e, ":", ":" + Y) + e;
        case 101:
          return q(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + Y + (ye(e, 14) === 45 ? "inline-" : "") + "box$3$1" + Y + "$2$3$1" + ge + "$2box$3") + e;
      }
      break;
    case 5936:
      switch (ye(e, t + 11)) {
        case 114:
          return Y + e + ge + q(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return Y + e + ge + q(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return Y + e + ge + q(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return Y + e + ge + e + e;
  }
  return e;
}
var Yi = function(t, r, n, o) {
  if (t.length > -1 && !t.return) switch (t.type) {
    case jr:
      t.return = lo(t.value, t.length);
      break;
    case oo:
      return ut([bt(t, {
        value: q(t.value, "@", "@" + Y)
      })], o);
    case Lr:
      if (t.length) return Oi(t.props, function(i) {
        switch ($i(i, /(::plac\w+|:read-\w+)/)) {
          case ":read-only":
          case ":read-write":
            return ut([bt(t, {
              props: [q(i, /:(read-\w+)/, ":" + Ut + "$1")]
            })], o);
          case "::placeholder":
            return ut([bt(t, {
              props: [q(i, /:(plac\w+)/, ":" + Y + "input-$1")]
            }), bt(t, {
              props: [q(i, /:(plac\w+)/, ":" + Ut + "$1")]
            }), bt(t, {
              props: [q(i, /:(plac\w+)/, ge + "input-$1")]
            })], o);
        }
        return "";
      });
  }
}, qi = [Yi], Hi = function(t) {
  var r = t.key;
  if (r === "css") {
    var n = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(n, function(a) {
      var y = a.getAttribute("data-emotion");
      y.indexOf(" ") !== -1 && (document.head.appendChild(a), a.setAttribute("data-s", ""));
    });
  }
  var o = t.stylisPlugins || qi, i = {}, s, c = [];
  s = t.container || document.head, Array.prototype.forEach.call(
    // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll('style[data-emotion^="' + r + ' "]'),
    function(a) {
      for (var y = a.getAttribute("data-emotion").split(" "), x = 1; x < y.length; x++)
        i[y[x]] = !0;
      c.push(a);
    }
  );
  var u, d = [Ui, Vi];
  {
    var h, f = [zi, ji(function(a) {
      h.insert(a);
    })], l = Li(d.concat(o, f)), p = function(y) {
      return ut(ki(y), l);
    };
    u = function(y, x, E, S) {
      h = E, p(y ? y + "{" + x.styles + "}" : x.styles), S && (m.inserted[x.name] = !0);
    };
  }
  var m = {
    key: r,
    sheet: new Si({
      key: r,
      container: s,
      nonce: t.nonce,
      speedy: t.speedy,
      prepend: t.prepend,
      insertionPoint: t.insertionPoint
    }),
    nonce: t.nonce,
    inserted: i,
    registered: {},
    insert: u
  };
  return m.sheet.hydrate(c), m;
};
function Gi(e, t) {
  const r = Hi({
    key: "css",
    prepend: e
  });
  if (t) {
    const n = r.insert;
    r.insert = (...o) => (o[1].styles.match(/^@layer\s+[^{]*$/) || (o[1].styles = `@layer mui {${o[1].styles}}`), n(...o));
  }
  return r;
}
const Tr = /* @__PURE__ */ new Map();
function uo(e) {
  const {
    injectFirst: t,
    enableCssLayer: r,
    children: n
  } = e, o = ee.useMemo(() => {
    const i = `${t}-${r}`;
    if (typeof document == "object" && Tr.has(i))
      return Tr.get(i);
    const s = Gi(t, r);
    return Tr.set(i, s), s;
  }, [t, r]);
  return t || r ? /* @__PURE__ */ b(qo, {
    value: o,
    children: n
  }) : n;
}
process.env.NODE_ENV !== "production" && (uo.propTypes = {
  /**
   * Your component tree.
   */
  children: N.node,
  /**
   * If true, MUI styles are wrapped in CSS `@layer mui` rule.
   * It helps to override MUI styles when using CSS Modules, Tailwind CSS, plain CSS, or any other styling solution.
   */
  enableCssLayer: N.bool,
  /**
   * By default, the styles are injected last in the <head> element of the page.
   * As a result, they gain more specificity than any other style sheet.
   * If you want to override MUI's styles, set this prop.
   */
  injectFirst: N.bool
});
function Ki(e) {
  return e == null || Object.keys(e).length === 0;
}
function fo(e) {
  const {
    styles: t,
    defaultTheme: r = {}
  } = e;
  return /* @__PURE__ */ b(Ho, {
    styles: typeof t == "function" ? (o) => t(Ki(o) ? r : o) : t
  });
}
process.env.NODE_ENV !== "production" && (fo.propTypes = {
  defaultTheme: N.object,
  styles: N.oneOfType([N.array, N.string, N.object, N.func])
});
/**
 * @mui/styled-engine v5.18.0
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function Xi(e, t) {
  const r = Yo(e, t);
  return process.env.NODE_ENV !== "production" ? (...n) => {
    const o = typeof e == "string" ? `"${e}"` : "component";
    return n.length === 0 ? console.error([`MUI: Seems like you called \`styled(${o})()\` without a \`style\` argument.`, 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join(`
`)) : n.some((i) => i === void 0) && console.error(`MUI: the styled(${o})(...args) API requires all its args to be defined.`), r(...n);
  } : r;
}
const Ji = (e, t) => {
  Array.isArray(e.__emotion_styles) && (e.__emotion_styles = t(e.__emotion_styles));
}, Tn = [];
function Zi(e) {
  return Tn[0] = e, bi(Tn);
}
const Qi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GlobalStyles: fo,
  StyledEngineProvider: uo,
  ThemeContext: Go,
  css: Ko,
  default: Xi,
  internal_processStyles: Ji,
  internal_serializeStyles: Zi,
  keyframes: Xo
}, Symbol.toStringTag, { value: "Module" })), ea = /* @__PURE__ */ Ue(Qi), ta = /* @__PURE__ */ Ue(ys), ra = /* @__PURE__ */ Ue(Ms), na = /* @__PURE__ */ Ue(Ps), oa = ["values", "unit", "step"], sa = (e) => {
  const t = Object.keys(e).map((r) => ({
    key: r,
    val: e[r]
  })) || [];
  return t.sort((r, n) => r.val - n.val), t.reduce((r, n) => K({}, r, {
    [n.key]: n.val
  }), {});
};
function po(e) {
  const {
    // The breakpoint **start** at this value.
    // For instance with the first breakpoint xs: [xs, sm).
    values: t = {
      xs: 0,
      // phone
      sm: 600,
      // tablet
      md: 900,
      // small laptop
      lg: 1200,
      // desktop
      xl: 1536
      // large screen
    },
    unit: r = "px",
    step: n = 5
  } = e, o = Ze(e, oa), i = sa(t), s = Object.keys(i);
  function c(l) {
    return `@media (min-width:${typeof t[l] == "number" ? t[l] : l}${r})`;
  }
  function u(l) {
    return `@media (max-width:${(typeof t[l] == "number" ? t[l] : l) - n / 100}${r})`;
  }
  function d(l, p) {
    const m = s.indexOf(p);
    return `@media (min-width:${typeof t[l] == "number" ? t[l] : l}${r}) and (max-width:${(m !== -1 && typeof t[s[m]] == "number" ? t[s[m]] : p) - n / 100}${r})`;
  }
  function h(l) {
    return s.indexOf(l) + 1 < s.length ? d(l, s[s.indexOf(l) + 1]) : c(l);
  }
  function f(l) {
    const p = s.indexOf(l);
    return p === 0 ? c(s[1]) : p === s.length - 1 ? u(s[p]) : d(l, s[s.indexOf(l) + 1]).replace("@media", "@media not all and");
  }
  return K({
    keys: s,
    values: i,
    up: c,
    down: u,
    between: d,
    only: h,
    not: f,
    unit: r
  }, o);
}
const ia = {
  borderRadius: 4
}, Qe = process.env.NODE_ENV !== "production" ? N.oneOfType([N.number, N.string, N.object, N.array]) : {};
function St(e, t) {
  return t ? ze(e, t, {
    clone: !1
    // No need to clone deep, it's way faster.
  }) : e;
}
const Fr = {
  xs: 0,
  // phone
  sm: 600,
  // tablet
  md: 900,
  // small laptop
  lg: 1200,
  // desktop
  xl: 1536
  // large screen
}, _n = {
  // Sorted ASC by size. That's important.
  // It can't be configured as it's used statically for propTypes.
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (e) => `@media (min-width:${Fr[e]}px)`
};
function Be(e, t, r) {
  const n = e.theme || {};
  if (Array.isArray(t)) {
    const i = n.breakpoints || _n;
    return t.reduce((s, c, u) => (s[i.up(i.keys[u])] = r(t[u]), s), {});
  }
  if (typeof t == "object") {
    const i = n.breakpoints || _n;
    return Object.keys(t).reduce((s, c) => {
      if (Object.keys(i.values || Fr).indexOf(c) !== -1) {
        const u = i.up(c);
        s[u] = r(t[c], c);
      } else {
        const u = c;
        s[u] = t[u];
      }
      return s;
    }, {});
  }
  return r(t);
}
function aa(e = {}) {
  var t;
  return ((t = e.keys) == null ? void 0 : t.reduce((n, o) => {
    const i = e.up(o);
    return n[i] = {}, n;
  }, {})) || {};
}
function Cn(e, t) {
  return e.reduce((r, n) => {
    const o = r[n];
    return (!o || Object.keys(o).length === 0) && delete r[n], r;
  }, t);
}
function Qt(e, t, r = !0) {
  if (!t || typeof t != "string")
    return null;
  if (e && e.vars && r) {
    const n = `vars.${t}`.split(".").reduce((o, i) => o && o[i] ? o[i] : null, e);
    if (n != null)
      return n;
  }
  return t.split(".").reduce((n, o) => n && n[o] != null ? n[o] : null, e);
}
function Vt(e, t, r, n = r) {
  let o;
  return typeof e == "function" ? o = e(r) : Array.isArray(e) ? o = e[r] || n : o = Qt(e, r) || n, t && (o = t(o, n, e)), o;
}
function ie(e) {
  const {
    prop: t,
    cssProperty: r = e.prop,
    themeKey: n,
    transform: o
  } = e, i = (s) => {
    if (s[t] == null)
      return null;
    const c = s[t], u = s.theme, d = Qt(u, n) || {};
    return Be(s, c, (f) => {
      let l = Vt(d, o, f);
      return f === l && typeof f == "string" && (l = Vt(d, o, `${t}${f === "default" ? "" : Je(f)}`, f)), r === !1 ? l : {
        [r]: l
      };
    });
  };
  return i.propTypes = process.env.NODE_ENV !== "production" ? {
    [t]: Qe
  } : {}, i.filterProps = [t], i;
}
function ca(e) {
  const t = {};
  return (r) => (t[r] === void 0 && (t[r] = e(r)), t[r]);
}
const la = {
  m: "margin",
  p: "padding"
}, ua = {
  t: "Top",
  r: "Right",
  b: "Bottom",
  l: "Left",
  x: ["Left", "Right"],
  y: ["Top", "Bottom"]
}, $n = {
  marginX: "mx",
  marginY: "my",
  paddingX: "px",
  paddingY: "py"
}, da = ca((e) => {
  if (e.length > 2)
    if ($n[e])
      e = $n[e];
    else
      return [e];
  const [t, r] = e.split(""), n = la[t], o = ua[r] || "";
  return Array.isArray(o) ? o.map((i) => n + i) : [n + o];
}), er = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"], tr = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"], fa = [...er, ...tr];
function Rt(e, t, r, n) {
  var o;
  const i = (o = Qt(e, t, !1)) != null ? o : r;
  return typeof i == "number" ? (s) => typeof s == "string" ? s : (process.env.NODE_ENV !== "production" && typeof s != "number" && console.error(`MUI: Expected ${n} argument to be a number or a string, got ${s}.`), i * s) : Array.isArray(i) ? (s) => typeof s == "string" ? s : (process.env.NODE_ENV !== "production" && (Number.isInteger(s) ? s > i.length - 1 && console.error([`MUI: The value provided (${s}) overflows.`, `The supported values are: ${JSON.stringify(i)}.`, `${s} > ${i.length - 1}, you need to add the missing values.`].join(`
`)) : console.error([`MUI: The \`theme.${t}\` array type cannot be combined with non integer values.You should either use an integer value that can be used as index, or define the \`theme.${t}\` as a number.`].join(`
`))), i[s]) : typeof i == "function" ? i : (process.env.NODE_ENV !== "production" && console.error([`MUI: The \`theme.${t}\` value (${i}) is invalid.`, "It should be a number, an array or a function."].join(`
`)), () => {
  });
}
function ho(e) {
  return Rt(e, "spacing", 8, "spacing");
}
function Dt(e, t) {
  if (typeof t == "string" || t == null)
    return t;
  const r = Math.abs(t), n = e(r);
  return t >= 0 ? n : typeof n == "number" ? -n : `-${n}`;
}
function pa(e, t) {
  return (r) => e.reduce((n, o) => (n[o] = Dt(t, r), n), {});
}
function ha(e, t, r, n) {
  if (t.indexOf(r) === -1)
    return null;
  const o = da(r), i = pa(o, n), s = e[r];
  return Be(e, s, i);
}
function mo(e, t) {
  const r = ho(e.theme);
  return Object.keys(e).map((n) => ha(e, t, n, r)).reduce(St, {});
}
function ne(e) {
  return mo(e, er);
}
ne.propTypes = process.env.NODE_ENV !== "production" ? er.reduce((e, t) => (e[t] = Qe, e), {}) : {};
ne.filterProps = er;
function oe(e) {
  return mo(e, tr);
}
oe.propTypes = process.env.NODE_ENV !== "production" ? tr.reduce((e, t) => (e[t] = Qe, e), {}) : {};
oe.filterProps = tr;
process.env.NODE_ENV !== "production" && fa.reduce((e, t) => (e[t] = Qe, e), {});
function ma(e = 8) {
  if (e.mui)
    return e;
  const t = ho({
    spacing: e
  }), r = (...n) => (process.env.NODE_ENV !== "production" && (n.length <= 4 || console.error(`MUI: Too many arguments provided, expected between 0 and 4, got ${n.length}`)), (n.length === 0 ? [1] : n).map((i) => {
    const s = t(i);
    return typeof s == "number" ? `${s}px` : s;
  }).join(" "));
  return r.mui = !0, r;
}
function rr(...e) {
  const t = e.reduce((n, o) => (o.filterProps.forEach((i) => {
    n[i] = o;
  }), n), {}), r = (n) => Object.keys(n).reduce((o, i) => t[i] ? St(o, t[i](n)) : o, {});
  return r.propTypes = process.env.NODE_ENV !== "production" ? e.reduce((n, o) => Object.assign(n, o.propTypes), {}) : {}, r.filterProps = e.reduce((n, o) => n.concat(o.filterProps), []), r;
}
function Re(e) {
  return typeof e != "number" ? e : `${e}px solid`;
}
function Pe(e, t) {
  return ie({
    prop: e,
    themeKey: "borders",
    transform: t
  });
}
const ya = Pe("border", Re), ga = Pe("borderTop", Re), ba = Pe("borderRight", Re), va = Pe("borderBottom", Re), xa = Pe("borderLeft", Re), Sa = Pe("borderColor"), wa = Pe("borderTopColor"), Ea = Pe("borderRightColor"), Ta = Pe("borderBottomColor"), _a = Pe("borderLeftColor"), Ca = Pe("outline", Re), $a = Pe("outlineColor"), nr = (e) => {
  if (e.borderRadius !== void 0 && e.borderRadius !== null) {
    const t = Rt(e.theme, "shape.borderRadius", 4, "borderRadius"), r = (n) => ({
      borderRadius: Dt(t, n)
    });
    return Be(e, e.borderRadius, r);
  }
  return null;
};
nr.propTypes = process.env.NODE_ENV !== "production" ? {
  borderRadius: Qe
} : {};
nr.filterProps = ["borderRadius"];
rr(ya, ga, ba, va, xa, Sa, wa, Ea, Ta, _a, nr, Ca, $a);
const or = (e) => {
  if (e.gap !== void 0 && e.gap !== null) {
    const t = Rt(e.theme, "spacing", 8, "gap"), r = (n) => ({
      gap: Dt(t, n)
    });
    return Be(e, e.gap, r);
  }
  return null;
};
or.propTypes = process.env.NODE_ENV !== "production" ? {
  gap: Qe
} : {};
or.filterProps = ["gap"];
const sr = (e) => {
  if (e.columnGap !== void 0 && e.columnGap !== null) {
    const t = Rt(e.theme, "spacing", 8, "columnGap"), r = (n) => ({
      columnGap: Dt(t, n)
    });
    return Be(e, e.columnGap, r);
  }
  return null;
};
sr.propTypes = process.env.NODE_ENV !== "production" ? {
  columnGap: Qe
} : {};
sr.filterProps = ["columnGap"];
const ir = (e) => {
  if (e.rowGap !== void 0 && e.rowGap !== null) {
    const t = Rt(e.theme, "spacing", 8, "rowGap"), r = (n) => ({
      rowGap: Dt(t, n)
    });
    return Be(e, e.rowGap, r);
  }
  return null;
};
ir.propTypes = process.env.NODE_ENV !== "production" ? {
  rowGap: Qe
} : {};
ir.filterProps = ["rowGap"];
const Oa = ie({
  prop: "gridColumn"
}), Ra = ie({
  prop: "gridRow"
}), Da = ie({
  prop: "gridAutoFlow"
}), Pa = ie({
  prop: "gridAutoColumns"
}), Ma = ie({
  prop: "gridAutoRows"
}), Ia = ie({
  prop: "gridTemplateColumns"
}), Aa = ie({
  prop: "gridTemplateRows"
}), ka = ie({
  prop: "gridTemplateAreas"
}), Na = ie({
  prop: "gridArea"
});
rr(or, sr, ir, Oa, Ra, Da, Pa, Ma, Ia, Aa, ka, Na);
function dt(e, t) {
  return t === "grey" ? t : e;
}
const za = ie({
  prop: "color",
  themeKey: "palette",
  transform: dt
}), La = ie({
  prop: "bgcolor",
  cssProperty: "backgroundColor",
  themeKey: "palette",
  transform: dt
}), ja = ie({
  prop: "backgroundColor",
  themeKey: "palette",
  transform: dt
});
rr(za, La, ja);
function _e(e) {
  return e <= 1 && e !== 0 ? `${e * 100}%` : e;
}
const Wa = ie({
  prop: "width",
  transform: _e
}), Br = (e) => {
  if (e.maxWidth !== void 0 && e.maxWidth !== null) {
    const t = (r) => {
      var n, o;
      const i = ((n = e.theme) == null || (n = n.breakpoints) == null || (n = n.values) == null ? void 0 : n[r]) || Fr[r];
      return i ? ((o = e.theme) == null || (o = o.breakpoints) == null ? void 0 : o.unit) !== "px" ? {
        maxWidth: `${i}${e.theme.breakpoints.unit}`
      } : {
        maxWidth: i
      } : {
        maxWidth: _e(r)
      };
    };
    return Be(e, e.maxWidth, t);
  }
  return null;
};
Br.filterProps = ["maxWidth"];
const Fa = ie({
  prop: "minWidth",
  transform: _e
}), Ba = ie({
  prop: "height",
  transform: _e
}), Ua = ie({
  prop: "maxHeight",
  transform: _e
}), Va = ie({
  prop: "minHeight",
  transform: _e
});
ie({
  prop: "size",
  cssProperty: "width",
  transform: _e
});
ie({
  prop: "size",
  cssProperty: "height",
  transform: _e
});
const Ya = ie({
  prop: "boxSizing"
});
rr(Wa, Br, Fa, Ba, Ua, Va, Ya);
const Pt = {
  // borders
  border: {
    themeKey: "borders",
    transform: Re
  },
  borderTop: {
    themeKey: "borders",
    transform: Re
  },
  borderRight: {
    themeKey: "borders",
    transform: Re
  },
  borderBottom: {
    themeKey: "borders",
    transform: Re
  },
  borderLeft: {
    themeKey: "borders",
    transform: Re
  },
  borderColor: {
    themeKey: "palette"
  },
  borderTopColor: {
    themeKey: "palette"
  },
  borderRightColor: {
    themeKey: "palette"
  },
  borderBottomColor: {
    themeKey: "palette"
  },
  borderLeftColor: {
    themeKey: "palette"
  },
  outline: {
    themeKey: "borders",
    transform: Re
  },
  outlineColor: {
    themeKey: "palette"
  },
  borderRadius: {
    themeKey: "shape.borderRadius",
    style: nr
  },
  // palette
  color: {
    themeKey: "palette",
    transform: dt
  },
  bgcolor: {
    themeKey: "palette",
    cssProperty: "backgroundColor",
    transform: dt
  },
  backgroundColor: {
    themeKey: "palette",
    transform: dt
  },
  // spacing
  p: {
    style: oe
  },
  pt: {
    style: oe
  },
  pr: {
    style: oe
  },
  pb: {
    style: oe
  },
  pl: {
    style: oe
  },
  px: {
    style: oe
  },
  py: {
    style: oe
  },
  padding: {
    style: oe
  },
  paddingTop: {
    style: oe
  },
  paddingRight: {
    style: oe
  },
  paddingBottom: {
    style: oe
  },
  paddingLeft: {
    style: oe
  },
  paddingX: {
    style: oe
  },
  paddingY: {
    style: oe
  },
  paddingInline: {
    style: oe
  },
  paddingInlineStart: {
    style: oe
  },
  paddingInlineEnd: {
    style: oe
  },
  paddingBlock: {
    style: oe
  },
  paddingBlockStart: {
    style: oe
  },
  paddingBlockEnd: {
    style: oe
  },
  m: {
    style: ne
  },
  mt: {
    style: ne
  },
  mr: {
    style: ne
  },
  mb: {
    style: ne
  },
  ml: {
    style: ne
  },
  mx: {
    style: ne
  },
  my: {
    style: ne
  },
  margin: {
    style: ne
  },
  marginTop: {
    style: ne
  },
  marginRight: {
    style: ne
  },
  marginBottom: {
    style: ne
  },
  marginLeft: {
    style: ne
  },
  marginX: {
    style: ne
  },
  marginY: {
    style: ne
  },
  marginInline: {
    style: ne
  },
  marginInlineStart: {
    style: ne
  },
  marginInlineEnd: {
    style: ne
  },
  marginBlock: {
    style: ne
  },
  marginBlockStart: {
    style: ne
  },
  marginBlockEnd: {
    style: ne
  },
  // display
  displayPrint: {
    cssProperty: !1,
    transform: (e) => ({
      "@media print": {
        display: e
      }
    })
  },
  display: {},
  overflow: {},
  textOverflow: {},
  visibility: {},
  whiteSpace: {},
  // flexbox
  flexBasis: {},
  flexDirection: {},
  flexWrap: {},
  justifyContent: {},
  alignItems: {},
  alignContent: {},
  order: {},
  flex: {},
  flexGrow: {},
  flexShrink: {},
  alignSelf: {},
  justifyItems: {},
  justifySelf: {},
  // grid
  gap: {
    style: or
  },
  rowGap: {
    style: ir
  },
  columnGap: {
    style: sr
  },
  gridColumn: {},
  gridRow: {},
  gridAutoFlow: {},
  gridAutoColumns: {},
  gridAutoRows: {},
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridTemplateAreas: {},
  gridArea: {},
  // positions
  position: {},
  zIndex: {
    themeKey: "zIndex"
  },
  top: {},
  right: {},
  bottom: {},
  left: {},
  // shadows
  boxShadow: {
    themeKey: "shadows"
  },
  // sizing
  width: {
    transform: _e
  },
  maxWidth: {
    style: Br
  },
  minWidth: {
    transform: _e
  },
  height: {
    transform: _e
  },
  maxHeight: {
    transform: _e
  },
  minHeight: {
    transform: _e
  },
  boxSizing: {},
  // typography
  fontFamily: {
    themeKey: "typography"
  },
  fontSize: {
    themeKey: "typography"
  },
  fontStyle: {
    themeKey: "typography"
  },
  fontWeight: {
    themeKey: "typography"
  },
  letterSpacing: {},
  textTransform: {},
  lineHeight: {},
  textAlign: {},
  typography: {
    cssProperty: !1,
    themeKey: "typography"
  }
};
function qa(...e) {
  const t = e.reduce((n, o) => n.concat(Object.keys(o)), []), r = new Set(t);
  return e.every((n) => r.size === Object.keys(n).length);
}
function Ha(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function yo() {
  function e(r, n, o, i) {
    const s = {
      [r]: n,
      theme: o
    }, c = i[r];
    if (!c)
      return {
        [r]: n
      };
    const {
      cssProperty: u = r,
      themeKey: d,
      transform: h,
      style: f
    } = c;
    if (n == null)
      return null;
    if (d === "typography" && n === "inherit")
      return {
        [r]: n
      };
    const l = Qt(o, d) || {};
    return f ? f(s) : Be(s, n, (m) => {
      let a = Vt(l, h, m);
      return m === a && typeof m == "string" && (a = Vt(l, h, `${r}${m === "default" ? "" : Je(m)}`, m)), u === !1 ? a : {
        [u]: a
      };
    });
  }
  function t(r) {
    var n;
    const {
      sx: o,
      theme: i = {},
      nested: s
    } = r || {};
    if (!o)
      return null;
    const c = (n = i.unstable_sxConfig) != null ? n : Pt;
    function u(d) {
      let h = d;
      if (typeof d == "function")
        h = d(i);
      else if (typeof d != "object")
        return d;
      if (!h)
        return null;
      const f = aa(i.breakpoints), l = Object.keys(f);
      let p = f;
      return Object.keys(h).forEach((m) => {
        const a = Ha(h[m], i);
        if (a != null)
          if (typeof a == "object")
            if (c[m])
              p = St(p, e(m, a, i, c));
            else {
              const y = Be({
                theme: i
              }, a, (x) => ({
                [m]: x
              }));
              qa(y, a) ? p[m] = t({
                sx: a,
                theme: i,
                nested: !0
              }) : p = St(p, y);
            }
          else
            p = St(p, e(m, a, i, c));
      }), !s && i.modularCssLayers ? {
        "@layer sx": Cn(l, p)
      } : Cn(l, p);
    }
    return Array.isArray(o) ? o.map(u) : u(o);
  }
  return t;
}
const ar = yo();
ar.filterProps = ["sx"];
function go(e, t) {
  const r = this;
  return r.vars && typeof r.getColorSchemeSelector == "function" ? {
    [r.getColorSchemeSelector(e).replace(/(\[[^\]]+\])/, "*:where($1)")]: t
  } : r.palette.mode === e ? t : {};
}
const Ga = ["breakpoints", "palette", "spacing", "shape"];
function bo(e = {}, ...t) {
  const {
    breakpoints: r = {},
    palette: n = {},
    spacing: o,
    shape: i = {}
  } = e, s = Ze(e, Ga), c = po(r), u = ma(o);
  let d = ze({
    breakpoints: c,
    direction: "ltr",
    components: {},
    // Inject component definitions.
    palette: K({
      mode: "light"
    }, n),
    spacing: u,
    shape: K({}, ia, i)
  }, s);
  return d.applyStyles = go, d = t.reduce((h, f) => ze(h, f), d), d.unstable_sxConfig = K({}, Pt, s == null ? void 0 : s.unstable_sxConfig), d.unstable_sx = function(f) {
    return ar({
      sx: f,
      theme: this
    });
  }, d;
}
const Ka = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: bo,
  private_createBreakpoints: po,
  unstable_applyStyles: go
}, Symbol.toStringTag, { value: "Module" })), Xa = /* @__PURE__ */ Ue(Ka), Ja = ["sx"], Za = (e) => {
  var t, r;
  const n = {
    systemProps: {},
    otherProps: {}
  }, o = (t = e == null || (r = e.theme) == null ? void 0 : r.unstable_sxConfig) != null ? t : Pt;
  return Object.keys(e).forEach((i) => {
    o[i] ? n.systemProps[i] = e[i] : n.otherProps[i] = e[i];
  }), n;
};
function Qa(e) {
  const {
    sx: t
  } = e, r = Ze(e, Ja), {
    systemProps: n,
    otherProps: o
  } = Za(r);
  let i;
  return Array.isArray(t) ? i = [n, ...t] : typeof t == "function" ? i = (...s) => {
    const c = t(...s);
    return Ge(c) ? K({}, n, c) : n;
  } : i = K({}, n, t), K({}, o, {
    sx: i
  });
}
const ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ar,
  extendSxProp: Qa,
  unstable_createStyleFunctionSx: yo,
  unstable_defaultSxConfig: Pt
}, Symbol.toStringTag, { value: "Module" })), tc = /* @__PURE__ */ Ue(ec);
var mt = Gt;
Object.defineProperty($t, "__esModule", {
  value: !0
});
var rc = $t.default = yc;
$t.shouldForwardProp = Wt;
$t.systemDefaultTheme = void 0;
var $e = mt(ui()), Ir = mt(di()), Yt = dc(ea), nc = ta, oc = mt(ra), sc = mt(na), ic = mt(Xa), ac = mt(tc);
const cc = ["ownerState"], lc = ["variants"], uc = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
function vo(e) {
  if (typeof WeakMap != "function") return null;
  var t = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (vo = function(n) {
    return n ? r : t;
  })(e);
}
function dc(e, t) {
  if (e && e.__esModule) return e;
  if (e === null || typeof e != "object" && typeof e != "function") return { default: e };
  var r = vo(t);
  if (r && r.has(e)) return r.get(e);
  var n = { __proto__: null }, o = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var i in e) if (i !== "default" && Object.prototype.hasOwnProperty.call(e, i)) {
    var s = o ? Object.getOwnPropertyDescriptor(e, i) : null;
    s && (s.get || s.set) ? Object.defineProperty(n, i, s) : n[i] = e[i];
  }
  return n.default = e, r && r.set(e, n), n;
}
function fc(e) {
  return Object.keys(e).length === 0;
}
function pc(e) {
  return typeof e == "string" && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  e.charCodeAt(0) > 96;
}
function Wt(e) {
  return e !== "ownerState" && e !== "theme" && e !== "sx" && e !== "as";
}
function On(e, t) {
  return t && e && typeof e == "object" && e.styles && !e.styles.startsWith("@layer") && (e.styles = `@layer ${t}{${String(e.styles)}}`), e;
}
const hc = $t.systemDefaultTheme = (0, ic.default)(), Rn = (e) => e && e.charAt(0).toLowerCase() + e.slice(1);
function Nt({
  defaultTheme: e,
  theme: t,
  themeId: r
}) {
  return fc(t) ? e : t[r] || t;
}
function mc(e) {
  return e ? (t, r) => r[e] : null;
}
function Ft(e, t, r) {
  let {
    ownerState: n
  } = t, o = (0, Ir.default)(t, cc);
  const i = typeof e == "function" ? e((0, $e.default)({
    ownerState: n
  }, o)) : e;
  if (Array.isArray(i))
    return i.flatMap((s) => Ft(s, (0, $e.default)({
      ownerState: n
    }, o), r));
  if (i && typeof i == "object" && Array.isArray(i.variants)) {
    const {
      variants: s = []
    } = i;
    let u = (0, Ir.default)(i, lc);
    return s.forEach((d) => {
      let h = !0;
      if (typeof d.props == "function" ? h = d.props((0, $e.default)({
        ownerState: n
      }, o, n)) : Object.keys(d.props).forEach((f) => {
        (n == null ? void 0 : n[f]) !== d.props[f] && o[f] !== d.props[f] && (h = !1);
      }), h) {
        Array.isArray(u) || (u = [u]);
        const f = typeof d.style == "function" ? d.style((0, $e.default)({
          ownerState: n
        }, o, n)) : d.style;
        u.push(r ? On((0, Yt.internal_serializeStyles)(f), r) : f);
      }
    }), u;
  }
  return r ? On((0, Yt.internal_serializeStyles)(i), r) : i;
}
function yc(e = {}) {
  const {
    themeId: t,
    defaultTheme: r = hc,
    rootShouldForwardProp: n = Wt,
    slotShouldForwardProp: o = Wt
  } = e, i = (s) => (0, ac.default)((0, $e.default)({}, s, {
    theme: Nt((0, $e.default)({}, s, {
      defaultTheme: r,
      themeId: t
    }))
  }));
  return i.__mui_systemSx = !0, (s, c = {}) => {
    (0, Yt.internal_processStyles)(s, (R) => R.filter((_) => !(_ != null && _.__mui_systemSx)));
    const {
      name: u,
      slot: d,
      skipVariantsResolver: h,
      skipSx: f,
      // TODO v6: remove `lowercaseFirstLetter()` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      overridesResolver: l = mc(Rn(d))
    } = c, p = (0, Ir.default)(c, uc), m = u && u.startsWith("Mui") || d ? "components" : "custom", a = h !== void 0 ? h : (
      // TODO v6: remove `Root` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      d && d !== "Root" && d !== "root" || !1
    ), y = f || !1;
    let x;
    process.env.NODE_ENV !== "production" && u && (x = `${u}-${Rn(d || "Root")}`);
    let E = Wt;
    d === "Root" || d === "root" ? E = n : d ? E = o : pc(s) && (E = void 0);
    const S = (0, Yt.default)(s, (0, $e.default)({
      shouldForwardProp: E,
      label: x
    }, p)), O = (R) => typeof R == "function" && R.__emotion_real !== R || (0, nc.isPlainObject)(R) ? (_) => {
      const I = Nt({
        theme: _.theme,
        defaultTheme: r,
        themeId: t
      });
      return Ft(R, (0, $e.default)({}, _, {
        theme: I
      }), I.modularCssLayers ? m : void 0);
    } : R, g = (R, ..._) => {
      let I = O(R);
      const re = _ ? _.map(O) : [];
      u && l && re.push((Z) => {
        const C = Nt((0, $e.default)({}, Z, {
          defaultTheme: r,
          themeId: t
        }));
        if (!C.components || !C.components[u] || !C.components[u].styleOverrides)
          return null;
        const U = C.components[u].styleOverrides, fe = {};
        return Object.entries(U).forEach(([pe, ue]) => {
          fe[pe] = Ft(ue, (0, $e.default)({}, Z, {
            theme: C
          }), C.modularCssLayers ? "theme" : void 0);
        }), l(Z, fe);
      }), u && !a && re.push((Z) => {
        var C;
        const U = Nt((0, $e.default)({}, Z, {
          defaultTheme: r,
          themeId: t
        })), fe = U == null || (C = U.components) == null || (C = C[u]) == null ? void 0 : C.variants;
        return Ft({
          variants: fe
        }, (0, $e.default)({}, Z, {
          theme: U
        }), U.modularCssLayers ? "theme" : void 0);
      }), y || re.push(i);
      const ce = re.length - _.length;
      if (Array.isArray(R) && ce > 0) {
        const Z = new Array(ce).fill("");
        I = [...R, ...Z], I.raw = [...R.raw, ...Z];
      }
      const de = S(I, ...re);
      if (process.env.NODE_ENV !== "production") {
        let Z;
        u && (Z = `${u}${(0, oc.default)(d || "")}`), Z === void 0 && (Z = `Styled(${(0, sc.default)(s)})`), de.displayName = Z;
      }
      return s.muiName && (de.muiName = s.muiName), de;
    };
    return S.withConfig && (g.withConfig = S.withConfig), g;
  };
}
function gc(e, t) {
  return K({
    toolbar: {
      minHeight: 56,
      [e.up("xs")]: {
        "@media (orientation: landscape)": {
          minHeight: 48
        }
      },
      [e.up("sm")]: {
        minHeight: 64
      }
    }
  }, t);
}
var ae = {};
const bc = /* @__PURE__ */ Ue(Cs), vc = /* @__PURE__ */ Ue(oi);
var xo = Gt;
Object.defineProperty(ae, "__esModule", {
  value: !0
});
ae.alpha = To;
ae.blend = Pc;
ae.colorChannel = void 0;
var xc = ae.darken = Vr;
ae.decomposeColor = De;
ae.emphasize = _o;
var Dn = ae.getContrastRatio = Cc;
ae.getLuminance = qt;
ae.hexToRgb = So;
ae.hslToRgb = Eo;
var Sc = ae.lighten = Yr;
ae.private_safeAlpha = $c;
ae.private_safeColorChannel = void 0;
ae.private_safeDarken = Oc;
ae.private_safeEmphasize = Dc;
ae.private_safeLighten = Rc;
ae.recomposeColor = yt;
ae.rgbToHex = _c;
var Pn = xo(bc), wc = xo(vc);
function Ur(e, t = 0, r = 1) {
  return process.env.NODE_ENV !== "production" && (e < t || e > r) && console.error(`MUI: The value provided ${e} is out of range [${t}, ${r}].`), (0, wc.default)(e, t, r);
}
function So(e) {
  e = e.slice(1);
  const t = new RegExp(`.{1,${e.length >= 6 ? 2 : 1}}`, "g");
  let r = e.match(t);
  return r && r[0].length === 1 && (r = r.map((n) => n + n)), r ? `rgb${r.length === 4 ? "a" : ""}(${r.map((n, o) => o < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3).join(", ")})` : "";
}
function Ec(e) {
  const t = e.toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function De(e) {
  if (e.type)
    return e;
  if (e.charAt(0) === "#")
    return De(So(e));
  const t = e.indexOf("("), r = e.substring(0, t);
  if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(r) === -1)
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: Unsupported \`${e}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().` : (0, Pn.default)(9, e));
  let n = e.substring(t + 1, e.length - 1), o;
  if (r === "color") {
    if (n = n.split(" "), o = n.shift(), n.length === 4 && n[3].charAt(0) === "/" && (n[3] = n[3].slice(1)), ["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(o) === -1)
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: unsupported \`${o}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.` : (0, Pn.default)(10, o));
  } else
    n = n.split(",");
  return n = n.map((i) => parseFloat(i)), {
    type: r,
    values: n,
    colorSpace: o
  };
}
const wo = (e) => {
  const t = De(e);
  return t.values.slice(0, 3).map((r, n) => t.type.indexOf("hsl") !== -1 && n !== 0 ? `${r}%` : r).join(" ");
};
ae.colorChannel = wo;
const Tc = (e, t) => {
  try {
    return wo(e);
  } catch {
    return t && process.env.NODE_ENV !== "production" && console.warn(t), e;
  }
};
ae.private_safeColorChannel = Tc;
function yt(e) {
  const {
    type: t,
    colorSpace: r
  } = e;
  let {
    values: n
  } = e;
  return t.indexOf("rgb") !== -1 ? n = n.map((o, i) => i < 3 ? parseInt(o, 10) : o) : t.indexOf("hsl") !== -1 && (n[1] = `${n[1]}%`, n[2] = `${n[2]}%`), t.indexOf("color") !== -1 ? n = `${r} ${n.join(" ")}` : n = `${n.join(", ")}`, `${t}(${n})`;
}
function _c(e) {
  if (e.indexOf("#") === 0)
    return e;
  const {
    values: t
  } = De(e);
  return `#${t.map((r, n) => Ec(n === 3 ? Math.round(255 * r) : r)).join("")}`;
}
function Eo(e) {
  e = De(e);
  const {
    values: t
  } = e, r = t[0], n = t[1] / 100, o = t[2] / 100, i = n * Math.min(o, 1 - o), s = (d, h = (d + r / 30) % 12) => o - i * Math.max(Math.min(h - 3, 9 - h, 1), -1);
  let c = "rgb";
  const u = [Math.round(s(0) * 255), Math.round(s(8) * 255), Math.round(s(4) * 255)];
  return e.type === "hsla" && (c += "a", u.push(t[3])), yt({
    type: c,
    values: u
  });
}
function qt(e) {
  e = De(e);
  let t = e.type === "hsl" || e.type === "hsla" ? De(Eo(e)).values : e.values;
  return t = t.map((r) => (e.type !== "color" && (r /= 255), r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4)), Number((0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]).toFixed(3));
}
function Cc(e, t) {
  const r = qt(e), n = qt(t);
  return (Math.max(r, n) + 0.05) / (Math.min(r, n) + 0.05);
}
function To(e, t) {
  return e = De(e), t = Ur(t), (e.type === "rgb" || e.type === "hsl") && (e.type += "a"), e.type === "color" ? e.values[3] = `/${t}` : e.values[3] = t, yt(e);
}
function $c(e, t, r) {
  try {
    return To(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Vr(e, t) {
  if (e = De(e), t = Ur(t), e.type.indexOf("hsl") !== -1)
    e.values[2] *= 1 - t;
  else if (e.type.indexOf("rgb") !== -1 || e.type.indexOf("color") !== -1)
    for (let r = 0; r < 3; r += 1)
      e.values[r] *= 1 - t;
  return yt(e);
}
function Oc(e, t, r) {
  try {
    return Vr(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Yr(e, t) {
  if (e = De(e), t = Ur(t), e.type.indexOf("hsl") !== -1)
    e.values[2] += (100 - e.values[2]) * t;
  else if (e.type.indexOf("rgb") !== -1)
    for (let r = 0; r < 3; r += 1)
      e.values[r] += (255 - e.values[r]) * t;
  else if (e.type.indexOf("color") !== -1)
    for (let r = 0; r < 3; r += 1)
      e.values[r] += (1 - e.values[r]) * t;
  return yt(e);
}
function Rc(e, t, r) {
  try {
    return Yr(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function _o(e, t = 0.15) {
  return qt(e) > 0.5 ? Vr(e, t) : Yr(e, t);
}
function Dc(e, t, r) {
  try {
    return _o(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Pc(e, t, r, n = 1) {
  const o = (u, d) => Math.round((u ** (1 / n) * (1 - r) + d ** (1 / n) * r) ** n), i = De(e), s = De(t), c = [o(i.values[0], s.values[0]), o(i.values[1], s.values[1]), o(i.values[2], s.values[2])];
  return yt({
    type: "rgb",
    values: c
  });
}
const Ct = {
  black: "#000",
  white: "#fff"
}, Mc = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
}, st = {
  50: "#f3e5f5",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  700: "#7b1fa2"
}, it = {
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  700: "#d32f2f",
  800: "#c62828"
}, vt = {
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  700: "#f57c00",
  900: "#e65100"
}, at = {
  50: "#e3f2fd",
  200: "#90caf9",
  400: "#42a5f5",
  700: "#1976d2",
  800: "#1565c0"
}, ct = {
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  700: "#0288d1",
  900: "#01579b"
}, lt = {
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20"
}, Ic = ["mode", "contrastThreshold", "tonalOffset"], Mn = {
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: "rgba(0, 0, 0, 0.87)",
    // Secondary text.
    secondary: "rgba(0, 0, 0, 0.6)",
    // Disabled text have even lower visual prominence.
    disabled: "rgba(0, 0, 0, 0.38)"
  },
  // The color used to divide different elements.
  divider: "rgba(0, 0, 0, 0.12)",
  // The background colors used to style the surfaces.
  // Consistency between these values is important.
  background: {
    paper: Ct.white,
    default: Ct.white
  },
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: "rgba(0, 0, 0, 0.54)",
    // The color of an hovered action.
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    // The color of a selected action.
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08,
    // The color of a disabled action.
    disabled: "rgba(0, 0, 0, 0.26)",
    // The background color of a disabled action.
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  }
}, _r = {
  text: {
    primary: Ct.white,
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)",
    icon: "rgba(255, 255, 255, 0.5)"
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#121212",
    default: "#121212"
  },
  action: {
    active: Ct.white,
    hover: "rgba(255, 255, 255, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255, 255, 255, 0.16)",
    selectedOpacity: 0.16,
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255, 255, 255, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  }
};
function In(e, t, r, n) {
  const o = n.light || n, i = n.dark || n * 1.5;
  e[t] || (e.hasOwnProperty(r) ? e[t] = e[r] : t === "light" ? e.light = Sc(e.main, o) : t === "dark" && (e.dark = xc(e.main, i)));
}
function Ac(e = "light") {
  return e === "dark" ? {
    main: at[200],
    light: at[50],
    dark: at[400]
  } : {
    main: at[700],
    light: at[400],
    dark: at[800]
  };
}
function kc(e = "light") {
  return e === "dark" ? {
    main: st[200],
    light: st[50],
    dark: st[400]
  } : {
    main: st[500],
    light: st[300],
    dark: st[700]
  };
}
function Nc(e = "light") {
  return e === "dark" ? {
    main: it[500],
    light: it[300],
    dark: it[700]
  } : {
    main: it[700],
    light: it[400],
    dark: it[800]
  };
}
function zc(e = "light") {
  return e === "dark" ? {
    main: ct[400],
    light: ct[300],
    dark: ct[700]
  } : {
    main: ct[700],
    light: ct[500],
    dark: ct[900]
  };
}
function Lc(e = "light") {
  return e === "dark" ? {
    main: lt[400],
    light: lt[300],
    dark: lt[700]
  } : {
    main: lt[800],
    light: lt[500],
    dark: lt[900]
  };
}
function jc(e = "light") {
  return e === "dark" ? {
    main: vt[400],
    light: vt[300],
    dark: vt[700]
  } : {
    main: "#ed6c02",
    // closest to orange[800] that pass 3:1.
    light: vt[500],
    dark: vt[900]
  };
}
function Wc(e) {
  const {
    mode: t = "light",
    contrastThreshold: r = 3,
    tonalOffset: n = 0.2
  } = e, o = Ze(e, Ic), i = e.primary || Ac(t), s = e.secondary || kc(t), c = e.error || Nc(t), u = e.info || zc(t), d = e.success || Lc(t), h = e.warning || jc(t);
  function f(a) {
    const y = Dn(a, _r.text.primary) >= r ? _r.text.primary : Mn.text.primary;
    if (process.env.NODE_ENV !== "production") {
      const x = Dn(a, y);
      x < 3 && console.error([`MUI: The contrast ratio of ${x}:1 for ${y} on ${a}`, "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.", "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"].join(`
`));
    }
    return y;
  }
  const l = ({
    color: a,
    name: y,
    mainShade: x = 500,
    lightShade: E = 300,
    darkShade: S = 700
  }) => {
    if (a = K({}, a), !a.main && a[x] && (a.main = a[x]), !a.hasOwnProperty("main"))
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${y ? ` (${y})` : ""} provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${x}\` property.` : Et(11, y ? ` (${y})` : "", x));
    if (typeof a.main != "string")
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${y ? ` (${y})` : ""} provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(a.main)}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });` : Et(12, y ? ` (${y})` : "", JSON.stringify(a.main)));
    return In(a, "light", E, n), In(a, "dark", S, n), a.contrastText || (a.contrastText = f(a.main)), a;
  }, p = {
    dark: _r,
    light: Mn
  };
  return process.env.NODE_ENV !== "production" && (p[t] || console.error(`MUI: The palette mode \`${t}\` is not supported.`)), ze(K({
    // A collection of common colors.
    common: K({}, Ct),
    // prevent mutable object.
    // The palette mode, can be light or dark.
    mode: t,
    // The colors used to represent primary interface elements for a user.
    primary: l({
      color: i,
      name: "primary"
    }),
    // The colors used to represent secondary interface elements for a user.
    secondary: l({
      color: s,
      name: "secondary",
      mainShade: "A400",
      lightShade: "A200",
      darkShade: "A700"
    }),
    // The colors used to represent interface elements that the user should be made aware of.
    error: l({
      color: c,
      name: "error"
    }),
    // The colors used to represent potentially dangerous actions or important messages.
    warning: l({
      color: h,
      name: "warning"
    }),
    // The colors used to present information to the user that is neutral and not necessarily important.
    info: l({
      color: u,
      name: "info"
    }),
    // The colors used to indicate the successful completion of an action that user triggered.
    success: l({
      color: d,
      name: "success"
    }),
    // The grey colors.
    grey: Mc,
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: r,
    // Takes a background color and returns the text color that maximizes the contrast.
    getContrastText: f,
    // Generate a rich color object.
    augmentColor: l,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: n
  }, p[t]), o);
}
const Fc = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
function Bc(e) {
  return Math.round(e * 1e5) / 1e5;
}
const An = {
  textTransform: "uppercase"
}, kn = '"Roboto", "Helvetica", "Arial", sans-serif';
function Uc(e, t) {
  const r = typeof t == "function" ? t(e) : t, {
    fontFamily: n = kn,
    // The default font size of the Material Specification.
    fontSize: o = 14,
    // px
    fontWeightLight: i = 300,
    fontWeightRegular: s = 400,
    fontWeightMedium: c = 500,
    fontWeightBold: u = 700,
    // Tell MUI what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize: d = 16,
    // Apply the CSS properties to all the variants.
    allVariants: h,
    pxToRem: f
  } = r, l = Ze(r, Fc);
  process.env.NODE_ENV !== "production" && (typeof o != "number" && console.error("MUI: `fontSize` is required to be a number."), typeof d != "number" && console.error("MUI: `htmlFontSize` is required to be a number."));
  const p = o / 14, m = f || ((x) => `${x / d * p}rem`), a = (x, E, S, O, g) => K({
    fontFamily: n,
    fontWeight: x,
    fontSize: m(E),
    // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
    lineHeight: S
  }, n === kn ? {
    letterSpacing: `${Bc(O / E)}em`
  } : {}, g, h), y = {
    h1: a(i, 96, 1.167, -1.5),
    h2: a(i, 60, 1.2, -0.5),
    h3: a(s, 48, 1.167, 0),
    h4: a(s, 34, 1.235, 0.25),
    h5: a(s, 24, 1.334, 0),
    h6: a(c, 20, 1.6, 0.15),
    subtitle1: a(s, 16, 1.75, 0.15),
    subtitle2: a(c, 14, 1.57, 0.1),
    body1: a(s, 16, 1.5, 0.15),
    body2: a(s, 14, 1.43, 0.15),
    button: a(c, 14, 1.75, 0.4, An),
    caption: a(s, 12, 1.66, 0.4),
    overline: a(s, 12, 2.66, 1, An),
    // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
    inherit: {
      fontFamily: "inherit",
      fontWeight: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit"
    }
  };
  return ze(K({
    htmlFontSize: d,
    pxToRem: m,
    fontFamily: n,
    fontSize: o,
    fontWeightLight: i,
    fontWeightRegular: s,
    fontWeightMedium: c,
    fontWeightBold: u
  }, y), l, {
    clone: !1
    // No need to clone deep
  });
}
const Vc = 0.2, Yc = 0.14, qc = 0.12;
function te(...e) {
  return [`${e[0]}px ${e[1]}px ${e[2]}px ${e[3]}px rgba(0,0,0,${Vc})`, `${e[4]}px ${e[5]}px ${e[6]}px ${e[7]}px rgba(0,0,0,${Yc})`, `${e[8]}px ${e[9]}px ${e[10]}px ${e[11]}px rgba(0,0,0,${qc})`].join(",");
}
const Hc = ["none", te(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), te(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), te(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), te(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), te(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), te(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), te(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), te(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), te(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), te(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), te(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), te(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), te(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), te(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), te(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), te(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), te(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), te(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), te(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), te(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), te(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), te(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), te(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), te(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)], Gc = ["duration", "easing", "delay"], Kc = {
  // This is the most common easing curve.
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
}, Xc = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
};
function Nn(e) {
  return `${Math.round(e)}ms`;
}
function Jc(e) {
  if (!e)
    return 0;
  const t = e / 36;
  return Math.round((4 + 15 * t ** 0.25 + t / 5) * 10);
}
function Zc(e) {
  const t = K({}, Kc, e.easing), r = K({}, Xc, e.duration);
  return K({
    getAutoHeightDuration: Jc,
    create: (o = ["all"], i = {}) => {
      const {
        duration: s = r.standard,
        easing: c = t.easeInOut,
        delay: u = 0
      } = i, d = Ze(i, Gc);
      if (process.env.NODE_ENV !== "production") {
        const h = (l) => typeof l == "string", f = (l) => !isNaN(parseFloat(l));
        !h(o) && !Array.isArray(o) && console.error('MUI: Argument "props" must be a string or Array.'), !f(s) && !h(s) && console.error(`MUI: Argument "duration" must be a number or a string but found ${s}.`), h(c) || console.error('MUI: Argument "easing" must be a string.'), !f(u) && !h(u) && console.error('MUI: Argument "delay" must be a number or a string.'), typeof i != "object" && console.error(["MUI: Secong argument of transition.create must be an object.", "Arguments should be either `create('prop1', options)` or `create(['prop1', 'prop2'], options)`"].join(`
`)), Object.keys(d).length !== 0 && console.error(`MUI: Unrecognized argument(s) [${Object.keys(d).join(",")}].`);
      }
      return (Array.isArray(o) ? o : [o]).map((h) => `${h} ${typeof s == "string" ? s : Nn(s)} ${c} ${typeof u == "string" ? u : Nn(u)}`).join(",");
    }
  }, e, {
    easing: t,
    duration: r
  });
}
const Qc = {
  mobileStepper: 1e3,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
}, el = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
function tl(e = {}, ...t) {
  const {
    mixins: r = {},
    palette: n = {},
    transitions: o = {},
    typography: i = {}
  } = e, s = Ze(e, el);
  if (e.vars && // The error should throw only for the root theme creation because user is not allowed to use a custom node `vars`.
  // `generateCssVars` is the closest identifier for checking that the `options` is a result of `extendTheme` with CSS variables so that user can create new theme for nested ThemeProvider.
  e.generateCssVars === void 0)
    throw new Error(process.env.NODE_ENV !== "production" ? "MUI: `vars` is a private field used for CSS variables support.\nPlease use another name." : Et(18));
  const c = Wc(n), u = bo(e);
  let d = ze(u, {
    mixins: gc(u.breakpoints, r),
    palette: c,
    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
    shadows: Hc.slice(),
    typography: Uc(c, i),
    transitions: Zc(o),
    zIndex: K({}, Qc)
  });
  if (d = ze(d, s), d = t.reduce((h, f) => ze(h, f), d), process.env.NODE_ENV !== "production") {
    const h = ["active", "checked", "completed", "disabled", "error", "expanded", "focused", "focusVisible", "required", "selected"], f = (l, p) => {
      let m;
      for (m in l) {
        const a = l[m];
        if (h.indexOf(m) !== -1 && Object.keys(a).length > 0) {
          if (process.env.NODE_ENV !== "production") {
            const y = zr("", m);
            console.error([`MUI: The \`${p}\` component increases the CSS specificity of the \`${m}\` internal state.`, "You can not override it like this: ", JSON.stringify(l, null, 2), "", `Instead, you need to use the '&.${y}' syntax:`, JSON.stringify({
              root: {
                [`&.${y}`]: a
              }
            }, null, 2), "", "https://mui.com/r/state-classes-guide"].join(`
`));
          }
          l[m] = {};
        }
      }
    };
    Object.keys(d.components).forEach((l) => {
      const p = d.components[l].styleOverrides;
      p && l.indexOf("Mui") === 0 && f(p, l);
    });
  }
  return d.unstable_sxConfig = K({}, Pt, s == null ? void 0 : s.unstable_sxConfig), d.unstable_sx = function(f) {
    return ar({
      sx: f,
      theme: this
    });
  }, d;
}
const rl = tl(), nl = "$$material";
function ol(e) {
  return e !== "ownerState" && e !== "theme" && e !== "sx" && e !== "as";
}
const sl = (e) => ol(e) && e !== "classes", il = rc({
  themeId: nl,
  defaultTheme: rl,
  rootShouldForwardProp: sl
});
function al(e) {
  return zr("MuiSvgIcon", e);
}
ri("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
const cl = ["children", "className", "color", "component", "fontSize", "htmlColor", "inheritViewBox", "titleAccess", "viewBox"], ll = (e) => {
  const {
    color: t,
    fontSize: r,
    classes: n
  } = e, o = {
    root: ["root", t !== "inherit" && `color${Je(t)}`, `fontSize${Je(r)}`]
  };
  return Qs(o, al, n);
}, ul = il("svg", {
  name: "MuiSvgIcon",
  slot: "Root",
  overridesResolver: (e, t) => {
    const {
      ownerState: r
    } = e;
    return [t.root, r.color !== "inherit" && t[`color${Je(r.color)}`], t[`fontSize${Je(r.fontSize)}`]];
  }
})(({
  theme: e,
  ownerState: t
}) => {
  var r, n, o, i, s, c, u, d, h, f, l, p, m;
  return {
    userSelect: "none",
    width: "1em",
    height: "1em",
    display: "inline-block",
    // the <svg> will define the property that has `currentColor`
    // for example heroicons uses fill="none" and stroke="currentColor"
    fill: t.hasSvgAsChild ? void 0 : "currentColor",
    flexShrink: 0,
    transition: (r = e.transitions) == null || (n = r.create) == null ? void 0 : n.call(r, "fill", {
      duration: (o = e.transitions) == null || (o = o.duration) == null ? void 0 : o.shorter
    }),
    fontSize: {
      inherit: "inherit",
      small: ((i = e.typography) == null || (s = i.pxToRem) == null ? void 0 : s.call(i, 20)) || "1.25rem",
      medium: ((c = e.typography) == null || (u = c.pxToRem) == null ? void 0 : u.call(c, 24)) || "1.5rem",
      large: ((d = e.typography) == null || (h = d.pxToRem) == null ? void 0 : h.call(d, 35)) || "2.1875rem"
    }[t.fontSize],
    // TODO v5 deprecate, v6 remove for sx
    color: (f = (l = (e.vars || e).palette) == null || (l = l[t.color]) == null ? void 0 : l.main) != null ? f : {
      action: (p = (e.vars || e).palette) == null || (p = p.action) == null ? void 0 : p.active,
      disabled: (m = (e.vars || e).palette) == null || (m = m.action) == null ? void 0 : m.disabled,
      inherit: void 0
    }[t.color]
  };
}), Ht = /* @__PURE__ */ ee.forwardRef(function(t, r) {
  const n = li({
    props: t,
    name: "MuiSvgIcon"
  }), {
    children: o,
    className: i,
    color: s = "inherit",
    component: c = "svg",
    fontSize: u = "medium",
    htmlColor: d,
    inheritViewBox: h = !1,
    titleAccess: f,
    viewBox: l = "0 0 24 24"
  } = n, p = Ze(n, cl), m = /* @__PURE__ */ ee.isValidElement(o) && o.type === "svg", a = K({}, n, {
    color: s,
    component: c,
    fontSize: u,
    instanceFontSize: t.fontSize,
    inheritViewBox: h,
    viewBox: l,
    hasSvgAsChild: m
  }), y = {};
  h || (y.viewBox = l);
  const x = ll(a);
  return /* @__PURE__ */ z(ul, K({
    as: c,
    className: si(x.root, i),
    focusable: "false",
    color: d,
    "aria-hidden": f ? void 0 : !0,
    role: f ? "img" : void 0,
    ref: r
  }, y, p, m && o.props, {
    ownerState: a,
    children: [m ? o.props.children : o, f ? /* @__PURE__ */ b("title", {
      children: f
    }) : null]
  }));
});
process.env.NODE_ENV !== "production" && (Ht.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Node passed into the SVG element.
   */
  children: N.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: N.object,
  /**
   * @ignore
   */
  className: N.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   * @default 'inherit'
   */
  color: N.oneOfType([N.oneOf(["inherit", "action", "disabled", "primary", "secondary", "error", "info", "success", "warning"]), N.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: N.elementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   * @default 'medium'
   */
  fontSize: N.oneOfType([N.oneOf(["inherit", "large", "medium", "small"]), N.string]),
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor: N.string,
  /**
   * If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
   * prop will be ignored.
   * Useful when you want to reference a custom `component` and have `SvgIcon` pass that
   * `component`'s viewBox to the root node.
   * @default false
   */
  inheritViewBox: N.bool,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this prop.
   */
  shapeRendering: N.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: N.oneOfType([N.arrayOf(N.oneOfType([N.func, N.object, N.bool])), N.func, N.object]),
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: N.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   * @default '0 0 24 24'
   */
  viewBox: N.string
});
Ht.muiName = "SvgIcon";
function dl(e, t) {
  function r(n, o) {
    return /* @__PURE__ */ b(Ht, K({
      "data-testid": `${t}Icon`,
      ref: o
    }, n, {
      children: e
    }));
  }
  return process.env.NODE_ENV !== "production" && (r.displayName = `${t}Icon`), r.muiName = Ht.muiName, /* @__PURE__ */ ee.memo(/* @__PURE__ */ ee.forwardRef(r));
}
const fl = {
  configure: (e) => {
    process.env.NODE_ENV !== "production" && console.warn(["MUI: `ClassNameGenerator` import from `@mui/material/utils` is outdated and might cause unexpected issues.", "", "You should use `import { unstable_ClassNameGenerator } from '@mui/material/className'` instead", "", "The detail of the issue: https://github.com/mui/material-ui/issues/30011#issuecomment-1024993401", "", "The updated documentation: https://mui.com/guides/classname-generator/"].join(`
`)), eo.configure(e);
  }
}, pl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  capitalize: Je,
  createChainedFunction: Is,
  createSvgIcon: dl,
  debounce: As,
  deprecatedPropType: ks,
  isMuiElement: Ns,
  ownerDocument: Jn,
  ownerWindow: zs,
  requirePropFactory: Ls,
  setRef: Zn,
  unstable_ClassNameGenerator: fl,
  unstable_useEnhancedEffect: Qn,
  unstable_useId: Ws,
  unsupportedProp: Fs,
  useControlled: Bs,
  useEventCallback: Us,
  useForkRef: Vs,
  useIsFocusVisible: Zs
}, Symbol.toStringTag, { value: "Module" })), hl = /* @__PURE__ */ Ue(pl);
var zn;
function Co() {
  return zn || (zn = 1, function(e) {
    "use client";
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "default", {
      enumerable: !0,
      get: function() {
        return t.createSvgIcon;
      }
    });
    var t = hl;
  }(pr)), pr;
}
var ml = Gt;
Object.defineProperty(Ar, "__esModule", {
  value: !0
});
var $o = Ar.default = void 0, yl = ml(Co()), Ln = Wn;
$o = Ar.default = (0, yl.default)([/* @__PURE__ */ (0, Ln.jsx)("path", {
  d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"
}, "0"), /* @__PURE__ */ (0, Ln.jsx)("path", {
  d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2z"
}, "1")], "ZoomIn");
var qr = {}, gl = Gt;
Object.defineProperty(qr, "__esModule", {
  value: !0
});
var Oo = qr.default = void 0, bl = gl(Co()), vl = Wn;
Oo = qr.default = (0, bl.default)(/* @__PURE__ */ (0, vl.jsx)("path", {
  d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14M7 9h5v1H7z"
}), "ZoomOut");
const xl = () => ({
  scale: "day",
  zoomLevel: 1,
  visibleStart: /* @__PURE__ */ new Date(),
  visibleEnd: /* @__PURE__ */ new Date(),
  sidebarWidth: 280,
  rowHeight: 40,
  taskBarHeight: 20,
  selectedTaskIds: [],
  selectedDependencyIds: [],
  views: [],
  showCriticalPath: !1,
  showBaselines: !1,
  showNonWorkingShading: !0
}), Sl = (e) => {
  let t = {
    tasks: [],
    dependencies: [],
    baselines: [],
    resources: [],
    calendars: [],
    viewState: {
      ...xl()
    },
    ...e
  };
  const r = /* @__PURE__ */ new Set();
  return { getState: () => t, setState: (s) => {
    const c = typeof s == "function" ? s(t) : s, u = {
      ...t,
      ...c,
      viewState: {
        ...t.viewState,
        ...c.viewState ?? {}
      }
    };
    u !== t && (t = u, r.forEach((d) => d(t)));
  }, subscribe: (s) => (r.add(s), () => {
    r.delete(s);
  }) };
}, Ro = Sl();
function pt(e) {
  const t = Ro;
  return zo(
    t.subscribe,
    () => e(t.getState()),
    () => e(t.getState())
  );
}
function Hr() {
  const e = Ro;
  return {
    setState: e.setState,
    getState: e.getState
  };
}
const Xe = (e) => {
  const t = typeof e == "string" ? new Date(e) : e;
  return wt(t);
}, wl = (e, t) => {
  if (e.length === 0) {
    const s = wt(/* @__PURE__ */ new Date());
    return { start: s, end: me(s, 30) };
  }
  const r = e.map((s) => Xe(s.start)), n = e.map((s) => Xe(s.end));
  let o = r.reduce((s, c) => jo([s, c])), i = n.reduce((s, c) => Wo([s, c]));
  return t === "day" ? (o = me(o, -3), i = me(i, 3)) : t === "week" ? (o = me(o, -14), i = me(i, 14)) : t === "month" ? (o = me(o, -30), i = me(i, 30)) : t === "quarter" && (o = me(o, -90), i = me(i, 90)), { start: wt(o), end: xt(i) };
}, El = (e, t, r) => {
  const n = [];
  let o = wt(e);
  const i = wt(t);
  for (; o <= i; )
    if (r === "day") {
      const s = o, c = xt(o);
      n.push({ start: s, end: c }), o = me(o, 1);
    } else if (r === "week") {
      const s = o, c = xt(me(o, 6));
      n.push({ start: s, end: c }), o = me(o, 7);
    } else if (r === "month") {
      const s = new Date(o.getFullYear(), o.getMonth(), 1), c = new Date(o.getFullYear(), o.getMonth() + 1, 1), u = xt(me(c, -1));
      n.push({ start: s, end: u }), o = c;
    } else {
      const s = Math.floor(o.getMonth() / 3), c = new Date(o.getFullYear(), s * 3, 1), u = new Date(o.getFullYear(), (s + 1) * 3, 1), d = xt(me(u, -1));
      n.push({ start: c, end: d }), o = u;
    }
  return n;
}, Gr = () => {
  const { setState: e } = Hr(), t = pt((m) => m.tasks), r = pt((m) => m.viewState), { scale: n, zoomLevel: o, visibleStart: i, visibleEnd: s } = r, c = Fe(() => wl(t, n), [t, n]), u = i || c.start, d = s || c.end, h = Fe(
    () => El(u, d, n),
    [u, d, n]
  ), f = ur(
    (m) => {
      e((a) => ({
        viewState: {
          ...a.viewState,
          scale: m,
          visibleStart: c.start,
          visibleEnd: c.end
        }
      }));
    },
    [e, c.start, c.end]
  ), l = ur(
    (m) => {
      e((a) => {
        const y = a.viewState.zoomLevel, x = typeof m == "function" ? m(y) : m, E = Math.min(Math.max(x, 0.25), 4);
        return {
          viewState: {
            ...a.viewState,
            zoomLevel: E
          }
        };
      });
    },
    [e]
  ), p = ur(
    (m, a) => {
      e((y) => ({
        viewState: {
          ...y.viewState,
          visibleStart: m,
          visibleEnd: a
        }
      }));
    },
    [e]
  );
  return {
    scale: n,
    zoomLevel: o,
    visibleStart: u,
    visibleEnd: d,
    timelineUnits: h,
    setScale: f,
    setZoomLevel: l,
    setVisibleRange: p
  };
}, Tl = () => {
  const {
    scale: e,
    zoomLevel: t,
    visibleStart: r,
    visibleEnd: n,
    timelineUnits: o,
    setScale: i,
    setZoomLevel: s
  } = Gr(), c = (f, l) => {
    l && i(l);
  }, u = () => s((f) => f * 1.25), d = () => s((f) => f / 1.25), h = `${nt(r, "MMM dd, yyyy")} – ${nt(n, "MMM dd, yyyy")}`;
  return /* @__PURE__ */ z(
    we,
    {
      sx: {
        borderBottom: 1,
        borderColor: "divider",
        px: 2,
        py: 1,
        bgcolor: "background.paper"
      },
      children: [
        /* @__PURE__ */ z(fr, { direction: "row", justifyContent: "space-between", alignItems: "center", spacing: 2, children: [
          /* @__PURE__ */ z(fr, { direction: "row", spacing: 2, alignItems: "center", children: [
            /* @__PURE__ */ b(rt, { variant: "subtitle2", color: "text.secondary", children: "Timeline" }),
            /* @__PURE__ */ z(
              Fo,
              {
                color: "primary",
                size: "small",
                exclusive: !0,
                value: e,
                onChange: c,
                children: [
                  /* @__PURE__ */ b(It, { value: "day", children: "Day" }),
                  /* @__PURE__ */ b(It, { value: "week", children: "Week" }),
                  /* @__PURE__ */ b(It, { value: "month", children: "Month" }),
                  /* @__PURE__ */ b(It, { value: "quarter", children: "Quarter" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ z(fr, { direction: "row", spacing: 1, alignItems: "center", children: [
            /* @__PURE__ */ b(Jr, { size: "small", onClick: d, children: /* @__PURE__ */ b(Oo, { fontSize: "small" }) }),
            /* @__PURE__ */ z(rt, { variant: "caption", color: "text.secondary", children: [
              Math.round(t * 100),
              "%"
            ] }),
            /* @__PURE__ */ b(Jr, { size: "small", onClick: u, children: /* @__PURE__ */ b($o, { fontSize: "small" }) })
          ] }),
          /* @__PURE__ */ b(rt, { variant: "caption", color: "text.secondary", children: h })
        ] }),
        /* @__PURE__ */ b(
          we,
          {
            sx: {
              mt: 1,
              display: "flex",
              overflow: "hidden"
            },
            children: o.map((f, l) => /* @__PURE__ */ b(
              we,
              {
                sx: {
                  flex: 1,
                  minWidth: 80,
                  borderRight: 1,
                  borderColor: "divider",
                  px: 1,
                  py: 0.5
                },
                children: /* @__PURE__ */ b(rt, { variant: "caption", color: "text.secondary", children: nt(f.start, e === "day" ? "MMM dd" : e === "week" ? "wo" : e === "month" ? "MMM yyyy" : "'Q'Q yyyy") })
              },
              l
            ))
          }
        )
      ]
    }
  );
}, jn = 32, _l = 8, Cl = (e) => [...e].sort((t, r) => {
  const n = t.start ? Xe(t.start).getTime() : 0, o = r.start ? Xe(r.start).getTime() : 0;
  return n !== o ? n - o : t.name.localeCompare(r.name);
}), $l = (e, t) => t.findIndex((r) => r.id === e.id), Ol = () => {
  const e = pt((p) => p.tasks), t = pt((p) => p.viewState.selectedTaskIds), { setState: r } = Hr(), { visibleStart: n, visibleEnd: o, scale: i } = Gr(), { orderedTasks: s, totalDays: c } = Fe(() => {
    const p = Cl(e), m = dr(o, n) || 1;
    return { orderedTasks: p, totalDays: m };
  }, [e, n, o]), u = Fe(() => {
    switch (i) {
      case "day":
        return 32;
      case "week":
        return 12;
      case "month":
        return 4;
      case "quarter":
        return 2;
      default:
        return 24;
    }
  }, [i]), d = c * u, h = Ae(null), f = (p) => {
    if (d === 0) return 0;
    const m = p / d;
    return Math.round(m * c);
  }, l = () => {
    const p = h.current;
    !p || !p.taskId || (h.current = null);
  };
  return He.useEffect(() => {
    const p = (a) => {
      const y = h.current;
      if (!y || !y.taskId || !y.mode) return;
      const x = a.clientX - y.startX, E = f(x);
      E && r((S) => {
        const O = S.tasks.map((g) => {
          if (g.id !== y.taskId || !g.start || !g.end) return g;
          const R = Xe(g.start), _ = Xe(g.end);
          if (y.mode === "move") {
            const I = new Date(y.originalStart);
            I.setDate(I.getDate() + E);
            const re = new Date(y.originalEnd);
            return re.setDate(re.getDate() + E), { ...g, start: I, end: re };
          }
          if (y.mode === "resize-start") {
            const I = new Date(y.originalStart);
            return I.setDate(I.getDate() + E), I >= _ ? g : { ...g, start: I };
          }
          if (y.mode === "resize-end") {
            const I = new Date(y.originalEnd);
            return I.setDate(I.getDate() + E), I <= R ? g : { ...g, end: I };
          }
          return g;
        });
        return { ...S, tasks: O };
      });
    }, m = () => {
      h.current && (l(), window.removeEventListener("mousemove", p), window.removeEventListener("mouseup", m));
    };
    return h.current && (window.addEventListener("mousemove", p), window.addEventListener("mouseup", m)), () => {
      window.removeEventListener("mousemove", p), window.removeEventListener("mouseup", m);
    };
  }, [r, c, d]), /* @__PURE__ */ b(
    we,
    {
      sx: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none"
      },
      children: s.map((p) => {
        if (!p.start || !p.end) return null;
        const m = Xe(p.start), a = Xe(p.end), y = m < n ? n : m, x = a > o ? o : a, E = dr(y, n), S = Math.max(1, dr(x, y)), O = E / c * d, g = S / c * d, _ = $l(p, s) * (jn + _l), I = p.status, re = I === "Done" ? "#10b981" : I === "InProgress" ? "#3b82f6" : "#6b7280", ce = t.includes(p.id), de = (C) => {
          C.button === 0 && (C.stopPropagation(), h.current = {
            mode: "move",
            taskId: p.id,
            startX: C.clientX,
            originalStart: m,
            originalEnd: a
          });
        }, Z = (C, U) => {
          C.button === 0 && (C.stopPropagation(), h.current = {
            mode: U,
            taskId: p.id,
            startX: C.clientX,
            originalStart: m,
            originalEnd: a
          });
        };
        return /* @__PURE__ */ b(Bo, { title: p.name, placement: "top", children: /* @__PURE__ */ z(
          we,
          {
            sx: {
              position: "absolute",
              left: O,
              top: _,
              width: g,
              height: jn,
              borderRadius: 1,
              bgcolor: re,
              border: ce ? "2px solid #0ea5e9" : "1px solid rgba(15,23,42,0.25)",
              color: "#fff",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              px: 1,
              boxShadow: 1,
              pointerEvents: "auto",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              cursor: "pointer"
            },
            onClick: (C) => {
              C.stopPropagation(), r((U) => ({
                ...U,
                viewState: {
                  ...U.viewState,
                  selectedTaskIds: [p.id]
                }
              }));
            },
            onMouseDown: de,
            children: [
              /* @__PURE__ */ b(
                we,
                {
                  sx: {
                    width: 6,
                    height: "70%",
                    borderRadius: 1,
                    bgcolor: "rgba(15,23,42,0.4)",
                    mr: 0.5,
                    cursor: "ew-resize",
                    flexShrink: 0
                  },
                  onMouseDown: (C) => Z(C, "resize-start")
                }
              ),
              p.name,
              /* @__PURE__ */ b(
                we,
                {
                  sx: {
                    width: 6,
                    height: "70%",
                    borderRadius: 1,
                    bgcolor: "rgba(15,23,42,0.4)",
                    ml: 0.5,
                    cursor: "ew-resize",
                    flexShrink: 0
                  },
                  onMouseDown: (C) => Z(C, "resize-end")
                }
              )
            ]
          }
        ) }, p.id);
      })
    }
  );
}, Rl = 80, Dl = () => {
  const { timelineUnits: e } = Gr();
  return /* @__PURE__ */ z(
    we,
    {
      sx: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flex: 1,
        borderTop: "1px solid rgba(0,0,0,0.12)",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        overflow: "hidden"
      },
      children: [
        e.map((t, r) => /* @__PURE__ */ b(
          we,
          {
            sx: {
              flex: 1,
              minWidth: Rl,
              borderLeft: r === 0 ? "none" : "1px solid rgba(0,0,0,0.08)",
              borderRight: "1px solid rgba(0,0,0,0.08)",
              backgroundColor: r % 2 === 0 ? "background.default" : "background.paper",
              "&:last-of-type": {
                borderRight: "none"
              }
            }
          },
          r
        )),
        /* @__PURE__ */ b(Ol, {})
      ]
    }
  );
}, Pl = (e) => {
  const t = /* @__PURE__ */ new Map(), r = [];
  return e.forEach((n) => {
    t.set(n.id, { ...n, children: [] });
  }), t.forEach((n) => {
    n.parentId && t.has(n.parentId) ? t.get(n.parentId).children.push(n) : r.push(n);
  }), r;
}, Do = (e, t, r, n = 0) => e.map((o) => {
  const i = t.includes(o.id);
  return /* @__PURE__ */ z(He.Fragment, { children: [
    /* @__PURE__ */ b(
      Bn,
      {
        sx: {
          pl: 2 + n * 2,
          bgcolor: i ? "action.selected" : "transparent",
          cursor: "pointer"
        },
        "data-task-id": o.id,
        onClick: () => r(o.id),
        children: /* @__PURE__ */ b(
          Un,
          {
            primary: /* @__PURE__ */ b(we, { display: "flex", alignItems: "center", gap: 1, children: /* @__PURE__ */ b(rt, { variant: "body2", fontWeight: o.parentId ? 400 : 600, children: o.name }) }),
            secondary: o.start && o.end ? `${new Date(o.start).toLocaleDateString()} - ${new Date(o.end).toLocaleDateString()}` : void 0
          }
        )
      }
    ),
    o.children && o.children.length > 0 && Do(o.children, t, r, n + 1)
  ] }, o.id);
}), Ml = ({ width: e = 260 }) => {
  const t = pt((s) => s.tasks), r = pt((s) => s.viewState.selectedTaskIds), { setState: n } = Hr(), o = Fe(() => Pl(t), [t]), i = (s) => {
    n((c) => ({
      ...c,
      viewState: {
        ...c.viewState,
        selectedTaskIds: [s]
      }
    }));
  };
  return /* @__PURE__ */ z(
    we,
    {
      sx: {
        width: e,
        borderRight: "1px solid rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        bgcolor: "background.paper"
      },
      children: [
        /* @__PURE__ */ b(we, { px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)", children: /* @__PURE__ */ b(rt, { variant: "subtitle2", color: "text.secondary", children: "Tasks" }) }),
        /* @__PURE__ */ b(Uo, { dense: !0, disablePadding: !0, children: o.length === 0 ? /* @__PURE__ */ b(Bn, { children: /* @__PURE__ */ b(Un, { primary: /* @__PURE__ */ b(rt, { variant: "body2", color: "text.secondary", children: "No tasks" }) }) }) : Do(o, r, i) })
      ]
    }
  );
}, Ul = ({ height: e = 480 }) => /* @__PURE__ */ z(
  Vo,
  {
    elevation: 1,
    sx: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: e,
      overflow: "hidden"
    },
    children: [
      /* @__PURE__ */ b(Tl, {}),
      /* @__PURE__ */ z(
        we,
        {
          sx: {
            display: "flex",
            flex: 1,
            position: "relative",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ b(Ml, {}),
            /* @__PURE__ */ b(
              we,
              {
                sx: {
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto"
                },
                children: /* @__PURE__ */ b(Dl, {})
              }
            )
          ]
        }
      )
    ]
  }
);
export {
  Vn as COLOR_PALETTES,
  hs as DependencyLines,
  Bl as GanttChart,
  Ul as GanttContainer,
  ps as TaskModal,
  os as addSubtask,
  ss as calculateCriticalPath,
  rs as findTaskById,
  Qo as flattenTasks,
  Zo as generateTimeline,
  is as getIndentation,
  Fl as getPaletteColor,
  ts as getParentTaskOptions,
  ds as getProgressColor,
  es as toggleTaskExpansion,
  Wl as transformFromGanttTask,
  jl as transformToGanttTasks,
  ns as updateTaskInHierarchy
};
