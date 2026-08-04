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
export declare const RETRACTION_VALUE = "__undo__";
export declare const answerParams: z.ZodObject<{
    id: z.ZodString;
    value: z.ZodUnknown;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AnswerParams = z.infer<typeof answerParams>;
export declare const navigateParams: z.ZodObject<{
    href: z.ZodString;
}, z.core.$strip>;
export type NavigateParams = z.infer<typeof navigateParams>;
export declare const sharedActions: {
    readonly answer: {
        readonly params: z.ZodObject<{
            id: z.ZodString;
            value: z.ZodUnknown;
            note: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        readonly description: string;
    };
    readonly navigate: {
        readonly params: z.ZodObject<{
            href: z.ZodString;
        }, z.core.$strip>;
        readonly description: string;
    };
};
