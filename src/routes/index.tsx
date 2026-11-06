import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { SotHomeHero } from "@/components/SotHomeHero";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white" suppressHydrationWarning>
      <Header />
      <main id="main-content" suppressHydrationWarning>
        <SotHomeHero />
      </main>
    </div>
  );
}
