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
import { boardItemSchema, boardMemberSchema, selectOptionSchema } from "./board.js";

export const tableColumnSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z
    .enum(["text", "number", "select", "multiSelect", "date", "checkbox", "person", "url", "assignee"])
    .describe(
      "Which editor the cell renders and how its value is displayed: select/multiSelect show " +
        "a picker, date a date input, checkbox a checkbox, assignee/person resolve through " +
        "the `members` prop to a display name, others a text/number field.",
    ),
  options: z
    .array(selectOptionSchema)
    .nullable()
    .describe(
      "Legal values for select/multiSelect columns, e.g. [{\"value\":\"todo\",\"label\":\"To Do\",\"color\":\"blue\"}]. " +
        "\"color\" is optional (default/gray/brown/orange/yellow/green/blue/purple/pink/red) and renders that option's " +
        "cell as a colored badge instead of plain text — set it for severity/priority/status-shaped columns.",
    ),
});
export type TableColumn = z.infer<typeof tableColumnSchema>;

export const tablePropsSchema = z.object({
  items: z
    .array(boardItemSchema)
    .describe("Rows to display, shaped like a dataSources projection: { id, title, icon, properties }. Bind to a dataSource with { \"$state\": \"/data/<key>\" } — the SAME shape and binding Board's items prop uses."),
  columns: z
    .array(tableColumnSchema)
    .nullable()
    .describe("Column order, labels and types, left to right. Bind to that dataSource's property schema with { \"$state\": \"/schemas/<key>\" }. Omit to derive plain text columns from the property keys found in items."),
  activeRowId: z
    .string()
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. Table writes the acted-on row's id here immediately before emitting editCell/deleteRow — read it back in the bound action with { \"$state\": \"<same path>\" }."),
  editValue: z
    .record(z.string(), z.unknown())
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. Table writes { [editedColumnKey]: newValue } here immediately before emitting editCell — bind the action's whole \"properties\" param to this path with { \"$state\": \"<same path>\" }, do not nest a specific key."),
  members: z
    .array(boardMemberSchema)
    .nullable()
    .describe(
      "Channel members (human + agent). BIND: { \"$state\": \"/members\" } whenever any " +
        "column is assignee or person typed, so that column's cells resolve to the member's " +
        "name instead of showing a raw stored userId/string.",
    ),
});
export type TableProps = z.infer<typeof tablePropsSchema>;

export const tableComponentDefinition = {
  props: tablePropsSchema,
  events: ["editCell", "addRow", "deleteRow", "open"],
  description:
    "Editable grid over a list of pages, usually a dataSources entry — click a cell to edit it in place " +
    "(the editor matches the column type: select shows a picker, date a date input, checkbox a checkbox), " +
    "add a row from the control at the bottom, delete a row with its row control, or open a row's detail " +
    "view with its expand control. Emits editCell { activeRowId, editValue } when a cell commits a new " +
    "value, addRow {} from the add-row control, deleteRow { activeRowId } from a row's delete control, and " +
    "open { activeRowId } from a row's expand control (the host surface handles opening the detail view " +
    "itself — on.open rarely needs to be bound). Table never mutates data itself — bind on.editCell " +
    "to updatePage (id: { \"$state\": <activeRowId path> }, properties: { \"$state\": <editValue path> }), " +
    "on.addRow to createPage (parent: \"<dataSourceName>\"), and on.deleteRow to deletePage " +
    "(id: { \"$state\": <activeRowId path> }). REQUIRED: activeRowId and editValue must BOTH be " +
    "{ \"$bindState\": \"<path>\" } — never omitted, never a literal. Without them the write has " +
    "nowhere to land: a cell edit visibly changes then silently reverts on commit, with zero error. " +
    "A select/multiSelect column with no per-option \"color\" set renders every value as the same " +
    "flat neutral pill — set one for severity/priority/status-shaped columns (e.g. low=gray, " +
    "medium=yellow, high=orange, critical=red) so values read as visually distinct, not just " +
    "distinguishable by their text. An assignee/person column renders a raw stored " +
    "userId/string unless `members` is also bound — set it whenever any column is assignee " +
    "or person typed.",
  example: {
    items: { $state: "/data/tasks" },
    columns: { $state: "/schemas/tasks" },
    activeRowId: { $bindState: "/ui/tasks/activeRowId" },
    editValue: { $bindState: "/ui/tasks/editValue" },
    members: { $state: "/members" },
  },
  // activeRowId/editValue MUST both be `{"$bindState":"<path>"}` — never omitted, never a
  // literal — or a cell edit visibly happens then silently reverts (task 6512): Table
  // writes into these two props right before emitting editCell/deleteRow, and the bound
  // action's `{"$state":"<same path>"}` read has nothing to read if they weren't wired.
  requiredBindStateProps: ["activeRowId", "editValue"],
} as const;
