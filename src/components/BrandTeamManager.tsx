import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBrandTeamMembers,
  inviteBrandMember,
  removeBrandMember,
  updateBrandMemberRole,
  type BrandMember,
  type BrandRole,
} from "@/lib/brand-platform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, UserPlus, Trash2, Shield, Mail } from "lucide-react";
import { toast } from "sonner";

export function BrandTeamManager({
  brandId,
  brandName,
  userRole,
}: {
  brandId: string;
  brandName: string;
  userRole?: BrandRole | null;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BrandRole>("analyst");

  const isAdmin = userRole === "admin";

  const { data: members, isLoading } = useQuery({
    queryKey: ["brand-members", brandId],
    queryFn: () => fetchBrandTeamMembers(brandId),
    enabled: open,
  });

  const inviteMutation = useMutation({
    mutationFn: () => inviteBrandMember(brandId, email, role),
    onSuccess: () => {
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["brand-members", brandId] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to send invitation.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => removeBrandMember(memberId),
    onSuccess: () => {
      toast.success("Team member removed.");
      queryClient.invalidateQueries({ queryKey: ["brand-members", brandId] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to remove member.");
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ memberId, newRole }: { memberId: string; newRole: BrandRole }) =>
      updateBrandMemberRole(memberId, newRole),
    onSuccess: () => {
      toast.success("Role updated.");
      queryClient.invalidateQueries({ queryKey: ["brand-members", brandId] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to update role.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Users className="h-4 w-4" /> Team
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Users className="h-5 w-5 text-primary" /> {brandName} Team
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Invite form for admins */}
          {isAdmin && (
            <div className="rounded-xl bg-secondary/50 p-3.5 space-y-3 border border-border/50">
              <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <UserPlus className="h-4 w-4 text-primary" /> Invite Team Member
              </span>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs h-9"
                />
                <Select value={role} onValueChange={(val) => setRole(val as BrandRole)}>
                  <SelectTrigger className="w-28 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                className="w-full h-8 text-xs gap-1"
                disabled={!email.trim() || inviteMutation.isPending}
                onClick={() => inviteMutation.mutate()}
              >
                <Mail className="h-3.5 w-3.5" /> Send Invitation
              </Button>
            </div>
          )}

          {/* Members list */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <span className="text-xs font-medium text-muted-foreground">
              Current Members ({(members ?? []).length})
            </span>

            {isLoading ? (
              <p className="text-xs text-muted-foreground py-2">Loading members...</p>
            ) : (members ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 italic">
                No invited team members yet. Owners are automatically team admins.
              </p>
            ) : (
              (members ?? []).map((m: BrandMember) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-2.5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">
                      {m.profileName || m.email || "Team Member"}
                    </p>
                    {m.email && m.profileName && (
                      <p className="text-[11px] text-muted-foreground truncate">{m.email}</p>
                    )}
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        <Shield className="mr-1 h-2.5 w-2.5 inline" /> {m.role}
                      </Badge>
                      {m.status === "pending" && (
                        <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-600">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Select
                        value={m.role}
                        onValueChange={(newRole) =>
                          roleMutation.mutate({ memberId: m.id, newRole: newRole as BrandRole })
                        }
                      >
                        <SelectTrigger className="h-7 w-20 text-[10px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-trash"
                        onClick={() => removeMutation.mutate(m.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
