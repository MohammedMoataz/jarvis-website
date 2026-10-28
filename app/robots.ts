import type { MetadataRoute } from "next";

// Shared by link, never found by search (the JARVIS trademark rule).
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
