import { Link } from "@tanstack/react-router";
import { BookmarkDisplay } from "~/db/schema";
import { getFaviconUrl } from "~/lib/get-favicon-url";
import { getUrlDomain } from "~/lib/get-url-domain";
import { Card } from "../ui/card";

interface Props {
  bookmark: BookmarkDisplay;
}

export default function BookmarkMinimalItem({ bookmark }: Props) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-sm relative bg-background border-border rounded-lg p-3">
      <div className="flex items-center gap-3">
        <img
          src={getFaviconUrl(bookmark.url) || "/placeholder.svg"}
          alt=""
          className="w-6 h-6 rounded-md"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div>
          <h3 className="font-medium tracking-tight text-sm">
            {bookmark.name}
          </h3>
          <Link
            to={bookmark.url}
            className="text-xs text-muted-foreground mt-1 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {getUrlDomain(bookmark.url)}
          </Link>
        </div>
      </div>
    </Card>
  );
}
