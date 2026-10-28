import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseRelease } from "./release-core.ts";
import { resolveDownload } from "./download-core.ts";

const release = parseRelease(JSON.parse(readFileSync(new URL("./release.fixture.json", import.meta.url), "utf8")));
const SIGNED = "https://objects.githubusercontent.com/github-production-release-asset/x?sig=1";

function stub(answer) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (answer instanceof Error) throw answer;
    return answer;
  };
  return { calls, fetchImpl };
}
const redirect = (location) => new Response(null, { status: 302, headers: { location } });

test("redirects to the signed URL", async () => {
  const s = stub(redirect(SIGNED));
  assert.deepEqual(await resolveDownload("apk", release, "tok", s.fetchImpl), { status: 302, location: SIGNED });
  assert.equal(s.calls[0].url, "https://api.github.com/repos/MohammedMoataz/JARVIS/releases/assets/670827161");
  assert.equal(s.calls[0].init.headers.Accept, "application/octet-stream");
  assert.equal(s.calls[0].init.headers.Authorization, "Bearer tok");
  assert.equal(s.calls[0].init.redirect, "manual");
  assert.ok(s.calls[0].init.signal instanceof AbortSignal);
});

test("the extension resolves its own asset", async () => {
  const s = stub(redirect(SIGNED));
  await resolveDownload("extension", release, "tok", s.fetchImpl);
  assert.match(s.calls[0].url, /\/assets\/670827157$/);
});

test("unknown kind is 404", async () => {
  const s = stub(redirect(SIGNED));
  assert.deepEqual(await resolveDownload("ipa", release, "tok", s.fetchImpl), { status: 404 });
  assert.equal(s.calls.length, 0);
});

test("GitHub error is 503", async () => {
  for (const answer of [new Response("Not Found", { status: 404 }), new Response("rate limited", { status: 403 })]) {
    assert.deepEqual(await resolveDownload("apk", release, "tok", stub(answer).fetchImpl), { status: 503 });
  }
  const timeout = Object.assign(new Error("timed out"), { name: "TimeoutError" });
  assert.deepEqual(await resolveDownload("apk", release, "tok", stub(timeout).fetchImpl), { status: 503 });
});

test("a redirect to another host is 503", async () => {
  assert.deepEqual(await resolveDownload("apk", release, "tok", stub(redirect("https://evil.com/x")).fetchImpl), { status: 503 });
  assert.deepEqual(await resolveDownload("apk", release, "tok", stub(new Response(null, { status: 302 })).fetchImpl), { status: 503 });
});

test("the newer release-assets host is accepted", async () => {
  const other = "https://release-assets.githubusercontent.com/github-production-release-asset/y?sig=2";
  assert.deepEqual(await resolveDownload("apk", release, "tok", stub(redirect(other)).fetchImpl), { status: 302, location: other });
});
