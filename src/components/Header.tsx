import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { Button } from "@/components/ui/button";
import { SubmitDialog } from "@/components/SubmitDialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MessageCircle, Shield } from "lucide-react";
import sotLogo from "@/assets/sot-logo.png.asset.json";
import { SotWordmark } from "@/components/SotWordmark";

export function Header({ onPosted }: { onPosted?: () => void }) {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useRoles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unread = useUnreadCount(user?.id);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-center gap-2">
            <img
              src={sotLogo.url}
              alt="SOT — Stash Or Trash logo"
              className="h-10 w-10 rounded-lg object-contain transition-transform group-hover:scale-110 group-hover:rotate-3"
            />
            <span className="hidden sm:inline">
              <SotWordmark className="text-xl" />
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.feed")}
            </Link>
            <Link
              to="/brands"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.brands")}
            </Link>
            <Link
              to="/awards"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {t("nav.awards")}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="hidden rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground sm:inline-block"
              >
                {t("nav.dashboard")}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          {loading ? null : user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin" })} aria-label={t("nav.admin")}>
                  <Shield className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate({ to: "/messages" })} aria-label={t("nav.messages")}>
                <MessageCircle className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-trash px-1 text-[10px] font-bold text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Button>
              <SubmitDialog onPosted={onPosted} />
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate({ to: "/auth" })}>
              {t("nav.signIn")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
