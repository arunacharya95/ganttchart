import { jsx as s, jsxs as w, Fragment as te } from "react/jsx-runtime";
import q, { useState as z, useRef as $, useEffect as ne, useMemo as J } from "react";
import { differenceInDays as K } from "date-fns";
function oe(o, t, r, a) {
  if (a !== void 0 && r instanceof Date) {
    const D = o, h = r, l = new Date(D.startDate || D.start), p = new Date(D.endDate || D.end), T = (H) => {
      const L = new Date(H);
      return L.setHours(0, 0, 0, 0), L;
    }, c = T(t), v = T(l), x = T(p), M = 24 * 60 * 60 * 1e3, m = Math.round((v.getTime() - c.getTime()) / M), C = Math.round((x.getTime() - v.getTime()) / M) + 1, E = Math.round((h.getTime() - c.getTime()) / M) + 1, I = a / E, b = m * I, k = C * I;
    return { left: b, width: Math.max(k, I) };
  }
  const n = o, f = r;
  return K(n, t) * f;
}
const re = (o, t) => K(t, o), se = (o) => {
  if (o.length === 0) {
    const n = /* @__PURE__ */ new Date();
    n.setHours(0, 0, 0, 0);
    const f = new Date(n);
    return f.setDate(f.getDate() + 7), { start: n, end: f };
  }
  const t = o.flatMap((n) => [
    new Date(n.startDate || n.start),
    new Date(n.endDate || n.end)
  ]), r = new Date(Math.min(...t.map((n) => n.getTime()))), a = new Date(Math.max(...t.map((n) => n.getTime())));
  return r.setHours(0, 0, 0, 0), a.setHours(0, 0, 0, 0), { start: r, end: a };
}, ie = (o, t, r) => {
  const a = [], n = new Date(o);
  for (n.setHours(0, 0, 0, 0); n <= t; ) {
    const f = new Date(n);
    let u, D;
    if (r === "day")
      D = n.toLocaleDateString("en-US", { month: "short", day: "numeric" }), u = new Date(n), u.setDate(u.getDate() + 1);
    else if (r === "week") {
      const h = new Date(n);
      h.setDate(h.getDate() + 7), D = `Week ${Math.ceil((n.getTime() - new Date(n.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1e3))}`, u = h;
    } else
      D = n.toLocaleDateString("en-US", { month: "short", year: "numeric" }), u = new Date(n.getFullYear(), n.getMonth() + 1, 1);
    a.push({ label: D, startDate: f, endDate: u }), r === "day" ? n.setDate(n.getDate() + 1) : r === "week" ? n.setDate(n.getDate() + 7) : n.setMonth(n.getMonth() + 1);
  }
  return a;
}, ue = (o) => o.map((t) => {
  let r = 0;
  t.progress && (typeof t.progress == "string" ? r = parseInt(t.progress.replace("%", "")) : typeof t.progress == "number" && (r = t.progress));
  let a = "Not Started";
  return r === 100 ? a = "Done" : r > 0 && (a = "In Progress"), {
    // Map API fields to GanttTask format
    id: t._id || t.id,
    name: t.title || t.name,
    start: t.startDate || t.start,
    end: t.endDate || t.end,
    status: a,
    progress: r,
    assignedTo: Array.isArray(t.assignees) ? t.assignees[0] : t.assignedTo,
    // Preserve original data for reference
    _original: t
  };
}), he = (o, t) => {
  const r = {};
  return t.name !== void 0 && (r.title = t.name), t.start !== void 0 && (r.startDate = t.start), t.end !== void 0 && (r.endDate = t.end), t.progress !== void 0 && (r.progress = `${t.progress}%`), t.assignedTo !== void 0 && (r.assignees = [t.assignedTo]), r;
}, ae = ({ units: o, chartWidth: t, unitWidth: r }) => /* @__PURE__ */ s("div", { style: {
  display: "flex",
  borderBottom: "2px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  height: "60px"
}, children: o.map((a, n) => /* @__PURE__ */ s(
  "div",
  {
    style: {
      width: `${r}px`,
      minWidth: `${r}px`,
      maxWidth: `${r}px`,
      padding: "8px 4px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 600,
      color: "#374151",
      borderRight: n < o.length - 1 ? "1px solid #e5e7eb" : "none",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    children: a.label
  },
  n
)) }), le = ({ tasks: o, rowHeight: t }) => /* @__PURE__ */ s("div", { children: o.map((r, a) => /* @__PURE__ */ w(
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
      color: "#111827"
    },
    children: [
      /* @__PURE__ */ s("span", { style: { fontWeight: 500 }, children: r.name }),
      /* @__PURE__ */ w("span", { style: { fontSize: "12px", color: "#6b7280" }, children: [
        re(new Date(r.start || r.startDate), new Date(r.end || r.endDate)),
        "d"
      ] })
    ]
  },
  r.id
)) }), de = ({
  task: o,
  timelineStart: t,
  timelineEnd: r,
  chartWidth: a,
  rowHeight: n,
  index: f,
  onTaskUpdate: u,
  onClick: D,
  onDoubleClick: h
}) => {
  const { left: l, width: p } = oe(o, t, r, a), T = o.progress || 0, [c, v] = z(!1), [x, M] = z(!1), [m, C] = z(!1), [E, I] = z({ x: 0, y: 0 }), [b, k] = z({ left: l, width: p }), [H, L] = z(0), [_, B] = z(!1), R = $({ left: l, width: p }), O = $(null), N = $({ left: l, width: p });
  q.useEffect(() => {
    const e = document.querySelector("[data-gantt-chart-scroll]");
    e && (O.current = e);
  }, []);
  const U = (e, y) => {
    var d;
    e.stopPropagation(), e.preventDefault();
    const g = ((d = O.current) == null ? void 0 : d.scrollLeft) || 0;
    B(!1), y === "move" ? (v(!0), L(e.clientX), I({ x: e.clientX - l + g, y: 0 })) : y === "resize-left" ? (M(!0), L(e.clientX)) : y === "resize-right" && (C(!0), L(e.clientX)), R.current = { left: l, width: p };
  }, G = (e) => {
    e.stopPropagation(), !_ && !c && !x && !m && D && D(o);
  }, X = (e) => {
    var g;
    const y = ((g = O.current) == null ? void 0 : g.scrollLeft) || 0;
    if (!_ && Math.abs(e.clientX - H) > 5 && B(!0), c) {
      const d = e.clientX + y, S = Math.max(0, Math.min(d - E.x, a - p));
      k({ left: S, width: p });
    } else if (x) {
      e.clientX + y;
      const d = e.clientX - H, S = Math.max(0, R.current.left + d), W = R.current.width - d;
      W >= 20 && k({ left: S, width: W });
    } else if (m) {
      const d = e.clientX - H, S = Math.max(20, R.current.width + d);
      k({ left: R.current.left, width: S });
    }
  }, F = () => {
    if (console.log("🖱️ TaskBar.handleMouseUp"), console.log("   isDragging:", c), console.log("   isResizingLeft:", x), console.log("   isResizingRight:", m), c || x || m) {
      const e = b.left !== R.current.left || b.width !== R.current.width;
      if (console.log("📏 Position check:"), console.log("   positionChanged:", e), console.log("   tempPosition:", b), console.log("   dragStartRef:", R.current), console.log("   onTaskUpdate:", u ? "defined" : "NOT DEFINED"), e && u) {
        const g = (r.getTime() - t.getTime()) / a, d = t.getTime() + b.left * g, S = t.getTime() + (b.left + b.width) * g, W = new Date(d).toISOString().split("T")[0], P = new Date(S).toISOString().split("T")[0];
        console.log("🎯 Calling onTaskUpdate"), console.log("   taskId:", o.id), console.log("   new start:", W), console.log("   new end:", P), u(String(o.id), {
          start: W,
          end: P
        });
      } else
        console.log("❌ NOT calling onTaskUpdate"), console.log("   Reason: positionChanged =", e, ", onTaskUpdate =", !!u);
    } else
      console.log("⏭️ Skipping - not dragging or resizing");
    v(!1), M(!1), C(!1);
  };
  q.useEffect(() => {
    if (c || x || m)
      return document.addEventListener("mousemove", X), document.addEventListener("mouseup", F), () => {
        document.removeEventListener("mousemove", X), document.removeEventListener("mouseup", F);
      };
  }, [c, x, m, b]), q.useEffect(() => {
    !c && !x && !m && (N.current.left !== l || N.current.width !== p) && (k({ left: l, width: p }), N.current = { left: l, width: p });
  }, [l, p, c, x, m]);
  const Y = c || x || m ? b.left : l, A = c || x || m ? b.width : p, j = {
    position: "absolute",
    left: `${Y}px`,
    top: `${f * n + 10}px`,
    width: `${A}px`,
    height: `${n - 20}px`,
    backgroundColor: "#3b82f6",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    cursor: c ? "grabbing" : "grab",
    boxShadow: c || x || m ? "0 4px 6px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.2)",
    transition: c || x || m ? "none" : "transform 0.1s",
    userSelect: "none"
  }, V = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${T}%`,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    transition: "width 0.3s",
    pointerEvents: "none"
  }, i = (e) => ({
    position: "absolute",
    [e]: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    cursor: "ew-resize",
    zIndex: 2,
    backgroundColor: "transparent"
  });
  return /* @__PURE__ */ s(te, { children: /* @__PURE__ */ w(
    "div",
    {
      "data-task-bar": "true",
      style: j,
      title: `${o.name} (${new Date(o.start || o.startDate).toLocaleDateString()} - ${new Date(o.end || o.endDate).toLocaleDateString()})
Drag to move, drag edges to resize, double-click to edit`,
      onClick: G,
      onMouseDown: (e) => U(e, "move"),
      onDoubleClick: () => h == null ? void 0 : h(o),
      onMouseEnter: (e) => !c && (e.currentTarget.style.transform = "translateY(-2px)"),
      onMouseLeave: (e) => !c && (e.currentTarget.style.transform = "translateY(0)"),
      children: [
        /* @__PURE__ */ s(
          "div",
          {
            style: i("left"),
            onMouseDown: (e) => U(e, "resize-left"),
            title: "Drag to change start date"
          }
        ),
        T > 0 && /* @__PURE__ */ s("div", { style: V }),
        /* @__PURE__ */ s("span", { style: { position: "relative", zIndex: 1 }, children: o.name }),
        /* @__PURE__ */ s(
          "div",
          {
            style: i("right"),
            onMouseDown: (e) => U(e, "resize-right"),
            title: "Drag to change end date"
          }
        )
      ]
    }
  ) });
}, ce = ({
  isOpen: o,
  onClose: t,
  onSave: r,
  initialDate: a,
  editingTask: n
}) => {
  const [f, u] = z({
    name: "",
    description: "",
    startDate: a || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    endDate: a || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    progress: 0
  });
  ne(() => {
    n ? u({
      name: n.name,
      description: n.description || "",
      startDate: n.startDate,
      endDate: n.endDate,
      progress: n.progress || 0
    }) : o && u({
      name: "",
      description: "",
      startDate: a || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: a || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      progress: 0
    });
  }, [n, o, a]);
  const D = (l) => {
    l.preventDefault(), f.name.trim() && (r(n ? { ...n, ...f } : f), t());
  }, h = (l) => {
    const { name: p, value: T, type: c } = l.target;
    u((v) => ({
      ...v,
      [p]: c === "number" ? Number(T) : T
    }));
  };
  return o ? /* @__PURE__ */ s("div", { style: {
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
  }, children: /* @__PURE__ */ w("div", { style: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  }, children: [
    /* @__PURE__ */ s("h2", { style: { margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600 }, children: n ? "Edit Task" : "Add New Task" }),
    /* @__PURE__ */ w("form", { onSubmit: D, children: [
      /* @__PURE__ */ w("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ s("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Task Name *" }),
        /* @__PURE__ */ s(
          "input",
          {
            type: "text",
            name: "name",
            value: f.name,
            onChange: h,
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
      /* @__PURE__ */ w("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ s("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Description" }),
        /* @__PURE__ */ s(
          "textarea",
          {
            name: "description",
            value: f.description,
            onChange: h,
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
      /* @__PURE__ */ w("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ s("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Start Date *" }),
        /* @__PURE__ */ s(
          "input",
          {
            type: "date",
            name: "startDate",
            value: f.startDate,
            onChange: h,
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
      /* @__PURE__ */ w("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ s("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "End Date *" }),
        /* @__PURE__ */ s(
          "input",
          {
            type: "date",
            name: "endDate",
            value: f.endDate,
            onChange: h,
            required: !0,
            min: f.startDate,
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
      /* @__PURE__ */ w("div", { style: { marginBottom: "24px" }, children: [
        /* @__PURE__ */ s("label", { style: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }, children: "Progress (%)" }),
        /* @__PURE__ */ s(
          "input",
          {
            type: "number",
            name: "progress",
            value: f.progress,
            onChange: h,
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
      /* @__PURE__ */ w("div", { style: { display: "flex", gap: "12px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ s(
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
        /* @__PURE__ */ s(
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
            children: n ? "Update Task" : "Add Task"
          }
        )
      ] })
    ] })
  ] }) }) : null;
}, xe = ({
  tasks: o,
  onChange: t,
  onTaskClick: r,
  onTaskDoubleClick: a,
  viewMode: n = "day",
  locale: f = "en-US",
  height: u = 600
}) => {
  const l = $(null), p = $(null), T = $(null), [c, v] = z(!1), [x, M] = z(""), [m, C] = z(null), E = J(() => se(o), [o]), I = J(
    () => ie(E.start, E.end, n),
    [E, n]
  ), b = I.length * 80, k = (i) => {
    p.current && (p.current.scrollTop = i.currentTarget.scrollTop), T.current && (T.current.scrollLeft = i.currentTarget.scrollLeft);
  }, H = (i) => {
    l.current && (l.current.scrollTop = i.currentTarget.scrollTop);
  }, L = (i) => {
    l.current && (l.current.scrollLeft = i.currentTarget.scrollLeft);
  }, _ = (i, e) => {
    if (console.log("🔄 GanttChart.handleTaskUpdate called:", { taskId: i, updates: e }), console.log("📋 Current tasks:", o), console.log("🎯 onChange prop:", t ? "defined" : "NOT DEFINED"), t) {
      const y = o.map((g) => {
        if (g.id === i) {
          if (console.log("📝 Found task to update:", g.id), console.log("   Old values:", {
            startDate: g.startDate,
            start: g.start,
            endDate: g.endDate,
            end: g.end
          }), "startDate" in g) {
            console.log("   Task uses startDate/endDate format");
            const d = { ...g };
            return Object.keys(e).forEach((S) => {
              S === "start" && e.start ? (d.startDate = e.start, d.start = e.start, console.log("   Setting startDate & start to:", e.start)) : S === "end" && e.end ? (d.endDate = e.end, d.end = e.end, console.log("   Setting endDate & end to:", e.end)) : d[S] = e[S];
            }), console.log("   Updated task:", {
              startDate: d.startDate,
              endDate: d.endDate
            }), d;
          } else
            console.log("   Task uses start/end format");
          return { ...g, ...e };
        }
        return g;
      });
      console.log("📤 Calling onChange with updated tasks"), console.log("   Updated tasks count:", y.length), t(y);
    } else
      console.error("❌ onChange is NOT DEFINED!");
  }, B = (i) => {
    var S;
    if (i.target.closest("[data-task-bar]") || r)
      return;
    const e = i.currentTarget.getBoundingClientRect(), y = i.clientX - e.left + (((S = l.current) == null ? void 0 : S.scrollLeft) || 0), g = Math.floor(y / 80), d = I[g];
    if (d) {
      const W = d.startDate, P = W.getFullYear(), Q = String(W.getMonth() + 1).padStart(2, "0"), Z = String(W.getDate()).padStart(2, "0"), ee = `${P}-${Q}-${Z}`;
      M(ee), C(null), v(!0);
    }
  }, R = (i) => {
    C(i);
    const e = i.start || i.startDate;
    M(typeof e == "string" ? e : e.toISOString().split("T")[0]), v(!0);
  }, O = (i) => {
    if (t)
      if ("id" in i) {
        const e = o.map(
          (y) => y.id === i.id ? i : y
        );
        t(e);
      } else {
        const e = {
          name: "",
          start: (/* @__PURE__ */ new Date()).toISOString(),
          end: (/* @__PURE__ */ new Date()).toISOString(),
          ...i,
          id: `task-${Date.now()}`
        };
        t([...o, e]);
      }
    v(!1), C(null);
  }, N = {
    display: "flex",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#fff",
    height: u
  }, U = {
    width: 250,
    borderRight: "2px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, G = {
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
  }, X = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden"
  }, F = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, Y = {
    overflowX: "auto",
    overflowY: "hidden",
    borderBottom: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    flexShrink: 0
  }, A = {
    flex: 1,
    overflowX: "auto",
    overflowY: "auto"
  }, j = {
    position: "relative",
    height: `${o.length * 50}px`,
    width: `${b}px`,
    minWidth: "100%",
    backgroundColor: "#fff"
  };
  return /* @__PURE__ */ w("div", { style: N, children: [
    /* @__PURE__ */ w("div", { style: U, children: [
      /* @__PURE__ */ s("div", { style: G, children: "Task Name" }),
      /* @__PURE__ */ s(
        "div",
        {
          ref: p,
          onScroll: H,
          style: X,
          children: /* @__PURE__ */ s(le, { tasks: o, rowHeight: 50 })
        }
      )
    ] }),
    /* @__PURE__ */ w("div", { style: F, children: [
      /* @__PURE__ */ s(
        "div",
        {
          ref: T,
          onScroll: L,
          style: Y,
          children: /* @__PURE__ */ s(ae, { units: I, chartWidth: b, unitWidth: 80 })
        }
      ),
      /* @__PURE__ */ s(
        "div",
        {
          ref: l,
          "data-gantt-chart-scroll": "true",
          onScroll: k,
          style: A,
          children: /* @__PURE__ */ w(
            "div",
            {
              style: j,
              onClick: B,
              children: [
                /* @__PURE__ */ s("div", { style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex"
                }, children: I.map((i, e) => /* @__PURE__ */ s(
                  "div",
                  {
                    style: {
                      width: "80px",
                      minWidth: "80px",
                      maxWidth: "80px",
                      borderRight: e < I.length - 1 ? "1px solid #f3f4f6" : "none",
                      boxSizing: "border-box"
                    }
                  },
                  e
                )) }),
                o.map((i, e) => /* @__PURE__ */ s(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: `${e * 50}px`,
                      height: "50px",
                      borderBottom: e < o.length - 1 ? "1px solid #f3f4f6" : "none"
                    }
                  },
                  e
                )),
                o.map((i, e) => /* @__PURE__ */ s(
                  de,
                  {
                    task: i,
                    timelineStart: E.start,
                    timelineEnd: E.end,
                    chartWidth: b,
                    rowHeight: 50,
                    index: e,
                    onTaskUpdate: _,
                    onClick: r,
                    onDoubleClick: a || (r ? void 0 : R)
                  },
                  i.id
                ))
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ s(
      ce,
      {
        isOpen: c,
        onClose: () => {
          v(!1), C(null);
        },
        onSave: O,
        initialDate: x,
        editingTask: m
      }
    )
  ] });
};
export {
  xe as GanttChart,
  ce as TaskModal,
  he as transformFromGanttTask,
  ue as transformToGanttTasks
};
