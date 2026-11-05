import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import { Header } from "@/components/Header";
import { BrandDirectory } from "@/components/BrandDirectory";
import { fetchBrands } from "@/lib/brands";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/brands/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Brands Directory — SOT Brand Barometer" },
      { name: "description", content: "Browse a verified multilingual global directory of brands with authentic customer verdicts and trust ratings." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands, retry: 1 });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700 shadow-xs mb-3">
            <Building2 className="h-3.5 w-3.5 text-[#2563eb]" />
            <span>The Brand Barometer · Trust &amp; CX Directory</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-slate-950">
            {t("brand.title", { defaultValue: "Brand Barometer Directory" })}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 font-medium">
            {t("brand.subtitle", { defaultValue: "Explore live community trust ratings, authentic verified reviews, and official brand accountability dossiers." })}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <h2 className="font-display text-xl font-bold">The brand directory is temporarily unavailable</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              We could not load live brand records. Try again, or continue with the public catalog while the service recovers.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-md bg-[#2563eb] text-white px-4 py-2 text-sm font-bold shadow-xs hover:bg-blue-700"
              >
                Try again
              </button>
              <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">
                Go home
              </a>
            </div>
          </div>
        ) : (
          <BrandDirectory brands={data ?? []} user={user} />
        )}
      </main>
    </div>
  );
}
