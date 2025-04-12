import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function BookmarkMinimalItemSkeleton() {
  return (
    <Card className="overflow-hidden p-3 bg-background border-border rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="w-6 h-6 rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );
}
