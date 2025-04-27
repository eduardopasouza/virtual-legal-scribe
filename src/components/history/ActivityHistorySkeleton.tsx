
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonProps {
  type: 'timeline' | 'list';
}

export function ActivityHistorySkeleton({ type }: SkeletonProps) {
  if (type === 'timeline') {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-border"></div>
              <Skeleton className="h-5 w-48" />
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className="space-y-4">
              {[1, 2].map(j => (
                <div key={j} className="relative pl-8">
                  <Skeleton className="absolute left-0 top-1.5 w-4 h-4 rounded-full" />
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-4 w-60 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-1 h-16 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-60 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
