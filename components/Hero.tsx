import Link from "next/link";
import { copy } from "@/content/copy";
import { HeroScene } from "@/components/HeroScene";

export function Hero() {
  const h = copy.hero;
  return (
    <section className="hero wrap">
      <div className="hero-text">
        <p className="eyebrow">{h.eyebrow}</p>
        <h1>{h.title}</h1>
        <p className="hero-lead">{h.lead}</p>
        <div className="hero-actions">
          <Link href="/get-started" className="p-button p-component">
            <span className="pi pi-download" aria-hidden="true" />
            {h.primary}
          </Link>
          <Link href="/how-it-works" className="p-button p-component p-button-outlined">
            {h.secondary}
          </Link>
        </div>
      </div>
      <HeroScene />
    </section>
  );
}
