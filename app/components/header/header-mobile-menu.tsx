import { Link } from "@tanstack/react-router";
import { CurrentUserAvatar } from "./current-user-avatar";
import { ThemeToggler } from "./theme-toggler";

type Props = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HeaderMobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
}: Props) {
  if (!mobileMenuOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-16 z-40 bg-background border-b shadow-md animate-fade-in md:hidden">
      <nav className="container mx-auto flex flex-col px-4 py-4 space-y-4">
        <Link
          to="/"
          className="text-zinc-700 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-900 font-medium transition-colors px-2 py-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>

        <ThemeToggler />
        <CurrentUserAvatar />
      </nav>
    </div>
  );
}
