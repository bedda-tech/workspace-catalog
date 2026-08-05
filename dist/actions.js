/**
 * The shared actions — the part of the workspace only Familiar had.
 *
 * json-render ships the render half: catalog, validation, streaming, bindings. What it does
 * not ship is what Familiar's chat learned the hard way about COLLECTING A DECISION:
 *
 * - An answer must be an ordinary message. It logs, replays, and is auditable — the model
 *   reads it back like any other turn, and no second wire protocol exists to drift.
 * - Every answer carries an optional free-text `note`. Matt, 2026-08-03: "my answers aren't
 *   so black and white so I need to give feedback." His TorGuard answer is the proof: the
 *   button said cancel, the note held the real constraint, and the note was the answer.
 * - An answer is retractable. The value `__undo__` un-answers — a tap once committed a
 *   co-founder decision made while demoing to a friend. Retraction is itself an ordinary
 *   message, so the record shows both the answer and the taking-back, never an edited past.
 *
 * These are DEFINITIONS (name + params + AI description). Each surface registers its own
 * handler: Familiar routes `answer` into its chat send pipeline as `[ask:<id>] <json>`;
 * Nozio can route it into a page's data model. A spec using them validates identically on
 * both surfaces, which is what keeps promotion a database write.
 */
import { z } from "zod";
export const RETRACTION_VALUE = "__undo__";
export const answerParams = z.object({
    /** Correlates the answer to the question, like an ask card's id. */
    id: z.string().min(1),
    /** The structured answer. Bind an input's value with a dynamic $state reference. */
    value: z.unknown(),
    /** Free-text context. Not decoration — frequently the actual answer. */
    note: z.string().optional(),
});
export const navigateParams = z.object({
    /** Internal route only ("/tasks"). External URLs are a phishing surface in a chat bubble. */
    href: z.string().startsWith("/", "href must be an internal route starting with /"),
});
/**
 * The write half of dataSources (docs/data-connected-pages-design.md, "Data actions").
 * A `dataSources` entry reads a database of pages; these three actions are the only way
 * a spec may write to one. Each surface maps them onto its own real mutations — Nozio
 * onto `documents.create` / `update` / `updateProperties` / `archive` — so a generated
 * button or input performs a real CRUD op, never a local-state simulation of one.
 */
export const createPageParams = z.object({
    /** The database (parent page) this row belongs to — bind to a dataSource's `parent`. */
    parent: z.string().min(1),
    title: z.string().min(1),
    /** Seeds custom fields using the property names from that database's schema. */
    properties: z.record(z.string(), z.unknown()).optional(),
});
export const updatePageParams = z.object({
    id: z.string().min(1),
    title: z.string().optional(),
    /** Shallow-merged onto the page's existing properties — only passed keys change. */
    properties: z.record(z.string(), z.unknown()).optional(),
});
export const deletePageParams = z.object({
    id: z.string().min(1),
});
export const sharedActions = {
    answer: {
        params: answerParams,
        description: "Send the user's decision back to the conversation as an auditable message. " +
            "Use for any button that commits a choice. Include a stable `id` so the answer " +
            "correlates to the question; pass `__undo__` as the value on an Undo control. " +
            "Always offer a way to add a free-text note — answers are rarely black and white.",
    },
    navigate: {
        params: navigateParams,
        description: "Go to an internal page of the workspace, e.g. /tasks or /finance/debt. " +
            "Internal routes only — never an external URL.",
    },
    createPage: {
        params: createPageParams,
        description: "Create a new page (row) in a workspace database. `parent` must be the id of the " +
            "database this row belongs to — bind it to the same id used in the page's " +
            "`dataSources` entry, never a literal. `properties` seeds custom fields (e.g. " +
            "status, priority) using that database's property schema. Use for an 'Add' button " +
            "or form on a data-bound page.",
    },
    updatePage: {
        params: updatePageParams,
        description: "Edit an existing page's title and/or properties. `properties` is shallow-merged " +
            "onto the page's current properties — pass only the keys that change. Use for " +
            "inline edits, or to move a kanban card by patching its group-by property.",
    },
    deletePage: {
        params: deletePageParams,
        description: "Archive a page. Recoverable, never a hard delete — the row leaves the view but " +
            "is not destroyed. Use for any 'delete' or 'remove' control on a generated page.",
    },
};
