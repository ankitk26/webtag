import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl animate-slide-up space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Your bookmarks, organized and accessible
        </h1>

        <p className="text-lg text-muted-foreground">
          Webtag helps you save, organize, and access your bookmarks from
          anywhere. Never lose an important link again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link to="/login">
            <Button size="lg">Get Started For Free</Button>
          </Link>
          <Button variant="outline" size="lg" className="flex items-center">
            See how it works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
