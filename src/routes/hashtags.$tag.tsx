import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrendingHashtags, getItemsByHashtag } from "@/lib/social";
import { fetchFeed } from "@/lib/stash";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/hashtags/$tag")({
  component: HashtagPage,
});

function HashtagPage() {
  const { tag } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: hashtagItems, isLoading: itemsLoading, refetch } = useQuery({
    queryKey: ["hashtag-items", tag],
    queryFn: async () => {
      const itemIds = await getItemsByHashtag(tag);
      if (itemIds.length === 0) return [];
      
      // Fetch full items for these IDs
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds.map((i: any) => i.item_id))
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: allItems, isLoading: feedLoading } = useQuery({
    queryKey: ["hashtag-feed", user?.id],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  // Filter items by hashtag from full feed
  const filteredItems = allItems?.filter((item) =>
    item.title?.toLowerCase().includes(`#${tag}`.toLowerCase()) ||
    item.description?.toLowerCase().includes(`#${tag}`.toLowerCase())
  ) ?? [];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-extrabold">#{tag}</h1>
          <p className="mt-2 text-muted-foreground">
            {filteredItems.length} posts tagged with this hashtag
          </p>
        </div>

        {/* Posts */}
        {feedLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onChange={() => refetch()} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            No posts with #{tag} yet
          </div>
        )}
      </main>
    </div>
  );
}
