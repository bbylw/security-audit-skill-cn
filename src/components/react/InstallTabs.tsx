"use client";
import { useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

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
    <div className="overflow-hidden rounded-2xl border border-zinc-950 bg-zinc-950 shadow-[0_24px_60px_-24px_rgb(16_185_129/0.4)] dark:border-zinc-800">
      <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-3" role="tablist" aria-label="安装方式" onKeyDown={onKeyDown}>
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
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
              className={`ml-1 hidden rounded-full px-3 py-1 font-mono text-xs transition active:scale-[0.98] first:ml-2 sm:inline ${
                selected
                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {s.label}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[11px] text-zinc-500">{active.label}</span>
      </div>
      <div id="install-panel" role="tabpanel" aria-labelledby={`install-tab-${active.id}`} className="code-scroll overflow-x-auto p-5">
        <pre className="font-mono text-[13px] leading-relaxed"><code>
          <span className="text-emerald-400">$ </span><span className="text-zinc-100">{active.cmd}</span>
        </code></pre>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-3">
        <span className="font-mono text-xs text-zinc-500">{active.hint}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-[0.98] ${
            copied === "fail"
              ? "bg-amber-600 text-white"
              : copied === "ok"
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
        >
          {copied === "ok" ? <CheckIcon size={14} weight="bold" aria-hidden /> : <CopyIcon size={14} weight="bold" aria-hidden />}
          {copied === "ok" ? "已复制" : copied === "fail" ? "复制失败，请手动选择" : "复制命令"}
        </button>
      </div>
    </div>
  );
}
