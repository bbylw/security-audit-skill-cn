"use client";
import { useMemo, useState } from "react";
import { docFiles, type FileGroup } from "../../data/content";

const TABS: { id: FileGroup | "all"; label: string }[] = [
  { id: "all", label: "全部 20" },
  { id: "core", label: "核心流程" },
  { id: "hunt", label: "搜寻类" },
  { id: "ops", label: "校验工程" },
];

const GROUP_LABEL: Record<FileGroup, string> = {
  core: "核心流程",
  hunt: "搜寻类",
  ops: "校验工程",
};

export function FileMatrix() {
  const [tab, setTab] = useState<FileGroup | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return docFiles.filter((f) => {
      if (tab !== "all" && f.group !== tab) return false;
      if (!query) return true;
      return (f.name + f.use + f.detail).toLowerCase().includes(query);
    });
  }, [tab, q]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="文件分组">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm transition active:scale-[0.98] ${
                tab === t.id
                  ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950"
                  : "border border-zinc-300 text-zinc-600 hover:border-emerald-500/50 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="relative sm:ml-auto sm:w-64">
          <span className="sr-only">搜索文件</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索，如 auth / rpc / ledger"
            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-600"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="font-medium">没有匹配的文件</p>
          <p className="mt-1 text-sm text-zinc-500">换个关键词，或清空搜索再试。</p>
          <button
            type="button"
            onClick={() => { setQ(""); setTab("all"); }}
            className="mt-4 rounded-full border border-zinc-300 px-4 py-1.5 text-sm transition hover:border-emerald-500/60 active:scale-[0.98] dark:border-zinc-700"
          >
            重置筛选
          </button>
        </div>
      ) : (
        <ul aria-live="polite" className="mt-5 grid gap-3 md:grid-cols-2">
          {list.map((f) => (
            <li
              key={f.name}
              className="group rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-emerald-500/40 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                  {GROUP_LABEL[f.group]}
                </span>
                <code className="truncate font-mono text-[13px] font-semibold">{f.name}</code>
              </div>
              <p className="mt-2 text-sm font-medium">{f.use}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.detail}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 font-mono text-xs text-zinc-500">共 {list.length} / {docFiles.length} 个文件 · 搜寻类覆盖 11 个攻击面家族</p>
    </div>
  );
}
