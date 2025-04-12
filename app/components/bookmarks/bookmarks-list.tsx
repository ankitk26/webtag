import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useDashboardStore } from "~/hooks/use-dashboard-store";
import { filteredBookmarksQuery } from "~/lib/queries";
import { Button } from "../ui/button";
import BookmarkCardSkeleton from "./bookmark-card-skeleton";
import BookmarkListItem from "./bookmark-list-item";
import BookmarkListItemSkeleton from "./bookmark-list-item-skeleton";
import BookmarkMinimalItem from "./bookmark-minimal-item";
import BookmarkMinimalItemSkeleton from "./bookmark-minimal-item-skeleton";
import BookmarkCard from "./boomark-card";

export default function BookmarksList() {
  const { view, access, tags, folderId } = useSearch({
    from: "/_protected/bookmarks",
  });

  const { data: bookmarks, isPending } = useQuery(
    filteredBookmarksQuery({ folderId, access, tags })
  );
  const searchQuery = useDashboardStore((store) => store.searchQuery);

  const filteredBookmarks = bookmarks?.filter((bookmark) => {
    const lowerQuery = searchQuery.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      bookmark.name.toLowerCase().includes(lowerQuery) ||
      (bookmark.description ?? "").toLowerCase().includes(lowerQuery) ||
      bookmark.tags?.some((tag) =>
        tag.name.toLowerCase().includes(lowerQuery)
      ) ||
      bookmark.folders?.some((folder) =>
        folder.name.toLowerCase().includes(lowerQuery)
      );

    return matchesSearch;
  });

  if (isPending) {
    if (view === "grid") return <BookmarkCardSkeleton />;
    if (view === "list") return <BookmarkListItemSkeleton />;
    return <BookmarkMinimalItemSkeleton />;
  }

  return (
    <>
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookmarks?.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
      {view === "minimal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookmarks?.map((bookmark) => (
            <BookmarkMinimalItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
      {view === "list" && (
        <div className="space-y-3">
          {filteredBookmarks?.map((bookmark) => (
            <BookmarkListItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}

      {filteredBookmarks?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-4">No bookmarks found</p>
          <Button variant="outline" onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Add Bookmark
          </Button>
        </div>
      )}
    </>
  );
}
