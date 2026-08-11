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
export declare function CellEditor({ column, value, onCommit, onCancel, }: {
    column: TableColumn;
    value: unknown;
    onCommit: (value: unknown) => void;
    onCancel: () => void;
}): import("react").JSX.Element;
export declare function Table({ props, bindings, emit }: BaseComponentProps<TableProps>): import("react").JSX.Element;
