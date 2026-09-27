import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as useAuth } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { a as Route$3, b as Skeleton, tt as fetchFeed, x as Header } from "./router-BjpvJuyR.mjs";
import { p as getTrendingHashtags, s as getItemsByHashtag } from "./social-CSxIyKrD.mjs";
import { t as ItemCard } from "./ItemCard-CHTXjOhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hashtags._tag-yfy5Gh94.js
var import_jsx_runtime = require_jsx_runtime();
function HashtagPage() {
	const { tag } = Route$3.useParams();
	const { t } = useTranslation();
	const { user } = useAuth();
	const { data: taggedIds } = useQuery({
		queryKey: ["hashtag-item-ids", tag],
		queryFn: () => getItemsByHashtag(tag)
	});
	const { data: allItems, isLoading, refetch } = useQuery({
		queryKey: ["feed", user?.id ?? "anon"],
		queryFn: () => fetchFeed(user?.id ?? null)
	});
	const { data: trending } = useQuery({
		queryKey: ["trending-hashtags"],
		queryFn: () => getTrendingHashtags(8)
	});
	const ids = new Set((taggedIds ?? []).map((r) => r.item_id));
	const needle = `#${tag.toLowerCase()}`;
	const items = (allItems ?? []).filter((item) => ids.has(item.id) || item.title?.toLowerCase().includes(needle) || item.description?.toLowerCase().includes(needle));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onPosted: () => refetch() }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-4xl font-extrabold",
					children: ["#", tag]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: t("social.hashtagCount", { count: items.length })
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-2xl" }, i))
			}) : items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
					item,
					onChange: () => refetch()
				}, item.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: t("social.hashtagEmpty", { tag })
				}), trending && trending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm font-medium",
					children: t("social.trySomethingElse")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap justify-center gap-2",
					children: trending.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/hashtags/$tag",
						params: { tag: h.tag },
						className: "rounded-full border border-border px-3 py-1 text-sm hover:bg-secondary",
						children: ["#", h.tag]
					}, h.id))
				})] })]
			})]
		})]
	});
}
//#endregion
export { HashtagPage as component };
