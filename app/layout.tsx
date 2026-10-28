import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "primeicons/primeicons.css";
import "./lara.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { getRelease } from "@/lib/release";

const display = Chakra_Petch({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-chakra" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

// Pages set their own canonical URL, Open Graph and Twitter blocks through pageMeta().
// Every page re-renders at most once a minute: a new release or tunnel address reaches visitors
// without a deploy (the fetches in lib/release.ts and lib/server-core.ts carry their own windows).
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "JARVIS — your second brain", template: "%s · JARVIS" },
  applicationName: "JARVIS",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef3f7" },
    { media: "(prefers-color-scheme: dark)", color: "#060a10" },
  ],
};

// Runs before first paint: the saved theme, else the system's light preference, else dark (the
// JARVIS default). Every colour, PrimeReact's included, reads tokens that switch on this attribute.
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}
if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
document.documentElement.dataset.theme=t})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const release = await getRelease();
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main">{children}</main>
          <Footer version={release.version} />
        </Providers>
      </body>
    </html>
  );
}
