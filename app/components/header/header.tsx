import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  setBookmarkToEdit,
  setIsBookmarkDialogOpen,
} from "~/hooks/use-dashboard-store";
import { authQuery } from "~/lib/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CurrentUserAvatar } from "./current-user-avatar";
import { ThemeToggler } from "./theme-toggler";
import { createSupabaseClient } from "~/lib/supabase/client";

export default function Header() {
  const { data: user } = useQuery(authQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 py-4">
        <Link to="/" className="text-xl font-medium tracking-tight">
          Webtag
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggler />

          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="gap-2 cursor-pointer px-2">
                    <CurrentUserAvatar />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">
                      {user?.user_metadata.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link to="/bookmarks">
                      <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      const supabase = createSupabaseClient();
                      await supabase.auth.signOut();
                      await queryClient.invalidateQueries({
                        queryKey: authQuery.queryKey,
                      });
                      await navigate({ to: "/login" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setBookmarkToEdit(null);
                  setIsBookmarkDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Bookmark
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
