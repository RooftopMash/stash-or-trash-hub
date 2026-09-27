import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, n as Button, o as useAuth, r as Input } from "./label-BlRLLIBM.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ct as Copy, D as ShieldAlert, E as ShieldCheck, G as MessageCircle, Gt as BadgeCheck, Jt as ArrowUp, K as Megaphone, M as Repeat2, O as Share, Ot as CircleQuestionMark, Qt as ArrowDown, Vt as Building2, i as X, k as Send, p as TriangleAlert, st as Heart } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { $ as castVote, A as Badge, At as triggerVerdictSuccess, D as Textarea, E as icon_bin_default, T as playTrashSound, b as Skeleton, et as deleteItem, it as removeVote, jt as icon_coin_default, kt as VerdictSuccess, w as playStashSound } from "./router-BjpvJuyR.mjs";
import { C as unlikeComment, D as userLikedPost, O as userReposted, T as unrepostItem, _ as likeComment, a as getComments, b as repostItem, f as getRepostCount, l as getPostLikeCount, n as deleteComment, t as createComment, v as likePost, w as unlikePost } from "./social-CSxIyKrD.mjs";
import { l as fetchManagedBrandIds, n as deleteBrandResponse, o as fetchBrandResponses, t as createBrandResponse } from "./brand-platform-DPuPdeC8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ItemCard-CHTXjOhv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "sot-engagement-v1";
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function empty() {
	return {
		streak: 0,
		lastVoteDay: null,
		totalVerdicts: 0,
		todayVerdicts: 0,
		todayDay: null
	};
}
function readEngagement() {
	if (typeof window === "undefined") return empty();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return empty();
		const e = {
			...empty(),
			...JSON.parse(raw)
		};
		if (e.todayDay !== today()) {
			e.todayVerdicts = 0;
			e.todayDay = today();
		}
		return e;
	} catch {
		return empty();
	}
}
var REWARDS = [
	"🔥 Verdict locked in!",
	"⚡ Your voice just moved the needle.",
	"💥 Boom — the brand felt that.",
	"👀 Brands are watching this.",
	"🎯 Nailed it. Keep the streak alive.",
	"🚀 You're shaping the verdict."
];
function recordVote() {
	const e = readEngagement();
	const t = today();
	if (e.lastVoteDay === t) {} else if (e.lastVoteDay) {
		const prev = new Date(e.lastVoteDay);
		e.streak = Math.round((new Date(t).getTime() - prev.getTime()) / 864e5) === 1 ? e.streak + 1 : 1;
	} else e.streak = 1;
	e.lastVoteDay = t;
	e.todayDay = t;
	e.todayVerdicts += 1;
	e.totalVerdicts += 1;
	let milestone = null;
	if (e.totalVerdicts === 1) milestone = "First verdict — welcome to the revolution! 🎉";
	else if (e.totalVerdicts === 10) milestone = "10 verdicts! You're a certified brand critic. 🏅";
	else if (e.totalVerdicts === 50) milestone = "50 verdicts! Brands should be paying attention. 👑";
	else if (e.streak === 3) milestone = "3-day streak! Don't break the chain. 🔗";
	else if (e.streak === 7) milestone = "7-day streak! You're unstoppable. 🔥🔥🔥";
	try {
		if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(e));
	} catch {}
	return {
		engagement: e,
		reward: REWARDS[Math.floor(Math.random() * REWARDS.length)],
		milestone
	};
}
var ENGAGEMENT_EVENT = "sot:engagement";
function emitEngagementChange() {
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(ENGAGEMENT_EVENT));
}
function ItemCardActions({ itemId, currentUserId, authorId, onCommentClick, onRefresh }) {
	const { t } = useTranslation();
	const [isLiking, setIsLiking] = (0, import_react.useState)(false);
	const [isReposting, setIsReposting] = (0, import_react.useState)(false);
	const { data: likeCount, refetch: refetchLikes } = useQuery({
		queryKey: ["item-like-count", itemId],
		queryFn: () => getPostLikeCount(itemId)
	});
	const { data: repostCount, refetch: refetchReposts } = useQuery({
		queryKey: ["item-repost-count", itemId],
		queryFn: () => getRepostCount(itemId)
	});
	const { data: userLiked, refetch: refetchUserLiked } = useQuery({
		queryKey: [
			"user-liked-post",
			itemId,
			currentUserId
		],
		queryFn: () => currentUserId ? userLikedPost(itemId, currentUserId) : false,
		enabled: !!currentUserId
	});
	const { data: userRepostedPost, refetch: refetchUserReposted } = useQuery({
		queryKey: [
			"user-reposted-post",
			itemId,
			currentUserId
		],
		queryFn: () => currentUserId ? userReposted(itemId, currentUserId) : false,
		enabled: !!currentUserId
	});
	const handleLike = async () => {
		if (!currentUserId) {
			toast.info(t("social.signInToLike"));
			return;
		}
		setIsLiking(true);
		try {
			if (userLiked) await unlikePost(itemId, currentUserId);
			else await likePost(itemId, currentUserId);
			await refetchLikes();
			await refetchUserLiked();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.likeError"));
		} finally {
			setIsLiking(false);
		}
	};
	const handleRepost = async () => {
		if (!currentUserId) {
			toast.info(t("social.signInToRepost"));
			return;
		}
		setIsReposting(true);
		try {
			if (userRepostedPost) await unrepostItem(itemId, currentUserId);
			else await repostItem(itemId, currentUserId);
			await refetchReposts();
			await refetchUserReposted();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.likeError"));
		} finally {
			setIsReposting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground border-t border-border pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onCommentClick,
				className: "flex-1 gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: t("social.comment")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleLike,
				disabled: isLiking,
				className: cn("flex-1 gap-1.5", userLiked && "text-trash hover:text-trash"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4", userLiked && "fill-current") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: likeCount ?? 0
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleRepost,
				disabled: isReposting,
				className: cn("flex-1 gap-1.5", userRepostedPost && "text-stash hover:text-stash"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat2, { className: cn("h-4 w-4", userRepostedPost && "fill-current") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: repostCount ?? 0
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => {
					navigator.clipboard?.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/items/${itemId}`);
					toast.success(t("social.linkCopied"));
				},
				className: "flex-1 gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: t("social.share")
				})]
			})
		]
	});
}
/**
* Renders post text with #hashtags linked to their tag page and @mentions
* highlighted.
*/
function PostText({ text, className, disableLinks = false }) {
	const nodes = text.split(/(#[A-Za-z0-9_]{2,40}|@[A-Za-z0-9_.]{2,40})/g).map((part, i) => {
		if (part.startsWith("#") && part.length > 1) {
			const tag = part.slice(1).toLowerCase();
			if (disableLinks) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-primary",
				children: part
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/hashtags/$tag",
				params: { tag },
				className: "font-semibold text-primary hover:underline",
				children: part
			}, i);
		}
		if (part.startsWith("@") && part.length > 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-primary",
			children: part
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: nodes
	});
}
function CommentThread({ itemId, currentUserId }) {
	const { t } = useTranslation();
	const [body, setBody] = (0, import_react.useState)("");
	const [isPosting, setIsPosting] = (0, import_react.useState)(false);
	const { data: comments, isLoading, refetch } = useQuery({
		queryKey: [
			"comments",
			itemId,
			currentUserId
		],
		queryFn: () => getComments(itemId, currentUserId)
	});
	const handlePostComment = async () => {
		if (!currentUserId || !body.trim()) return;
		setIsPosting(true);
		try {
			await createComment(itemId, currentUserId, body);
			setBody("");
			toast.success(t("social.commentPosted"));
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.commentError"));
		} finally {
			setIsPosting(false);
		}
	};
	const handleLikeComment = async (commentId, isLiked) => {
		if (!currentUserId) return;
		try {
			if (isLiked) await unlikeComment(commentId, currentUserId);
			else await likeComment(commentId, currentUserId);
			refetch();
		} catch (e) {
			toast.error(t("social.likeError"));
		}
	};
	const handleDeleteComment = async (commentId) => {
		try {
			await deleteComment(commentId);
			toast.success(t("social.commentDeleted"));
			refetch();
		} catch (e) {
			toast.error(t("social.deleteError"));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: t("social.addComment"),
				className: "text-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: handlePostComment,
				disabled: !body.trim() || isPosting,
				size: "sm",
				className: "gap-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-lg" }, i))
		}) : comments && comments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: comments.map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-secondary/50 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/users/$id",
							params: { id: comment.user_id },
							className: "text-sm font-semibold hover:underline",
							children: comment.authorName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: new Date(comment.created_at).toLocaleDateString()
						})] }), currentUserId === comment.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => handleDeleteComment(comment.id),
							className: "text-xs",
							children: t("social.delete")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostText, { text: comment.body })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => handleLikeComment(comment.id, comment.userLiked),
							className: cn("h-auto px-1 py-0.5 gap-0.5", comment.userLiked && "text-trash"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-3 w-3", comment.userLiked && "fill-current") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: comment.likeCount })]
						})
					})
				]
			}, comment.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-4 text-sm text-muted-foreground",
			children: t("social.noComments")
		})]
	});
}
function AuditBadge({ audit }) {
	if (audit.aiVerification) {
		const ai = audit.aiVerification;
		const isAuthentic = ai.isLegitimate && ai.score >= 70;
		const isAiGenerated = ai.verdictStatus === "ai_generated";
		let cls = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
		let Icon = ShieldCheck;
		if (isAiGenerated) {
			cls = "bg-rose-500/10 text-rose-600 border-rose-500/20";
			Icon = ShieldAlert;
		} else if (!isAuthentic) {
			cls = "bg-amber-500/10 text-amber-600 border-amber-500/20";
			Icon = TriangleAlert;
		}
		const titleText = [
			ai.badgeLabel,
			`Authenticity: ${ai.score}%`,
			ai.reasons?.slice(0, 2).join(". "),
			ai.flags?.join(". ")
		].filter(Boolean).join(" | ");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`,
			title: titleText,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold",
					children: [ai.score, "%"]
				}),
				" ",
				ai.badgeLabel || (isAuthentic ? "AI-Verified" : "Caution")
			]
		});
	}
	let label = "Media check passed";
	let cls = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
	let Icon = ShieldCheck;
	switch (audit.tier) {
		case "flagged":
			label = "Flagged by checks";
			cls = "bg-red-500/10 text-red-500 border-red-500/20";
			Icon = ShieldAlert;
			break;
		case "reused":
			label = "Possible reused media";
			cls = "bg-amber-500/10 text-amber-500 border-amber-500/20";
			Icon = Copy;
			break;
		case "clean":
			label = "Media check passed";
			cls = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
			Icon = ShieldCheck;
			break;
		default:
			label = "Media check inconclusive";
			cls = "bg-muted text-muted-foreground border-border";
			Icon = CircleQuestionMark;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`,
		title: audit.flags.join(". ") || audit.provenance.notes.join(". "),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }), label]
	});
}
/**
* Official brand replies on a post: publicly readable, written only by users
* with an analyst/admin role on that brand.
*/
function BrandResponses({ itemId, brandId }) {
	const { t } = useTranslation();
	const { user } = useAuth();
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: responses, refetch } = useQuery({
		queryKey: ["brand-responses", itemId],
		queryFn: () => fetchBrandResponses(itemId)
	});
	const { data: managed } = useQuery({
		queryKey: ["managed-brands", user?.id],
		queryFn: () => fetchManagedBrandIds(user.id),
		enabled: !!user && !!brandId
	});
	const canRespond = !!brandId && !!managed?.has(brandId);
	const list = responses ?? [];
	const submit = async () => {
		if (!user || !brandId) return;
		setBusy(true);
		try {
			await createBrandResponse({
				itemId,
				brandId,
				userId: user.id,
				body
			});
			setBody("");
			toast.success(t("brandTeam.responsePosted"));
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("brandTeam.responseFailed"));
		} finally {
			setBusy(false);
		}
	};
	const remove = async (id) => {
		try {
			await deleteBrandResponse(id);
			refetch();
		} catch {
			toast.error(t("brandTeam.responseFailed"));
		}
	};
	if (!list.length && !canRespond) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3",
		children: [list.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-primary/30 bg-primary/5 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-3.5 w-3.5" }),
							t("brandTeam.officialResponse", { brand: r.brandName ?? "" }),
							r.brandVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5" })
						]
					}), user?.id === r.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "h-auto px-1 py-0 text-xs",
						onClick: () => remove(r.id),
						children: t("social.delete")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostText, { text: r.body })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[11px] text-muted-foreground",
					children: [
						r.authorName,
						" · ",
						new Date(r.created_at).toLocaleString()
					]
				})
			]
		}, r.id)), canRespond && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-dashed border-primary/40 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-primary",
					children: t("brandTeam.respondAsBrand")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: t("brandTeam.responsePlaceholder"),
					className: "mt-2 text-sm",
					rows: 3
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "mt-2",
					disabled: busy || !body.trim(),
					onClick: submit,
					children: busy ? t("common.loading") : t("brandTeam.postResponse")
				})
			]
		})]
	});
}
function ItemCard({ item, onChange, defaultCommentsOpen = false, brandTrustScore, sentimentTrend }) {
	const { user } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [commentsOpen, setCommentsOpen] = (0, import_react.useState)(defaultCommentsOpen);
	const [stashCelebration, setStashCelebration] = (0, import_react.useState)(false);
	const total = item.stashCount + item.trashCount;
	const stashPct = total === 0 ? 50 : Math.round(item.stashCount / total * 100);
	const resolvedTrust = typeof brandTrustScore === "number" ? brandTrustScore : typeof item.brandTrustScore === "number" ? item.brandTrustScore : total > 0 ? stashPct : null;
	const resolvedTrend = sentimentTrend ?? (item.stashCount !== item.trashCount ? item.stashCount > item.trashCount ? "up" : "down" : (resolvedTrust ?? 50) >= 60 ? "up" : "down");
	const vote = async (verdict) => {
		if (verdict === "stash" && item.myVerdict !== "stash") {
			setStashCelebration(true);
			triggerVerdictSuccess({
				label: "STASHED!",
				sublabel: item.brandName ? `${item.brandName} · Keep what serves you` : "Keep what serves you · Gold standard verdict recorded"
			});
		}
		if (!user) {
			toast.info(t("vote.signInPrompt"));
			navigate({ to: "/auth" });
			return;
		}
		setBusy(true);
		try {
			if (item.myVerdict === verdict) await removeVote(item.id, user.id);
			else {
				await castVote(item.id, user.id, verdict);
				const { reward, milestone } = recordVote();
				emitEngagementChange();
				toast.success(milestone ?? reward);
			}
			onChange();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("vote.voteFailed"));
		} finally {
			setBusy(false);
		}
	};
	const handleDelete = async () => {
		setBusy(true);
		try {
			await deleteItem(item.id);
			toast.success(t("vote.deleted"));
			onChange();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("vote.deleteFailed"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "relative overflow-hidden rounded-2xl border border-border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSuccess, {
				active: stashCelebration,
				onComplete: () => setStashCelebration(false),
				inline: true,
				label: "STASHED!",
				sublabel: "Keep what serves you · Gold standard"
			}),
			item.signedImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/items/$id",
				params: { id: item.id },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.signedImageUrl,
					alt: item.title,
					className: "aspect-video w-full object-cover",
					loading: "lazy"
				})
			}) : item.brandLogoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/items/$id",
				params: { id: item.id },
				className: "flex aspect-video w-full items-center justify-center bg-secondary/40 p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.brandLogoUrl,
					alt: item.brandName ?? "",
					className: "max-h-full max-w-[60%] object-contain",
					loading: "lazy"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							(item.brandName || item.category) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex flex-wrap items-center gap-2",
								children: [
									item.brandName && item.brandSlug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/brands/$slug",
										params: { slug: item.brandSlug },
										className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.brandName }), resolvedTrust !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											title: resolvedTrend === "up" ? `${resolvedTrust}% trust score · Sentiment trending positively` : `${resolvedTrust}% trust score · Sentiment trending negatively`,
											"aria-label": resolvedTrend === "up" ? `Trust score ${resolvedTrust} percent, trending positively` : `Trust score ${resolvedTrust} percent, trending negatively`,
											className: cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none no-underline", resolvedTrend === "up" ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [resolvedTrust, "%"] }), resolvedTrend === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
												className: "h-2.5 w-2.5 stroke-[2.75]",
												"aria-hidden": "true"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
												className: "h-2.5 w-2.5 stroke-[2.75]",
												"aria-hidden": "true"
											})]
										})]
									}),
									item.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: item.category
									}),
									item.audit?.brandInfo?.brandOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Owner: ", item.audit.brandInfo.brandOwner] })]
									}),
									item.audit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditBadge, { audit: item.audit })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-bold leading-tight",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/items/$id",
									params: { id: item.id },
									className: "hover:underline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostText, {
										text: item.title,
										disableLinks: true
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/users/$id",
								params: { id: item.user_id },
								className: "mt-0.5 block text-xs text-muted-foreground hover:underline",
								children: t("vote.by", { name: item.authorName })
							})
						] }), user?.id === item.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDelete,
							disabled: busy,
							className: "text-muted-foreground transition-colors hover:text-trash",
							"aria-label": t("vote.deletePost"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostText, { text: item.description })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-2.5 overflow-hidden rounded-full bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-stash",
								style: { width: `${stashPct}%` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-trash",
								style: { width: `${100 - stashPct}%` }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex justify-between text-xs font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-stash",
									children: t("vote.stashCount", { count: item.stashCount })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: total === 0 ? t("vote.noVotes") : t("vote.stashPct", { pct: stashPct })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-trash",
									children: t("vote.trashCount", { count: item.trashCount })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "stash",
							size: "lg",
							disabled: busy,
							onClick: () => {
								playStashSound();
								vote("stash");
							},
							className: cn("gap-2", item.myVerdict === "stash" && "verdict-picked", item.myVerdict === "trash" && "verdict-dimmed"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: icon_coin_default,
									alt: "",
									"aria-hidden": true,
									className: "verdict-icon"
								}),
								" ",
								t("vote.stash")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "trash",
							size: "lg",
							disabled: busy,
							onClick: () => {
								playTrashSound();
								vote("trash");
							},
							className: cn("gap-2", item.myVerdict === "trash" && "verdict-picked", item.myVerdict === "stash" && "verdict-dimmed"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: icon_bin_default,
									alt: "",
									"aria-hidden": true,
									className: "verdict-icon"
								}),
								" ",
								t("vote.trash")
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandResponses, {
						itemId: item.id,
						brandId: item.brand_id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCardActions, {
							itemId: item.id,
							currentUserId: user?.id,
							authorId: item.user_id,
							onCommentClick: () => setCommentsOpen((v) => !v)
						})
					}),
					commentsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 border-t border-border pt-4",
						children: [!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: t("social.signInToComment")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentThread, {
							itemId: item.id,
							currentUserId: user?.id
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { emitEngagementChange as n, recordVote as r, ItemCard as t };
