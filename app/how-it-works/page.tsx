import { copy } from "@/content/copy";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Reveal } from "@/components/Reveal";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "How it works",
  description: "What happens to a line you type in JARVIS: capture, classify, file, index, recall. Local AI, offline sync, privacy.",
  path: "/how-it-works",
});

function Bullets({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal className="hiw-block">
      <h2>{title}</h2>
      <ul className="points">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function HowItWorks() {
  const h = copy.howItWorks;
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">JARVIS</p>
        <h1>{h.title}</h1>
        <p className="feature-lead">{h.lead}</p>
      </header>
      <section className="hiw-block">
        <h2>{h.loopTitle}</h2>
        <ol className="loop">
          {h.loop.map((step) => {
            const [name, ...rest] = step.split(": ");
            return (
              <li key={step}>
                <strong>{name}</strong>
                <span>{rest.join(": ")}</span>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="hiw-block">
        <h2>{h.diagramTitle}</h2>
        <ArchitectureDiagram />
      </section>
      <Reveal className="hiw-block">
        <h2>{h.patternsTitle}</h2>
        <div className="patterns">
          {h.patterns.map((p) => (
            <div key={p.title} className="pattern">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Bullets title={h.aiTitle} items={h.ai} />
      <Bullets title={h.syncTitle} items={h.sync} />
      <Bullets title={h.privacyTitle} items={h.privacy} />
      <Reveal className="hiw-block">
        <h2>{h.stackTitle}</h2>
        <div className="chips">
          {h.stack.map((s) => (
            <span key={s} className="stack-chip">
              {s}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
