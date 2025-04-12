import { Link } from "@tanstack/react-router";
import { Calendar, Globe, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
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
import { Badge } from "../ui/badge";
import BookmarkActions from "./bookmark-actions";
import { useQuery } from "@tanstack/react-query";
import { singleBookmarkTagsQuery } from "~/lib/queries";

interface Props {
  bookmark: BookmarkDisplay;
}

export function BookmarkCard({ bookmark }: Props) {
  const { data: tags } = useQuery(
    singleBookmarkTagsQuery({ bookmarkId: bookmark.id })
  );

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-sm relative bg-background border-border rounded-lg">
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="flex items-start gap-3">
          <img
            src={getFaviconUrl(bookmark.url) || "/placeholder.svg"}
            alt=""
            className="w-8 h-8 mt-0.5 rounded-md"
            onError={(e) => {
              // If favicon fails to load, hide it
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{bookmark.name}</h3>
            </div>
            <Link
              to={bookmark.url}
              className="text-xs text-muted-foreground mt-1 hover:underline"
            >
              {getUrlDomain(bookmark.url)}
            </Link>
          </div>
        </div>
        <BookmarkActions bookmark={bookmark} />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {bookmark.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        <div className="flex flex-wrap gap-1.5 mt-1">
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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            <span>Added {formatDate(new Date(bookmark.created_at))}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
