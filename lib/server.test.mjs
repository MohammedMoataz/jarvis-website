import { test } from "node:test";
import assert from "node:assert/strict";
import { parseServerUrl } from "./server-core.ts";

test("accepts a quick tunnel address", () => {
  assert.equal(parseServerUrl("https://quiet-river-12.trycloudflare.com"), "https://quiet-river-12.trycloudflare.com");
});

test("trims surrounding spaces", () => {
  assert.equal(parseServerUrl(" https://a.trycloudflare.com "), "https://a.trycloudflare.com");
});

test("refuses anything that is not a bare https trycloudflare origin", () => {
  for (const raw of [
    undefined,
    "",
    "http://a.trycloudflare.com",
    "https://evil.com",
    "https://a.trycloudflare.com/path",
    "https://u:p@a.trycloudflare.com",
    "https://a.trycloudflare.com.evil.com",
    "https://A.trycloudflare.com",
    "javascript:alert(1)",
  ]) {
    assert.equal(parseServerUrl(raw), null, String(raw));
  }
});
