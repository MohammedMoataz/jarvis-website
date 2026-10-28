import { test } from "node:test";
import assert from "node:assert/strict";
import { pageMeta, siteUrl } from "./site.ts";

test("every page is noindex", () => {
  const m = pageMeta({ description: "d", path: "/" });
  assert.deepEqual(m.robots, { index: false, follow: false });
});

test("titled pages name JARVIS", () => {
  const m = pageMeta({ title: "Get started", description: "d", path: "/get-started" });
  assert.equal(m.openGraph.title, "Get started · JARVIS");
});

test("every page carries the share image", () => {
  const m = pageMeta({ title: "Get started", description: "d", path: "/get-started" });
  assert.equal(m.openGraph.images[0].url, "/opengraph-image");
  assert.equal(m.openGraph.images[0].width, 1200);
});

test("the home page carries the full name", () => {
  assert.equal(pageMeta({ description: "d", path: "/" }).openGraph.title, "JARVIS — your second brain");
});

test("the origin is the project's own production domain on Vercel", () => {
  assert.equal(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "jarvis-website-ashen.vercel.app" }), "https://jarvis-website-ashen.vercel.app");
  assert.equal(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://jarvis.example/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }), "https://jarvis.example");
  assert.equal(siteUrl({}), "http://localhost:3000");
});
