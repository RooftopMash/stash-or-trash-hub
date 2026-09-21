import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as Repeat2, Et as AtSign, G as Heart, M as MessageCircle, St as Bell, o as UserPlus } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-I-3x-i8y.mjs";
import { i as cn, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { c as Header } from "./Header-E8juhbIs.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { c as getNotifications, m as getUnreadNotificationCount, y as markNotificationsRead } from "./social-CNdxEfFV.mjs";
import { t as Badge } from "./badge-DAskHgZn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-Osh_YNLV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/notifications.tsx?tsr-split=component";
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
			case "follow": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserPlus, { className: "h-4 w-4 text-primary" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 16
			}, this);
			case "like_post":
			case "like_comment": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "h-4 w-4 text-trash" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 16
			}, this);
			case "comment": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "h-4 w-4 text-stash" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 64,
				columnNumber: 16
			}, this);
			case "mention": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AtSign, { className: "h-4 w-4 text-primary" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 66,
				columnNumber: 16
			}, this);
			case "repost": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Repeat2, { className: "h-4 w-4 text-stash" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 68,
				columnNumber: 16
			}, this);
			default: return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { className: "h-4 w-4" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 70,
				columnNumber: 16
			}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 123,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-3xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "flex items-center gap-2 font-display text-3xl font-extrabold",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { className: "h-7 w-7" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 13
							}, this),
							" ",
							t("social.notifications"),
							unreadCount ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "destructive",
								className: "ml-1",
								children: unreadCount
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 28
							}, this) : null
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex flex-wrap gap-2",
					children: filters.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: filter === f.key ? "default" : "outline",
						size: "sm",
						onClick: () => setFilter(f.key),
						children: f.label
					}, f.key, false, {
						fileName: _jsxFileName,
						lineNumber: 135,
						columnNumber: 29
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 9
				}, this),
				isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-20 w-full rounded-lg" }, i, false, {
						fileName: _jsxFileName,
						lineNumber: 141,
						columnNumber: 36
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 140,
					columnNumber: 22
				}, this) : filtered.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: filtered.map((n) => {
						const content = /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary",
								children: icon(n.type)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm font-semibold",
									children: label(n)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 149,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: new Date(n.created_at).toLocaleDateString()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 150,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 148,
								columnNumber: 19
							}, this),
							!n.read_at && /* @__PURE__ */ (void 0)("div", { className: "h-2 w-2 shrink-0 rounded-full bg-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 154,
								columnNumber: 34
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 27
						}, this);
						const className = cn("flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary", !n.read_at && "border-primary/50 bg-primary/5");
						if (n.item_id) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/items/$id",
							params: { id: n.item_id },
							className,
							children: content
						}, n.id, false, {
							fileName: _jsxFileName,
							lineNumber: 158,
							columnNumber: 20
						}, this);
						if (n.actor_id) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/users/$id",
							params: { id: n.actor_id },
							className,
							children: content
						}, n.id, false, {
							fileName: _jsxFileName,
							lineNumber: 165,
							columnNumber: 20
						}, this);
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className,
							children: content
						}, n.id, false, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 18
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 142,
					columnNumber: 42
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
					children: t("social.notifEmpty")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 175,
					columnNumber: 20
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 124,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 10
	}, this);
}
//#endregion
export { NotificationsPage as component };
