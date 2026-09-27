import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, n as Button, o as useAuth } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { G as MessageCircle, M as Repeat2, Ut as Bell, l as UserPlus, qt as AtSign, st as Heart } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { A as Badge, b as Skeleton, x as Header } from "./router-BjpvJuyR.mjs";
import { c as getNotifications, m as getUnreadNotificationCount, y as markNotificationsRead } from "./social-CSxIyKrD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-DTLPBiVn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: () => user ? getNotifications(user.id) : [],
		enabled: !!user,
		refetchInterval: 15e3
	});
	const { data: unreadCount } = useQuery({
		queryKey: ["unread-notifications", user?.id],
		queryFn: () => user ? getUnreadNotificationCount(user.id) : 0,
		enabled: !!user,
		refetchInterval: 15e3
	});
	(0, import_react.useEffect)(() => {
		if (user && notifications && notifications.length > 0) markNotificationsRead(user.id);
	}, [user, notifications]);
	const filtered = (notifications ?? []).filter((n) => {
		switch (filter) {
			case "likes": return n.type.includes("like");
			case "follows": return n.type === "follow";
			case "comments": return n.type === "comment" || n.type === "mention";
			default: return true;
		}
	});
	const icon = (type) => {
		switch (type) {
			case "follow": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 text-primary" });
			case "like_post":
			case "like_comment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 text-trash" });
			case "comment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 text-stash" });
			case "mention": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-4 w-4 text-primary" });
			case "repost": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat2, { className: "h-4 w-4 text-stash" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" });
		}
	};
	const label = (n) => {
		const name = n.actorName;
		switch (n.type) {
			case "follow": return t("social.notifFollow", { name });
			case "like_post": return t("social.notifLikePost", { name });
			case "like_comment": return t("social.notifLikeComment", { name });
			case "comment": return t("social.notifComment", { name });
			case "mention": return t("social.notifMention", { name });
			case "repost": return t("social.notifRepost", { name });
			default: return t("social.notifOther", { name });
		}
	};
	const filters = [
		{
			key: "all",
			label: t("social.notifAll")
		},
		{
			key: "likes",
			label: t("social.notifLikes")
		},
		{
			key: "follows",
			label: t("social.notifFollows")
		},
		{
			key: "comments",
			label: t("social.notifComments")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "flex items-center gap-2 font-display text-3xl font-extrabold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-7 w-7" }),
							" ",
							t("social.notifications"),
							unreadCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "destructive",
								className: "ml-1",
								children: unreadCount
							}) : null
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex flex-wrap gap-2",
					children: filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: filter === f.key ? "default" : "outline",
						size: "sm",
						onClick: () => setFilter(f.key),
						children: f.label
					}, f.key))
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-lg" }, i))
				}) : filtered.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.map((n) => {
						const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary",
								children: icon(n.type)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: label(n)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: new Date(n.created_at).toLocaleDateString()
								})]
							}),
							!n.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 shrink-0 rounded-full bg-primary" })
						] });
						const className = cn("flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary", !n.read_at && "border-primary/50 bg-primary/5");
						if (n.item_id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/items/$id",
							params: { id: n.item_id },
							className,
							children: content
						}, n.id);
						if (n.actor_id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/users/$id",
							params: { id: n.actor_id },
							className,
							children: content
						}, n.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className,
							children: content
						}, n.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
					children: t("social.notifEmpty")
				})
			]
		})]
	});
}
//#endregion
export { NotificationsPage as component };
