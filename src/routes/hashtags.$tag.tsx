import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getItemsByHashtag, getTrendingHashtags } from "@/lib/social";
import { fetchFeed } from "@/lib/stash";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/hashtags/$tag")({
  head: () => ({
    meta: [
      { title: "Hashtag — SOT · Stash Or Trash" },
      {
        name: "description",
        content:
          "Every post carrying this hashtag, with the live community verdict on SOT — the Brand Barometer.",
      },
      { property: "og:title", content: "Hashtag — SOT · Stash Or Trash" },
      {
        property: "og:description",
        content: "Every post carrying this hashtag, with the live community verdict on SOT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: HashtagError,
  component: HashtagPage,
});

function HashtagPage() {
  const { tag } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: taggedIds } = useQuery({
    queryKey: ["hashtag-item-ids", tag],
    queryFn: () => getItemsByHashtag(tag),
  });

  const { data: allItems, isLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  const { data: trending } = useQuery({
    queryKey: ["trending-hashtags"],
    queryFn: () => getTrendingHashtags(8),
  });

  const ids = new Set((taggedIds ?? []).map((r) => r.item_id));
  const needle = `#${tag.toLowerCase()}`;
  const items = (allItems ?? []).filter(
    (item) =>
      ids.has(item.id) ||
      item.title?.toLowerCase().includes(needle) ||
      item.description?.toLowerCase().includes(needle),
  );

  return (
    <div className="min-h-screen">
      <Header onPosted={() => refetch()} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-extrabold">#{tag}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("social.hashtagCount", { count: items.length })}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onChange={() => refetch()} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">{t("social.hashtagEmpty", { tag })}</p>
            {trending && trending.length > 0 && (
              <>
                <p className="mt-4 text-sm font-medium">{t("social.trySomethingElse")}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {trending.map((h) => (
                    <Link
                      key={h.id}
                      to="/hashtags/$tag"
                      params={{ tag: h.tag }}
                      className="rounded-full border border-border px-3 py-1 text-sm hover:bg-secondary"
                    >
                      #{h.tag}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function HashtagError() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        {t("social.loadFailed")}
      </main>
    </div>
  );
}
