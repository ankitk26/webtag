import { createFileRoute } from "@tanstack/react-router";
import Features from "~/components/home/features";
import Hero from "~/components/home/hero";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
