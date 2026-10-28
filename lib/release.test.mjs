import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatSize, parseRelease } from "./release-core.ts";

const fixture = JSON.parse(readFileSync(new URL("./release.fixture.json", import.meta.url), "utf8"));
const withAssets = (assets) => ({ ...fixture, assets });

test("picks both assets and the version", () => {
  const r = parseRelease(fixture);
  assert.equal(r.version, "1.10.0");
  assert.equal(r.publishedAt, "2026-10-24T00:41:14Z");
  assert.deepEqual(r.apk, { id: 670827161, name: "jarvis-1.10.0.apk", size: 69572467 });
  assert.equal(r.extension.name, "jarvis-extension-1.10.0-chrome.zip");
});

test("throws when the extension zip is missing", () => {
  assert.throws(() => parseRelease(withAssets([fixture.assets[0]])), /extension/);
});

test("throws on unexpected asset names", () => {
  const renamed = [{ id: 1, name: "jarvis-android-1.10.0.apk", size: 10 }, fixture.assets[1]];
  assert.throws(() => parseRelease(withAssets(renamed)), /apk/);
});

test("throws when an asset version differs from the tag", () => {
  const stale = [{ id: 1, name: "jarvis-1.9.0.apk", size: 10 }, fixture.assets[1]];
  assert.throws(() => parseRelease(withAssets(stale)), /apk/);
});

test("throws on a payload that is not a release", () => {
  assert.throws(() => parseRelease({ message: "Not Found" }), /release/);
});

test("formats sizes", () => {
  assert.equal(formatSize(69572467), "66 MB");
  assert.equal(formatSize(400000), "< 1 MB");
});
