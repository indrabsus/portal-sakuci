"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Overlay dekoratif bertema circuit board (jalur PCB + solder pad).
 * Tempel di container ber-`relative overflow-hidden`; atur intensitas
 * lewat className (mis. `opacity-[0.14]`). Tidak menangkap pointer event.
 */
export function CircuitOverlay({ className }: { className?: string }) {
  // useId bisa mengandung karakter yang tidak valid untuk url(#...) SVG.
  const patternId = `circuit-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full text-primary", className)}
    >
      <defs>
        <pattern id={patternId} width="160" height="160" patternUnits="userSpaceOnUse">
          {/* Jalur PCB */}
          <path
            d="M12 24 H74 L96 46 H148"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M40 152 V104 L62 82 H118"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M152 116 H112 L92 136 V152"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M14 62 V104 H36"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M128 8 V34 L144 50 V70"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Solder pad di ujung jalur */}
          <circle cx="12" cy="24" r="3" fill="currentColor" />
          <circle cx="148" cy="46" r="3" fill="currentColor" />
          <circle cx="118" cy="82" r="3" fill="currentColor" />
          <circle cx="36" cy="104" r="3" fill="currentColor" />
          <circle cx="152" cy="116" r="3" fill="currentColor" />
          <circle cx="144" cy="70" r="3" fill="currentColor" />
          {/* Pad ring (via) berdiri sendiri */}
          <circle cx="70" cy="130" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="70" cy="130" r="1.2" fill="currentColor" />
          <circle cx="104" cy="24" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="104" cy="24" r="1.2" fill="currentColor" />
          {/* Chip kecil */}
          <rect x="52" y="52" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
