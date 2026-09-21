import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { R as LoaderCircle, gt as ChevronDown, h as Sparkles, mt as ChevronUp, w as Recycle } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-Ymvu7mB_.mjs";
import { n as Input, r as Label, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-C6Tvt94Q.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-28xlY-Ld.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var lovableAuth = createLovableAuth();
function generateOAuthState() {
	if (typeof crypto !== "undefined" && crypto.getRandomValues) return [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	if (typeof window === "undefined") return { error: /* @__PURE__ */ new Error("Window is not defined") };
	const host = window.location.hostname;
	if (host === "stash-or-trash-hub.lovable.app" || host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")) {
		const result = await lovableAuth.signInWithOAuth(provider, opts);
		if (result.redirected) return result;
		if (result.error) return result;
		if (result.tokens) try {
			await supabase.auth.setSession(result.tokens);
		} catch (e) {
			return { error: e instanceof Error ? e : new Error(String(e)) };
		}
		return result;
	}
	const state = generateOAuthState();
	const redirectUri = "https://stash-or-trash-hub.lovable.app/auth/callback";
	const url = `/~oauth/initiate?${new URLSearchParams({
		...opts?.extraParams,
		provider,
		redirect_uri: redirectUri,
		state,
		response_mode: "web_message"
	}).toString()}`;
	const width = Math.min(520, window.outerWidth || 500);
	const height = Math.min(640, window.outerHeight || 600);
	const left = window.screenX + ((window.outerWidth || 500) - width) / 2;
	const top = window.screenY + ((window.outerHeight || 600) - height) / 2;
	let resolvePromise;
	const messagePromise = new Promise((resolve) => {
		resolvePromise = resolve;
	});
	const allowedOrigins = [
		"https://oauth.lovable.app",
		"https://lovable.dev",
		"https://stash-or-trash-hub.lovable.app",
		window.location.origin
	];
	const onMessage = (e) => {
		if (!allowedOrigins.includes(e.origin)) return;
		const data = e.data;
		if (!data || typeof data !== "object") return;
		if (data.type !== "authorization_response") return;
		resolvePromise(data.response || data);
	};
	window.addEventListener("message", onMessage);
	const popup = window.open(url, "oauth", `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`);
	if (!popup) {
		window.removeEventListener("message", onMessage);
		return { error: /* @__PURE__ */ new Error("Popup was blocked. Please allow popups to sign in with Google.") };
	}
	const popupClosedPromise = new Promise((_, reject) => {
		const interval = setInterval(() => {
			if (popup.closed) {
				clearInterval(interval);
				reject(/* @__PURE__ */ new Error("Sign in was cancelled"));
			}
		}, 500);
	});
	try {
		const response = await Promise.race([messagePromise, popupClosedPromise]);
		if (!response) throw new Error("No response received");
		if (response.state && response.state !== state) throw new Error("Invalid OAuth state");
		if (response.error) throw new Error(response.error_description || response.error);
		if (!response.access_token || !response.refresh_token) throw new Error("No authentication tokens received");
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: response.access_token,
			refresh_token: response.refresh_token
		});
		if (sessionError) throw sessionError;
		return {
			tokens: {
				access_token: response.access_token,
				refresh_token: response.refresh_token
			},
			error: null
		};
	} catch (err) {
		return { error: err instanceof Error ? err : new Error(String(err)) };
	} finally {
		window.removeEventListener("message", onMessage);
		try {
			popup?.close();
		} catch {}
	}
} } };
var _jsxFileName = "/app/applet/src/routes/auth.tsx?tsr-split=component";
function AuthPage() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("signin");
	const [showSocials, setShowSocials] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: "/" });
	}, [user, navigate]);
	const signIn = async () => {
		const cleanEmail = email.trim();
		if (!cleanEmail || !password) {
			toast.error("Please enter both email and password.");
			return;
		}
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: cleanEmail,
				password
			});
			if (error) {
				const message = /email not confirmed/i.test(error.message) ? "Please confirm your email before signing in." : /invalid login credentials/i.test(error.message) ? "Invalid email or password. If you do not have an account yet, click Sign Up." : error.message || "We could not sign you in right now. Please try again.";
				return toast.error(message);
			}
			toast.success(t("auth.welcome"));
			navigate({ to: "/" });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "An unexpected error occurred during sign in.";
			toast.error(msg);
		} finally {
			setBusy(false);
		}
	};
	const signUp = async () => {
		const cleanEmail = email.trim();
		if (!cleanEmail || !password) {
			toast.error("Please provide an email and password.");
			return;
		}
		if (password.length < 6) {
			toast.error("Password should be at least 6 characters long.");
			return;
		}
		setBusy(true);
		try {
			const { data, error } = await supabase.auth.signUp({
				email: cleanEmail,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					data: { display_name: displayName.trim() || cleanEmail.split("@")[0] }
				}
			});
			if (error) return toast.error(error.message);
			if (data.session) {
				toast.success(t("auth.created"));
				navigate({ to: "/" });
			} else {
				toast.success("Account created! You can now sign in.");
				setActiveTab("signin");
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "An unexpected error occurred during sign up.";
			toast.error(msg);
		} finally {
			setBusy(false);
		}
	};
	const runOAuth = async (provider) => {
		try {
			setBusy(true);
			const callbackUrl = `${window.location.origin}/auth/callback`;
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: provider === "twitter" ? "twitter" : provider,
				options: { redirectTo: callbackUrl }
			});
			if (!error && data?.url) {
				window.location.href = data.url;
				return;
			}
			if (error && (provider === "google" || provider === "apple" || provider === "microsoft")) {
				const result = await lovable.auth.signInWithOAuth(provider);
				if (result.error) throw result.error;
				if (result.redirected) return;
				toast.success(t("auth.welcome") || "Welcome back!");
				navigate({ to: "/" });
				return;
			}
			if (error) {
				if (error.message?.includes("missing OAuth secret") || error.message?.includes("Unsupported provider")) throw new Error(`${provider.toUpperCase()} OAuth is not enabled in this Supabase project yet. Please configure the Client ID & Secret in your Supabase Auth Providers dashboard, or use Email sign in below.`);
				throw new Error(error.message);
			}
		} catch (e) {
			const rawMsg = e instanceof Error ? e.message : "";
			toast.error(rawMsg || t("auth.socialFailed"), { duration: 6e3 });
		} finally {
			setBusy(false);
		}
	};
	const handleSignInSubmit = (e) => {
		e.preventDefault();
		if (!busy) signIn();
	};
	const handleSignUpSubmit = (e) => {
		e.preventDefault();
		if (!busy) signUp();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/",
				className: "mb-6 flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Recycle, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 167,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 166,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-display text-xl font-extrabold",
					children: [
						"Stash",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-muted-foreground",
							children: " or "
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 170,
							columnNumber: 18
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-trash",
							children: "Trash"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 165,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								className: "w-full justify-center gap-2 font-medium relative h-11",
								disabled: busy,
								onClick: () => runOAuth("google"),
								children: [busy ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 23
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
									className: "h-4 w-4 shrink-0",
									viewBox: "0 0 24 24",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
											fill: "#4285F4",
											d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 180,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
											fill: "#34A853",
											d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 181,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
											fill: "#FBBC05",
											d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 182,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
											fill: "#EA4335",
											d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 183,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 92
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: t("auth.continueGoogle") }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 185,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setShowSocials((v) => !v),
								className: "flex w-full items-center justify-center gap-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: showSocials ? "Fewer social options" : "More social login options" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 189,
									columnNumber: 15
								}, this), showSocials ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronUp, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 30
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 70
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 13
							}, this),
							showSocials && /* @__PURE__ */ (void 0)("div", {
								className: "space-y-2 pt-1",
								children: [
									/* @__PURE__ */ (void 0)(Button, {
										variant: "outline",
										className: "w-full justify-center gap-2 font-medium",
										disabled: busy,
										onClick: () => runOAuth("apple"),
										children: t("auth.continueApple")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 194,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)(Button, {
										variant: "outline",
										className: "w-full justify-center gap-2 font-medium",
										disabled: busy,
										onClick: () => runOAuth("microsoft"),
										children: t("auth.continueMicrosoft")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 197,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)(Button, {
										variant: "outline",
										className: "w-full justify-center gap-2 font-medium",
										disabled: busy,
										onClick: () => runOAuth("facebook"),
										children: [/* @__PURE__ */ (void 0)("svg", {
											className: "h-4 w-4 shrink-0 fill-[#1877F2]",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ (void 0)("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 202,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 201,
											columnNumber: 19
										}, this), t("auth.continueFacebook")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 200,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)(Button, {
										variant: "outline",
										className: "w-full font-medium",
										disabled: busy,
										onClick: () => runOAuth("linkedin"),
										children: t("auth.continueLinkedIn")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)(Button, {
										variant: "outline",
										className: "w-full font-medium",
										disabled: busy,
										onClick: () => runOAuth("twitter"),
										children: t("auth.continueX")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 209,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 193,
								columnNumber: 29
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 177,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 216,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "or with email" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 218,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 215,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
						value: activeTab,
						onValueChange: (v) => setActiveTab(v),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, {
								className: "grid w-full grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "signin",
									children: t("auth.signIn")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 223,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "signup",
									children: t("auth.signUp")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 222,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
								value: "signin",
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
									onSubmit: handleSignInSubmit,
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
											id: "si-email",
											label: t("auth.email"),
											type: "email",
											value: email,
											onChange: setEmail,
											placeholder: "name@example.com",
											required: true
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 229,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
											id: "si-pw",
											label: t("auth.password"),
											type: "password",
											value: password,
											onChange: setPassword,
											placeholder: "••••••••",
											required: true
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 230,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											type: "submit",
											className: "w-full",
											disabled: busy,
											children: busy ? "Signing in…" : t("auth.signIn")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 231,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 228,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
								value: "signup",
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mb-3 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3.5 w-3.5 text-primary shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 239,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Instant sign-up: email confirmation is enabled and automatic." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 238,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
									onSubmit: handleSignUpSubmit,
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
											id: "su-name",
											label: t("auth.displayName"),
											value: displayName,
											onChange: setDisplayName,
											placeholder: "Display Name"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 243,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
											id: "su-email",
											label: t("auth.email"),
											type: "email",
											value: email,
											onChange: setEmail,
											placeholder: "name@example.com",
											required: true
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 244,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
											id: "su-pw",
											label: t("auth.password"),
											type: "password",
											value: password,
											onChange: setPassword,
											placeholder: "At least 6 characters",
											required: true
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 245,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											type: "submit",
											className: "w-full",
											disabled: busy,
											children: busy ? "Creating account…" : t("auth.createAccount")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 242,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 237,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 221,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 175,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 164,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 163,
		columnNumber: 10
	}, this);
}
function Field({ id, label, value, onChange, type = "text", placeholder, required = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-1.5 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
			htmlFor: id,
			children: label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 274,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
			id,
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			required
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 275,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 273,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuthPage as component };
