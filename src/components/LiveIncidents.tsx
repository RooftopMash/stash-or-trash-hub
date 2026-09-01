import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Megaphone, Send, Image as ImageIcon, Video, Mic, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { BrandSearch } from "@/components/BrandSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  fetchIncidents, createIncident, subscribeToIncidents,
  type Incident, type IncidentMediaType,
} from "@/lib/incidents";

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function MediaView({ incident }: { incident: Incident }) {
  if (!incident.signedMediaUrl) return null;
  if (incident.media_type === "video") {
    return <video src={incident.signedMediaUrl} controls className="mt-3 aspect-video w-full rounded-xl bg-black object-contain" />;
  }
  if (incident.media_type === "audio") {
    return <audio src={incident.signedMediaUrl} controls className="mt-3 w-full" />;
  }
  return <img src={incident.signedMediaUrl} alt={incident.title} className="mt-3 aspect-video w-full rounded-xl object-cover" loading="lazy" />;
}

export function LiveIncidents() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: incidents, isLoading, refetch } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => fetchIncidents(100),
  });

  useEffect(() => {
    const unsubscribe = subscribeToIncidents(() => refetch());
    return () => { unsubscribe(); };
  }, [refetch]);

  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Megaphone className="h-3.5 w-3.5 text-trash" /> Live incidents
        </h2>
        <IncidentComposer onPosted={refetch} />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : !incidents || incidents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          No live incidents reported yet.
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.slice(0, 5).map((inc) => (
            <div key={inc.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  {inc.brandName && inc.brandSlug && (
                    <Link to="/brands/$slug" params={{ slug: inc.brandSlug }} className="text-xs font-semibold text-primary hover:underline">
                      {inc.brandName}
                    </Link>
                  )}
                  {inc.lat != null && inc.lng != null && (
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {inc.lat.toFixed(3)}, {inc.lng.toFixed(3)}
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{relativeTime(inc.created_at)}</span>
              </div>
              <h3 className="mt-1 font-display font-bold">{inc.title}</h3>
              {inc.description && <p className="mt-1 text-sm text-muted-foreground">{inc.description}</p>}
              <MediaView incident={inc} />
              <p className="mt-2 text-[10px] text-muted-foreground">by {inc.authorName}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


function IncidentComposer({ onPosted }: { onPosted?: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<IncidentMediaType>("photo");
  const [file, setFile] = useState<File | null>(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setTitle(""); setDescription(""); setBrandId(null); setFile(null); setCoords(null); setBusy(false); };

  const captureLocation = () => {
    if (!navigator.geolocation) return toast.error("Location unavailable on this device");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => { toast.error("Could not get location"); setLocating(false); },
    );
  };

  const submit = async () => {
    if (!user) return toast.info(t("social.signInToFollow"));
    if (!title.trim()) return toast.error("Give the incident a title.");
    setBusy(true);
    try {
      await createIncident({
        userId: user.id, brandId, title, description, file, mediaType,
        lat: coords?.lat ?? null, lng: coords?.lng ?? null,
      });
      toast.success("Incident reported.");
      reset(); setOpen(false); onPosted?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not report incident.");
    } finally {
      setBusy(false);
    }
  };

  const accept = mediaType === "photo" ? "image/*" : mediaType === "video" ? "video/*" : "audio/*";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Megaphone className="h-4 w-4" /> Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Report live incident</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label>Brand (optional)</Label>
            <BrandSearch onSelectBrand={(b) => setBrandId(b.id)} placeholder="Tag a brand" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inc-title">Title</Label>
            <Input id="inc-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="What happened?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inc-desc">Description (optional)</Label>
            <Textarea id="inc-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} />
          </div>
          <div className="space-y-2">
            <Label>Media</Label>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={mediaType === "photo" ? "default" : "outline"} onClick={() => setMediaType("photo")} className="gap-1">
                <ImageIcon className="h-4 w-4" /> Photo
              </Button>
              <Button type="button" size="sm" variant={mediaType === "video" ? "default" : "outline"} onClick={() => setMediaType("video")} className="gap-1">
                <Video className="h-4 w-4" /> Video
              </Button>
              <Button type="button" size="sm" variant={mediaType === "audio" ? "default" : "outline"} onClick={() => setMediaType("audio")} className="gap-1">
                <Mic className="h-4 w-4" /> Voice
              </Button>
            </div>
            <Input ref={fileRef} type="file" accept={accept} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="text-[10px] text-muted-foreground">
              Use your camera / mic app to record, then attach the file here. (Live camera capture lands with device testing.)
            </p>
          </div>
          <div className="space-y-2">
            <Button type="button" size="sm" variant="outline" onClick={captureLocation} disabled={locating} className="gap-1.5">
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {coords ? `Location attached (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})` : "Attach location"}
            </Button>
          </div>
          <Button onClick={submit} disabled={busy} className="w-full gap-1.5">
            {busy ? "Posting..." : <><Send className="h-4 w-4" /> Report now</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
