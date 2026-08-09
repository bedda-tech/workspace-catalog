import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useBoundProp } from "@json-render/react";
function readCardField(item, field) {
    if (field === "id")
        return item.id;
    if (field === "title")
        return item.title;
    if (field === "icon")
        return item.icon;
    return item.properties?.[field];
}
function deriveColumns(items, groupBy) {
    const seen = new Set();
    for (const item of items) {
        const raw = item.properties?.[groupBy];
        if (raw === undefined || raw === null)
            continue;
        seen.add(String(raw));
    }
    return Array.from(seen).map((value) => ({ value, label: value }));
}
export function Board({ props, bindings, emit }) {
    const items = props.items ?? [];
    const columns = props.columns && props.columns.length > 0 ? props.columns : deriveColumns(items, props.groupBy);
    const cardFields = props.cardFields ?? [];
    const [, setActiveCardId] = useBoundProp(props.activeCardId, bindings?.activeCardId);
    const [, setMoveTarget] = useBoundProp(props.moveTarget, bindings?.moveTarget);
    const byColumn = new Map(columns.map((c) => [c.value, []]));
    for (const item of items) {
        const raw = item.properties?.[props.groupBy];
        if (raw === undefined || raw === null)
            continue;
        byColumn.get(String(raw))?.push(item);
    }
    const moveCard = (item, toValue) => {
        if (toValue === undefined)
            return;
        setActiveCardId(item.id);
        setMoveTarget(toValue);
        emit("move");
    };
    const openCard = (item) => {
        setActiveCardId(item.id);
        emit("open");
    };
    const addCard = (columnValue) => {
        setMoveTarget(columnValue);
        emit("add");
    };
    return (_jsx("div", { className: "flex gap-4 overflow-x-auto pb-2", children: columns.map((column, columnIndex) => {
            const cards = byColumn.get(column.value) ?? [];
            return (_jsxs("div", { className: "flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2", children: [_jsxs("div", { className: "flex items-center justify-between px-1", children: [_jsxs("span", { className: "text-sm font-medium", children: [column.label, " ", _jsxs("span", { className: "text-muted-foreground", children: ["(", cards.length, ")"] })] }), _jsx("button", { type: "button", className: "text-muted-foreground hover:text-foreground", "aria-label": `Add to ${column.label}`, onClick: () => addCard(column.value), children: "+" })] }), _jsx("div", { className: "flex flex-col gap-2", children: cards.map((item) => (_jsxs("div", { className: "rounded-md border border-border bg-background p-2 shadow-sm", children: [_jsx("button", { type: "button", className: "block w-full text-left text-sm font-medium", "data-open-record": item.id, onClick: () => openCard(item), children: String(readCardField(item, props.cardTitle) ?? "") }), cardFields.length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: cardFields.map((field) => {
                                        const value = readCardField(item, field);
                                        if (value === undefined || value === null || value === "")
                                            return null;
                                        return (_jsx("span", { className: "rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground", children: String(value) }, field));
                                    }) })), _jsxs("div", { className: "mt-2 flex justify-between", children: [_jsxs("button", { type: "button", disabled: columnIndex === 0, className: "text-xs text-muted-foreground disabled:opacity-30", "aria-label": `Move ${String(readCardField(item, props.cardTitle) ?? "card")} to ${columns[columnIndex - 1]?.label ?? "previous column"}`, onClick: () => moveCard(item, columns[columnIndex - 1]?.value), children: ["\u2190 ", columns[columnIndex - 1]?.label ?? ""] }), _jsxs("button", { type: "button", disabled: columnIndex === columns.length - 1, className: "text-xs text-muted-foreground disabled:opacity-30", "aria-label": `Move ${String(readCardField(item, props.cardTitle) ?? "card")} to ${columns[columnIndex + 1]?.label ?? "next column"}`, onClick: () => moveCard(item, columns[columnIndex + 1]?.value), children: [columns[columnIndex + 1]?.label ?? "", " \u2192"] })] })] }, item.id))) })] }, column.value));
        }) }));
}
