import Link from "next/link";
import { copy, SECTIONS } from "@/content/copy";
import { DownloadCard } from "@/components/DownloadCard";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { getRelease } from "@/lib/release";
import { getServerUrl } from "@/lib/server";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  description: "JARVIS keeps everything you capture, files it, and answers from your own notes, with sources.",
  path: "/",
});

export default async function Home() {
  const release = await getRelease();
  const g = copy.getIt;
  return (
    <>
      <Hero />
      <div className="features">
        {SECTIONS.map((key, i) => (
          <Section key={key} s={copy[key]} id={i === 0 ? "features" : undefined} />
        ))}
      </div>
      <section className="get wrap" id="get">
        <Reveal className="get-head">
          <p className="eyebrow">{g.eyebrow}</p>
          <h2>{g.title}</h2>
          <p className="feature-lead">{g.lead}</p>
          <Link href="/get-started">{g.more} →</Link>
        </Reveal>
        <DownloadCard release={release} serverUrl={await getServerUrl()} />
      </section>
    </>
  );
}
