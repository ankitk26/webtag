import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { FolderIcon } from "lucide-react";
import { allBookmarksQuery, folderBookmarksCountQuery } from "~/lib/queries";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function FolderList() {
  const { folderId } = useSearch({
    from: "/_protected/bookmarks",
  });
  const { data: bookmarks } = useQuery(allBookmarksQuery);
  const { data: folders, isPending } = useQuery(folderBookmarksCountQuery);

  if (isPending) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors bg-secondary/40"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 flex flex-col">
      <Link
        to="/bookmarks"
        search={(prev) => ({ ...prev, folderId: undefined })}
      >
        <div
          className={cn(
            "w-full flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
            folderId === undefined
              ? "bg-secondary text-secondary-foreground"
              : "hover:bg-secondary/80"
          )}
        >
          <div className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            <span>All Bookmarks</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {bookmarks?.length}
          </span>
        </div>
      </Link>

      {folders?.map((folder) => (
        <Link
          to="/bookmarks"
          key={`folder-${folder.id}`}
          search={(prev) => ({ ...prev, folderId: folder.id })}
        >
          <div
            className={cn(
              "w-full flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              folderId === folder.id
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/80"
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FolderIcon className="h-4 w-4 flex-shrink-0" />
              <span>{folder.name}</span>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {folder.bookmark_count}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
