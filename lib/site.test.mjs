import { test } from "node:test";
import assert from "node:assert/strict";
import { pageMeta } from "./site.ts";

test("every page is noindex", () => {
  const m = pageMeta({ description: "d", path: "/" });
  assert.deepEqual(m.robots, { index: false, follow: false });
});

test("titled pages name JARVIS", () => {
  const m = pageMeta({ title: "Get started", description: "d", path: "/get-started" });
  assert.equal(m.openGraph.title, "Get started · JARVIS");
});

test("the home page carries the full name", () => {
  assert.equal(pageMeta({ description: "d", path: "/" }).openGraph.title, "JARVIS — your second brain");
});
