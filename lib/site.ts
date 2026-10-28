import type { Metadata } from "next";

// Canonical origin for links and the share preview. No trailing slash: callers append paths.
// On Vercel it is the project's own production domain (jarvis-website.vercel.app belongs to
// someone else). Kept free of `@/` imports so `node --test` can load it directly.
export function siteUrl(env: Record<string, string | undefined>): string {
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
  return (env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/+$/, "");
}

export const SITE_URL = siteUrl(process.env);

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
    // A page's own openGraph block drops app/opengraph-image, so every page names it here.
    openGraph: {
      type: "website",
      siteName: "JARVIS",
      url: path,
      title: ogTitle,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "JARVIS, your second brain" }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  } satisfies Metadata;
}
