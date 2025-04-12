import { FolderPlus } from "lucide-react";
import { setIsFolderDialogOpen } from "~/hooks/use-dashboard-store";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { FolderList } from "./folders-list";

export default function FolderSection() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground/80">Folders</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsFolderDialogOpen(true)}
        >
          <FolderPlus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(50vh-8rem)] pr-3">
        <FolderList />
      </ScrollArea>
    </>
  );
}
