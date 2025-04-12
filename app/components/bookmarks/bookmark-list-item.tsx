import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Calendar, Globe, Lock } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { BookmarkDisplay } from "~/db/schema";
import { formatDate } from "~/lib/format-date";
import { getFaviconUrl } from "~/lib/get-favicon-url";
import { getUrlDomain } from "~/lib/get-url-domain";
import { singleBookmarkTagsQuery } from "~/lib/queries";
import BookmarkActions from "./bookmark-actions";

interface Props {
  bookmark: BookmarkDisplay;
}

export default function BookmarkListItem({ bookmark }: Props) {
  const { data: tags } = useQuery(
    singleBookmarkTagsQuery({ bookmarkId: bookmark.id })
  );

  return (
    <div className="relative flex items-start gap-4 p-4 border border-border rounded-lg bg-background hover:shadow-sm transition-all duration-200">
      {/* Actions top-right like in card */}
      <div className="absolute top-3 right-3">
        <BookmarkActions bookmark={bookmark} />
      </div>

      <img
        src={getFaviconUrl(bookmark.url) || "/placeholder.svg"}
        alt=""
        className="w-10 h-10 rounded-md flex-shrink-0 mt-1"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium tracking-tight truncate">
            {bookmark.name}
          </h3>
          {bookmark.is_public ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Public bookmark</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private bookmark</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Link
          to={bookmark.url}
          className="text-xs hover:underline text-muted-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          {getUrlDomain(bookmark.url)}
        </Link>

        <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
          {bookmark.description || "No description provided"}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags?.map((tag) => (
            <Badge
              key={`${bookmark.id}~${tag.id}~tag`}
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          <span>Added {formatDate(new Date(bookmark.created_at))}</span>
        </div>
      </div>
    </div>
  );
}
