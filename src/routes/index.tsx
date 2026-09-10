import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Studio } from "@/components/studio/Studio";
import { StudioOverlay } from "@/components/studio/StudioOverlay";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const setAutoRotate = useStudio((s) => s.setAutoRotate);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) setAutoRotate(false);
  }, [setAutoRotate]);

  return (
    <main className="studio-root">
      <Studio />
      <StudioOverlay />
    </main>
  );
}
