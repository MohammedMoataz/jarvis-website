import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  description: "JARVIS keeps everything you capture, files it, and answers from your own notes, with sources.",
  path: "/",
});

export default function Home() {
  return (
    <section className="wrap" style={{ paddingBlock: 96 }}>
      <h1>Your second brain.</h1>
    </section>
  );
}
