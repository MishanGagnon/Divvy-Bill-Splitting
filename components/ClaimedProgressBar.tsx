"use client";

import { useMemo } from "react";

interface ClaimedProgressBarProps {
  claimedAmountCents: number;
  totalAmountCents: number;
  label?: string;
  showAmounts?: boolean;
}

export function ClaimedProgressBar({
  claimedAmountCents,
  totalAmountCents,
  label,
  showAmounts = true,
}: ClaimedProgressBarProps) {
  const percentage =
    totalAmountCents > 0
      ? Math.min(100, Math.max(0, (claimedAmountCents / totalAmountCents) * 100))
      : 0;

  const getColor = (percent: number): string => {
    // Red -> Yellow -> Green gradient
    // Using standard Tailwind-ish colors that fit the receipt theme
    if (percent <= 50) {
      const ratio = percent / 50;
      // Interpolate between #ef4444 (red-500) and #eab308 (yellow-500)
      const r = Math.round(239 + (234 - 239) * ratio);
      const g = Math.round(68 + (179 - 68) * ratio);
      const b = Math.round(68 + (8 - 68) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const ratio = (percent - 50) / 50;
      // Interpolate between #eab308 (yellow-500) and #22c55e (green-500)
      const r = Math.round(234 + (34 - 234) * ratio);
      const g = Math.round(179 + (197 - 179) * ratio);
      const b = Math.round(8 + (94 - 8) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const barColor = getColor(percentage);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          {label && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1.5">
              {label}
            </p>
          )}
          <h3 className="text-xs font-bold uppercase tracking-widest leading-none">
            Amount Claimed
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span 
            className="text-xl font-black font-mono leading-none" 
            style={{ color: barColor }}
          >
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      <div className="relative h-4 w-full bg-ink/[0.03] border-2 border-ink overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
        {/* Subtle background pattern for the empty bar */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(var(--ink) 1px, transparent 0)`,
            backgroundSize: '4px 4px'
          }} 
        />
        
        {/* The progress fill */}
        <div
          className="h-full transition-all duration-1000 ease-out relative border-r-2 border-ink/20"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        >
           {/* Diagonal stripe pattern on the fill */}
           <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)`,
              backgroundSize: '12px 12px'
            }} 
          />
        </div>
      </div>

      {showAmounts && (
        <div className="flex justify-between items-start pt-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold opacity-30 tracking-tighter">Claimed</span>
            <span className="text-sm font-mono font-black" style={{ color: percentage > 0 ? barColor : undefined }}>
              {formatCurrency(claimedAmountCents)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase font-bold opacity-30 tracking-tighter">Remaining</span>
            <span className="text-sm font-mono font-bold opacity-60">
              {formatCurrency(Math.max(0, totalAmountCents - claimedAmountCents))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
