import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home, Flame, Scan, Building2, Trophy, User, Coins, Recycle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePageTheme } from "@/lib/page-theme";
import { cn } from "@/lib/utils";

export function MobileTaskBar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const theme = usePageTheme();
  const pathname = location.pathname;
  const search = location.search as Record<string, unknown>;
  const filter = typeof search.filter === "string" ? search.filter : undefined;

  const isHome = pathname === "/";
  const isFeed = pathname.startsWith("/feed");
  const isScan = pathname.startsWith("/scan");
  const isBrands = pathname.startsWith("/brands");
  const isAwards = pathname.startsWith("/awards");
  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth");

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t shadow-[0_-4px_24px_rgba(0,0,0,0.08)] transition-colors duration-300",
        theme.mobileDockBorderClass,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Top 2px glowing color-coded accent line reflecting the page theme */}
      <div
        className={cn(
          "h-[2.5px] w-full transition-all duration-300",
          theme.topBarGlow,
        )}
      />

      <div className="flex h-15 items-center justify-around px-2">
        {/* 1. HOME: Pure White / Neutral Theme */}
        <Link
          to="/"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition-all",
            isHome
              ? "text-slate-950 font-black scale-105"
              : "text-slate-500 hover:text-slate-800",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              isHome ? "bg-slate-950 text-white shadow-xs" : "bg-transparent",
            )}
          >
            <Home className="h-4 w-4" />
          </div>
          <span>{t("nav.home", { defaultValue: "Home" })}</span>
        </Link>

        {/* 2. FEED: Stashes (Gold) or Trashes (Red) or All */}
        <Link
          to="/feed"
          search={{ filter: filter === "trash" ? "trash" : "stash" }}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition-all",
            isFeed
              ? filter === "trash"
                ? "text-[#e34b4b] font-black scale-105"
                : "text-[#b88c1b] font-black scale-105"
              : "text-slate-500 hover:text-slate-800",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              isFeed
                ? filter === "trash"
                  ? "bg-[#e34b4b] text-white shadow-xs"
                  : "bg-[#d6a928] text-slate-950 shadow-xs"
                : "bg-transparent",
            )}
          >
            {filter === "trash" ? (
              <Recycle className="h-4 w-4" />
            ) : filter === "stash" ? (
              <Coins className="h-4 w-4" />
            ) : (
              <Flame className="h-4 w-4" />
            )}
          </div>
          <span>{filter === "trash" ? t("vote.trash", { defaultValue: "Trash" }) : filter === "stash" ? t("vote.stash", { defaultValue: "Stash" }) : t("nav.feed", { defaultValue: "Feed" })}</span>
        </Link>

        {/* 3. SCAN: Center Cyber Emerald Forensic Barcode Action Button */}
        <Link
          to="/scan"
          aria-label="Scan Product Barcode"
          className="relative -top-3 flex flex-col items-center justify-center focus:outline-none"
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-transform active:scale-95",
              isScan && "ring-2 ring-emerald-500 ring-offset-2 scale-105",
            )}
          >
            <Scan className="h-5 w-5 animate-pulse" />
          </div>
          <span
            className={cn(
              "mt-0.5 text-[9px] font-black uppercase tracking-wider",
              isScan ? "text-emerald-700" : "text-slate-600",
            )}
          >
            {t("nav.scan", { defaultValue: "Scan" })}
          </span>
        </Link>

        {/* 4. BRANDS: Electric Blue (The 'T' in SOrT) */}
        <Link
          to="/brands"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition-all",
            isBrands
              ? "text-[#2563eb] font-black scale-105"
              : "text-slate-500 hover:text-slate-800",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              isBrands ? "bg-[#2563eb] text-white shadow-xs" : "bg-transparent",
            )}
          >
            <Building2 className="h-4 w-4" />
          </div>
          <span>{t("nav.brands", { defaultValue: "Brands" })}</span>
        </Link>

        {/* 5. AWARDS: Podium Gold */}
        <Link
          to="/awards"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition-all",
            isAwards
              ? "text-amber-700 font-black scale-105"
              : "text-slate-500 hover:text-slate-800",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              isAwards ? "bg-amber-500 text-slate-950 shadow-xs" : "bg-transparent",
            )}
          >
            <Trophy className="h-4 w-4" />
          </div>
          <span>{t("nav.awards", { defaultValue: "Awards" })}</span>
        </Link>

        {/* 6. HUB / ACCOUNT */}
        <Link
          to={user ? "/dashboard" : "/auth"}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition-all",
            isDashboard
              ? "text-slate-950 font-black scale-105"
              : "text-slate-500 hover:text-slate-800",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              isDashboard ? "bg-slate-900 text-[#f5d061] shadow-xs" : "bg-transparent",
            )}
          >
            <User className="h-4 w-4" />
          </div>
          <span>{user ? "Hub" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  );
}
