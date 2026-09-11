import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return <div className="min-h-screen"><Header /><main className="mx-auto max-w-3xl px-4 py-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-stash">Terms of service · 2026-09-11</p><h1 className="mt-2 font-display text-4xl font-extrabold">Fair participation and accountability</h1><div className="prose prose-sm mt-8 max-w-none text-muted-foreground"><p>Use Stash or Trash Hub to share honest experiences, ideas, concepts, inventions, innovations, and brand feedback. Do not impersonate, harass, defame, manipulate evidence, or publish unlawful content.</p><h2>Moderation</h2><p>Submissions may be checked by automated safety systems and human reviewers. We may limit, remove, or hold content while an appeal is reviewed. No automated system is a substitute for evidence or due process.</p><h2>Brand communication</h2><p>Brand responses and AI-assisted advice must be reviewed by the responsible brand. The service does not guarantee a brand response, commercial outcome, or rating result.</p><h2>Account control</h2><p>You are responsible for your account. You may request deletion, revoke connections, and report or block users through the app.</p></div></main></div>;
}
