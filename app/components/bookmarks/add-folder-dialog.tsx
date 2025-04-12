import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addFolder, updateFolder } from "~/actions/folder.api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  setFolderToEdit,
  setIsFolderDialogOpen,
  useDashboardStore,
} from "~/hooks/use-dashboard-store";
import { folderBookmarksCountQuery, folderByIdQuery } from "~/lib/queries";

export function AddFolderDialog() {
  const folderToEdit = useDashboardStore((store) => store.folderToEdit);
  const isFolderDialogOpen = useDashboardStore(
    (store) => store.isFolderDialogOpen
  );
  const queryClient = useQueryClient();

  const defaultValues = {
    name: folderToEdit?.name ?? "",
    description: folderToEdit?.description ?? "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const mutationToUse = folderToEdit
        ? updateFolderMutation
        : addFolderMutation;
      mutationToUse.mutate(value);
    },
  });

  const addFolderMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      addFolder({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: folderBookmarksCountQuery.queryKey,
      });
      form.reset();
      setIsFolderDialogOpen(false);
      toast.success("Folder created successfully");
    },
    onError: ({ message }) => {
      let description = "Something went wrong. Please try again";
      if (message.includes("duplicate")) {
        description = `Folder with the name "${form.getFieldValue("name")}" already exists`;
      }
      toast.error("Folder was not created", { description });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      updateFolder({
        data: {
          id: folderToEdit?.id ?? -1,
          ...data,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: folderBookmarksCountQuery.queryKey,
      });
      if (folderToEdit) {
        queryClient.invalidateQueries({
          queryKey: folderByIdQuery(folderToEdit.id).queryKey,
        });
      }
      form.reset();
      setFolderToEdit(null);
      setIsFolderDialogOpen(false);
      toast.success("Folder updated successfully");
    },
    onError: () => {
      toast.error("Folder was not updated");
    },
  });

  const isSubmitting = folderToEdit
    ? updateFolderMutation.isPending
    : addFolderMutation.isPending;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setFolderToEdit(null);
    }
    setIsFolderDialogOpen(open);
  };

  return (
    <Dialog open={isFolderDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{folderToEdit ? "Update" : "Add"} Folder</DialogTitle>
            {!folderToEdit && (
              <DialogDescription>
                Create a new folder to organize your bookmarks.
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Name</Label>
              <form.Field
                name="name"
                children={({ state, handleChange }) => (
                  <Input
                    placeholder="Folder name"
                    value={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folder-description">Description</Label>
              <form.Field
                name="description"
                children={({ state, handleChange }) => (
                  <Textarea
                    placeholder="Add a description (optional)"
                    value={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    className="resize-none"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? folderToEdit
                  ? "Updating..."
                  : "Creating..."
                : folderToEdit
                  ? "Update Folder"
                  : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
