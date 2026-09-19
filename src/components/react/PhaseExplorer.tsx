"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { phases, type Phase } from "../../data/content";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

function PanelBody({ current }: { current: Phase }) {
  return (
    <>
      <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300">
        PHASE {current.no} · {current.en}
      </p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight">{current.title}</h3>
      <p className="mt-2 max-w-[65ch] leading-relaxed text-zinc-600 dark:text-zinc-400">{current.summary}</p>
      <ul className="mt-5 space-y-2.5">
        {current.points.map((pt) => (
          <li key={pt} className="flex gap-2.5 text-sm leading-relaxed">
            <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-zinc-700 dark:text-zinc-300">{pt}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-xl border border-emerald-600/20 bg-emerald-500/[0.06] p-4">
        <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300">{current.artifact}</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{current.artifactDesc}</p>
      </div>
    </>
  );
}

export function PhaseExplorer() {
  const [active, setActive] = useState(phases[0].id);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = phases.findIndex((p) => p.id === active);
  const current = phases[index] ?? phases[0];

  useIsoLayoutEffect(() => {
    setMounted(true);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % phases.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index + phases.length - 1) % phases.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = phases.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(phases[next].id);
      tabRefs.current[next]?.focus();
    }
  };

  const animate = mounted && !reduce;

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div role="tablist" aria-label="六个审计阶段" onKeyDown={onKeyDown} className="relative flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">
        <span aria-hidden="true" className="pointer-events-none absolute left-[27px] top-6 bottom-6 hidden w-px bg-gradient-to-b from-emerald-500/50 via-zinc-300 to-transparent lg:block dark:via-zinc-700"></span>
        {phases.map((p, i) => {
          const selected = p.id === active;
          return (
            <button
              key={p.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`phase-tab-${p.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls="phase-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(p.id)}
              className={`group relative flex min-w-[220px] items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.98] lg:min-w-0 ${
                selected
                  ? "border-emerald-500/50 bg-emerald-500/[0.08] shadow-[0_10px_32px_-14px_rgb(16_185_129/0.45)] dark:bg-emerald-400/[0.08]"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
              }`}
            >
              <span
                className={`font-mono text-xs font-semibold ${
                  selected ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {p.no}
              </span>
              <span>
                <span className="block text-sm font-semibold">{p.title}</span>
                <span className={`block font-mono text-[11px] ${selected ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}>{p.en}</span>
              </span>
              <span
                aria-hidden="true"
                className={`ml-auto h-2 w-2 rounded-full ${selected ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
              />
            </button>
          );
        })}
      </div>

      <div
        id="phase-panel"
        role="tabpanel"
        aria-labelledby={`phase-tab-${current.id}`}
        className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-7 select-none font-mono text-[140px] font-bold leading-none text-zinc-950/[0.04] dark:text-zinc-100/[0.05]">
          {current.no}
        </span>
        <div aria-hidden="true" className="glow-emerald pointer-events-none absolute -right-20 -top-20 h-64 w-64"></div>
        {animate ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="relative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <PanelBody current={current} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="relative">
            <PanelBody current={current} />
          </div>
        )}
        <div className="relative mt-6 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <span role="group" aria-label={`第 ${index + 1} 阶段，共 ${phases.length} 阶段`} className="flex items-center gap-1.5">
            {phases.map((p, i) => (
              <span
                key={p.id}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-emerald-500" : "w-1.5 bg-zinc-300 dark:bg-zinc-700"}`}
              />
            ))}
            <span className="ml-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {index + 1} / {phases.length}
            </span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActive(phases[(index + phases.length - 1) % phases.length].id);
              }}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm transition hover:border-emerald-500/60 hover:text-emerald-700 active:scale-[0.98] dark:border-zinc-700 dark:hover:text-emerald-300"
            >
              上一步
            </button>
            <button
              type="button"
              onClick={() => {
                setActive(phases[(index + 1) % phases.length].id);
              }}
              className="rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-800 active:scale-[0.98] dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
