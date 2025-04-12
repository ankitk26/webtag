import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addTagToStore,
  removeTagFromStore,
  useTagStore,
} from "~/hooks/use-tags-store";
import { tagsQuery } from "~/lib/queries";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function BookmarkTagsInput() {
  const { selectedTags } = useTagStore();

  const [inputValue, setInputValue] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Get all tags of user from DB
  const { data: dbTags = [] } = useQuery(tagsQuery);

  const filteredSuggestions = inputValue.trim()
    ? dbTags
        .filter((tag) => {
          return (
            // Tag exists in database
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            // Tag is not added to store
            !selectedTags.some(
              (t) => t.name.toLowerCase() === tag.name.toLowerCase()
            )
          );
        })
        .slice(0, 5)
    : [];

  const canTagBeAdded = (tagName: string) => {
    const trimmedTagName = tagName.trim();
    if (!trimmedTagName) return false;

    // Check if tag name entered is already selected
    const tagExists = selectedTags.some(
      (tag) => tag.name.toLowerCase() === trimmedTagName.toLowerCase()
    );
    // If tag is already selected, return with a toast warning
    if (tagExists) {
      toast.warning(`Tag "${trimmedTagName}" is already added.`);
      return false;
    }

    // Now tag is not in the store list

    // Check if tag name is already created by the user in DB
    const existingTag = dbTags.find(
      (tag) => tag.name.toLowerCase() === trimmedTagName.toLowerCase()
    );

    // If tag exists in the DB, add to the store
    if (existingTag) {
      addTagToStore(existingTag);
      return true;
    }

    // Create a new tag and add to store list
    addTagToStore({ name: trimmedTagName, isNew: true });
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
        // Handle DB tag addition to list
        const selectedTag = filteredSuggestions[selectedSuggestionIndex];
        if (canTagBeAdded(selectedTag.name)) {
          setInputValue("");
          setSelectedSuggestionIndex(-1);
        }
      } else if (inputValue.trim()) {
        // Handle new tag entry to list
        if (canTagBeAdded(inputValue)) {
          setInputValue("");
          setSelectedSuggestionIndex(-1);
        }
      }
    }
    // Remove item from list if backspace is entered
    else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedTags.length > 0
    ) {
      const lastTag = selectedTags[selectedTags.length - 1];
      removeTagFromStore(lastTag);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="tags-input">Tags</Label>
      <p className="text-xs text-muted-foreground">
        Join tag's words using hyphen ( - ) or underscore ( _ ).
      </p>

      <div className="flex flex-wrap items-center gap-2 min-h-10 p-2 border rounded-md bg-background text-foreground focus-within:ring-1 focus-within:ring-ring">
        {selectedTags.map((tag, index) => (
          <Badge
            key={tag.id || `new-${index}-${tag.name}`}
            variant={tag.isNew ? "secondary" : "default"}
            className={`flex items-center gap-1 select-none px-2 py-0.5`}
          >
            <span>{tag.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTagFromStore(tag);
              }}
              className={cn(
                "rounded-full p-0.5 transition-colors",
                tag.isNew
                  ? "hover:bg-foreground hover:text-background"
                  : "hover:bg-background hover:text-foreground"
              )}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Input
          id="tags-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedSuggestionIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[120px] bg-transparent"
          placeholder="Add or create tags..."
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-lg mt-1">
            <ul role="listbox" aria-label="Tag suggestions" className="py-1">
              {filteredSuggestions.map((tag, index) => (
                <li
                  key={tag.id}
                  id={`suggestion-${index}`}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    index === selectedSuggestionIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => {
                    if (canTagBeAdded(tag.name)) {
                      setInputValue("");
                      setSelectedSuggestionIndex(-1);
                    }
                  }}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tags help find and organize your bookmarks
      </p>
    </div>
  );
}
