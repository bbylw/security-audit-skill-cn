import { useEffect, useLayoutEffect } from "react";

/**
 * 同构 layout effect：浏览器端用 useLayoutEffect（在首次绘制前生效，
 * 避免入场动画把已经画出来的内容再藏起来，形成一帧闪烁），
 * 服务端回落到 useEffect，以免触发 React 的 SSR 警告。
 */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
