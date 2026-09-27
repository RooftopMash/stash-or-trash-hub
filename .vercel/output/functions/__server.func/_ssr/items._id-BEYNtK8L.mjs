import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as useAuth } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Zt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { b as Skeleton, i as Route$2, nt as fetchItem, x as Header } from "./router-BjpvJuyR.mjs";
import { t as ItemCard } from "./ItemCard-CHTXjOhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/items._id-BEYNtK8L.js
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onPosted: () => refetch() }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }),
					" ",
					t("social.backToFeed")
				]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-2xl" }) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
				item: data,
				onChange: () => refetch(),
				defaultCommentsOpen: true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
				children: t("social.postNotFound")
			})]
		})]
	});
}
//#endregion
export { PostDetail as component };
