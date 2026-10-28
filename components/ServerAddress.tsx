"use client";

import { useRef, useState } from "react";
import { Button } from "primereact/button";

// Copy needs the Clipboard API inside the click; some in-app browsers refuse it, so the address is
// then selected for the visitor to copy by hand.
export function ServerAddress({ url }: { url: string }) {
  const field = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      field.current?.focus();
      field.current?.select();
      setState("manual");
    }
  };

  return (
    <>
      <div className="dl-address">
        <input
          ref={field}
          id="server-address"
          className="dl-input"
          readOnly
          value={url}
          aria-label="JARVIS server address"
          onFocus={(e) => e.currentTarget.select()}
        />
        {/* not busy: a local clipboard write, nothing is sent */}
        <Button
          type="button"
          size="small"
          icon={state === "copied" ? "pi pi-check" : "pi pi-copy"}
          label={state === "copied" ? "Copied" : "Copy"}
          onClick={copy}
        />
      </div>
      <p className="dl-hint" aria-live="polite">
        {state === "manual" ? "Press Ctrl+C to copy." : "Paste this when JARVIS asks for a server."}
      </p>
    </>
  );
}
