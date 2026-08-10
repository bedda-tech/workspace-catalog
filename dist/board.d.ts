/**
 * The Board component definition — one purpose-built catalog entry for the kanban use
 * case (docs/data-connected-pages-design.md, "#board — the Board component" in Nozio's
 * data-connected-pages-design.md). Kanban-by-composition (Grid + repeat + per-column
 * filters) fights the spec language; this is one component instead.
 *
 * Board only emits events (move/open/add) — it never calls a mutation itself, so it stays
 * portable across surfaces. But json-render's `emit(event: string)` carries no payload
 * (verified against @json-render/react 0.18/0.19 — there is no `$event` prop expression),
 * so a per-card id/toValue can't ride the emit call directly. Board uses the SAME
 * mechanism shadcn's Input/Select already use for this exact problem: two bindable
 * "output" props (`activeCardId`, `moveTarget`) written via the synchronous state store
 * immediately before `emit` fires, so the bound action's `{ "$state": ... }` params read
 * the fresh value. See board-react.tsx for the write-then-emit call sites.
 */
import { z } from "zod";
export declare const boardItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodNullable<z.ZodString>;
    icon: z.ZodNullable<z.ZodString>;
    properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type BoardItem = z.infer<typeof boardItemSchema>;
/**
 * Shared by Board's cardFields and Table's cell rendering (table-react.tsx) so the same
 * property, viewed in either component, reads the same way — task 6349: a euros "value"
 * property rendered "42,000" in Table and raw "76000" in Board is the same bug reaching
 * the reader as two different-looking numbers for one property type. Neither component
 * carries full property-type metadata (Board's cardFields is just property-name strings),
 * so this formats by the value's OWN runtime type rather than a declared schema type —
 * cheap, and correct for the case that actually varies: numbers vs. everything else.
 */
export declare function formatPropertyValue(value: unknown): string;
export declare const boardPropsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodNullable<z.ZodString>;
        icon: z.ZodNullable<z.ZodString>;
        properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    groupBy: z.ZodString;
    columns: z.ZodNullable<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, z.core.$strip>>>;
    cardTitle: z.ZodString;
    cardFields: z.ZodNullable<z.ZodArray<z.ZodString>>;
    activeCardId: z.ZodNullable<z.ZodString>;
    moveTarget: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type BoardProps = z.infer<typeof boardPropsSchema>;
export declare const boardComponentDefinition: {
    readonly props: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodNullable<z.ZodString>;
            icon: z.ZodNullable<z.ZodString>;
            properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        groupBy: z.ZodString;
        columns: z.ZodNullable<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, z.core.$strip>>>;
        cardTitle: z.ZodString;
        cardFields: z.ZodNullable<z.ZodArray<z.ZodString>>;
        activeCardId: z.ZodNullable<z.ZodString>;
        moveTarget: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    readonly events: readonly ["move", "open", "add"];
    readonly description: string;
    readonly example: {
        readonly groupBy: "status";
        readonly columns: readonly [{
            readonly value: "todo";
            readonly label: "To do";
        }, {
            readonly value: "doing";
            readonly label: "Doing";
        }, {
            readonly value: "done";
            readonly label: "Done";
        }];
        readonly cardTitle: "title";
        readonly cardFields: readonly ["priority"];
    };
};
