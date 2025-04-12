import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function BookmarkListItemSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-4 flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-md mt-1" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 mt-8 w-full" />
              <Skeleton className="h-3 w-1/4" />
            </div>

            <Skeleton className="w-6 h-6 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
