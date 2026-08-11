/**
 * PageHeader's React implementation. Kept separate from pageheader.ts (React-free) the
 * same way board.ts/board-react.tsx split — the root export stays server-safe.
 *
 * Plain HTML + Tailwind, matching board-react.tsx/table-react.tsx's pattern rather than
 * shadcn's Badge (shadcn only exports its full component map, not individual pieces to
 * reuse) — classes below are copied from shadcn's own `badgeVariants` so a badge here
 * looks identical to a standalone Badge element.
 */
import type { BaseComponentProps } from "@json-render/react";
import type { PageHeaderProps } from "./pageheader.js";
export declare function PageHeader({ props, children }: BaseComponentProps<PageHeaderProps>): import("react").JSX.Element;
