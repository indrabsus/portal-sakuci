"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Mode terang" },
  { value: "dark", icon: Moon, label: "Mode gelap" },
  { value: "system", icon: Monitor, label: "Ikuti sistem" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-0.5 rounded-full border bg-muted/40 p-0.5">
      {OPTIONS.map((opt) => {
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <opt.icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
