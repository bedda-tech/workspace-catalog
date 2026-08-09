/**
 * Table's React implementation. Kept separate from table.ts (React-free) the same way
 * board.ts/board-react.tsx split — the root export stays server-safe.
 *
 * v1: click a cell to edit it in place (checkbox toggles immediately, no click-to-edit
 * step needed); add row/delete row are single-click controls. No drag-to-reorder rows,
 * no multi-cell selection — ships the Notion-parity behavior the task asks for first.
 */
import { useState } from "react";
import type { BaseComponentProps } from "@json-render/react";
import { useBoundProp } from "@json-render/react";
import type { BoardItem } from "./board.js";
import type { TableColumn, TableProps } from "./table.js";

function readCellValue(item: BoardItem, key: string): unknown {
  if (key === "id") return item.id;
  if (key === "title") return item.title;
  return item.properties?.[key];
}

function deriveColumns(items: BoardItem[]): TableColumn[] {
  const seen = new Set<string>();
  for (const item of items) {
    for (const k of Object.keys(item.properties ?? {})) {
      if (!k.startsWith("_")) seen.add(k);
    }
  }
  return Array.from(seen).map((key) => ({ key, name: key, type: "text" as const, options: null }));
}

function formatCell(column: TableColumn, value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (column.type === "select" || column.type === "multiSelect") {
    const values = Array.isArray(value) ? value : [value];
    const options = column.options ?? [];
    return values
      .map((v) => options.find((o) => o.value === v)?.label ?? String(v))
      .join(", ");
  }
  if (column.type === "checkbox") return value ? "Yes" : "No";
  if (column.type === "date") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
  }
  return String(value);
}

function CellEditor({
  column,
  value,
  onCommit,
  onCancel,
}: {
  column: TableColumn;
  value: unknown;
  onCommit: (value: unknown) => void;
  onCancel: () => void;
}) {
  if (column.type === "select") {
    return (
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <select
        autoFocus
        className="w-full rounded border border-border bg-background px-1 py-0.5 text-sm"
        defaultValue={value === null || value === undefined ? "" : String(value)}
        onChange={(e) => onCommit(e.target.value)}
        onBlur={onCancel}
      >
        <option value="" />
        {(column.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label ?? o.value}
          </option>
        ))}
      </select>
    );
  }
  if (column.type === "date") {
    const iso = typeof value === "string" ? value.slice(0, 10) : "";
    return (
      <input
        autoFocus
        type="date"
        className="w-full rounded border border-border bg-background px-1 py-0.5 text-sm"
        defaultValue={iso}
        onBlur={(e) => (e.target.value ? onCommit(e.target.value) : onCancel())}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit((e.target as HTMLInputElement).value);
          if (e.key === "Escape") onCancel();
        }}
      />
    );
  }
  return (
    <input
      autoFocus
      type={column.type === "number" ? "number" : "text"}
      className="w-full rounded border border-border bg-background px-1 py-0.5 text-sm"
      defaultValue={value === null || value === undefined ? "" : String(value)}
      onBlur={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit((e.target as HTMLInputElement).value);
        if (e.key === "Escape") onCancel();
      }}
    />
  );
}

export function Table({ props, bindings, emit }: BaseComponentProps<TableProps>) {
  const items = props.items ?? [];
  const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(items);

  const [, setActiveRowId] = useBoundProp(props.activeRowId, bindings?.activeRowId);
  const [, setEditValue] = useBoundProp(props.editValue, bindings?.editValue);

  const [editing, setEditing] = useState<{ rowId: string; key: string } | null>(null);

  const commitCell = (item: BoardItem, column: TableColumn, value: unknown) => {
    setEditing(null);
    setActiveRowId(item.id);
    setEditValue({ [column.key]: value });
    emit("editCell");
  };

  const deleteRow = (item: BoardItem) => {
    setActiveRowId(item.id);
    emit("deleteRow");
  };

  if (items.length === 0 && columns.length === 0) {
    return <div className="text-sm text-muted-foreground">No rows yet.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((column) => (
              <th key={column.key} className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                {column.name}
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
              {columns.map((column) => {
                const value = readCellValue(item, column.key);
                const isEditing = editing?.rowId === item.id && editing.key === column.key;
                if (column.type === "checkbox") {
                  return (
                    <td key={column.key} className="px-2 py-1.5">
                      <input
                        type="checkbox"
                        aria-label={`${column.name} for ${item.title ?? item.id}`}
                        checked={Boolean(value)}
                        onChange={(e) => commitCell(item, column, e.target.checked)}
                      />
                    </td>
                  );
                }
                return (
                  <td key={column.key} className="px-2 py-1.5">
                    {isEditing ? (
                      <CellEditor
                        column={column}
                        value={value}
                        onCommit={(v) => commitCell(item, column, v)}
                        onCancel={() => setEditing(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        aria-label={`Edit ${column.name} for ${item.title ?? item.id}`}
                        className="block min-h-[1.25rem] w-full text-left"
                        onClick={() => setEditing({ rowId: item.id, key: column.key })}
                      >
                        {formatCell(column, value) || <span className="text-muted-foreground">—</span>}
                      </button>
                    )}
                  </td>
                );
              })}
              <td className="px-2 py-1.5 text-right">
                <button
                  type="button"
                  aria-label={`Delete row ${item.title ?? item.id}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteRow(item)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        aria-label="Add row"
        className="w-full border-t border-border px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted/30"
        onClick={() => emit("addRow")}
      >
        + Add row
      </button>
    </div>
  );
}
