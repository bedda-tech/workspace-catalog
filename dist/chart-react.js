import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
/** One color per positional series slot. Fixed order, never cycled (dataviz method). */
const SLOT_COLORS = [
    "var(--chart-1, #2aa98e)",
    "var(--chart-2, #c98500)",
    "var(--chart-3, #3987e5)",
    "var(--chart-4, #e0593c)",
];
const DEFAULT_HEIGHT = 200;
function formatTick(value, yFormat) {
    const compact = Math.abs(value) >= 1000 ? `${(value / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}k` : value.toLocaleString("en-US");
    if (yFormat === "currency")
        return `$${compact}`;
    if (yFormat === "percent")
        return `${compact}%`;
    return compact;
}
function formatValue(value, yFormat) {
    const n = Number(value);
    if (!Number.isFinite(n))
        return String(value ?? "");
    if (yFormat === "currency")
        return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (yFormat === "percent")
        return `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
    return n.toLocaleString("en-US");
}
/**
 * Tooltip body. Text wears text tokens, never the series color — the colored swatch
 * beside each row carries identity (dataviz non-negotiable).
 */
function ChartTip({ active, label, payload, yFormat, }) {
    if (!active || !payload || payload.length === 0)
        return null;
    return (_jsxs("div", { className: "min-w-[8rem] rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md", children: [label != null && label !== "" && (_jsx("div", { className: "mb-1 font-medium text-foreground", children: String(label) })), _jsx("div", { className: "space-y-1", children: payload.map((row, i) => (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[2px]", style: { backgroundColor: row.color }, "aria-hidden": "true" }), _jsx("span", { className: "flex-1 text-muted-foreground", children: String(row.name ?? "") }), _jsx("span", { className: "font-medium tabular-nums text-foreground", children: formatValue(row.value, yFormat) })] }, i))) })] }));
}
/** Legend — present for 2+ series so identity is never color-alone; one series is named
 * by the surrounding Card/Heading and gets none. */
function ChartLegend({ series }) {
    if (series.length < 2)
        return null;
    return (_jsx("div", { className: "mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground", children: series.map((s, i) => (_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-[2px]", style: { backgroundColor: SLOT_COLORS[i] }, "aria-hidden": "true" }), s.label] }, s.key))) }));
}
export function ChartSkeleton() {
    return (_jsx("div", { className: "h-[200px] w-full animate-pulse rounded-md border border-border bg-muted/40", "aria-hidden": "true" }));
}
export function Chart({ props, loading }) {
    if (loading)
        return _jsx(ChartSkeleton, {});
    const data = (props.data ?? []);
    const series = (props.series ?? []).slice(0, SLOT_COLORS.length);
    const height = props.height ?? DEFAULT_HEIGHT;
    const yFormat = props.yFormat ?? null;
    const stacked = props.stacked === true;
    if (data.length === 0 || series.length === 0) {
        return (_jsx("div", { className: "flex h-24 items-center justify-center rounded-md border border-border text-xs text-muted-foreground", children: "No data to chart." }));
    }
    const axes = (_jsxs(_Fragment, { children: [_jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3", stroke: "var(--border, #333)" }), _jsx(XAxis, { dataKey: props.xKey, tickLine: false, axisLine: false, tickMargin: 6, minTickGap: 24 }), _jsx(YAxis, { tickLine: false, axisLine: false, width: 48, tickFormatter: (v) => formatTick(v, yFormat) }), _jsx(Tooltip, { content: _jsx(ChartTip, { yFormat: yFormat }), cursor: { fill: "var(--muted, #222)", opacity: 0.35 } })] }));
    let plot;
    if (props.type === "bar") {
        plot = (_jsxs(BarChart, { data: data, margin: { top: 4, right: 4, bottom: 0, left: 0 }, barCategoryGap: 2, children: [axes, series.map((s, i) => (_jsx(Bar, { dataKey: s.key, name: s.label, stackId: stacked ? "stack" : undefined, fill: SLOT_COLORS[i], 
                    // 2px surface gap between stacked segments; rounded data-end only on the
                    // outermost mark (top segment when stacked, every bar when grouped).
                    stroke: stacked ? "var(--background, #1a2329)" : undefined, strokeWidth: stacked ? 2 : 0, radius: !stacked || i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0], maxBarSize: 28 }, s.key)))] }));
    }
    else if (props.type === "area") {
        plot = (_jsxs(AreaChart, { data: data, margin: { top: 4, right: 4, bottom: 0, left: 0 }, children: [axes, series.map((s, i) => (_jsx(Area, { dataKey: s.key, name: s.label, type: "monotone", stackId: stacked ? "stack" : undefined, stroke: SLOT_COLORS[i], strokeWidth: 2, fill: SLOT_COLORS[i], fillOpacity: 0.15, dot: false }, s.key)))] }));
    }
    else {
        plot = (_jsxs(LineChart, { data: data, margin: { top: 4, right: 4, bottom: 0, left: 0 }, children: [axes, series.map((s, i) => (_jsx(Line, { dataKey: s.key, name: s.label, type: "monotone", stroke: SLOT_COLORS[i], strokeWidth: 2, dot: false, activeDot: { r: 4 } }, s.key)))] }));
    }
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { style: { height }, className: "w-full text-xs", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: plot }) }), _jsx(ChartLegend, { series: series })] }));
}
