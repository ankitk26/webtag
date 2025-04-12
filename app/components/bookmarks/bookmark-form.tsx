import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Globe, Lock, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { checkUrlExists, getBookmarkFieldSuggestions } from "~/actions/ai.api";
import { addBookmark, updateBookmark } from "~/actions/bookmark.api";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { TBookmarkForm } from "~/db/schema";
import {
  setBookmarkToEdit,
  setIsBookmarkDialogOpen,
  useDashboardStore,
} from "~/hooks/use-dashboard-store";
import {
  getFoldersFromStore,
  resetFolderStore,
} from "~/hooks/use-folders-store";
import {
  getTagsFromStore,
  resetTagStore,
  setTagsInStore,
} from "~/hooks/use-tags-store";
import {
  bookmarkTagsQuery,
  filteredBookmarksQuery,
  folderBookmarksCountQuery,
  singleBookmarkTagsQuery,
  tagsQuery,
} from "~/lib/queries";
import BookmarkFoldersInput from "./bookmark-folders-input";
import BookmarkTagsInput from "./bookmark-tags-input";

export default function BookmarkForm() {
  const bookmarkToEdit = useDashboardStore((store) => store.bookmarkToEdit);
  const queryClient = useQueryClient();
  const { folderId, tags, access } = useSearch({
    from: "/_protected/bookmarks",
  });

  const form = useForm({
    defaultValues: {
      name: bookmarkToEdit?.name ?? "",
      description: bookmarkToEdit?.description ?? "",
      is_public: bookmarkToEdit?.is_public ?? false,
      url: bookmarkToEdit?.url ?? "",
    },
    onSubmit: async ({ value }) => {
      if (bookmarkToEdit) {
        updateBookmarkMutation.mutate({ ...value });
      } else {
        addBookmarkMutation.mutate({ ...value });
      }
    },
  });

  const bookmarkFieldsSuggestionsMutation = useMutation({
    mutationFn: (url: string) => getBookmarkFieldSuggestions({ data: { url } }),
    onSuccess: (data) => {
      form.setFieldValue("name", data.name);
      form.setFieldValue("description", data.description);
      setTagsInStore(data.tags);
    },
    onError: () => {
      toast.error("Could not auto-fill the fields", {
        description: "Please try again",
      });
    },
  });

  const addBookmarkMutation = useMutation({
    mutationFn: (data: TBookmarkForm) =>
      addBookmark({
        data: {
          bookmark: { ...data },
          folders: getFoldersFromStore(),
          tags: getTagsFromStore(),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: filteredBookmarksQuery({ folderId, tags, access }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: folderBookmarksCountQuery.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: tagsQuery.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkTagsQuery.queryKey,
      });
      form.reset();
      resetFolderStore();
      resetTagStore();
      setIsBookmarkDialogOpen(false);
      toast.success("Bookmark created successfully!");
    },
    onError: ({ message }) => {
      let description = "Bookmark was not added. Please try again";
      if (message.includes("duplicate")) {
        description = "Bookmark with given URL already exists";
      }
      toast.error("Something went wrong", { description });
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: (data: TBookmarkForm) =>
      updateBookmark({
        data: {
          bookmark: { id: bookmarkToEdit?.id ?? -1, ...data },
          folders: getFoldersFromStore(),
          tags: getTagsFromStore(),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: filteredBookmarksQuery({ folderId, tags, access }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: folderBookmarksCountQuery.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: tagsQuery.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkTagsQuery.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: singleBookmarkTagsQuery({
          bookmarkId: bookmarkToEdit?.id ?? -1,
        }).queryKey,
      });
      form.reset();
      resetFolderStore();
      resetTagStore();
      setIsBookmarkDialogOpen(false);
      setBookmarkToEdit(null);
      toast.success("Bookmark updated successfully!");
    },
    onError: ({ message }) => {
      let description = "Bookmark was not updated. Please try again";
      if (message.includes("duplicate")) {
        description = "Bookmark with given URL already exists";
      }
      toast.error("Something went wrong", { description });
    },
  });

  const isSubmitting = bookmarkToEdit
    ? updateBookmarkMutation.isPending
    : addBookmarkMutation.isPending;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col"
    >
      <div className="p-6">
        <DialogHeader>
          <DialogTitle>
            {bookmarkToEdit ? "Edit Bookmark" : "Add Bookmark"}
          </DialogTitle>
          <DialogDescription>
            {bookmarkToEdit
              ? "Update your bookmark details."
              : "Add a new bookmark to your collection."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 py-4">
          {/* Bookmark URL input */}
          <div className="grid gap-2">
            <Label htmlFor="url" className="w-fit">
              URL
            </Label>
            <form.Field
              name="url"
              validators={{
                onChangeAsync: async ({ value }) => {
                  if (!value) return null;
                  const isUrlValid = await checkUrlExists({
                    data: { url: value },
                  });
                  return isUrlValid ? null : "Invalid URL";
                },
              }}
              children={({ state, handleChange }) => (
                <>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    value={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                    disabled={addBookmarkMutation.isPending}
                  />
                  {state.meta.errors.length > 0 && (
                    <span className="text-sm text-destructive">
                      {state.meta.errors.join(", ")}
                    </span>
                  )}
                  {state.meta.errors.length === 0 &&
                    state.value &&
                    !bookmarkToEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() =>
                          bookmarkFieldsSuggestionsMutation.mutate(state.value)
                        }
                        disabled={bookmarkFieldsSuggestionsMutation.isPending}
                      >
                        {bookmarkFieldsSuggestionsMutation.isPending ? (
                          "Filling..."
                        ) : (
                          <>
                            <WandSparkles />
                            Autofill with AI
                          </>
                        )}
                      </Button>
                    )}
                </>
              )}
            />
          </div>

          {/* Bookmark name input */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="w-fit">
              Name
            </Label>
            <form.Field
              name="name"
              children={({ state, handleChange }) => (
                <Input
                  id="name"
                  name="name"
                  placeholder="Bookmark name"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  required
                  disabled={addBookmarkMutation.isPending}
                />
              )}
            />
          </div>

          {/* Bookmark description input */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="w-fit">
              Description
            </Label>
            <form.Field
              name="description"
              children={({ state, handleChange }) => {
                return (
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Add a description (optional)"
                    value={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    className="resize-none"
                    disabled={addBookmarkMutation.isPending}
                  />
                );
              }}
            />
          </div>

          {/* Bookmark Folders input */}
          <BookmarkFoldersInput />

          {/* Bookmark Tags input */}
          <BookmarkTagsInput />

          {/* Set bookmark access view */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <form.Field
                name="is_public"
                children={({ state, handleChange }) => (
                  <>
                    <Switch
                      id="public"
                      checked={state.value}
                      disabled={addBookmarkMutation.isPending}
                      onCheckedChange={(checked) => handleChange(checked)}
                    />
                    <Label htmlFor="public" className="cursor-pointer">
                      {state.value ? (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Public
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Private
                        </div>
                      )}
                    </Label>
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? bookmarkToEdit
                ? "Updating..."
                : "Creating..."
              : bookmarkToEdit
                ? "Update Bookmark"
                : "Create Bookmark"}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}
