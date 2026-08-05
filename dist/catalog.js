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
export const catalog = defineCatalog(schema, {
    components: {
        // Layout
        Card: defs.Card,
        Stack: defs.Stack,
        Grid: defs.Grid,
        Tabs: defs.Tabs,
        Separator: defs.Separator,
        // Data-connected
        Board: boardComponentDefinition,
        // Data display
        Table: defs.Table,
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
export const COMPONENT_NAMES = catalog.componentNames;
