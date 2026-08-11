/**
 * The PageHeader component definition — one purpose-built catalog entry for the "top of
 * a page" pattern every generated canvas needs (task 6135). Before this, the composing
 * agent hand-assembled Heading + Text + Badge inside a Stack for every page it built and
 * consistently got the spacing/alignment wrong (title and badge not baseline-aligned,
 * subtitle spaced like a sibling block instead of a caption, actions left-aligned under
 * the title instead of right-aligned beside it). Encoding the pattern as one component
 * makes the layout correct by construction instead of re-derived, imperfectly, per page.
 *
 * Actions are the standard json-render `children` slot (usually Button elements) rather
 * than a data prop — same mechanism Card/Stack/Dialog already use for "whatever the
 * composer puts inside me," so the agent doesn't learn a second way to express buttons.
 */
import { z } from "zod";
export const pageHeaderPropsSchema = z.object({
    title: z.string().describe("Main page heading, rendered large and bold (like an h1)."),
    subtitle: z
        .string()
        .nullable()
        .describe("Optional one-line description under the title, rendered muted/smaller."),
    badgeText: z
        .string()
        .nullable()
        .describe("Optional short label shown beside the title, e.g. a status like \"Live\" or \"Draft\"."),
    badgeVariant: z
        .enum(["default", "secondary", "destructive", "outline"])
        .nullable()
        .describe("Badge color/tone. Defaults to \"secondary\" (matches Badge's own default variant meaning)."),
});
export const pageHeaderComponentDefinition = {
    props: pageHeaderPropsSchema,
    slots: ["children"],
    description: "The top of a page: title, optional subtitle, optional status badge, and right-aligned action " +
        "buttons — laid out and spaced correctly in one component instead of composed from Heading + " +
        "Text + Badge + Stack. Put Button elements as children for the action row (e.g. \"New\", \"Share\"); " +
        "omit children for a header with no actions.",
    example: {
        title: "Barberist launch tracker",
        subtitle: "Pilot rollout across 3 locations",
        badgeText: "Live",
        badgeVariant: "secondary",
    },
};
