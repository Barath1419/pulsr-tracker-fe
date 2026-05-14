export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-p-surface-container-high rounded-lg ${className}`}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="pt-24 lg:ml-64 px-6 md:px-12 pb-32 max-w-5xl mx-auto space-y-16 animate-pulse">
      {/* Identity */}
      <section className="flex items-end gap-8">
        <div className="w-32 h-32 rounded-full bg-p-surface-container-high flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-10 bg-p-surface-container-high rounded-lg w-48" />
          <div className="h-4 bg-p-surface-container-high rounded w-36" />
        </div>
      </section>

      {/* Patterns */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="h-3 bg-p-surface-container-high rounded w-24" />
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-p-surface-container-low p-6 rounded-xl space-y-4 h-28" />
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-end gap-4">
          <div className="h-20 bg-p-surface-container-low rounded-xl" />
          <div className="h-20 bg-p-surface-container-low rounded-xl" />
        </div>
      </div>

      {/* Consistency + Goals */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4 bg-p-surface-container-low p-8 rounded-xl h-48" />
        <div className="col-span-12 md:col-span-8 space-y-4">
          <div className="h-3 bg-p-surface-container-high rounded w-24" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-p-surface-container-high rounded-xl" />
            <div className="h-28 bg-p-surface-container-high rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="w-12 h-4 bg-p-surface-container-high rounded mt-1 flex-shrink-0" />
          <div className="flex-1 bg-p-surface-container-high rounded-xl h-20" />
        </div>
      ))}
    </div>
  );
}
