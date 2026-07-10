import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { SubmitDialog } from "@/components/SubmitDialog";
import { ItemCard } from "@/components/ItemCard";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchBrandBySlug,
  fetchMyVerificationRequest,
  requestVerification,
} from "@/lib/brands";
import { fetchFeed } from "@/lib/stash";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, ExternalLink, MessageCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/brands/$slug")({
  component: BrandPage,
});

function BrandPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: brand, isLoading } = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => fetchBrandBySlug(slug),
  });

  const { data: feed, refetch } = useQuery({
    queryKey: ["brand-feed", brand?.id, user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null, { brandId: brand!.id }),
    enabled: !!brand,
  });

  const isOwner = !!user && brand?.owner_id === user.id;

  const { data: verReq, refetch: refetchVer } = useQuery({
    queryKey: ["brand-verify", brand?.id],
    queryFn: () => fetchMyVerificationRequest(brand!.id),
    enabled: !!brand && isOwner,
  });

  const askVerify = async () => {
    if (!brand || !user) return;
    try {
      await requestVerification({ brandId: brand.id, userId: user.id, message: "" });
      toast.success("Verification requested.");
      refetchVer();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not request verification.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header onPosted={() => refetch()} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : !brand ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Brand not found. <Link to="/brands" className="text-primary hover:underline">Back to brands</Link>
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-2xl font-bold">
                {brand.signedLogoUrl ? (
                  <img src={brand.signedLogoUrl} alt={brand.name} className="h-full w-full object-cover" />
                ) : (
                  brand.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-extrabold">{brand.name}</h1>
                  {brand.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                </div>
                {brand.category && <p className="text-sm text-muted-foreground">{brand.category}</p>}
                {brand.description && <p className="mt-2 text-sm">{brand.description}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-stash" />
                    <span className="font-semibold">{brand.trust_score}</span>
                    <span className="text-muted-foreground">/ 100 {t("brand.trustScore").toLowerCase()}</span>
                  </span>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> {t("brand.website")}
                    </a>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {user && !isOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => navigate({ to: "/messages", search: { to: brand.owner_id } })}
                    >
                      <MessageCircle className="h-4 w-4" /> {t("brand.message")}
                    </Button>
                  )}
                  {isOwner && !brand.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={verReq?.status === "pending"}
                      onClick={askVerify}
                    >
                      {verReq?.status === "pending"
                        ? t("brand.verificationPending")
                        : t("brand.requestVerification")}
                    </Button>
                  )}
                  {user && <SubmitDialog defaultBrandId={brand.id} onPosted={() => refetch()} />}
                </div>
              </div>
            </section>

            <h2 className="mb-4 mt-8 font-display text-xl font-bold">{t("brand.posts")}</h2>
            <div className="space-y-4">
              {(feed ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No posts yet.</p>
              ) : (
                (feed ?? []).map((item) => (
                  <ItemCard key={item.id} item={item} onChange={() => refetch()} />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
