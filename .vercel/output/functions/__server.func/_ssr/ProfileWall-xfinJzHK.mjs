import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, n as Button, o as useAuth } from "./label-BlRLLIBM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as ShieldCheck, It as Check, Wt as Ban, Y as LockKeyhole, g as Trash2, gt as FileCheckCorner, k as Send, p as TriangleAlert, pt as Flag, vt as Eye } from "../_libs/lucide-react.mjs";
import { D as Textarea, Ot as supabase } from "./router-BjpvJuyR.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProfileWall-xfinJzHK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-5 w-5 text-stash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-bold",
					children: "Release safety & privacy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Your consent, reports, blocks, and deletion requests are stored with owner-only access controls."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/terms",
						className: "rounded-xl border border-border p-3 text-sm hover:border-stash",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "mb-2 h-4 w-4 text-stash" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Terms" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: ["Version ", TERMS_VERSION]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/privacy",
						className: "rounded-xl border border-border p-3 text-sm hover:border-stash",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mb-2 h-4 w-4 text-stash" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privacy" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: ["Version ", PRIVACY_VERSION]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-destructive/30 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mb-2 h-4 w-4 text-destructive" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Delete account" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								size: "sm",
								className: "mt-2 w-full",
								onClick: requestDeletion,
								disabled: deleting,
								children: deleting ? "Submitting…" : "Request deletion"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					id: "release-consent",
					checked: accepted,
					onCheckedChange: (value) => setAccepted(value === true)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "release-consent",
					className: "text-xs leading-5 text-muted-foreground",
					children: "I have read and accept the current Terms and Privacy Policy. I understand that public submissions may be reviewed for safety, authenticity, and policy compliance."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				size: "sm",
				onClick: saveConsent,
				disabled: !accepted || saving,
				children: saving ? "Saving…" : "Record consent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-3.5 w-3.5" }), " Report harmful content"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), " Block unwanted contact"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Human appeal review"]
					})
				]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-5 overflow-hidden rounded-2xl border border-stash/25 bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-stash/15 bg-stash/5 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-extrabold uppercase tracking-[0.18em] text-stash",
					children: "Public wall"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-xl font-extrabold",
					children: "Experiences, ideas and innovations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: "A direct channel to brands. Your public record stays visible for CX, PR, and accountability."
				}),
				isOwner && user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							"aria-label": "Post type",
							children: types.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: postType === type.value ? "default" : "outline",
								onClick: () => setPostType(type.value),
								children: type.label
							}, type.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: body,
							onChange: (event) => setBody(event.target.value),
							maxLength: 5e3,
							placeholder: "Share an experience, idea, concept, invention, or innovation directly with brands...",
							"aria-label": "Wall post"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: publish,
								disabled: submitting || !body.trim(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), submitting ? "Publishing..." : "Publish to wall"]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 border-t border-stash/15 pt-4 text-xs text-muted-foreground sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-stash" }), " Public accountability"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 text-trash" }), " Direct to brands"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-4 w-4" }), " Secure data trail"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-5 text-sm text-muted-foreground",
				children: "Loading wall..."
			}) : query.data?.length ? query.data.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold uppercase tracking-wider text-stash",
							children: post.post_type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
							className: "text-xs text-muted-foreground",
							dateTime: post.created_at,
							children: post.created_at.slice(0, 10)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground",
						children: post.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-xs text-muted-foreground",
							onClick: async () => {
								if (!user) return;
								if ((await reportUGC(user.id, "wall_post", post.id, "community report")).error) toast.error("Could not submit report");
								else toast.success("Report submitted for review");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "mr-1.5 h-3.5 w-3.5" }), " Report"]
						})
					})
				]
			}, post.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-5 text-sm text-muted-foreground",
				children: "No public posts yet. This wall is ready for the first experience or idea."
			})
		})]
	});
}
//#endregion
export { ReleaseSafetyControls as n, ProfileWall as t };
