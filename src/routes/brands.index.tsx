import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { BrandDirectory } from "@/components/BrandDirectory";
import { fetchBrands } from "@/lib/brands";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/brands/")({
  head: () => ({
    meta: [
      { title: "Brands — Stash or Trash" },
      { name: "description", content: "Browse a multilingual global directory of brands by country and industry." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands, retry: 1 });

  return <div className="min-h-screen"><Header /><main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10"><div><h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("brand.title")}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{t("brand.subtitle")}</p></div>{isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <Skeleton key={item} className="h-48 rounded-2xl" />)}</div> : isError ? <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center"><h2 className="font-display text-xl font-bold">The brand directory is temporarily unavailable</h2><p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">We could not load live brand records. Try again, or continue with the public catalog while the service recovers.</p><div className="mt-5 flex justify-center gap-2"><button type="button" onClick={() => refetch()} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button><a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">Go home</a></div></div> : <BrandDirectory brands={data ?? []} user={user} />}</main></div>;
}
