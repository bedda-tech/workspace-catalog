/**
 * The Table component definition — the editable database-grid use case
 * (projects/GENERATIVE-WORKSPACE-ROADMAP.md, Phase 1.3 "Editable Table view"). Before
 * this, Table was `@json-render/shadcn`'s generic display component: `rows: string[][]`,
 * `columns: string[]` — plain cell strings with no record identity, so nothing could be
 * written back. Notion's table is the default way people touch a database; ours could
 * only be looked at.
 *
 * Table follows the same "never mutate data itself" shape Board established: it only
 * emits editCell/addRow/deleteRow, and the bound action performs the real write
 * (updatePage/createPage/deletePage) so the component stays portable across surfaces.
 * A cell's column key is only known at CLICK time, not when the agent authors the spec —
 * unlike Board's `groupBy` (one fixed property name known up front), a table has N
 * columns. So instead of nesting `{ properties: { [key]: {"$state":...} } }` in the
 * action params (which would need the key baked in at spec-authoring time), Table writes
 * the WHOLE patch object — `{ [column.key]: newValue }` — into `editValue` itself before
 * emitting. The bound action then reads `properties: {"$state": <editValue path>}` as one
 * value, never needing to know which key changed. Same write-then-emit mechanism
 * board.ts uses for activeCardId/moveTarget, generalized to a dynamic key.
 */
import { z } from "zod";
export declare const tableColumnSchema: z.ZodObject<{
    key: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<{
        number: "number";
        date: "date";
        text: "text";
        select: "select";
        multiSelect: "multiSelect";
        checkbox: "checkbox";
        person: "person";
        url: "url";
    }>;
    options: z.ZodNullable<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type TableColumn = z.infer<typeof tableColumnSchema>;
export declare const tablePropsSchema: z.ZodObject<{
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
            text: "text";
            select: "select";
            multiSelect: "multiSelect";
            checkbox: "checkbox";
            person: "person";
            url: "url";
        }>;
        options: z.ZodNullable<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    activeRowId: z.ZodNullable<z.ZodString>;
    editValue: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type TableProps = z.infer<typeof tablePropsSchema>;
export declare const tableComponentDefinition: {
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
                text: "text";
                select: "select";
                multiSelect: "multiSelect";
                checkbox: "checkbox";
                person: "person";
                url: "url";
            }>;
            options: z.ZodNullable<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
        activeRowId: z.ZodNullable<z.ZodString>;
        editValue: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
    readonly events: readonly ["editCell", "addRow", "deleteRow", "open"];
    readonly description: string;
    readonly example: {
        readonly items: {
            readonly $state: "/data/tasks";
        };
        readonly columns: {
            readonly $state: "/schemas/tasks";
        };
        readonly activeRowId: {
            readonly $bindState: "/ui/tasks/activeRowId";
        };
        readonly editValue: {
            readonly $bindState: "/ui/tasks/editValue";
        };
    };
    readonly requiredBindStateProps: readonly ["activeRowId", "editValue"];
};
