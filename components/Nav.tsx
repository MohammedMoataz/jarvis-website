import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="JARVIS home">
          {/* eslint-disable-next-line @next/next/no-img-element -- a 549-byte SVG; next/image adds nothing */}
          <img src="/logo.svg" alt="" width={30} height={30} className="ring-spin" />
          JARVIS
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/#features" className="hide-sm">
            Features
          </Link>
          <Link href="/how-it-works" className="hide-sm">
            How it works
          </Link>
          <Link href="/get-started" className="cta">
            Get started
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
