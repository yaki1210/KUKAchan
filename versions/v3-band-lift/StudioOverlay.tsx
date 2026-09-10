import type { ReactNode } from "react";
import { Box, Image as ImageIcon, RotateCw, Undo2 } from "lucide-react";
import { VIEW_PRESETS, useStudio, type ViewId } from "@/lib/studio-store";

const STAGES = [
  { id: "01", name: "白模", hint: "v1 已保存", current: false },
  { id: "02", name: "上色", hint: "v3 分件", current: true },
  { id: "03", name: "动效", hint: "呼吸与表情", current: false },
] as const;

const VIEW_ORDER: ViewId[] = ["front", "threeQuarter", "side", "top", "back"];

export function StudioOverlay() {
  const autoRotate = useStudio((s) => s.autoRotate);
  const wireframe = useStudio((s) => s.wireframe);
  const showRef = useStudio((s) => s.showRef);
  const view = useStudio((s) => s.view);
  const setAutoRotate = useStudio((s) => s.setAutoRotate);
  const setWireframe = useStudio((s) => s.setWireframe);
  const setShowRef = useStudio((s) => s.setShowRef);
  const goToView = useStudio((s) => s.goToView);
  const resetView = useStudio((s) => s.resetView);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-ink-soft">
      <header className="absolute top-0 right-0 left-0 flex items-start justify-between gap-4 p-4 md:p-6">
        <div className="hud-panel pointer-events-auto max-w-[min(100%,22rem)] rounded-xl px-4 py-3 md:rounded-2xl md:px-5 md:py-4">
          <p className="text-[0.68rem] font-medium tracking-[0.22em] text-muted uppercase">
            Language companion
          </p>
          <h1 className="mt-1 text-2xl leading-none font-semibold tracking-tight text-balance md:text-[1.75rem]">
            MIMI
          </h1>
          <p className="mt-2 max-w-[18rem] text-sm leading-snug text-muted">
            分件中：板缝、凹陷顶纹、橙色环带穿过颞窗。对照概念图。
          </p>
          <p className="mt-2 font-mono text-[0.68rem] tracking-wide text-accent">
            阶段 02 · v3-panels
          </p>
        </div>

        <ol className="hud-panel pointer-events-none hidden rounded-2xl px-4 py-3 sm:block">
          {STAGES.map((stage, i) => (
            <li
              key={stage.id}
              className={`flex items-baseline gap-3 py-1.5 ${
                i < STAGES.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <span
                className={`w-6 font-mono text-[0.7rem] ${
                  stage.current ? "text-accent" : "text-muted"
                }`}
              >
                {stage.id}
              </span>
              <span
                className={`text-sm ${
                  stage.current ? "text-ink-soft" : "text-muted"
                }`}
              >
                {stage.name}
              </span>
              <span className="text-[0.7rem] text-muted">{stage.hint}</span>
            </li>
          ))}
        </ol>
      </header>

      {showRef ? (
        <div className="pointer-events-auto absolute top-36 left-4 overflow-hidden rounded-xl border border-line shadow-lg md:top-40 md:left-6">
          <img
            src="/concept-front.jpg"
            alt="概念图"
            className="h-36 w-28 object-cover object-[center_42%] md:h-52 md:w-40"
          />
          <p className="bg-panel px-2 py-1 text-center text-[0.65rem] tracking-wide text-muted">
            概念图对照
          </p>
        </div>
      ) : null}

      <footer className="absolute right-0 bottom-0 left-0 flex flex-col gap-3 p-4 md:flex-row md:items-end md:justify-between md:p-6">
        <p className="hud-panel pointer-events-none rounded-lg px-3 py-1.5 text-[0.72rem] text-muted">
          拖拽旋转 · 滚轮缩放 · 右键平移
        </p>

        <div className="hud-panel pointer-events-auto flex max-w-full flex-wrap items-center gap-1 rounded-xl p-1.5 md:rounded-2xl">
          {VIEW_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => goToView(id)}
              className={`rounded-lg px-2.5 py-2 text-[0.78rem] font-medium transition-colors duration-150 md:px-3 ${
                view === id
                  ? "bg-ink-soft text-ink"
                  : "text-muted hover:bg-panel-2 hover:text-ink-soft"
              }`}
            >
              {VIEW_PRESETS[id].label}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-line-strong sm:block" />
          <Toggle
            pressed={autoRotate}
            onPressed={() => setAutoRotate(!autoRotate)}
            label="旋转"
            icon={<RotateCw className="size-3.5" strokeWidth={1.75} />}
          />
          <Toggle
            pressed={wireframe}
            onPressed={() => setWireframe(!wireframe)}
            label="线框"
            icon={<Box className="size-3.5" strokeWidth={1.75} />}
          />
          <Toggle
            pressed={showRef}
            onPressed={() => setShowRef(!showRef)}
            label="对照"
            icon={<ImageIcon className="size-3.5" strokeWidth={1.75} />}
          />
          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[0.78rem] font-medium text-muted transition-colors duration-150 hover:bg-panel-2 hover:text-ink-soft"
          >
            <Undo2 className="size-3.5" strokeWidth={1.75} />
            复位
          </button>
        </div>
      </footer>
    </div>
  );
}

function Toggle({
  pressed,
  onPressed,
  label,
  icon,
}: {
  pressed: boolean;
  onPressed: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onPressed}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[0.78rem] font-medium transition-colors duration-150 ${
        pressed
          ? "bg-ink-soft text-ink"
          : "text-muted hover:bg-panel-2 hover:text-ink-soft"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
