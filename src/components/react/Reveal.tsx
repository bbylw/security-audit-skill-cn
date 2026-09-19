"use client";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

/**
 * 入场显现：SSR 与 hydration 首帧都渲染普通 div（默认可见，无 JS 也可读），
 * 挂载后在首次绘制前切到 motion 动画，避免内容「先显示、再隐藏、再淡入」的闪烁。
 * `reduce` 只决定是否播放动画，不分支元素树，避免 React 19 hydration mismatch。
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  useIsoLayoutEffect(() => {
    setMounted(true);
  }, []);

  // min-w-0：包裹层常被用作 grid/flex item，默认的 min-width:auto 会被内部
  // 不可断行内容（长命令、长文件名）撑开，导致窄屏整页横向溢出。
  const cls = className ? `min-w-0 ${className}` : "min-w-0";

  if (!mounted || reduce) return <div className={cls}>{children}</div>;
  return (
    <motion.div
      className={cls}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
