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
export declare const chartSeriesSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
}, z.core.$strip>;
export type ChartSeries = z.infer<typeof chartSeriesSchema>;
export declare const chartPropsSchema: z.ZodObject<{
    type: z.ZodEnum<{
        bar: "bar";
        line: "line";
        area: "area";
    }>;
    data: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNull]>>>;
    xKey: z.ZodString;
    series: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
    }, z.core.$strip>>;
    stacked: z.ZodNullable<z.ZodBoolean>;
    height: z.ZodNullable<z.ZodNumber>;
    yFormat: z.ZodNullable<z.ZodEnum<{
        number: "number";
        currency: "currency";
        percent: "percent";
    }>>;
}, z.core.$strip>;
export type ChartProps = z.infer<typeof chartPropsSchema>;
export declare const chartComponentDefinition: {
    readonly props: z.ZodObject<{
        type: z.ZodEnum<{
            bar: "bar";
            line: "line";
            area: "area";
        }>;
        data: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNull]>>>;
        xKey: z.ZodString;
        series: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            label: z.ZodString;
        }, z.core.$strip>>;
        stacked: z.ZodNullable<z.ZodBoolean>;
        height: z.ZodNullable<z.ZodNumber>;
        yFormat: z.ZodNullable<z.ZodEnum<{
            number: "number";
            currency: "currency";
            percent: "percent";
        }>>;
    }, z.core.$strip>;
    readonly events: readonly [];
    readonly description: string;
    readonly example: {
        readonly type: "line";
        readonly data: readonly [{
            readonly month: "May";
            readonly income: 6400;
            readonly spend: 5100;
        }, {
            readonly month: "Jun";
            readonly income: 6449;
            readonly spend: 4772;
        }, {
            readonly month: "Jul";
            readonly income: 6580;
            readonly spend: 4390;
        }];
        readonly xKey: "month";
        readonly series: readonly [{
            readonly key: "income";
            readonly label: "Income";
        }, {
            readonly key: "spend";
            readonly label: "Spend";
        }];
        readonly stacked: null;
        readonly height: null;
        readonly yFormat: "currency";
    };
};
