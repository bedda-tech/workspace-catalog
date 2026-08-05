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
  assert.equal(COMPONENT_NAMES.length, 37, "37 curated components — a change here must be deliberate");
  for (const name of ["Card", "Table", "Dialog", "Input", "Button", "Tabs", "Board"]) {
    assert.ok(COMPONENT_NAMES.includes(name), `${name} present`);
  }
});
