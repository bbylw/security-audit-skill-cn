"use client";
import { useRef, useState } from "react";

const SNIPPETS = [
  {
    id: "project",
    label: "项目级安装",
    hint: "写入当前项目 skills 目录",
    cmd: "npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit",
  },
  {
    id: "global",
    label: "用户级安装",
    hint: "加 --global，写入用户级 skills 目录",
    cmd: "npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global",
  },
  {
    id: "help",
    label: "查看帮助",
    hint: "查看智能体选择与非交互选项",
    cmd: "npx skills --help",
  },
] as const;

export function InstallTabs() {
  const [id, setId] = useState<string>("project");
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = SNIPPETS.findIndex((s) => s.id === id);
  const active = SNIPPETS[index] ?? SNIPPETS[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % SNIPPETS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index + SNIPPETS.length - 1) % SNIPPETS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SNIPPETS.length - 1;
    if (next !== null) {
      e.preventDefault();
      setId(SNIPPETS[next].id);
      setCopied("idle");
      tabRefs.current[next]?.focus();
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.cmd);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    setTimeout(() => setCopied("idle"), 1600);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex gap-2 border-b border-zinc-200 p-3 dark:border-zinc-800" role="tablist" aria-label="安装方式" onKeyDown={onKeyDown}>
        {SNIPPETS.map((s, i) => {
          const selected = id === s.id;
          return (
            <button
              key={s.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`install-tab-${s.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls="install-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => { setId(s.id); setCopied("idle"); }}
              className={`rounded-full px-4 py-1.5 font-mono text-[13px] transition active:scale-[0.98] ${
                selected
                  ? "bg-zinc-900 text-white dark:bg-emerald-400 dark:text-emerald-950"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <div id="install-panel" role="tabpanel" aria-labelledby={`install-tab-${active.id}`} className="code-scroll overflow-x-auto p-5">
        <pre className="font-mono text-[13px] leading-relaxed"><code>
          <span className="text-zinc-500 dark:text-zinc-400">$ </span><span className="text-zinc-900 dark:text-zinc-100">{active.cmd}</span>
        </code></pre>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{active.hint}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-[0.98] ${
            copied === "fail"
              ? "bg-amber-600 text-white dark:bg-amber-400 dark:text-amber-950"
              : "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
          }`}
        >
          {copied === "ok" ? "已复制" : copied === "fail" ? "复制失败，请手动选择" : "复制命令"}
        </button>
      </div>
    </div>
  );
}
