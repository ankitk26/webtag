import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { folderByIdQuery } from "~/lib/queries";
import { Skeleton } from "../ui/skeleton";
import FolderActions from "./folder-actions";

export default function FolderName() {
  const { folderId } = useSearch({ from: "/_protected/bookmarks" });
  const { data: folder, isPending } = useQuery(folderByIdQuery(folderId));

  if (folderId === undefined) {
    return null;
  }

  if (isPending) {
    return (
      <div className="mb-6">
        <Skeleton className="w-32 h-3" />
        <Skeleton className="w-96 mt-1 h-3" />
      </div>
    );
  }

  if (!folder) return null;

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-medium text-foreground/90">
          {folder.name}
        </h2>
        {folder.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {folder.description}
          </p>
        )}
      </div>
      <div>
        <FolderActions folder={folder} />
      </div>
    </div>
  );
}
