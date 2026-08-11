/**
 * The React half of the shared registry: catalog names bound to their shadcn
 * implementations, via `defineRegistry`.
 *
 * This exists so the name→implementation mapping is written ONCE. Before it, Nozio's
 * registry.tsx repeated the same 36-name list as the catalog, and Familiar was about to
 * become the third copy. A component added to the catalog without a binding here (or vice
 * versa) is a defect this package's build catches — consumers cannot drift individually.
 *
 * Actions are the deliberate exception to "written once": their DEFINITIONS are shared
 * (actions.ts — a spec must validate identically on every surface), but their HANDLERS are
 * what a surface IS. Familiar routes `answer` into its chat pipeline; Nozio routes it into
 * a page's data model. So this module is a factory: each surface supplies its handlers and
 * gets a registry bound to the one catalog.
 *
 * Import from "@bedda/workspace-catalog/react" in client code only; the root export stays
 * server-safe (the catalog is plain data + zod, no React).
 */
import { defineRegistry } from "@json-render/react";
import { shadcnComponents as impl } from "@json-render/shadcn";
import { catalog } from "./catalog.js";
import { Board } from "./board-react.js";
import { Table } from "./table-react.js";
import { DataTableDetail, DataTablePreview } from "./datatable-react.js";
import { PageHeader } from "./pageheader-react.js";
export function createRegistry(handlers) {
    return defineRegistry(catalog, {
        components: {
            PageHeader,
            Board,
            Card: impl.Card,
            Stack: impl.Stack,
            Grid: impl.Grid,
            Tabs: impl.Tabs,
            Separator: impl.Separator,
            Table,
            DataTablePreview,
            DataTableDetail,
            Heading: impl.Heading,
            Text: impl.Text,
            Badge: impl.Badge,
            Alert: impl.Alert,
            Progress: impl.Progress,
            Avatar: impl.Avatar,
            Image: impl.Image,
            Accordion: impl.Accordion,
            Spinner: impl.Spinner,
            Skeleton: impl.Skeleton,
            Input: impl.Input,
            Select: impl.Select,
            Checkbox: impl.Checkbox,
            Switch: impl.Switch,
            Textarea: impl.Textarea,
            Radio: impl.Radio,
            Slider: impl.Slider,
            Button: impl.Button,
            Link: impl.Link,
            Pagination: impl.Pagination,
            Collapsible: impl.Collapsible,
            Dialog: impl.Dialog,
            Drawer: impl.Drawer,
            Toggle: impl.Toggle,
            ToggleGroup: impl.ToggleGroup,
            ButtonGroup: impl.ButtonGroup,
            Carousel: impl.Carousel,
            Tooltip: impl.Tooltip,
            DropdownMenu: impl.DropdownMenu,
            Popover: impl.Popover,
        },
        actions: {
            answer: async (params) => {
                if (params)
                    await handlers.answer(params);
            },
            navigate: async (params) => {
                if (params)
                    await handlers.navigate(params);
            },
            createPage: async (params) => {
                if (params)
                    await handlers.createPage(params);
            },
            updatePage: async (params) => {
                if (params)
                    await handlers.updatePage(params);
            },
            deletePage: async (params) => {
                if (params)
                    await handlers.deletePage(params);
            },
        },
    });
}
/**
 * A registry for display-only surfaces (previews, exports) where no handler makes sense.
 * Interactions warn instead of throwing — a preview must not crash on a stray click.
 */
export const { registry: displayRegistry } = createRegistry({
    answer: (p) => console.warn("[workspace-catalog] answer ignored on display-only surface:", p.id),
    navigate: (p) => console.warn("[workspace-catalog] navigate ignored on display-only surface:", p.href),
    createPage: (p) => console.warn("[workspace-catalog] createPage ignored on display-only surface:", p.parent),
    updatePage: (p) => console.warn("[workspace-catalog] updatePage ignored on display-only surface:", p.id),
    deletePage: (p) => console.warn("[workspace-catalog] deletePage ignored on display-only surface:", p.id),
});
