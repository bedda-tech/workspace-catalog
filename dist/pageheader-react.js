import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const badgeVariantClass = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-white",
    outline: "border border-border text-foreground",
};
export function PageHeader({ props, children }) {
    const badgeClass = badgeVariantClass[props.badgeVariant ?? "secondary"] ?? badgeVariantClass.secondary;
    return (_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "truncate text-left text-2xl font-bold", children: props.title }), props.badgeText && (_jsx("span", { className: `inline-flex w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`, children: props.badgeText }))] }), props.subtitle && _jsx("p", { className: "text-left text-sm text-muted-foreground", children: props.subtitle })] }), children && _jsx("div", { className: "flex shrink-0 items-center gap-2", children: children })] }));
}
