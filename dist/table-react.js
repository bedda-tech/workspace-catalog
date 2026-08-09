import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Table's React implementation. Kept separate from table.ts (React-free) the same way
 * board.ts/board-react.tsx split — the root export stays server-safe.
 *
 * v1: click a cell to edit it in place (checkbox toggles immediately, no click-to-edit
 * step needed); add row/delete row are single-click controls. No drag-to-reorder rows,
 * no multi-cell selection — ships the Notion-parity behavior the task asks for first.
 */
import { useState } from "react";
import { useBoundProp } from "@json-render/react";
function readCellValue(item, key) {
    if (key === "id")
        return item.id;
    if (key === "title")
        return item.title;
    return item.properties?.[key];
}
function deriveColumns(items) {
    const seen = new Set();
    for (const item of items) {
        for (const k of Object.keys(item.properties ?? {})) {
            if (!k.startsWith("_"))
                seen.add(k);
        }
    }
    return Array.from(seen).map((key) => ({ key, name: key, type: "text", options: null }));
}
function formatCell(column, value) {
    if (value === null || value === undefined || value === "")
        return "";
    if (column.type === "select" || column.type === "multiSelect") {
        const values = Array.isArray(value) ? value : [value];
        const options = column.options ?? [];
        return values
            .map((v) => options.find((o) => o.value === v)?.label ?? String(v))
            .join(", ");
    }
    if (column.type === "checkbox")
        return value ? "Yes" : "No";
    if (column.type === "date") {
        const d = new Date(String(value));
        return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
    }
    return String(value);
}
function CellEditor({ column, value, onCommit, onCancel, }) {
    if (column.type === "select") {
        return (
        // eslint-disable-next-line jsx-a11y/no-autofocus
        _jsxs("select", { autoFocus: true, className: "w-full rounded border border-border bg-background px-1 py-0.5 text-sm", defaultValue: value === null || value === undefined ? "" : String(value), onChange: (e) => onCommit(e.target.value), onBlur: onCancel, children: [_jsx("option", { value: "" }), (column.options ?? []).map((o) => (_jsx("option", { value: o.value, children: o.label ?? o.value }, o.value)))] }));
    }
    if (column.type === "date") {
        const iso = typeof value === "string" ? value.slice(0, 10) : "";
        return (_jsx("input", { autoFocus: true, type: "date", className: "w-full rounded border border-border bg-background px-1 py-0.5 text-sm", defaultValue: iso, onBlur: (e) => (e.target.value ? onCommit(e.target.value) : onCancel()), onKeyDown: (e) => {
                if (e.key === "Enter")
                    onCommit(e.target.value);
                if (e.key === "Escape")
                    onCancel();
            } }));
    }
    return (_jsx("input", { autoFocus: true, type: column.type === "number" ? "number" : "text", className: "w-full rounded border border-border bg-background px-1 py-0.5 text-sm", defaultValue: value === null || value === undefined ? "" : String(value), onBlur: (e) => onCommit(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter")
                onCommit(e.target.value);
            if (e.key === "Escape")
                onCancel();
        } }));
}
export function Table({ props, bindings, emit }) {
    const items = props.items ?? [];
    const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(items);
    const [, setActiveRowId] = useBoundProp(props.activeRowId, bindings?.activeRowId);
    const [, setEditValue] = useBoundProp(props.editValue, bindings?.editValue);
    const [editing, setEditing] = useState(null);
    const commitCell = (item, column, value) => {
        setEditing(null);
        setActiveRowId(item.id);
        setEditValue({ [column.key]: value });
        emit("editCell");
    };
    const deleteRow = (item) => {
        setActiveRowId(item.id);
        emit("deleteRow");
    };
    const openRow = (item) => {
        setActiveRowId(item.id);
        emit("open");
    };
    if (items.length === 0 && columns.length === 0) {
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "No rows yet." });
    }
    return (_jsxs("div", { className: "overflow-x-auto rounded-md border border-border", children: [_jsxs("table", { className: "w-full border-collapse text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border bg-muted/40", children: [_jsx("th", { className: "w-8" }), columns.map((column) => (_jsx("th", { className: "px-2 py-1.5 text-left font-medium text-muted-foreground", children: column.name }, column.key))), _jsx("th", { className: "w-8" })] }) }), _jsx("tbody", { children: items.map((item) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/20", children: [_jsx("td", { className: "px-2 py-1.5", children: _jsx("button", { type: "button", "aria-label": `Open ${item.title ?? item.id}`, "data-open-record": item.id, className: "text-muted-foreground hover:text-foreground", onClick: () => openRow(item), children: "\u2922" }) }), columns.map((column) => {
                                    const value = readCellValue(item, column.key);
                                    const isEditing = editing?.rowId === item.id && editing.key === column.key;
                                    if (column.type === "checkbox") {
                                        return (_jsx("td", { className: "px-2 py-1.5", children: _jsx("input", { type: "checkbox", "aria-label": `${column.name} for ${item.title ?? item.id}`, checked: Boolean(value), onChange: (e) => commitCell(item, column, e.target.checked) }) }, column.key));
                                    }
                                    return (_jsx("td", { className: "px-2 py-1.5", children: isEditing ? (_jsx(CellEditor, { column: column, value: value, onCommit: (v) => commitCell(item, column, v), onCancel: () => setEditing(null) })) : (_jsx("button", { type: "button", "aria-label": `Edit ${column.name} for ${item.title ?? item.id}`, className: "block min-h-[1.25rem] w-full text-left", onClick: () => setEditing({ rowId: item.id, key: column.key }), children: formatCell(column, value) || _jsx("span", { className: "text-muted-foreground", children: "\u2014" }) })) }, column.key));
                                }), _jsx("td", { className: "px-2 py-1.5 text-right", children: _jsx("button", { type: "button", "aria-label": `Delete row ${item.title ?? item.id}`, className: "text-muted-foreground hover:text-destructive", onClick: () => deleteRow(item), children: "\u00D7" }) })] }, item.id))) })] }), _jsx("button", { type: "button", "aria-label": "Add row", className: "w-full border-t border-border px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted/30", onClick: () => emit("addRow"), children: "+ Add row" })] }));
}
