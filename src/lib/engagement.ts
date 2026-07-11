// Lightweight, client-side engagement/streak tracking. Persuasion mechanics:
//  - Daily streaks (loss aversion + habit loop)
//  - A visible running "verdicts cast" count (endowed progress / commitment)
//  - Variable reward copy on each vote (dopamine-driven reinforcement)
// No server needed — this is pure front-end reinforcement layered on top of the
// real votes already stored in the backend.

const KEY = "sot-engagement-v1";

export type Engagement = {
  streak: number; // consecutive days with at least one verdict
  lastVoteDay: string | null; // YYYY-MM-DD
  totalVerdicts: number; // lifetime verdicts cast on this device
  todayVerdicts: number;
  todayDay: string | null;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function empty(): Engagement {
  return { streak: 0, lastVoteDay: null, totalVerdicts: 0, todayVerdicts: 0, todayDay: null };
}

export function readEngagement(): Engagement {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const e = { ...empty(), ...(JSON.parse(raw) as Engagement) };
    if (e.todayDay !== today()) {
      e.todayVerdicts = 0;
      e.todayDay = today();
    }
    return e;
  } catch {
    return empty();
  }
}

// Variable-reward messages — never the same hit twice in a row.
const REWARDS = [
  "🔥 Verdict locked in!",
  "⚡ Your voice just moved the needle.",
  "💥 Boom — the brand felt that.",
  "👀 Brands are watching this.",
  "🎯 Nailed it. Keep the streak alive.",
  "🚀 You're shaping the verdict.",
];

export function recordVote(): { engagement: Engagement; reward: string; milestone: string | null } {
  const e = readEngagement();
  const t = today();

  if (e.lastVoteDay === t) {
    // already counted a day; just increment counts
  } else if (e.lastVoteDay) {
    const prev = new Date(e.lastVoteDay);
    const diffDays = Math.round((new Date(t).getTime() - prev.getTime()) / 86400000);
    e.streak = diffDays === 1 ? e.streak + 1 : 1;
  } else {
    e.streak = 1;
  }
  e.lastVoteDay = t;
  e.todayDay = t;
  e.todayVerdicts += 1;
  e.totalVerdicts += 1;

  let milestone: string | null = null;
  if (e.totalVerdicts === 1) milestone = "First verdict — welcome to the revolution! 🎉";
  else if (e.totalVerdicts === 10) milestone = "10 verdicts! You're a certified brand critic. 🏅";
  else if (e.totalVerdicts === 50) milestone = "50 verdicts! Brands should be paying attention. 👑";
  else if (e.streak === 3) milestone = "3-day streak! Don't break the chain. 🔗";
  else if (e.streak === 7) milestone = "7-day streak! You're unstoppable. 🔥🔥🔥";

  try {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(e));
  } catch {
    /* ignore */
  }

  const reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
  return { engagement: e, reward, milestone };
}

export const ENGAGEMENT_EVENT = "sot:engagement";

export function emitEngagementChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ENGAGEMENT_EVENT));
  }
}
