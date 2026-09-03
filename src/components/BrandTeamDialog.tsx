import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchBrandMembers,
  inviteBrandMember,
  removeBrandMember,
  updateBrandMemberRole,
  type BrandRole,
} from "@/lib/brand-platform";

const ROLES: BrandRole[] = ["admin", "analyst", "viewer"];

/** Invite and manage the team that represents one brand. */
export function BrandTeamDialog({ brandId, brandName }: { brandId: string; brandName: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BrandRole>("analyst");
  const [busy, setBusy] = useState(false);

  const { data: members, refetch } = useQuery({
    queryKey: ["brand-members", brandId],
    queryFn: () => fetchBrandMembers(brandId),
    enabled: open,
  });

  const invite = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await inviteBrandMember({ brandId, email, role, invitedBy: user.id });
      setEmail("");
      toast.success(t("brandTeam.invited"));
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("brandTeam.inviteFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Users className="h-4 w-4" /> {t("brandTeam.team")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("brandTeam.manageTeam", { brand: brandName })}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("brandTeam.emailPlaceholder")}
            className="min-w-[12rem] flex-1"
          />
          <Select value={role} onValueChange={(v) => setRole(v as BrandRole)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {t(`brandTeam.role_${r}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={invite} disabled={busy || !email.trim()}>
            {t("brandTeam.invite")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{t("brandTeam.inviteHint")}</p>

        <div className="mt-2 space-y-2">
          {(members ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("brandTeam.noMembers")}</p>
          ) : (
            (members ?? []).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.displayName ?? m.invited_email ?? "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.accepted_at ? t("brandTeam.active") : t("brandTeam.pending")}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Select
                    value={m.role}
                    onValueChange={async (v) => {
                      await updateBrandMemberRole(m.id, v as BrandRole);
                      refetch();
                    }}
                  >
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {t(`brandTeam.role_${r}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await removeBrandMember(m.id);
                      refetch();
                    }}
                  >
                    {t("brandTeam.remove")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
