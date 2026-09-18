"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const LINES = [
  { text: "$ security audit this codebase", cls: "text-emerald-400", pause: 700 },
  { text: "▸ 侦察完成：architecture.md + coverage-ledger.json（42 个单元）", cls: "text-zinc-300", pause: 500 },
  { text: "▸ 派发 8 个隔离搜寻智能体… checks 已记录 136 项", cls: "text-zinc-300", pause: 500 },
  { text: "✓ validate-coverage-ledger.cjs 通过", cls: "text-emerald-300", pause: 450 },
  { text: "▸ 候选 11 → 验证智能体证伪 7，剩余 4", cls: "text-zinc-300", pause: 500 },
  { text: "✓ validate-findings.cjs 通过 · confirmed 2 / needs_validation 2 / rejected 7", cls: "text-emerald-300", pause: 450 },
  { text: "▸ 已派生 REPORT.md · FINDINGS-DETAIL.md · NEEDS-VALIDATION.md", cls: "text-zinc-400", pause: 0 },
];

export function HeroTerminal() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? LINES.length : 0);

  useEffect(() => {
    if (reduce) return;
    if (count >= LINES.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), LINES[count]?.pause ?? 500);
    return () => clearTimeout(t);
  }, [count, reduce]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="安全审计运行演示终端"
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_-24px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <span className="ml-2 font-mono text-xs text-zinc-500">audit — coverage-led run</span>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          ledger validated
        </span>
      </div>
      <div className="code-scroll min-h-[264px] space-y-2.5 overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
        {LINES.slice(0, count).map((l, i) => (
          <p key={i} className={l.cls}>
            {l.text}
            {i === 0 && count === 1 && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />}
          </p>
        ))}
        {count < LINES.length && !reduce && (
          <p className="text-zinc-600">
            <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />
          </p>
        )}
        {count >= LINES.length && (
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-4 font-mono text-center">
            {[
              ["2", "confirmed"],
              ["2", "needs_validation"],
              ["7", "rejected"],
            ].map(([n, k]) => (
              <div key={k} className="rounded-xl bg-zinc-900 px-2 py-2.5">
                <div className="text-lg font-semibold text-zinc-100">{n}</div>
                <div className="truncate text-[11px] text-zinc-500">{k}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-2.5 font-mono text-[11px] text-zinc-600">
        <span>~/security-audit-skill/my-repo/run-3</span>
        <button
          type="button"
          onClick={() => setCount(0)}
          className="rounded-full border border-zinc-800 px-2.5 py-1 text-zinc-400 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.98]"
        >
          重播
        </button>
      </div>
    </div>
  );
}
