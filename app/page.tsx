import { DownloadCard } from "@/components/DownloadCard";
import { getRelease } from "@/lib/release";
import { getServerUrl } from "@/lib/server";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  description: "JARVIS keeps everything you capture, files it, and answers from your own notes, with sources.",
  path: "/",
});

export default async function Home() {
  const release = await getRelease();
  return (
    <section className="wrap" style={{ paddingBlock: 96, display: "grid", gap: 32 }}>
      <h1>Your second brain.</h1>
      <DownloadCard release={release} serverUrl={getServerUrl()} />
    </section>
  );
}
