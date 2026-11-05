import { useLocation } from "@tanstack/react-router";

export type PageThemeKey =
  | "home"
  | "feed-stash"
  | "feed-trash"
  | "feed-all"
  | "scan"
  | "brands"
  | "awards"
  | "dashboard"
  | "messages"
  | "notifications"
  | "auth"
  | "other";

export interface PageTheme {
  key: PageThemeKey;
  isHome: boolean;
  name: string;
  logoLetter: "S" | "O" | "r" | "T" | "multi";
  accentColor: string;
  topBarGlow: string;
  headerBorderClass: string;
  headerBgClass: string;
  activePillClass: string;
  mobileDockBorderClass: string;
  mobileActiveColorClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
}

export function usePageTheme(): PageTheme {
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search as Record<string, unknown>;
  const filter = typeof search.filter === "string" ? search.filter : undefined;

  // 1. Home Page: Must remain crisp white with clean slate/neutral task bar
  if (pathname === "/") {
    return {
      key: "home",
      isHome: true,
      name: "Home",
      logoLetter: "O",
      accentColor: "#0f172a",
      topBarGlow: "bg-slate-200/80",
      headerBorderClass: "border-slate-200/80",
      headerBgClass: "bg-white/95",
      activePillClass: "bg-slate-950 text-white font-bold",
      mobileDockBorderClass: "border-slate-200",
      mobileActiveColorClass: "text-slate-950",
      badgeBgClass: "bg-slate-100",
      badgeTextClass: "text-slate-900",
    };
  }

  // 2. Feed Page: Dynamic based on Stash (Gold) vs Trash (Red) vs All (Split)
  if (pathname.startsWith("/feed")) {
    if (filter === "trash") {
      return {
        key: "feed-trash",
        isHome: false,
        name: "Trashes of the Day",
        logoLetter: "r",
        accentColor: "#e34b4b",
        topBarGlow: "bg-gradient-to-r from-red-500 via-[#e34b4b] to-rose-600 shadow-[0_1px_12px_rgba(227,75,75,0.4)]",
        headerBorderClass: "border-red-200/80",
        headerBgClass: "bg-red-50/40",
        activePillClass: "bg-[#e34b4b] text-white font-black shadow-xs",
        mobileDockBorderClass: "border-red-200",
        mobileActiveColorClass: "text-[#e34b4b]",
        badgeBgClass: "bg-red-100",
        badgeTextClass: "text-red-900",
      };
    }

    if (filter === "stash") {
      return {
        key: "feed-stash",
        isHome: false,
        name: "Stashes of the Day",
        logoLetter: "S",
        accentColor: "#d6a928",
        topBarGlow: "bg-gradient-to-r from-amber-400 via-[#d6a928] to-yellow-500 shadow-[0_1px_12px_rgba(214,169,40,0.4)]",
        headerBorderClass: "border-amber-200/80",
        headerBgClass: "bg-amber-50/40",
        activePillClass: "bg-[#d6a928] text-slate-950 font-black shadow-xs",
        mobileDockBorderClass: "border-amber-200",
        mobileActiveColorClass: "text-[#b88c1b]",
        badgeBgClass: "bg-amber-100",
        badgeTextClass: "text-amber-900",
      };
    }

    // All feed: Dual Stash Gold & Trash Red split
    return {
      key: "feed-all",
      isHome: false,
      name: "Community Feed",
      logoLetter: "multi",
      accentColor: "#d6a928",
      topBarGlow: "bg-gradient-to-r from-[#d6a928] via-slate-900 to-[#e34b4b] shadow-[0_1px_12px_rgba(214,169,40,0.3)]",
      headerBorderClass: "border-amber-200/60",
      headerBgClass: "bg-white/95",
      activePillClass: "bg-slate-950 text-white font-black",
      mobileDockBorderClass: "border-amber-200/80",
      mobileActiveColorClass: "text-amber-700",
      badgeBgClass: "bg-amber-50",
      badgeTextClass: "text-amber-900",
    };
  }

  // 3. Scan & Authenticity: Forensic Cyber Emerald Green
  if (pathname.startsWith("/scan")) {
    return {
      key: "scan",
      isHome: false,
      name: "Product & Barcode Scanner",
      logoLetter: "multi",
      accentColor: "#10b981",
      topBarGlow: "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_1px_12px_rgba(16,185,129,0.4)]",
      headerBorderClass: "border-emerald-200/80",
      headerBgClass: "bg-emerald-50/30",
      activePillClass: "bg-emerald-600 text-white font-black shadow-xs",
      mobileDockBorderClass: "border-emerald-200",
      mobileActiveColorClass: "text-emerald-600",
      badgeBgClass: "bg-emerald-100",
      badgeTextClass: "text-emerald-900",
    };
  }

  // 4. Brands Directory & Brand Profile: Electric Trust Blue (The 'T' in SOrT)
  if (pathname.startsWith("/brands")) {
    return {
      key: "brands",
      isHome: false,
      name: "Brands Barometer",
      logoLetter: "T",
      accentColor: "#2563eb",
      topBarGlow: "bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 shadow-[0_1px_12px_rgba(37,99,235,0.4)]",
      headerBorderClass: "border-blue-200/80",
      headerBgClass: "bg-blue-50/30",
      activePillClass: "bg-blue-600 text-white font-black shadow-xs",
      mobileDockBorderClass: "border-blue-200",
      mobileActiveColorClass: "text-[#2563eb]",
      badgeBgClass: "bg-blue-100",
      badgeTextClass: "text-blue-900",
    };
  }

  // 5. Awards & Leaderboards: Podium Trophy Gold
  if (pathname.startsWith("/awards")) {
    return {
      key: "awards",
      isHome: false,
      name: "SOT Awards & Leaderboards",
      logoLetter: "S",
      accentColor: "#f59e0b",
      topBarGlow: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 shadow-[0_1px_12px_rgba(245,158,11,0.4)]",
      headerBorderClass: "border-amber-200/80",
      headerBgClass: "bg-amber-50/30",
      activePillClass: "bg-amber-500 text-slate-950 font-black shadow-xs",
      mobileDockBorderClass: "border-amber-200",
      mobileActiveColorClass: "text-amber-600",
      badgeBgClass: "bg-amber-100",
      badgeTextClass: "text-amber-900",
    };
  }

  // 6. Dashboard / Brand Suite: Executive Midnight & Gold
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return {
      key: "dashboard",
      isHome: false,
      name: "Executive Hub",
      logoLetter: "S",
      accentColor: "#d6a928",
      topBarGlow: "bg-gradient-to-r from-[#d6a928] via-slate-700 to-[#d6a928] shadow-[0_1px_12px_rgba(214,169,40,0.3)]",
      headerBorderClass: "border-slate-800",
      headerBgClass: "bg-slate-950/95 text-white",
      activePillClass: "bg-[#d6a928] text-slate-950 font-black",
      mobileDockBorderClass: "border-slate-800",
      mobileActiveColorClass: "text-[#d6a928]",
      badgeBgClass: "bg-slate-800",
      badgeTextClass: "text-[#f5d061]",
    };
  }

  // 7. Messages & Live Communication: Teal / Cyan
  if (pathname.startsWith("/messages")) {
    return {
      key: "messages",
      isHome: false,
      name: "Messages & Calling",
      logoLetter: "multi",
      accentColor: "#0d9488",
      topBarGlow: "bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 shadow-[0_1px_12px_rgba(13,148,136,0.4)]",
      headerBorderClass: "border-teal-200/80",
      headerBgClass: "bg-teal-50/30",
      activePillClass: "bg-teal-600 text-white font-black shadow-xs",
      mobileDockBorderClass: "border-teal-200",
      mobileActiveColorClass: "text-teal-600",
      badgeBgClass: "bg-teal-100",
      badgeTextClass: "text-teal-900",
    };
  }

  // Fallback
  return {
    key: "other",
    isHome: false,
    name: "SOT",
    logoLetter: "multi",
    accentColor: "#d6a928",
    topBarGlow: "bg-gradient-to-r from-[#d6a928] to-slate-900",
    headerBorderClass: "border-slate-200",
    headerBgClass: "bg-white/95",
    activePillClass: "bg-slate-950 text-white font-bold",
    mobileDockBorderClass: "border-slate-200",
    mobileActiveColorClass: "text-slate-900",
    badgeBgClass: "bg-slate-100",
    badgeTextClass: "text-slate-900",
  };
}
