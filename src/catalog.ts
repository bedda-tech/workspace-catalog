/**
 * The shared catalog — one registry for every surface of the generative workspace.
 *
 * Extracted verbatim from Nozio's `src/app/json-render/catalog.ts` (2026-08-04), where it
 * shipped first. Familiar's dashboard chat renders from this same catalog, which is the whole
 * point: a chat block and a Nozio page are the same artifact at two lifetimes, and promoting
 * one to the other is a database write, not a translation.
 * See familiar's `projects/GENERATIVE-WORKSPACE.md`, "Converge on the spec, not the apps".
 *
 * Rules of the registry (carried over from both parents):
 * - The catalog is the allowlist. A model may only use what is defined here; an unknown
 *   component must fail visibly at validation, never silently at render.
 * - Curate, don't dump. 36 components chosen deliberately beats 200 primitives nobody can
 *   choose between well.
 * - Both consumers are on zod 4. That alignment is what made sharing possible at all — do
 *   not reintroduce a version-bridging `as any`; it disables prop-schema checking entirely.
 */
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions as defs } from "@json-render/shadcn";
import { sharedActions } from "./actions.js";
import { boardComponentDefinition } from "./board.js";
import { tableComponentDefinition } from "./table.js";
import { dataTableDetailComponentDefinition, dataTablePreviewComponentDefinition } from "./datatable.js";
import { pageHeaderComponentDefinition } from "./pageheader.js";

export const catalog = defineCatalog(schema, {
  components: {
    // Layout
    PageHeader: pageHeaderComponentDefinition,
    Card: defs.Card,
    Stack: defs.Stack,
    Grid: defs.Grid,
    Tabs: defs.Tabs,
    Separator: defs.Separator,
    // Data-connected
    Board: boardComponentDefinition,
    Table: tableComponentDefinition,
    DataTablePreview: dataTablePreviewComponentDefinition,
    DataTableDetail: dataTableDetailComponentDefinition,
    // Data display
    Heading: defs.Heading,
    Text: defs.Text,
    Badge: defs.Badge,
    Alert: defs.Alert,
    Progress: defs.Progress,
    Avatar: defs.Avatar,
    Image: defs.Image,
    Accordion: defs.Accordion,
    Spinner: defs.Spinner,
    Skeleton: defs.Skeleton,
    // Form inputs
    Input: defs.Input,
    Select: defs.Select,
    Checkbox: defs.Checkbox,
    Switch: defs.Switch,
    Textarea: defs.Textarea,
    Radio: defs.Radio,
    Slider: defs.Slider,
    // Actions
    Button: defs.Button,
    Link: defs.Link,
    Pagination: defs.Pagination,
    // Collapsible container
    Collapsible: defs.Collapsible,
    // Overlay containers
    Dialog: defs.Dialog,
    Drawer: defs.Drawer,
    // Interactive widgets
    Toggle: defs.Toggle,
    ToggleGroup: defs.ToggleGroup,
    ButtonGroup: defs.ButtonGroup,
    // Rich media
    Carousel: defs.Carousel,
    // Utility
    Tooltip: defs.Tooltip,
    DropdownMenu: defs.DropdownMenu,
    Popover: defs.Popover,
  },
  /**
   * Shared by definition: an action only one surface understands breaks the promotion
   * path, so definitions live here and each surface registers its own handler. See
   * actions.ts for what these encode and why.
   */
  actions: sharedActions,
});

/**
 * Component names the catalog admits, for validators and prompt builders.
 * defineCatalog exposes this itself — alias it rather than re-deriving, so it cannot skew.
 */
export const COMPONENT_NAMES: readonly string[] = catalog.componentNames;

/**
 * `catalog.validate()` (from @json-render/core's `defineCatalog`) checks spec structure
 * and that every element's `type` names a real component — but it never runs a
 * component's OWN prop schema (`catalog.data.components[type].props`) against the props
 * an element was actually given. A `Table` given `{columns:[{key,label}]}` against a
 * `columns: z.array(z.string())` schema passes `catalog.validate()` unchanged and only
 * fails later, at render, throwing React #31 and white-screening the whole tree. That
 * contradicts this catalog's own rule above: an invalid component "must fail visibly at
 * validation, never silently at render." (Found 2026-08-08 building the workspace repo's
 * composing agent; patched there first in the consumer, moved here so Nozio and the
 * Familiar dashboard — which call the same `catalog.validate()` and never got that local
 * patch — are covered by the one call they already make, with no call-site changes.)
 *
 * `@json-render/core` is vercel-labs/json-render, not a repo this package owns, so the
 * fix is patched onto the catalog instance here rather than filed upstream there.
 *
 * Bound values (`{"$state": "/path"}`, or any other `$`-prefixed key) are deferred and
 * skipped — they cannot be type-checked until resolved at render time.
 */
type ValidateResult = ReturnType<typeof catalog.validate>;

const isBoundValue = (v: unknown): boolean =>
  !!v && typeof v === "object" && !Array.isArray(v) &&
  Object.keys(v as object).some((k) => k.startsWith("$"));

interface PropSchema {
  safeParse(v: unknown): { success: boolean; error?: { issues?: { message?: string }[] } };
}
interface ComponentDef {
  props?: { shape?: Record<string, PropSchema> };
  example?: unknown;
  /**
   * Props that write a value via `{"$bindState":"<path>"}` immediately before the
   * component emits an event (Board's activeCardId/moveTarget, Table's
   * activeRowId/editValue — see board.ts/table.ts). These are declared `.nullable()` in
   * their own zod schema (this catalog's spelling for "optional", since the write starts
   * out null) — so a component can validly render with the prop simply ABSENT, and the
   * per-key loop below never flags a key that never showed up in `props` at all. That gap
   * is exactly how a Table composed without `activeRowId`/`editValue` used to pass
   * validation, render fine, and then silently fail to write on the first cell edit — no
   * error anywhere, because emit()'s bound action reads a `$state` path that was never
   * wired (task 6512, follow-up to 6404's incomplete example-only fix). Listing a prop
   * here makes its ABSENCE — or presence as a literal instead of a real binding — a
   * validation failure, not a runtime no-op.
   */
  requiredBindStateProps?: string[];
}

const isBindStateValue = (v: unknown): boolean =>
  !!v && typeof v === "object" && !Array.isArray(v) &&
  "$bindState" in (v as object) && typeof (v as { $bindState?: unknown }).$bindState === "string";

function checkComponentProps(spec: unknown): string | null {
  const s = spec as { elements?: Record<string, { type: string; props?: Record<string, unknown> }> };
  const componentDefs = (catalog as unknown as { data: { components: Record<string, ComponentDef> } })
    .data.components;

  for (const [id, el] of Object.entries(s.elements ?? {})) {
    const def = componentDefs[el.type];
    const shape = def?.props?.shape;
    if (!shape) continue; // no prop schema registered for this type

    const declared = Object.keys(shape);
    const props = el.props ?? {};
    const unknownProps = Object.keys(props).filter((k) => !declared.includes(k));
    if (unknownProps.length) {
      return `${el.type} "${id}": unknown prop(s) ${unknownProps.join(", ")}. ${el.type} accepts: ` +
        `${declared.join(", ")}. Example: ${JSON.stringify(def?.example ?? {})}`;
    }

    for (const [key, value] of Object.entries(props)) {
      const propSchema = shape[key];
      if (!propSchema || isBoundValue(value)) continue;
      const result = propSchema.safeParse(value);
      if (!result.success) {
        const why = result.error?.issues?.[0]?.message ?? "invalid value";
        return `${el.type} "${id}": prop "${key}" ${why}. Correct shape for ${el.type}: ` +
          `${JSON.stringify(def?.example ?? {})}`;
      }
    }

    for (const key of def?.requiredBindStateProps ?? []) {
      if (!(key in props) || !isBindStateValue(props[key])) {
        return `${el.type} "${id}": prop "${key}" must be bound with {"$bindState":"<path>"}. ` +
          `${el.type} writes the acted-on value here immediately before emitting its edit ` +
          `event — omitted or literal, the write has nowhere durable to land and the bound ` +
          `action's matching {"$state":"<same path>"} read resolves to nothing, so the edit ` +
          `visibly happens then silently reverts. Example: ${JSON.stringify(def?.example ?? {})}`;
      }
    }
  }
  return null;
}

const structuralValidate = catalog.validate.bind(catalog);
(catalog as { validate: typeof catalog.validate }).validate = ((spec: unknown): ValidateResult => {
  const structural = structuralValidate(spec);
  if (!structural.success) return structural;
  const propError = checkComponentProps(spec);
  if (propError) {
    return { success: false, error: { message: propError } as ValidateResult["error"] } as ValidateResult;
  }
  return structural;
}) as typeof catalog.validate;
