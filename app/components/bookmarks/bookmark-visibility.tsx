import { Link, useSearch } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

export default function BookmarkVisibility() {
  const { access } = useSearch({ from: "/_protected/bookmarks" });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex border border-border rounded-lg px-0.5 py-0.5 items-center text-xs justify-center">
        <Link
          to="/bookmarks"
          search={(prev) => {
            return { ...prev, access: "all" };
          }}
          className={cn(
            "px-4 py-1 rounded-lg",
            access === "all" ? "bg-muted" : ""
          )}
        >
          All
        </Link>
        <Link
          to="/bookmarks"
          search={(prev) => {
            return { ...prev, access: "public" };
          }}
          className={cn(
            "px-4 py-1 rounded-lg",
            access === "public" ? "bg-muted" : ""
          )}
        >
          Public
        </Link>
        <Link
          to="/bookmarks"
          search={(prev) => {
            return { ...prev, access: "private" };
          }}
          className={cn(
            "px-4 py-1 rounded-lg",
            access === "private" ? "bg-muted" : ""
          )}
        >
          Private
        </Link>
      </div>
    </div>
  );
}
