// A numbered list where the order is real: each step needs the one before it.
export function Steps({ title, steps, icon }: { title: string; steps: string[]; icon: string }) {
  return (
    <section className="steps">
      <h2>
        <span className={icon} aria-hidden="true" /> {title}
      </h2>
      <ol>
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </section>
  );
}
