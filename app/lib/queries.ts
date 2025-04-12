import { queryOptions } from "@tanstack/react-query";
import { getAllBookmarks, getFilteredBookmarks } from "~/actions/bookmark.api";
import {
  getFolderById,
  getFolders,
  getFoldersbyBookmark,
  getFoldersWithBookmarkCount,
} from "~/actions/folder.api";
import {
  getBookmarkTags,
  getSingleBookmarkTags,
  getTags,
} from "~/actions/tag.api";
import { fetchUser } from "./supabase/fetch-user-server-fn";

export const authQuery = queryOptions({
  queryKey: ["user"],
  queryFn: () => fetchUser(),
});

export const filteredBookmarksQuery = ({
  folderId,
  access = "all",
  tags = [],
}: {
  folderId: number | undefined;
  access: "all" | "public" | "private";
  tags: number[] | undefined;
}) =>
  queryOptions({
    queryKey: ["bookmarks", { folderId, access, tags }],
    queryFn: () => getFilteredBookmarks({ data: { folderId, access, tags } }),
  });

export const allBookmarksQuery = queryOptions({
  queryKey: ["bookmarks"],
  queryFn: () => getAllBookmarks(),
});

export const tagsQuery = queryOptions({
  queryKey: ["tags"],
  queryFn: () => getTags(),
});

export const foldersQuery = queryOptions({
  queryKey: ["folders"],
  queryFn: () => getFolders(),
});

export const folderByIdQuery = (folderId: number | undefined) =>
  queryOptions({
    queryKey: ["folders", folderId],
    queryFn: () => {
      if (folderId === undefined) {
        return null;
      }
      return getFolderById({ data: { folderId } });
    },
    enabled: folderId !== undefined,
  });

export const folderBookmarksCountQuery = queryOptions({
  queryKey: ["folders_bookmark_count"],
  queryFn: () => getFoldersWithBookmarkCount(),
});

export const bookmarkTagsQuery = queryOptions({
  queryKey: ["bookmark", "tags"],
  queryFn: () => getBookmarkTags(),
});

export const singleBookmarkTagsQuery = ({
  bookmarkId,
  enabled = true,
}: {
  bookmarkId: number;
  enabled?: boolean;
}) =>
  queryOptions({
    queryKey: ["bookmark", "tags", bookmarkId],
    queryFn: () => getSingleBookmarkTags({ data: { bookmarkId } }),
    enabled,
  });

export const foldersByBookmarkQuery = ({
  bookmarkId,
}: {
  bookmarkId: number;
}) =>
  queryOptions({
    queryKey: ["bookmark", "folders", bookmarkId],
    queryFn: () => getFoldersbyBookmark({ data: { bookmarkId } }),
  });
