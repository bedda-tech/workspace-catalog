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
export declare const pageHeaderPropsSchema: z.ZodObject<{
    title: z.ZodString;
    subtitle: z.ZodNullable<z.ZodString>;
    badgeText: z.ZodNullable<z.ZodString>;
    badgeVariant: z.ZodNullable<z.ZodEnum<{
        default: "default";
        secondary: "secondary";
        destructive: "destructive";
        outline: "outline";
    }>>;
}, z.core.$strip>;
export type PageHeaderProps = z.infer<typeof pageHeaderPropsSchema>;
export declare const pageHeaderComponentDefinition: {
    readonly props: z.ZodObject<{
        title: z.ZodString;
        subtitle: z.ZodNullable<z.ZodString>;
        badgeText: z.ZodNullable<z.ZodString>;
        badgeVariant: z.ZodNullable<z.ZodEnum<{
            default: "default";
            secondary: "secondary";
            destructive: "destructive";
            outline: "outline";
        }>>;
    }, z.core.$strip>;
    readonly slots: string[];
    readonly description: string;
    readonly example: {
        readonly title: "Barberist launch tracker";
        readonly subtitle: "Pilot rollout across 3 locations";
        readonly badgeText: "Live";
        readonly badgeVariant: "secondary";
    };
};
