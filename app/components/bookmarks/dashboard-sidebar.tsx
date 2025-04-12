import { Separator } from "../ui/separator";
import FolderSection from "./folder-section";
import TagsSection from "./tags-section";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 border-r bg-muted/20 hidden md:block">
      <div className="p-4">
        <FolderSection />
        <Separator className="my-4" />
        <TagsSection />
      </div>
    </aside>
  );
}
