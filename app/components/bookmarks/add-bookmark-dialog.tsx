import { Dialog, DialogContent } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  setBookmarkToEdit,
  setIsBookmarkDialogOpen,
  useDashboardStore,
} from "~/hooks/use-dashboard-store";
import BookmarkForm from "./bookmark-form";
import { setTagsInStore } from "~/hooks/use-tags-store";
import { setFoldersInStore } from "~/hooks/use-folders-store";

export function AddBookmarkDialog() {
  const isBookmarkDialogOpen = useDashboardStore(
    (store) => store.isBookmarkDialogOpen
  );

  return (
    <Dialog
      open={isBookmarkDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setBookmarkToEdit(null);
          setTagsInStore([]);
          setFoldersInStore([]);
        }
        setIsBookmarkDialogOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px] p-0">
        <ScrollArea className="max-h-[80vh]">
          <BookmarkForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
