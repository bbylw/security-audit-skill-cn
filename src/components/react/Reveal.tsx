"use client";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * 入场显现：默认可见（SSR / 无 JS / hydration 首帧均为普通 div），
 * 挂载后才启用 motion 动画。`reduce` 只影响动画参数，不分支元素树，
 * 避免 React 19 hydration mismatch。
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
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
