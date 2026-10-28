import { copy } from "@/content/copy";

// One capture becoming a filed task, beside a cited library card. CSS only (globals.css, .scene):
// the resting state is the finished frame, so reduced motion and no-animation browsers see it all.
export function HeroScene() {
  const s = copy.hero.scene;
  return (
    <div className="scene" aria-hidden="true">
      <svg className="scene-ring ring-spin" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".35" />
        <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="21.27 7" opacity=".55" />
        <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeWidth="1" opacity=".6" />
      </svg>
      <div className="scene-capture">
        <span className="scene-prompt">›</span>
        <span className="scene-typed">{s.typed}</span>
      </div>
      <span className="scene-trace" />
      <div className="scene-card scene-task">
        <span className="scene-kind">{s.task.kind}</span>
        <strong>{s.task.title}</strong>
        <span className="scene-when">
          <span className="pi pi-clock" /> {s.task.when}
        </span>
      </div>
      <div className="scene-card scene-link">
        <span className="scene-kind gold">{s.link.kind}</span>
        <strong>{s.link.title}</strong>
        <span className="scene-cite">{s.link.cite}</span>
      </div>
    </div>
  );
}
