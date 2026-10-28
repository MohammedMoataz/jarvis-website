import { copy } from "@/content/copy";
import { DownloadCard } from "@/components/DownloadCard";
import { Steps } from "@/components/Steps";
import { getRelease } from "@/lib/release";
import { getServerUrl } from "@/lib/server";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Get started",
  description: "Download the JARVIS Android app and Chrome extension, paste the server address, and create your account.",
  path: "/get-started",
});

export default async function GetStarted() {
  const g = copy.getStarted;
  const release = await getRelease();
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">JARVIS</p>
        <h1>{g.title}</h1>
        <p className="feature-lead">{g.lead}</p>
      </header>
      <DownloadCard release={release} serverUrl={await getServerUrl()} />
      <div className="steps-grid">
        <Steps title={g.phoneTitle} steps={g.phone} icon="pi pi-mobile" />
        <Steps title={g.extensionTitle} steps={g.extension} icon="pi pi-desktop" />
      </div>
      <div className="notes">
        <p>{g.google}</p>
        <p>{g.iphone}</p>
      </div>
      <section className="steps">
        <h2>{g.updatingTitle}</h2>
        <ul>
          {g.updating.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>
      <section className="faq">
        <h2>{g.troubleshootingTitle}</h2>
        <dl>
          {g.troubleshooting.map((t) => (
            <div key={t.q}>
              <dt>{t.q}</dt>
              <dd>{t.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
