import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { setSearchQuery, useDashboardStore } from "~/hooks/use-dashboard-store";

export default function SearchInput() {
  const searchQuery = useDashboardStore((store) => store.searchQuery);

  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search bookmarks..."
        className="pl-8 bg-background border-muted"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
