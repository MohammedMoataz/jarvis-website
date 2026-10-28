import { test } from "node:test";
import assert from "node:assert/strict";
import { parseServerUrl, readServerVariable } from "./server-core.ts";

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

const VARIABLE = "https://api.github.com/repos/MohammedMoataz/JARVIS/actions/variables/JARVIS_SERVER_URL";
function stub(answer) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (answer instanceof Error) throw answer;
    return answer;
  };
  return { calls, fetchImpl };
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });

test("reads the address from the JARVIS repository variable, shared for a minute", async () => {
  const s = stub(json({ name: "JARVIS_SERVER_URL", value: "https://quiet-river-12.trycloudflare.com" }));
  assert.equal(await readServerVariable("tok", s.fetchImpl), "https://quiet-river-12.trycloudflare.com");
  assert.equal(s.calls[0].url, VARIABLE);
  assert.equal(s.calls[0].init.headers.Authorization, "Bearer tok");
  assert.deepEqual(s.calls[0].init.next, { revalidate: 60 });
  assert.ok(s.calls[0].init.signal instanceof AbortSignal);
});

test("a missing, refused or unreachable variable is no address", async () => {
  assert.equal(await readServerVariable("tok", stub(json({ message: "Not Found" }, 404)).fetchImpl), null);
  assert.equal(await readServerVariable("tok", stub(json({ value: "https://evil.com" })).fetchImpl), null);
  assert.equal(await readServerVariable("tok", stub(new TypeError("fetch failed")).fetchImpl), null);
});
