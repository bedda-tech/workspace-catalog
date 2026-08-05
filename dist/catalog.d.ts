export declare const catalog: import("@json-render/core").Catalog<{
    spec: import("@json-render/core").SchemaType<"object", {
        root: import("@json-render/core").SchemaType<"string", unknown>;
        elements: import("@json-render/core").SchemaType<"record", import("@json-render/core").SchemaType<"object", {
            type: import("@json-render/core").SchemaType<"ref", string>;
            props: import("@json-render/core").SchemaType<"propsOf", string>;
            children: import("@json-render/core").SchemaType<"array", import("@json-render/core").SchemaType<"string", unknown>>;
            visible: import("@json-render/core").SchemaType<"any", unknown>;
        }>>;
    }>;
    catalog: import("@json-render/core").SchemaType<"object", {
        components: import("@json-render/core").SchemaType<"map", {
            props: import("@json-render/core").SchemaType<"zod", unknown>;
            slots: import("@json-render/core").SchemaType<"array", import("@json-render/core").SchemaType<"string", unknown>>;
            description: import("@json-render/core").SchemaType<"string", unknown>;
            example: import("@json-render/core").SchemaType<"any", unknown>;
        }>;
        actions: import("@json-render/core").SchemaType<"map", {
            params: import("@json-render/core").SchemaType<"zod", unknown>;
            description: import("@json-render/core").SchemaType<"string", unknown>;
        }>;
    }>;
}, {
    components: {
        Card: {
            props: import("zod").ZodObject<{
                title: import("zod").ZodNullable<import("zod").ZodString>;
                description: import("zod").ZodNullable<import("zod").ZodString>;
                maxWidth: import("zod").ZodNullable<import("zod").ZodEnum<{
                    sm: "sm";
                    md: "md";
                    lg: "lg";
                    full: "full";
                }>>;
                centered: import("zod").ZodNullable<import("zod").ZodBoolean>;
                className: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            description: string;
            example: {
                title: string;
                description: string;
            };
        };
        Stack: {
            props: import("zod").ZodObject<{
                direction: import("zod").ZodNullable<import("zod").ZodEnum<{
                    horizontal: "horizontal";
                    vertical: "vertical";
                }>>;
                gap: import("zod").ZodNullable<import("zod").ZodEnum<{
                    sm: "sm";
                    md: "md";
                    lg: "lg";
                    none: "none";
                    xl: "xl";
                }>>;
                align: import("zod").ZodNullable<import("zod").ZodEnum<{
                    start: "start";
                    center: "center";
                    end: "end";
                    stretch: "stretch";
                }>>;
                justify: import("zod").ZodNullable<import("zod").ZodEnum<{
                    start: "start";
                    center: "center";
                    end: "end";
                    between: "between";
                    around: "around";
                }>>;
                className: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            description: string;
            example: {
                direction: string;
                gap: string;
            };
        };
        Grid: {
            props: import("zod").ZodObject<{
                columns: import("zod").ZodNullable<import("zod").ZodNumber>;
                gap: import("zod").ZodNullable<import("zod").ZodEnum<{
                    sm: "sm";
                    md: "md";
                    lg: "lg";
                    xl: "xl";
                }>>;
                className: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            description: string;
            example: {
                columns: number;
                gap: string;
            };
        };
        Tabs: {
            props: import("zod").ZodObject<{
                tabs: import("zod").ZodArray<import("zod").ZodObject<{
                    label: import("zod").ZodString;
                    value: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
                defaultValue: import("zod").ZodNullable<import("zod").ZodString>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            events: string[];
            description: string;
        };
        Separator: {
            props: import("zod").ZodObject<{
                orientation: import("zod").ZodNullable<import("zod").ZodEnum<{
                    horizontal: "horizontal";
                    vertical: "vertical";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Board: {
            readonly props: import("zod").ZodObject<{
                items: import("zod").ZodArray<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    title: import("zod").ZodNullable<import("zod").ZodString>;
                    icon: import("zod").ZodNullable<import("zod").ZodString>;
                    properties: import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>;
                groupBy: import("zod").ZodString;
                columns: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    value: import("zod").ZodString;
                    label: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>>;
                cardTitle: import("zod").ZodString;
                cardFields: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodString>>;
                activeCardId: import("zod").ZodNullable<import("zod").ZodString>;
                moveTarget: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            readonly events: readonly ["move", "open", "add"];
            readonly description: string;
            readonly example: {
                readonly groupBy: "status";
                readonly columns: readonly [{
                    readonly value: "todo";
                    readonly label: "To do";
                }, {
                    readonly value: "doing";
                    readonly label: "Doing";
                }, {
                    readonly value: "done";
                    readonly label: "Done";
                }];
                readonly cardTitle: "title";
                readonly cardFields: readonly ["priority"];
            };
        };
        Table: {
            props: import("zod").ZodObject<{
                columns: import("zod").ZodArray<import("zod").ZodString>;
                rows: import("zod").ZodArray<import("zod").ZodArray<import("zod").ZodString>>;
                caption: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                columns: string[];
                rows: string[][];
            };
        };
        Heading: {
            props: import("zod").ZodObject<{
                text: import("zod").ZodString;
                level: import("zod").ZodNullable<import("zod").ZodEnum<{
                    h1: "h1";
                    h2: "h2";
                    h3: "h3";
                    h4: "h4";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                text: string;
                level: string;
            };
        };
        Text: {
            props: import("zod").ZodObject<{
                text: import("zod").ZodString;
                variant: import("zod").ZodNullable<import("zod").ZodEnum<{
                    caption: "caption";
                    body: "body";
                    muted: "muted";
                    lead: "lead";
                    code: "code";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                text: string;
            };
        };
        Badge: {
            props: import("zod").ZodObject<{
                text: import("zod").ZodString;
                variant: import("zod").ZodNullable<import("zod").ZodEnum<{
                    default: "default";
                    secondary: "secondary";
                    destructive: "destructive";
                    outline: "outline";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                text: string;
                variant: string;
            };
        };
        Alert: {
            props: import("zod").ZodObject<{
                title: import("zod").ZodString;
                message: import("zod").ZodNullable<import("zod").ZodString>;
                type: import("zod").ZodNullable<import("zod").ZodEnum<{
                    success: "success";
                    info: "info";
                    warning: "warning";
                    error: "error";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                title: string;
                message: string;
                type: string;
            };
        };
        Progress: {
            props: import("zod").ZodObject<{
                value: import("zod").ZodNumber;
                max: import("zod").ZodNullable<import("zod").ZodNumber>;
                label: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                value: number;
                max: number;
                label: string;
            };
        };
        Avatar: {
            props: import("zod").ZodObject<{
                src: import("zod").ZodNullable<import("zod").ZodString>;
                name: import("zod").ZodString;
                size: import("zod").ZodNullable<import("zod").ZodEnum<{
                    sm: "sm";
                    md: "md";
                    lg: "lg";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
            example: {
                name: string;
                size: string;
            };
        };
        Image: {
            props: import("zod").ZodObject<{
                src: import("zod").ZodNullable<import("zod").ZodString>;
                alt: import("zod").ZodString;
                width: import("zod").ZodNullable<import("zod").ZodNumber>;
                height: import("zod").ZodNullable<import("zod").ZodNumber>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Accordion: {
            props: import("zod").ZodObject<{
                items: import("zod").ZodArray<import("zod").ZodObject<{
                    title: import("zod").ZodString;
                    content: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
                type: import("zod").ZodNullable<import("zod").ZodEnum<{
                    single: "single";
                    multiple: "multiple";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Spinner: {
            props: import("zod").ZodObject<{
                size: import("zod").ZodNullable<import("zod").ZodEnum<{
                    sm: "sm";
                    md: "md";
                    lg: "lg";
                }>>;
                label: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Skeleton: {
            props: import("zod").ZodObject<{
                width: import("zod").ZodNullable<import("zod").ZodString>;
                height: import("zod").ZodNullable<import("zod").ZodString>;
                rounded: import("zod").ZodNullable<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Input: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                name: import("zod").ZodString;
                type: import("zod").ZodNullable<import("zod").ZodEnum<{
                    number: "number";
                    text: "text";
                    email: "email";
                    password: "password";
                }>>;
                placeholder: import("zod").ZodNullable<import("zod").ZodString>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
                checks: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    type: import("zod").ZodString;
                    message: import("zod").ZodString;
                    args: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>>;
                validateOn: import("zod").ZodNullable<import("zod").ZodEnum<{
                    change: "change";
                    blur: "blur";
                    submit: "submit";
                }>>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
            example: {
                label: string;
                name: string;
                type: string;
                placeholder: string;
            };
        };
        Select: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                name: import("zod").ZodString;
                options: import("zod").ZodArray<import("zod").ZodString>;
                placeholder: import("zod").ZodNullable<import("zod").ZodString>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
                checks: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    type: import("zod").ZodString;
                    message: import("zod").ZodString;
                    args: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>>;
                validateOn: import("zod").ZodNullable<import("zod").ZodEnum<{
                    change: "change";
                    blur: "blur";
                    submit: "submit";
                }>>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Checkbox: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                name: import("zod").ZodString;
                checked: import("zod").ZodNullable<import("zod").ZodBoolean>;
                checks: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    type: import("zod").ZodString;
                    message: import("zod").ZodString;
                    args: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>>;
                validateOn: import("zod").ZodNullable<import("zod").ZodEnum<{
                    change: "change";
                    blur: "blur";
                    submit: "submit";
                }>>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Switch: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                name: import("zod").ZodString;
                checked: import("zod").ZodNullable<import("zod").ZodBoolean>;
                checks: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    type: import("zod").ZodString;
                    message: import("zod").ZodString;
                    args: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>>;
                validateOn: import("zod").ZodNullable<import("zod").ZodEnum<{
                    change: "change";
                    blur: "blur";
                    submit: "submit";
                }>>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Textarea: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                name: import("zod").ZodString;
                placeholder: import("zod").ZodNullable<import("zod").ZodString>;
                rows: import("zod").ZodNullable<import("zod").ZodNumber>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
                checks: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    type: import("zod").ZodString;
                    message: import("zod").ZodString;
                    args: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>>;
                validateOn: import("zod").ZodNullable<import("zod").ZodEnum<{
                    change: "change";
                    blur: "blur";
                    submit: "submit";
                }>>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Radio: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                name: import("zod").ZodString;
                options: import("zod").ZodArray<import("zod").ZodString>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
                checks: import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodObject<{
                    type: import("zod").ZodString;
                    message: import("zod").ZodString;
                    args: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>>;
                validateOn: import("zod").ZodNullable<import("zod").ZodEnum<{
                    change: "change";
                    blur: "blur";
                    submit: "submit";
                }>>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Slider: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodNullable<import("zod").ZodString>;
                min: import("zod").ZodNullable<import("zod").ZodNumber>;
                max: import("zod").ZodNullable<import("zod").ZodNumber>;
                step: import("zod").ZodNullable<import("zod").ZodNumber>;
                value: import("zod").ZodNullable<import("zod").ZodNumber>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Button: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                variant: import("zod").ZodNullable<import("zod").ZodEnum<{
                    secondary: "secondary";
                    primary: "primary";
                    danger: "danger";
                }>>;
                disabled: import("zod").ZodNullable<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
            example: {
                label: string;
                variant: string;
            };
        };
        Link: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                href: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Pagination: {
            props: import("zod").ZodObject<{
                totalPages: import("zod").ZodNumber;
                page: import("zod").ZodNullable<import("zod").ZodNumber>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Collapsible: {
            props: import("zod").ZodObject<{
                title: import("zod").ZodString;
                defaultOpen: import("zod").ZodNullable<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            description: string;
        };
        Dialog: {
            props: import("zod").ZodObject<{
                title: import("zod").ZodString;
                description: import("zod").ZodNullable<import("zod").ZodString>;
                openPath: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            description: string;
        };
        Drawer: {
            props: import("zod").ZodObject<{
                title: import("zod").ZodString;
                description: import("zod").ZodNullable<import("zod").ZodString>;
                openPath: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            slots: string[];
            description: string;
        };
        Toggle: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                pressed: import("zod").ZodNullable<import("zod").ZodBoolean>;
                variant: import("zod").ZodNullable<import("zod").ZodEnum<{
                    default: "default";
                    outline: "outline";
                }>>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        ToggleGroup: {
            props: import("zod").ZodObject<{
                items: import("zod").ZodArray<import("zod").ZodObject<{
                    label: import("zod").ZodString;
                    value: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
                type: import("zod").ZodNullable<import("zod").ZodEnum<{
                    single: "single";
                    multiple: "multiple";
                }>>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        ButtonGroup: {
            props: import("zod").ZodObject<{
                buttons: import("zod").ZodArray<import("zod").ZodObject<{
                    label: import("zod").ZodString;
                    value: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
                selected: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Carousel: {
            props: import("zod").ZodObject<{
                items: import("zod").ZodArray<import("zod").ZodObject<{
                    title: import("zod").ZodNullable<import("zod").ZodString>;
                    description: import("zod").ZodNullable<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        Tooltip: {
            props: import("zod").ZodObject<{
                content: import("zod").ZodString;
                text: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
        DropdownMenu: {
            props: import("zod").ZodObject<{
                label: import("zod").ZodString;
                items: import("zod").ZodArray<import("zod").ZodObject<{
                    label: import("zod").ZodString;
                    value: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
                value: import("zod").ZodNullable<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            events: string[];
            description: string;
        };
        Popover: {
            props: import("zod").ZodObject<{
                trigger: import("zod").ZodString;
                content: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            description: string;
        };
    };
    /**
     * Shared by definition: an action only one surface understands breaks the promotion
     * path, so definitions live here and each surface registers its own handler. See
     * actions.ts for what these encode and why.
     */
    actions: {
        readonly answer: {
            readonly params: import("zod").ZodObject<{
                id: import("zod").ZodString;
                value: import("zod").ZodUnknown;
                note: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            readonly description: string;
        };
        readonly navigate: {
            readonly params: import("zod").ZodObject<{
                href: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            readonly description: string;
        };
        readonly createPage: {
            readonly params: import("zod").ZodObject<{
                parent: import("zod").ZodString;
                title: import("zod").ZodString;
                properties: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
            }, import("zod/v4/core").$strip>;
            readonly description: string;
        };
        readonly updatePage: {
            readonly params: import("zod").ZodObject<{
                id: import("zod").ZodString;
                title: import("zod").ZodOptional<import("zod").ZodString>;
                properties: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
            }, import("zod/v4/core").$strip>;
            readonly description: string;
        };
        readonly deletePage: {
            readonly params: import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            readonly description: string;
        };
    };
}>;
/**
 * Component names the catalog admits, for validators and prompt builders.
 * defineCatalog exposes this itself — alias it rather than re-deriving, so it cannot skew.
 */
export declare const COMPONENT_NAMES: readonly string[];
