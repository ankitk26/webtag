import { create } from "zustand";
import { Bookmark, Folder, NewBookmark } from "~/db/schema";

type DashboardState = {
  bookmarkToEdit: NewBookmark | null;
  bookmarkToDelete: number | null;
  isBookmarkDialogOpen: boolean;
  folderToEdit: Folder | null;
  folderToDelete: number | null;
  isFolderDialogOpen: boolean;
  isBookmarkDeleteDialogOpen: boolean;
  isFolderDeleteDialogOpen: boolean;
  searchQuery: string;
};

export const useDashboardStore = create<DashboardState>()(() => ({
  bookmarkToEdit: null,
  bookmarkToDelete: null,
  folderToDelete: null,
  folderToEdit: null,
  isBookmarkDialogOpen: false,
  isFolderDialogOpen: false,
  isBookmarkDeleteDialogOpen: false,
  isFolderDeleteDialogOpen: false,
  searchQuery: "",
}));

export const setBookmarkToEdit = (bookmark: NewBookmark | null) => {
  useDashboardStore.setState({ bookmarkToEdit: bookmark });
};

export const setFolderToEdit = (folder: Folder | null) => {
  useDashboardStore.setState({ folderToEdit: folder });
};

export const setFolderToDelete = (folderId: number | null) => {
  useDashboardStore.setState({ folderToDelete: folderId });
};

export const setBookmarkToDelete = (bookmarkId: number | null) => {
  useDashboardStore.setState({ bookmarkToDelete: bookmarkId });
};

export const setIsBookmarkDialogOpen = (value: boolean) => {
  useDashboardStore.setState({ isBookmarkDialogOpen: value });
};

export const setIsBookmarkDeleteDialogOpen = (value: boolean) => {
  useDashboardStore.setState({ isBookmarkDeleteDialogOpen: value });
};

export const setIsFolderDeleteDialogOpen = (value: boolean) => {
  console.log(value);
  useDashboardStore.setState({ isFolderDeleteDialogOpen: value });
  console.log(useDashboardStore.getState());
};

export const setIsFolderDialogOpen = (value: boolean) => {
  useDashboardStore.setState({ isFolderDialogOpen: value });
};

export const setSearchQuery = (value: string) => {
  useDashboardStore.setState({ searchQuery: value });
};
