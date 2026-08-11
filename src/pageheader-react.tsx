/**
 * PageHeader's React implementation. Kept separate from pageheader.ts (React-free) the
 * same way board.ts/board-react.tsx split — the root export stays server-safe.
 *
 * Plain HTML + Tailwind, matching board-react.tsx/table-react.tsx's pattern rather than
 * shadcn's Badge (shadcn only exports its full component map, not individual pieces to
 * reuse) — classes below are copied from shadcn's own `badgeVariants` so a badge here
 * looks identical to a standalone Badge element.
 */
import type { BaseComponentProps } from "@json-render/react";
import type { PageHeaderProps } from "./pageheader.js";

const badgeVariantClass: Record<string, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-white",
  outline: "border border-border text-foreground",
};

export function PageHeader({ props, children }: BaseComponentProps<PageHeaderProps>) {
  const badgeClass = badgeVariantClass[props.badgeVariant ?? "secondary"] ?? badgeVariantClass.secondary;
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-left text-2xl font-bold">{props.title}</h1>
          {props.badgeText && (
            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
            >
              {props.badgeText}
            </span>
          )}
        </div>
        {props.subtitle && <p className="text-left text-sm text-muted-foreground">{props.subtitle}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
