/**
 * The React half of the shared registry: catalog names bound to their shadcn
 * implementations, via `defineRegistry`.
 *
 * This exists so the name→implementation mapping is written ONCE. Before it, Nozio's
 * registry.tsx repeated the same 36-name list as the catalog, and Familiar was about to
 * become the third copy. A component added to the catalog without a binding here (or vice
 * versa) is a defect this package's build catches — consumers cannot drift individually.
 *
 * Import from "@bedda/workspace-catalog/react" in client code only; the root export stays
 * server-safe (the catalog is plain data + zod, no React).
 */
import { defineRegistry } from "@json-render/react";
import { shadcnComponents as impl } from "@json-render/shadcn";
import { catalog } from "./catalog.js";
export const { registry } = defineRegistry(catalog, {
    components: {
        Card: impl.Card,
        Stack: impl.Stack,
        Grid: impl.Grid,
        Tabs: impl.Tabs,
        Separator: impl.Separator,
        Table: impl.Table,
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
});
