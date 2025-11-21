import { jsx as a, jsxs as x, Fragment as ie } from "react/jsx-runtime";
import ee, { useState as z, useRef as B, useEffect as de, useMemo as te } from "react";
import { differenceInDays as oe } from "date-fns";
function ce(n, t, o, s) {
  if (s !== void 0 && o instanceof Date) {
    const g = n, D = o, w = new Date(g.startDate || g.start), S = new Date(g.endDate || g.end), i = (E) => {
      const M = new Date(E);
      return M.setHours(0, 0, 0, 0), M;
    }, p = i(t), u = i(w), O = i(S), I = 24 * 60 * 60 * 1e3, b = Math.round((u.getTime() - p.getTime()) / I), H = Math.round((O.getTime() - u.getTime()) / I) + 1, y = Math.round((D.getTime() - p.getTime()) / I) + 1, R = s / y, m = b * R, $ = H * R;
    return { left: m, width: Math.max($, R) };
  }
  const r = n, c = o;
  return oe(r, t) * c;
}
const fe = (n, t) => oe(t, n), pe = (n) => {
  if (n.length === 0) {
    const r = /* @__PURE__ */ new Date();
    r.setHours(0, 0, 0, 0);
    const c = new Date(r);
    return c.setDate(c.getDate() + 7), { start: r, end: c };
  }
  const t = n.flatMap((r) => [
    new Date(r.startDate || r.start),
    new Date(r.endDate || r.end)
  ]), o = new Date(Math.min(...t.map((r) => r.getTime()))), s = new Date(Math.max(...t.map((r) => r.getTime())));
  return o.setHours(0, 0, 0, 0), s.setHours(0, 0, 0, 0), { start: o, end: s };
}, ge = (n, t, o) => {
  const s = [], r = new Date(n);
  for (r.setHours(0, 0, 0, 0); r <= t; ) {
    const c = new Date(r);
    let d, g;
    if (o === "day")
      g = r.toLocaleDateString("en-US", { month: "short", day: "numeric" }), d = new Date(r), d.setDate(d.getDate() + 1);
    else if (o === "week") {
      const D = new Date(r);
      D.setDate(D.getDate() + 7), g = `Week ${Math.ceil((r.getTime() - new Date(r.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1e3))}`, d = D;
    } else
      g = r.toLocaleDateString("en-US", { month: "short", year: "numeric" }), d = new Date(r.getFullYear(), r.getMonth() + 1, 1);
    s.push({ label: g, startDate: c, endDate: d }), o === "day" ? r.setDate(r.getDate() + 1) : o === "week" ? r.setDate(r.getDate() + 7) : r.setMonth(r.getMonth() + 1);
  }
  return s;
}, Ee = (n) => n.map((t) => {
  let o = 0;
  t.progress && (typeof t.progress == "string" ? o = parseInt(t.progress.replace("%", "")) : typeof t.progress == "number" && (o = t.progress));
  let s = "Not Started";
  return o === 100 ? s = "Done" : o > 0 && (s = "In Progress"), {
    // Map API fields to GanttTask format
    id: t._id || t.id,
    name: t.title || t.name,
    start: t.startDate || t.start,
    end: t.endDate || t.end,
    status: s,
    progress: o,
    assignedTo: Array.isArray(t.assignees) ? t.assignees[0] : t.assignedTo,
    // Preserve original data for reference
    _original: t
  };
}), Me = (n, t) => {
  const o = {};
  return t.name !== void 0 && (o.title = t.name), t.start !== void 0 && (o.startDate = t.start), t.end !== void 0 && (o.endDate = t.end), t.progress !== void 0 && (o.progress = `${t.progress}%`), t.assignedTo !== void 0 && (o.assignees = [t.assignedTo]), o;
}, ue = (n, t = /* @__PURE__ */ new Set()) => {
  const o = [], s = (r, c = 0, d = !0) => {
    const g = !!r.subtasks && r.subtasks.length > 0, D = r.isExpanded ?? t.has(r.id), w = c === 0 || d;
    o.push({
      ...r,
      level: c,
      hasChildren: g,
      isVisible: w,
      isExpanded: D
    }), g && D && w && r.subtasks.forEach((S) => {
      s(S, c + 1, !0);
    });
  };
  return n.forEach((r) => s(r)), o.filter((r) => r.isVisible);
}, he = (n, t) => {
  const o = new Set(t);
  return o.has(n) ? o.delete(n) : o.add(n), o;
}, be = (n, t) => {
  const o = [], s = (r) => {
    r.forEach((c) => {
      c.id !== t && (o.push(c), c.subtasks && c.subtasks.length > 0 && s(c.subtasks));
    });
  };
  return s(n), o;
}, xe = (n, t) => {
  for (const o of n) {
    if (o.id === t)
      return o;
    if (o.subtasks && o.subtasks.length > 0) {
      const s = xe(o.subtasks, t);
      if (s) return s;
    }
  }
  return null;
}, me = (n, t, o) => n.map((s) => s.id === t ? { ...s, ...o } : s.subtasks && s.subtasks.length > 0 ? {
  ...s,
  subtasks: me(s.subtasks, t, o)
} : s), De = (n, t, o) => n.map((s) => {
  if (s.id === t) {
    const r = s.subtasks || [];
    return {
      ...s,
      subtasks: [...r, { ...o, parentId: t }],
      isExpanded: !0
      // Auto-expand when adding subtask
    };
  }
  return s.subtasks && s.subtasks.length > 0 ? {
    ...s,
    subtasks: De(s.subtasks, t, o)
  } : s;
}), Se = (n, t = 20) => n * t, ye = ({ units: n, chartWidth: t, unitWidth: o }) => /* @__PURE__ */ a("div", { style: {
  display: "flex",
  borderBottom: "2px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  height: "60px"
}, children: n.map((s, r) => /* @__PURE__ */ a(
  "div",
  {
    style: {
      width: `${o}px`,
      minWidth: `${o}px`,
      maxWidth: `${o}px`,
      padding: "8px 4px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 600,
      color: "#374151",
      borderRight: r < n.length - 1 ? "1px solid #e5e7eb" : "none",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    children: s.label
  },
  r
)) }), we = ({ tasks: n, rowHeight: t, onToggleExpand: o }) => /* @__PURE__ */ a("div", { children: n.map((s, r) => {
  const c = Se(s.level);
  return /* @__PURE__ */ x(
    "div",
    {
      style: {
        height: `${t}px`,
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f3f4f6",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: s.level > 0 ? "#f9fafb" : "#fff"
      },
      children: [
        /* @__PURE__ */ x("div", { style: {
          display: "flex",
          alignItems: "center",
          flex: 1,
          paddingLeft: `${c}px`
        }, children: [
          s.hasChildren && /* @__PURE__ */ a(
            "button",
            {
              onClick: () => o == null ? void 0 : o(s.id),
              style: {
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                marginRight: "8px",
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                color: "#6b7280"
              },
              title: s.isExpanded ? "Collapse" : "Expand",
              children: s.isExpanded ? "▼" : "▶"
            }
          ),
          !s.hasChildren && /* @__PURE__ */ a("span", { style: { width: "28px", display: "inline-block" } }),
          /* @__PURE__ */ a("span", { style: {
            fontWeight: s.hasChildren ? 600 : 500,
            color: s.hasChildren ? "#111827" : "#374151"
          }, children: s.name })
        ] }),
        /* @__PURE__ */ x("span", { style: { fontSize: "12px", color: "#6b7280", marginLeft: "8px" }, children: [
          fe(new Date(s.start || s.startDate), new Date(s.end || s.endDate)),
          "d"
        ] })
      ]
    },
    s.id
  );
}) }), re = {
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
function We(n, t) {
  const o = re[n];
  return o.colors[t % o.colors.length];
}
function Te(n, t) {
  const o = re[n];
  return t === 100 ? o.completed : t > 0 ? o.inProgress : o.notStarted;
}
const ve = ({
  task: n,
  timelineStart: t,
  timelineEnd: o,
  chartWidth: s,
  rowHeight: r,
  index: c,
  onTaskUpdate: d,
  onClick: g,
  onDoubleClick: D,
  getTaskColor: w,
  config: S
}) => {
  const { left: i, width: p } = ce(n, t, o, s), u = n.progress || 0, I = (() => {
    if (n.color)
      return n.color;
    if (w)
      return w(n);
    if (S) {
      if (S.statusColors && n.status && S.statusColors[n.status])
        return S.statusColors[n.status];
      if (S.assigneeColors && n.assignedTo && S.assigneeColors[n.assignedTo])
        return S.assigneeColors[n.assignedTo];
      if (S.colorPalette) {
        const e = S.colorPalette;
        if (e.colors && e.colors.length > 0)
          return e.colors[c % e.colors.length];
        if (u === 100 && e.completed) return e.completed;
        if (u > 0 && e.inProgress) return e.inProgress;
        if (u === 0 && e.notStarted) return e.notStarted;
        if (e.preset)
          return Te(e.preset, u);
      }
    }
    return u === 100 ? "#10b981" : u > 0 ? "#3b82f6" : "#6b7280";
  })(), [b, H] = z(!1), [y, R] = z(!1), [m, $] = z(!1), [E, M] = z({ x: 0, y: 0 }), [T, k] = z({ left: i, width: p }), [P, N] = z(0), [F, G] = z(!1), W = B({ left: i, width: p }), U = B(null), _ = B({ left: i, width: p });
  ee.useEffect(() => {
    const e = document.querySelector("[data-gantt-chart-scroll]");
    e && (U.current = e);
  }, []);
  const X = (e, v) => {
    var f;
    e.stopPropagation(), e.preventDefault();
    const h = ((f = U.current) == null ? void 0 : f.scrollLeft) || 0;
    G(!1), v === "move" ? (H(!0), N(e.clientX), M({ x: e.clientX - i + h, y: 0 })) : v === "resize-left" ? (R(!0), N(e.clientX)) : v === "resize-right" && ($(!0), N(e.clientX)), W.current = { left: i, width: p };
  }, V = (e) => {
    e.stopPropagation(), !F && !b && !y && !m && g && g(n);
  }, A = (e) => {
    var h;
    const v = ((h = U.current) == null ? void 0 : h.scrollLeft) || 0;
    if (!F && Math.abs(e.clientX - P) > 5 && G(!0), b) {
      const f = e.clientX + v, C = Math.max(0, Math.min(f - E.x, s - p));
      k({ left: C, width: p });
    } else if (y) {
      e.clientX + v;
      const f = e.clientX - P, C = Math.max(0, W.current.left + f), L = W.current.width - f;
      L >= 20 && k({ left: C, width: L });
    } else if (m) {
      const f = e.clientX - P, C = Math.max(20, W.current.width + f);
      k({ left: W.current.left, width: C });
    }
  }, Y = () => {
    if (console.log("🖱️ TaskBar.handleMouseUp"), console.log("   isDragging:", b), console.log("   isResizingLeft:", y), console.log("   isResizingRight:", m), b || y || m) {
      const e = T.left !== W.current.left || T.width !== W.current.width;
      if (console.log("📏 Position check:"), console.log("   positionChanged:", e), console.log("   tempPosition:", T), console.log("   dragStartRef:", W.current), console.log("   onTaskUpdate:", d ? "defined" : "NOT DEFINED"), e && d) {
        const h = (o.getTime() - t.getTime()) / s, f = t.getTime() + T.left * h, C = t.getTime() + (T.left + T.width) * h, L = new Date(f).toISOString().split("T")[0], q = new Date(C).toISOString().split("T")[0];
        console.log("🎯 Calling onTaskUpdate"), console.log("   taskId:", n.id), console.log("   new start:", L), console.log("   new end:", q), d(String(n.id), {
          start: L,
          end: q
        });
      } else
        console.log("❌ NOT calling onTaskUpdate"), console.log("   Reason: positionChanged =", e, ", onTaskUpdate =", !!d);
    } else
      console.log("⏭️ Skipping - not dragging or resizing");
    H(!1), R(!1), $(!1);
  };
  ee.useEffect(() => {
    if (b || y || m)
      return document.addEventListener("mousemove", A), document.addEventListener("mouseup", Y), () => {
        document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", Y);
      };
  }, [b, y, m, T]), ee.useEffect(() => {
    !b && !y && !m && (_.current.left !== i || _.current.width !== p) && (k({ left: i, width: p }), _.current = { left: i, width: p });
  }, [i, p, b, y, m]);
  const J = b || y || m ? T.left : i, K = b || y || m ? T.width : p, Q = "level" in n && n.level > 0, j = "hasChildren" in n && n.hasChildren, Z = {
    position: "absolute",
    left: `${J}px`,
    top: `${c * r + 10}px`,
    width: `${K}px`,
    height: `${r - 20}px`,
    backgroundColor: I,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: j ? 600 : 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    cursor: b ? "grabbing" : "grab",
    boxShadow: b || y || m ? "0 4px 6px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.2)",
    transition: b || y || m ? "none" : "transform 0.1s",
    userSelect: "none",
    opacity: Q ? 0.9 : 1,
    border: j ? "2px solid rgba(255,255,255,0.3)" : "none"
  }, ne = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${u}%`,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    transition: "width 0.3s",
    pointerEvents: "none"
  }, l = (e) => ({
    position: "absolute",
    [e]: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    cursor: "ew-resize",
    zIndex: 2,
    backgroundColor: "transparent"
  });
  return /* @__PURE__ */ a(ie, { children: /* @__PURE__ */ x(
    "div",
    {
      "data-task-bar": "true",
      style: Z,
      title: `${n.name} (${new Date(n.start || n.startDate).toLocaleDateString()} - ${new Date(n.end || n.endDate).toLocaleDateString()})
Drag to move, drag edges to resize, double-click to edit`,
      onClick: V,
      onMouseDown: (e) => X(e, "move"),
      onDoubleClick: () => D == null ? void 0 : D(n),
      onMouseEnter: (e) => !b && (e.currentTarget.style.transform = "translateY(-2px)"),
      onMouseLeave: (e) => !b && (e.currentTarget.style.transform = "translateY(0)"),
      children: [
        /* @__PURE__ */ a(
          "div",
          {
            style: l("left"),
            onMouseDown: (e) => X(e, "resize-left"),
            title: "Drag to change start date"
          }
        ),
        u > 0 && /* @__PURE__ */ a("div", { style: ne }),
        /* @__PURE__ */ a("span", { style: { position: "relative", zIndex: 1 }, children: n.name }),
        /* @__PURE__ */ a(
          "div",
          {
            style: l("right"),
            onMouseDown: (e) => X(e, "resize-right"),
            title: "Drag to change end date"
          }
        )
      ]
    }
  ) });
}, Ce = ({
  isOpen: n,
  onClose: t,
  onSave: o,
  initialDate: s,
  editingTask: r,
  allTasks: c = []
}) => {
  const [d, g] = z({
    name: "",
    description: "",
    startDate: s || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    endDate: s || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    progress: 0,
    parentId: null
  });
  de(() => {
    r ? g({
      name: r.name,
      description: r.description || "",
      startDate: r.startDate,
      endDate: r.endDate,
      progress: r.progress || 0,
      parentId: r.parentId || null
    }) : n && g({
      name: "",
      description: "",
      startDate: s || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: s || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      progress: 0,
      parentId: null
    });
  }, [r, n, s]);
  const D = (i) => {
    i.preventDefault(), d.name.trim() && (o(r ? { ...r, ...d } : d), t());
  }, w = (i) => {
    const { name: p, value: u, type: O } = i.target;
    g((I) => ({
      ...I,
      [p]: O === "number" ? Number(u) : p === "parentId" && u === "" ? null : u
    }));
  };
  if (!n) return null;
  const S = be(c, r == null ? void 0 : r.id);
  return /* @__PURE__ */ a("div", { style: {
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
  }, children: /* @__PURE__ */ x("div", { style: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  }, children: [
    /* @__PURE__ */ a("h2", { style: { margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600 }, children: r ? "Edit Task" : "Add New Task" }),
    /* @__PURE__ */ x("form", { onSubmit: D, children: [
      /* @__PURE__ */ x("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ a("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Task Name *" }),
        /* @__PURE__ */ a(
          "input",
          {
            type: "text",
            name: "name",
            value: d.name,
            onChange: w,
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
      /* @__PURE__ */ x("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ a("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Description" }),
        /* @__PURE__ */ a(
          "textarea",
          {
            name: "description",
            value: d.description,
            onChange: w,
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
      /* @__PURE__ */ x("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ a("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Parent Task (Optional)" }),
        /* @__PURE__ */ x(
          "select",
          {
            name: "parentId",
            value: d.parentId || "",
            onChange: w,
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
              /* @__PURE__ */ a("option", { value: "", children: "None (Top-level task)" }),
              S.map((i) => /* @__PURE__ */ a("option", { value: i.id, children: i.name }, i.id))
            ]
          }
        ),
        /* @__PURE__ */ a("p", { style: { fontSize: "12px", color: "#6b7280", marginTop: "4px" }, children: "Select a parent task to make this a subtask" })
      ] }),
      /* @__PURE__ */ x("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ a("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Start Date *" }),
        /* @__PURE__ */ a(
          "input",
          {
            type: "date",
            name: "startDate",
            value: d.startDate,
            onChange: w,
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
      /* @__PURE__ */ x("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ a("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "End Date *" }),
        /* @__PURE__ */ a(
          "input",
          {
            type: "date",
            name: "endDate",
            value: d.endDate,
            onChange: w,
            required: !0,
            min: d.startDate,
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
      /* @__PURE__ */ x("div", { style: { marginBottom: "24px" }, children: [
        /* @__PURE__ */ a("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Progress (%)" }),
        /* @__PURE__ */ a(
          "input",
          {
            type: "number",
            name: "progress",
            value: d.progress,
            onChange: w,
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
      /* @__PURE__ */ x("div", { style: { display: "flex", gap: "12px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ a(
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
        /* @__PURE__ */ a(
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
            children: r ? "Update Task" : "Add Task"
          }
        )
      ] })
    ] })
  ] }) });
}, Le = ({
  tasks: n,
  onChange: t,
  onTaskClick: o,
  onTaskDoubleClick: s,
  getTaskColor: r,
  config: c,
  viewMode: d = "day",
  locale: g = "en-US",
  height: D = 600
}) => {
  const i = B(null), p = B(null), u = B(null), [O, I] = z(!1), [b, H] = z(""), [y, R] = z(null), [m, $] = z(/* @__PURE__ */ new Set()), E = te(() => ue(n, m), [n, m]), M = te(() => pe(E), [E]), T = te(
    () => ge(M.start, M.end, d),
    [M, d]
  ), k = (l) => {
    $((e) => he(l, e));
  }, P = T.length * 80, N = (l) => {
    p.current && (p.current.scrollTop = l.currentTarget.scrollTop), u.current && (u.current.scrollLeft = l.currentTarget.scrollLeft);
  }, F = (l) => {
    i.current && (i.current.scrollTop = l.currentTarget.scrollTop);
  }, G = (l) => {
    i.current && (i.current.scrollLeft = l.currentTarget.scrollLeft);
  }, W = (l, e) => {
    if (console.log("🔄 GanttChart.handleTaskUpdate called:", { taskId: l, updates: e }), console.log("📋 Current tasks:", n), console.log("🎯 onChange prop:", t ? "defined" : "NOT DEFINED"), t) {
      const v = n.map((h) => {
        if (h.id === l) {
          if (console.log("📝 Found task to update:", h.id), console.log("   Old values:", {
            startDate: h.startDate,
            start: h.start,
            endDate: h.endDate,
            end: h.end
          }), "startDate" in h) {
            console.log("   Task uses startDate/endDate format");
            const f = { ...h };
            return Object.keys(e).forEach((C) => {
              C === "start" && e.start ? (f.startDate = e.start, f.start = e.start, console.log("   Setting startDate & start to:", e.start)) : C === "end" && e.end ? (f.endDate = e.end, f.end = e.end, console.log("   Setting endDate & end to:", e.end)) : f[C] = e[C];
            }), console.log("   Updated task:", {
              startDate: f.startDate,
              endDate: f.endDate
            }), f;
          } else
            console.log("   Task uses start/end format");
          return { ...h, ...e };
        }
        return h;
      });
      console.log("📤 Calling onChange with updated tasks"), console.log("   Updated tasks count:", v.length), t(v);
    } else
      console.error("❌ onChange is NOT DEFINED!");
  }, U = (l) => {
    var C;
    if (l.target.closest("[data-task-bar]") || o)
      return;
    const e = l.currentTarget.getBoundingClientRect(), v = l.clientX - e.left + (((C = i.current) == null ? void 0 : C.scrollLeft) || 0), h = Math.floor(v / 80), f = T[h];
    if (f) {
      const L = f.startDate, q = L.getFullYear(), se = String(L.getMonth() + 1).padStart(2, "0"), ae = String(L.getDate()).padStart(2, "0"), le = `${q}-${se}-${ae}`;
      H(le), R(null), I(!0);
    }
  }, _ = (l) => {
    R(l);
    const e = l.start || l.startDate;
    H(typeof e == "string" ? e : e.toISOString().split("T")[0]), I(!0);
  }, X = (l) => {
    if (t)
      if ("id" in l) {
        const e = n.map(
          (v) => v.id === l.id ? l : v
        );
        t(e);
      } else {
        const e = {
          name: "",
          start: (/* @__PURE__ */ new Date()).toISOString(),
          end: (/* @__PURE__ */ new Date()).toISOString(),
          ...l,
          id: `task-${Date.now()}`
        };
        t([...n, e]);
      }
    I(!1), R(null);
  }, V = {
    display: "flex",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#fff",
    height: D
  }, A = {
    width: 250,
    borderRight: "2px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, Y = {
    height: 60,
    borderBottom: "2px solid #e5e7eb",
    background: "#f9fafb",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    fontSize: "14px",
    color: "#374151",
    flexShrink: 0
  }, J = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden"
  }, K = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, Q = {
    overflowX: "auto",
    overflowY: "hidden",
    borderBottom: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    flexShrink: 0
  }, j = {
    flex: 1,
    overflowX: "auto",
    overflowY: "auto"
  }, Z = {
    position: "relative",
    height: `${E.length * 50}px`,
    width: `${P}px`,
    minWidth: "100%",
    backgroundColor: "#fff"
  };
  return /* @__PURE__ */ x("div", { style: V, children: [
    /* @__PURE__ */ x("div", { style: A, children: [
      /* @__PURE__ */ a("div", { style: Y, children: "Task Name" }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: p,
          onScroll: F,
          style: J,
          children: /* @__PURE__ */ a(we, { tasks: E, rowHeight: 50, onToggleExpand: k })
        }
      )
    ] }),
    /* @__PURE__ */ x("div", { style: K, children: [
      /* @__PURE__ */ a(
        "div",
        {
          ref: u,
          onScroll: G,
          style: Q,
          children: /* @__PURE__ */ a(ye, { units: T, chartWidth: P, unitWidth: 80 })
        }
      ),
      /* @__PURE__ */ a(
        "div",
        {
          ref: i,
          "data-gantt-chart-scroll": "true",
          onScroll: N,
          style: j,
          children: /* @__PURE__ */ x(
            "div",
            {
              style: Z,
              onClick: U,
              children: [
                /* @__PURE__ */ a("div", { style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex"
                }, children: T.map((l, e) => /* @__PURE__ */ a(
                  "div",
                  {
                    style: {
                      width: "80px",
                      minWidth: "80px",
                      maxWidth: "80px",
                      borderRight: e < T.length - 1 ? "1px solid #f3f4f6" : "none",
                      boxSizing: "border-box"
                    }
                  },
                  e
                )) }),
                E.map((l, e) => /* @__PURE__ */ a(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: `${e * 50}px`,
                      height: "50px",
                      borderBottom: e < E.length - 1 ? "1px solid #f3f4f6" : "none"
                    }
                  },
                  e
                )),
                E.map((l, e) => /* @__PURE__ */ a(
                  ve,
                  {
                    task: l,
                    timelineStart: M.start,
                    timelineEnd: M.end,
                    chartWidth: P,
                    rowHeight: 50,
                    index: e,
                    onTaskUpdate: W,
                    onClick: o,
                    onDoubleClick: s || (o ? void 0 : _),
                    getTaskColor: r,
                    config: c
                  },
                  l.id
                ))
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ a(
      Ce,
      {
        isOpen: O,
        onClose: () => {
          I(!1), R(null);
        },
        onSave: X,
        initialDate: b,
        editingTask: y,
        allTasks: n
      }
    )
  ] });
};
export {
  re as COLOR_PALETTES,
  Le as GanttChart,
  Ce as TaskModal,
  De as addSubtask,
  xe as findTaskById,
  ue as flattenTasks,
  Se as getIndentation,
  We as getPaletteColor,
  be as getParentTaskOptions,
  Te as getProgressColor,
  he as toggleTaskExpansion,
  Me as transformFromGanttTask,
  Ee as transformToGanttTasks,
  me as updateTaskInHierarchy
};
