import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Lightbulb, LockKeyhole, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { createProfileWallPost, fetchProfileWallPosts, type WallPostType } from "@/lib/profile-wall";

const types: Array<{ value: WallPostType; label: string }> = [
  { value: "experience", label: "Experience" },
  { value: "idea", label: "Idea" },
  { value: "concept", label: "Concept" },
  { value: "invention", label: "Invention" },
  { value: "innovation", label: "Innovation" },
];

export function ProfileWall({ profileId, isOwner }: { profileId: string; isOwner: boolean }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [postType, setPostType] = useState<WallPostType>("experience");
  const [submitting, setSubmitting] = useState(false);
  const query = useQuery({ queryKey: ["profile-wall", profileId], queryFn: () => fetchProfileWallPosts(profileId) });

  const publish = async () => {
    if (!user || !body.trim()) return;
    setSubmitting(true);
    try {
      await createProfileWallPost({ authorId: user.id, body, postType });
      setBody("");
      await queryClient.invalidateQueries({ queryKey: ["profile-wall", profileId] });
      toast.success("Published to your public wall");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish your post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-stash/25 bg-card">
      <div className="border-b border-stash/15 bg-stash/5 p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stash">Public wall</p>
        <h2 className="mt-1 font-display text-xl font-extrabold">Experiences, ideas and innovations</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">A direct channel to brands. Your public record stays visible for CX, PR, and accountability.</p>
        {isOwner && user && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2" aria-label="Post type">
              {types.map((type) => <Button key={type.value} type="button" size="sm" variant={postType === type.value ? "default" : "outline"} onClick={() => setPostType(type.value)}>{type.label}</Button>)}
            </div>
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} placeholder="Share an experience, idea, concept, invention, or innovation directly with brands..." aria-label="Wall post" />
            <div className="flex justify-end"><Button onClick={publish} disabled={submitting || !body.trim()}><Send className="mr-2 h-4 w-4" />{submitting ? "Publishing..." : "Publish to wall"}</Button></div>
          </div>
        )}
        <div className="mt-4 grid gap-2 border-t border-stash/15 pt-4 text-xs text-muted-foreground sm:grid-cols-3">
          <span className="flex items-center gap-2"><Eye className="h-4 w-4 text-stash" /> Public accountability</span>
          <span className="flex items-center gap-2"><Send className="h-4 w-4 text-trash" /> Direct to brands</span>
          <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" /> Secure data trail</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {query.isLoading ? <p className="p-5 text-sm text-muted-foreground">Loading wall...</p> : query.data?.length ? query.data.map((post) => <article key={post.id} className="p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs font-extrabold uppercase tracking-wider text-stash">{post.post_type}</span><time className="text-xs text-muted-foreground" dateTime={post.created_at}>{post.created_at.slice(0, 10)}</time></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{post.body}</p></article>) : <p className="p-5 text-sm text-muted-foreground">No public posts yet. This wall is ready for the first experience or idea.</p>}
      </div>
    </section>
  );
}
