import { create } from "zustand";
import { NewTag } from "~/db/schema";

export type CustomTag = NewTag & { isNew?: boolean };

type TagState = {
  selectedTags: CustomTag[];
};

export const useTagStore = create<TagState>((set, get) => ({
  selectedTags: [],
}));

export const addTagToStore = (tag: CustomTag) => {
  useTagStore.setState((state) => {
    return {
      selectedTags: [...state.selectedTags, tag],
    };
  });
};

export const removeTagFromStore = (tagToRemove: CustomTag) => {
  useTagStore.setState((state) => ({
    selectedTags: state.selectedTags.filter((tag) => {
      // For DB tags, compare by ID
      if (tag.id && tagToRemove.id) {
        return tag.id !== tagToRemove.id;
      }
      // For new tags, compare by name
      return tag.name !== tagToRemove.name;
    }),
  }));
};

export const getTagsFromStore = () => {
  const { selectedTags } = useTagStore.getState();
  return selectedTags.map((tag) => {
    // Return DB tags as they are (just the ID)
    if (tag.id && !tag.isNew) {
      return { id: tag.id };
    }
    // Return new tags with just the name
    return { name: tag.name };
  });
};

export const resetTagStore = () => {
  useTagStore.setState({ selectedTags: [] });
};

export const setTagsInStore = (tags: CustomTag[]) =>
  useTagStore.setState({ selectedTags: tags });
