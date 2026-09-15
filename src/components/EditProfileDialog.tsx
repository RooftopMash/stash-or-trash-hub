import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateMyProfile } from "@/lib/social";

export function EditProfileDialog({
  userId,
  displayName,
  bio,
  avatarUrl,
  onSaved,
}: {
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(displayName);
  const [about, setAbout] = useState(bio ?? "");
  const [avatar, setAvatar] = useState(avatarUrl ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await updateMyProfile({ userId, display_name: name, bio: about, avatar_url: avatar });
      toast.success(t("social.profileSaved"));
      setOpen(false);
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("social.profileSaveFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" /> {t("social.editProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("social.editProfile")}</DialogTitle>
          <DialogDescription>{t("social.bioPh")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">{t("social.displayName")}</Label>
            <Input id="profile-name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-bio">{t("social.bio")}</Label>
            <Textarea
              id="profile-bio"
              value={about}
              maxLength={280}
              placeholder={t("social.bioPh")}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-avatar">{t("social.avatarUrl")}</Label>
            <Input
              id="profile-avatar"
              value={avatar}
              placeholder="https://…"
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={busy}>
            {busy ? t("social.saving") : t("social.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
