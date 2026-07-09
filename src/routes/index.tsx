import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed } from "@/lib/stash";
import { Skeleton } from "@/components/ui/skeleton";
import { Recycle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  return (
    <div className="min-h-screen">
      <Header onPosted={() => refetch()} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="mb-8 text-center">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            Post it. <span className="text-stash">Stash</span> it or{" "}
            <span className="text-trash">trash</span> it.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Share anything — a product, an outfit, an idea — and let the community deliver its
            verdict in real time.
          </p>
        </section>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((item) => (
              <ItemCard key={item.id} item={item} onChange={() => refetch()} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <Recycle className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">Nothing to judge yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first — {user ? "hit Post" : "sign in and post"} something.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
