import { useQuery } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { BookmarkDisplay } from "~/db/schema";
import {
  setBookmarkToDelete,
  setBookmarkToEdit,
  setIsBookmarkDeleteDialogOpen,
  setIsBookmarkDialogOpen,
} from "~/hooks/use-dashboard-store";
import { setFoldersInStore } from "~/hooks/use-folders-store";
import { setTagsInStore } from "~/hooks/use-tags-store";
import { foldersByBookmarkQuery, singleBookmarkTagsQuery } from "~/lib/queries";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

type Props = {
  bookmark: BookmarkDisplay;
};

export default function BookmarkActions({ bookmark }: Props) {
  const { data: folders, isPending: foldersPending } = useQuery(
    foldersByBookmarkQuery({
      bookmarkId: bookmark.id,
    })
  );

  const {
    data: tags,
    isPending: tagsPending,
    refetch: fetchTags,
  } = useQuery(singleBookmarkTagsQuery({ bookmarkId: bookmark.id }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {tagsPending || foldersPending ? (
          <Skeleton className="h-3 w-10" />
        ) : (
          <DropdownMenuItem
            onClick={async () => {
              setBookmarkToEdit({
                id: bookmark.id,
                created_by: "",
                name: bookmark.name,
                url: bookmark.url,
                description: bookmark.description ?? "",
                is_public: bookmark.is_public ?? false,
              });
              setIsBookmarkDialogOpen(true);
              // await fetchFolders();
              console.log(folders);
              setFoldersInStore(folders ?? []);
              await fetchTags();
              console.log(tags);
              setTagsInStore(tags ?? []);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            setIsBookmarkDeleteDialogOpen(true);
            setBookmarkToDelete(bookmark.id);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
