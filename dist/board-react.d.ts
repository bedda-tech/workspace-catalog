/**
 * Board's React implementation. Kept separate from board.ts (React-free) the same way
 * actions.ts/react.ts split — the root export stays server-safe.
 *
 * v1 moves cards with per-card arrow buttons (works on mobile, ships fast). v1.5 adds
 * HTML5 drag on desktop — not here yet.
 */
import type { BaseComponentProps } from "@json-render/react";
import type { BoardProps } from "./board.js";
export declare function Board({ props, bindings, emit, loading }: BaseComponentProps<BoardProps>): import("react").JSX.Element;
