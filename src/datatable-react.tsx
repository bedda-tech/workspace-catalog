/**
 * React implementations for DataTablePreview and DataTableDetail. See datatable.ts for why
 * these are a pair rather than one component with a `fidelity` prop (their prop shapes and
 * event sets genuinely differ — Preview has no edit events at all) and why Detail reuses
 * Table's cell helpers instead of duplicating them.
 */
import { useMemo, useState } from "react";
import type { BaseComponentProps } from "@json-render/react";
import { useBoundProp } from "@json-render/react";
import type { BoardItem } from "./board.js";
import type { DataTableDetailProps, DataTablePreviewProps, TableColumn } from "./datatable.js";
import { CellEditor, deriveColumns, formatCell, readCellValue, TableSkeleton } from "./table-react.js";

const DEFAULT_PREVIEW_ROWS = 5;

export function DataTablePreview({ props, bindings, emit, loading }: BaseComponentProps<DataTablePreviewProps>) {
  if (loading) return <TableSkeleton />;

  const allItems = props.items ?? [];
  const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(allItems);
  const maxRows = props.maxRows && props.maxRows > 0 ? props.maxRows : DEFAULT_PREVIEW_ROWS;
  const items = allItems.slice(0, maxRows);

  const [, setActiveRowId] = useBoundProp(props.activeRowId, bindings?.activeRowId);

  const openRow = (item: BoardItem) => {
    setActiveRowId(item.id);
    emit("open");
  };

  if (columns.length === 0) {
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
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-2 py-3 text-sm text-muted-foreground">
                No rows yet.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/20"
              onClick={() => openRow(item)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-2 py-1.5">
                  {formatCell(column, readCellValue(item, column.key)) || (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {allItems.length > items.length && (
        <div className="border-t border-border px-2 py-1.5 text-xs text-muted-foreground">
          Showing {items.length} of {allItems.length} — click a row to see more.
        </div>
      )}
    </div>
  );
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

function sortItems(items: BoardItem[], columns: TableColumn[], sort: SortState): BoardItem[] {
  if (!sort) return items;
  const column = columns.find((c) => c.key === sort.key);
  if (!column) return items;
  const withKeys = items.map((item) => ({ item, value: readCellValue(item, sort.key) }));
  withKeys.sort((a, b) => {
    const av = a.value;
    const bv = b.value;
    if (av === bv) return 0;
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv));
  });
  const sorted = withKeys.map((w) => w.item);
  return sort.dir === "asc" ? sorted : sorted.reverse();
}

function matchesSearch(item: BoardItem, columns: TableColumn[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if ((item.title ?? "").toLowerCase().includes(q)) return true;
  return columns.some((column) => formatCell(column, readCellValue(item, column.key)).toLowerCase().includes(q));
}

export function DataTableDetail({ props, bindings, emit, loading }: BaseComponentProps<DataTableDetailProps>) {
  if (loading) return <TableSkeleton />;

  const allItems = props.items ?? [];
  const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(allItems);
  const searchable = props.searchable ?? true;
  const sortable = props.sortable ?? true;
  const pageSize = props.pageSize && props.pageSize > 0 ? props.pageSize : null;

  const [, setActiveRowId] = useBoundProp(props.activeRowId, bindings?.activeRowId);
  const [, setEditValue] = useBoundProp(props.editValue, bindings?.editValue);

  const [editing, setEditing] = useState<{ rowId: string; key: string } | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => (searchable ? allItems.filter((item) => matchesSearch(item, columns, search)) : allItems),
    [allItems, columns, search, searchable],
  );
  const sorted = useMemo(() => sortItems(filtered, columns, sort), [filtered, columns, sort]);
  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const clampedPage = Math.min(page, pageCount - 1);
  const items = pageSize ? sorted.slice(clampedPage * pageSize, (clampedPage + 1) * pageSize) : sorted;

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

  const toggleSort = (column: TableColumn) => {
    if (!sortable) return;
    setSort((current) => {
      if (!current || current.key !== column.key) return { key: column.key, dir: "asc" };
      if (current.dir === "asc") return { key: column.key, dir: "desc" };
      return null;
    });
  };

  if (columns.length === 0) {
    return <div className="text-sm text-muted-foreground">No rows yet.</div>;
  }

  return (
    <div className="rounded-md border border-border">
      {searchable && (
        <div className="border-b border-border p-2">
          <input
            type="search"
            aria-label="Search rows"
            placeholder="Search…"
            className="w-full max-w-xs rounded border border-border bg-background px-2 py-1 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-8" />
              {columns.map((column) => (
                <th key={column.key} className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                  {sortable ? (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => toggleSort(column)}
                      aria-label={`Sort by ${column.name}`}
                    >
                      {column.name}
                      {sort?.key === column.key ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                    </button>
                  ) : (
                    column.name
                  )}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-2 py-3 text-sm text-muted-foreground">
                  {allItems.length === 0 ? "No rows yet." : "No matching rows."}
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-2 py-1.5" />
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
      </div>
      <button
        type="button"
        aria-label="Add row"
        className="w-full border-t border-border px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted/30"
        onClick={() => emit("addRow")}
      >
        + Add row
      </button>
      {pageSize && pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-border px-2 py-1.5 text-sm text-muted-foreground">
          <button
            type="button"
            disabled={clampedPage === 0}
            className="disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <span>
            Page {clampedPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            disabled={clampedPage >= pageCount - 1}
            className="disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
