import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { kt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as Route$2, l as useAuth } from "./router-Ymvu7mB_.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { c as Header, x as fetchItem } from "./Header-BKSLqlsv.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { t as ItemCard } from "./ItemCard-mRZy7nQp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/items._id-DneS4B_C.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/items.$id.tsx?tsr-split=component";
function PostDetail() {
	const { id } = Route$2.useParams();
	const { t } = useTranslation();
	const { user } = useAuth();
	const { data, isLoading, refetch } = useQuery({
		queryKey: [
			"item",
			id,
			user?.id ?? "anon"
		],
		queryFn: () => fetchItem(id, user?.id ?? null)
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, { onPosted: () => refetch() }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 30,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/",
				className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 11
					}, this),
					" ",
					t("social.backToFeed")
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 9
			}, this), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-80 w-full rounded-2xl" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 36,
				columnNumber: 22
			}, this) : data ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemCard, {
				item: data,
				onChange: () => refetch(),
				defaultCommentsOpen: true
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 36,
				columnNumber: 80
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
				children: t("social.postNotFound")
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 36,
				columnNumber: 154
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 31,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 29,
		columnNumber: 10
	}, this);
}
//#endregion
export { PostDetail as component };
