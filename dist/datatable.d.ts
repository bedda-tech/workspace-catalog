/**
 * The DataTablePreview / DataTableDetail fidelity pair — Matt's explicit ask (2026-08-05):
 * "a smaller focused table as a preview and a way to drill into that data with a more
 * complex robust detailed view." Airtable's grid (compact view -> expanded record) is the
 * quality bar (memory/research/generative-workspace-competitors-*.md).
 *
 * This is the FIRST (component, fidelity, source) pair — the convention other data-bound
 * components should follow (calendars/agendas next): two components, same `items`/`columns`
 * binding shape as each other (and as Table, for a composed page that wants both fidelities
 * of the SAME dataSource), where Preview is read-only/truncated and Detail is the full
 * interactive surface. Preview's `open` event is meant to be bound to the shared `navigate`
 * action (actions.ts) — drilling in is "go to a page/route that renders Detail over the same
 * source", not a modal Table renders itself, so a promoted Nozio page can wire it too.
 *
 * DataTableDetail is deliberately NOT a rewrite of Table: it reuses Table's exact cell
 * read/format/edit functions (table-react.tsx) and adds client-side search/sort/pagination
 * as view-only state. That state is intentionally NOT bound like activeRowId/editValue are —
 * nothing ever needs to read a sort column or a search string back out of an action, so
 * making it bindable would just be an unused prop the composing agent could get wrong.
 */
import { z } from "zod";
import { tableColumnSchema } from "./table.js";
export { tableColumnSchema };
export type { TableColumn } from "./table.js";
export declare const dataTablePreviewPropsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodNullable<z.ZodString>;
        icon: z.ZodNullable<z.ZodString>;
        properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    columns: z.ZodNullable<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<{
            number: "number";
            date: "date";
            assignee: "assignee";
            person: "person";
            text: "text";
            select: "select";
            multiSelect: "multiSelect";
            checkbox: "checkbox";
            url: "url";
        }>;
        options: z.ZodNullable<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodNullable<z.ZodString>;
            color: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    maxRows: z.ZodNullable<z.ZodNumber>;
    activeRowId: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type DataTablePreviewProps = z.infer<typeof dataTablePreviewPropsSchema>;
export declare const dataTablePreviewComponentDefinition: {
    readonly props: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodNullable<z.ZodString>;
            icon: z.ZodNullable<z.ZodString>;
            properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        columns: z.ZodNullable<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            name: z.ZodString;
            type: z.ZodEnum<{
                number: "number";
                date: "date";
                assignee: "assignee";
                person: "person";
                text: "text";
                select: "select";
                multiSelect: "multiSelect";
                checkbox: "checkbox";
                url: "url";
            }>;
            options: z.ZodNullable<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodNullable<z.ZodString>;
                color: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
        maxRows: z.ZodNullable<z.ZodNumber>;
        activeRowId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    readonly events: readonly ["open"];
    readonly description: string;
    readonly example: {
        readonly items: {
            readonly $state: "/data/deals";
        };
        readonly columns: {
            readonly $state: "/schemas/deals";
        };
        readonly maxRows: 5;
        readonly activeRowId: {
            readonly $bindState: "/ui/deals/previewActiveRowId";
        };
    };
    readonly requiredBindStateProps: readonly ["activeRowId"];
};
export declare const dataTableDetailPropsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodNullable<z.ZodString>;
        icon: z.ZodNullable<z.ZodString>;
        properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    columns: z.ZodNullable<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<{
            number: "number";
            date: "date";
            assignee: "assignee";
            person: "person";
            text: "text";
            select: "select";
            multiSelect: "multiSelect";
            checkbox: "checkbox";
            url: "url";
        }>;
        options: z.ZodNullable<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodNullable<z.ZodString>;
            color: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    searchable: z.ZodNullable<z.ZodBoolean>;
    sortable: z.ZodNullable<z.ZodBoolean>;
    pageSize: z.ZodNullable<z.ZodNumber>;
    activeRowId: z.ZodNullable<z.ZodString>;
    editValue: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type DataTableDetailProps = z.infer<typeof dataTableDetailPropsSchema>;
export declare const dataTableDetailComponentDefinition: {
    readonly props: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodNullable<z.ZodString>;
            icon: z.ZodNullable<z.ZodString>;
            properties: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        columns: z.ZodNullable<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            name: z.ZodString;
            type: z.ZodEnum<{
                number: "number";
                date: "date";
                assignee: "assignee";
                person: "person";
                text: "text";
                select: "select";
                multiSelect: "multiSelect";
                checkbox: "checkbox";
                url: "url";
            }>;
            options: z.ZodNullable<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodNullable<z.ZodString>;
                color: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
        searchable: z.ZodNullable<z.ZodBoolean>;
        sortable: z.ZodNullable<z.ZodBoolean>;
        pageSize: z.ZodNullable<z.ZodNumber>;
        activeRowId: z.ZodNullable<z.ZodString>;
        editValue: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
    readonly events: readonly ["editCell", "addRow", "deleteRow"];
    readonly description: string;
    readonly example: {
        readonly items: {
            readonly $state: "/data/deals";
        };
        readonly columns: {
            readonly $state: "/schemas/deals";
        };
        readonly searchable: true;
        readonly sortable: true;
        readonly pageSize: 20;
        readonly activeRowId: {
            readonly $bindState: "/ui/deals/activeRowId";
        };
        readonly editValue: {
            readonly $bindState: "/ui/deals/editValue";
        };
    };
    readonly requiredBindStateProps: readonly ["activeRowId", "editValue"];
};
