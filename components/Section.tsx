import { Tag } from "primereact/tag";
import { Reveal } from "@/components/Reveal";
import type { Section as SectionCopy } from "@/content/copy";

// One capability: what it is on the left, what it does for you on the right.
export function Section({ s, id }: { s: SectionCopy; id?: string }) {
  return (
    <section className="feature wrap" id={id}>
      <Reveal className="feature-head">
        <p className="eyebrow">
          <span className={s.icon} aria-hidden="true" /> {s.eyebrow}
        </p>
        <h2>{s.title}</h2>
        <p className="feature-lead">{s.lead}</p>
        <div className="chips">
          {s.chips.map((c) => (
            <Tag key={c} value={c} className={s.gold ? "chip chip-gold" : "chip"} />
          ))}
        </div>
      </Reveal>
      <Reveal>
        <ul className="points">
          {s.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
