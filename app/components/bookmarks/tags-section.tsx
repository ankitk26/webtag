import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import { bookmarkTagsQuery } from "~/lib/queries";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export default function TagsSection() {
  const { data: tags, isPending } = useQuery(bookmarkTagsQuery);
  const { tags: urlTags } = useSearch({ from: "/_protected/bookmarks" });

  if (isPending) {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full bg-secondary/40" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground/80">Tags</h2>
        <Tag className="w-4 my-1 h-4" />
      </div>

      <ScrollArea className="h-[calc(50vh-8rem)] pr-3">
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <Link
              key={tag.id}
              to="/bookmarks"
              search={(prev) => {
                // If this is the first tag
                if (prev?.tags === undefined) {
                  return { ...prev, tags: [tag.id] };
                }

                // Tags already exists in search params
                // Check if tag already exists
                const tagExists = prev?.tags?.some(
                  (urlTag) => urlTag === tag.id
                );
                // Remove tag from search params if already exists
                if (tagExists) {
                  // Remove tags from search if the one existing tag is being removed
                  if (prev.tags.length == 1) {
                    return { ...prev, tags: undefined };
                  }
                  // Remove selected tag from the tags list
                  return {
                    ...prev,
                    tags: prev?.tags?.filter((t) => t !== tag.id),
                  };
                }

                // If tag does not exist, add the tag
                return {
                  ...prev,
                  tags: [...prev.tags, tag.id],
                };
              }}
            >
              <Badge
                variant={urlTags?.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer"
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
