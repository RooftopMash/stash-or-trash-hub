import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Button } from "./label-BlRLLIBM.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { It as Check, i as X, ut as Gavel } from "../_libs/lucide-react.mjs";
import { D as Textarea, Ot as supabase } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminAppealsQueue-DnGrGazd.js
var import_jsx_runtime = require_jsx_runtime();
function AdminAppealsQueue() {
	const { data: appeals, refetch } = useQuery({
		queryKey: ["admin-content-appeals"],
		queryFn: async () => {
			const { data, error } = await supabase.from("content_appeals").select("id, review_id, appellant_id, reason, status, created_at").in("status", ["open", "reviewing"]).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	async function resolve(id, status) {
		const { error } = await supabase.from("content_appeals").update({
			status,
			resolved_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) {
			toast.error("Could not resolve this appeal");
			return;
		}
		toast.success(status === "overturned" ? "Appeal overturned" : "Appeal upheld");
		refetch();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: !appeals?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No open appeals."
		}) : appeals.map((appeal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gavel, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Review ",
								appeal.review_id,
								" · User ",
								appeal.appellant_id
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-sm",
							children: appeal.reason
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-3",
							placeholder: "Optional reviewer note",
							"aria-label": "Reviewer note"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => resolve(appeal.id, "overturned"),
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Overturn"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => resolve(appeal.id, "upheld"),
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Uphold"]
							})]
						})
					]
				})]
			})
		}, appeal.id))
	});
}
//#endregion
export { AdminAppealsQueue as t };
