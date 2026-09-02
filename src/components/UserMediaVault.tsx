import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserMedia,
  uploadUserMedia,
  deleteUserMedia,
  type UserMediaItem,
} from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImagePlus, Film, Music, Trash2, Upload, Play, Volume2 } from "lucide-react";
import { toast } from "sonner";

export function UserMediaVault({
  userId,
  isOwner,
}: {
  userId: string;
  isOwner?: boolean;
}) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("photos");

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["user-media", userId],
    queryFn: () => fetchUserMedia(userId),
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadUserMedia(userId, file, caption);
      toast.success("Media uploaded to your profile!");
      setFile(null);
      setCaption("");
      queryClient.invalidateQueries({ queryKey: ["user-media", userId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (mediaId: string) => deleteUserMedia(mediaId),
    onSuccess: () => {
      toast.success("Media deleted.");
      queryClient.invalidateQueries({ queryKey: ["user-media", userId] });
    },
  });

  const photos = (mediaItems ?? []).filter((m) => m.media_type === "photo");
  const videos = (mediaItems ?? []).filter((m) => m.media_type === "video");
  const audio = (mediaItems ?? []).filter((m) => m.media_type === "audio");

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" /> Media Storage & Gallery
          </h2>
          <p className="text-xs text-muted-foreground">
            Personal vault for photos, videos, and audio clips
          </p>
        </div>
      </div>

      {/* Upload Box for Owner */}
      {isOwner && (
        <div className="mb-6 rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-3">
          <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
            <Upload className="h-4 w-4 text-primary" /> Upload New Media
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-xs h-9 bg-card"
              />
              {file && (
                <p className="mt-1 text-[11px] text-muted-foreground truncate">
                  Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <Input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="text-xs h-9 bg-card"
            />
          </div>

          <Button
            size="sm"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full h-8 text-xs gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading..." : "Save to Vault"}
          </Button>
        </div>
      )}

      {/* Gallery Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="photos" className="text-xs gap-1.5">
            <ImagePlus className="h-3.5 w-3.5" /> Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="text-xs gap-1.5">
            <Film className="h-3.5 w-3.5" /> Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs gap-1.5">
            <Music className="h-3.5 w-3.5" /> Audio ({audio.length})
          </TabsTrigger>
        </TabsList>

        {/* Photos Grid */}
        <TabsContent value="photos" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-xl">
              No photos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((m) => (
                <div key={m.id} className="group relative overflow-hidden rounded-xl border border-border bg-black aspect-square">
                  <img
                    src={m.signedUrl || m.media_url}
                    alt={m.caption || "Photo"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {m.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] text-white truncate">
                      {m.caption}
                    </div>
                  )}
                  {isOwner && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(m.id)}
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Videos Grid */}
        <TabsContent value="videos" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-xl">
              No videos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((m) => (
                <div key={m.id} className="relative rounded-xl overflow-hidden border border-border bg-black p-2 space-y-2">
                  <video
                    src={m.signedUrl || m.media_url}
                    controls
                    className="w-full aspect-video rounded-lg object-contain bg-black"
                  />
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {m.caption || "Video File"}
                    </span>
                    {isOwner && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(m.id)}
                        className="h-6 w-6 text-muted-foreground hover:text-trash"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Audio List */}
        <TabsContent value="audio" className="pt-4">
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : audio.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-xl">
              No audio clips uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {audio.map((m) => (
                <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Volume2 className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium truncate">
                      {m.caption || "Audio Clip"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <audio src={m.signedUrl || m.media_url} controls className="h-8 max-w-xs w-full" />
                    {isOwner && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(m.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-trash shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
