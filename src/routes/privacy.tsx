import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return <div className="min-h-screen"><Header /><main className="mx-auto max-w-3xl px-4 py-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-stash">Privacy policy · 2026-09-11</p><h1 className="mt-2 font-display text-4xl font-extrabold">Privacy, safety, and data control</h1><div className="prose prose-sm mt-8 max-w-none text-muted-foreground"><p>Stash or Trash Hub uses account, profile, submission, moderation, and connection data to provide brand ratings, public walls, safety review, and direct brand communication.</p><h2>Control and retention</h2><p>You can review consent, report content, block users, revoke provider connections, and request account deletion from your account controls. Public posts remain visible until removed or moderated.</p><h2>Security</h2><p>Access is scoped by authenticated ownership policies. Provider secrets must remain server-side and are never exposed in the browser. We retain security and moderation records only as needed to protect the community and meet legal obligations.</p><h2>Contact</h2><p>For privacy requests, contact the service operator through the support channel listed in the app.</p></div></main></div>;
}
