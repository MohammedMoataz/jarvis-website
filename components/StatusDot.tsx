"use client";

import { useEffect, useState } from "react";

type Status = "online" | "offline" | "unknown";

// Reads this site's /api/status, which checks the owner's JARVIS server-side once a minute.
export function StatusDot() {
  const [status, setStatus] = useState<Status>("unknown");

  useEffect(() => {
    let live = true;
    fetch("/api/status")
      .then((r) => r.json())
      .then((b: { status?: Status }) => {
        if (live && b.status) setStatus(b.status);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (status === "unknown") return null;
  return (
    <span className={`dot dot-${status}`} role="status">
      {status === "online" ? "JARVIS is online" : "JARVIS is offline right now. Try again later."}
    </span>
  );
}
