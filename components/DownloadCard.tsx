import { formatSize, type Release } from "@/lib/release";
import { ServerAddress } from "@/components/ServerAddress";
import { StatusDot } from "@/components/StatusDot";

const released = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

// The two downloads and the owner's server address. Links point at this site's own
// /download routes; the private release URLs never reach the page.
export function DownloadCard({ release, serverUrl }: { release: Release; serverUrl: string | null }) {
  return (
    <div className="dl-card">
      <p className="dl-meta">
        JARVIS v{release.version} · {released(release.publishedAt)}
      </p>
      <div className="dl-buttons">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a route handler redirecting to a file, not a page */}
        <a className="p-button p-component dl-button" href="/download/apk">
          <span className="pi pi-android" aria-hidden="true" />
          <span>
            Android app (APK) <span className="dl-size">· {formatSize(release.apk.size)}</span>
          </span>
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a route handler redirecting to a file, not a page */}
        <a className="p-button p-component p-button-outlined dl-button" href="/download/extension">
          <span className="pi pi-globe" aria-hidden="true" />
          <span>
            Chrome extension (zip) <span className="dl-size">· {formatSize(release.extension.size)}</span>
          </span>
        </a>
      </div>
      <div className="dl-server">
        <div className="dl-server-head">
          <span className="dl-label">Server address</span>
          {serverUrl && <StatusDot />}
        </div>
        {serverUrl ? <ServerAddress url={serverUrl} /> : <p className="dl-ask">Ask the owner for the server address.</p>}
      </div>
    </div>
  );
}
