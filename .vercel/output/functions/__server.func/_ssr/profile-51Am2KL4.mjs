import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as Label, n as Button, o as useAuth, r as Input } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Link2, E as ShieldCheck, Q as Linkedin, _t as Facebook, c as Users, d as Unlink2, l as UserPlus, mt as FileText, r as Youtube, v as ThumbsUp, y as ThumbsDown, yt as ExternalLink, z as Pencil } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { D as Textarea, F as DialogFooter, I as DialogHeader, L as DialogTitle, M as Dialog, N as DialogContent, Ot as supabase, P as DialogDescription, R as DialogTrigger, b as Skeleton, x as Header } from "./router-BjpvJuyR.mjs";
import { E as updateMyProfile, d as getPublicProfile, o as getFollowerCount, u as getProfileStats } from "./social-CSxIyKrD.mjs";
import { n as ReleaseSafetyControls, t as ProfileWall } from "./ProfileWall-xfinJzHK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-51Am2KL4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }),
					" ",
					t("social.editProfile")
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("social.editProfile") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("social.bioPh") })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "profile-name",
							children: t("social.displayName")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "profile-name",
							value: name,
							maxLength: 60,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "profile-bio",
							children: t("social.bio")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "profile-bio",
							value: about,
							maxLength: 280,
							placeholder: t("social.bioPh"),
							onChange: (e) => setAbout(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "profile-avatar",
							children: t("social.avatarUrl")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "profile-avatar",
							value: avatar,
							placeholder: "https://…",
							onChange: (e) => setAvatar(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: busy,
				children: busy ? t("social.saving") : t("social.save")
			}) })
		] })]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stash/10 text-stash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-bold",
					children: "Verified social activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-6 text-muted-foreground",
					children: "Connect accounts to prove that your Stashes and Trashes came from a real profile. We request read-only access and never publish on your behalf."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3",
				children: providers.map(({ id, label, description, icon: Icon }) => {
					const connection = data.find((item) => item.provider === id);
					const connected = connection?.status === "connected";
					const pending = connection?.status === "pending";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: description
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: connected ? "outline" : "default",
								disabled: isLoading || connect.isPending || disconnect.isPending,
								onClick: () => connected ? disconnect.mutate(id) : connect.mutate(id),
								className: "shrink-0 gap-1.5",
								children: connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unlink2, { className: "h-3.5 w-3.5" }), " Disconnect"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3.5 w-3.5" }),
									" ",
									pending ? "Pending" : "Connect"
								] })
							})
						]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "Instagram, TikTok, X, and additional verification providers can plug into this same secure connection layer next."
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: t("profile.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted-foreground",
					children: t("profile.subtitle")
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-48 w-full rounded-2xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row",
					children: [profile?.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: profile.avatar_url,
						alt: profile.display_name,
						className: "h-20 w-20 shrink-0 rounded-2xl object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-2xl font-bold",
						children: (profile?.display_name ?? "?").charAt(0).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-bold",
								children: profile?.display_name ?? "Anonymous"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-1 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-stash" }),
									t("social.trustScore"),
									": ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: profile?.trust_score ?? 0 })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: profile?.bio || t("profile.noBio")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditProfileDialog, {
									userId: user.id,
									displayName: profile?.display_name ?? "",
									bio: profile?.bio ?? null,
									avatarUrl: profile?.avatar_url ?? null,
									onSaved: () => refetch()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									variant: "ghost",
									className: "gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/users/$id",
										params: { id: user.id },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }),
											" ",
											t("profile.viewPublic")
										]
									})
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialConnectionsPanel, { userId: user.id }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileWall, {
					profileId: user.id,
					isOwner: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleaseSafetyControls, { userId: user.id }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 mt-8 font-display text-lg font-bold",
					children: t("profile.activity")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: Users,
							value: followers ?? 0,
							label: t("social.followers", { count: 0 }).split(" ")[0]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: UserPlus,
							value: stats?.following ?? 0,
							label: t("profile.following")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: FileText,
							value: stats?.posts ?? 0,
							label: t("dashboard.posts")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: ThumbsUp,
							value: stats?.stash ?? 0,
							label: t("dashboard.stash")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: ThumbsDown,
							value: stats?.trash ?? 0,
							label: t("dashboard.trash")
						})
					]
				})
			]
		})]
	});
}
function Stat({ icon: Icon, value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-3 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mx-auto h-4 w-4 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-display text-xl font-extrabold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[11px] text-muted-foreground",
				children: label
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
