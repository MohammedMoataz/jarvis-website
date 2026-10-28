// Tiers top to bottom, as a list: readable by screen readers, scrolls sideways on narrow phones.
const TIERS: { name: string; note?: string; boxes: { label: string; sub?: string; key?: boolean }[] }[] = [
  {
    name: "Clients",
    boxes: [
      { label: "Android app", sub: "Flutter · offline database", key: true },
      { label: "Chrome extension", sub: "side panel · outbox", key: true },
      { label: "Admin portal", sub: "Next.js" },
      { label: "Desktop agent", sub: "MCP over stdio" },
      { label: "Other assistants", sub: "MCP over HTTP" },
    ],
  },
  { name: "Edge", note: "the only open port", boxes: [{ label: "nginx", sub: "/api · /graphql · /ws · /mcp · /health", key: true }] },
  {
    name: "Processes",
    boxes: [
      { label: "backend", sub: "REST · GraphQL · socket · alert sweep", key: true },
      { label: "worker", sub: "outbox relay · filing · embedding · reading · rhythm", key: true },
      { label: "backups", sub: "nightly, verified" },
    ],
  },
  {
    name: "19 contexts",
    note: "each owns its data",
    boxes: [
      "capture",
      "notes",
      "recall",
      "conversations",
      "knowledge",
      "media",
      "planning",
      "notifications",
      "rhythm",
      "calendar",
      "training",
      "nutrition",
      "voice",
      "identity",
      "profile",
      "sync",
      "mcp",
      "home",
      "operations",
    ].map((label) => ({ label })),
  },
  {
    name: "Stores and services",
    boxes: [
      { label: "MongoDB", sub: "everything but sign-in · search" },
      { label: "PostgreSQL", sub: "accounts and sessions" },
      { label: "Ollama", sub: "local AI on the owner's PC", key: true },
      { label: "File storage", sub: "documents and photos" },
    ],
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="arch-scroll">
      <ol className="arch" aria-label="JARVIS architecture, from clients to stores">
        {TIERS.map((t) => (
          <li key={t.name} className="arch-tier">
            <p className="arch-name">
              {t.name}
              {t.note && <span> · {t.note}</span>}
            </p>
            <ul className={t.boxes.length > 8 ? "arch-boxes arch-many" : "arch-boxes"}>
              {t.boxes.map((b) => (
                <li key={b.label} className={b.key ? "arch-box key" : "arch-box"}>
                  <strong>{b.label}</strong>
                  {b.sub && <small>{b.sub}</small>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
