import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportApplicationError } from "../lib/error-reporting";
import { installProductionSecurityShield } from "../lib/security-shield";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import { OfflineStatus } from "@/components/OfflineStatus";
import { ProductionMonitoring } from "@/components/ProductionMonitoring";
import { VerdictSuccess } from "@/components/VerdictSuccess";
import { autoSeedFirestoreIfEmpty } from "@/lib/seedFirestore";
import { SeoHelmet } from "@/components/SeoHelmet";
import "@/lib/i18n";

const BRAND_BAROMETER_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "SOT — Stash Or Trash",
      url: "https://stash-or-trash-hub.vercel.app/",
      logo: "https://stash-or-trash-hub.vercel.app/apple-touch-icon.png",
      description: "The Brand Barometer for community-powered brand trust and live sentiment.",
    },
    {
      "@type": "WebApplication",
      name: "SOT — Stash Or Trash | The Brand Barometer",
      description:
        "A community-powered Brand Barometer where people share proof, cast Stash or Trash verdicts, and track live brand trust.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

if (typeof window !== "undefined") {
  installProductionSecurityShield();
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: any; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportApplicationError(error instanceof Error ? error : new Error(String(error)), { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div role="alert" className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong, please refresh
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SOT — Brand Trust & Live Community Verdicts" },
      {
        name: "description",
        content:
          "Discover live brand sentiment with SOT. Share proof, cast Stash or Trash verdicts, and see what the community really thinks about brands.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:url", content: "https://stash-or-trash-hub.vercel.app/" },
      { name: "author", content: "SOT — Stash Or Trash" },
      { property: "og:title", content: "SOT — Brand Trust & Live Community Verdicts" },
      {
        property: "og:description",
        content: "Share proof, cast Stash or Trash verdicts, and discover live community sentiment across brands.",
      },
      { property: "og:image", content: "https://stash-or-trash-hub.vercel.app/apple-touch-icon.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    installProductionSecurityShield();
    autoSeedFirestoreIfEmpty();
  }, []);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SeoHelmet structuredData={BRAND_BAROMETER_SCHEMA} />
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <VerdictSuccess listenGlobal />
          <Toaster position="top-center" richColors />
          <OfflineStatus />
          <ProductionMonitoring />
        </AuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
