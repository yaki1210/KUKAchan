import { create } from "zustand";

export type ViewId = "front" | "threeQuarter" | "side" | "top" | "back";

export const VIEW_PRESETS: Record<
  ViewId,
  { eye: [number, number, number]; label: string }
> = {
  front: { eye: [0, 0.12, 4.55], label: "前视" },
  threeQuarter: { eye: [2.55, 0.55, 3.7], label: "¾" },
  side: { eye: [4.5, 0.18, 0.2], label: "侧视" },
  top: { eye: [0.15, 4.85, 0.35], label: "顶视" },
  back: { eye: [0, 0.25, -4.55], label: "后视" },
};

type StudioState = {
  autoRotate: boolean;
  wireframe: boolean;
  showRef: boolean;
  view: ViewId | null;
  viewTick: number;
  setAutoRotate: (v: boolean) => void;
  setWireframe: (v: boolean) => void;
  setShowRef: (v: boolean) => void;
  goToView: (view: ViewId) => void;
  resetView: () => void;
};

export const useStudio = create<StudioState>((set) => ({
  autoRotate: true,
  wireframe: false,
  showRef: false,
  view: "threeQuarter",
  viewTick: 0,
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setWireframe: (wireframe) => set({ wireframe }),
  setShowRef: (showRef) => set({ showRef }),
  goToView: (view) =>
    set((s) => ({ view, autoRotate: false, viewTick: s.viewTick + 1 })),
  resetView: () =>
    set((s) => ({
      view: "threeQuarter",
      autoRotate: true,
      wireframe: false,
      viewTick: s.viewTick + 1,
    })),
}));
