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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/hooks/useAuth";
import "@/lib/i18n";

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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
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
      { title: "SOT — Stash Or Trash | The Brand Barometer" },
      {
        name: "description",
        content:
          "SOT (Stash Or Trash) is the Brand Barometer — a CX/UX marketing & PR tool where the community delivers a live verdict on brands. Cast yours and keep your streak alive.",
      },
      { name: "author", content: "SOT — Stash Or Trash" },
      { property: "og:title", content: "SOT — Stash Or Trash | The Brand Barometer" },
      {
        property: "og:description",
        content: "Post anything about a brand and let the community decide: Stash it Or Trash it.",
      },
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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Full-page 50/50 watermark backgrounds on the dark theme background of the webpage */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex select-none">
          {/* Stash Side: Falling / Raining Gold Coins Watermark Background */}
          <div className="relative w-1/2 h-full opacity-[0.035] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="w-[85%] h-auto text-stash"
            >
              {/* Bag / Sack of coins floating */}
              <g transform="translate(40, 20) scale(1.5)">
                <path
                  d="M20 10 C10 10, 4 24, 10 36 C14 44, 26 48, 40 44 C50 40, 50 30, 50 20 C50 10, 30 10, 20 10 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  d="M20 10 C24 14, 36 14, 40 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                />
                {/* Dollar sign on the sack */}
                <path
                  d="M28 20 C28 17, 34 17, 34 20 C34 23, 26 23, 26 26 C26 29, 34 29, 34 26"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <line x1="30" y1="15" x2="30" y2="31" stroke="currentColor" strokeWidth="2" />
              </g>
              {/* Continuous Raining / Falling gold coins */}
              <g stroke="currentColor" strokeWidth="1.5" fill="none">
                <circle cx="30" cy="110" r="10" />
                <circle cx="70" cy="95" r="8" />
                <circle cx="50" cy="140" r="9" />
                <circle cx="110" cy="120" r="11" />
                <circle cx="95" cy="165" r="7" />
                <circle cx="150" cy="100" r="10" />
                <circle cx="140" cy="150" r="9" />
                <circle cx="175" cy="130" r="8" />

                {/* Details on coins (inner circular structures and dollar symbols) */}
                <circle cx="30" cy="110" r="6" strokeDasharray="3,1" />
                <circle cx="70" cy="95" r="4" />
                <circle cx="50" cy="140" r="5" strokeDasharray="2,1" />
                <circle cx="110" cy="120" r="7" strokeDasharray="3,1" />
                <circle cx="95" cy="165" r="4" />
                <circle cx="150" cy="100" r="6" strokeDasharray="3,1" />
                <circle cx="140" cy="150" r="5" strokeDasharray="2,1" />
                <circle cx="175" cy="130" r="4" />
              </g>
            </svg>
          </div>

          {/* Trash Side: Recycle Bin being filled with dirt and waste continuous background watermark */}
          <div className="relative w-1/2 h-full opacity-[0.035] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="w-[85%] h-auto text-trash"
            >
              {/* Recycling Bin being filled with continuous crumpled items */}
              <g transform="translate(30, 40) scale(1.1)">
                {/* Recycling Bin Base */}
                <path
                  d="M40 140 L50 40 L110 40 L120 140 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                />
                {/* Recycling Bin Lid */}
                <path d="M45 40 L115 40" stroke="currentColor" strokeWidth="6" />
                <path
                  d="M68 40 L68 32 C68 28, 92 28, 92 32 L92 40"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  fill="none"
                />
                {/* Vertical trash can ridges */}
                <line x1="60" y1="48" x2="55" y2="132" stroke="currentColor" strokeWidth="3" />
                <line x1="80" y1="48" x2="80" y2="132" stroke="currentColor" strokeWidth="3" />
                <line x1="100" y1="48" x2="105" y2="132" stroke="currentColor" strokeWidth="3" />

                {/* Dirt & Crumpled waste overflow */}
                <path
                  d="M36 38 Q45 15, 60 30 Q70 10, 85 30 Q100 15, 115 35 Q125 10, 132 38 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </g>
              {/* Floating continuous trash dirt/crumpled items raining down into the bin */}
              <g
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Crumpled items */}
                <path d="M35 55 L42 60 L38 68 L30 62 Z" />
                <path d="M55 45 Q62 48, 58 55 Q50 52, 55 45 Z" />
                <path d="M125 50 L135 48 L142 58 L130 55 Z" />
                <path d="M145 75 Q152 70, 150 82 Z" />
                <path d="M160 55 L170 65 L158 70 Z" />

                {/* Dirt dust & abstract waste specks */}
                <circle cx="25" cy="85" r="2" fill="currentColor" />
                <circle cx="50" cy="75" r="3" fill="currentColor" stroke="none" />
                <circle cx="155" cy="115" r="2.5" fill="currentColor" stroke="none" />
                <circle cx="170" cy="95" r="1.5" fill="currentColor" />
                <circle cx="135" cy="85" r="2" fill="currentColor" stroke="none" />
              </g>
            </svg>
          </div>
        </div>

        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <div className="relative z-10">
          <Outlet />
        </div>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
