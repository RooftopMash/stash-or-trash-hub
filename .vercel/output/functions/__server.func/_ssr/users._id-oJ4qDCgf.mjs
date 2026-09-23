import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { kt as ArrowLeft, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { l as useAuth, r as Route$1 } from "./router-Ymvu7mB_.mjs";
import { t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { T as fetchUserItems, c as Header } from "./Header-BKSLqlsv.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { S as unfollowUser, d as getPublicProfile, g as isFollowingUser, i as followUser, o as getFollowerCount } from "./social-CNdxEfFV.mjs";
import { t as ItemCard } from "./ItemCard-mRZy7nQp.mjs";
import { t as ProfileWall } from "./ProfileWall-Db1XL_tq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users._id-oJ4qDCgf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/users.$id.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, { onPosted: () => refetch() }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 75,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/",
					className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 11
						}, this),
						" ",
						t("social.backToFeed")
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 77,
					columnNumber: 9
				}, this),
				isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-32 w-full rounded-2xl" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 22
				}, this) : profile ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start gap-4",
						children: [
							profile.avatar_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: profile.avatar_url,
								alt: profile.display_name,
								className: "h-16 w-16 rounded-full object-cover"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 37
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold",
								children: profile.display_name.charAt(0).toUpperCase()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 147
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
										className: "font-display text-2xl font-extrabold",
										children: profile.display_name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 87,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 flex items-center gap-1 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4 text-stash" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 89,
												columnNumber: 19
											}, this),
											t("social.trustScore"),
											": ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: profile.trust_score }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 90,
												columnNumber: 45
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 88,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm text-muted-foreground",
										children: t("social.followers", { count: followers ?? 0 })
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 92,
										columnNumber: 17
									}, this),
									profile.bio && /* @__PURE__ */ (void 0)("p", {
										className: "mt-2 text-sm",
										children: profile.bio
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 97,
										columnNumber: 33
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 15
							}, this),
							user?.id !== id && /* @__PURE__ */ (void 0)(Button, {
								size: "sm",
								variant: following ? "outline" : "default",
								disabled: busy,
								onClick: toggleFollow,
								children: following ? t("social.unfollow") : t("social.follow")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 99,
								columnNumber: 35
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 83
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
					children: t("social.profileNotFound")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 24
				}, this),
				profile && /* @__PURE__ */ (void 0)(ProfileWall, {
					profileId: id,
					isOwner: user?.id === id
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 107,
					columnNumber: 21
				}, this),
				profile && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("h2", {
					className: "mb-3 mt-8 font-display text-lg font-bold",
					children: t("social.postsBy", { name: profile.display_name })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 110,
					columnNumber: 13
				}, this), itemsLoading ? /* @__PURE__ */ (void 0)(Skeleton, { className: "h-56 w-full rounded-2xl" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 115,
					columnNumber: 29
				}, this) : items && items.length > 0 ? /* @__PURE__ */ (void 0)("div", {
					className: "space-y-4",
					children: items.map((item) => /* @__PURE__ */ (void 0)(ItemCard, {
						item,
						onChange: () => refetch()
					}, item.id, false, {
						fileName: _jsxFileName,
						lineNumber: 116,
						columnNumber: 36
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 115,
					columnNumber: 108
				}, this) : /* @__PURE__ */ (void 0)("p", {
					className: "rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground",
					children: t("social.noPosts")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 24
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 21
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 76,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 74,
		columnNumber: 10
	}, this);
}
//#endregion
export { PublicProfilePage as component };
