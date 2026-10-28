import { test } from "node:test";
import assert from "node:assert/strict";
import { copy } from "./copy.ts";

// Everything a visitor reads, minus the one line that exists to say iPhone is not available.
function readable() {
  const { getStarted, ...rest } = copy;
  const { iphone, ...started } = getStarted ?? {};
  void iphone;
  return JSON.stringify({ ...rest, getStarted: started }).toLowerCase();
}

test("no claim JARVIS does not back", () => {
  const text = readable();
  for (const phrase of [
    "never leaves",
    "stays on your",
    "iphone",
    "ios app",
    "app store",
    "push notification",
    "calorie",
    "progression",
    "personal record",
    "cloud ai",
    "gpt",
    "testimonial",
  ]) {
    assert.ok(!text.includes(phrase), `copy must not say "${phrase}"`);
  }
});

test("the honest parts are said", () => {
  const text = JSON.stringify(copy);
  for (const phrase of ["Not in your library", "owner", "audited"]) {
    assert.ok(text.includes(phrase), `copy must say "${phrase}"`);
  }
});

test("get started walks a phone through to an account", () => {
  const phone = copy.getStarted.phone.join(" ");
  assert.match(phone, /server address/);
  assert.match(phone, /password/);
});

test("get started installs the unpacked extension", () => {
  const ext = copy.getStarted.extension.join(" ");
  for (const s of ["chrome://extensions", "Developer mode", "Load unpacked"]) assert.ok(ext.includes(s), s);
});

test("iPhone is said plainly", () => {
  assert.match(copy.getStarted.iphone, /not available/);
});

test("troubleshooting covers the real failures", () => {
  const all = copy.getStarted.troubleshooting.map((t) => `${t.q} ${t.a}`).join(" ").toLowerCase();
  assert.match(all, /offline/);
  assert.match(all, /registration/);
  assert.match(all, /blocks the install/);
  // A changed quick-tunnel address: sync first, then sign out and back in (design §7 default).
  assert.match(all, /sync.*sign out.*new address/);
});

test("how it works names the local models", () => {
  const ai = copy.howItWorks.ai.join(" ");
  assert.ok(ai.includes("qwen2.5:3b-instruct") && ai.includes("embeddinggemma"));
});

test("every landing section has a title and points", () => {
  for (const key of ["sayItOnce", "askYourLibrary", "readItLater", "yourDay", "bodyAndHabits", "offline", "privacy", "assistants"]) {
    assert.ok(copy[key].title && copy[key].lead && copy[key].points.length >= 3, key);
  }
});
