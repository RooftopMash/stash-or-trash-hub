import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SubmitDialog } from "@/components/SubmitDialog";
import sotLogo from "@/assets/sot-logo.png.asset.json";

export function Header({ onPosted }: { onPosted?: () => void }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={sotLogo.url}
            alt="Stash or Trash logo"
            className="h-10 w-10 rounded-lg object-contain"
          />
          <span className="font-display text-xl font-extrabold">
            Stash<span className="text-muted-foreground"> or </span>
            <span className="text-trash">Trash</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <SubmitDialog onPosted={onPosted} />
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate({ to: "/auth" })}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
