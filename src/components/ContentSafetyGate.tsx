import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileCheck2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const initialReviews = [
  { id: "review-1", type: "Video", title: "Customer experience clip", status: "needs_review", finding: "AI edit disclosure required" },
  { id: "review-2", type: "Product", title: "Prank product concept", status: "queued", finding: "Awaiting safety checks" },
  { id: "review-3", type: "Photo", title: "Brand comparison image", status: "approved", finding: "No material risk detected" },
] as const;

export function ContentSafetyGate() {
  const [reviews, setReviews] = useState(initialReviews);
  const approve = (id: string) => setReviews((items) => items.map((item) => item.id === id ? { ...item, status: "approved", finding: "Approved by human reviewer" } : item));
  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3"><div className="rounded-xl bg-stash/10 p-2 text-stash"><ShieldAlert className="h-5 w-5" /></div><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stash">Pre-publication safety gate</p><h2 className="mt-1 font-display text-xl font-extrabold">Review before it reaches the public wall</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">AI-assisted checks flag manipulated media, undisclosed edits, unsafe pranks, spam, and misleading claims. Human reviewers make the final decision.</p></div></div>
        <Badge variant="outline" className="w-fit gap-1"><FileCheck2 className="h-3.5 w-3.5" /> Explainable review queue</Badge>
      </div>
      <div className="mt-5 space-y-2">{reviews.map((review) => <div key={review.id} className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-lg bg-secondary p-2"><AlertTriangle className="h-4 w-4 text-trash" /></div><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold">{review.title}</p><Badge variant="secondary">{review.type}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{review.finding}</p></div></div><div className="flex items-center gap-2">{review.status === "approved" ? <Badge className="gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Approved</Badge> : <><Badge variant="outline">{review.status === "needs_review" ? "Needs review" : "Queued"}</Badge><Button size="sm" variant="outline" onClick={() => approve(review.id)}>Approve</Button></>}</div></div>)}</div>
      <p className="mt-4 text-xs text-muted-foreground">Every decision should retain the model findings, reviewer action, timestamp, and appeal path for auditability.</p>
    </section>
  );
}
