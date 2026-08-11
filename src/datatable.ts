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
import { boardItemSchema } from "./board.js";
import { tableColumnSchema } from "./table.js";

export { tableColumnSchema };
export type { TableColumn } from "./table.js";

export const dataTablePreviewPropsSchema = z.object({
  items: z
    .array(boardItemSchema)
    .describe("Rows to display, shaped like a dataSources projection: { id, title, icon, properties }. Bind to a dataSource with { \"$state\": \"/data/<key>\" } — the SAME source and shape DataTableDetail binds, so the pair reads as one dataset at two fidelities."),
  columns: z
    .array(tableColumnSchema)
    .nullable()
    .describe("Column order, labels and types, left to right — keep this list SHORT (2-4 columns) since Preview's whole point is compactness. Bind to that dataSource's property schema with { \"$state\": \"/schemas/<key>\" }, or pass a hand-picked subset. Omit to derive plain text columns from the property keys found in items."),
  maxRows: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe("Caps how many rows render, earliest-first. Defaults to 5 when omitted. This is what keeps a Preview a preview instead of a second full Table — always pair it with a drill-in control to DataTableDetail rather than raising this to show everything."),
  activeRowId: z
    .string()
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. DataTablePreview writes the clicked row's id here immediately before emitting open — read it back in the bound navigate action, e.g. via an href built from { \"$state\": \"<same path>\" }, or ignore it and navigate to a fixed detail route."),
});
export type DataTablePreviewProps = z.infer<typeof dataTablePreviewPropsSchema>;

export const dataTablePreviewComponentDefinition = {
  props: dataTablePreviewPropsSchema,
  events: ["open"],
  description:
    "Read-only, compact preview of a data source — the smaller half of the preview/detail " +
    "fidelity pair (pair with DataTableDetail bound to the SAME items/columns source). Shows " +
    "at most `maxRows` rows (default 5) and however few columns you give it; no add/edit/delete " +
    "controls, just a glance at the data. Clicking a row emits open { activeRowId }. Bind " +
    "on.open to the shared navigate action so the row's id is available to route to a detail " +
    "view (e.g. a page rendering DataTableDetail over the same dataSource). REQUIRED: " +
    "activeRowId must be { \"$bindState\": \"<path>\" } — never omitted, never a literal, or " +
    "the click has nowhere to write the row id and drill-in silently does nothing.",
  example: {
    items: { $state: "/data/deals" },
    columns: { $state: "/schemas/deals" },
    maxRows: 5,
    activeRowId: { $bindState: "/ui/deals/previewActiveRowId" },
  },
  requiredBindStateProps: ["activeRowId"],
} as const;

export const dataTableDetailPropsSchema = z.object({
  items: z
    .array(boardItemSchema)
    .describe("Rows to display, shaped like a dataSources projection: { id, title, icon, properties }. Bind to the SAME dataSource DataTablePreview binds with { \"$state\": \"/data/<key>\" } — the fidelity pair reads one dataset, not two."),
  columns: z
    .array(tableColumnSchema)
    .nullable()
    .describe("Column order, labels and types, left to right. Bind to that dataSource's property schema with { \"$state\": \"/schemas/<key>\" } — give it the FULL column set here, unlike Preview's short list. Omit to derive plain text columns from the property keys found in items."),
  searchable: z
    .boolean()
    .nullable()
    .describe("Shows a search box that filters rows by any visible cell's text, client-side. Defaults to true."),
  sortable: z
    .boolean()
    .nullable()
    .describe("Makes column headers clickable to sort ascending/descending/unsorted, client-side. Defaults to true."),
  pageSize: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe("Rows per page, with Prev/Next controls, client-side. Omit to show every row with no pagination."),
  activeRowId: z
    .string()
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. DataTableDetail writes the acted-on row's id here immediately before emitting editCell/deleteRow — read it back in the bound action with { \"$state\": \"<same path>\" }."),
  editValue: z
    .record(z.string(), z.unknown())
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. DataTableDetail writes { [editedColumnKey]: newValue } here immediately before emitting editCell — bind the action's whole \"properties\" param to this path with { \"$state\": \"<same path>\" }, do not nest a specific key."),
});
export type DataTableDetailProps = z.infer<typeof dataTableDetailPropsSchema>;

export const dataTableDetailComponentDefinition = {
  props: dataTableDetailPropsSchema,
  events: ["editCell", "addRow", "deleteRow"],
  description:
    "Full interactive grid over a data source — the larger half of the preview/detail " +
    "fidelity pair (pair with DataTablePreview bound to the SAME items/columns source). " +
    "Everything Table does (click a cell to edit it in place, add/delete rows) PLUS a " +
    "client-side search box (searchable, default true), sortable column headers " +
    "(sortable, default true), and Prev/Next pagination when pageSize is set. Emits " +
    "editCell { activeRowId, editValue } when a cell commits a new value, addRow {} from " +
    "the add-row control, and deleteRow { activeRowId } from a row's delete control — bind " +
    "the same way Table does: on.editCell to updatePage, on.addRow to createPage, " +
    "on.deleteRow to deletePage. REQUIRED: activeRowId and editValue must BOTH be " +
    "{ \"$bindState\": \"<path>\" } — never omitted, never a literal.",
  example: {
    items: { $state: "/data/deals" },
    columns: { $state: "/schemas/deals" },
    searchable: true,
    sortable: true,
    pageSize: 20,
    activeRowId: { $bindState: "/ui/deals/activeRowId" },
    editValue: { $bindState: "/ui/deals/editValue" },
  },
  requiredBindStateProps: ["activeRowId", "editValue"],
} as const;
