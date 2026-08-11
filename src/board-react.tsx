/**
 * Board's React implementation. Kept separate from board.ts (React-free) the same way
 * actions.ts/react.ts split — the root export stays server-safe.
 *
 * v1 moves cards with per-card arrow buttons (works on mobile, ships fast). v1.5 adds
 * HTML5 drag on desktop — not here yet.
 */
import type { BaseComponentProps } from "@json-render/react";
import { useBoundProp } from "@json-render/react";
import { formatPropertyValue, selectOptionColorClass } from "./board.js";
import type { BoardItem, BoardProps, CardFieldSchemaEntry } from "./board.js";

function readCardField(item: BoardItem, field: string): unknown {
  if (field === "id") return item.id;
  if (field === "title") return item.title;
  if (field === "icon") return item.icon;
  return item.properties?.[field];
}

/** The matching select option for a cardField's raw value, if cardFieldSchemas declared one. */
function cardFieldOption(schemas: CardFieldSchemaEntry[], field: string, value: unknown) {
  const options = schemas.find((s) => s.key === field)?.options ?? [];
  return options.find((o) => o.value === String(value));
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

/** Placeholder columns shown while the bound data source's first read is still in flight. */
const SKELETON_COLUMNS = 3;
const SKELETON_CARDS = 2;

function BoardSkeleton() {
  return (
    <div className="board-columns flex gap-4 overflow-x-auto pb-2" aria-hidden="true">
      {Array.from({ length: SKELETON_COLUMNS }, (_, i) => (
        <div
          key={i}
          className="board-column flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2"
        >
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          {Array.from({ length: SKELETON_CARDS }, (_, j) => (
            <div key={j} className="h-14 animate-pulse rounded-md border border-border bg-muted/60" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Board({ props, bindings, emit, loading }: BaseComponentProps<BoardProps>) {
  if (loading) return <BoardSkeleton />;

  const items = props.items ?? [];
  const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(items, props.groupBy);
  const cardFields = props.cardFields ?? [];
  const cardFieldSchemas = props.cardFieldSchemas ?? [];

  if (columns.length === 0) {
    return <div className="text-sm text-muted-foreground">No cards yet.</div>;
  }
  // A narrow canvas pane (e.g. chat open at 1280px) fits ~3 of the default 288px
  // columns before scrolling; a 5+ stage board (task 6367) reads as clipped/broken
  // past that. Past 3 columns, shrink to a compact width so more stay legible before
  // any scrolling is needed — the host app's CSS may refine this further via the
  // board-columns/board-column/[data-compact] hooks below.
  const compact = columns.length > 3;

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
    <div
      className={`board-columns flex overflow-x-auto pb-2 ${compact ? "gap-2" : "gap-4"}`}
      data-compact={compact ? "true" : undefined}
    >
      {columns.map((column, columnIndex) => {
        const cards = byColumn.get(column.value) ?? [];
        return (
          <div
            key={column.value}
            data-compact={compact ? "true" : undefined}
            className={`board-column flex shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2 ${compact ? "w-48" : "w-72"}`}
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
              {cards.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
                  No cards
                </div>
              )}
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
                        const option = cardFieldOption(cardFieldSchemas, field, value);
                        return (
                          <span
                            key={field}
                            className={`rounded px-1.5 py-0.5 text-xs font-medium ${selectOptionColorClass(option?.color)}`}
                          >
                            {option?.label ?? formatPropertyValue(value)}
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
