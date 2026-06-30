"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <TopLoadingBarInner />
    </Suspense>
  );
}

function TopLoadingBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  function start() {
    if (startedRef.current) return;
    startedRef.current = true;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setVisible(true);
    setProgress(15);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        const remaining = 90 - p;
        return p + remaining * 0.1;
      });
    }, 150);
  }

  function finish() {
    if (!startedRef.current) return;
    startedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }

  useEffect(() => {
    function isModifiedClick(e: MouseEvent) {
      return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    }

    function onClick(e: MouseEvent) {
      if (isModifiedClick(e)) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const isSameUrl = url.pathname === window.location.pathname && url.search === window.location.search;
      if (isSameUrl) return;

      start();
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 shadow-[0_0_8px_theme(colors.indigo.500)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1, transition: "width 200ms ease-out, opacity 200ms ease-out" }}
      />
    </div>
  );
}
