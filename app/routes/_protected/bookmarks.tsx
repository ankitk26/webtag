import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AddBookmarkDialog } from "~/components/bookmarks/add-bookmark-dialog";
import { AddFolderDialog } from "~/components/bookmarks/add-folder-dialog";
import BookmarksList from "~/components/bookmarks/bookmarks-list";
import DashboardHeader from "~/components/bookmarks/dashboard-header";
import DashboardSidebar from "~/components/bookmarks/dashboard-sidebar";
import { DeleteBookmarkDialog } from "~/components/bookmarks/delete-bookmark-dialog";
import { DeleteFolderDialog } from "~/components/bookmarks/delete-folder-dialog";
import FolderName from "~/components/bookmarks/folder-name";
import { ScrollArea } from "~/components/ui/scroll-area";

const bookmarksSearchSchema = z.object({
  folderId: z.number().optional().catch(0),
  tags: z.array(z.number()).optional().catch([]),
  access: z.enum(["all", "public", "private"]).optional().default("all"),
  q: z.string().optional().catch(""),
  view: z.enum(["grid", "list", "minimal"]).default("grid"),
});

export const Route = createFileRoute("/_protected/bookmarks")({
  validateSearch: zodValidator(bookmarksSearchSchema),
  component: BookmarksPage,
});

function BookmarksPage() {
  return (
    <div className="overflow-y-hidden">
      <div className="flex flex-col mt-4">
        <div className="flex rounded-xl border flex-1 gap-2 overflow-hidden">
          <DashboardSidebar />

          <div className="flex-1 overflow-hidden">
            <div className="p-4">
              <DashboardHeader />
              <ScrollArea className="h-[calc(100vh-12rem)] pr-3">
                <FolderName />
                <BookmarksList />
              </ScrollArea>
            </div>
          </div>
        </div>

        <AddBookmarkDialog />
        <AddFolderDialog />
        <DeleteBookmarkDialog />
        <DeleteFolderDialog />
      </div>
    </div>
  );
}
