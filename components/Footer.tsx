import Link from "next/link";

export function Footer({ version }: { version: string | null }) {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>JARVIS · a private, non-commercial project</span>
        <span className="mono">
          {version && <>JARVIS v{version} · </>}
          <Link href="/get-started">Get started</Link>
        </span>
      </div>
    </footer>
  );
}
