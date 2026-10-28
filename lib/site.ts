import type { Metadata } from "next";

// Canonical origin for links and the share preview. No trailing slash: callers append paths.
// Kept free of `@/` imports so `node --test` can load it directly.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://jarvis-website.vercel.app").replace(/\/+$/, "");

const HOME_TITLE = "JARVIS — your second brain";

// Per-page metadata. Every page is noindex: the site is shared by link, never found by search
// (the JARVIS trademark rule). Next replaces a parent's openGraph block, so pages build it here.
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }) {
  const ogTitle = title ? `${title} · JARVIS` : HOME_TITLE;
  return {
    ...(title && { title }),
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "JARVIS", url: path, title: ogTitle, description },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  } satisfies Metadata;
}
