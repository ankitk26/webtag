import BookmarkVisibility from "./bookmark-visibility";
import BookmarksListView from "./bookmarks-list-view";
import SearchInput from "./search-input";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <SearchInput />
      <div className="flex items-center gap-4">
        <BookmarkVisibility />
        <BookmarksListView />
      </div>
    </div>
  );
}
