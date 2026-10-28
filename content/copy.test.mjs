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

test("every landing section has a title and points", () => {
  for (const key of ["sayItOnce", "askYourLibrary", "readItLater", "yourDay", "bodyAndHabits", "offline", "privacy", "assistants"]) {
    assert.ok(copy[key].title && copy[key].lead && copy[key].points.length >= 3, key);
  }
});
