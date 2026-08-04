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
export type AnswerParams = z.infer<typeof answerParams>;

export const navigateParams = z.object({
  /** Internal route only ("/tasks"). External URLs are a phishing surface in a chat bubble. */
  href: z.string().startsWith("/", "href must be an internal route starting with /"),
});
export type NavigateParams = z.infer<typeof navigateParams>;

export const sharedActions = {
  answer: {
    params: answerParams,
    description:
      "Send the user's decision back to the conversation as an auditable message. " +
      "Use for any button that commits a choice. Include a stable `id` so the answer " +
      "correlates to the question; pass `__undo__` as the value on an Undo control. " +
      "Always offer a way to add a free-text note — answers are rarely black and white.",
  },
  navigate: {
    params: navigateParams,
    description:
      "Go to an internal page of the workspace, e.g. /tasks or /finance/debt. " +
      "Internal routes only — never an external URL.",
  },
} as const;
