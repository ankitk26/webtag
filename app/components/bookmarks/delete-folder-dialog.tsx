import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { deleteFolder } from "~/actions/folder.api";
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
import {
  setIsFolderDeleteDialogOpen,
  useDashboardStore,
} from "~/hooks/use-dashboard-store";
import { folderBookmarksCountQuery } from "~/lib/queries";

export function DeleteFolderDialog() {
  const isFolderDeleteDialogOpen = useDashboardStore(
    (store) => store.isFolderDeleteDialogOpen
  );
  const folderToDelete = useDashboardStore((store) => store.folderToDelete);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteFolderMutation = useMutation({
    mutationFn: () =>
      deleteFolder({ data: { folderId: folderToDelete ?? -1 } }),
    onSuccess: async () => {
      // refetch list of folders and count of bookmarks
      queryClient.invalidateQueries({
        queryKey: folderBookmarksCountQuery.queryKey,
      });
      setIsFolderDeleteDialogOpen(false);
      await navigate({ to: "/bookmarks" });
      toast.success("Folder deleted");
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "Could not delete the folder",
      });
    },
  });

  return (
    <AlertDialog
      open={isFolderDeleteDialogOpen}
      onOpenChange={(open) => setIsFolderDeleteDialogOpen(open)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Folder</AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              Are you sure you want to delete this folder? This action cannot be
              undone.
            </p>
            <p>Bookmarks in this folder won't be deleted</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={() => setIsFolderDeleteDialogOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteFolderMutation.mutate();
            }}
            disabled={deleteFolderMutation.isPending}
            className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteFolderMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
