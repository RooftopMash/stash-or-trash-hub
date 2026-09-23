import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as Repeat2, G as Heart, M as MessageCircle, N as Megaphone, at as Copy, b as Share, n as X, ut as CircleQuestionMark, v as ShieldCheck, wt as BadgeCheck, x as Send, y as ShieldAlert } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-Ymvu7mB_.mjs";
import { i as cn, n as Input, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { A as playTrashSound, D as icon_coin_default, E as icon_bin_default, M as removeVote, f as castVote, k as playStashSound, m as deleteItem, u as Textarea } from "./Header-BKSLqlsv.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { C as unlikeComment, D as userLikedPost, O as userReposted, T as unrepostItem, _ as likeComment, a as getComments, b as repostItem, f as getRepostCount, l as getPostLikeCount, n as deleteComment, t as createComment, v as likePost, w as unlikePost } from "./social-CNdxEfFV.mjs";
import { a as fetchBrandResponses, c as fetchManagedBrandIds, n as deleteBrandResponse, t as createBrandResponse } from "./brand-platform-BZ3sz846.mjs";
import { t as Badge } from "./badge-DAskHgZn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ItemCard-mRZy7nQp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
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
var _jsxFileName$5 = "/app/applet/src/components/ItemCardActions.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground border-t border-border pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onCommentClick,
				className: "flex-1 gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 106,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden sm:inline",
					children: t("social.comment")
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 107,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 105,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleLike,
				disabled: isLiking,
				className: cn("flex-1 gap-1.5", userLiked && "text-trash hover:text-trash"),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: cn("h-4 w-4", userLiked && "fill-current") }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 118,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden sm:inline",
					children: likeCount ?? 0
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 119,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 111,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleRepost,
				disabled: isReposting,
				className: cn("flex-1 gap-1.5", userRepostedPost && "text-stash hover:text-stash"),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Repeat2, { className: cn("h-4 w-4", userRepostedPost && "fill-current") }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 130,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden sm:inline",
					children: repostCount ?? 0
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 131,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 123,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => {
					navigator.clipboard?.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/items/${itemId}`);
					toast.success(t("social.linkCopied"));
				},
				className: "flex-1 gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 146,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden sm:inline",
					children: t("social.share")
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 147,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 135,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 103,
		columnNumber: 5
	}, this);
}
var _jsxFileName$4 = "/app/applet/src/components/PostText.tsx";
/**
* Renders post text with #hashtags linked to their tag page and @mentions
* highlighted.
*/
function PostText({ text, className, disableLinks = false }) {
	const nodes = text.split(/(#[A-Za-z0-9_]{2,40}|@[A-Za-z0-9_.]{2,40})/g).map((part, i) => {
		if (part.startsWith("#") && part.length > 1) {
			const tag = part.slice(1).toLowerCase();
			if (disableLinks) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-semibold text-primary",
				children: part
			}, i, false, {
				fileName: _jsxFileName$4,
				lineNumber: 23,
				columnNumber: 11
			}, this);
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/hashtags/$tag",
				params: { tag },
				className: "font-semibold text-primary hover:underline",
				children: part
			}, i, false, {
				fileName: _jsxFileName$4,
				lineNumber: 29,
				columnNumber: 9
			}, this);
		}
		if (part.startsWith("@") && part.length > 1) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "font-semibold text-primary",
			children: part
		}, i, false, {
			fileName: _jsxFileName$4,
			lineNumber: 41,
			columnNumber: 9
		}, this);
		return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: part }, i, false, {
			fileName: _jsxFileName$4,
			lineNumber: 46,
			columnNumber: 12
		}, this);
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className,
		children: nodes
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 49,
		columnNumber: 10
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/CommentThread.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		children: [currentUserId && /* @__PURE__ */ (void 0)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (void 0)(Input, {
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: t("social.addComment"),
				className: "text-sm"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 83,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)(Button, {
				onClick: handlePostComment,
				disabled: !body.trim() || isPosting,
				size: "sm",
				className: "gap-1",
				children: /* @__PURE__ */ (void 0)(Send, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 95,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 89,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 82,
			columnNumber: 9
		}, this), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-2",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-12 w-full rounded-lg" }, i, false, {
				fileName: _jsxFileName$3,
				lineNumber: 104,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 102,
			columnNumber: 9
		}, this) : comments && comments.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-3",
			children: comments.map((comment) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-lg bg-secondary/50 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/users/$id",
							params: { id: comment.user_id },
							className: "text-sm font-semibold hover:underline",
							children: comment.authorName
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 114,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: new Date(comment.created_at).toLocaleDateString()
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 121,
							columnNumber: 19
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 113,
							columnNumber: 17
						}, this), currentUserId === comment.user_id && /* @__PURE__ */ (void 0)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => handleDeleteComment(comment.id),
							className: "text-xs",
							children: t("social.delete")
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 126,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 112,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PostText, { text: comment.body }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 139,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 138,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => handleLikeComment(comment.id, comment.userLiked),
							className: cn("h-auto px-1 py-0.5 gap-0.5", comment.userLiked && "text-trash"),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: cn("h-3 w-3", comment.userLiked && "fill-current") }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 150,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: comment.likeCount }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 151,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 144,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 143,
						columnNumber: 15
					}, this)
				]
			}, comment.id, true, {
				fileName: _jsxFileName$3,
				lineNumber: 110,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 108,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center py-4 text-sm text-muted-foreground",
			children: t("social.noComments")
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 158,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 79,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/AuditBadge.tsx";
function tierConfig(audit) {
	switch (audit.tier) {
		case "flagged": return {
			label: "Flagged by checks",
			cls: "bg-red-500/10 text-red-500 border-red-500/20",
			Icon: ShieldAlert
		};
		case "reused": return {
			label: "Possible reused media",
			cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
			Icon: Copy
		};
		case "clean": return {
			label: "Media check passed",
			cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
			Icon: ShieldCheck
		};
		default: return {
			label: "Media check inconclusive",
			cls: "bg-muted text-muted-foreground border-border",
			Icon: CircleQuestionMark
		};
	}
}
function AuditBadge({ audit }) {
	const { label, cls, Icon } = tierConfig(audit);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold " + cls,
		title: audit.flags.join(". ") || audit.provenance.notes.join(". "),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-3 w-3" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 43,
			columnNumber: 7
		}, this), label]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 36,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/BrandResponses.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mt-4 space-y-3",
		children: [list.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "rounded-xl border border-primary/30 bg-primary/5 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 73,
								columnNumber: 15
							}, this),
							t("brandTeam.officialResponse", { brand: r.brandName ?? "" }),
							r.brandVerified && /* @__PURE__ */ (void 0)(BadgeCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 75,
								columnNumber: 35
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 72,
						columnNumber: 13
					}, this), user?.id === r.user_id && /* @__PURE__ */ (void 0)(Button, {
						variant: "ghost",
						size: "sm",
						className: "h-auto px-1 py-0 text-xs",
						onClick: () => remove(r.id),
						children: t("social.delete")
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 78,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 71,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1.5 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PostText, { text: r.body }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 89,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 88,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-[11px] text-muted-foreground",
					children: [
						r.authorName,
						" · ",
						new Date(r.created_at).toLocaleString()
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 91,
					columnNumber: 11
				}, this)
			]
		}, r.id, true, {
			fileName: _jsxFileName$1,
			lineNumber: 70,
			columnNumber: 9
		}, this)), canRespond && /* @__PURE__ */ (void 0)("div", {
			className: "rounded-xl border border-dashed border-primary/40 p-3",
			children: [
				/* @__PURE__ */ (void 0)("p", {
					className: "text-xs font-semibold text-primary",
					children: t("brandTeam.respondAsBrand")
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 99,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (void 0)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: t("brandTeam.responsePlaceholder"),
					className: "mt-2 text-sm",
					rows: 3
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 100,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (void 0)(Button, {
					size: "sm",
					className: "mt-2",
					disabled: busy || !body.trim(),
					onClick: submit,
					children: busy ? t("common.loading") : t("brandTeam.postResponse")
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 107,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 98,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 68,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/ItemCard.tsx";
function ItemCard({ item, onChange, defaultCommentsOpen = false }) {
	const { user } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [commentsOpen, setCommentsOpen] = (0, import_react.useState)(defaultCommentsOpen);
	const total = item.stashCount + item.trashCount;
	const stashPct = total === 0 ? 50 : Math.round(item.stashCount / total * 100);
	const vote = async (verdict) => {
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
		className: "overflow-hidden rounded-2xl border border-border bg-card",
		children: [item.signedImageUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
			to: "/items/$id",
			params: { id: item.id },
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: item.signedImageUrl,
				alt: item.title,
				className: "aspect-video w-full object-cover",
				loading: "lazy"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 80,
			columnNumber: 9
		}, this) : item.brandLogoUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
			to: "/items/$id",
			params: { id: item.id },
			className: "flex aspect-video w-full items-center justify-center bg-secondary/40 p-8",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: item.brandLogoUrl,
				alt: item.brandName ?? "",
				className: "max-h-full max-w-[60%] object-contain",
				loading: "lazy"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 94,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 89,
			columnNumber: 9
		}, this) : null, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						(item.brandName || item.category) && /* @__PURE__ */ (void 0)("div", {
							className: "mb-1 flex flex-wrap items-center gap-2",
							children: [
								item.brandName && item.brandSlug && /* @__PURE__ */ (void 0)(Link, {
									to: "/brands/$slug",
									params: { slug: item.brandSlug },
									className: "text-xs font-semibold text-primary hover:underline",
									children: item.brandName
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 109,
									columnNumber: 19
								}, this),
								item.category && /* @__PURE__ */ (void 0)(Badge, {
									variant: "secondary",
									className: "text-[10px]",
									children: item.category
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 118,
									columnNumber: 19
								}, this),
								item.audit && /* @__PURE__ */ (void 0)(AuditBadge, { audit: item.audit }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 122,
									columnNumber: 32
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-display text-xl font-bold leading-tight",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/items/$id",
								params: { id: item.id },
								className: "hover:underline",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PostText, {
									text: item.title,
									disableLinks: true
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 127,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/users/$id",
							params: { id: item.user_id },
							className: "mt-0.5 block text-xs text-muted-foreground hover:underline",
							children: t("vote.by", { name: item.authorName })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 11
					}, this), user?.id === item.user_id && /* @__PURE__ */ (void 0)("button", {
						onClick: handleDelete,
						disabled: busy,
						className: "text-muted-foreground transition-colors hover:text-trash",
						"aria-label": t("vote.deletePost"),
						children: /* @__PURE__ */ (void 0)(X, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 139,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 104,
					columnNumber: 9
				}, this),
				item.description && /* @__PURE__ */ (void 0)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: /* @__PURE__ */ (void 0)(PostText, { text: item.description }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 151,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-2.5 overflow-hidden rounded-full bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-stash",
							style: { width: `${stashPct}%` }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-trash",
							style: { width: `${100 - stashPct}%` }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 160,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 158,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-1.5 flex justify-between text-xs font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-stash",
								children: t("vote.stashCount", { count: item.stashCount })
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 163,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground",
								children: total === 0 ? t("vote.noVotes") : t("vote.stashPct", { pct: stashPct })
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 164,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-trash",
								children: t("vote.trashCount", { count: item.trashCount })
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 167,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 162,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 157,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-4 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "stash",
						size: "lg",
						disabled: busy,
						onClick: () => {
							playStashSound();
							vote("stash");
						},
						className: cn("gap-2", item.myVerdict === "stash" && "verdict-picked", item.myVerdict === "trash" && "verdict-dimmed"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: icon_coin_default,
								alt: "",
								"aria-hidden": true,
								className: "verdict-icon"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 186,
								columnNumber: 13
							}, this),
							" ",
							t("vote.stash")
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 172,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "trash",
						size: "lg",
						disabled: busy,
						onClick: () => {
							playTrashSound();
							vote("trash");
						},
						className: cn("gap-2", item.myVerdict === "trash" && "verdict-picked", item.myVerdict === "stash" && "verdict-dimmed"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: icon_bin_default,
								alt: "",
								"aria-hidden": true,
								className: "verdict-icon"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 202,
								columnNumber: 13
							}, this),
							" ",
							t("vote.trash")
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 171,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandResponses, {
					itemId: item.id,
					brandId: item.brand_id
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 206,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemCardActions, {
						itemId: item.id,
						currentUserId: user?.id,
						authorId: item.user_id,
						onCommentClick: () => setCommentsOpen((v) => !v)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 209,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 208,
					columnNumber: 9
				}, this),
				commentsOpen && /* @__PURE__ */ (void 0)("div", {
					className: "mt-4 border-t border-border pt-4",
					children: [!user && /* @__PURE__ */ (void 0)("p", {
						className: "mb-3 text-sm text-muted-foreground",
						children: t("social.signInToComment")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 220,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(CommentThread, {
						itemId: item.id,
						currentUserId: user?.id
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 222,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 218,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 78,
		columnNumber: 5
	}, this);
}
//#endregion
export { emitEngagementChange as n, recordVote as r, ItemCard as t };
