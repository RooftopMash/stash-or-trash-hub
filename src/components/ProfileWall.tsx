import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, LockKeyhole, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createProfileWallPost, getProfileWallPosts, WALL_TYPES, type WallPostType } from "@/lib/profile-wall";

const labels: Record<WallPostType, string> = {
  experience: "Experience",
  idea: "Idea",
  concept: "Concept",
  invention: "Invention",
  innovation: "Innovation",
};

export function ProfileWall({ profileId, isOwner }: { profileId: string; isOwner: boolean }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [postType, setPostType] = useState<WallPostType>("experience");
  const [submitting, setSubmitting] = useState(false);
  const { data: posts, isLoading } = useQuery({
    queryKey: ["profile-wall", profileId],
    queryFn: () => getProfileWallPosts(profileId),
  });

  const publish = async () => {
    if (!user || !body.trim()) return;
    setSubmitting(true);
    try {
      await createProfileWallPost({ authorId: user.id, body, postType });
      setBody("");
      await queryClient.invalidateQueries({ queryKey: ["profile-wall", profileId] });
      toast.success("Published to your public wall.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish this post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-stash/25 bg-stash/5">
      <div className="p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stash">Public wall</p>
        <h2 className="mt-1 font-display text-xl font-extrabold">Experiences, ideas and inventions</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">A direct channel to brands. Posts are public, time-stamped, and available for CX and reputation analysis.</p>
        {isOwner && user ? (
          <div className="mt-5 space-y-3 border-t border-stash/15 pt-4">
            <Label htmlFor="wall-post">Share directly with brands</Label>
            <div className="flex flex-wrap gap-2">
              {WALL_TYPES.map((type) => (
                <Button key={type} type="button" size="sm" variant={postType === type ? "default" : "outline"} onClick={() => setPostType(type)}>{labels[type]}</Button>
              ))}
            </div>
            <Textarea id="wall-post" value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} placeholder="Share an experience, idea, concept, invention, or innovation..." />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{body.length}/5000 · Public record</span>
              <Button onClick={publish} disabled={submitting || !body.trim()}>{submitting ? "Publishing..." : "Publish to wall"}</Button>
            </div>
          </div>
        ) : null}
        <div className="mt-4 grid gap-3 border-t border-stash/15 pt-4 text-xs text-muted-foreground sm:grid-cols-3">
          <span className="flex items-center gap-2"><Eye className="h-4 w-4 text-stash" /> Public accountability</span>
          <span className="flex items-center gap-2"><Send className="h-4 w-4 text-trash" /> Direct to brands</span>
          <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-foreground" /> Secure data trail</span>
        </div>
      </div>
      <div className="border-t border-border bg-card">
        {isLoading ? <p className="p-5 text-sm text-muted-foreground">Loading wall...</p> : posts?.length ? posts.map((post) => (
          <article key={post.id} className="border-b border-border p-5 last:border-b-0">
            <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground"><span>{labels[post.post_type]}</span><time dateTime={post.created_at}>{post.created_at.slice(0, 10)}</time></div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{post.body}</p>
          </article>
        )) : <p className="p-5 text-sm text-muted-foreground">No public wall posts yet.</p>}
      </div>
    </section>
  );
}
