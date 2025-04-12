import { create } from "zustand";
import { Bookmark, NewBookmark } from "~/db/schema";

type BookmarkFormState = {
  selectedBookmark: Bookmark | null;
  bookmark: NewBookmark;
  folders: string[];
};

const defaultState = {
  name: "",
  description: "",
  is_public: false,
  url: "",
  created_by: "",
};

export const useBookmarkFormStore = create<BookmarkFormState>()(() => {
  return {
    bookmark: defaultState,
    folders: [],
    selectedBookmark: null,
  };
});

export const setBookmark = (bookmark: Bookmark | null) => {
  useBookmarkFormStore.setState({ selectedBookmark: bookmark });
};

export const updateBookmarkForm = (
  updatedFields: Partial<BookmarkFormState["bookmark"]>
) => {
  useBookmarkFormStore.setState((state) => ({
    bookmark: { ...state.bookmark, ...updatedFields },
  }));
};

export const resetBookmarkForm = () => {
  useBookmarkFormStore.setState({ bookmark: defaultState });
};
