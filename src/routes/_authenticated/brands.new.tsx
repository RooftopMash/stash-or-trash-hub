import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createBrand } from "@/lib/brands";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/brands/new")({
  component: NewBrandPage,
});

function NewBrandPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return;
    if (!name.trim()) return toast.error("A brand needs a name.");
    setBusy(true);
    try {
      const brand = await createBrand({
        ownerId: user.id,
        name,
        description,
        website,
        category,
        logo,
      });
      toast.success("Brand created!");
      navigate({ to: "/brands/$slug", params: { slug: brand.slug } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create brand.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="font-display text-3xl font-extrabold">Create a brand</h1>
        <p className="mt-2 text-muted-foreground">
          Set up a brand page so the community can post and vote on it.
        </p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat">Category</Label>
            <Input
              id="cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Fashion, tech, food…"
              maxLength={40}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="web">Website</Label>
            <Input
              id="web"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://…"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo" className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" /> Logo
            </Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button className="w-full" onClick={submit} disabled={busy}>
            {busy ? "Creating…" : "Create brand"}
          </Button>
        </div>
      </main>
    </div>
  );
}
