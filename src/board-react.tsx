/**
 * Board's React implementation. Kept separate from board.ts (React-free) the same way
 * actions.ts/react.ts split — the root export stays server-safe.
 *
 * v1 moves cards with per-card arrow buttons (works on mobile, ships fast). v1.5 adds
 * HTML5 drag on desktop — not here yet.
 */
import type { BaseComponentProps } from "@json-render/react";
import { useBoundProp } from "@json-render/react";
import type { BoardItem, BoardProps } from "./board.js";

function readCardField(item: BoardItem, field: string): unknown {
  if (field === "id") return item.id;
  if (field === "title") return item.title;
  if (field === "icon") return item.icon;
  return item.properties?.[field];
}

function deriveColumns(items: BoardItem[], groupBy: string): { value: string; label: string }[] {
  const seen = new Set<string>();
  for (const item of items) {
    const raw = item.properties?.[groupBy];
    if (raw === undefined || raw === null) continue;
    seen.add(String(raw));
  }
  return Array.from(seen).map((value) => ({ value, label: value }));
}

export function Board({ props, bindings, emit }: BaseComponentProps<BoardProps>) {
  const items = props.items ?? [];
  const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(items, props.groupBy);
  const cardFields = props.cardFields ?? [];

  const [, setActiveCardId] = useBoundProp(props.activeCardId, bindings?.activeCardId);
  const [, setMoveTarget] = useBoundProp(props.moveTarget, bindings?.moveTarget);

  const byColumn = new Map<string, BoardItem[]>(columns.map((c) => [c.value, []]));
  for (const item of items) {
    const raw = item.properties?.[props.groupBy];
    if (raw === undefined || raw === null) continue;
    byColumn.get(String(raw))?.push(item);
  }

  const moveCard = (item: BoardItem, toValue: string | undefined) => {
    if (toValue === undefined) return;
    setActiveCardId(item.id);
    setMoveTarget(toValue);
    emit("move");
  };
  const openCard = (item: BoardItem) => {
    setActiveCardId(item.id);
    emit("open");
  };
  const addCard = (columnValue: string) => {
    setMoveTarget(columnValue);
    emit("add");
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column, columnIndex) => {
        const cards = byColumn.get(column.value) ?? [];
        return (
          <div
            key={column.value}
            className="flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium">
                {column.label} <span className="text-muted-foreground">({cards.length})</span>
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Add to ${column.label}`}
                onClick={() => addCard(column.value)}
              >
                +
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {cards.map((item) => (
                <div key={item.id} className="rounded-md border border-border bg-background p-2 shadow-sm">
                  <button
                    type="button"
                    className="block w-full text-left text-sm font-medium"
                    data-open-record={item.id}
                    onClick={() => openCard(item)}
                  >
                    {String(readCardField(item, props.cardTitle) ?? "")}
                  </button>
                  {cardFields.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {cardFields.map((field) => {
                        const value = readCardField(item, field);
                        if (value === undefined || value === null || value === "") return null;
                        return (
                          <span
                            key={field}
                            className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                          >
                            {String(value)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      disabled={columnIndex === 0}
                      className="text-xs text-muted-foreground disabled:opacity-30"
                      aria-label={`Move ${String(readCardField(item, props.cardTitle) ?? "card")} to ${columns[columnIndex - 1]?.label ?? "previous column"}`}
                      onClick={() => moveCard(item, columns[columnIndex - 1]?.value)}
                    >
                      ← {columns[columnIndex - 1]?.label ?? ""}
                    </button>
                    <button
                      type="button"
                      disabled={columnIndex === columns.length - 1}
                      className="text-xs text-muted-foreground disabled:opacity-30"
                      aria-label={`Move ${String(readCardField(item, props.cardTitle) ?? "card")} to ${columns[columnIndex + 1]?.label ?? "next column"}`}
                      onClick={() => moveCard(item, columns[columnIndex + 1]?.value)}
                    >
                      {columns[columnIndex + 1]?.label ?? ""} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
