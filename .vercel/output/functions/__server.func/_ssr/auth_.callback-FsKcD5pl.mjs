import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { R as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth_.callback-FsKcD5pl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/auth_.callback.tsx?tsr-split=component";
function AuthCallbackPage() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function completeAuth() {
			try {
				const searchParams = new URLSearchParams(window.location.search);
				const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash);
				const errorDesc = searchParams.get("error_description") || hashParams.get("error_description") || searchParams.get("error") || hashParams.get("error");
				if (errorDesc) throw new Error(decodeURIComponent(errorDesc));
				const code = searchParams.get("code");
				if (code) {
					const { data, error } = await supabase.auth.exchangeCodeForSession(code);
					if (error) throw error;
					if (data.session && active) {
						toast.success("Welcome back!");
						navigate({ to: "/" });
						return;
					}
				}
				const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
				const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token");
				if (accessToken) {
					const { data, error } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken || ""
					});
					if (error) throw error;
					if (data.session && active) {
						toast.success("Welcome back!");
						navigate({ to: "/" });
						return;
					}
				}
				const { data: sessionData } = await supabase.auth.getSession();
				if (sessionData.session && active) {
					navigate({ to: "/" });
					return;
				}
				if (active) navigate({ to: "/auth" });
			} catch (err) {
				if (!active) return;
				const msg = err instanceof Error ? err.message : "Could not complete sign in.";
				setErrorMessage(msg);
				toast.error(msg);
			}
		}
		completeAuth();
		return () => {
			active = false;
		};
	}, [navigate]);
	if (errorMessage) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "flex min-h-screen flex-col items-center justify-center p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md space-y-4 rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-lg font-bold text-destructive",
					children: "Sign in incomplete"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 92,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: errorMessage
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => navigate({ to: "/auth" }),
					className: "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
					children: "Back to Sign In"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 91,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 90,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Completing sign in…" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 104,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 102,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuthCallbackPage as component };
