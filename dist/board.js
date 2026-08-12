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
export const selectOptionSchema = z.object({
    value: z.string(),
    label: z.string().nullable(),
    color: z.string().nullable(),
});
/**
 * Notion's own select-color palette (default/gray/brown/orange/yellow/green/blue/purple/
 * pink/red) — reused verbatim rather than inventing our own names, so an imported schema's
 * colors need no translation. Values are full literal Tailwind class strings (not built by
 * interpolation) so the workspace app's `@source` scan of this package's dist output picks
 * them up — see workspace repo src/styles.css for why interpolated classes silently vanish.
 * Tuned for the app's single dark theme (background ~#0b1220): no dark: variants needed.
 */
export const SELECT_COLOR_CLASS = {
    default: "bg-muted text-muted-foreground",
    gray: "bg-slate-500/15 text-slate-300",
    brown: "bg-amber-800/25 text-amber-500",
    orange: "bg-orange-500/15 text-orange-400",
    yellow: "bg-yellow-500/15 text-yellow-300",
    green: "bg-emerald-500/15 text-emerald-400",
    blue: "bg-blue-500/15 text-blue-400",
    purple: "bg-purple-500/15 text-purple-400",
    pink: "bg-pink-500/15 text-pink-400",
    red: "bg-red-500/15 text-red-400",
};
/** Falls back to the plain neutral pill an uncolored option already rendered as. */
export function selectOptionColorClass(color) {
    if (!color)
        return SELECT_COLOR_CLASS.default;
    return SELECT_COLOR_CLASS[color] ?? SELECT_COLOR_CLASS.default;
}
/** Board's cardFields is a bare list of property-name strings (see below) — this is the
 * optional companion that gives cardFields access to each field's select options and type,
 * so a severity/priority/status-shaped card badge can be colored instead of a flat neutral
 * pill for every value, and an assignee/person-shaped badge can be resolved through
 * `members` instead of shown raw. Bind to the SAME "/schemas/<name>" path Table's `columns`
 * prop uses (task 6593) — extra PropertyDef fields (name/required/defaultValue) beyond
 * key/type/options are simply ignored here. */
export const cardFieldSchemaEntrySchema = z.object({
    key: z.string(),
    type: z.string().nullable(),
    options: z.array(selectOptionSchema).nullable(),
});
/**
 * A channel member (human or agent) — the SAME shape convex/channels.ts `members` query
 * returns. "assignee" properties store a member's userId (convex/properties.ts); "person"
 * properties store free-text that MAY happen to match a member's name. Both need this list
 * to render as a name instead of a raw id/string that only means something to the database.
 */
export const boardMemberSchema = z.object({
    userId: z.string(),
    name: z.string(),
    kind: z.enum(["human", "agent"]).nullable(),
});
/**
 * Resolves an "assignee" (member userId) or "person" (free-text name that may match a
 * member) value to a display name — agent-kind members get the same 🤖 prefix
 * RecordPanel.tsx's assignee/person pickers already use, so a card or cell reads the same
 * way the record's own edit form does. Falls back to the raw stored value when nothing
 * matches (no `members` bound yet, or the member was since removed) — never blanks a real
 * stored value out from under the reader.
 */
export function resolveMemberDisplay(members, value) {
    if (value === null || value === undefined || value === "")
        return "";
    const raw = String(value);
    const match = (members ?? []).find((m) => m.userId === raw || m.name === raw);
    if (!match)
        return raw;
    return match.kind === "agent" ? `🤖 ${match.name}` : match.name;
}
/**
 * Shared by Board's cardFields and Table's cell rendering (table-react.tsx) so the same
 * property, viewed in either component, reads the same way — task 6349: a euros "value"
 * property rendered "42,000" in Table and raw "76000" in Board is the same bug reaching
 * the reader as two different-looking numbers for one property type. Neither component
 * carries full property-type metadata (Board's cardFields is just property-name strings),
 * so this formats by the value's OWN runtime type rather than a declared schema type —
 * cheap, and correct for the case that actually varies: numbers vs. everything else.
 *
 * Task 6476: date-typed properties are stored as `Date.toISOString()` (convex/properties.ts),
 * always exactly `YYYY-MM-DDTHH:mm:ss.sssZ` — a narrow, unambiguous pattern, so it can be
 * detected from the raw string alone without threading column/schema type info into Board.
 */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
export function formatPropertyValue(value) {
    if (value === null || value === undefined)
        return "";
    if (typeof value === "number")
        return value.toLocaleString();
    if (typeof value === "string" && ISO_DATE_RE.test(value)) {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime()))
            return d.toLocaleDateString();
    }
    return String(value);
}
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
    cardFieldSchemas: z
        .array(cardFieldSchemaEntrySchema)
        .nullable()
        .describe("Property definitions for cardFields, so select-type badges can be colored instead of " +
        "one flat neutral pill for every value. Bind the WHOLE array to that dataSource's " +
        "schema: { \"$state\": \"/schemas/<name>\" } — same array Table's columns prop binds. " +
        "Set this whenever any cardFields entry is select/multiSelect-typed."),
    activeCardId: z
        .string()
        .nullable()
        .describe("Bind with { \"$bindState\": \"<path>\" }. Board writes the acted-on card's id here immediately before emitting move/open — read it back in the bound action with { \"$state\": \"<same path>\" }."),
    moveTarget: z
        .string()
        .nullable()
        .describe("Bind with { \"$bindState\": \"<path>\" }. Board writes the destination column's value here immediately before emitting move/add — read it back the same way as activeCardId."),
    members: z
        .array(boardMemberSchema)
        .nullable()
        .describe("Channel members (human + agent). BIND: { \"$state\": \"/members\" } whenever any " +
        "cardFields entry is assignee or person typed, so that field resolves to the " +
        "member's name instead of showing a raw stored userId/string. Requires " +
        "cardFieldSchemas to also be bound (Board needs each field's declared type to know " +
        "which ones to resolve this way)."),
});
export const boardComponentDefinition = {
    props: boardPropsSchema,
    events: ["move", "open", "add"],
    description: "Kanban board over a list of pages, usually a dataSources entry. Groups items into columns by groupBy. " +
        "Emits move { activeCardId, moveTarget } when a card is moved a column, open { activeCardId } when a card's " +
        "title is clicked (the host surface opens a record detail view itself — on.open rarely needs to be bound), " +
        "add { moveTarget } from a column's add control. Board never mutates data itself — bind on.move " +
        "to updatePage (id: { \"$state\": <activeCardId path> }, properties: { [groupBy]: { \"$state\": <moveTarget path> } }), " +
        "and on.add to createPage (properties: { [groupBy]: { \"$state\": <moveTarget path> } }). " +
        "A cardFields badge for a select/multiSelect property renders a flat neutral pill unless " +
        "cardFieldSchemas is also bound — set both together whenever a cardFields entry is a " +
        "severity/priority/status-shaped select, so critical reads as visually distinct from low " +
        "at a glance instead of only by its text label. An assignee/person cardFields entry " +
        "renders a raw stored userId/string unless `members` is ALSO bound (in addition to " +
        "cardFieldSchemas) — set both whenever a cardFields entry is assignee or person typed.",
    example: {
        groupBy: "status",
        columns: [
            { value: "todo", label: "To do" },
            { value: "doing", label: "Doing" },
            { value: "done", label: "Done" },
        ],
        cardTitle: "title",
        cardFields: ["priority", "owner"],
        cardFieldSchemas: { $state: "/schemas/tasks" },
        members: { $state: "/members" },
    },
};
