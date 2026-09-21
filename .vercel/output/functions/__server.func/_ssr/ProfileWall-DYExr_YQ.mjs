import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { Ct as Ban, I as LockKeyhole, Q as FileCheckCorner, X as Flag, _t as Check, d as Trash2, et as Eye, l as TriangleAlert, v as ShieldCheck, x as Send } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-I-3x-i8y.mjs";
import { i as cn, t as Button } from "./label-1cB10GDW.mjs";
import { u as Textarea } from "./Header-E8juhbIs.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProfileWall-DYExr_YQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var wallTable = () => supabase.from("profile_wall_posts");
async function fetchProfileWallPosts(authorId) {
	const { data, error } = await wallTable().select("id, author_id, body, post_type, status, created_at").eq("author_id", authorId).eq("status", "published").order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function createProfileWallPost(input) {
	const { error } = await wallTable().insert({
		author_id: input.authorId,
		body: input.body.trim(),
		post_type: input.postType,
		status: "published"
	});
	if (error) throw error;
}
var _jsxFileName$2 = "/app/applet/src/components/ui/checkbox.tsx";
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 20,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 19,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 11,
	columnNumber: 3
}, void 0));
Checkbox.displayName = Checkbox$1.displayName;
var _jsxFileName$1 = "/app/applet/src/components/ReleaseSafetyControls.tsx";
var TERMS_VERSION = "2026-09-11";
var PRIVACY_VERSION = "2026-09-11";
function ReleaseSafetyControls({ userId }) {
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function saveConsent() {
		if (!accepted) return;
		setSaving(true);
		const { error } = await supabase.from("user_consents").upsert({
			user_id: userId,
			terms_version: TERMS_VERSION,
			privacy_version: PRIVACY_VERSION,
			marketing_opt_in: false
		});
		setSaving(false);
		if (error) toast.error("Consent could not be saved");
		else toast.success("Consent recorded securely");
	}
	async function requestDeletion() {
		if (!window.confirm("Request permanent account deletion? This cannot be undone.")) return;
		setDeleting(true);
		const { error } = await supabase.from("account_deletion_requests").upsert({
			user_id: userId,
			status: "requested"
		});
		setDeleting(false);
		if (error) toast.error("Deletion request could not be submitted");
		else toast.success("Deletion request submitted for processing");
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "mt-0.5 h-5 w-5 text-stash" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 44,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "font-display text-lg font-bold",
					children: "Release safety & privacy"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 46,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Your consent, reports, blocks, and deletion requests are stored with owner-only access controls."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 47,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 45,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 43,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/terms",
						className: "rounded-xl border border-border p-3 text-sm hover:border-stash",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileCheckCorner, { className: "mb-2 h-4 w-4 text-stash" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 55,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Terms" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 56,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: ["Version ", TERMS_VERSION]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 57,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 54,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/privacy",
						className: "rounded-xl border border-border p-3 text-sm hover:border-stash",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "mb-2 h-4 w-4 text-stash" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 63,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Privacy" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 64,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: ["Version ", PRIVACY_VERSION]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 65,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 59,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl border border-destructive/30 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "mb-2 h-4 w-4 text-destructive" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 70,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Delete account" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 71,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "destructive",
								size: "sm",
								className: "mt-2 w-full",
								onClick: requestDeletion,
								disabled: deleting,
								children: deleting ? "Submitting…" : "Request deletion"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 72,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 69,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 53,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 flex items-start gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
					id: "release-consent",
					checked: accepted,
					onCheckedChange: (value) => setAccepted(value === true)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 84,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					htmlFor: "release-consent",
					className: "text-xs leading-5 text-muted-foreground",
					children: "I have read and accept the current Terms and Privacy Policy. I understand that public submissions may be reviewed for safety, authenticity, and policy compliance."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 89,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 83,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				className: "mt-3",
				size: "sm",
				onClick: saveConsent,
				disabled: !accepted || saving,
				children: saving ? "Saving…" : "Record consent"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 94,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 99,
							columnNumber: 11
						}, this), " Report harmful content"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 98,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ban, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 102,
							columnNumber: 11
						}, this), " Block unwanted contact"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 101,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 105,
							columnNumber: 11
						}, this), " Human appeal review"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 104,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 97,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 42,
		columnNumber: 5
	}, this);
}
async function reportUGC(reporterId, targetType, targetId, reason, details) {
	return supabase.from("ugc_reports").insert({
		reporter_id: reporterId,
		target_type: targetType,
		target_id: targetId,
		reason,
		details
	});
}
objectType({
	assetType: enumType([
		"photo",
		"video",
		"product",
		"text"
	]),
	content: stringType().trim().min(1).max(5e4),
	assetUrl: stringType().url().optional()
});
var publishReviewResponseSchema = objectType({
	reviewId: stringType().uuid(),
	decision: enumType([
		"approved",
		"needs_review",
		"blocked"
	]),
	riskScore: numberType().min(0).max(1),
	findings: arrayType(stringType())
});
async function reviewBeforePublish(request) {
	const { data, error } = await supabase.functions.invoke("review-before-publish", { body: request });
	if (error) return {
		data: null,
		error
	};
	const parsed = publishReviewResponseSchema.safeParse(data);
	if (!parsed.success) return {
		data: null,
		error: /* @__PURE__ */ new Error("The moderation service returned an invalid decision")
	};
	return {
		data: parsed.data,
		error: null
	};
}
var _jsxFileName = "/app/applet/src/components/ProfileWall.tsx";
var types = [
	{
		value: "experience",
		label: "Experience"
	},
	{
		value: "idea",
		label: "Idea"
	},
	{
		value: "concept",
		label: "Concept"
	},
	{
		value: "invention",
		label: "Invention"
	},
	{
		value: "innovation",
		label: "Innovation"
	}
];
function ProfileWall({ profileId, isOwner }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [body, setBody] = (0, import_react.useState)("");
	const [postType, setPostType] = (0, import_react.useState)("experience");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const query = useQuery({
		queryKey: ["profile-wall", profileId],
		queryFn: () => fetchProfileWallPosts(profileId)
	});
	const publish = async () => {
		if (!user || !body.trim()) return;
		setSubmitting(true);
		try {
			const review = await reviewBeforePublish({
				assetType: "text",
				content: body.trim()
			});
			if (review.error) throw new Error("Your post could not be reviewed. Please try again when the safety service is available.");
			if (review.data.decision !== "approved") throw new Error(review.data.decision === "blocked" ? "This post cannot be published because it failed the safety review." : "This post needs human review before it can be published.");
			await createProfileWallPost({
				authorId: user.id,
				body,
				postType
			});
			setBody("");
			await queryClient.invalidateQueries({ queryKey: ["profile-wall", profileId] });
			toast.success("Published to your public wall");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not publish your post");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-5 overflow-hidden rounded-2xl border border-stash/25 bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "border-b border-stash/15 bg-stash/5 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs font-extrabold uppercase tracking-[0.18em] text-stash",
					children: "Public wall"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 65,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-1 font-display text-xl font-extrabold",
					children: "Experiences, ideas and innovations"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: "A direct channel to brands. Your public record stays visible for CX, PR, and accountability."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 9
				}, this),
				isOwner && user && /* @__PURE__ */ (void 0)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap gap-2",
							"aria-label": "Post type",
							children: types.map((type) => /* @__PURE__ */ (void 0)(Button, {
								type: "button",
								size: "sm",
								variant: postType === type.value ? "default" : "outline",
								onClick: () => setPostType(type.value),
								children: type.label
							}, type.value, false, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 75,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)(Textarea, {
							value: body,
							onChange: (event) => setBody(event.target.value),
							maxLength: 5e3,
							placeholder: "Share an experience, idea, concept, invention, or innovation directly with brands...",
							"aria-label": "Wall post"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (void 0)(Button, {
								onClick: publish,
								disabled: submitting || !body.trim(),
								children: [/* @__PURE__ */ (void 0)(Send, { className: "mr-2 h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 97,
									columnNumber: 17
								}, this), submitting ? "Publishing..." : "Publish to wall"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 95,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-4 grid gap-2 border-t border-stash/15 pt-4 text-xs text-muted-foreground sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-4 w-4 text-stash" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 13
							}, this), " Public accountability"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 104,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4 text-trash" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 13
							}, this), " Direct to brands"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LockKeyhole, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 13
							}, this), " Secure data trail"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 64,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "divide-y divide-border",
			children: query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "p-5 text-sm text-muted-foreground",
				children: "Loading wall..."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 117,
				columnNumber: 11
			}, this) : query.data?.length ? query.data.map((post) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs font-extrabold uppercase tracking-wider text-stash",
							children: post.post_type
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("time", {
							className: "text-xs text-muted-foreground",
							dateTime: post.created_at,
							children: post.created_at.slice(0, 10)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground",
						children: post.body
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-xs text-muted-foreground",
							onClick: async () => {
								if (!user) return;
								if ((await reportUGC(user.id, "wall_post", post.id, "community report")).error) toast.error("Could not submit report");
								else toast.success("Report submitted for review");
							},
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { className: "mr-1.5 h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 149,
								columnNumber: 19
							}, this), " Report"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 133,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 15
					}, this)
				]
			}, post.id, true, {
				fileName: _jsxFileName,
				lineNumber: 120,
				columnNumber: 13
			}, this)) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "p-5 text-sm text-muted-foreground",
				children: "No public posts yet. This wall is ready for the first experience or idea."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 155,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 115,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 63,
		columnNumber: 5
	}, this);
}
//#endregion
export { ReleaseSafetyControls as n, ProfileWall as t };
