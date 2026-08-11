/**
 * dist/ is committed (see README) — these guard the two ways that arrangement can rot:
 * dist drifting behind src, and the catalog silently losing components in a bad merge.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

test("committed dist matches a fresh build of src", () => {
  execSync("npx tsc -p tsconfig.json --outDir /tmp/wc-dist-check", { stdio: "pipe" });
  for (const f of ["index.js", "catalog.js", "react.js", "index.d.ts", "catalog.d.ts", "react.d.ts"]) {
    assert.equal(
      readFileSync(`dist/${f}`, "utf8"),
      readFileSync(`/tmp/wc-dist-check/${f}`, "utf8"),
      `dist/${f} is stale — run \`npm run build\` and commit the result`,
    );
  }
});

test("the catalog still admits the full curated set", async () => {
  const { catalog, COMPONENT_NAMES } = await import("../dist/index.js");
  assert.ok(catalog, "catalog exists");
  assert.equal(COMPONENT_NAMES.length, 40, "40 curated components — a change here must be deliberate");
  for (const name of ["Card", "Table", "Dialog", "Input", "Button", "Tabs", "Board", "DataTablePreview", "DataTableDetail", "PageHeader"]) {
    assert.ok(COMPONENT_NAMES.includes(name), `${name} present`);
  }
});

function el(type, props) {
  return { type, props, children: [], visible: true };
}

test("catalog.validate() rejects a component prop that fails its own schema", async () => {
  const { catalog } = await import("../dist/index.js");
  const spec = {
    root: "t1",
    elements: { t1: el("Table", { columns: [{ key: "name", label: "Name" }], items: [] }) },
  };
  const result = catalog.validate(spec);
  assert.equal(result.success, false, "a Table.columns of {key,label} objects must fail — the schema wants {key,name,type,options}");
  assert.match(result.error.message, /columns/);
});

test("catalog.validate() rejects unknown props by name", async () => {
  const { catalog } = await import("../dist/index.js");
  const spec = {
    root: "b1",
    elements: { b1: el("Board", { data: [], titleKey: "name" }) },
  };
  const result = catalog.validate(spec);
  assert.equal(result.success, false);
  assert.match(result.error.message, /unknown prop/);
  assert.match(result.error.message, /data/);
});

test("catalog.validate() still accepts a correctly-shaped spec", async () => {
  const { catalog } = await import("../dist/index.js");
  const spec = {
    root: "t1",
    elements: {
      t1: el("Table", {
        columns: [{ key: "name", name: "Name", type: "text", options: null }],
        items: [{ id: "1", title: "a", icon: null, properties: { name: "a" } }],
        activeRowId: { $bindState: "/ui/t1/activeRowId" },
        editValue: { $bindState: "/ui/t1/editValue" },
      }),
    },
  };
  assert.equal(catalog.validate(spec).success, true);
});

test("catalog.validate() skips $-bound prop values — they're deferred, not type-checkable yet", async () => {
  const { catalog } = await import("../dist/index.js");
  const spec = {
    root: "t1",
    elements: {
      t1: el("Table", {
        columns: { $state: "/schemas/deals" },
        items: { $state: "/data/deals" },
        activeRowId: { $bindState: "/ui/t1/activeRowId" },
        editValue: { $bindState: "/ui/t1/editValue" },
      }),
    },
  };
  assert.equal(catalog.validate(spec).success, true);
});

test("DataTablePreview/DataTableDetail accept a correctly-shaped, same-source spec", async () => {
  const { catalog } = await import("../dist/index.js");
  const spec = {
    root: "root",
    elements: {
      root: { type: "Stack", props: {}, children: ["preview", "detail"], visible: true },
      preview: el("DataTablePreview", {
        items: { $state: "/data/deals" },
        columns: { $state: "/schemas/deals" },
        maxRows: 5,
        activeRowId: { $bindState: "/ui/deals/previewActiveRowId" },
      }),
      detail: el("DataTableDetail", {
        items: { $state: "/data/deals" },
        columns: { $state: "/schemas/deals" },
        searchable: true,
        sortable: true,
        pageSize: 20,
        activeRowId: { $bindState: "/ui/deals/activeRowId" },
        editValue: { $bindState: "/ui/deals/editValue" },
      }),
    },
  };
  assert.equal(catalog.validate(spec).success, true);
});

test("DataTablePreview requires activeRowId to be $bindState-bound", async () => {
  const { catalog } = await import("../dist/index.js");
  const spec = {
    root: "p1",
    elements: {
      p1: el("DataTablePreview", { items: [], columns: [] }),
    },
  };
  const result = catalog.validate(spec);
  assert.equal(result.success, false);
  assert.match(result.error.message, /activeRowId/);
});
