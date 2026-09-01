import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { createItem } from "@/lib/stash";
import { BrandSearch } from "@/components/BrandSearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const NO_BRAND = "__none__";

export function SubmitDialog({
  onPosted,
  defaultBrandId,
}: {
  onPosted?: () => void;
  defaultBrandId?: string;
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brandId, setBrandId] = useState<string>(defaultBrandId ?? NO_BRAND);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setBrandId(defaultBrandId ?? NO_BRAND);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error(t("submit.needTitle"));
      return;
    }
    setSubmitting(true);
    try {
      await createItem({
        userId: user.id,
        title,
        description,
        file,
        brandId: brandId === NO_BRAND ? null : brandId,
        category,
      });
      toast.success(t("submit.posted"));
      reset();
      setOpen(false);
      onPosted?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("submit.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> {t("submit.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t("submit.title")}</DialogTitle>
          <DialogDescription>
            {t("submit.intro")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">{t("submit.fieldTitle")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("submit.titlePh")}
              maxLength={120}
            />
          </div>

          {!defaultBrandId && (
            <div className="space-y-2">
              <Label>{t("submit.brand")}</Label>
              <BrandSearch
                onSelectBrand={(b) => setBrandId(b.id)}
                selectedId={brandId === NO_BRAND ? undefined : brandId}
                placeholder={t("submit.brandPh")}
              />
              {brandId !== NO_BRAND && (
                <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => setBrandId(NO_BRAND)}>
                  {t("submit.noBrand")}
                </Button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">{t("submit.category")}</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("submit.categoryPh")}
              maxLength={40}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">{t("submit.description")}</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("submit.descriptionPh")}
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" /> {t("submit.photo")}
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file && <p className="text-xs text-muted-foreground">{file.name}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? t("submit.posting") : t("submit.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
