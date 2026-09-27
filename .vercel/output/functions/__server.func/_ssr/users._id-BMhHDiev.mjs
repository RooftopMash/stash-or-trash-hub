import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Button, o as useAuth } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as ShieldCheck, Zt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { b as Skeleton, r as Route$1, rt as fetchUserItems, x as Header } from "./router-BjpvJuyR.mjs";
import { S as unfollowUser, d as getPublicProfile, g as isFollowingUser, i as followUser, o as getFollowerCount } from "./social-CSxIyKrD.mjs";
import { t as ItemCard } from "./ItemCard-CHTXjOhv.mjs";
import { t as ProfileWall } from "./ProfileWall-xfinJzHK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users._id-BMhHDiev.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicProfilePage() {
	const { id } = Route$1.useParams();
	const { t } = useTranslation();
	const { user } = useAuth();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: profile, isLoading } = useQuery({
		queryKey: ["public-profile", id],
		queryFn: () => getPublicProfile(id)
	});
	const { data: followers, refetch: refetchFollowers } = useQuery({
		queryKey: ["followers", id],
		queryFn: () => getFollowerCount({ userId: id })
	});
	const { data: following, refetch: refetchFollowing } = useQuery({
		queryKey: [
			"is-following",
			user?.id,
			id
		],
		queryFn: () => user ? isFollowingUser(user.id, id) : false,
		enabled: !!user
	});
	const { data: items, isLoading: itemsLoading, refetch } = useQuery({
		queryKey: [
			"user-items",
			id,
			user?.id ?? "anon"
		],
		queryFn: () => fetchUserItems(id, user?.id ?? null)
	});
	const toggleFollow = async () => {
		if (!user) {
			toast.info(t("social.signInToFollow"));
			return;
		}
		setBusy(true);
		try {
			if (following) await unfollowUser(user.id, id);
			else await followUser(user.id, id);
			await Promise.all([refetchFollowers(), refetchFollowing()]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.loadFailed"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onPosted: () => refetch() }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }),
						" ",
						t("social.backToFeed")
					]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-2xl" }) : profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [
							profile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: profile.avatar_url,
								alt: profile.display_name,
								className: "h-16 w-16 rounded-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold",
								children: profile.display_name.charAt(0).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl font-extrabold",
										children: profile.display_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 flex items-center gap-1 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-stash" }),
											t("social.trustScore"),
											": ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: profile.trust_score })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: t("social.followers", { count: followers ?? 0 })
									}),
									profile.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm",
										children: profile.bio
									})
								]
							}),
							user?.id !== id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: following ? "outline" : "default",
								disabled: busy,
								onClick: toggleFollow,
								children: following ? t("social.unfollow") : t("social.follow")
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
					children: t("social.profileNotFound")
				}),
				profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileWall, {
					profileId: id,
					isOwner: user?.id === id
				}),
				profile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 mt-8 font-display text-lg font-bold",
					children: t("social.postsBy", { name: profile.display_name })
				}), itemsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 w-full rounded-2xl" }) : items && items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
						item,
						onChange: () => refetch()
					}, item.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground",
					children: t("social.noPosts")
				})] })
			]
		})]
	});
}
//#endregion
export { PublicProfilePage as component };
