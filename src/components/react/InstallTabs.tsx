"use client";
import { useState } from "react";

const SNIPPETS = [
  {
    id: "user",
    label: "用户级安装",
    cmd: "npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit",
  },
  {
    id: "global",
    label: "全局安装",
    cmd: "npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global",
  },
  {
    id: "help",
    label: "查看帮助",
    cmd: "npx skills --help",
  },
] as const;

export function InstallTabs() {
  const [id, setId] = useState<string>("user");
  const [copied, setCopied] = useState(false);
  const active = SNIPPETS.find((s) => s.id === id) ?? SNIPPETS[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex gap-2 border-b border-zinc-200 p-3 dark:border-zinc-800" role="tablist" aria-label="安装方式">
        {SNIPPETS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={id === s.id}
            onClick={() => { setId(s.id); setCopied(false); }}
            className={`rounded-full px-4 py-1.5 font-mono text-[13px] transition active:scale-[0.98] ${
              id === s.id
                ? "bg-zinc-900 text-white dark:bg-emerald-400 dark:text-emerald-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="code-scroll overflow-x-auto p-5">
        <pre className="font-mono text-[13px] leading-relaxed"><code>
          <span className="text-zinc-400">$ </span><span className="text-zinc-900 dark:text-zinc-100">{active.cmd}</span>
        </code></pre>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="font-mono text-xs text-zinc-500">{active.id === "global" ? "写入用户级 skills 目录" : active.id === "help" ? "查看智能体选择与非交互选项" : "写入当前项目 skills 目录"}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 active:scale-[0.98] dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
        >
          {copied ? "已复制" : "复制命令"}
        </button>
      </div>
    </div>
  );
}
