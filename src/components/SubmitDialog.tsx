import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [open, setOpen] = useState(false);
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
      toast.error("Give it a title first.");
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
      toast.success("Posted! Let the verdict begin.");
      reset();
      setOpen(false);
      onPosted?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Post something to judge</DialogTitle>
          <DialogDescription>
            Tag a brand, add a photo, and let the community decide: stash it or trash it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="These neon sneakers…"
              maxLength={120}
            />
          </div>

          {!defaultBrandId && (
            <div className="space-y-2">
              <Label>Brand (optional)</Label>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_BRAND}>No brand</SelectItem>
                  {(brands ?? []).map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                      {b.verified ? " ✓" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Packaging, ad, product, service…"
              maxLength={40}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description (optional)</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why should people stash or trash this?"
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" /> Photo (optional)
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
            {submitting ? "Posting…" : "Post it"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
