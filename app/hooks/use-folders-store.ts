import { create } from "zustand";
import { Folder, NewFolder } from "~/db/schema";

export type CustomFolder = Omit<NewFolder, "created_by"> & {
  isNew?: boolean;
};

type FolderState = {
  selectedFolders: CustomFolder[];
};

export const useFolderStore = create<FolderState>(() => {
  return {
    selectedFolders: [],
  };
});

export const addFolderToStore = (folder: CustomFolder) => {
  useFolderStore.setState((state) => {
    return {
      selectedFolders: [...state.selectedFolders, folder],
    };
  });
};

export const removeFolderFromStore = (folderToRemove: CustomFolder) => {
  useFolderStore.setState((state) => ({
    selectedFolders: state.selectedFolders.filter((folder) => {
      // For DB folders, compare by ID
      if (folder.id && folderToRemove.id) {
        return folder.id !== folderToRemove.id;
      }
      // For new folders, compare by name
      return folder.name !== folderToRemove.name;
    }),
  }));
};

export const getFoldersFromStore = () => {
  const { selectedFolders } = useFolderStore.getState();
  return selectedFolders.map((folder) => {
    // Return DB folders as they are (just the ID)
    if (folder.id && !folder.isNew) {
      return { id: folder.id };
    }
    // Return new folders with just the name
    return { name: folder.name };
  });
};

export const resetFolderStore = () => {
  useFolderStore.setState({ selectedFolders: [] });
};

export const setFoldersInStore = (folders: CustomFolder[]) => {
  useFolderStore.setState({ selectedFolders: folders });
};
