import { test } from "node:test";
import assert from "node:assert/strict";
import robots from "../app/robots.ts";

const rules = robots().rules;

test("search engines are kept out of every page", () => {
  const all = rules.find((r) => r.userAgent === "*");
  assert.equal(all.disallow, "/");
});

test("link-preview bots may fetch pages, so shared links show the card", () => {
  const preview = rules.find((r) => Array.isArray(r.userAgent));
  for (const bot of ["Twitterbot", "LinkedInBot", "facebookexternalhit", "WhatsApp", "Slackbot", "TelegramBot", "Discordbot"]) {
    assert.ok(preview.userAgent.includes(bot), bot);
  }
  assert.equal(preview.allow, "/");
});
