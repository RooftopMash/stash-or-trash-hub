import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { x as Header } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-ruLsBj5s.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.18em] text-stash",
					children: "Privacy policy · 2026-09-11"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-extrabold",
					children: "Privacy, safety, and data control"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prose prose-sm mt-8 max-w-none text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Stash or Trash Hub uses account, profile, submission, moderation, and connection data to provide brand ratings, public walls, safety review, and direct brand communication." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Control and retention" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You can review consent, report content, block users, revoke provider connections, and request account deletion from your account controls. Public posts remain visible until removed or moderated." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Security" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Access is scoped by authenticated ownership policies. Provider secrets must remain server-side and are never exposed in the browser. We retain security and moderation records only as needed to protect the community and meet legal obligations." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Contact" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "For privacy requests, contact the service operator through the support channel listed in the app." })
					]
				})
			]
		})]
	});
}
//#endregion
export { PrivacyPage as component };
