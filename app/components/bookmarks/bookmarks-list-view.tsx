import { Link, useSearch } from "@tanstack/react-router";
import { Grid, List } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function BookmarksListView() {
  const { view } = useSearch({ from: "/_protected/bookmarks" });

  return (
    <div className="flex items-center border border-border rounded-md">
      <Link to="/bookmarks" search={(prev) => ({ ...prev, view: "grid" })}>
        <Button
          variant="link"
          size="icon"
          className={`h-9 w-9 rounded-none rounded-l-md ${view === "grid" ? "bg-muted" : ""}`}
        >
          <Grid className="h-4 w-4" />
          <span className="sr-only">Grid view</span>
        </Button>
      </Link>
      <Separator orientation="vertical" className="h-5" />
      <Link to="/bookmarks" search={(prev) => ({ ...prev, view: "list" })}>
        <Button
          variant="link"
          size="icon"
          className={`h-9 w-9 rounded-none rounded-r-md ${view === "list" ? "bg-muted" : ""}`}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">List view</span>
        </Button>
      </Link>
    </div>
  );
}
