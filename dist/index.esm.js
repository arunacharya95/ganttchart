import Kn, { jsxs as A, jsx as b, Fragment as Zr } from "react/jsx-runtime";
import * as le from "react";
import qe, { useState as Pe, useRef as Le, useEffect as qo, useMemo as je, useSyncExternalStore as Ho, useCallback as yr } from "react";
import { differenceInDays as Xn, addDays as xe, isWeekend as Go, format as st, getWeek as Qr, startOfDay as Ct, min as Ko, max as Xo, endOfDay as wt, differenceInCalendarDays as Ye } from "date-fns";
import { Box as be, Stack as Et, Typography as Ce, ToggleButtonGroup as Jo, ToggleButton as zt, FormControl as en, InputLabel as tn, Select as rn, MenuItem as vt, IconButton as gr, TextField as Zo, FormControlLabel as nn, Switch as on, Tooltip as Jn, List as Qo, ListItem as Zn, ListItemText as Qn, Paper as es } from "@mui/material";
import ts from "@emotion/styled";
import { CacheProvider as rs, Global as ns, ThemeContext as os, css as ss, keyframes as is } from "@emotion/react";
const Je = (e) => typeof e == "string" ? new Date(e) : e;
function Ir(e, t, r, n) {
  if (n !== void 0 && r instanceof Date) {
    const c = e, d = r, p = new Date(c.startDate || c.start), h = new Date(c.endDate || c.end), u = (E) => {
      const C = new Date(E);
      return C.setHours(0, 0, 0, 0), C;
    }, l = u(t), m = u(p), y = u(h), a = 24 * 60 * 60 * 1e3, g = Math.round((m.getTime() - l.getTime()) / a), w = Math.round((y.getTime() - m.getTime()) / a) + 1, v = Math.round((d.getTime() - l.getTime()) / a) + 1, T = n / v, S = g * T, f = w * T;
    return { left: S, width: Math.max(f, T) };
  }
  const o = e, i = r;
  return Xn(o, t) * i;
}
const as = (e) => {
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
}, cs = (e, t, r) => {
  const n = [], o = new Date(e);
  for (o.setHours(0, 0, 0, 0); o <= t; ) {
    const i = new Date(o);
    let s, c;
    if (r === "day")
      c = o.toLocaleDateString("en-US", { month: "short", day: "numeric" }), s = new Date(o), s.setDate(s.getDate() + 1);
    else if (r === "week") {
      const d = new Date(o);
      d.setDate(d.getDate() + 7), c = `Week ${Math.ceil((o.getTime() - new Date(o.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1e3))}`, s = d;
    } else r === "quarter" ? (c = `Q${Math.floor(o.getMonth() / 3) + 1} ${o.getFullYear()}`, s = new Date(o.getFullYear(), o.getMonth() + 3, 1)) : (c = o.toLocaleDateString("en-US", { month: "short", year: "numeric" }), s = new Date(o.getFullYear(), o.getMonth() + 1, 1));
    n.push({ label: c, startDate: i, endDate: s }), r === "day" ? o.setDate(o.getDate() + 1) : r === "week" ? o.setDate(o.getDate() + 7) : r === "quarter" ? o.setMonth(o.getMonth() + 3) : o.setMonth(o.getMonth() + 1);
  }
  return n;
}, Jl = (e) => e.map((t) => {
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
}), Zl = (e, t) => {
  const r = {};
  return t.name !== void 0 && (r.title = t.name), t.start !== void 0 && (r.startDate = t.start), t.end !== void 0 && (r.endDate = t.end), t.progress !== void 0 && (r.progress = `${t.progress}%`), t.assignedTo !== void 0 && (r.assignees = [t.assignedTo]), r;
}, ls = (e, t = /* @__PURE__ */ new Set()) => {
  const r = [], n = (o, i = 0, s = !0) => {
    const c = !!o.subtasks && o.subtasks.length > 0, d = o.isExpanded ?? t.has(o.id), p = i === 0 || s;
    r.push({
      ...o,
      level: i,
      hasChildren: c,
      isVisible: p,
      isExpanded: d
    }), c && d && p && o.subtasks.forEach((h) => {
      n(h, i + 1, !0);
    });
  };
  return e.forEach((o) => n(o)), r.filter((o) => o.isVisible);
}, us = (e, t) => {
  const r = new Set(t);
  return r.has(e) ? r.delete(e) : r.add(e), r;
}, ds = (e, t) => {
  const r = [], n = (o) => {
    o.forEach((i) => {
      i.id !== t && (r.push(i), i.subtasks && i.subtasks.length > 0 && n(i.subtasks));
    });
  };
  return n(e), r;
}, fs = (e, t) => {
  for (const r of e) {
    if (r.id === t)
      return r;
    if (r.subtasks && r.subtasks.length > 0) {
      const n = fs(r.subtasks, t);
      if (n) return n;
    }
  }
  return null;
}, ps = (e, t, r) => e.map((n) => n.id === t ? { ...n, ...r } : n.subtasks && n.subtasks.length > 0 ? {
  ...n,
  subtasks: ps(n.subtasks, t, r)
} : n), hs = (e, t, r) => e.map((n) => {
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
    subtasks: hs(n.subtasks, t, r)
  } : n;
}), ms = (e) => {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  e.forEach((l) => {
    t.set(l.id, l), r.set(l.id, 0), n.set(l.id, []);
  }), e.forEach((l) => {
    l.dependencies && l.dependencies.length > 0 && l.dependencies.forEach((m) => {
      const y = n.get(m) || [];
      y.push(l.id), n.set(m, y), r.set(l.id, (r.get(l.id) || 0) + 1);
    });
  });
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = [];
  for (e.forEach((l) => {
    if (r.get(l.id) === 0) {
      s.push(l.id);
      const m = Je(l.start || l.startDate).getTime();
      o.set(l.id, m), i.set(l.id, Je(l.end || l.endDate).getTime());
    }
  }); s.length > 0; ) {
    const l = s.shift();
    (n.get(l) || []).forEach((y) => {
      const a = i.get(l), g = t.get(y), w = Je(g.end || g.endDate).getTime() - Je(g.start || g.startDate).getTime(), v = Math.max(
        o.get(y) || 0,
        a
      );
      o.set(y, v), i.set(y, v + w), r.set(y, (r.get(y) || 0) - 1), r.get(y) === 0 && s.push(y);
    });
  }
  let c = 0;
  e.forEach((l) => {
    const m = i.get(l.id) || 0;
    m > c && (c = m);
  });
  const d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  e.forEach((l) => {
    if ((n.get(l.id) || []).length === 0) {
      p.set(l.id, c);
      const m = Je(l.end || l.endDate).getTime() - Je(l.start || l.startDate).getTime();
      d.set(l.id, c - m);
    }
  });
  const h = e.filter((l) => (n.get(l.id) || []).length === 0).map((l) => l.id), u = /* @__PURE__ */ new Set();
  for (; h.length > 0; ) {
    const l = h.shift();
    if (u.has(l)) continue;
    u.add(l);
    const m = t.get(l), y = d.get(l);
    m.dependencies && m.dependencies.forEach((a) => {
      const g = t.get(a), w = Je(g.end || g.endDate).getTime() - Je(g.start || g.startDate).getTime(), v = Math.min(
        p.get(a) || Number.MAX_SAFE_INTEGER,
        y
      );
      p.set(a, v), d.set(a, v - w), h.push(a);
    });
  }
  return e.map((l) => {
    const m = o.get(l.id) || 0, a = (d.get(l.id) || 0) - m;
    return {
      ...l,
      isCritical: Math.abs(a) < 1e3
      // Within 1 second (accounting for rounding)
    };
  });
}, ys = (e, t = 20) => e * t, gs = (e, t) => {
  if (!t || t.length === 0) return !1;
  const r = st(e, "yyyy-MM-dd");
  return t.includes(r);
}, sn = (e, t, r = !0) => {
  let n = new Date(e), o = 0;
  for (; o < 365; ) {
    const i = !r && Go(n), s = gs(n, t);
    if (!i && !s)
      return n;
    n = xe(n, 1), o++;
  }
  return n;
}, bs = (e, t, r, n, o = !0) => {
  const i = (l) => l.map((m) => ({
    ...m,
    subtasks: m.subtasks ? i(m.subtasks) : void 0
  })), s = i(e), c = /* @__PURE__ */ new Map(), d = (l) => {
    l.forEach((m) => {
      c.set(m.id, m), m.subtasks && d(m.subtasks);
    });
  };
  d(s);
  const p = /* @__PURE__ */ new Map();
  t.forEach((l) => {
    const m = p.get(l.from) || [];
    m.push(l), p.set(l.from, m);
  });
  const h = [r], u = /* @__PURE__ */ new Set();
  for (; h.length > 0; ) {
    const l = h.shift();
    if (u.has(l)) continue;
    u.add(l);
    const m = c.get(l);
    if (!m) continue;
    (p.get(l) || []).forEach((a) => {
      const g = c.get(a.to);
      if (!g || g.isLocked) return;
      let w = new Date(g.start || g.startDate);
      const v = new Date(m.start || m.startDate), T = new Date(m.end || m.endDate);
      let S = !1;
      if (a.type === "FS" ? w < T && (w = sn(xe(T, 1), n, o), S = !0) : a.type === "SS" ? w < v && (w = sn(v, n, o), S = !0) : a.type, S) {
        const f = Xn(
          new Date(g.end || g.endDate),
          new Date(g.start || g.startDate)
        ), E = xe(w, f);
        g.start = w.toISOString(), g.end = E.toISOString(), "startDate" in g && (g.startDate = g.start), "endDate" in g && (g.endDate = g.end), h.push(g.id);
      }
    });
  }
  return s;
}, vs = ({ units: e, chartWidth: t, unitWidth: r }) => {
  const n = {};
  let o = "", i = 0;
  return e.forEach((s, c) => {
    const d = st(s.startDate, "MMMM yyyy");
    d !== o && (o = d, i = c, n[o] = { units: [], start: i }), n[o].units.push(s);
  }), /* @__PURE__ */ A("div", { style: { backgroundColor: "#fff" }, children: [
    /* @__PURE__ */ b("div", { style: {
      display: "flex",
      borderBottom: "1px solid #d1d5db",
      backgroundColor: "#f9fafb",
      height: "32px"
    }, children: Object.entries(n).map(([s, c], d) => /* @__PURE__ */ b(
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
      d
    )) }),
    /* @__PURE__ */ b("div", { style: {
      display: "flex",
      borderBottom: "1px solid #d1d5db",
      backgroundColor: "#fafafa",
      height: "24px"
    }, children: e.map((s, c) => {
      const d = Qr(s.startDate), p = c === 0 || Qr(e[c - 1].startDate) !== d;
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
          children: p ? `Week ${d}` : ""
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
      const d = s.startDate, p = st(d, "EEEEEE"), h = st(d, "d"), u = (/* @__PURE__ */ new Date()).toDateString() === d.toDateString(), l = d.getDay() === 0 || d.getDay() === 6;
      return /* @__PURE__ */ A(
        "div",
        {
          style: {
            width: `${r}px`,
            minWidth: `${r}px`,
            padding: "4px 2px",
            textAlign: "center",
            fontSize: "11px",
            fontWeight: u ? 700 : 500,
            color: u ? "#fff" : l ? "#9ca3af" : "#374151",
            backgroundColor: u ? "#3b82f6" : "transparent",
            borderRight: "1px solid #e5e7eb",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1px"
          },
          children: [
            /* @__PURE__ */ b("span", { style: { fontSize: "9px", opacity: 0.8 }, children: p }),
            /* @__PURE__ */ b("span", { children: h })
          ]
        },
        c
      );
    }) })
  ] });
}, xs = ({
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
        children: i.map((d, p) => {
          const h = p === 0, u = d.width || 100;
          return /* @__PURE__ */ b(
            "div",
            {
              style: {
                width: `${u}px`,
                minWidth: `${u}px`,
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                borderRight: "1px solid #f3f4f6",
                boxSizing: "border-box",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              },
              children: h ? /* @__PURE__ */ A("div", { style: {
                display: "flex",
                alignItems: "center",
                flex: 1,
                paddingLeft: `${ys(s.level)}px`,
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
                }, children: d.render ? d.render(s) : s[d.id] })
              ] }) : (
                // Regular column
                /* @__PURE__ */ b("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: d.render ? d.render(s) : s[d.id] })
              )
            },
            `${s.id}-${d.id}`
          );
        })
      },
      s.id
    );
  }) });
}, eo = {
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
function Ql(e, t) {
  const r = eo[e];
  return r.colors[t % r.colors.length];
}
function Ss(e, t) {
  const r = eo[e];
  return t === 100 ? r.completed : t > 0 ? r.inProgress : r.notStarted;
}
const ws = ({
  task: e,
  timelineStart: t,
  timelineEnd: r,
  chartWidth: n,
  rowHeight: o,
  index: i,
  onTaskUpdate: s,
  onClick: c,
  onDoubleClick: d,
  getTaskColor: p,
  config: h
}) => {
  const { left: u, width: l } = Ir(e, t, r, n), m = e.progress || 0, a = (() => {
    if (e.color)
      return e.color;
    if (p)
      return p(e);
    if (h) {
      if (h.statusColors && e.status && h.statusColors[e.status])
        return h.statusColors[e.status];
      if (h.assigneeColors && e.assignedTo && h.assigneeColors[e.assignedTo])
        return h.assigneeColors[e.assignedTo];
      if (h.colorPalette) {
        const L = h.colorPalette;
        if (L.colors && L.colors.length > 0)
          return L.colors[i % L.colors.length];
        if (m === 100 && L.completed) return L.completed;
        if (m > 0 && L.inProgress) return L.inProgress;
        if (m === 0 && L.notStarted) return L.notStarted;
        if (L.preset)
          return Ss(L.preset, m);
      }
    }
    return m === 100 ? "#10b981" : m > 0 ? "#f97316" : "#94a3b8";
  })(), g = e.isMilestone || !1, w = (h == null ? void 0 : h.showBaseline) && e.baseline, v = (h == null ? void 0 : h.showCriticalPath) && e.isCritical, [T, S] = Pe(!1), [f, E] = Pe(!1), [C, O] = Pe(!1), [X, H] = Pe({ left: u, width: l }), [ue, K] = Pe(!1), I = Le({ left: u, width: l, mouseX: 0 }), V = Le({ left: u, width: l }), ie = Le(null), F = Le({ left: u, width: l }), J = Le(null), U = Le({ isDragging: T, isResizingLeft: f, isResizingRight: C });
  U.current = { isDragging: T, isResizingLeft: f, isResizingRight: C };
  const N = Le({ task: e, timelineStart: t, timelineEnd: r, chartWidth: n, onTaskUpdate: s });
  N.current = { task: e, timelineStart: t, timelineEnd: r, chartWidth: n, onTaskUpdate: s }, qe.useEffect(() => {
    const L = document.querySelector("[data-gantt-chart-scroll]");
    L && (ie.current = L);
  }, []);
  const x = qe.useCallback((L) => {
    const { isDragging: Ee, isResizingLeft: We, isResizingRight: Ne } = U.current, { chartWidth: Ke } = N.current;
    !Ee && !We && !Ne || (J.current && cancelAnimationFrame(J.current), J.current = requestAnimationFrame(() => {
      var z;
      const ze = ((z = ie.current) == null ? void 0 : z.scrollLeft) || 0, M = L.clientX + ze - I.current.mouseX;
      if (Math.abs(M) > 3 && K(!0), Ee) {
        const ae = Math.max(0, Math.min(I.current.left + M, Ke - I.current.width));
        H({ left: ae, width: I.current.width }), V.current = { left: ae, width: I.current.width };
      } else if (We) {
        const ae = Math.max(0, Math.min(I.current.left + M, I.current.left + I.current.width - 20)), Te = I.current.width - (ae - I.current.left);
        H({ left: ae, width: Te }), V.current = { left: ae, width: Te };
      } else if (Ne) {
        const ae = Math.max(20, I.current.width + M);
        H({ left: I.current.left, width: ae }), V.current = { left: I.current.left, width: ae };
      }
    }));
  }, []), _ = qe.useCallback(function L(Ee) {
    const { isDragging: We, isResizingLeft: Ne, isResizingRight: Ke } = U.current, { onTaskUpdate: ze, task: Xe, timelineStart: M, timelineEnd: z, chartWidth: ae } = N.current;
    if (J.current && cancelAnimationFrame(J.current), document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", L), document.body.style.userSelect = "", document.body.style.cursor = "", (We || Ne || Ke) && (Math.abs(V.current.left - I.current.left) > 2 || Math.abs(V.current.width - I.current.width) > 2) && ze) {
      const he = Math.max(1, (z.getTime() - M.getTime()) / 864e5), $e = ae / he, ot = Math.round(V.current.left / $e), hr = Math.round(V.current.width / $e), it = new Date(M);
      it.setDate(it.getDate() + ot);
      const bt = new Date(it);
      bt.setDate(bt.getDate() + Math.max(1, hr) - 1);
      const Nt = (mr) => {
        const Vo = mr.getFullYear(), Uo = String(mr.getMonth() + 1).padStart(2, "0"), Yo = String(mr.getDate()).padStart(2, "0");
        return `${Vo}-${Uo}-${Yo}`;
      }, Fo = Nt(it), Bo = Nt(bt);
      ze(String(Xe.id), {
        start: Fo,
        end: Bo
      });
    }
    S(!1), E(!1), O(!1);
  }, [x]), D = (L) => {
    L.stopPropagation(), !ue && c && c(e);
  }, P = (L) => {
    L.stopPropagation(), d && d(e);
  }, R = (L, Ee) => {
    var Ke;
    if (L.stopPropagation(), L.preventDefault(), e.isLocked)
      return;
    const We = ((Ke = ie.current) == null ? void 0 : Ke.scrollLeft) || 0, Ne = L.clientX + We;
    K(!1), I.current = { left: u, width: l, mouseX: Ne }, V.current = { left: u, width: l }, document.addEventListener("mousemove", x), document.addEventListener("mouseup", _), document.body.style.userSelect = "none", document.body.style.cursor = Ee === "move" ? "grabbing" : "ew-resize", Ee === "move" ? S(!0) : Ee === "resize-left" ? E(!0) : Ee === "resize-right" && O(!0);
  };
  qe.useEffect(() => () => {
    document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", _), document.body.style.userSelect = "", document.body.style.cursor = "", J.current && cancelAnimationFrame(J.current);
  }, [x, _]), qe.useEffect(() => {
    !T && !f && !C && (F.current.left !== u || F.current.width !== l) && (H({ left: u, width: l }), V.current = { left: u, width: l }, F.current = { left: u, width: l });
  }, [u, l, T, f, C]);
  const k = T || f || C ? X.left : u, j = T || f || C ? X.width : l, B = "level" in e && e.level > 0, Y = "hasChildren" in e && e.hasChildren;
  let G = 0, q = 0;
  if (w && e.baseline) {
    const L = Ir(
      { ...e, start: e.baseline.start, end: e.baseline.end },
      t,
      r,
      n
    );
    G = L.left, q = L.width;
  }
  if (g) {
    const L = (h == null ? void 0 : h.milestoneColor) || "#f59e0b", Ee = o - 20, We = {
      position: "absolute",
      left: `${k}px`,
      top: `${i * o + 10}px`,
      width: `${Ee}px`,
      height: `${Ee}px`,
      backgroundColor: L,
      transform: "rotate(45deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      zIndex: 3
    }, Ne = {
      position: "absolute",
      left: `${k + Ee + 8}px`,
      top: `${i * o + 10}px`,
      height: `${Ee}px`,
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      fontWeight: 600,
      color: "#374151",
      whiteSpace: "nowrap"
    };
    return /* @__PURE__ */ A(Zr, { children: [
      /* @__PURE__ */ b(
        "div",
        {
          "data-task-bar": "true",
          style: We,
          title: `Milestone: ${e.name} - ${new Date(e.start || e.startDate).toLocaleDateString()}`,
          onClick: D,
          onDoubleClick: P
        }
      ),
      /* @__PURE__ */ b("div", { style: Ne, children: e.name })
    ] });
  }
  const ve = {
    position: "absolute",
    left: `${k}px`,
    top: `${i * o + 10}px`,
    width: `${j}px`,
    height: `${o - 20}px`,
    backgroundColor: v ? (h == null ? void 0 : h.criticalPathColor) || "#ef4444" : a,
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: Y ? 600 : 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    cursor: e.isLocked ? "not-allowed" : T ? "grabbing" : "grab",
    boxShadow: T || f || C ? "0 4px 12px rgba(0,0,0,0.15)" : v ? "0 2px 6px rgba(239, 68, 68, 0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
    transition: T || f || C ? "none" : "transform 0.1s, box-shadow 0.2s",
    userSelect: "none",
    opacity: B ? 0.95 : 1,
    border: Y ? "1px solid rgba(255,255,255,0.2)" : v ? "1px solid #dc2626" : "none"
  }, $ = {
    position: "absolute",
    left: `${G}px`,
    top: `${i * o + o - 15}px`,
    width: `${q}px`,
    height: "4px",
    backgroundColor: "#9ca3af",
    borderRadius: "2px",
    opacity: (h == null ? void 0 : h.baselineOpacity) || 0.5,
    pointerEvents: "none",
    zIndex: 2
  }, _e = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${m}%`,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    transition: "width 0.3s",
    pointerEvents: "none"
  }, Ue = (L) => ({
    position: "absolute",
    [L]: 0,
    top: 0,
    bottom: 0,
    width: "10px",
    cursor: "ew-resize",
    zIndex: 2,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }), nt = {
    width: "3px",
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "1px",
    opacity: 0,
    transition: "opacity 0.2s"
  };
  return /* @__PURE__ */ A(Zr, { children: [
    w && /* @__PURE__ */ b("div", { style: $ }),
    /* @__PURE__ */ b("style", { children: `
        .task-bar:hover .resize-handle .resize-indicator {
          opacity: 1;
        }
      ` }),
    /* @__PURE__ */ A(
      "div",
      {
        "data-task-bar": "true",
        className: "task-bar",
        style: ve,
        title: `${e.name} (${new Date(e.start || e.startDate).toLocaleDateString()} - ${new Date(e.end || e.endDate).toLocaleDateString()})${e.isLocked ? " [LOCKED]" : ""}
${e.isLocked ? "Schedule locked" : "Drag to move, drag edges to resize, double-click to edit"}${v ? `
⚠️ CRITICAL PATH` : ""}`,
        onClick: D,
        onMouseDown: (L) => R(L, "move"),
        onDoubleClick: P,
        onMouseEnter: (L) => !T && (L.currentTarget.style.transform = "translateY(-2px)"),
        onMouseLeave: (L) => !T && (L.currentTarget.style.transform = "translateY(0)"),
        children: [
          !e.isLocked && /* @__PURE__ */ b(
            "div",
            {
              className: "resize-handle",
              style: Ue("left"),
              onMouseDown: (L) => R(L, "resize-left"),
              title: "Drag to change start date",
              children: /* @__PURE__ */ b("div", { className: "resize-indicator", style: nt })
            }
          ),
          m > 0 && /* @__PURE__ */ b("div", { style: _e }),
          /* @__PURE__ */ b("span", { style: { position: "relative", zIndex: 1 }, children: e.name }),
          !e.isLocked && /* @__PURE__ */ b(
            "div",
            {
              className: "resize-handle",
              style: Ue("right"),
              onMouseDown: (L) => R(L, "resize-right"),
              title: "Drag to change end date",
              children: /* @__PURE__ */ b("div", { className: "resize-indicator", style: nt })
            }
          )
        ]
      }
    )
  ] });
}, Es = ({
  isOpen: e,
  onClose: t,
  onSave: r,
  initialDate: n,
  editingTask: o,
  allTasks: i = []
}) => {
  const [s, c] = Pe({
    name: "",
    description: "",
    startDate: n || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    endDate: n || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    progress: 0,
    parentId: null
  });
  qo(() => {
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
  const d = (u) => {
    u.preventDefault(), s.name.trim() && (r(o ? { ...o, ...s } : s), t());
  }, p = (u) => {
    const { name: l, value: m, type: y } = u.target;
    c((a) => ({
      ...a,
      [l]: y === "number" ? Number(m) : l === "parentId" && m === "" ? null : m
    }));
  };
  if (!e) return null;
  const h = ds(i, o == null ? void 0 : o.id);
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
  }, children: /* @__PURE__ */ A("div", { style: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  }, children: [
    /* @__PURE__ */ b("h2", { style: { margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600 }, children: o ? "Edit Task" : "Add New Task" }),
    /* @__PURE__ */ A("form", { onSubmit: d, children: [
      /* @__PURE__ */ A("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Task Name *" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "text",
            name: "name",
            value: s.name,
            onChange: p,
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
      /* @__PURE__ */ A("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Description" }),
        /* @__PURE__ */ b(
          "textarea",
          {
            name: "description",
            value: s.description,
            onChange: p,
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
      /* @__PURE__ */ A("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Parent Task (Optional)" }),
        /* @__PURE__ */ A(
          "select",
          {
            name: "parentId",
            value: s.parentId || "",
            onChange: p,
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
              h.map((u) => /* @__PURE__ */ b("option", { value: u.id, children: u.name }, u.id))
            ]
          }
        ),
        /* @__PURE__ */ b("p", { style: { fontSize: "12px", color: "#6b7280", marginTop: "4px" }, children: "Select a parent task to make this a subtask" })
      ] }),
      /* @__PURE__ */ A("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Start Date *" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "date",
            name: "startDate",
            value: s.startDate,
            onChange: p,
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
      /* @__PURE__ */ A("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "End Date *" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "date",
            name: "endDate",
            value: s.endDate,
            onChange: p,
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
      /* @__PURE__ */ A("div", { style: { marginBottom: "24px" }, children: [
        /* @__PURE__ */ b("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Progress (%)" }),
        /* @__PURE__ */ b(
          "input",
          {
            type: "number",
            name: "progress",
            value: s.progress,
            onChange: p,
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
      /* @__PURE__ */ A("div", { style: { display: "flex", gap: "12px", justifyContent: "flex-end" }, children: [
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
}, Ts = ({
  tasks: e,
  dependencies: t = [],
  getTaskPosition: r,
  style: n = "curved",
  color: o = "#94a3b8",
  thickness: i = 2,
  showLabels: s = !1,
  criticalPathEnabled: c = !1,
  criticalPathColor: d = "#ef4444"
}) => {
  const p = (u, l, m = "FS", y = !1) => {
    const a = r(u), g = r(l);
    if (!a || !g) return null;
    e.find((O) => O.id === u), e.find((O) => O.id === l);
    const w = c && y ? d : o;
    let v, T, S, f, E = "";
    switch (m) {
      case "FS":
        v = a.left + a.width, T = a.top + a.height / 2, S = g.left, f = g.top + g.height / 2, E = "FS";
        break;
      case "FF":
        v = a.left + a.width, T = a.top + a.height / 2, S = g.left + g.width, f = g.top + g.height / 2, E = "FF";
        break;
      case "SF":
        v = a.left, T = a.top + a.height / 2, S = g.left + g.width, f = g.top + g.height / 2, E = "SF";
        break;
      case "SS":
        v = a.left, T = a.top + a.height / 2, S = g.left, f = g.top + g.height / 2, E = "SS";
        break;
    }
    const C = `dep-${u}-${l}-${m}`;
    if (n === "straight")
      return /* @__PURE__ */ A("g", { children: [
        /* @__PURE__ */ b(
          "line",
          {
            x1: v,
            y1: T,
            x2: S,
            y2: f,
            stroke: w,
            strokeWidth: i,
            markerEnd: `url(#arrowhead-${y ? "critical" : "normal"})`
          }
        ),
        s && /* @__PURE__ */ b(
          "text",
          {
            x: (v + S) / 2,
            y: (T + f) / 2 - 5,
            fill: w,
            fontSize: "10",
            fontWeight: "500",
            children: E
          }
        )
      ] }, C);
    {
      const O = (v + S) / 2, X = `
        M ${v} ${T}
        L ${O} ${T}
        L ${O} ${f}
        L ${S} ${f}
      `;
      return /* @__PURE__ */ A("g", { children: [
        /* @__PURE__ */ b(
          "path",
          {
            d: X,
            fill: "none",
            stroke: w,
            strokeWidth: i,
            markerEnd: `url(#arrowhead-${y ? "critical" : "normal"})`
          }
        ),
        s && /* @__PURE__ */ b(
          "text",
          {
            x: O,
            y: (T + f) / 2 - 5,
            fill: w,
            fontSize: "10",
            fontWeight: "500",
            textAnchor: "middle",
            children: E
          }
        )
      ] }, C);
    }
  }, h = [];
  return t && t.length > 0 ? t.forEach((u) => {
    const l = e.find((g) => g.id === u.from), m = e.find((g) => g.id === u.to), y = c && (l == null ? void 0 : l.isCritical) && (m == null ? void 0 : m.isCritical), a = p(u.from, u.to, u.type, y);
    a && h.push(a);
  }) : e.forEach((u) => {
    u.dependencies && u.dependencies.length > 0 && u.dependencies.forEach((l) => {
      const m = e.find((y) => y.id === l);
      if (m) {
        const y = c && (m == null ? void 0 : m.isCritical) && (u == null ? void 0 : u.isCritical), a = p(l, u.id, "FS", y);
        a && h.push(a);
      }
    });
  }), h.length === 0 ? null : /* @__PURE__ */ A(
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
        /* @__PURE__ */ A("defs", { children: [
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
                  fill: d
                }
              )
            }
          )
        ] }),
        h
      ]
    }
  );
}, eu = ({
  tasks: e,
  dependencies: t,
  onChange: r,
  onTaskClick: n,
  onTaskDoubleClick: o,
  getTaskColor: i,
  config: s,
  viewMode: c = "day",
  locale: d = "en-US",
  height: p = 600,
  onTaskUpdate: h
}) => {
  const m = Le(null), y = Le(null), a = Le(null), [g, w] = Pe(!1), [v, T] = Pe(""), [S, f] = Pe(null), [E, C] = Pe(/* @__PURE__ */ new Set()), [O, X] = Pe(""), [H, ue] = Pe(c);
  qe.useEffect(() => {
    ue(c);
  }, [c]);
  const K = je(() => {
    let M = e;
    if (O) {
      const z = O.toLowerCase(), ae = (Te) => Te.filter((he) => {
        const $e = he.name.toLowerCase().includes(z), ot = he.subtasks ? ae(he.subtasks) : [];
        return $e || ot.length > 0;
      }).map((he) => ({
        ...he,
        subtasks: he.subtasks ? ae(he.subtasks) : void 0,
        isExpanded: !0
        // Auto-expand on filter
      }));
      M = ae(M);
    }
    return s != null && s.showCriticalPath ? ms(M) : M;
  }, [e, s == null ? void 0 : s.showCriticalPath, O]), I = je(() => ls(K, E), [K, E]), V = je(() => as(I), [I]), ie = je(
    () => cs(V.start, V.end, H),
    [V, H]
  ), F = () => {
    const M = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(e, null, 2)), z = document.createElement("a");
    z.setAttribute("href", M), z.setAttribute("download", "gantt-data.json"), document.body.appendChild(z), z.click(), z.remove();
  }, J = (M) => {
    C((z) => us(M, z));
  }, U = ie.length * 80, N = (M) => {
    y.current && (y.current.scrollTop = M.currentTarget.scrollTop), a.current && (a.current.scrollLeft = M.currentTarget.scrollLeft);
  }, x = (M) => {
    m.current && (m.current.scrollTop = M.currentTarget.scrollTop);
  }, _ = (M) => {
    m.current && (m.current.scrollLeft = M.currentTarget.scrollLeft);
  }, D = (M, z) => {
    if (console.log("🔄 GanttChart.handleTaskUpdate called:", { taskId: M, updates: z }), h && h(M, z), r) {
      let ae = e.map((Te) => {
        if (Te.id === M) {
          if ("startDate" in Te) {
            const he = { ...Te };
            return Object.keys(z).forEach(($e) => {
              $e === "start" && z.start ? (he.startDate = z.start, he.start = z.start) : $e === "end" && z.end ? (he.endDate = z.end, he.end = z.end) : he[$e] = z[$e];
            }), he;
          }
          return { ...Te, ...z };
        }
        return Te;
      });
      s != null && s.autoSchedule && (ae = bs(
        ae,
        t || [],
        M,
        s.holidays,
        s.showWeekends
      )), r(ae);
    }
  }, P = (M) => {
    var $e;
    if (M.target.closest("[data-task-bar]") || n)
      return;
    const z = M.currentTarget.getBoundingClientRect(), ae = M.clientX - z.left + ((($e = m.current) == null ? void 0 : $e.scrollLeft) || 0), Te = Math.floor(ae / 80), he = ie[Te];
    if (he) {
      const ot = he.startDate, hr = ot.getFullYear(), it = String(ot.getMonth() + 1).padStart(2, "0"), bt = String(ot.getDate()).padStart(2, "0"), Nt = `${hr}-${it}-${bt}`;
      T(Nt), f(null), w(!0);
    }
  }, R = (M) => {
    f(M);
    const z = M.start || M.startDate;
    T(typeof z == "string" ? z : z.toISOString().split("T")[0]), w(!0);
  }, k = (M) => {
    if (r)
      if ("id" in M) {
        const z = e.map(
          (ae) => ae.id === M.id ? M : ae
        );
        r(z);
      } else {
        const z = {
          name: "",
          start: (/* @__PURE__ */ new Date()).toISOString(),
          end: (/* @__PURE__ */ new Date()).toISOString(),
          ...M,
          id: `task-${Date.now()}`
        };
        r([...e, z]);
      }
    w(!1), f(null);
  }, j = (s == null ? void 0 : s.columns) || [{ id: "name", label: "Task Name", width: 280 }], B = j.reduce((M, z) => M + (z.width || 100), 0), Y = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#fff",
    height: p,
    position: "relative"
  }, G = {
    display: "flex",
    flex: 1,
    overflow: "hidden"
  }, q = {
    width: B,
    borderRight: "1px solid #d1d5db",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#fafafa"
  }, ve = {
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
  }, $ = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden"
  }, _e = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, Ue = {
    overflowX: "auto",
    overflowY: "hidden",
    borderBottom: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    flexShrink: 0
  }, nt = {
    flex: 1,
    overflowX: "auto",
    overflowY: "auto"
  }, L = {
    position: "relative",
    height: `${I.length * 50}px`,
    width: `${U}px`,
    minWidth: "100%",
    backgroundColor: "#fff"
  }, Ee = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex"
  }, We = {
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between"
  }, Ne = {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  }, Ke = {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "13px",
    width: "200px",
    outline: "none"
  }, ze = {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "13px",
    backgroundColor: "#fff",
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s"
  }, Xe = {
    ...ze,
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6"
  };
  return /* @__PURE__ */ A("div", { style: Y, children: [
    /* @__PURE__ */ A("div", { style: We, children: [
      /* @__PURE__ */ A("div", { style: Ne, children: [
        /* @__PURE__ */ b(
          "input",
          {
            type: "text",
            placeholder: "Filter tasks...",
            style: Ke,
            value: O,
            onChange: (M) => X(M.target.value)
          }
        ),
        /* @__PURE__ */ b("button", { style: ze, onClick: F, title: "Export to JSON", children: "Export" })
      ] }),
      /* @__PURE__ */ A("div", { style: Ne, children: [
        /* @__PURE__ */ b(
          "button",
          {
            style: H === "day" ? Xe : ze,
            onClick: () => ue("day"),
            children: "Day"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: H === "week" ? Xe : ze,
            onClick: () => ue("week"),
            children: "Week"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: H === "month" ? Xe : ze,
            onClick: () => ue("month"),
            children: "Month"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: H === "quarter" ? Xe : ze,
            onClick: () => ue("quarter"),
            children: "Quarter"
          }
        ),
        /* @__PURE__ */ b(
          "button",
          {
            style: Xe,
            onClick: () => {
              a.current && (a.current.scrollLeft = 0);
            },
            children: "Today"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ A("div", { style: G, children: [
      /* @__PURE__ */ A("div", { style: q, children: [
        /* @__PURE__ */ b("div", { style: ve, children: j.map((M) => /* @__PURE__ */ b(
          "div",
          {
            style: {
              width: M.width || 100,
              minWidth: M.width || 100,
              padding: "0 8px",
              boxSizing: "border-box",
              borderRight: "1px solid #e5e7eb",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            },
            children: M.label
          },
          M.id
        )) }),
        /* @__PURE__ */ b(
          "div",
          {
            ref: y,
            onScroll: x,
            style: $,
            children: /* @__PURE__ */ b(
              xs,
              {
                tasks: I,
                rowHeight: 50,
                onToggleExpand: J,
                columns: j
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ A("div", { style: _e, children: [
        /* @__PURE__ */ b(
          "div",
          {
            ref: a,
            onScroll: _,
            style: Ue,
            children: /* @__PURE__ */ b(vs, { units: ie, chartWidth: U, unitWidth: 80 })
          }
        ),
        /* @__PURE__ */ b(
          "div",
          {
            ref: m,
            "data-gantt-chart-scroll": "true",
            onScroll: N,
            style: nt,
            children: /* @__PURE__ */ A(
              "div",
              {
                style: L,
                onClick: P,
                children: [
                  /* @__PURE__ */ b("div", { style: Ee, children: ie.map((M, z) => /* @__PURE__ */ b(
                    "div",
                    {
                      style: {
                        width: "80px",
                        minWidth: "80px",
                        maxWidth: "80px",
                        borderRight: z < ie.length - 1 ? "1px solid #f3f4f6" : "none",
                        boxSizing: "border-box"
                      }
                    },
                    z
                  )) }),
                  I.map((M, z) => /* @__PURE__ */ b(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: `${z * 50}px`,
                        height: "50px",
                        borderBottom: z < I.length - 1 ? "1px solid #f3f4f6" : "none"
                      }
                    },
                    z
                  )),
                  I.map((M, z) => /* @__PURE__ */ b(
                    ws,
                    {
                      task: M,
                      timelineStart: V.start,
                      timelineEnd: V.end,
                      chartWidth: U,
                      rowHeight: 50,
                      index: z,
                      onTaskUpdate: D,
                      onClick: n,
                      onDoubleClick: o || (n ? void 0 : R),
                      getTaskColor: i,
                      config: s
                    },
                    M.id
                  )),
                  (s == null ? void 0 : s.showDependencies) !== !1 && /* @__PURE__ */ b(
                    Ts,
                    {
                      tasks: I,
                      dependencies: t,
                      getTaskPosition: (M) => {
                        const z = I.findIndex(($e) => $e.id === M);
                        if (z === -1) return null;
                        const ae = I[z], { left: Te, width: he } = Ir(ae, V.start, V.end, U);
                        return {
                          left: Te,
                          width: he,
                          top: z * 50 + 10,
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
      Es,
      {
        isOpen: g,
        onClose: () => {
          w(!1), f(null);
        },
        onSave: k,
        initialDate: v,
        editingTask: S,
        allTasks: e
      }
    )
  ] });
};
function Cs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ge(e) {
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
var jr = {}, to = { exports: {} };
(function(e) {
  function t(r) {
    return r && r.__esModule ? r : {
      default: r
    };
  }
  e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports;
})(to);
var Qt = to.exports, br = {};
function ne() {
  return ne = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ne.apply(null, arguments);
}
function Ze(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function ro(e) {
  if (/* @__PURE__ */ le.isValidElement(e) || !Ze(e))
    return e;
  const t = {};
  return Object.keys(e).forEach((r) => {
    t[r] = ro(e[r]);
  }), t;
}
function Be(e, t, r = {
  clone: !0
}) {
  const n = r.clone ? ne({}, e) : e;
  return Ze(e) && Ze(t) && Object.keys(t).forEach((o) => {
    /* @__PURE__ */ le.isValidElement(t[o]) ? n[o] = t[o] : Ze(t[o]) && // Avoid prototype pollution
    Object.prototype.hasOwnProperty.call(e, o) && Ze(e[o]) ? n[o] = Be(e[o], t[o], r) : r.clone ? n[o] = Ze(t[o]) ? ro(t[o]) : t[o] : n[o] = t[o];
  }), n;
}
const _s = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Be,
  isPlainObject: Ze
}, Symbol.toStringTag, { value: "Module" }));
var Pr = { exports: {} }, Lt = { exports: {} }, ee = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var an;
function $s() {
  if (an) return ee;
  an = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, c = e ? Symbol.for("react.context") : 60110, d = e ? Symbol.for("react.async_mode") : 60111, p = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, u = e ? Symbol.for("react.suspense") : 60113, l = e ? Symbol.for("react.suspense_list") : 60120, m = e ? Symbol.for("react.memo") : 60115, y = e ? Symbol.for("react.lazy") : 60116, a = e ? Symbol.for("react.block") : 60121, g = e ? Symbol.for("react.fundamental") : 60117, w = e ? Symbol.for("react.responder") : 60118, v = e ? Symbol.for("react.scope") : 60119;
  function T(f) {
    if (typeof f == "object" && f !== null) {
      var E = f.$$typeof;
      switch (E) {
        case t:
          switch (f = f.type, f) {
            case d:
            case p:
            case n:
            case i:
            case o:
            case u:
              return f;
            default:
              switch (f = f && f.$$typeof, f) {
                case c:
                case h:
                case y:
                case m:
                case s:
                  return f;
                default:
                  return E;
              }
          }
        case r:
          return E;
      }
    }
  }
  function S(f) {
    return T(f) === p;
  }
  return ee.AsyncMode = d, ee.ConcurrentMode = p, ee.ContextConsumer = c, ee.ContextProvider = s, ee.Element = t, ee.ForwardRef = h, ee.Fragment = n, ee.Lazy = y, ee.Memo = m, ee.Portal = r, ee.Profiler = i, ee.StrictMode = o, ee.Suspense = u, ee.isAsyncMode = function(f) {
    return S(f) || T(f) === d;
  }, ee.isConcurrentMode = S, ee.isContextConsumer = function(f) {
    return T(f) === c;
  }, ee.isContextProvider = function(f) {
    return T(f) === s;
  }, ee.isElement = function(f) {
    return typeof f == "object" && f !== null && f.$$typeof === t;
  }, ee.isForwardRef = function(f) {
    return T(f) === h;
  }, ee.isFragment = function(f) {
    return T(f) === n;
  }, ee.isLazy = function(f) {
    return T(f) === y;
  }, ee.isMemo = function(f) {
    return T(f) === m;
  }, ee.isPortal = function(f) {
    return T(f) === r;
  }, ee.isProfiler = function(f) {
    return T(f) === i;
  }, ee.isStrictMode = function(f) {
    return T(f) === o;
  }, ee.isSuspense = function(f) {
    return T(f) === u;
  }, ee.isValidElementType = function(f) {
    return typeof f == "string" || typeof f == "function" || f === n || f === p || f === i || f === o || f === u || f === l || typeof f == "object" && f !== null && (f.$$typeof === y || f.$$typeof === m || f.$$typeof === s || f.$$typeof === c || f.$$typeof === h || f.$$typeof === g || f.$$typeof === w || f.$$typeof === v || f.$$typeof === a);
  }, ee.typeOf = T, ee;
}
var te = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cn;
function Ds() {
  return cn || (cn = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, c = e ? Symbol.for("react.context") : 60110, d = e ? Symbol.for("react.async_mode") : 60111, p = e ? Symbol.for("react.concurrent_mode") : 60111, h = e ? Symbol.for("react.forward_ref") : 60112, u = e ? Symbol.for("react.suspense") : 60113, l = e ? Symbol.for("react.suspense_list") : 60120, m = e ? Symbol.for("react.memo") : 60115, y = e ? Symbol.for("react.lazy") : 60116, a = e ? Symbol.for("react.block") : 60121, g = e ? Symbol.for("react.fundamental") : 60117, w = e ? Symbol.for("react.responder") : 60118, v = e ? Symbol.for("react.scope") : 60119;
    function T($) {
      return typeof $ == "string" || typeof $ == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      $ === n || $ === p || $ === i || $ === o || $ === u || $ === l || typeof $ == "object" && $ !== null && ($.$$typeof === y || $.$$typeof === m || $.$$typeof === s || $.$$typeof === c || $.$$typeof === h || $.$$typeof === g || $.$$typeof === w || $.$$typeof === v || $.$$typeof === a);
    }
    function S($) {
      if (typeof $ == "object" && $ !== null) {
        var _e = $.$$typeof;
        switch (_e) {
          case t:
            var Ue = $.type;
            switch (Ue) {
              case d:
              case p:
              case n:
              case i:
              case o:
              case u:
                return Ue;
              default:
                var nt = Ue && Ue.$$typeof;
                switch (nt) {
                  case c:
                  case h:
                  case y:
                  case m:
                  case s:
                    return nt;
                  default:
                    return _e;
                }
            }
          case r:
            return _e;
        }
      }
    }
    var f = d, E = p, C = c, O = s, X = t, H = h, ue = n, K = y, I = m, V = r, ie = i, F = o, J = u, U = !1;
    function N($) {
      return U || (U = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), x($) || S($) === d;
    }
    function x($) {
      return S($) === p;
    }
    function _($) {
      return S($) === c;
    }
    function D($) {
      return S($) === s;
    }
    function P($) {
      return typeof $ == "object" && $ !== null && $.$$typeof === t;
    }
    function R($) {
      return S($) === h;
    }
    function k($) {
      return S($) === n;
    }
    function j($) {
      return S($) === y;
    }
    function B($) {
      return S($) === m;
    }
    function Y($) {
      return S($) === r;
    }
    function G($) {
      return S($) === i;
    }
    function q($) {
      return S($) === o;
    }
    function ve($) {
      return S($) === u;
    }
    te.AsyncMode = f, te.ConcurrentMode = E, te.ContextConsumer = C, te.ContextProvider = O, te.Element = X, te.ForwardRef = H, te.Fragment = ue, te.Lazy = K, te.Memo = I, te.Portal = V, te.Profiler = ie, te.StrictMode = F, te.Suspense = J, te.isAsyncMode = N, te.isConcurrentMode = x, te.isContextConsumer = _, te.isContextProvider = D, te.isElement = P, te.isForwardRef = R, te.isFragment = k, te.isLazy = j, te.isMemo = B, te.isPortal = Y, te.isProfiler = G, te.isStrictMode = q, te.isSuspense = ve, te.isValidElementType = T, te.typeOf = S;
  }()), te;
}
var ln;
function no() {
  return ln || (ln = 1, process.env.NODE_ENV === "production" ? Lt.exports = $s() : Lt.exports = Ds()), Lt.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var vr, un;
function Os() {
  if (un) return vr;
  un = 1;
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
      var d = Object.getOwnPropertyNames(s).map(function(h) {
        return s[h];
      });
      if (d.join("") !== "0123456789")
        return !1;
      var p = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(h) {
        p[h] = h;
      }), Object.keys(Object.assign({}, p)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return vr = o() ? Object.assign : function(i, s) {
    for (var c, d = n(i), p, h = 1; h < arguments.length; h++) {
      c = Object(arguments[h]);
      for (var u in c)
        t.call(c, u) && (d[u] = c[u]);
      if (e) {
        p = e(c);
        for (var l = 0; l < p.length; l++)
          r.call(c, p[l]) && (d[p[l]] = c[p[l]]);
      }
    }
    return d;
  }, vr;
}
var xr, dn;
function Wr() {
  if (dn) return xr;
  dn = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return xr = e, xr;
}
var Sr, fn;
function oo() {
  return fn || (fn = 1, Sr = Function.call.bind(Object.prototype.hasOwnProperty)), Sr;
}
var wr, pn;
function Rs() {
  if (pn) return wr;
  pn = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = Wr(), r = {}, n = oo();
    e = function(i) {
      var s = "Warning: " + i;
      typeof console < "u" && console.error(s);
      try {
        throw new Error(s);
      } catch {
      }
    };
  }
  function o(i, s, c, d, p) {
    if (process.env.NODE_ENV !== "production") {
      for (var h in i)
        if (n(i, h)) {
          var u;
          try {
            if (typeof i[h] != "function") {
              var l = Error(
                (d || "React class") + ": " + c + " type `" + h + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[h] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw l.name = "Invariant Violation", l;
            }
            u = i[h](s, h, d, c, null, t);
          } catch (y) {
            u = y;
          }
          if (u && !(u instanceof Error) && e(
            (d || "React class") + ": type specification of " + c + " `" + h + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof u + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), u instanceof Error && !(u.message in r)) {
            r[u.message] = !0;
            var m = p ? p() : "";
            e(
              "Failed " + c + " type: " + u.message + (m ?? "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (r = {});
  }, wr = o, wr;
}
var Er, hn;
function Is() {
  if (hn) return Er;
  hn = 1;
  var e = no(), t = Os(), r = Wr(), n = oo(), o = Rs(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(c) {
    var d = "Warning: " + c;
    typeof console < "u" && console.error(d);
    try {
      throw new Error(d);
    } catch {
    }
  });
  function s() {
    return null;
  }
  return Er = function(c, d) {
    var p = typeof Symbol == "function" && Symbol.iterator, h = "@@iterator";
    function u(x) {
      var _ = x && (p && x[p] || x[h]);
      if (typeof _ == "function")
        return _;
    }
    var l = "<<anonymous>>", m = {
      array: w("array"),
      bigint: w("bigint"),
      bool: w("boolean"),
      func: w("function"),
      number: w("number"),
      object: w("object"),
      string: w("string"),
      symbol: w("symbol"),
      any: v(),
      arrayOf: T,
      element: S(),
      elementType: f(),
      instanceOf: E,
      node: H(),
      objectOf: O,
      oneOf: C,
      oneOfType: X,
      shape: K,
      exact: I
    };
    function y(x, _) {
      return x === _ ? x !== 0 || 1 / x === 1 / _ : x !== x && _ !== _;
    }
    function a(x, _) {
      this.message = x, this.data = _ && typeof _ == "object" ? _ : {}, this.stack = "";
    }
    a.prototype = Error.prototype;
    function g(x) {
      if (process.env.NODE_ENV !== "production")
        var _ = {}, D = 0;
      function P(k, j, B, Y, G, q, ve) {
        if (Y = Y || l, q = q || B, ve !== r) {
          if (d) {
            var $ = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw $.name = "Invariant Violation", $;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var _e = Y + ":" + B;
            !_[_e] && // Avoid spamming the console because they are often not actionable except for lib authors
            D < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + q + "` prop on `" + Y + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), _[_e] = !0, D++);
          }
        }
        return j[B] == null ? k ? j[B] === null ? new a("The " + G + " `" + q + "` is marked as required " + ("in `" + Y + "`, but its value is `null`.")) : new a("The " + G + " `" + q + "` is marked as required in " + ("`" + Y + "`, but its value is `undefined`.")) : null : x(j, B, Y, G, q);
      }
      var R = P.bind(null, !1);
      return R.isRequired = P.bind(null, !0), R;
    }
    function w(x) {
      function _(D, P, R, k, j, B) {
        var Y = D[P], G = F(Y);
        if (G !== x) {
          var q = J(Y);
          return new a(
            "Invalid " + k + " `" + j + "` of type " + ("`" + q + "` supplied to `" + R + "`, expected ") + ("`" + x + "`."),
            { expectedType: x }
          );
        }
        return null;
      }
      return g(_);
    }
    function v() {
      return g(s);
    }
    function T(x) {
      function _(D, P, R, k, j) {
        if (typeof x != "function")
          return new a("Property `" + j + "` of component `" + R + "` has invalid PropType notation inside arrayOf.");
        var B = D[P];
        if (!Array.isArray(B)) {
          var Y = F(B);
          return new a("Invalid " + k + " `" + j + "` of type " + ("`" + Y + "` supplied to `" + R + "`, expected an array."));
        }
        for (var G = 0; G < B.length; G++) {
          var q = x(B, G, R, k, j + "[" + G + "]", r);
          if (q instanceof Error)
            return q;
        }
        return null;
      }
      return g(_);
    }
    function S() {
      function x(_, D, P, R, k) {
        var j = _[D];
        if (!c(j)) {
          var B = F(j);
          return new a("Invalid " + R + " `" + k + "` of type " + ("`" + B + "` supplied to `" + P + "`, expected a single ReactElement."));
        }
        return null;
      }
      return g(x);
    }
    function f() {
      function x(_, D, P, R, k) {
        var j = _[D];
        if (!e.isValidElementType(j)) {
          var B = F(j);
          return new a("Invalid " + R + " `" + k + "` of type " + ("`" + B + "` supplied to `" + P + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return g(x);
    }
    function E(x) {
      function _(D, P, R, k, j) {
        if (!(D[P] instanceof x)) {
          var B = x.name || l, Y = N(D[P]);
          return new a("Invalid " + k + " `" + j + "` of type " + ("`" + Y + "` supplied to `" + R + "`, expected ") + ("instance of `" + B + "`."));
        }
        return null;
      }
      return g(_);
    }
    function C(x) {
      if (!Array.isArray(x))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), s;
      function _(D, P, R, k, j) {
        for (var B = D[P], Y = 0; Y < x.length; Y++)
          if (y(B, x[Y]))
            return null;
        var G = JSON.stringify(x, function(ve, $) {
          var _e = J($);
          return _e === "symbol" ? String($) : $;
        });
        return new a("Invalid " + k + " `" + j + "` of value `" + String(B) + "` " + ("supplied to `" + R + "`, expected one of " + G + "."));
      }
      return g(_);
    }
    function O(x) {
      function _(D, P, R, k, j) {
        if (typeof x != "function")
          return new a("Property `" + j + "` of component `" + R + "` has invalid PropType notation inside objectOf.");
        var B = D[P], Y = F(B);
        if (Y !== "object")
          return new a("Invalid " + k + " `" + j + "` of type " + ("`" + Y + "` supplied to `" + R + "`, expected an object."));
        for (var G in B)
          if (n(B, G)) {
            var q = x(B, G, R, k, j + "." + G, r);
            if (q instanceof Error)
              return q;
          }
        return null;
      }
      return g(_);
    }
    function X(x) {
      if (!Array.isArray(x))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), s;
      for (var _ = 0; _ < x.length; _++) {
        var D = x[_];
        if (typeof D != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + U(D) + " at index " + _ + "."
          ), s;
      }
      function P(R, k, j, B, Y) {
        for (var G = [], q = 0; q < x.length; q++) {
          var ve = x[q], $ = ve(R, k, j, B, Y, r);
          if ($ == null)
            return null;
          $.data && n($.data, "expectedType") && G.push($.data.expectedType);
        }
        var _e = G.length > 0 ? ", expected one of type [" + G.join(", ") + "]" : "";
        return new a("Invalid " + B + " `" + Y + "` supplied to " + ("`" + j + "`" + _e + "."));
      }
      return g(P);
    }
    function H() {
      function x(_, D, P, R, k) {
        return V(_[D]) ? null : new a("Invalid " + R + " `" + k + "` supplied to " + ("`" + P + "`, expected a ReactNode."));
      }
      return g(x);
    }
    function ue(x, _, D, P, R) {
      return new a(
        (x || "React class") + ": " + _ + " type `" + D + "." + P + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + R + "`."
      );
    }
    function K(x) {
      function _(D, P, R, k, j) {
        var B = D[P], Y = F(B);
        if (Y !== "object")
          return new a("Invalid " + k + " `" + j + "` of type `" + Y + "` " + ("supplied to `" + R + "`, expected `object`."));
        for (var G in x) {
          var q = x[G];
          if (typeof q != "function")
            return ue(R, k, j, G, J(q));
          var ve = q(B, G, R, k, j + "." + G, r);
          if (ve)
            return ve;
        }
        return null;
      }
      return g(_);
    }
    function I(x) {
      function _(D, P, R, k, j) {
        var B = D[P], Y = F(B);
        if (Y !== "object")
          return new a("Invalid " + k + " `" + j + "` of type `" + Y + "` " + ("supplied to `" + R + "`, expected `object`."));
        var G = t({}, D[P], x);
        for (var q in G) {
          var ve = x[q];
          if (n(x, q) && typeof ve != "function")
            return ue(R, k, j, q, J(ve));
          if (!ve)
            return new a(
              "Invalid " + k + " `" + j + "` key `" + q + "` supplied to `" + R + "`.\nBad object: " + JSON.stringify(D[P], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(x), null, "  ")
            );
          var $ = ve(B, q, R, k, j + "." + q, r);
          if ($)
            return $;
        }
        return null;
      }
      return g(_);
    }
    function V(x) {
      switch (typeof x) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !x;
        case "object":
          if (Array.isArray(x))
            return x.every(V);
          if (x === null || c(x))
            return !0;
          var _ = u(x);
          if (_) {
            var D = _.call(x), P;
            if (_ !== x.entries) {
              for (; !(P = D.next()).done; )
                if (!V(P.value))
                  return !1;
            } else
              for (; !(P = D.next()).done; ) {
                var R = P.value;
                if (R && !V(R[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function ie(x, _) {
      return x === "symbol" ? !0 : _ ? _["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && _ instanceof Symbol : !1;
    }
    function F(x) {
      var _ = typeof x;
      return Array.isArray(x) ? "array" : x instanceof RegExp ? "object" : ie(_, x) ? "symbol" : _;
    }
    function J(x) {
      if (typeof x > "u" || x === null)
        return "" + x;
      var _ = F(x);
      if (_ === "object") {
        if (x instanceof Date)
          return "date";
        if (x instanceof RegExp)
          return "regexp";
      }
      return _;
    }
    function U(x) {
      var _ = J(x);
      switch (_) {
        case "array":
        case "object":
          return "an " + _;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + _;
        default:
          return _;
      }
    }
    function N(x) {
      return !x.constructor || !x.constructor.name ? l : x.constructor.name;
    }
    return m.checkPropTypes = o, m.resetWarningCache = o.resetWarningCache, m.PropTypes = m, m;
  }, Er;
}
var Tr, mn;
function Ps() {
  if (mn) return Tr;
  mn = 1;
  var e = Wr();
  function t() {
  }
  function r() {
  }
  return r.resetWarningCache = t, Tr = function() {
    function n(s, c, d, p, h, u) {
      if (u !== e) {
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
  }, Tr;
}
if (process.env.NODE_ENV !== "production") {
  var Ms = no(), ks = !0;
  Pr.exports = Is()(Ms.isElement, ks);
} else
  Pr.exports = Ps()();
var As = Pr.exports;
const W = /* @__PURE__ */ Cs(As);
function _t(e) {
  let t = "https://mui.com/production-error/?code=" + e;
  for (let r = 1; r < arguments.length; r += 1)
    t += "&args[]=" + encodeURIComponent(arguments[r]);
  return "Minified MUI error #" + e + "; visit " + t + " for the full message.";
}
const Ns = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _t
}, Symbol.toStringTag, { value: "Module" }));
var Mr = { exports: {} }, oe = {};
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yn;
function zs() {
  if (yn) return oe;
  yn = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), i = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), u = Symbol.for("react.lazy"), l = Symbol.for("react.view_transition"), m = Symbol.for("react.client.reference");
  function y(a) {
    if (typeof a == "object" && a !== null) {
      var g = a.$$typeof;
      switch (g) {
        case e:
          switch (a = a.type, a) {
            case r:
            case o:
            case n:
            case d:
            case p:
            case l:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case s:
                case c:
                case u:
                case h:
                  return a;
                case i:
                  return a;
                default:
                  return g;
              }
          }
        case t:
          return g;
      }
    }
  }
  return oe.ContextConsumer = i, oe.ContextProvider = s, oe.Element = e, oe.ForwardRef = c, oe.Fragment = r, oe.Lazy = u, oe.Memo = h, oe.Portal = t, oe.Profiler = o, oe.StrictMode = n, oe.Suspense = d, oe.SuspenseList = p, oe.isContextConsumer = function(a) {
    return y(a) === i;
  }, oe.isContextProvider = function(a) {
    return y(a) === s;
  }, oe.isElement = function(a) {
    return typeof a == "object" && a !== null && a.$$typeof === e;
  }, oe.isForwardRef = function(a) {
    return y(a) === c;
  }, oe.isFragment = function(a) {
    return y(a) === r;
  }, oe.isLazy = function(a) {
    return y(a) === u;
  }, oe.isMemo = function(a) {
    return y(a) === h;
  }, oe.isPortal = function(a) {
    return y(a) === t;
  }, oe.isProfiler = function(a) {
    return y(a) === o;
  }, oe.isStrictMode = function(a) {
    return y(a) === n;
  }, oe.isSuspense = function(a) {
    return y(a) === d;
  }, oe.isSuspenseList = function(a) {
    return y(a) === p;
  }, oe.isValidElementType = function(a) {
    return typeof a == "string" || typeof a == "function" || a === r || a === o || a === n || a === d || a === p || typeof a == "object" && a !== null && (a.$$typeof === u || a.$$typeof === h || a.$$typeof === s || a.$$typeof === i || a.$$typeof === c || a.$$typeof === m || a.getModuleId !== void 0);
  }, oe.typeOf = y, oe;
}
var se = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gn;
function Ls() {
  return gn || (gn = 1, process.env.NODE_ENV !== "production" && function() {
    function e(a) {
      if (typeof a == "object" && a !== null) {
        var g = a.$$typeof;
        switch (g) {
          case t:
            switch (a = a.type, a) {
              case n:
              case i:
              case o:
              case p:
              case h:
              case m:
                return a;
              default:
                switch (a = a && a.$$typeof, a) {
                  case c:
                  case d:
                  case l:
                  case u:
                    return a;
                  case s:
                    return a;
                  default:
                    return g;
                }
            }
          case r:
            return g;
        }
      }
    }
    var t = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), s = Symbol.for("react.consumer"), c = Symbol.for("react.context"), d = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), h = Symbol.for("react.suspense_list"), u = Symbol.for("react.memo"), l = Symbol.for("react.lazy"), m = Symbol.for("react.view_transition"), y = Symbol.for("react.client.reference");
    se.ContextConsumer = s, se.ContextProvider = c, se.Element = t, se.ForwardRef = d, se.Fragment = n, se.Lazy = l, se.Memo = u, se.Portal = r, se.Profiler = i, se.StrictMode = o, se.Suspense = p, se.SuspenseList = h, se.isContextConsumer = function(a) {
      return e(a) === s;
    }, se.isContextProvider = function(a) {
      return e(a) === c;
    }, se.isElement = function(a) {
      return typeof a == "object" && a !== null && a.$$typeof === t;
    }, se.isForwardRef = function(a) {
      return e(a) === d;
    }, se.isFragment = function(a) {
      return e(a) === n;
    }, se.isLazy = function(a) {
      return e(a) === l;
    }, se.isMemo = function(a) {
      return e(a) === u;
    }, se.isPortal = function(a) {
      return e(a) === r;
    }, se.isProfiler = function(a) {
      return e(a) === i;
    }, se.isStrictMode = function(a) {
      return e(a) === o;
    }, se.isSuspense = function(a) {
      return e(a) === p;
    }, se.isSuspenseList = function(a) {
      return e(a) === h;
    }, se.isValidElementType = function(a) {
      return typeof a == "string" || typeof a == "function" || a === n || a === i || a === o || a === p || a === h || typeof a == "object" && a !== null && (a.$$typeof === l || a.$$typeof === u || a.$$typeof === c || a.$$typeof === s || a.$$typeof === d || a.$$typeof === y || a.getModuleId !== void 0);
    }, se.typeOf = e;
  }()), se;
}
process.env.NODE_ENV === "production" ? Mr.exports = zs() : Mr.exports = Ls();
var bn = Mr.exports;
const js = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;
function so(e) {
  const t = `${e}`.match(js);
  return t && t[1] || "";
}
function io(e, t = "") {
  return e.displayName || e.name || so(e) || t;
}
function vn(e, t, r) {
  const n = io(t);
  return e.displayName || (n !== "" ? `${r}(${n})` : r);
}
function Ws(e) {
  if (e != null) {
    if (typeof e == "string")
      return e;
    if (typeof e == "function")
      return io(e, "Component");
    if (typeof e == "object")
      switch (e.$$typeof) {
        case bn.ForwardRef:
          return vn(e, e.render, "ForwardRef");
        case bn.Memo:
          return vn(e, e.type, "memo");
        default:
          return;
      }
  }
}
const Fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ws,
  getFunctionName: so
}, Symbol.toStringTag, { value: "Module" }));
function et(e) {
  if (typeof e != "string")
    throw new Error(process.env.NODE_ENV !== "production" ? "MUI: `capitalize(string)` expects a string argument." : _t(7));
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const Bs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: et
}, Symbol.toStringTag, { value: "Module" }));
function Vs(...e) {
  return e.reduce((t, r) => r == null ? t : function(...o) {
    t.apply(this, o), r.apply(this, o);
  }, () => {
  });
}
function Us(e, t = 166) {
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
function Ys(e, t) {
  return process.env.NODE_ENV === "production" ? () => null : (r, n, o, i, s) => {
    const c = o || "<<anonymous>>", d = s || n;
    return typeof r[n] < "u" ? new Error(`The ${i} \`${d}\` of \`${c}\` is deprecated. ${t}`) : null;
  };
}
function qs(e, t) {
  var r, n;
  return /* @__PURE__ */ le.isValidElement(e) && t.indexOf(
    // For server components `muiName` is avaialble in element.type._payload.value.muiName
    // relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
    // eslint-disable-next-line no-underscore-dangle
    (r = e.type.muiName) != null ? r : (n = e.type) == null || (n = n._payload) == null || (n = n.value) == null ? void 0 : n.muiName
  ) !== -1;
}
function ao(e) {
  return e && e.ownerDocument || document;
}
function Hs(e) {
  return ao(e).defaultView || window;
}
function Gs(e, t) {
  if (process.env.NODE_ENV === "production")
    return () => null;
  const r = t ? ne({}, t.propTypes) : null;
  return (o) => (i, s, c, d, p, ...h) => {
    const u = p || s, l = r == null ? void 0 : r[u];
    if (l) {
      const m = l(i, s, c, d, p, ...h);
      if (m)
        return m;
    }
    return typeof i[s] < "u" && !i[o] ? new Error(`The prop \`${u}\` of \`${e}\` can only be used together with the \`${o}\` prop.`) : null;
  };
}
function co(e, t) {
  typeof e == "function" ? e(t) : e && (e.current = t);
}
const lo = typeof window < "u" ? le.useLayoutEffect : le.useEffect;
let xn = 0;
function Ks(e) {
  const [t, r] = le.useState(e), n = e || t;
  return le.useEffect(() => {
    t == null && (xn += 1, r(`mui-${xn}`));
  }, [t]), n;
}
const Sn = le.useId;
function Xs(e) {
  if (Sn !== void 0) {
    const t = Sn();
    return e ?? t;
  }
  return Ks(e);
}
function Js(e, t, r, n, o) {
  if (process.env.NODE_ENV === "production")
    return null;
  const i = o || t;
  return typeof e[t] < "u" ? new Error(`The prop \`${i}\` is not supported. Please remove it.`) : null;
}
function Zs({
  controlled: e,
  default: t,
  name: r,
  state: n = "value"
}) {
  const {
    current: o
  } = le.useRef(e !== void 0), [i, s] = le.useState(t), c = o ? e : i;
  if (process.env.NODE_ENV !== "production") {
    le.useEffect(() => {
      o !== (e !== void 0) && console.error([`MUI: A component is changing the ${o ? "" : "un"}controlled ${n} state of ${r} to be ${o ? "un" : ""}controlled.`, "Elements should not switch from uncontrolled to controlled (or vice versa).", `Decide between using a controlled or uncontrolled ${r} element for the lifetime of the component.`, "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.", "More info: https://fb.me/react-controlled-components"].join(`
`));
    }, [n, r, e]);
    const {
      current: p
    } = le.useRef(t);
    le.useEffect(() => {
      !o && !Object.is(p, t) && console.error([`MUI: A component is changing the default ${n} state of an uncontrolled ${r} after being initialized. To suppress this warning opt to use a controlled ${r}.`].join(`
`));
    }, [JSON.stringify(t)]);
  }
  const d = le.useCallback((p) => {
    o || s(p);
  }, []);
  return [c, d];
}
function Qs(e) {
  const t = le.useRef(e);
  return lo(() => {
    t.current = e;
  }), le.useRef((...r) => (
    // @ts-expect-error hide `this`
    (0, t.current)(...r)
  )).current;
}
function ei(...e) {
  return le.useMemo(() => e.every((t) => t == null) ? null : (t) => {
    e.forEach((r) => {
      co(r, t);
    });
  }, e);
}
class Fr {
  constructor() {
    this.currentId = null, this.clear = () => {
      this.currentId !== null && (clearTimeout(this.currentId), this.currentId = null);
    }, this.disposeEffect = () => this.clear;
  }
  static create() {
    return new Fr();
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
let er = !0, kr = !1;
const ti = new Fr(), ri = {
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
function ni(e) {
  const {
    type: t,
    tagName: r
  } = e;
  return !!(r === "INPUT" && ri[t] && !e.readOnly || r === "TEXTAREA" && !e.readOnly || e.isContentEditable);
}
function oi(e) {
  e.metaKey || e.altKey || e.ctrlKey || (er = !0);
}
function Cr() {
  er = !1;
}
function si() {
  this.visibilityState === "hidden" && kr && (er = !0);
}
function ii(e) {
  e.addEventListener("keydown", oi, !0), e.addEventListener("mousedown", Cr, !0), e.addEventListener("pointerdown", Cr, !0), e.addEventListener("touchstart", Cr, !0), e.addEventListener("visibilitychange", si, !0);
}
function ai(e) {
  const {
    target: t
  } = e;
  try {
    return t.matches(":focus-visible");
  } catch {
  }
  return er || ni(t);
}
function ci() {
  const e = le.useCallback((o) => {
    o != null && ii(o.ownerDocument);
  }, []), t = le.useRef(!1);
  function r() {
    return t.current ? (kr = !0, ti.start(100, () => {
      kr = !1;
    }), t.current = !1, !0) : !1;
  }
  function n(o) {
    return ai(o) ? (t.current = !0, !0) : !1;
  }
  return {
    isFocusVisibleRef: t,
    onFocus: n,
    onBlur: r,
    ref: e
  };
}
function Ar(e, t) {
  const r = ne({}, t);
  return Object.keys(e).forEach((n) => {
    if (n.toString().match(/^(components|slots)$/))
      r[n] = ne({}, e[n], r[n]);
    else if (n.toString().match(/^(componentsProps|slotProps)$/)) {
      const o = e[n] || {}, i = t[n];
      r[n] = {}, !i || !Object.keys(i) ? r[n] = o : !o || !Object.keys(o) ? r[n] = i : (r[n] = ne({}, i), Object.keys(o).forEach((s) => {
        r[n][s] = Ar(o[s], i[s]);
      }));
    } else r[n] === void 0 && (r[n] = e[n]);
  }), r;
}
function li(e, t, r = void 0) {
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
const wn = (e) => e, ui = () => {
  let e = wn;
  return {
    configure(t) {
      e = t;
    },
    generate(t) {
      return e(t);
    },
    reset() {
      e = wn;
    }
  };
}, uo = ui(), di = {
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
function Br(e, t, r = "Mui") {
  const n = di[t];
  return n ? `${r}-${n}` : `${uo.generate(e)}-${t}`;
}
function fi(e, t, r = "Mui") {
  const n = {};
  return t.forEach((o) => {
    n[o] = Br(e, o, r);
  }), n;
}
function pi(e, t = Number.MIN_SAFE_INTEGER, r = Number.MAX_SAFE_INTEGER) {
  return Math.max(t, Math.min(e, r));
}
const hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pi
}, Symbol.toStringTag, { value: "Module" }));
function tt(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function fo(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = fo(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function mi() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = fo(e)) && (n && (n += " "), n += t);
  return n;
}
const yi = /* @__PURE__ */ le.createContext(void 0);
process.env.NODE_ENV !== "production" && (W.node, W.object);
function gi(e) {
  const {
    theme: t,
    name: r,
    props: n
  } = e;
  if (!t || !t.components || !t.components[r])
    return n;
  const o = t.components[r];
  return o.defaultProps ? Ar(o.defaultProps, n) : !o.styleOverrides && !o.variants ? Ar(o, n) : n;
}
function bi({
  props: e,
  name: t
}) {
  const r = le.useContext(yi);
  return gi({
    props: e,
    name: t,
    theme: {
      components: r
    }
  });
}
process.env.NODE_ENV !== "production" && (W.node, W.object.isRequired);
function vi(e) {
  return bi(e);
}
var Rt = {}, _r = { exports: {} }, En;
function xi() {
  return En || (En = 1, function(e) {
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
  }(_r)), _r.exports;
}
var $r = { exports: {} }, Tn;
function Si() {
  return Tn || (Tn = 1, function(e) {
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
  }($r)), $r.exports;
}
function wi(e) {
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
var Ei = {
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
function Ti(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return function(r) {
    return t[r] === void 0 && (t[r] = e(r)), t[r];
  };
}
var Ci = /[A-Z]|^ms/g, _i = /_EMO_([^_]+?)_([^]*?)_EMO_/g, po = function(t) {
  return t.charCodeAt(1) === 45;
}, Cn = function(t) {
  return t != null && typeof t != "boolean";
}, Dr = /* @__PURE__ */ Ti(function(e) {
  return po(e) ? e : e.replace(Ci, "-$&").toLowerCase();
}), _n = function(t, r) {
  switch (t) {
    case "animation":
    case "animationName":
      if (typeof r == "string")
        return r.replace(_i, function(n, o, i) {
          return Qe = {
            name: o,
            styles: i,
            next: Qe
          }, o;
        });
  }
  return Ei[t] !== 1 && !po(t) && typeof r == "number" && r !== 0 ? r + "px" : r;
};
function Ht(e, t, r) {
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
        return Qe = {
          name: o.name,
          styles: o.styles,
          next: Qe
        }, o.name;
      var i = r;
      if (i.styles !== void 0) {
        var s = i.next;
        if (s !== void 0)
          for (; s !== void 0; )
            Qe = {
              name: s.name,
              styles: s.styles,
              next: Qe
            }, s = s.next;
        var c = i.styles + ";";
        return c;
      }
      return $i(e, t, r);
    }
  }
  var d = r;
  return d;
}
function $i(e, t, r) {
  var n = "";
  if (Array.isArray(r))
    for (var o = 0; o < r.length; o++)
      n += Ht(e, t, r[o]) + ";";
  else
    for (var i in r) {
      var s = r[i];
      if (typeof s != "object") {
        var c = s;
        Cn(c) && (n += Dr(i) + ":" + _n(i, c) + ";");
      } else if (Array.isArray(s) && typeof s[0] == "string" && t == null)
        for (var d = 0; d < s.length; d++)
          Cn(s[d]) && (n += Dr(i) + ":" + _n(i, s[d]) + ";");
      else {
        var p = Ht(e, t, s);
        switch (i) {
          case "animation":
          case "animationName": {
            n += Dr(i) + ":" + p + ";";
            break;
          }
          default:
            n += i + "{" + p + "}";
        }
      }
    }
  return n;
}
var $n = /label:\s*([^\s;{]+)\s*(;|$)/g, Qe;
function Di(e, t, r) {
  if (e.length === 1 && typeof e[0] == "object" && e[0] !== null && e[0].styles !== void 0)
    return e[0];
  var n = !0, o = "";
  Qe = void 0;
  var i = e[0];
  if (i == null || i.raw === void 0)
    n = !1, o += Ht(r, t, i);
  else {
    var s = i;
    o += s[0];
  }
  for (var c = 1; c < e.length; c++)
    if (o += Ht(r, t, e[c]), n) {
      var d = i;
      o += d[c];
    }
  $n.lastIndex = 0;
  for (var p = "", h; (h = $n.exec(o)) !== null; )
    p += "-" + h[1];
  var u = wi(o) + p;
  return {
    name: u,
    styles: o,
    next: Qe
  };
}
function Oi(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function Ri(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var Ii = /* @__PURE__ */ function() {
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
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(Ri(this));
    var o = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var i = Oi(o);
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
}(), we = "-ms-", Gt = "-moz-", Z = "-webkit-", ho = "comm", Vr = "rule", Ur = "decl", Pi = "@import", mo = "@keyframes", Mi = "@layer", ki = Math.abs, tr = String.fromCharCode, Ai = Object.assign;
function Ni(e, t) {
  return Se(e, 0) ^ 45 ? (((t << 2 ^ Se(e, 0)) << 2 ^ Se(e, 1)) << 2 ^ Se(e, 2)) << 2 ^ Se(e, 3) : 0;
}
function yo(e) {
  return e.trim();
}
function zi(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function Q(e, t, r) {
  return e.replace(t, r);
}
function Nr(e, t) {
  return e.indexOf(t);
}
function Se(e, t) {
  return e.charCodeAt(t) | 0;
}
function $t(e, t, r) {
  return e.slice(t, r);
}
function Fe(e) {
  return e.length;
}
function Yr(e) {
  return e.length;
}
function jt(e, t) {
  return t.push(e), e;
}
function Li(e, t) {
  return e.map(t).join("");
}
var rr = 1, ht = 1, go = 0, De = 0, ge = 0, mt = "";
function nr(e, t, r, n, o, i, s) {
  return { value: e, root: t, parent: r, type: n, props: o, children: i, line: rr, column: ht, length: s, return: "" };
}
function xt(e, t) {
  return Ai(nr("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function ji() {
  return ge;
}
function Wi() {
  return ge = De > 0 ? Se(mt, --De) : 0, ht--, ge === 10 && (ht = 1, rr--), ge;
}
function Re() {
  return ge = De < go ? Se(mt, De++) : 0, ht++, ge === 10 && (ht = 1, rr++), ge;
}
function Ve() {
  return Se(mt, De);
}
function Bt() {
  return De;
}
function It(e, t) {
  return $t(mt, e, t);
}
function Dt(e) {
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
function bo(e) {
  return rr = ht = 1, go = Fe(mt = e), De = 0, [];
}
function vo(e) {
  return mt = "", e;
}
function Vt(e) {
  return yo(It(De - 1, zr(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Fi(e) {
  for (; (ge = Ve()) && ge < 33; )
    Re();
  return Dt(e) > 2 || Dt(ge) > 3 ? "" : " ";
}
function Bi(e, t) {
  for (; --t && Re() && !(ge < 48 || ge > 102 || ge > 57 && ge < 65 || ge > 70 && ge < 97); )
    ;
  return It(e, Bt() + (t < 6 && Ve() == 32 && Re() == 32));
}
function zr(e) {
  for (; Re(); )
    switch (ge) {
      case e:
        return De;
      case 34:
      case 39:
        e !== 34 && e !== 39 && zr(ge);
        break;
      case 40:
        e === 41 && zr(e);
        break;
      case 92:
        Re();
        break;
    }
  return De;
}
function Vi(e, t) {
  for (; Re() && e + ge !== 57; )
    if (e + ge === 84 && Ve() === 47)
      break;
  return "/*" + It(t, De - 1) + "*" + tr(e === 47 ? e : Re());
}
function Ui(e) {
  for (; !Dt(Ve()); )
    Re();
  return It(e, De);
}
function Yi(e) {
  return vo(Ut("", null, null, null, [""], e = bo(e), 0, [0], e));
}
function Ut(e, t, r, n, o, i, s, c, d) {
  for (var p = 0, h = 0, u = s, l = 0, m = 0, y = 0, a = 1, g = 1, w = 1, v = 0, T = "", S = o, f = i, E = n, C = T; g; )
    switch (y = v, v = Re()) {
      case 40:
        if (y != 108 && Se(C, u - 1) == 58) {
          Nr(C += Q(Vt(v), "&", "&\f"), "&\f") != -1 && (w = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        C += Vt(v);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        C += Fi(y);
        break;
      case 92:
        C += Bi(Bt() - 1, 7);
        continue;
      case 47:
        switch (Ve()) {
          case 42:
          case 47:
            jt(qi(Vi(Re(), Bt()), t, r), d);
            break;
          default:
            C += "/";
        }
        break;
      case 123 * a:
        c[p++] = Fe(C) * w;
      case 125 * a:
      case 59:
      case 0:
        switch (v) {
          case 0:
          case 125:
            g = 0;
          case 59 + h:
            w == -1 && (C = Q(C, /\f/g, "")), m > 0 && Fe(C) - u && jt(m > 32 ? On(C + ";", n, r, u - 1) : On(Q(C, " ", "") + ";", n, r, u - 2), d);
            break;
          case 59:
            C += ";";
          default:
            if (jt(E = Dn(C, t, r, p, h, o, c, T, S = [], f = [], u), i), v === 123)
              if (h === 0)
                Ut(C, t, E, E, S, i, u, c, f);
              else
                switch (l === 99 && Se(C, 3) === 110 ? 100 : l) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    Ut(e, E, E, n && jt(Dn(e, E, E, 0, 0, o, c, T, o, S = [], u), f), o, f, u, c, n ? S : f);
                    break;
                  default:
                    Ut(C, E, E, E, [""], f, 0, c, f);
                }
        }
        p = h = m = 0, a = w = 1, T = C = "", u = s;
        break;
      case 58:
        u = 1 + Fe(C), m = y;
      default:
        if (a < 1) {
          if (v == 123)
            --a;
          else if (v == 125 && a++ == 0 && Wi() == 125)
            continue;
        }
        switch (C += tr(v), v * a) {
          case 38:
            w = h > 0 ? 1 : (C += "\f", -1);
            break;
          case 44:
            c[p++] = (Fe(C) - 1) * w, w = 1;
            break;
          case 64:
            Ve() === 45 && (C += Vt(Re())), l = Ve(), h = u = Fe(T = C += Ui(Bt())), v++;
            break;
          case 45:
            y === 45 && Fe(C) == 2 && (a = 0);
        }
    }
  return i;
}
function Dn(e, t, r, n, o, i, s, c, d, p, h) {
  for (var u = o - 1, l = o === 0 ? i : [""], m = Yr(l), y = 0, a = 0, g = 0; y < n; ++y)
    for (var w = 0, v = $t(e, u + 1, u = ki(a = s[y])), T = e; w < m; ++w)
      (T = yo(a > 0 ? l[w] + " " + v : Q(v, /&\f/g, l[w]))) && (d[g++] = T);
  return nr(e, t, r, o === 0 ? Vr : c, d, p, h);
}
function qi(e, t, r) {
  return nr(e, t, r, ho, tr(ji()), $t(e, 2, -2), 0);
}
function On(e, t, r, n) {
  return nr(e, t, r, Ur, $t(e, 0, n), $t(e, n + 1, -1), n);
}
function ft(e, t) {
  for (var r = "", n = Yr(e), o = 0; o < n; o++)
    r += t(e[o], o, e, t) || "";
  return r;
}
function Hi(e, t, r, n) {
  switch (e.type) {
    case Mi:
      if (e.children.length) break;
    case Pi:
    case Ur:
      return e.return = e.return || e.value;
    case ho:
      return "";
    case mo:
      return e.return = e.value + "{" + ft(e.children, n) + "}";
    case Vr:
      e.value = e.props.join(",");
  }
  return Fe(r = ft(e.children, n)) ? e.return = e.value + "{" + r + "}" : "";
}
function Gi(e) {
  var t = Yr(e);
  return function(r, n, o, i) {
    for (var s = "", c = 0; c < t; c++)
      s += e[c](r, n, o, i) || "";
    return s;
  };
}
function Ki(e) {
  return function(t) {
    t.root || (t = t.return) && e(t);
  };
}
var Xi = function(t, r, n) {
  for (var o = 0, i = 0; o = i, i = Ve(), o === 38 && i === 12 && (r[n] = 1), !Dt(i); )
    Re();
  return It(t, De);
}, Ji = function(t, r) {
  var n = -1, o = 44;
  do
    switch (Dt(o)) {
      case 0:
        o === 38 && Ve() === 12 && (r[n] = 1), t[n] += Xi(De - 1, r, n);
        break;
      case 2:
        t[n] += Vt(o);
        break;
      case 4:
        if (o === 44) {
          t[++n] = Ve() === 58 ? "&\f" : "", r[n] = t[n].length;
          break;
        }
      default:
        t[n] += tr(o);
    }
  while (o = Re());
  return t;
}, Zi = function(t, r) {
  return vo(Ji(bo(t), r));
}, Rn = /* @__PURE__ */ new WeakMap(), Qi = function(t) {
  if (!(t.type !== "rule" || !t.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  t.length < 1)) {
    for (var r = t.value, n = t.parent, o = t.column === n.column && t.line === n.line; n.type !== "rule"; )
      if (n = n.parent, !n) return;
    if (!(t.props.length === 1 && r.charCodeAt(0) !== 58 && !Rn.get(n)) && !o) {
      Rn.set(t, !0);
      for (var i = [], s = Zi(r, i), c = n.props, d = 0, p = 0; d < s.length; d++)
        for (var h = 0; h < c.length; h++, p++)
          t.props[p] = i[d] ? s[d].replace(/&\f/g, c[h]) : c[h] + " " + s[d];
    }
  }
}, ea = function(t) {
  if (t.type === "decl") {
    var r = t.value;
    // charcode for l
    r.charCodeAt(0) === 108 && // charcode for b
    r.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
};
function xo(e, t) {
  switch (Ni(e, t)) {
    case 5103:
      return Z + "print-" + e + e;
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
      return Z + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return Z + e + Gt + e + we + e + e;
    case 6828:
    case 4268:
      return Z + e + we + e + e;
    case 6165:
      return Z + e + we + "flex-" + e + e;
    case 5187:
      return Z + e + Q(e, /(\w+).+(:[^]+)/, Z + "box-$1$2" + we + "flex-$1$2") + e;
    case 5443:
      return Z + e + we + "flex-item-" + Q(e, /flex-|-self/, "") + e;
    case 4675:
      return Z + e + we + "flex-line-pack" + Q(e, /align-content|flex-|-self/, "") + e;
    case 5548:
      return Z + e + we + Q(e, "shrink", "negative") + e;
    case 5292:
      return Z + e + we + Q(e, "basis", "preferred-size") + e;
    case 6060:
      return Z + "box-" + Q(e, "-grow", "") + Z + e + we + Q(e, "grow", "positive") + e;
    case 4554:
      return Z + Q(e, /([^-])(transform)/g, "$1" + Z + "$2") + e;
    case 6187:
      return Q(Q(Q(e, /(zoom-|grab)/, Z + "$1"), /(image-set)/, Z + "$1"), e, "") + e;
    case 5495:
    case 3959:
      return Q(e, /(image-set\([^]*)/, Z + "$1$`$1");
    case 4968:
      return Q(Q(e, /(.+:)(flex-)?(.*)/, Z + "box-pack:$3" + we + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + Z + e + e;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return Q(e, /(.+)-inline(.+)/, Z + "$1$2") + e;
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
      if (Fe(e) - 1 - t > 6) switch (Se(e, t + 1)) {
        case 109:
          if (Se(e, t + 4) !== 45) break;
        case 102:
          return Q(e, /(.+:)(.+)-([^]+)/, "$1" + Z + "$2-$3$1" + Gt + (Se(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
        case 115:
          return ~Nr(e, "stretch") ? xo(Q(e, "stretch", "fill-available"), t) + e : e;
      }
      break;
    case 4949:
      if (Se(e, t + 1) !== 115) break;
    case 6444:
      switch (Se(e, Fe(e) - 3 - (~Nr(e, "!important") && 10))) {
        case 107:
          return Q(e, ":", ":" + Z) + e;
        case 101:
          return Q(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + Z + (Se(e, 14) === 45 ? "inline-" : "") + "box$3$1" + Z + "$2$3$1" + we + "$2box$3") + e;
      }
      break;
    case 5936:
      switch (Se(e, t + 11)) {
        case 114:
          return Z + e + we + Q(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return Z + e + we + Q(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return Z + e + we + Q(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return Z + e + we + e + e;
  }
  return e;
}
var ta = function(t, r, n, o) {
  if (t.length > -1 && !t.return) switch (t.type) {
    case Ur:
      t.return = xo(t.value, t.length);
      break;
    case mo:
      return ft([xt(t, {
        value: Q(t.value, "@", "@" + Z)
      })], o);
    case Vr:
      if (t.length) return Li(t.props, function(i) {
        switch (zi(i, /(::plac\w+|:read-\w+)/)) {
          case ":read-only":
          case ":read-write":
            return ft([xt(t, {
              props: [Q(i, /:(read-\w+)/, ":" + Gt + "$1")]
            })], o);
          case "::placeholder":
            return ft([xt(t, {
              props: [Q(i, /:(plac\w+)/, ":" + Z + "input-$1")]
            }), xt(t, {
              props: [Q(i, /:(plac\w+)/, ":" + Gt + "$1")]
            }), xt(t, {
              props: [Q(i, /:(plac\w+)/, we + "input-$1")]
            })], o);
        }
        return "";
      });
  }
}, ra = [ta], na = function(t) {
  var r = t.key;
  if (r === "css") {
    var n = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(n, function(a) {
      var g = a.getAttribute("data-emotion");
      g.indexOf(" ") !== -1 && (document.head.appendChild(a), a.setAttribute("data-s", ""));
    });
  }
  var o = t.stylisPlugins || ra, i = {}, s, c = [];
  s = t.container || document.head, Array.prototype.forEach.call(
    // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll('style[data-emotion^="' + r + ' "]'),
    function(a) {
      for (var g = a.getAttribute("data-emotion").split(" "), w = 1; w < g.length; w++)
        i[g[w]] = !0;
      c.push(a);
    }
  );
  var d, p = [Qi, ea];
  {
    var h, u = [Hi, Ki(function(a) {
      h.insert(a);
    })], l = Gi(p.concat(o, u)), m = function(g) {
      return ft(Yi(g), l);
    };
    d = function(g, w, v, T) {
      h = v, m(g ? g + "{" + w.styles + "}" : w.styles), T && (y.inserted[w.name] = !0);
    };
  }
  var y = {
    key: r,
    sheet: new Ii({
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
    insert: d
  };
  return y.sheet.hydrate(c), y;
};
function oa(e, t) {
  const r = na({
    key: "css",
    prepend: e
  });
  if (t) {
    const n = r.insert;
    r.insert = (...o) => (o[1].styles.match(/^@layer\s+[^{]*$/) || (o[1].styles = `@layer mui {${o[1].styles}}`), n(...o));
  }
  return r;
}
const Or = /* @__PURE__ */ new Map();
function So(e) {
  const {
    injectFirst: t,
    enableCssLayer: r,
    children: n
  } = e, o = le.useMemo(() => {
    const i = `${t}-${r}`;
    if (typeof document == "object" && Or.has(i))
      return Or.get(i);
    const s = oa(t, r);
    return Or.set(i, s), s;
  }, [t, r]);
  return t || r ? /* @__PURE__ */ b(rs, {
    value: o,
    children: n
  }) : n;
}
process.env.NODE_ENV !== "production" && (So.propTypes = {
  /**
   * Your component tree.
   */
  children: W.node,
  /**
   * If true, MUI styles are wrapped in CSS `@layer mui` rule.
   * It helps to override MUI styles when using CSS Modules, Tailwind CSS, plain CSS, or any other styling solution.
   */
  enableCssLayer: W.bool,
  /**
   * By default, the styles are injected last in the <head> element of the page.
   * As a result, they gain more specificity than any other style sheet.
   * If you want to override MUI's styles, set this prop.
   */
  injectFirst: W.bool
});
function sa(e) {
  return e == null || Object.keys(e).length === 0;
}
function wo(e) {
  const {
    styles: t,
    defaultTheme: r = {}
  } = e;
  return /* @__PURE__ */ b(ns, {
    styles: typeof t == "function" ? (o) => t(sa(o) ? r : o) : t
  });
}
process.env.NODE_ENV !== "production" && (wo.propTypes = {
  defaultTheme: W.object,
  styles: W.oneOfType([W.array, W.string, W.object, W.func])
});
/**
 * @mui/styled-engine v5.18.0
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function ia(e, t) {
  const r = ts(e, t);
  return process.env.NODE_ENV !== "production" ? (...n) => {
    const o = typeof e == "string" ? `"${e}"` : "component";
    return n.length === 0 ? console.error([`MUI: Seems like you called \`styled(${o})()\` without a \`style\` argument.`, 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join(`
`)) : n.some((i) => i === void 0) && console.error(`MUI: the styled(${o})(...args) API requires all its args to be defined.`), r(...n);
  } : r;
}
const aa = (e, t) => {
  Array.isArray(e.__emotion_styles) && (e.__emotion_styles = t(e.__emotion_styles));
}, In = [];
function ca(e) {
  return In[0] = e, Di(In);
}
const la = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GlobalStyles: wo,
  StyledEngineProvider: So,
  ThemeContext: os,
  css: ss,
  default: ia,
  internal_processStyles: aa,
  internal_serializeStyles: ca,
  keyframes: is
}, Symbol.toStringTag, { value: "Module" })), ua = /* @__PURE__ */ Ge(la), da = /* @__PURE__ */ Ge(_s), fa = /* @__PURE__ */ Ge(Bs), pa = /* @__PURE__ */ Ge(Fs), ha = ["values", "unit", "step"], ma = (e) => {
  const t = Object.keys(e).map((r) => ({
    key: r,
    val: e[r]
  })) || [];
  return t.sort((r, n) => r.val - n.val), t.reduce((r, n) => ne({}, r, {
    [n.key]: n.val
  }), {});
};
function Eo(e) {
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
  } = e, o = tt(e, ha), i = ma(t), s = Object.keys(i);
  function c(l) {
    return `@media (min-width:${typeof t[l] == "number" ? t[l] : l}${r})`;
  }
  function d(l) {
    return `@media (max-width:${(typeof t[l] == "number" ? t[l] : l) - n / 100}${r})`;
  }
  function p(l, m) {
    const y = s.indexOf(m);
    return `@media (min-width:${typeof t[l] == "number" ? t[l] : l}${r}) and (max-width:${(y !== -1 && typeof t[s[y]] == "number" ? t[s[y]] : m) - n / 100}${r})`;
  }
  function h(l) {
    return s.indexOf(l) + 1 < s.length ? p(l, s[s.indexOf(l) + 1]) : c(l);
  }
  function u(l) {
    const m = s.indexOf(l);
    return m === 0 ? c(s[1]) : m === s.length - 1 ? d(s[m]) : p(l, s[s.indexOf(l) + 1]).replace("@media", "@media not all and");
  }
  return ne({
    keys: s,
    values: i,
    up: c,
    down: d,
    between: p,
    only: h,
    not: u,
    unit: r
  }, o);
}
const ya = {
  borderRadius: 4
}, rt = process.env.NODE_ENV !== "production" ? W.oneOfType([W.number, W.string, W.object, W.array]) : {};
function Tt(e, t) {
  return t ? Be(e, t, {
    clone: !1
    // No need to clone deep, it's way faster.
  }) : e;
}
const qr = {
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
}, Pn = {
  // Sorted ASC by size. That's important.
  // It can't be configured as it's used statically for propTypes.
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (e) => `@media (min-width:${qr[e]}px)`
};
function He(e, t, r) {
  const n = e.theme || {};
  if (Array.isArray(t)) {
    const i = n.breakpoints || Pn;
    return t.reduce((s, c, d) => (s[i.up(i.keys[d])] = r(t[d]), s), {});
  }
  if (typeof t == "object") {
    const i = n.breakpoints || Pn;
    return Object.keys(t).reduce((s, c) => {
      if (Object.keys(i.values || qr).indexOf(c) !== -1) {
        const d = i.up(c);
        s[d] = r(t[c], c);
      } else {
        const d = c;
        s[d] = t[d];
      }
      return s;
    }, {});
  }
  return r(t);
}
function ga(e = {}) {
  var t;
  return ((t = e.keys) == null ? void 0 : t.reduce((n, o) => {
    const i = e.up(o);
    return n[i] = {}, n;
  }, {})) || {};
}
function Mn(e, t) {
  return e.reduce((r, n) => {
    const o = r[n];
    return (!o || Object.keys(o).length === 0) && delete r[n], r;
  }, t);
}
function or(e, t, r = !0) {
  if (!t || typeof t != "string")
    return null;
  if (e && e.vars && r) {
    const n = `vars.${t}`.split(".").reduce((o, i) => o && o[i] ? o[i] : null, e);
    if (n != null)
      return n;
  }
  return t.split(".").reduce((n, o) => n && n[o] != null ? n[o] : null, e);
}
function Kt(e, t, r, n = r) {
  let o;
  return typeof e == "function" ? o = e(r) : Array.isArray(e) ? o = e[r] || n : o = or(e, r) || n, t && (o = t(o, n, e)), o;
}
function me(e) {
  const {
    prop: t,
    cssProperty: r = e.prop,
    themeKey: n,
    transform: o
  } = e, i = (s) => {
    if (s[t] == null)
      return null;
    const c = s[t], d = s.theme, p = or(d, n) || {};
    return He(s, c, (u) => {
      let l = Kt(p, o, u);
      return u === l && typeof u == "string" && (l = Kt(p, o, `${t}${u === "default" ? "" : et(u)}`, u)), r === !1 ? l : {
        [r]: l
      };
    });
  };
  return i.propTypes = process.env.NODE_ENV !== "production" ? {
    [t]: rt
  } : {}, i.filterProps = [t], i;
}
function ba(e) {
  const t = {};
  return (r) => (t[r] === void 0 && (t[r] = e(r)), t[r]);
}
const va = {
  m: "margin",
  p: "padding"
}, xa = {
  t: "Top",
  r: "Right",
  b: "Bottom",
  l: "Left",
  x: ["Left", "Right"],
  y: ["Top", "Bottom"]
}, kn = {
  marginX: "mx",
  marginY: "my",
  paddingX: "px",
  paddingY: "py"
}, Sa = ba((e) => {
  if (e.length > 2)
    if (kn[e])
      e = kn[e];
    else
      return [e];
  const [t, r] = e.split(""), n = va[t], o = xa[r] || "";
  return Array.isArray(o) ? o.map((i) => n + i) : [n + o];
}), sr = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"], ir = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"], wa = [...sr, ...ir];
function Pt(e, t, r, n) {
  var o;
  const i = (o = or(e, t, !1)) != null ? o : r;
  return typeof i == "number" ? (s) => typeof s == "string" ? s : (process.env.NODE_ENV !== "production" && typeof s != "number" && console.error(`MUI: Expected ${n} argument to be a number or a string, got ${s}.`), i * s) : Array.isArray(i) ? (s) => typeof s == "string" ? s : (process.env.NODE_ENV !== "production" && (Number.isInteger(s) ? s > i.length - 1 && console.error([`MUI: The value provided (${s}) overflows.`, `The supported values are: ${JSON.stringify(i)}.`, `${s} > ${i.length - 1}, you need to add the missing values.`].join(`
`)) : console.error([`MUI: The \`theme.${t}\` array type cannot be combined with non integer values.You should either use an integer value that can be used as index, or define the \`theme.${t}\` as a number.`].join(`
`))), i[s]) : typeof i == "function" ? i : (process.env.NODE_ENV !== "production" && console.error([`MUI: The \`theme.${t}\` value (${i}) is invalid.`, "It should be a number, an array or a function."].join(`
`)), () => {
  });
}
function To(e) {
  return Pt(e, "spacing", 8, "spacing");
}
function Mt(e, t) {
  if (typeof t == "string" || t == null)
    return t;
  const r = Math.abs(t), n = e(r);
  return t >= 0 ? n : typeof n == "number" ? -n : `-${n}`;
}
function Ea(e, t) {
  return (r) => e.reduce((n, o) => (n[o] = Mt(t, r), n), {});
}
function Ta(e, t, r, n) {
  if (t.indexOf(r) === -1)
    return null;
  const o = Sa(r), i = Ea(o, n), s = e[r];
  return He(e, s, i);
}
function Co(e, t) {
  const r = To(e.theme);
  return Object.keys(e).map((n) => Ta(e, t, n, r)).reduce(Tt, {});
}
function fe(e) {
  return Co(e, sr);
}
fe.propTypes = process.env.NODE_ENV !== "production" ? sr.reduce((e, t) => (e[t] = rt, e), {}) : {};
fe.filterProps = sr;
function pe(e) {
  return Co(e, ir);
}
pe.propTypes = process.env.NODE_ENV !== "production" ? ir.reduce((e, t) => (e[t] = rt, e), {}) : {};
pe.filterProps = ir;
process.env.NODE_ENV !== "production" && wa.reduce((e, t) => (e[t] = rt, e), {});
function Ca(e = 8) {
  if (e.mui)
    return e;
  const t = To({
    spacing: e
  }), r = (...n) => (process.env.NODE_ENV !== "production" && (n.length <= 4 || console.error(`MUI: Too many arguments provided, expected between 0 and 4, got ${n.length}`)), (n.length === 0 ? [1] : n).map((i) => {
    const s = t(i);
    return typeof s == "number" ? `${s}px` : s;
  }).join(" "));
  return r.mui = !0, r;
}
function ar(...e) {
  const t = e.reduce((n, o) => (o.filterProps.forEach((i) => {
    n[i] = o;
  }), n), {}), r = (n) => Object.keys(n).reduce((o, i) => t[i] ? Tt(o, t[i](n)) : o, {});
  return r.propTypes = process.env.NODE_ENV !== "production" ? e.reduce((n, o) => Object.assign(n, o.propTypes), {}) : {}, r.filterProps = e.reduce((n, o) => n.concat(o.filterProps), []), r;
}
function Me(e) {
  return typeof e != "number" ? e : `${e}px solid`;
}
function Ae(e, t) {
  return me({
    prop: e,
    themeKey: "borders",
    transform: t
  });
}
const _a = Ae("border", Me), $a = Ae("borderTop", Me), Da = Ae("borderRight", Me), Oa = Ae("borderBottom", Me), Ra = Ae("borderLeft", Me), Ia = Ae("borderColor"), Pa = Ae("borderTopColor"), Ma = Ae("borderRightColor"), ka = Ae("borderBottomColor"), Aa = Ae("borderLeftColor"), Na = Ae("outline", Me), za = Ae("outlineColor"), cr = (e) => {
  if (e.borderRadius !== void 0 && e.borderRadius !== null) {
    const t = Pt(e.theme, "shape.borderRadius", 4, "borderRadius"), r = (n) => ({
      borderRadius: Mt(t, n)
    });
    return He(e, e.borderRadius, r);
  }
  return null;
};
cr.propTypes = process.env.NODE_ENV !== "production" ? {
  borderRadius: rt
} : {};
cr.filterProps = ["borderRadius"];
ar(_a, $a, Da, Oa, Ra, Ia, Pa, Ma, ka, Aa, cr, Na, za);
const lr = (e) => {
  if (e.gap !== void 0 && e.gap !== null) {
    const t = Pt(e.theme, "spacing", 8, "gap"), r = (n) => ({
      gap: Mt(t, n)
    });
    return He(e, e.gap, r);
  }
  return null;
};
lr.propTypes = process.env.NODE_ENV !== "production" ? {
  gap: rt
} : {};
lr.filterProps = ["gap"];
const ur = (e) => {
  if (e.columnGap !== void 0 && e.columnGap !== null) {
    const t = Pt(e.theme, "spacing", 8, "columnGap"), r = (n) => ({
      columnGap: Mt(t, n)
    });
    return He(e, e.columnGap, r);
  }
  return null;
};
ur.propTypes = process.env.NODE_ENV !== "production" ? {
  columnGap: rt
} : {};
ur.filterProps = ["columnGap"];
const dr = (e) => {
  if (e.rowGap !== void 0 && e.rowGap !== null) {
    const t = Pt(e.theme, "spacing", 8, "rowGap"), r = (n) => ({
      rowGap: Mt(t, n)
    });
    return He(e, e.rowGap, r);
  }
  return null;
};
dr.propTypes = process.env.NODE_ENV !== "production" ? {
  rowGap: rt
} : {};
dr.filterProps = ["rowGap"];
const La = me({
  prop: "gridColumn"
}), ja = me({
  prop: "gridRow"
}), Wa = me({
  prop: "gridAutoFlow"
}), Fa = me({
  prop: "gridAutoColumns"
}), Ba = me({
  prop: "gridAutoRows"
}), Va = me({
  prop: "gridTemplateColumns"
}), Ua = me({
  prop: "gridTemplateRows"
}), Ya = me({
  prop: "gridTemplateAreas"
}), qa = me({
  prop: "gridArea"
});
ar(lr, ur, dr, La, ja, Wa, Fa, Ba, Va, Ua, Ya, qa);
function pt(e, t) {
  return t === "grey" ? t : e;
}
const Ha = me({
  prop: "color",
  themeKey: "palette",
  transform: pt
}), Ga = me({
  prop: "bgcolor",
  cssProperty: "backgroundColor",
  themeKey: "palette",
  transform: pt
}), Ka = me({
  prop: "backgroundColor",
  themeKey: "palette",
  transform: pt
});
ar(Ha, Ga, Ka);
function Oe(e) {
  return e <= 1 && e !== 0 ? `${e * 100}%` : e;
}
const Xa = me({
  prop: "width",
  transform: Oe
}), Hr = (e) => {
  if (e.maxWidth !== void 0 && e.maxWidth !== null) {
    const t = (r) => {
      var n, o;
      const i = ((n = e.theme) == null || (n = n.breakpoints) == null || (n = n.values) == null ? void 0 : n[r]) || qr[r];
      return i ? ((o = e.theme) == null || (o = o.breakpoints) == null ? void 0 : o.unit) !== "px" ? {
        maxWidth: `${i}${e.theme.breakpoints.unit}`
      } : {
        maxWidth: i
      } : {
        maxWidth: Oe(r)
      };
    };
    return He(e, e.maxWidth, t);
  }
  return null;
};
Hr.filterProps = ["maxWidth"];
const Ja = me({
  prop: "minWidth",
  transform: Oe
}), Za = me({
  prop: "height",
  transform: Oe
}), Qa = me({
  prop: "maxHeight",
  transform: Oe
}), ec = me({
  prop: "minHeight",
  transform: Oe
});
me({
  prop: "size",
  cssProperty: "width",
  transform: Oe
});
me({
  prop: "size",
  cssProperty: "height",
  transform: Oe
});
const tc = me({
  prop: "boxSizing"
});
ar(Xa, Hr, Ja, Za, Qa, ec, tc);
const kt = {
  // borders
  border: {
    themeKey: "borders",
    transform: Me
  },
  borderTop: {
    themeKey: "borders",
    transform: Me
  },
  borderRight: {
    themeKey: "borders",
    transform: Me
  },
  borderBottom: {
    themeKey: "borders",
    transform: Me
  },
  borderLeft: {
    themeKey: "borders",
    transform: Me
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
    transform: Me
  },
  outlineColor: {
    themeKey: "palette"
  },
  borderRadius: {
    themeKey: "shape.borderRadius",
    style: cr
  },
  // palette
  color: {
    themeKey: "palette",
    transform: pt
  },
  bgcolor: {
    themeKey: "palette",
    cssProperty: "backgroundColor",
    transform: pt
  },
  backgroundColor: {
    themeKey: "palette",
    transform: pt
  },
  // spacing
  p: {
    style: pe
  },
  pt: {
    style: pe
  },
  pr: {
    style: pe
  },
  pb: {
    style: pe
  },
  pl: {
    style: pe
  },
  px: {
    style: pe
  },
  py: {
    style: pe
  },
  padding: {
    style: pe
  },
  paddingTop: {
    style: pe
  },
  paddingRight: {
    style: pe
  },
  paddingBottom: {
    style: pe
  },
  paddingLeft: {
    style: pe
  },
  paddingX: {
    style: pe
  },
  paddingY: {
    style: pe
  },
  paddingInline: {
    style: pe
  },
  paddingInlineStart: {
    style: pe
  },
  paddingInlineEnd: {
    style: pe
  },
  paddingBlock: {
    style: pe
  },
  paddingBlockStart: {
    style: pe
  },
  paddingBlockEnd: {
    style: pe
  },
  m: {
    style: fe
  },
  mt: {
    style: fe
  },
  mr: {
    style: fe
  },
  mb: {
    style: fe
  },
  ml: {
    style: fe
  },
  mx: {
    style: fe
  },
  my: {
    style: fe
  },
  margin: {
    style: fe
  },
  marginTop: {
    style: fe
  },
  marginRight: {
    style: fe
  },
  marginBottom: {
    style: fe
  },
  marginLeft: {
    style: fe
  },
  marginX: {
    style: fe
  },
  marginY: {
    style: fe
  },
  marginInline: {
    style: fe
  },
  marginInlineStart: {
    style: fe
  },
  marginInlineEnd: {
    style: fe
  },
  marginBlock: {
    style: fe
  },
  marginBlockStart: {
    style: fe
  },
  marginBlockEnd: {
    style: fe
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
    style: lr
  },
  rowGap: {
    style: dr
  },
  columnGap: {
    style: ur
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
    transform: Oe
  },
  maxWidth: {
    style: Hr
  },
  minWidth: {
    transform: Oe
  },
  height: {
    transform: Oe
  },
  maxHeight: {
    transform: Oe
  },
  minHeight: {
    transform: Oe
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
function rc(...e) {
  const t = e.reduce((n, o) => n.concat(Object.keys(o)), []), r = new Set(t);
  return e.every((n) => r.size === Object.keys(n).length);
}
function nc(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function _o() {
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
      cssProperty: d = r,
      themeKey: p,
      transform: h,
      style: u
    } = c;
    if (n == null)
      return null;
    if (p === "typography" && n === "inherit")
      return {
        [r]: n
      };
    const l = or(o, p) || {};
    return u ? u(s) : He(s, n, (y) => {
      let a = Kt(l, h, y);
      return y === a && typeof y == "string" && (a = Kt(l, h, `${r}${y === "default" ? "" : et(y)}`, y)), d === !1 ? a : {
        [d]: a
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
    const c = (n = i.unstable_sxConfig) != null ? n : kt;
    function d(p) {
      let h = p;
      if (typeof p == "function")
        h = p(i);
      else if (typeof p != "object")
        return p;
      if (!h)
        return null;
      const u = ga(i.breakpoints), l = Object.keys(u);
      let m = u;
      return Object.keys(h).forEach((y) => {
        const a = nc(h[y], i);
        if (a != null)
          if (typeof a == "object")
            if (c[y])
              m = Tt(m, e(y, a, i, c));
            else {
              const g = He({
                theme: i
              }, a, (w) => ({
                [y]: w
              }));
              rc(g, a) ? m[y] = t({
                sx: a,
                theme: i,
                nested: !0
              }) : m = Tt(m, g);
            }
          else
            m = Tt(m, e(y, a, i, c));
      }), !s && i.modularCssLayers ? {
        "@layer sx": Mn(l, m)
      } : Mn(l, m);
    }
    return Array.isArray(o) ? o.map(d) : d(o);
  }
  return t;
}
const fr = _o();
fr.filterProps = ["sx"];
function $o(e, t) {
  const r = this;
  return r.vars && typeof r.getColorSchemeSelector == "function" ? {
    [r.getColorSchemeSelector(e).replace(/(\[[^\]]+\])/, "*:where($1)")]: t
  } : r.palette.mode === e ? t : {};
}
const oc = ["breakpoints", "palette", "spacing", "shape"];
function Do(e = {}, ...t) {
  const {
    breakpoints: r = {},
    palette: n = {},
    spacing: o,
    shape: i = {}
  } = e, s = tt(e, oc), c = Eo(r), d = Ca(o);
  let p = Be({
    breakpoints: c,
    direction: "ltr",
    components: {},
    // Inject component definitions.
    palette: ne({
      mode: "light"
    }, n),
    spacing: d,
    shape: ne({}, ya, i)
  }, s);
  return p.applyStyles = $o, p = t.reduce((h, u) => Be(h, u), p), p.unstable_sxConfig = ne({}, kt, s == null ? void 0 : s.unstable_sxConfig), p.unstable_sx = function(u) {
    return fr({
      sx: u,
      theme: this
    });
  }, p;
}
const sc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Do,
  private_createBreakpoints: Eo,
  unstable_applyStyles: $o
}, Symbol.toStringTag, { value: "Module" })), ic = /* @__PURE__ */ Ge(sc), ac = ["sx"], cc = (e) => {
  var t, r;
  const n = {
    systemProps: {},
    otherProps: {}
  }, o = (t = e == null || (r = e.theme) == null ? void 0 : r.unstable_sxConfig) != null ? t : kt;
  return Object.keys(e).forEach((i) => {
    o[i] ? n.systemProps[i] = e[i] : n.otherProps[i] = e[i];
  }), n;
};
function lc(e) {
  const {
    sx: t
  } = e, r = tt(e, ac), {
    systemProps: n,
    otherProps: o
  } = cc(r);
  let i;
  return Array.isArray(t) ? i = [n, ...t] : typeof t == "function" ? i = (...s) => {
    const c = t(...s);
    return Ze(c) ? ne({}, n, c) : n;
  } : i = ne({}, n, t), ne({}, o, {
    sx: i
  });
}
const uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: fr,
  extendSxProp: lc,
  unstable_createStyleFunctionSx: _o,
  unstable_defaultSxConfig: kt
}, Symbol.toStringTag, { value: "Module" })), dc = /* @__PURE__ */ Ge(uc);
var yt = Qt;
Object.defineProperty(Rt, "__esModule", {
  value: !0
});
var fc = Rt.default = _c;
Rt.shouldForwardProp = Yt;
Rt.systemDefaultTheme = void 0;
var Ie = yt(xi()), Lr = yt(Si()), Xt = Sc(ua), pc = da, hc = yt(fa), mc = yt(pa), yc = yt(ic), gc = yt(dc);
const bc = ["ownerState"], vc = ["variants"], xc = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
function Oo(e) {
  if (typeof WeakMap != "function") return null;
  var t = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (Oo = function(n) {
    return n ? r : t;
  })(e);
}
function Sc(e, t) {
  if (e && e.__esModule) return e;
  if (e === null || typeof e != "object" && typeof e != "function") return { default: e };
  var r = Oo(t);
  if (r && r.has(e)) return r.get(e);
  var n = { __proto__: null }, o = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var i in e) if (i !== "default" && Object.prototype.hasOwnProperty.call(e, i)) {
    var s = o ? Object.getOwnPropertyDescriptor(e, i) : null;
    s && (s.get || s.set) ? Object.defineProperty(n, i, s) : n[i] = e[i];
  }
  return n.default = e, r && r.set(e, n), n;
}
function wc(e) {
  return Object.keys(e).length === 0;
}
function Ec(e) {
  return typeof e == "string" && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  e.charCodeAt(0) > 96;
}
function Yt(e) {
  return e !== "ownerState" && e !== "theme" && e !== "sx" && e !== "as";
}
function An(e, t) {
  return t && e && typeof e == "object" && e.styles && !e.styles.startsWith("@layer") && (e.styles = `@layer ${t}{${String(e.styles)}}`), e;
}
const Tc = Rt.systemDefaultTheme = (0, yc.default)(), Nn = (e) => e && e.charAt(0).toLowerCase() + e.slice(1);
function Wt({
  defaultTheme: e,
  theme: t,
  themeId: r
}) {
  return wc(t) ? e : t[r] || t;
}
function Cc(e) {
  return e ? (t, r) => r[e] : null;
}
function qt(e, t, r) {
  let {
    ownerState: n
  } = t, o = (0, Lr.default)(t, bc);
  const i = typeof e == "function" ? e((0, Ie.default)({
    ownerState: n
  }, o)) : e;
  if (Array.isArray(i))
    return i.flatMap((s) => qt(s, (0, Ie.default)({
      ownerState: n
    }, o), r));
  if (i && typeof i == "object" && Array.isArray(i.variants)) {
    const {
      variants: s = []
    } = i;
    let d = (0, Lr.default)(i, vc);
    return s.forEach((p) => {
      let h = !0;
      if (typeof p.props == "function" ? h = p.props((0, Ie.default)({
        ownerState: n
      }, o, n)) : Object.keys(p.props).forEach((u) => {
        (n == null ? void 0 : n[u]) !== p.props[u] && o[u] !== p.props[u] && (h = !1);
      }), h) {
        Array.isArray(d) || (d = [d]);
        const u = typeof p.style == "function" ? p.style((0, Ie.default)({
          ownerState: n
        }, o, n)) : p.style;
        d.push(r ? An((0, Xt.internal_serializeStyles)(u), r) : u);
      }
    }), d;
  }
  return r ? An((0, Xt.internal_serializeStyles)(i), r) : i;
}
function _c(e = {}) {
  const {
    themeId: t,
    defaultTheme: r = Tc,
    rootShouldForwardProp: n = Yt,
    slotShouldForwardProp: o = Yt
  } = e, i = (s) => (0, gc.default)((0, Ie.default)({}, s, {
    theme: Wt((0, Ie.default)({}, s, {
      defaultTheme: r,
      themeId: t
    }))
  }));
  return i.__mui_systemSx = !0, (s, c = {}) => {
    (0, Xt.internal_processStyles)(s, (E) => E.filter((C) => !(C != null && C.__mui_systemSx)));
    const {
      name: d,
      slot: p,
      skipVariantsResolver: h,
      skipSx: u,
      // TODO v6: remove `lowercaseFirstLetter()` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      overridesResolver: l = Cc(Nn(p))
    } = c, m = (0, Lr.default)(c, xc), y = d && d.startsWith("Mui") || p ? "components" : "custom", a = h !== void 0 ? h : (
      // TODO v6: remove `Root` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      p && p !== "Root" && p !== "root" || !1
    ), g = u || !1;
    let w;
    process.env.NODE_ENV !== "production" && d && (w = `${d}-${Nn(p || "Root")}`);
    let v = Yt;
    p === "Root" || p === "root" ? v = n : p ? v = o : Ec(s) && (v = void 0);
    const T = (0, Xt.default)(s, (0, Ie.default)({
      shouldForwardProp: v,
      label: w
    }, m)), S = (E) => typeof E == "function" && E.__emotion_real !== E || (0, pc.isPlainObject)(E) ? (C) => {
      const O = Wt({
        theme: C.theme,
        defaultTheme: r,
        themeId: t
      });
      return qt(E, (0, Ie.default)({}, C, {
        theme: O
      }), O.modularCssLayers ? y : void 0);
    } : E, f = (E, ...C) => {
      let O = S(E);
      const X = C ? C.map(S) : [];
      d && l && X.push((K) => {
        const I = Wt((0, Ie.default)({}, K, {
          defaultTheme: r,
          themeId: t
        }));
        if (!I.components || !I.components[d] || !I.components[d].styleOverrides)
          return null;
        const V = I.components[d].styleOverrides, ie = {};
        return Object.entries(V).forEach(([F, J]) => {
          ie[F] = qt(J, (0, Ie.default)({}, K, {
            theme: I
          }), I.modularCssLayers ? "theme" : void 0);
        }), l(K, ie);
      }), d && !a && X.push((K) => {
        var I;
        const V = Wt((0, Ie.default)({}, K, {
          defaultTheme: r,
          themeId: t
        })), ie = V == null || (I = V.components) == null || (I = I[d]) == null ? void 0 : I.variants;
        return qt({
          variants: ie
        }, (0, Ie.default)({}, K, {
          theme: V
        }), V.modularCssLayers ? "theme" : void 0);
      }), g || X.push(i);
      const H = X.length - C.length;
      if (Array.isArray(E) && H > 0) {
        const K = new Array(H).fill("");
        O = [...E, ...K], O.raw = [...E.raw, ...K];
      }
      const ue = T(O, ...X);
      if (process.env.NODE_ENV !== "production") {
        let K;
        d && (K = `${d}${(0, hc.default)(p || "")}`), K === void 0 && (K = `Styled(${(0, mc.default)(s)})`), ue.displayName = K;
      }
      return s.muiName && (ue.muiName = s.muiName), ue;
    };
    return T.withConfig && (f.withConfig = T.withConfig), f;
  };
}
function $c(e, t) {
  return ne({
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
var ye = {};
const Dc = /* @__PURE__ */ Ge(Ns), Oc = /* @__PURE__ */ Ge(hi);
var Ro = Qt;
Object.defineProperty(ye, "__esModule", {
  value: !0
});
ye.alpha = ko;
ye.blend = Fc;
ye.colorChannel = void 0;
var Rc = ye.darken = Kr;
ye.decomposeColor = ke;
ye.emphasize = Ao;
var zn = ye.getContrastRatio = Nc;
ye.getLuminance = Jt;
ye.hexToRgb = Io;
ye.hslToRgb = Mo;
var Ic = ye.lighten = Xr;
ye.private_safeAlpha = zc;
ye.private_safeColorChannel = void 0;
ye.private_safeDarken = Lc;
ye.private_safeEmphasize = Wc;
ye.private_safeLighten = jc;
ye.recomposeColor = gt;
ye.rgbToHex = Ac;
var Ln = Ro(Dc), Pc = Ro(Oc);
function Gr(e, t = 0, r = 1) {
  return process.env.NODE_ENV !== "production" && (e < t || e > r) && console.error(`MUI: The value provided ${e} is out of range [${t}, ${r}].`), (0, Pc.default)(e, t, r);
}
function Io(e) {
  e = e.slice(1);
  const t = new RegExp(`.{1,${e.length >= 6 ? 2 : 1}}`, "g");
  let r = e.match(t);
  return r && r[0].length === 1 && (r = r.map((n) => n + n)), r ? `rgb${r.length === 4 ? "a" : ""}(${r.map((n, o) => o < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3).join(", ")})` : "";
}
function Mc(e) {
  const t = e.toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function ke(e) {
  if (e.type)
    return e;
  if (e.charAt(0) === "#")
    return ke(Io(e));
  const t = e.indexOf("("), r = e.substring(0, t);
  if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(r) === -1)
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: Unsupported \`${e}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().` : (0, Ln.default)(9, e));
  let n = e.substring(t + 1, e.length - 1), o;
  if (r === "color") {
    if (n = n.split(" "), o = n.shift(), n.length === 4 && n[3].charAt(0) === "/" && (n[3] = n[3].slice(1)), ["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(o) === -1)
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: unsupported \`${o}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.` : (0, Ln.default)(10, o));
  } else
    n = n.split(",");
  return n = n.map((i) => parseFloat(i)), {
    type: r,
    values: n,
    colorSpace: o
  };
}
const Po = (e) => {
  const t = ke(e);
  return t.values.slice(0, 3).map((r, n) => t.type.indexOf("hsl") !== -1 && n !== 0 ? `${r}%` : r).join(" ");
};
ye.colorChannel = Po;
const kc = (e, t) => {
  try {
    return Po(e);
  } catch {
    return t && process.env.NODE_ENV !== "production" && console.warn(t), e;
  }
};
ye.private_safeColorChannel = kc;
function gt(e) {
  const {
    type: t,
    colorSpace: r
  } = e;
  let {
    values: n
  } = e;
  return t.indexOf("rgb") !== -1 ? n = n.map((o, i) => i < 3 ? parseInt(o, 10) : o) : t.indexOf("hsl") !== -1 && (n[1] = `${n[1]}%`, n[2] = `${n[2]}%`), t.indexOf("color") !== -1 ? n = `${r} ${n.join(" ")}` : n = `${n.join(", ")}`, `${t}(${n})`;
}
function Ac(e) {
  if (e.indexOf("#") === 0)
    return e;
  const {
    values: t
  } = ke(e);
  return `#${t.map((r, n) => Mc(n === 3 ? Math.round(255 * r) : r)).join("")}`;
}
function Mo(e) {
  e = ke(e);
  const {
    values: t
  } = e, r = t[0], n = t[1] / 100, o = t[2] / 100, i = n * Math.min(o, 1 - o), s = (p, h = (p + r / 30) % 12) => o - i * Math.max(Math.min(h - 3, 9 - h, 1), -1);
  let c = "rgb";
  const d = [Math.round(s(0) * 255), Math.round(s(8) * 255), Math.round(s(4) * 255)];
  return e.type === "hsla" && (c += "a", d.push(t[3])), gt({
    type: c,
    values: d
  });
}
function Jt(e) {
  e = ke(e);
  let t = e.type === "hsl" || e.type === "hsla" ? ke(Mo(e)).values : e.values;
  return t = t.map((r) => (e.type !== "color" && (r /= 255), r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4)), Number((0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]).toFixed(3));
}
function Nc(e, t) {
  const r = Jt(e), n = Jt(t);
  return (Math.max(r, n) + 0.05) / (Math.min(r, n) + 0.05);
}
function ko(e, t) {
  return e = ke(e), t = Gr(t), (e.type === "rgb" || e.type === "hsl") && (e.type += "a"), e.type === "color" ? e.values[3] = `/${t}` : e.values[3] = t, gt(e);
}
function zc(e, t, r) {
  try {
    return ko(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Kr(e, t) {
  if (e = ke(e), t = Gr(t), e.type.indexOf("hsl") !== -1)
    e.values[2] *= 1 - t;
  else if (e.type.indexOf("rgb") !== -1 || e.type.indexOf("color") !== -1)
    for (let r = 0; r < 3; r += 1)
      e.values[r] *= 1 - t;
  return gt(e);
}
function Lc(e, t, r) {
  try {
    return Kr(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Xr(e, t) {
  if (e = ke(e), t = Gr(t), e.type.indexOf("hsl") !== -1)
    e.values[2] += (100 - e.values[2]) * t;
  else if (e.type.indexOf("rgb") !== -1)
    for (let r = 0; r < 3; r += 1)
      e.values[r] += (255 - e.values[r]) * t;
  else if (e.type.indexOf("color") !== -1)
    for (let r = 0; r < 3; r += 1)
      e.values[r] += (1 - e.values[r]) * t;
  return gt(e);
}
function jc(e, t, r) {
  try {
    return Xr(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Ao(e, t = 0.15) {
  return Jt(e) > 0.5 ? Kr(e, t) : Xr(e, t);
}
function Wc(e, t, r) {
  try {
    return Ao(e, t);
  } catch {
    return r && process.env.NODE_ENV !== "production" && console.warn(r), e;
  }
}
function Fc(e, t, r, n = 1) {
  const o = (d, p) => Math.round((d ** (1 / n) * (1 - r) + p ** (1 / n) * r) ** n), i = ke(e), s = ke(t), c = [o(i.values[0], s.values[0]), o(i.values[1], s.values[1]), o(i.values[2], s.values[2])];
  return gt({
    type: "rgb",
    values: c
  });
}
const Ot = {
  black: "#000",
  white: "#fff"
}, Bc = {
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
}, at = {
  50: "#f3e5f5",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  700: "#7b1fa2"
}, ct = {
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  700: "#d32f2f",
  800: "#c62828"
}, St = {
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  700: "#f57c00",
  900: "#e65100"
}, lt = {
  50: "#e3f2fd",
  200: "#90caf9",
  400: "#42a5f5",
  700: "#1976d2",
  800: "#1565c0"
}, ut = {
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  700: "#0288d1",
  900: "#01579b"
}, dt = {
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20"
}, Vc = ["mode", "contrastThreshold", "tonalOffset"], jn = {
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
    paper: Ot.white,
    default: Ot.white
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
}, Rr = {
  text: {
    primary: Ot.white,
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
    active: Ot.white,
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
function Wn(e, t, r, n) {
  const o = n.light || n, i = n.dark || n * 1.5;
  e[t] || (e.hasOwnProperty(r) ? e[t] = e[r] : t === "light" ? e.light = Ic(e.main, o) : t === "dark" && (e.dark = Rc(e.main, i)));
}
function Uc(e = "light") {
  return e === "dark" ? {
    main: lt[200],
    light: lt[50],
    dark: lt[400]
  } : {
    main: lt[700],
    light: lt[400],
    dark: lt[800]
  };
}
function Yc(e = "light") {
  return e === "dark" ? {
    main: at[200],
    light: at[50],
    dark: at[400]
  } : {
    main: at[500],
    light: at[300],
    dark: at[700]
  };
}
function qc(e = "light") {
  return e === "dark" ? {
    main: ct[500],
    light: ct[300],
    dark: ct[700]
  } : {
    main: ct[700],
    light: ct[400],
    dark: ct[800]
  };
}
function Hc(e = "light") {
  return e === "dark" ? {
    main: ut[400],
    light: ut[300],
    dark: ut[700]
  } : {
    main: ut[700],
    light: ut[500],
    dark: ut[900]
  };
}
function Gc(e = "light") {
  return e === "dark" ? {
    main: dt[400],
    light: dt[300],
    dark: dt[700]
  } : {
    main: dt[800],
    light: dt[500],
    dark: dt[900]
  };
}
function Kc(e = "light") {
  return e === "dark" ? {
    main: St[400],
    light: St[300],
    dark: St[700]
  } : {
    main: "#ed6c02",
    // closest to orange[800] that pass 3:1.
    light: St[500],
    dark: St[900]
  };
}
function Xc(e) {
  const {
    mode: t = "light",
    contrastThreshold: r = 3,
    tonalOffset: n = 0.2
  } = e, o = tt(e, Vc), i = e.primary || Uc(t), s = e.secondary || Yc(t), c = e.error || qc(t), d = e.info || Hc(t), p = e.success || Gc(t), h = e.warning || Kc(t);
  function u(a) {
    const g = zn(a, Rr.text.primary) >= r ? Rr.text.primary : jn.text.primary;
    if (process.env.NODE_ENV !== "production") {
      const w = zn(a, g);
      w < 3 && console.error([`MUI: The contrast ratio of ${w}:1 for ${g} on ${a}`, "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.", "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"].join(`
`));
    }
    return g;
  }
  const l = ({
    color: a,
    name: g,
    mainShade: w = 500,
    lightShade: v = 300,
    darkShade: T = 700
  }) => {
    if (a = ne({}, a), !a.main && a[w] && (a.main = a[w]), !a.hasOwnProperty("main"))
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${g ? ` (${g})` : ""} provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${w}\` property.` : _t(11, g ? ` (${g})` : "", w));
    if (typeof a.main != "string")
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${g ? ` (${g})` : ""} provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(a.main)}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });` : _t(12, g ? ` (${g})` : "", JSON.stringify(a.main)));
    return Wn(a, "light", v, n), Wn(a, "dark", T, n), a.contrastText || (a.contrastText = u(a.main)), a;
  }, m = {
    dark: Rr,
    light: jn
  };
  return process.env.NODE_ENV !== "production" && (m[t] || console.error(`MUI: The palette mode \`${t}\` is not supported.`)), Be(ne({
    // A collection of common colors.
    common: ne({}, Ot),
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
      color: d,
      name: "info"
    }),
    // The colors used to indicate the successful completion of an action that user triggered.
    success: l({
      color: p,
      name: "success"
    }),
    // The grey colors.
    grey: Bc,
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: r,
    // Takes a background color and returns the text color that maximizes the contrast.
    getContrastText: u,
    // Generate a rich color object.
    augmentColor: l,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: n
  }, m[t]), o);
}
const Jc = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
function Zc(e) {
  return Math.round(e * 1e5) / 1e5;
}
const Fn = {
  textTransform: "uppercase"
}, Bn = '"Roboto", "Helvetica", "Arial", sans-serif';
function Qc(e, t) {
  const r = typeof t == "function" ? t(e) : t, {
    fontFamily: n = Bn,
    // The default font size of the Material Specification.
    fontSize: o = 14,
    // px
    fontWeightLight: i = 300,
    fontWeightRegular: s = 400,
    fontWeightMedium: c = 500,
    fontWeightBold: d = 700,
    // Tell MUI what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize: p = 16,
    // Apply the CSS properties to all the variants.
    allVariants: h,
    pxToRem: u
  } = r, l = tt(r, Jc);
  process.env.NODE_ENV !== "production" && (typeof o != "number" && console.error("MUI: `fontSize` is required to be a number."), typeof p != "number" && console.error("MUI: `htmlFontSize` is required to be a number."));
  const m = o / 14, y = u || ((w) => `${w / p * m}rem`), a = (w, v, T, S, f) => ne({
    fontFamily: n,
    fontWeight: w,
    fontSize: y(v),
    // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
    lineHeight: T
  }, n === Bn ? {
    letterSpacing: `${Zc(S / v)}em`
  } : {}, f, h), g = {
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
    button: a(c, 14, 1.75, 0.4, Fn),
    caption: a(s, 12, 1.66, 0.4),
    overline: a(s, 12, 2.66, 1, Fn),
    // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
    inherit: {
      fontFamily: "inherit",
      fontWeight: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit"
    }
  };
  return Be(ne({
    htmlFontSize: p,
    pxToRem: y,
    fontFamily: n,
    fontSize: o,
    fontWeightLight: i,
    fontWeightRegular: s,
    fontWeightMedium: c,
    fontWeightBold: d
  }, g), l, {
    clone: !1
    // No need to clone deep
  });
}
const el = 0.2, tl = 0.14, rl = 0.12;
function de(...e) {
  return [`${e[0]}px ${e[1]}px ${e[2]}px ${e[3]}px rgba(0,0,0,${el})`, `${e[4]}px ${e[5]}px ${e[6]}px ${e[7]}px rgba(0,0,0,${tl})`, `${e[8]}px ${e[9]}px ${e[10]}px ${e[11]}px rgba(0,0,0,${rl})`].join(",");
}
const nl = ["none", de(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), de(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), de(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), de(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), de(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), de(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), de(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), de(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), de(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), de(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), de(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), de(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), de(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), de(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), de(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), de(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), de(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), de(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), de(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), de(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), de(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), de(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), de(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), de(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)], ol = ["duration", "easing", "delay"], sl = {
  // This is the most common easing curve.
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
}, il = {
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
function Vn(e) {
  return `${Math.round(e)}ms`;
}
function al(e) {
  if (!e)
    return 0;
  const t = e / 36;
  return Math.round((4 + 15 * t ** 0.25 + t / 5) * 10);
}
function cl(e) {
  const t = ne({}, sl, e.easing), r = ne({}, il, e.duration);
  return ne({
    getAutoHeightDuration: al,
    create: (o = ["all"], i = {}) => {
      const {
        duration: s = r.standard,
        easing: c = t.easeInOut,
        delay: d = 0
      } = i, p = tt(i, ol);
      if (process.env.NODE_ENV !== "production") {
        const h = (l) => typeof l == "string", u = (l) => !isNaN(parseFloat(l));
        !h(o) && !Array.isArray(o) && console.error('MUI: Argument "props" must be a string or Array.'), !u(s) && !h(s) && console.error(`MUI: Argument "duration" must be a number or a string but found ${s}.`), h(c) || console.error('MUI: Argument "easing" must be a string.'), !u(d) && !h(d) && console.error('MUI: Argument "delay" must be a number or a string.'), typeof i != "object" && console.error(["MUI: Secong argument of transition.create must be an object.", "Arguments should be either `create('prop1', options)` or `create(['prop1', 'prop2'], options)`"].join(`
`)), Object.keys(p).length !== 0 && console.error(`MUI: Unrecognized argument(s) [${Object.keys(p).join(",")}].`);
      }
      return (Array.isArray(o) ? o : [o]).map((h) => `${h} ${typeof s == "string" ? s : Vn(s)} ${c} ${typeof d == "string" ? d : Vn(d)}`).join(",");
    }
  }, e, {
    easing: t,
    duration: r
  });
}
const ll = {
  mobileStepper: 1e3,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
}, ul = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
function dl(e = {}, ...t) {
  const {
    mixins: r = {},
    palette: n = {},
    transitions: o = {},
    typography: i = {}
  } = e, s = tt(e, ul);
  if (e.vars && // The error should throw only for the root theme creation because user is not allowed to use a custom node `vars`.
  // `generateCssVars` is the closest identifier for checking that the `options` is a result of `extendTheme` with CSS variables so that user can create new theme for nested ThemeProvider.
  e.generateCssVars === void 0)
    throw new Error(process.env.NODE_ENV !== "production" ? "MUI: `vars` is a private field used for CSS variables support.\nPlease use another name." : _t(18));
  const c = Xc(n), d = Do(e);
  let p = Be(d, {
    mixins: $c(d.breakpoints, r),
    palette: c,
    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
    shadows: nl.slice(),
    typography: Qc(c, i),
    transitions: cl(o),
    zIndex: ne({}, ll)
  });
  if (p = Be(p, s), p = t.reduce((h, u) => Be(h, u), p), process.env.NODE_ENV !== "production") {
    const h = ["active", "checked", "completed", "disabled", "error", "expanded", "focused", "focusVisible", "required", "selected"], u = (l, m) => {
      let y;
      for (y in l) {
        const a = l[y];
        if (h.indexOf(y) !== -1 && Object.keys(a).length > 0) {
          if (process.env.NODE_ENV !== "production") {
            const g = Br("", y);
            console.error([`MUI: The \`${m}\` component increases the CSS specificity of the \`${y}\` internal state.`, "You can not override it like this: ", JSON.stringify(l, null, 2), "", `Instead, you need to use the '&.${g}' syntax:`, JSON.stringify({
              root: {
                [`&.${g}`]: a
              }
            }, null, 2), "", "https://mui.com/r/state-classes-guide"].join(`
`));
          }
          l[y] = {};
        }
      }
    };
    Object.keys(p.components).forEach((l) => {
      const m = p.components[l].styleOverrides;
      m && l.indexOf("Mui") === 0 && u(m, l);
    });
  }
  return p.unstable_sxConfig = ne({}, kt, s == null ? void 0 : s.unstable_sxConfig), p.unstable_sx = function(u) {
    return fr({
      sx: u,
      theme: this
    });
  }, p;
}
const fl = dl(), pl = "$$material";
function hl(e) {
  return e !== "ownerState" && e !== "theme" && e !== "sx" && e !== "as";
}
const ml = (e) => hl(e) && e !== "classes", yl = fc({
  themeId: pl,
  defaultTheme: fl,
  rootShouldForwardProp: ml
});
function gl(e) {
  return Br("MuiSvgIcon", e);
}
fi("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
const bl = ["children", "className", "color", "component", "fontSize", "htmlColor", "inheritViewBox", "titleAccess", "viewBox"], vl = (e) => {
  const {
    color: t,
    fontSize: r,
    classes: n
  } = e, o = {
    root: ["root", t !== "inherit" && `color${et(t)}`, `fontSize${et(r)}`]
  };
  return li(o, gl, n);
}, xl = yl("svg", {
  name: "MuiSvgIcon",
  slot: "Root",
  overridesResolver: (e, t) => {
    const {
      ownerState: r
    } = e;
    return [t.root, r.color !== "inherit" && t[`color${et(r.color)}`], t[`fontSize${et(r.fontSize)}`]];
  }
})(({
  theme: e,
  ownerState: t
}) => {
  var r, n, o, i, s, c, d, p, h, u, l, m, y;
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
      medium: ((c = e.typography) == null || (d = c.pxToRem) == null ? void 0 : d.call(c, 24)) || "1.5rem",
      large: ((p = e.typography) == null || (h = p.pxToRem) == null ? void 0 : h.call(p, 35)) || "2.1875rem"
    }[t.fontSize],
    // TODO v5 deprecate, v6 remove for sx
    color: (u = (l = (e.vars || e).palette) == null || (l = l[t.color]) == null ? void 0 : l.main) != null ? u : {
      action: (m = (e.vars || e).palette) == null || (m = m.action) == null ? void 0 : m.active,
      disabled: (y = (e.vars || e).palette) == null || (y = y.action) == null ? void 0 : y.disabled,
      inherit: void 0
    }[t.color]
  };
}), Zt = /* @__PURE__ */ le.forwardRef(function(t, r) {
  const n = vi({
    props: t,
    name: "MuiSvgIcon"
  }), {
    children: o,
    className: i,
    color: s = "inherit",
    component: c = "svg",
    fontSize: d = "medium",
    htmlColor: p,
    inheritViewBox: h = !1,
    titleAccess: u,
    viewBox: l = "0 0 24 24"
  } = n, m = tt(n, bl), y = /* @__PURE__ */ le.isValidElement(o) && o.type === "svg", a = ne({}, n, {
    color: s,
    component: c,
    fontSize: d,
    instanceFontSize: t.fontSize,
    inheritViewBox: h,
    viewBox: l,
    hasSvgAsChild: y
  }), g = {};
  h || (g.viewBox = l);
  const w = vl(a);
  return /* @__PURE__ */ A(xl, ne({
    as: c,
    className: mi(w.root, i),
    focusable: "false",
    color: p,
    "aria-hidden": u ? void 0 : !0,
    role: u ? "img" : void 0,
    ref: r
  }, g, m, y && o.props, {
    ownerState: a,
    children: [y ? o.props.children : o, u ? /* @__PURE__ */ b("title", {
      children: u
    }) : null]
  }));
});
process.env.NODE_ENV !== "production" && (Zt.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Node passed into the SVG element.
   */
  children: W.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: W.object,
  /**
   * @ignore
   */
  className: W.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   * @default 'inherit'
   */
  color: W.oneOfType([W.oneOf(["inherit", "action", "disabled", "primary", "secondary", "error", "info", "success", "warning"]), W.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: W.elementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   * @default 'medium'
   */
  fontSize: W.oneOfType([W.oneOf(["inherit", "large", "medium", "small"]), W.string]),
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor: W.string,
  /**
   * If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
   * prop will be ignored.
   * Useful when you want to reference a custom `component` and have `SvgIcon` pass that
   * `component`'s viewBox to the root node.
   * @default false
   */
  inheritViewBox: W.bool,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this prop.
   */
  shapeRendering: W.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: W.oneOfType([W.arrayOf(W.oneOfType([W.func, W.object, W.bool])), W.func, W.object]),
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: W.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   * @default '0 0 24 24'
   */
  viewBox: W.string
});
Zt.muiName = "SvgIcon";
function Sl(e, t) {
  function r(n, o) {
    return /* @__PURE__ */ b(Zt, ne({
      "data-testid": `${t}Icon`,
      ref: o
    }, n, {
      children: e
    }));
  }
  return process.env.NODE_ENV !== "production" && (r.displayName = `${t}Icon`), r.muiName = Zt.muiName, /* @__PURE__ */ le.memo(/* @__PURE__ */ le.forwardRef(r));
}
const wl = {
  configure: (e) => {
    process.env.NODE_ENV !== "production" && console.warn(["MUI: `ClassNameGenerator` import from `@mui/material/utils` is outdated and might cause unexpected issues.", "", "You should use `import { unstable_ClassNameGenerator } from '@mui/material/className'` instead", "", "The detail of the issue: https://github.com/mui/material-ui/issues/30011#issuecomment-1024993401", "", "The updated documentation: https://mui.com/guides/classname-generator/"].join(`
`)), uo.configure(e);
  }
}, El = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  capitalize: et,
  createChainedFunction: Vs,
  createSvgIcon: Sl,
  debounce: Us,
  deprecatedPropType: Ys,
  isMuiElement: qs,
  ownerDocument: ao,
  ownerWindow: Hs,
  requirePropFactory: Gs,
  setRef: co,
  unstable_ClassNameGenerator: wl,
  unstable_useEnhancedEffect: lo,
  unstable_useId: Xs,
  unsupportedProp: Js,
  useControlled: Zs,
  useEventCallback: Qs,
  useForkRef: ei,
  useIsFocusVisible: ci
}, Symbol.toStringTag, { value: "Module" })), Tl = /* @__PURE__ */ Ge(El);
var Un;
function No() {
  return Un || (Un = 1, function(e) {
    "use client";
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "default", {
      enumerable: !0,
      get: function() {
        return t.createSvgIcon;
      }
    });
    var t = Tl;
  }(br)), br;
}
var Cl = Qt;
Object.defineProperty(jr, "__esModule", {
  value: !0
});
var zo = jr.default = void 0, _l = Cl(No()), Yn = Kn;
zo = jr.default = (0, _l.default)([/* @__PURE__ */ (0, Yn.jsx)("path", {
  d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"
}, "0"), /* @__PURE__ */ (0, Yn.jsx)("path", {
  d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2z"
}, "1")], "ZoomIn");
var Jr = {}, $l = Qt;
Object.defineProperty(Jr, "__esModule", {
  value: !0
});
var Lo = Jr.default = void 0, Dl = $l(No()), Ol = Kn;
Lo = Jr.default = (0, Dl.default)(/* @__PURE__ */ (0, Ol.jsx)("path", {
  d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14M7 9h5v1H7z"
}), "ZoomOut");
const Rl = () => ({
  scale: "day",
  zoomLevel: 1,
  visibleStart: /* @__PURE__ */ new Date(),
  visibleEnd: /* @__PURE__ */ new Date(),
  sidebarWidth: 280,
  rowHeight: 40,
  taskBarHeight: 20,
  selectedTaskIds: [],
  selectedDependencyIds: [],
  criticalTaskIds: [],
  views: [],
  showCriticalPath: !1,
  showBaselines: !1,
  showNonWorkingShading: !0
}), Il = (e) => {
  let t = {
    tasks: [],
    dependencies: [],
    baselines: [],
    resources: [],
    calendars: [],
    viewState: {
      ...Rl()
    },
    ...e
  };
  const r = /* @__PURE__ */ new Set();
  return { getState: () => t, setState: (s) => {
    const c = typeof s == "function" ? s(t) : s, d = {
      ...t,
      ...c,
      viewState: {
        ...t.viewState,
        ...c.viewState ?? {}
      }
    };
    d !== t && (t = d, r.forEach((p) => p(t)));
  }, subscribe: (s) => (r.add(s), () => {
    r.delete(s);
  }) };
}, jo = Il();
function re(e) {
  const t = jo;
  return Ho(
    t.subscribe,
    () => e(t.getState()),
    () => e(t.getState())
  );
}
function At() {
  const e = jo, t = () => {
    const { tasks: r, dependencies: n, viewState: o } = e.getState();
    if (!r.length) {
      e.setState({
        viewState: { ...o, criticalTaskIds: [] }
      });
      return;
    }
    const i = /* @__PURE__ */ new Map();
    r.forEach((v) => i.set(v.id, v));
    const s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    r.forEach((v) => {
      s.set(v.id, []), c.set(v.id, []);
    }), n.forEach((v) => {
      s.has(v.fromTaskId) && c.has(v.toTaskId) && (s.get(v.fromTaskId).push(v.toTaskId), c.get(v.toTaskId).push(v.fromTaskId));
    });
    const d = (v) => {
      const T = v.start, S = v.end;
      if (!T || !S) return 0;
      const f = typeof T == "string" ? new Date(T) : T, E = typeof S == "string" ? new Date(S) : S;
      return Math.max(0, Math.round((E.getTime() - f.getTime()) / (1e3 * 60 * 60 * 24)));
    }, p = /* @__PURE__ */ new Map();
    r.forEach((v) => p.set(v.id, c.get(v.id).length));
    const h = [], u = [];
    for (p.forEach((v, T) => {
      v === 0 && u.push(T);
    }); u.length; ) {
      const v = u.shift();
      h.push(v), s.get(v).forEach((T) => {
        const S = (p.get(T) || 0) - 1;
        p.set(T, S), S === 0 && u.push(T);
      });
    }
    const l = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
    r.forEach((v) => {
      l.set(v.id, -1 / 0), m.set(v.id, null);
    }), h.forEach((v) => {
      const T = i.get(v), S = d(T);
      (c.get(v) || []).length === 0 && l.set(v, S);
      const f = l.get(v) ?? -1 / 0;
      s.get(v).forEach((E) => {
        const C = i.get(E), O = f + d(C);
        O > (l.get(E) ?? -1 / 0) && (l.set(E, O), m.set(E, v));
      });
    });
    let y = null, a = -1 / 0;
    l.forEach((v, T) => {
      v > a && (a = v, y = T);
    });
    const g = [];
    let w = y;
    for (; w; ) {
      g.unshift(w);
      const v = m.get(w);
      w = v === void 0 ? null : v;
    }
    e.setState({
      viewState: { ...o, criticalTaskIds: g }
    });
  };
  return {
    setState: e.setState,
    getState: e.getState,
    recomputeCriticalPath: t
  };
}
const ce = (e) => {
  const t = typeof e == "string" ? new Date(e) : e;
  return Ct(t);
}, Pl = (e, t) => {
  if (e.length === 0) {
    const s = Ct(/* @__PURE__ */ new Date());
    return { start: s, end: xe(s, 30) };
  }
  const r = e.map((s) => ce(s.start)), n = e.map((s) => ce(s.end));
  let o = r.reduce((s, c) => Ko([s, c])), i = n.reduce((s, c) => Xo([s, c]));
  return t === "day" ? (o = xe(o, -3), i = xe(i, 3)) : t === "week" ? (o = xe(o, -14), i = xe(i, 14)) : t === "month" ? (o = xe(o, -30), i = xe(i, 30)) : t === "quarter" && (o = xe(o, -90), i = xe(i, 90)), { start: Ct(o), end: wt(i) };
}, Ml = (e, t, r) => {
  const n = [];
  let o = Ct(e);
  const i = Ct(t);
  for (; o <= i; )
    if (r === "day") {
      const s = o, c = wt(o);
      n.push({ start: s, end: c }), o = xe(o, 1);
    } else if (r === "week") {
      const s = o, c = wt(xe(o, 6));
      n.push({ start: s, end: c }), o = xe(o, 7);
    } else if (r === "month") {
      const s = new Date(o.getFullYear(), o.getMonth(), 1), c = new Date(o.getFullYear(), o.getMonth() + 1, 1), d = wt(xe(c, -1));
      n.push({ start: s, end: d }), o = c;
    } else {
      const s = Math.floor(o.getMonth() / 3), c = new Date(o.getFullYear(), s * 3, 1), d = new Date(o.getFullYear(), (s + 1) * 3, 1), p = wt(xe(d, -1));
      n.push({ start: c, end: p }), o = d;
    }
  return n;
}, pr = () => {
  const { setState: e } = At(), t = re((y) => y.tasks), r = re((y) => y.viewState), { scale: n, zoomLevel: o, visibleStart: i, visibleEnd: s } = r, c = je(() => Pl(t, n), [t, n]), d = i || c.start, p = s || c.end, h = je(
    () => Ml(d, p, n),
    [d, p, n]
  ), u = yr(
    (y) => {
      e((a) => ({
        viewState: {
          ...a.viewState,
          scale: y,
          visibleStart: c.start,
          visibleEnd: c.end
        }
      }));
    },
    [e, c.start, c.end]
  ), l = yr(
    (y) => {
      e((a) => {
        const g = a.viewState.zoomLevel, w = typeof y == "function" ? y(g) : y, v = Math.min(Math.max(w, 0.25), 4);
        return {
          viewState: {
            ...a.viewState,
            zoomLevel: v
          }
        };
      });
    },
    [e]
  ), m = yr(
    (y, a) => {
      e((g) => ({
        viewState: {
          ...g.viewState,
          visibleStart: y,
          visibleEnd: a
        }
      }));
    },
    [e]
  );
  return {
    scale: n,
    zoomLevel: o,
    visibleStart: d,
    visibleEnd: p,
    timelineUnits: h,
    setScale: u,
    setZoomLevel: l,
    setVisibleRange: m
  };
}, kl = () => {
  const {
    scale: e,
    zoomLevel: t,
    visibleStart: r,
    visibleEnd: n,
    timelineUnits: o,
    setScale: i,
    setZoomLevel: s
  } = pr(), c = re((S) => S.viewState.showBaselines), d = re((S) => S.viewState.showCriticalPath), p = re((S) => S.viewState.statusFilter), h = re((S) => S.viewState.textSearch), u = re((S) => S.viewState.views), l = re((S) => S.viewState.activeViewId), { setState: m } = At(), y = (S, f) => {
    f && i(f);
  }, a = () => s((S) => S * 1.25), g = () => s((S) => S / 1.25), w = `${st(r, "MMM dd, yyyy")} – ${st(n, "MMM dd, yyyy")}`, v = (S) => {
    const f = u.find((E) => E.id === S);
    f && m((E) => ({
      ...E,
      viewState: {
        ...E.viewState,
        ...f.state,
        activeViewId: S
      }
    }));
  }, T = () => {
    var f;
    const S = (f = prompt("View name")) == null ? void 0 : f.trim();
    S && m((E) => {
      const C = E.viewState, O = `${Date.now()}`, X = [
        ...C.views,
        {
          id: O,
          name: S,
          scope: "personal",
          state: {
            scale: C.scale,
            zoomLevel: C.zoomLevel,
            statusFilter: C.statusFilter,
            textSearch: C.textSearch,
            showBaselines: C.showBaselines,
            showCriticalPath: C.showCriticalPath
          }
        }
      ];
      return {
        viewState: {
          ...C,
          views: X,
          activeViewId: O
        }
      };
    });
  };
  return /* @__PURE__ */ A(
    be,
    {
      sx: {
        borderBottom: 1,
        borderColor: "divider",
        px: 2,
        py: 1,
        bgcolor: "background.paper"
      },
      children: [
        /* @__PURE__ */ A(Et, { direction: "row", justifyContent: "space-between", alignItems: "center", spacing: 2, children: [
          /* @__PURE__ */ A(Et, { direction: "row", spacing: 2, alignItems: "center", children: [
            /* @__PURE__ */ b(Ce, { variant: "subtitle2", color: "text.secondary", children: "Timeline" }),
            /* @__PURE__ */ A(
              Jo,
              {
                color: "primary",
                size: "small",
                exclusive: !0,
                value: e,
                onChange: y,
                children: [
                  /* @__PURE__ */ b(zt, { value: "day", children: "Day" }),
                  /* @__PURE__ */ b(zt, { value: "week", children: "Week" }),
                  /* @__PURE__ */ b(zt, { value: "month", children: "Month" }),
                  /* @__PURE__ */ b(zt, { value: "quarter", children: "Quarter" })
                ]
              }
            ),
            /* @__PURE__ */ A(en, { size: "small", sx: { ml: 2, minWidth: 160 }, children: [
              /* @__PURE__ */ b(tn, { id: "view-select-label", children: "View" }),
              /* @__PURE__ */ b(
                rn,
                {
                  labelId: "view-select-label",
                  label: "View",
                  value: l ?? "",
                  displayEmpty: !0,
                  onChange: (S) => {
                    const f = S.target.value;
                    f && v(f);
                  },
                  renderValue: (S) => {
                    if (!S) return "Default";
                    const f = u.find((E) => E.id === S);
                    return (f == null ? void 0 : f.name) ?? "Default";
                  },
                  children: u.map((S) => /* @__PURE__ */ b(vt, { value: S.id, children: S.name }, S.id))
                }
              )
            ] }),
            /* @__PURE__ */ b(gr, { size: "small", sx: { ml: 1 }, onClick: T, children: /* @__PURE__ */ b(Ce, { variant: "caption", children: "Save" }) }),
            /* @__PURE__ */ A(en, { size: "small", sx: { ml: 2, minWidth: 140 }, children: [
              /* @__PURE__ */ b(tn, { id: "status-filter-label", children: "Status" }),
              /* @__PURE__ */ A(
                rn,
                {
                  labelId: "status-filter-label",
                  label: "Status",
                  multiple: !0,
                  value: p ?? [],
                  onChange: (S) => {
                    const f = S.target.value;
                    m((E) => ({
                      ...E,
                      viewState: {
                        ...E.viewState,
                        statusFilter: f.length ? f : void 0
                      }
                    }));
                  },
                  renderValue: (S) => S.join(", ") || "All",
                  children: [
                    /* @__PURE__ */ b(vt, { value: "NotStarted", children: "NotStarted" }),
                    /* @__PURE__ */ b(vt, { value: "InProgress", children: "InProgress" }),
                    /* @__PURE__ */ b(vt, { value: "Blocked", children: "Blocked" }),
                    /* @__PURE__ */ b(vt, { value: "Done", children: "Done" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ b(
              Zo,
              {
                size: "small",
                sx: { ml: 2, width: 200 },
                label: "Search",
                value: h ?? "",
                onChange: (S) => m((f) => ({
                  ...f,
                  viewState: {
                    ...f.viewState,
                    textSearch: S.target.value || void 0
                  }
                }))
              }
            )
          ] }),
          /* @__PURE__ */ A(Et, { direction: "row", spacing: 1, alignItems: "center", children: [
            /* @__PURE__ */ b(gr, { size: "small", onClick: g, children: /* @__PURE__ */ b(Lo, { fontSize: "small" }) }),
            /* @__PURE__ */ A(Ce, { variant: "caption", color: "text.secondary", children: [
              Math.round(t * 100),
              "%"
            ] }),
            /* @__PURE__ */ b(gr, { size: "small", onClick: a, children: /* @__PURE__ */ b(zo, { fontSize: "small" }) }),
            /* @__PURE__ */ b(
              nn,
              {
                sx: { ml: 2 },
                control: /* @__PURE__ */ b(
                  on,
                  {
                    size: "small",
                    checked: c,
                    onChange: (S, f) => m((E) => ({
                      ...E,
                      viewState: {
                        ...E.viewState,
                        showBaselines: f
                      }
                    }))
                  }
                ),
                label: "Baselines"
              }
            ),
            /* @__PURE__ */ b(
              nn,
              {
                sx: { ml: 1 },
                control: /* @__PURE__ */ b(
                  on,
                  {
                    size: "small",
                    checked: d,
                    onChange: (S, f) => m((E) => ({
                      ...E,
                      viewState: {
                        ...E.viewState,
                        showCriticalPath: f
                      }
                    }))
                  }
                ),
                label: "Critical path"
              }
            )
          ] }),
          /* @__PURE__ */ b(Ce, { variant: "caption", color: "text.secondary", children: w })
        ] }),
        /* @__PURE__ */ b(
          be,
          {
            sx: {
              mt: 1,
              display: "flex",
              overflow: "hidden"
            },
            children: o.map((S, f) => /* @__PURE__ */ b(
              be,
              {
                sx: {
                  flex: 1,
                  minWidth: 80,
                  borderRight: 1,
                  borderColor: "divider",
                  px: 1,
                  py: 0.5
                },
                children: /* @__PURE__ */ b(Ce, { variant: "caption", color: "text.secondary", children: st(S.start, e === "day" ? "MMM dd" : e === "week" ? "wo" : e === "month" ? "MMM yyyy" : "'Q'Q yyyy") })
              },
              f
            ))
          }
        )
      ]
    }
  );
}, Ft = 32, qn = 8, Al = (e) => [...e].sort((t, r) => {
  const n = t.start ? ce(t.start).getTime() : 0, o = r.start ? ce(r.start).getTime() : 0;
  return n !== o ? n - o : t.name.localeCompare(r.name);
}), Hn = (e, t) => t.findIndex((r) => r.id === e.id), Nl = () => {
  const e = re((f) => f.tasks), t = re((f) => f.baselines), r = re((f) => f.dependencies), n = re((f) => f.viewState.selectedTaskIds), o = re((f) => f.viewState.criticalTaskIds ?? []), i = re((f) => f.viewState.showCriticalPath), s = re((f) => f.viewState.showBaselines), c = re((f) => f.viewState.statusFilter), d = re((f) => f.viewState.textSearch), { setState: p, recomputeCriticalPath: h } = At(), { visibleStart: u, visibleEnd: l, scale: m } = pr(), { orderedTasks: y, totalDays: a } = je(() => {
    const f = e.filter((O) => {
      if (c && c.length && O.status && !c.includes(O.status))
        return !1;
      if (d && d.trim()) {
        const X = d.toLowerCase();
        if (!O.name.toLowerCase().includes(X)) return !1;
      }
      return !0;
    }), E = Al(f), C = Ye(l, u) || 1;
    return { orderedTasks: E, totalDays: C };
  }, [e, u, l]), g = je(() => {
    switch (m) {
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
  }, [m]), w = a * g, v = Le(null), T = (f) => {
    if (w === 0) return 0;
    const E = f / w;
    return Math.round(E * a);
  };
  qe.useEffect(() => {
    h();
  }, [e, r, h]);
  const S = () => {
    const f = v.current;
    if (!f || !f.taskId) return;
    const E = f.taskId;
    v.current = null, p((C) => {
      let O = [...C.tasks];
      const X = r ?? [], H = (U) => O.find((N) => N.id === U), ue = (U, N) => {
        if (!U.end || !N.start || !N.end) return N;
        const x = ce(U.end), _ = ce(N.start), D = ce(N.end);
        if (_ > x) return N;
        const P = Math.max(1, Ye(D, _)), R = new Date(x);
        R.setDate(R.getDate() + 1);
        const k = new Date(R);
        return k.setDate(k.getDate() + P), { ...N, start: R, end: k };
      }, K = (U, N) => {
        if (!U.start || !N.start || !N.end) return N;
        const x = ce(U.start), _ = ce(N.start), D = ce(N.end);
        if (_ >= x) return N;
        const P = Math.max(1, Ye(D, _)), R = x, k = new Date(R);
        return k.setDate(k.getDate() + P), { ...N, start: R, end: k };
      }, I = (U, N) => {
        if (!U.end || !N.start || !N.end) return N;
        const x = ce(U.end), _ = ce(N.start), D = ce(N.end);
        if (D >= x) return N;
        const P = Math.max(1, Ye(D, _)), R = x, k = new Date(R);
        return k.setDate(k.getDate() - P), { ...N, start: k, end: R };
      }, V = (U, N) => {
        if (!U.start || !N.start || !N.end) return N;
        const x = ce(U.start), _ = ce(N.start), D = ce(N.end);
        if (D >= x) return N;
        const P = Math.max(1, Ye(D, _)), R = x, k = new Date(R);
        return k.setDate(k.getDate() - P), { ...N, start: k, end: R };
      }, ie = (U, N, x) => {
        switch (U.type) {
          case "FS":
            return ue(N, x);
          case "SS":
            return K(N, x);
          case "FF":
            return I(N, x);
          case "SF":
            return V(N, x);
          default:
            return x;
        }
      }, F = [E], J = /* @__PURE__ */ new Set();
      for (; F.length; ) {
        const U = F.shift();
        if (J.has(U)) continue;
        J.add(U);
        const N = H(U);
        if (!N) continue;
        const x = X.filter((_) => _.fromTaskId === U);
        x.length && x.forEach((_) => {
          const D = H(_.toTaskId);
          if (!D) return;
          const P = ie(_, N, D);
          P !== D && (O = O.map((R) => R.id === P.id ? P : R), F.push(P.id));
        });
      }
      return {
        ...C,
        tasks: O
      };
    });
  };
  return qe.useEffect(() => {
    const f = (C) => {
      const O = v.current;
      if (!O || !O.taskId || !O.mode) return;
      const X = C.clientX - O.startX, H = T(X);
      H && p((ue) => {
        const K = ue.tasks.map((I) => {
          if (I.id !== O.taskId || !I.start || !I.end) return I;
          const V = ce(I.start), ie = ce(I.end);
          if (O.mode === "move") {
            const F = new Date(O.originalStart);
            F.setDate(F.getDate() + H);
            const J = new Date(O.originalEnd);
            return J.setDate(J.getDate() + H), { ...I, start: F, end: J };
          }
          if (O.mode === "resize-start") {
            const F = new Date(O.originalStart);
            return F.setDate(F.getDate() + H), F >= ie ? I : { ...I, start: F };
          }
          if (O.mode === "resize-end") {
            const F = new Date(O.originalEnd);
            return F.setDate(F.getDate() + H), F <= V ? I : { ...I, end: F };
          }
          return I;
        });
        return { ...ue, tasks: K };
      });
    }, E = () => {
      v.current && (S(), window.removeEventListener("mousemove", f), window.removeEventListener("mouseup", E));
    };
    return v.current && (window.addEventListener("mousemove", f), window.addEventListener("mouseup", E)), () => {
      window.removeEventListener("mousemove", f), window.removeEventListener("mouseup", E);
    };
  }, [p, a, w]), /* @__PURE__ */ A(
    be,
    {
      sx: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none"
      },
      children: [
        s && t.length > 0 && y.map((f) => {
          const C = t[0].taskSnapshots.find((U) => U.taskId === f.id);
          if (!C) return null;
          const O = ce(C.start), X = ce(C.end), H = O < u ? u : O, ue = X > l ? l : X, K = Ye(H, u), I = Math.max(1, Ye(ue, H)), V = K / a * w, ie = I / a * w, J = Hn(f, y) * (Ft + qn) + Ft / 2;
          return /* @__PURE__ */ b(
            be,
            {
              sx: {
                position: "absolute",
                left: V,
                top: J,
                width: ie,
                height: 4,
                borderRadius: 2,
                bgcolor: "rgba(148,163,184,0.9)",
                pointerEvents: "none",
                transform: "translateY(-50%)"
              }
            },
            `${f.id}-baseline`
          );
        }),
        y.map((f) => {
          if (!f.start || !f.end) return null;
          const E = ce(f.start), C = ce(f.end), O = E < u ? u : E, X = C > l ? l : C, H = Ye(O, u), ue = Math.max(1, Ye(X, O)), K = H / a * w, I = ue / a * w, ie = Hn(f, y) * (Ft + qn), F = f.status, J = i && o.includes(f.id), U = J ? "#ef4444" : F === "Done" ? "#10b981" : F === "InProgress" ? "#3b82f6" : "#6b7280", N = n.includes(f.id), x = (D) => {
            D.button === 0 && (D.stopPropagation(), v.current = {
              mode: "move",
              taskId: f.id,
              startX: D.clientX,
              originalStart: E,
              originalEnd: C
            });
          }, _ = (D, P) => {
            D.button === 0 && (D.stopPropagation(), v.current = {
              mode: P,
              taskId: f.id,
              startX: D.clientX,
              originalStart: E,
              originalEnd: C
            });
          };
          return /* @__PURE__ */ b(Jn, { title: f.name, placement: "top", children: /* @__PURE__ */ A(
            be,
            {
              sx: {
                position: "absolute",
                left: K,
                top: ie,
                width: I,
                height: Ft,
                borderRadius: 1,
                bgcolor: U,
                border: N ? "2px solid #0ea5e9" : J ? "2px solid rgba(239,68,68,0.9)" : "1px solid rgba(15,23,42,0.25)",
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
              onClick: (D) => {
                D.stopPropagation(), p((P) => ({
                  ...P,
                  viewState: {
                    ...P.viewState,
                    selectedTaskIds: [f.id]
                  }
                }));
              },
              onMouseDown: x,
              children: [
                /* @__PURE__ */ b(
                  be,
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
                    onMouseDown: (D) => _(D, "resize-start")
                  }
                ),
                f.name,
                /* @__PURE__ */ b(
                  be,
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
                    onMouseDown: (D) => _(D, "resize-end")
                  }
                )
              ]
            }
          ) }, f.id);
        })
      ]
    }
  );
}, Gn = 32, zl = 8, Ll = (e) => [...e].sort((t, r) => {
  const n = t.start ? ce(t.start).getTime() : 0, o = r.start ? ce(r.start).getTime() : 0;
  return n !== o ? n - o : t.name.localeCompare(r.name);
}), jl = () => {
  const e = re((u) => u.tasks), t = re((u) => u.dependencies), r = re((u) => u.viewState.selectedDependencyIds), { setState: n } = At(), { visibleStart: o, visibleEnd: i, scale: s } = pr(), { positions: c, totalWidth: d, totalDays: p } = je(() => {
    const u = Ll(e), l = Math.max(1, (i.getTime() - o.getTime()) / (1e3 * 60 * 60 * 24)), m = (() => {
      switch (s) {
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
    })(), y = l * m, a = /* @__PURE__ */ new Map();
    return u.forEach((g, w) => {
      if (!g.start || !g.end) return;
      const v = ce(g.start), T = ce(g.end), S = v < o ? o : v, f = T > i ? i : T, E = (S.getTime() - o.getTime()) / (1e3 * 60 * 60 * 24), C = Math.max(1, (f.getTime() - S.getTime()) / (1e3 * 60 * 60 * 24)), O = E / l * y, X = C / l * y, H = w * (Gn + zl) + Gn / 2;
      a.set(g.id, {
        taskId: g.id,
        left: O,
        top: H,
        width: X
      });
    }), { positions: a, totalWidth: y, totalDays: l };
  }, [e, o, i, s]);
  if (!t.length || !c.size)
    return null;
  const h = "#9ca3af";
  return /* @__PURE__ */ b(
    be,
    {
      sx: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none"
      },
      children: /* @__PURE__ */ A(
        "svg",
        {
          width: "100%",
          height: "100%",
          style: { position: "absolute", inset: 0, overflow: "visible" },
          children: [
            /* @__PURE__ */ b("defs", { children: /* @__PURE__ */ b(
              "marker",
              {
                id: "gantt-arrow",
                markerWidth: "8",
                markerHeight: "8",
                refX: "7",
                refY: "4",
                orient: "auto",
                markerUnits: "strokeWidth",
                children: /* @__PURE__ */ b("path", { d: "M0,0 L8,4 L0,8 z", fill: h })
              }
            ) }),
            t.map((u) => {
              const l = c.get(u.fromTaskId), m = c.get(u.toTaskId);
              if (!l || !m) return null;
              const y = l.left + l.width, a = l.top, g = m.left, w = m.top, v = (y + g) / 2, T = r.includes(u.id), S = (E) => {
                E.stopPropagation(), n((C) => ({
                  ...C,
                  viewState: {
                    ...C.viewState,
                    selectedDependencyIds: [u.id]
                  }
                }));
              }, f = (() => {
                const E = e.find((O) => O.id === u.fromTaskId), C = e.find((O) => O.id === u.toTaskId);
                return `${(E == null ? void 0 : E.name) ?? u.fromTaskId} → ${(C == null ? void 0 : C.name) ?? u.toTaskId} (${u.type})`;
              })();
              return /* @__PURE__ */ b(Jn, { title: f, arrow: !0, children: /* @__PURE__ */ b(
                "path",
                {
                  d: `M ${y} ${a} C ${v} ${a}, ${v} ${w}, ${g} ${w}`,
                  fill: "none",
                  stroke: T ? "#2563eb" : h,
                  strokeWidth: T ? 2.5 : 1.5,
                  markerEnd: "url(#gantt-arrow)",
                  style: { cursor: "pointer", pointerEvents: "stroke" },
                  onClick: S
                }
              ) }, u.id);
            })
          ]
        }
      )
    }
  );
}, Wl = 80, Fl = () => {
  const { timelineUnits: e } = pr();
  return /* @__PURE__ */ A(
    be,
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
          be,
          {
            sx: {
              flex: 1,
              minWidth: Wl,
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
        /* @__PURE__ */ b(jl, {}),
        /* @__PURE__ */ b(Nl, {})
      ]
    }
  );
}, Bl = (e) => {
  const t = /* @__PURE__ */ new Map(), r = [];
  return e.forEach((n) => {
    t.set(n.id, { ...n, children: [] });
  }), t.forEach((n) => {
    n.parentId && t.has(n.parentId) ? t.get(n.parentId).children.push(n) : r.push(n);
  }), r;
}, Wo = (e, t, r, n, o, i = 0) => e.map((s) => {
  const c = t.includes(s.id), d = n && r.includes(s.id);
  return /* @__PURE__ */ A(qe.Fragment, { children: [
    /* @__PURE__ */ b(
      Zn,
      {
        sx: {
          pl: 2 + i * 2,
          bgcolor: c ? "action.selected" : "transparent",
          cursor: "pointer"
        },
        "data-task-id": s.id,
        onClick: () => o(s.id),
        children: /* @__PURE__ */ b(
          Qn,
          {
            primary: /* @__PURE__ */ b(be, { display: "flex", alignItems: "center", gap: 1, children: /* @__PURE__ */ b(
              Ce,
              {
                variant: "body2",
                fontWeight: s.parentId ? 400 : 600,
                color: d ? "error.main" : "inherit",
                children: s.name
              }
            ) }),
            secondary: s.start && s.end ? `${new Date(s.start).toLocaleDateString()} - ${new Date(s.end).toLocaleDateString()}` : void 0
          }
        )
      }
    ),
    s.children && s.children.length > 0 && Wo(s.children, t, r, n, o, i + 1)
  ] }, s.id);
}), Vl = ({ width: e = 260 }) => {
  const t = re((h) => h.tasks), r = re((h) => h.viewState.selectedTaskIds), n = re((h) => h.viewState.criticalTaskIds ?? []), o = re((h) => h.viewState.showCriticalPath), i = re((h) => h.viewState.statusFilter), s = re((h) => h.viewState.textSearch), { setState: c } = At(), d = je(() => {
    const h = t.filter((u) => {
      if (i && i.length && u.status && !i.includes(u.status))
        return !1;
      if (s && s.trim()) {
        const l = s.toLowerCase();
        if (!u.name.toLowerCase().includes(l)) return !1;
      }
      return !0;
    });
    return Bl(h);
  }, [t, i, s]), p = (h) => {
    c((u) => ({
      ...u,
      viewState: {
        ...u.viewState,
        selectedTaskIds: [h]
      }
    }));
  };
  return /* @__PURE__ */ A(
    be,
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
        /* @__PURE__ */ b(be, { px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)", children: /* @__PURE__ */ b(Ce, { variant: "subtitle2", color: "text.secondary", children: "Tasks" }) }),
        /* @__PURE__ */ b(Qo, { dense: !0, disablePadding: !0, children: d.length === 0 ? /* @__PURE__ */ b(Zn, { children: /* @__PURE__ */ b(Qn, { primary: /* @__PURE__ */ b(Ce, { variant: "body2", color: "text.secondary", children: "No tasks" }) }) }) : Wo(d, r, n, o, p) })
      ]
    }
  );
}, Ul = () => {
  const e = re((i) => i.tasks), t = re((i) => i.viewState.statusFilter), r = re((i) => i.viewState.textSearch), { totals: n, byAssignee: o } = je(() => {
    const i = e.filter((m) => {
      if (t && t.length && m.status && !t.includes(m.status))
        return !1;
      if (r && r.trim()) {
        const y = r.toLowerCase();
        if (!m.name.toLowerCase().includes(y)) return !1;
      }
      return !0;
    });
    let s = 0, c = 0, d = 0, p = 0;
    const h = /* @__PURE__ */ new Map();
    i.forEach((m) => {
      const y = m.estimatedHours ?? 0, a = m.actualHours ?? 0, g = m.hourlyRate ?? 0, w = y * g, v = a * g;
      s += y, c += a, d += w, p += v, (m.assignees ?? []).forEach((T) => {
        const S = String(T), f = h.get(S) ?? {
          estimatedHours: 0,
          actualHours: 0,
          estimatedCost: 0,
          actualCost: 0
        };
        f.estimatedHours += y, f.actualHours += a, f.estimatedCost += w, f.actualCost += v, h.set(S, f);
      });
    });
    const u = {
      totalEstimatedHours: s,
      totalActualHours: c,
      totalEstimatedCost: d,
      totalActualCost: p
    }, l = Array.from(h.entries()).map(([m, y]) => ({
      assigneeId: m,
      ...y
    }));
    return { totals: u, byAssignee: l };
  }, [e, t, r]);
  return e.length ? /* @__PURE__ */ b(be, { sx: { px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)", bgcolor: "background.paper" }, children: /* @__PURE__ */ A(Et, { direction: "row", spacing: 4, alignItems: "flex-start", justifyContent: "space-between", children: [
    /* @__PURE__ */ A(be, { children: [
      /* @__PURE__ */ b(Ce, { variant: "subtitle2", color: "text.secondary", children: "Time & Cost (visible tasks)" }),
      /* @__PURE__ */ A(Ce, { variant: "body2", color: "text.secondary", children: [
        "Est: ",
        n.totalEstimatedHours.toFixed(1),
        "h · ",
        n.totalEstimatedCost.toFixed(2)
      ] }),
      /* @__PURE__ */ A(Ce, { variant: "body2", color: "text.secondary", children: [
        "Act: ",
        n.totalActualHours.toFixed(1),
        "h · ",
        n.totalActualCost.toFixed(2)
      ] })
    ] }),
    o.length > 0 && /* @__PURE__ */ A(be, { sx: { flex: 1 }, children: [
      /* @__PURE__ */ b(Ce, { variant: "subtitle2", color: "text.secondary", children: "By assignee" }),
      /* @__PURE__ */ b(Et, { direction: "row", spacing: 3, flexWrap: "wrap", children: o.map((i) => /* @__PURE__ */ A(be, { sx: { minWidth: 140 }, children: [
        /* @__PURE__ */ b(Ce, { variant: "body2", fontWeight: 500, children: i.assigneeId }),
        /* @__PURE__ */ A(Ce, { variant: "caption", color: "text.secondary", children: [
          "Est: ",
          i.estimatedHours.toFixed(1),
          "h · ",
          i.estimatedCost.toFixed(2)
        ] }),
        /* @__PURE__ */ b("br", {}),
        /* @__PURE__ */ A(Ce, { variant: "caption", color: "text.secondary", children: [
          "Act: ",
          i.actualHours.toFixed(1),
          "h · ",
          i.actualCost.toFixed(2)
        ] })
      ] }, i.assigneeId)) })
    ] })
  ] }) }) : null;
}, tu = ({ height: e = 480 }) => /* @__PURE__ */ A(
  es,
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
      /* @__PURE__ */ b(Ul, {}),
      /* @__PURE__ */ b(kl, {}),
      /* @__PURE__ */ A(
        be,
        {
          sx: {
            display: "flex",
            flex: 1,
            position: "relative",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ b(Vl, {}),
            /* @__PURE__ */ b(
              be,
              {
                sx: {
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto"
                },
                children: /* @__PURE__ */ b(Fl, {})
              }
            )
          ]
        }
      )
    ]
  }
);
export {
  eo as COLOR_PALETTES,
  Ts as DependencyLines,
  eu as GanttChart,
  tu as GanttContainer,
  Es as TaskModal,
  hs as addSubtask,
  ms as calculateCriticalPath,
  fs as findTaskById,
  ls as flattenTasks,
  cs as generateTimeline,
  ys as getIndentation,
  Ql as getPaletteColor,
  ds as getParentTaskOptions,
  Ss as getProgressColor,
  us as toggleTaskExpansion,
  Zl as transformFromGanttTask,
  Jl as transformToGanttTasks,
  ps as updateTaskInHierarchy
};
