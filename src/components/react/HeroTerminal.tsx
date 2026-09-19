"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

const LINES = [
  { text: "$ security audit this codebase", cls: "text-emerald-400", pause: 700 },
  { text: "▸ 侦察完成：architecture.md + coverage-ledger.json（42 个单元）", cls: "text-zinc-300", pause: 500 },
  { text: "▸ 派发 8 个隔离搜寻智能体… checks 已记录 136 项", cls: "text-zinc-300", pause: 500 },
  { text: "✓ validate-coverage-ledger.cjs 通过", cls: "text-emerald-300", pause: 450 },
  { text: "▸ 候选 11 → 验证智能体证伪 7，剩余 4", cls: "text-zinc-300", pause: 500 },
  { text: "✓ validate-findings.cjs 通过 · confirmed 2 / needs_validation 2 / rejected 7", cls: "text-emerald-300", pause: 450 },
  { text: "▸ 已派生 REPORT.md · FINDINGS-DETAIL.md · NEEDS-VALIDATION.md", cls: "text-zinc-400", pause: 0 },
];

/**
 * 演示终端：SSR 与无 JS 时保持空壳（容器高度按终态预留，不产生布局跳动），
 * 挂载后在首次绘制前启动打字机，避免「先渲染完整记录、再清空重打」的倒退。
 * 容器不做 live region，避免逐行打断读屏；用 aria-busy 表达进行态。
 */
export function HeroTerminal() {
  const [count, setCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    if (reduce) setCount(LINES.length);
    else setPlaying(true);
  }, [reduce]);

  useEffect(() => {
    if (!playing || reduce) return;
    if (count >= LINES.length) {
      setPlaying(false);
      return;
    }
    // 首行尽快出现，其余按各行 pause 推进
    const delay = count === 0 ? 160 : (LINES[count]?.pause ?? 500);
    const t = setTimeout(() => setCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [count, playing, reduce]);

  const done = count >= LINES.length;

  return (
    <div
      role="group"
      aria-label="安全审计运行演示终端"
      aria-busy={playing}
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_-24px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <span className="ml-2 font-mono text-xs text-zinc-400">audit — coverage-led run</span>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          ledger validated
        </span>
      </div>
      <div className="code-scroll min-h-[352px] space-y-2.5 overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
        {LINES.slice(0, count).map((l, i) => (
          <p key={i} className={l.cls}>
            {l.text}
            {i === 0 && count === 1 && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />}
          </p>
        ))}
        {playing && !done && (
          <p className="text-zinc-400">
            <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />
          </p>
        )}
        {done && (
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-4 font-mono text-center">
            {[
              ["2", "confirmed"],
              ["2", "needs_validation"],
              ["7", "rejected"],
            ].map(([n, k]) => (
              <div key={k} className="rounded-xl bg-zinc-900 px-2 py-2.5">
                <div className="text-lg font-semibold text-zinc-100">{n}</div>
                <div className="truncate text-[11px] text-zinc-400">{k}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-2.5 font-mono text-[11px] text-zinc-400">
        <span>~/security-audit-skill/my-repo/run-3</span>
        <button
          type="button"
          onClick={() => { setCount(0); setPlaying(true); }}
          className="rounded-full border border-zinc-800 px-2.5 py-1 text-zinc-400 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.98]"
        >
          重播
        </button>
      </div>
    </div>
  );
}
