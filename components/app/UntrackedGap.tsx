interface Props {
  minutes: number;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function UntrackedGap({ minutes }: Props) {
  return (
    <div className="relative h-12 flex items-center">
      <span className="w-16 shrink-0" />
      <div className="flex-1 ml-4 border-y border-dashed border-p-outline-variant/10 flex items-center px-4">
        <span className="text-[0.625rem] text-p-on-surface-variant/40 tracking-widest uppercase">
          Untracked · {formatDuration(minutes)}
        </span>
      </div>
    </div>
  );
}
