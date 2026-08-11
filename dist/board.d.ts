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
 * Shared by Table's column options (table.ts) and Board's cardFieldSchemas below — one
 * option shape for both, so a color set on a select property (convex/properties.ts
 * PropertyOption, or imported straight from Notion's own select color) means the same
 * thing and renders the same way everywhere that property shows up. "color" is Notion's
 * own palette name (see SELECT_COLOR_CLASS) rather than a raw CSS value: a closed enum a
 * validator can check, and it lets a Notion-imported schema's colors work unmodified
 * (convex/notion.ts already copies o.color through on import — task 6593 found nothing
 * downstream ever read it).
 */
export declare const selectOptionSchema: z.ZodObject<{
    value: z.ZodString;
    label: z.ZodNullable<z.ZodString>;
    color: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type SelectOption = z.infer<typeof selectOptionSchema>;
/**
 * Notion's own select-color palette (default/gray/brown/orange/yellow/green/blue/purple/
 * pink/red) — reused verbatim rather than inventing our own names, so an imported schema's
 * colors need no translation. Values are full literal Tailwind class strings (not built by
 * interpolation) so the workspace app's `@source` scan of this package's dist output picks
 * them up — see workspace repo src/styles.css for why interpolated classes silently vanish.
 * Tuned for the app's single dark theme (background ~#0b1220): no dark: variants needed.
 */
export declare const SELECT_COLOR_CLASS: Record<string, string>;
/** Falls back to the plain neutral pill an uncolored option already rendered as. */
export declare function selectOptionColorClass(color: string | null | undefined): string;
/** Board's cardFields is a bare list of property-name strings (see below) — this is the
 * optional companion that gives cardFields access to each field's select options, so a
 * severity/priority/status-shaped card badge can be colored instead of a flat neutral
 * pill for every value. Bind to the SAME "/schemas/<name>" path Table's `columns` prop
 * uses (task 6593) — extra PropertyDef fields (name/type/required/defaultValue) beyond
 * key/options are simply ignored here. */
export declare const cardFieldSchemaEntrySchema: z.ZodObject<{
    key: z.ZodString;
    options: z.ZodNullable<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodNullable<z.ZodString>;
        color: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CardFieldSchemaEntry = z.infer<typeof cardFieldSchemaEntrySchema>;
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
    cardFieldSchemas: z.ZodNullable<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        options: z.ZodNullable<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodNullable<z.ZodString>;
            color: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
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
        cardFieldSchemas: z.ZodNullable<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            options: z.ZodNullable<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodNullable<z.ZodString>;
                color: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
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
        readonly cardFieldSchemas: {
            readonly $state: "/schemas/tasks";
        };
    };
};
