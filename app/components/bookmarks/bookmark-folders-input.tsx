import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addFolderToStore,
  removeFolderFromStore,
  useFolderStore,
} from "~/hooks/use-folders-store";
import { foldersQuery } from "~/lib/queries";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const MAX_FOLDERS_ALLOWED = 20;

export default function BookmarkFoldersInput() {
  const { selectedFolders } = useFolderStore();

  const [inputValue, setInputValue] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Get all folders of user from DB
  const { data: dbFolders = [] } = useQuery(foldersQuery);

  // Get count of DB folders
  const dbFoldersCount = dbFolders.length;

  // Get count of new folders not present in DB but present in store
  const newFoldersCount = selectedFolders.filter(
    (f) =>
      !dbFolders.some((dbf) => dbf.name.toLowerCase() === f.name.toLowerCase())
  ).length;

  // Count of folders that user can add further
  const remainingFolderSlots = Math.max(
    0,
    MAX_FOLDERS_ALLOWED - dbFoldersCount - newFoldersCount
  );

  const filteredSuggestions = inputValue.trim()
    ? dbFolders
        .filter((folder) => {
          return (
            // Folder exists in database
            folder.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            // Folder is already not selected
            !selectedFolders.some(
              (f) => f.name.toLowerCase() === folder.name.toLowerCase()
            )
          );
        })
        .slice(0, 5)
    : [];

  const canFolderBeAdded = (folderName: string) => {
    const trimmedFolderName = folderName.trim();
    if (!trimmedFolderName) return false;

    // Check if folder name entered is already selected
    const folderExists = selectedFolders.some(
      (folder) => folder.name.toLowerCase() === trimmedFolderName.toLowerCase()
    );
    // If folder is already selected, return with a toast warning
    if (folderExists) {
      toast.warning(`Folder "${trimmedFolderName}" is already added.`);
      return false;
    }

    // Now folder is not in the store list

    // Check if folder name is already created by the user in DB
    const existingFolder = dbFolders.find(
      (folder) => folder.name.toLowerCase() === trimmedFolderName.toLowerCase()
    );

    // If folder exists in the DB, add to the store
    if (existingFolder) {
      addFolderToStore(existingFolder);
      return true;
    }

    // A new folder is being entered
    // Check if the max limit of folders has exceeded
    if (remainingFolderSlots <= 0) {
      toast.error(`You can create up to 20 folders in total.`);
      return false;
    }

    // Create a new folder and add to store list
    addFolderToStore({ name: trimmedFolderName, isNew: true });
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle navigation between suggestions
    if (filteredSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        return;
      }
    }

    // Handle new entry by entering "Enter"
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        // Condition indicating a suggestion is selected
        selectedSuggestionIndex >= 0 &&
        selectedSuggestionIndex < filteredSuggestions.length
      ) {
        // Handle DB folder addition to list
        const selectedFolder = filteredSuggestions[selectedSuggestionIndex];
        if (canFolderBeAdded(selectedFolder.name)) {
          setInputValue("");
          setSelectedSuggestionIndex(-1);
        }
      } else if (inputValue.trim()) {
        // Handle new folder entry to list
        if (canFolderBeAdded(inputValue)) {
          setInputValue("");
          setSelectedSuggestionIndex(-1);
        }
      }
    }
    // Remove item from list if backspace is entered
    else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedFolders.length > 0
    ) {
      const lastFolder = selectedFolders[selectedFolders.length - 1];
      removeFolderFromStore(lastFolder);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="folders-input">Folders</Label>
      <p className="text-xs text-muted-foreground">
        Join folder's words using hyphen ( - ) or underscore ( _ ). Add up to 20
        folders total.
      </p>

      <div className="flex flex-wrap items-center gap-2 min-h-10 p-2 border rounded-md bg-background text-foreground focus-within:ring-1 focus-within:ring-ring">
        {selectedFolders.map((folder, index) => (
          <Badge
            key={folder.id || `new-${index}-${folder.name}`}
            variant={folder.isNew ? "secondary" : "default"}
            className={`flex items-center gap-1 select-none px-2 py-0.5`}
          >
            <span>{folder.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFolderFromStore(folder);
              }}
              className={cn(
                "rounded-full p-0.5 transition-colors",
                folder.isNew
                  ? "hover:bg-foreground hover:text-background"
                  : "hover:bg-background hover:text-foreground"
              )}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Input
          id="folders-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedSuggestionIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[120px] bg-secondary/50"
          placeholder={
            remainingFolderSlots <= 0
              ? "You can only add from existing folders"
              : "Add or create folders..."
          }
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-lg mt-1">
            <ul role="listbox" aria-label="Folder suggestions" className="py-1">
              {filteredSuggestions.map((folder, index) => (
                <li
                  key={folder.id}
                  id={`suggestion-${index}`}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    index === selectedSuggestionIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => {
                    if (canFolderBeAdded(folder.name)) {
                      setInputValue("");
                      setSelectedSuggestionIndex(-1);
                    }
                  }}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  {folder.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        You have currently <strong>{dbFoldersCount}</strong> folder
        {dbFoldersCount !== 1 && "s"}.{" "}
        {remainingFolderSlots > 0 ? (
          <>
            You can create <strong>{remainingFolderSlots}</strong> more.
          </>
        ) : (
          "No new folders can be created."
        )}
      </p>
    </div>
  );
}
