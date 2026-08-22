import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { fetchItem } from "@/lib/stash";

export const Route = createFileRoute("/items/$id")({
  head: () => ({
    meta: [
      { title: "Post — SOT · Stash Or Trash" },
      {
        name: "description",
        content:
          "See the community verdict on this post — Stash it or Trash it on SOT, the Brand Barometer.",
      },
      { property: "og:title", content: "Post — SOT · Stash Or Trash" },
      {
        property: "og:description",
        content: "See the community verdict on this post and cast your own on SOT.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: PostError,
  notFoundComponent: PostMissing,
  component: PostDetail,
});

function PostDetail() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["item", id, user?.id ?? "anon"],
    queryFn: () => fetchItem(id, user?.id ?? null),
  });

  return (
    <div className="min-h-screen">
      <Header onPosted={() => refetch()} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("social.backToFeed")}
        </Link>

        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-2xl" />
        ) : data ? (
          <ItemCard item={data} onChange={() => refetch()} defaultCommentsOpen />
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            {t("social.postNotFound")}
          </div>
        )}
      </main>
    </div>
  );
}

function PostMissing() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        {t("social.postNotFound")}
      </main>
    </div>
  );
}

function PostError() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        {t("social.loadFailed")}
      </main>
    </div>
  );
}
