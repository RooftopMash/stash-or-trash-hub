import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Route$3, l as useAuth } from "./router-I-3x-i8y.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { b as fetchFeed, c as Header } from "./Header-E8juhbIs.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { p as getTrendingHashtags, s as getItemsByHashtag } from "./social-CNdxEfFV.mjs";
import { t as ItemCard } from "./ItemCard-MVCZJdhp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hashtags._tag-C1JF_-bm.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/hashtags.$tag.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, { onPosted: () => refetch() }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 45,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-3xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-4xl font-extrabold",
					children: ["#", tag]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-muted-foreground",
					children: t("social.hashtagCount", { count: items.length })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 47,
				columnNumber: 9
			}, this), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-64 w-full rounded-2xl" }, i, false, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 33
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 22
			}, this) : items.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemCard, {
					item,
					onChange: () => refetch()
				}, item.id, false, {
					fileName: _jsxFileName,
					lineNumber: 59,
					columnNumber: 32
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 58,
				columnNumber: 39
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-2xl border border-dashed border-border p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground",
					children: t("social.hashtagEmpty", { tag })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 13
				}, this), trending && trending.length > 0 && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("p", {
					className: "mt-4 text-sm font-medium",
					children: t("social.trySomethingElse")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 65,
					columnNumber: 17
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "mt-2 flex flex-wrap justify-center gap-2",
					children: trending.map((h) => /* @__PURE__ */ (void 0)(Link, {
						to: "/hashtags/$tag",
						params: { tag: h.tag },
						className: "rounded-full border border-border px-3 py-1 text-sm hover:bg-secondary",
						children: ["#", h.tag]
					}, h.id, true, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 38
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 17
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 64,
					columnNumber: 49
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 20
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 44,
		columnNumber: 10
	}, this);
}
//#endregion
export { HashtagPage as component };
