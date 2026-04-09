"use client";

import { useCurrentTime } from "@/lib/hooks/useCurrentTime";

const timelineBlocks = [
  {
    color: "bg-p-secondary shadow-[0_0_12px_rgba(145,163,144,0.3)]",
    title: "Focus: Interface Design",
    time: "09:00 — 11:30",
    desc: "Refining Pulsr landing page interactions and tonal architecture.",
    dim: false,
  },
  {
    color: "bg-p-tertiary shadow-[0_0_12px_rgba(222,240,255,0.3)]",
    title: "Weekly Sync",
    time: "11:30 — 12:15",
    desc: "Product roadmap alignment with the engineering team.",
    dim: false,
  },
  {
    color: "bg-p-on-secondary-container",
    title: "Deep Work: Backend Optimization",
    time: "13:00 — 16:00",
    desc: "Upcoming session...",
    dim: true,
  },
];

export default function TimelinePreview() {
  const { time, date } = useCurrentTime();
  return (
    <div className="w-full max-w-5xl relative">
      {/* Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-p-primary/10 to-p-tertiary/10 blur-2xl rounded-[2rem] opacity-50" />

      <div className="relative bg-p-surface-container-low rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl border border-p-outline-variant/15">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col items-start">
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] text-p-on-surface-variant">
              {date}
            </span>
            <h2 className="text-3xl font-bold tracking-tighter tabular-nums text-p-on-surface">
              {time}
            </h2>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-p-secondary" />
            <div className="w-3 h-3 rounded-full bg-p-surface-container-high" />
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-6">
          {timelineBlocks.map((block) => (
            <div
              key={block.title}
              className={`flex items-start gap-6 group ${block.dim ? "opacity-50" : ""}`}
            >
              <div className={`w-1 h-16 rounded-full flex-shrink-0 ${block.color}`} />
              <div className="flex-1 bg-p-surface-container-high p-5 rounded-xl text-left hover:bg-p-surface-bright transition-colors cursor-default">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-lg text-p-on-surface">{block.title}</h3>
                  <span className="text-xs text-p-on-surface-variant font-mono">{block.time}</span>
                </div>
                <p className="text-sm text-p-on-surface-variant">{block.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
