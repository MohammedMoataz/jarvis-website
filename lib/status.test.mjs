import { test } from "node:test";
import assert from "node:assert/strict";
import { checkHealth } from "./status-core.ts";

const URL_ = "https://quiet-river-12.trycloudflare.com";
function stub(answer) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (answer instanceof Error) throw answer;
    return answer;
  };
  return { calls, fetchImpl };
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("no address is unknown and nothing is fetched", async () => {
  const s = stub(json({ status: "ok" }));
  assert.equal(await checkHealth(null, s.fetchImpl), "unknown");
  assert.equal(s.calls.length, 0);
});

test("a healthy JARVIS is online", async () => {
  const s = stub(json({ status: "ok" }));
  assert.equal(await checkHealth(URL_, s.fetchImpl), "online");
  assert.equal(s.calls[0].url, `${URL_}/health`);
  assert.ok(s.calls[0].init.signal instanceof AbortSignal);
});

test("the health answer is cached once, by the route, not again by the fetch", async () => {
  const s = stub(json({ status: "ok" }));
  await checkHealth(URL_, s.fetchImpl);
  // no-store would make /api/status dynamic (one check per visitor); a fetch-level window on top
  // of the route's 60 s would let "online" outlive a switched-off PC by a second minute.
  assert.notEqual(s.calls[0].init.cache, "no-store");
  assert.equal(s.calls[0].init.next, undefined);
});

test("degraded still answers, so it is online", async () => {
  assert.equal(await checkHealth(URL_, stub(json({ status: "degraded" })).fetchImpl), "online");
});

test("a tunnel error page is offline", async () => {
  assert.equal(await checkHealth(URL_, stub(new Response("Bad gateway", { status: 502 })).fetchImpl), "offline");
  assert.equal(await checkHealth(URL_, stub(new Response("<html>", { status: 200 })).fetchImpl), "offline");
});

test("status: unreachable host is offline", async () => {
  assert.equal(await checkHealth(URL_, stub(new TypeError("fetch failed")).fetchImpl), "offline");
});
