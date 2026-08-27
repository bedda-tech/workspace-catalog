/**
 * Chart's React implementation. Kept separate from chart.ts (React-free) the same way
 * board.ts/board-react.tsx split — the root export stays server-safe.
 *
 * Rendering follows the dataviz method's mark specs: thin marks (bars capped at 28px
 * with 4px rounded data-ends anchored to the baseline, 2px lines, 2px surface gaps
 * between stacked segments), recessive horizontal-only grid, no axis lines, per-mark
 * hover tooltip always on, a legend only at 2+ series. Colors are the host's
 * --chart-1..4 tokens in fixed positional order — never cycled, never generated —
 * with the reference dark-mode values as fallback for surfaces that define no tokens.
 */
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BaseComponentProps } from "@json-render/react";
import type { ChartProps, ChartSeries } from "./chart.js";

/** One color per positional series slot. Fixed order, never cycled (dataviz method). */
const SLOT_COLORS = [
  "var(--chart-1, #2aa98e)",
  "var(--chart-2, #c98500)",
  "var(--chart-3, #3987e5)",
  "var(--chart-4, #e0593c)",
] as const;

const DEFAULT_HEIGHT = 200;

type YFormat = NonNullable<ChartProps["yFormat"]>;

function formatTick(value: number, yFormat: YFormat | null | undefined): string {
  const compact = Math.abs(value) >= 1000 ? `${(value / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}k` : value.toLocaleString("en-US");
  if (yFormat === "currency") return `$${compact}`;
  if (yFormat === "percent") return `${compact}%`;
  return compact;
}

function formatValue(value: unknown, yFormat: YFormat | null | undefined): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  if (yFormat === "currency")
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (yFormat === "percent") return `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
  return n.toLocaleString("en-US");
}

/**
 * Tooltip body. Text wears text tokens, never the series color — the colored swatch
 * beside each row carries identity (dataviz non-negotiable).
 */
function ChartTip({
  active,
  label,
  payload,
  yFormat,
}: {
  active?: boolean;
  label?: unknown;
  payload?: readonly { name?: unknown; value?: unknown; color?: string }[];
  yFormat: YFormat | null | undefined;
}): ReactNode {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="min-w-[8rem] rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      {label != null && label !== "" && (
        <div className="mb-1 font-medium text-foreground">{String(label)}</div>
      )}
      <div className="space-y-1">
        {payload.map((row, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: row.color }}
              aria-hidden="true"
            />
            <span className="flex-1 text-muted-foreground">{String(row.name ?? "")}</span>
            <span className="font-medium tabular-nums text-foreground">
              {formatValue(row.value, yFormat)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Legend — present for 2+ series so identity is never color-alone; one series is named
 * by the surrounding Card/Heading and gets none. */
function ChartLegend({ series }: { series: ChartSeries[] }): ReactNode {
  if (series.length < 2) return null;
  return (
    <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {series.map((s, i) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: SLOT_COLORS[i] }}
            aria-hidden="true"
          />
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      className="h-[200px] w-full animate-pulse rounded-md border border-border bg-muted/40"
      aria-hidden="true"
    />
  );
}

export function Chart({ props, loading }: BaseComponentProps<ChartProps>) {
  if (loading) return <ChartSkeleton />;

  const data = (props.data ?? []) as Record<string, string | number | null>[];
  const series = (props.series ?? []).slice(0, SLOT_COLORS.length);
  const height = props.height ?? DEFAULT_HEIGHT;
  const yFormat = props.yFormat ?? null;
  const stacked = props.stacked === true;

  if (data.length === 0 || series.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
        No data to chart.
      </div>
    );
  }

  const axes = (
    <>
      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border, #333)" />
      <XAxis dataKey={props.xKey} tickLine={false} axisLine={false} tickMargin={6} minTickGap={24} />
      <YAxis
        tickLine={false}
        axisLine={false}
        width={48}
        tickFormatter={(v: number) => formatTick(v, yFormat)}
      />
      <Tooltip content={<ChartTip yFormat={yFormat} />} cursor={{ fill: "var(--muted, #222)", opacity: 0.35 }} />
    </>
  );

  let plot: ReactNode;
  if (props.type === "bar") {
    plot = (
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap={2}>
        {axes}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId={stacked ? "stack" : undefined}
            fill={SLOT_COLORS[i]}
            // 2px surface gap between stacked segments; rounded data-end only on the
            // outermost mark (top segment when stacked, every bar when grouped).
            stroke={stacked ? "var(--background, #1a2329)" : undefined}
            strokeWidth={stacked ? 2 : 0}
            radius={!stacked || i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            maxBarSize={28}
          />
        ))}
      </BarChart>
    );
  } else if (props.type === "area") {
    plot = (
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        {axes}
        {series.map((s, i) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type="monotone"
            stackId={stacked ? "stack" : undefined}
            stroke={SLOT_COLORS[i]}
            strokeWidth={2}
            fill={SLOT_COLORS[i]}
            fillOpacity={0.15}
            dot={false}
          />
        ))}
      </AreaChart>
    );
  } else {
    plot = (
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        {axes}
        {series.map((s, i) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type="monotone"
            stroke={SLOT_COLORS[i]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    );
  }

  return (
    <div className="w-full">
      <div style={{ height }} className="w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {plot}
        </ResponsiveContainer>
      </div>
      <ChartLegend series={series} />
    </div>
  );
}
