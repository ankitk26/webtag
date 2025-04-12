import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { deleteBookmark } from "~/actions/bookmark.api";
import {
  setIsBookmarkDeleteDialogOpen,
  useDashboardStore,
} from "~/hooks/use-dashboard-store";
import {
  allBookmarksQuery,
  bookmarkTagsQuery,
  filteredBookmarksQuery,
  folderBookmarksCountQuery,
  tagsQuery,
} from "~/lib/queries";

export function DeleteBookmarkDialog() {
  const isBookmarkDeleteDialogOpen = useDashboardStore(
    (store) => store.isBookmarkDeleteDialogOpen
  );
  const bookmarkToDelete = useDashboardStore((store) => store.bookmarkToDelete);
  const queryClient = useQueryClient();
  const { folderId, access, tags } = useSearch({
    from: "/_protected/bookmarks",
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: () =>
      deleteBookmark({ data: { bookmarkId: bookmarkToDelete ?? -1 } }),
    onSuccess: () => {
      // refetch count of all bookmarks
      queryClient.invalidateQueries({
        queryKey: allBookmarksQuery.queryKey,
      });
      // refetch all tags
      queryClient.invalidateQueries({
        queryKey: tagsQuery.queryKey,
      });
      // refetch list of folders and count of bookmarks
      queryClient.invalidateQueries({
        queryKey: folderBookmarksCountQuery.queryKey,
      });
      // refetch current bookmarks list
      queryClient.invalidateQueries({
        queryKey: filteredBookmarksQuery({ folderId, access, tags }).queryKey,
      });
      // refetch bookmark tags in sidebar
      queryClient.invalidateQueries({
        queryKey: bookmarkTagsQuery.queryKey,
      });
      setIsBookmarkDeleteDialogOpen(false);
      toast.success("Bookmark deleted");
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "Could not delete the bookmark",
      });
    },
  });

  return (
    <AlertDialog
      open={isBookmarkDeleteDialogOpen}
      onOpenChange={(open) => setIsBookmarkDeleteDialogOpen(open)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this bookmark? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={() => setIsBookmarkDeleteDialogOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteBookmarkMutation.mutate();
            }}
            disabled={deleteBookmarkMutation.isPending}
            className="bg-destructive cursor-pointer text-white hover:bg-destructive/90"
          >
            {deleteBookmarkMutation.isPending ? (
              <Loader2 className="w-4 h-4" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
