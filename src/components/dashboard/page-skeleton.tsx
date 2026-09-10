import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic placeholder shown by every dashboard route's `loading.tsx` while
 * its server component fetches data — Next.js swaps this in immediately on
 * navigation (via Suspense) so a click never feels like it did nothing,
 * then replaces it with the real page once ready.
 */
export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** Stat-cards-plus-content shape, for the dashboard home. */
export function DashboardHomeSkeleton() {
  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  );
}
