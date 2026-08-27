/**
 * The Chart component definition — trend/comparison visualisation for generated pages
 * and chat ui blocks (decision #8140, 2026-08-27). Before this the catalog had no way
 * to plot anything: a generated "metrics" page could show numbers only as Table rows
 * or prose, so change-over-time — the one thing a table is worst at — had no form.
 *
 * Deliberately small: three cartesian forms (bar/line/area), one x key, 1–4 series.
 * Four series is a hard cap, not a default — the palette underneath has exactly four
 * CVD-validated categorical slots (the dataviz method's --chart-1..4 host tokens), and
 * a fifth hue would be a generated color no validator passed. More than 4 series folds
 * into "Other", a Table, or two Charts. No dual axis, ever: two measures of different
 * scale are two Charts.
 *
 * Chart is display-only (events: []) — it never mutates data and emits nothing. Its
 * `data` prop follows Board/Table's dataSource conventions so a page chart can bind
 * live records, while a chat ui block passes literal rows.
 */
import { z } from "zod";

export const chartSeriesSchema = z.object({
  key: z.string().describe("Property in each data row holding this series' numeric value."),
  label: z.string().describe("Display name for the series — used by the legend and tooltip."),
});
export type ChartSeries = z.infer<typeof chartSeriesSchema>;

export const chartPropsSchema = z.object({
  type: z
    .enum(["bar", "line", "area"])
    .describe(
      "Pick by the data's job, not by taste: bar for discrete comparisons or few-bucket " +
        "time series, line for continuous change over time, area only when the filled " +
        "magnitude itself is the point (e.g. cumulative totals).",
    ),
  data: z
    .array(z.record(z.string(), z.union([z.string(), z.number(), z.null()])))
    .describe(
      "Rows in x order (oldest first for time series). Literal rows in a chat block, or " +
        'bind a dataSources projection with { "$state": "/data/<key>" } on a page.',
    ),
  xKey: z
    .string()
    .describe("Property in each row giving the x value (a category name or a date label)."),
  series: z
    .array(chartSeriesSchema)
    .min(1)
    .max(4)
    .describe(
      "1–4 series in the order they should be colored — colors are assigned by position " +
        "from the host's four validated chart slots, never invented per-series. More than " +
        "4 series: fold the tail into an 'Other' row, use a Table, or split into two Charts.",
    ),
  stacked: z
    .boolean()
    .nullable()
    .describe(
      "Stack the series (bar/area only) — use for part-to-whole composition; leave null " +
        "to group side by side. Ignored for line.",
    ),
  height: z
    .number()
    .nullable()
    .describe("Plot height in px. Default 200; keep at or under 280 in chat ui blocks."),
  yFormat: z
    .enum(["number", "currency", "percent"])
    .nullable()
    .describe(
      "Number format for the y axis and tooltip. currency renders $ (2dp in tooltips, " +
        "compact axis ticks); percent appends % and expects 0–100 values, it multiplies " +
        "nothing. Null means plain numbers.",
    ),
});
export type ChartProps = z.infer<typeof chartPropsSchema>;

export const chartComponentDefinition = {
  props: chartPropsSchema,
  events: [],
  description:
    "A small cartesian chart — bar, line, or area — for trends and comparisons. Display-only: " +
    "no events, never mutates data. Colors come from the host surface's validated chart palette " +
    "in fixed positional order; a legend renders automatically for 2+ series (a single series " +
    "is named by the surrounding Heading/Card title, so it gets none); every mark has a hover " +
    "tooltip. Hard limits by design: max 4 series (the palette has exactly 4 validated slots) " +
    "and one y axis (two measures of different scale are two Charts, never a dual axis). For a " +
    "single current value use Text/Badge in a Card, not a one-bar Chart; for exact lookup of " +
    "many numbers use Table; for a ratio against a limit use Progress.",
  example: {
    type: "line",
    data: [
      { month: "May", income: 6400, spend: 5100 },
      { month: "Jun", income: 6449, spend: 4772 },
      { month: "Jul", income: 6580, spend: 4390 },
    ],
    xKey: "month",
    series: [
      { key: "income", label: "Income" },
      { key: "spend", label: "Spend" },
    ],
    stacked: null,
    height: null,
    yFormat: "currency",
  },
} as const;
