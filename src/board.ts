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

export const boardItemSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  icon: z.string().nullable(),
  properties: z.record(z.string(), z.unknown()).nullable(),
});
export type BoardItem = z.infer<typeof boardItemSchema>;

export const boardPropsSchema = z.object({
  items: z
    .array(boardItemSchema)
    .describe("Rows to display, shaped like a dataSources projection: { id, title, icon, properties }. Bind to a dataSource with { \"$state\": \"/data/<key>\" }."),
  groupBy: z.string().describe("Property name each item is grouped by, e.g. \"status\". Read from item.properties[groupBy]."),
  columns: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .nullable()
    .describe("Column order and labels, left to right. Omit to derive columns from the distinct groupBy values found in items."),
  cardTitle: z
    .string()
    .describe('Field shown as each card\'s title: "id", "title", "icon", or a property name (read from item.properties).'),
  cardFields: z
    .array(z.string())
    .nullable()
    .describe("Extra property names shown as small badges on each card."),
  activeCardId: z
    .string()
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. Board writes the acted-on card's id here immediately before emitting move/open — read it back in the bound action with { \"$state\": \"<same path>\" }."),
  moveTarget: z
    .string()
    .nullable()
    .describe("Bind with { \"$bindState\": \"<path>\" }. Board writes the destination column's value here immediately before emitting move/add — read it back the same way as activeCardId."),
});
export type BoardProps = z.infer<typeof boardPropsSchema>;

export const boardComponentDefinition = {
  props: boardPropsSchema,
  events: ["move", "open", "add"],
  description:
    "Kanban board over a list of pages, usually a dataSources entry. Groups items into columns by groupBy. " +
    "Emits move { activeCardId, moveTarget } when a card is moved a column, open { activeCardId } when a card's " +
    "title is clicked (the host surface opens a record detail view itself — on.open rarely needs to be bound), " +
    "add { moveTarget } from a column's add control. Board never mutates data itself — bind on.move " +
    "to updatePage (id: { \"$state\": <activeCardId path> }, properties: { [groupBy]: { \"$state\": <moveTarget path> } }), " +
    "and on.add to createPage (properties: { [groupBy]: { \"$state\": <moveTarget path> } }).",
  example: {
    groupBy: "status",
    columns: [
      { value: "todo", label: "To do" },
      { value: "doing", label: "Doing" },
      { value: "done", label: "Done" },
    ],
    cardTitle: "title",
    cardFields: ["priority"],
  },
} as const;
