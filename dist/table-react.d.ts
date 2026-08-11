/**
 * Table's React implementation. Kept separate from table.ts (React-free) the same way
 * board.ts/board-react.tsx split — the root export stays server-safe.
 *
 * v1: click a cell to edit it in place (checkbox toggles immediately, no click-to-edit
 * step needed); add row/delete row are single-click controls. No drag-to-reorder rows,
 * no multi-cell selection — ships the Notion-parity behavior the task asks for first.
 */
import type { ReactNode } from "react";
import type { BaseComponentProps } from "@json-render/react";
import type { BoardItem } from "./board.js";
import type { TableColumn, TableProps } from "./table.js";
/**
 * Exported so datatable-react.tsx (DataTableDetail) can reuse the exact same cell
 * read/format/edit behavior instead of a second copy that inevitably drifts — see
 * datatable.ts for why Detail is "Table's editing plus search/sort/pagination" rather
 * than a component built from scratch.
 */
export declare function readCellValue(item: BoardItem, key: string): unknown;
export declare function deriveColumns(items: BoardItem[]): TableColumn[];
export declare function formatCell(column: TableColumn, value: unknown): string;
/**
 * Read-view cell rendering — a select/multiSelect column renders each value as a colored
 * badge (falling back to a flat neutral pill when the option has no "color") instead of the
 * plain text formatCell produces; every other type stays plain text. Kept separate from
 * formatCell, which stays a pure string (search/filter in datatable-react.tsx needs a
 * string to match against, not JSX).
 */
export declare function renderCell(column: TableColumn, value: unknown): ReactNode;
export declare function TableSkeleton(): import("react").JSX.Element;
export declare function CellEditor({ column, value, onCommit, onCancel, }: {
    column: TableColumn;
    value: unknown;
    onCommit: (value: unknown) => void;
    onCancel: () => void;
}): import("react").JSX.Element;
export declare function Table({ props, bindings, emit, loading }: BaseComponentProps<TableProps>): import("react").JSX.Element;
