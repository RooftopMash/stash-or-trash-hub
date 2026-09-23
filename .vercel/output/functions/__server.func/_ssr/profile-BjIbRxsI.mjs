import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as Facebook, B as Link2, O as Pencil, Z as FileText, a as Users, m as ThumbsDown, o as UserPlus, p as ThumbsUp, s as Unlink2, t as Youtube, tt as ExternalLink, v as ShieldCheck, z as Linkedin } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-Ymvu7mB_.mjs";
import { n as Input, r as Label, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { a as DialogHeader, c as Header, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog, u as Textarea } from "./Header-BKSLqlsv.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { E as updateMyProfile, d as getPublicProfile, o as getFollowerCount, u as getProfileStats } from "./social-CNdxEfFV.mjs";
import { n as ReleaseSafetyControls, t as ProfileWall } from "./ProfileWall-Db1XL_tq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BjIbRxsI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/components/EditProfileDialog.tsx";
function EditProfileDialog({ userId, displayName, bio, avatarUrl, onSaved }) {
	const { t } = useTranslation();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(displayName);
	const [about, setAbout] = (0, import_react.useState)(bio ?? "");
	const [avatar, setAvatar] = (0, import_react.useState)(avatarUrl ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const save = async () => {
		setBusy(true);
		try {
			await updateMyProfile({
				userId,
				display_name: name,
				bio: about,
				avatar_url: avatar
			});
			toast.success(t("social.profileSaved"));
			setOpen(false);
			onSaved();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.profileSaveFailed"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				size: "sm",
				variant: "outline",
				className: "gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 58,
						columnNumber: 11
					}, this),
					" ",
					t("social.editProfile")
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 57,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 56,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: t("social.editProfile") }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 63,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: t("social.bioPh") }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 64,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 62,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "profile-name",
							children: t("social.displayName")
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 68,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "profile-name",
							value: name,
							maxLength: 60,
							onChange: (e) => setName(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 69,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 67,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "profile-bio",
							children: t("social.bio")
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 77,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							id: "profile-bio",
							value: about,
							maxLength: 280,
							placeholder: t("social.bioPh"),
							onChange: (e) => setAbout(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 78,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 76,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "profile-avatar",
							children: t("social.avatarUrl")
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 87,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "profile-avatar",
							value: avatar,
							placeholder: "https://…",
							onChange: (e) => setAvatar(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 88,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 86,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 66,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				onClick: save,
				disabled: busy,
				children: busy ? t("social.saving") : t("social.save")
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 97,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 96,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 61,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 55,
		columnNumber: 5
	}, this);
}
async function getSocialConnections(userId) {
	const { data, error } = await supabase.from("social_connections").select("id, provider, status, display_name, scopes, last_synced_at").eq("user_id", userId).order("provider");
	if (error) throw error;
	return data ?? [];
}
async function prepareSocialConnection(userId, provider) {
	const { error } = await supabase.from("social_connections").upsert({
		user_id: userId,
		provider,
		status: "pending"
	}, { onConflict: "user_id,provider" });
	if (error) throw error;
}
async function disconnectSocialConnection(userId, provider) {
	const { error } = await supabase.from("social_connections").update({
		status: "revoked",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("user_id", userId).eq("provider", provider);
	if (error) throw error;
}
var _jsxFileName$1 = "/app/applet/src/components/SocialConnectionsPanel.tsx";
var providers = [
	{
		id: "facebook",
		label: "Facebook",
		description: "Verify public activity and Pages you manage.",
		icon: Facebook
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		description: "Verify professional identity and company activity.",
		icon: Linkedin
	},
	{
		id: "youtube",
		label: "YouTube",
		description: "Verify channels and public video activity.",
		icon: Youtube
	}
];
function SocialConnectionsPanel({ userId }) {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["social-connections", userId],
		queryFn: () => getSocialConnections(userId)
	});
	const connect = useMutation({
		mutationFn: (provider) => prepareSocialConnection(userId, provider),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["social-connections", userId] });
			toast.success("Connection request saved. OAuth setup is ready for provider credentials.");
		},
		onError: () => toast.error("We could not save this connection request.")
	});
	const disconnect = useMutation({
		mutationFn: (provider) => disconnectSocialConnection(userId, provider),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-connections", userId] }),
		onError: () => toast.error("We could not disconnect this account.")
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stash/10 text-stash",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 62,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 61,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "font-display text-lg font-bold",
					children: "Verified social activity"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 65,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-sm leading-6 text-muted-foreground",
					children: "Connect accounts to prove that your Stashes and Trashes came from a real profile. We request read-only access and never publish on your behalf."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 66,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 64,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 60,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5 grid gap-3",
				children: providers.map(({ id, label, description, icon: Icon }) => {
					const connection = data.find((item) => item.provider === id);
					const connected = connection?.status === "connected";
					const pending = connection?.status === "pending";
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 80,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 79,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm font-semibold",
									children: label
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 83,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: description
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 84,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 82,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: connected ? "outline" : "default",
								disabled: isLoading || connect.isPending || disconnect.isPending,
								onClick: () => connected ? disconnect.mutate(id) : connect.mutate(id),
								className: "shrink-0 gap-1.5",
								children: connected ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Unlink2, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 95,
									columnNumber: 21
								}, this), " Disconnect"] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 94,
									columnNumber: 19
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link2, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 99,
										columnNumber: 21
									}, this),
									" ",
									pending ? "Pending" : "Connect"
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 98,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 86,
								columnNumber: 15
							}, this)
						]
					}, id, true, {
						fileName: _jsxFileName$1,
						lineNumber: 78,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 72,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "Instagram, TikTok, X, and additional verification providers can plug into this same secure connection layer next."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 107,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 59,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/profile.tsx?tsr-split=component";
function ProfilePage() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const { data: profile, isLoading, refetch } = useQuery({
		queryKey: ["my-profile", user?.id],
		queryFn: () => getPublicProfile(user.id),
		enabled: !!user
	});
	const { data: stats } = useQuery({
		queryKey: ["my-stats", user?.id],
		queryFn: () => getProfileStats(user.id),
		enabled: !!user
	});
	const { data: followers } = useQuery({
		queryKey: ["my-followers", user?.id],
		queryFn: () => getFollowerCount({ userId: user.id }),
		enabled: !!user
	});
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: t("profile.title")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-muted-foreground",
					children: t("profile.subtitle")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "mt-6 h-48 w-full rounded-2xl" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 22
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row",
					children: [profile?.avatar_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: profile.avatar_url,
						alt: profile.display_name,
						className: "h-20 w-20 shrink-0 rounded-2xl object-cover"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 54,
						columnNumber: 36
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-2xl font-bold",
						children: (profile?.display_name ?? "?").charAt(0).toUpperCase()
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 54,
						columnNumber: 154
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-2xl font-bold",
								children: profile?.display_name ?? "Anonymous"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 58,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 flex items-center gap-1 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4 text-stash" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 60,
										columnNumber: 17
									}, this),
									t("social.trustScore"),
									": ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: profile?.trust_score ?? 0 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 61,
										columnNumber: 43
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 59,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: profile?.bio || t("profile.noBio")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 63,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EditProfileDialog, {
									userId: user.id,
									displayName: profile?.display_name ?? "",
									bio: profile?.bio ?? null,
									avatarUrl: profile?.avatar_url ?? null,
									onSaved: () => refetch()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 65,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									asChild: true,
									size: "sm",
									variant: "ghost",
									className: "gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/users/$id",
										params: { id: user.id },
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 70,
												columnNumber: 21
											}, this),
											" ",
											t("profile.viewPublic")
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 67,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 66,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 64,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 78
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SocialConnectionsPanel, { userId: user.id }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 77,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProfileWall, {
					profileId: user.id,
					isOwner: true
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 79,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ReleaseSafetyControls, { userId: user.id }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 80,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mb-3 mt-8 font-display text-lg font-bold",
					children: t("profile.activity")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							icon: Users,
							value: followers ?? 0,
							label: t("social.followers", { count: 0 }).split(" ")[0]
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							icon: UserPlus,
							value: stats?.following ?? 0,
							label: t("profile.following")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 87,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							icon: FileText,
							value: stats?.posts ?? 0,
							label: t("dashboard.posts")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							icon: ThumbsUp,
							value: stats?.stash ?? 0,
							label: t("dashboard.stash")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							icon: ThumbsDown,
							value: stats?.trash ?? 0,
							label: t("dashboard.trash")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 90,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 49,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 47,
		columnNumber: 10
	}, this);
}
function Stat({ icon: Icon, value, label }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-xl border border-border bg-card p-3 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "mx-auto h-4 w-4 text-muted-foreground" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 105,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-1 font-display text-xl font-extrabold",
				children: value
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-0.5 text-[11px] text-muted-foreground",
				children: label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 107,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 104,
		columnNumber: 10
	}, this);
}
//#endregion
export { ProfilePage as component };
