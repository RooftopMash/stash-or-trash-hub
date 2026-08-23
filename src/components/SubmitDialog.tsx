import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createItem } from "@/lib/stash";
import { fetchBrands } from "@/lib/brands";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ImagePlus, Check, ChevronsUpDown, Search, Building2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brandId, setBrandId] = useState<string>(defaultBrandId ?? NO_BRAND);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: brands } = useQuery({
    queryKey: ["brands-select"],
    queryFn: fetchBrands,
    enabled: open && !defaultBrandId,
  });

  const selectedBrand = useMemo(() => {
    if (brandId === NO_BRAND) return null;
    return (brands ?? []).find((b) => b.id === brandId) ?? null;
  }, [brands, brandId]);

  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    const query = brandSearch.trim().toLowerCase();
    if (!query) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(query));
  }, [brands, brandSearch]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setBrandId(defaultBrandId ?? NO_BRAND);
    setBrandSearch("");
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
          <DialogDescription>{t("submit.intro")}</DialogDescription>
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
              <Popover open={brandPopoverOpen} onOpenChange={setBrandPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={brandPopoverOpen}
                    className="w-full justify-between h-10 px-3 bg-background border-border font-normal text-left"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {selectedBrand ? (
                        <span className="font-medium text-foreground">
                          {selectedBrand.name} {selectedBrand.verified ? "✓" : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{t("submit.noBrand")}</span>
                      )}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-2"
                  align="start"
                >
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Type 3 letters to search brands..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="h-8 pl-8 text-xs bg-card"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setBrandId(NO_BRAND);
                        setBrandPopoverOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors hover:bg-accent text-left",
                        brandId === NO_BRAND && "bg-accent font-semibold",
                      )}
                    >
                      <span>{t("submit.noBrand")}</span>
                      {brandId === NO_BRAND && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                    {filteredBrands.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setBrandId(b.id);
                          setBrandPopoverOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors hover:bg-accent text-left",
                          brandId === b.id && "bg-accent font-semibold",
                        )}
                      >
                        <span className="truncate">
                          {b.name} {b.verified ? "✓" : ""}
                        </span>
                        {brandId === b.id && <Check className="h-3.5 w-3.5 text-primary" />}
                      </button>
                    ))}
                    {filteredBrands.length === 0 && (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        No brands matching "{brandSearch}"
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
