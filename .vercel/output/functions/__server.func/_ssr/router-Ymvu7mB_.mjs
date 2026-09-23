import { i as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { K as redirect, S as useRouter, _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRouteWithContext, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { st as CloudOff } from "../_libs/lucide-react.mjs";
import { t as require_agora_token } from "../_libs/agora-token+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Ymvu7mB_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var import_agora_token = /* @__PURE__ */ __toESM(require_agora_token());
var styles_default = "/assets/styles-CSWQWY3s.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	const enrichedContext = {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	};
	window.__lovableEvents?.captureException?.(error, enrichedContext, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	window.__sentryBridge?.captureException?.(error, enrichedContext);
}
function installSentryBridge(bridge) {
	if (typeof window !== "undefined") window.__sentryBridge = bridge;
}
var _jsxFileName$2 = "/app/applet/src/hooks/useAuth.tsx";
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const value = {
		user: session?.user ?? null,
		session,
		loading,
		signOut: async () => {
			await supabase.auth.signOut();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthContext.Provider, {
		value,
		children
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 42,
		columnNumber: 10
	}, this);
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
var _jsxFileName$1 = "/app/applet/src/components/OfflineStatus.tsx";
function OfflineStatus() {
	const [offline, setOffline] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		const update = () => setOffline(!navigator.onLine);
		update();
		const handleOnline = () => {
			update();
			queryClient.refetchQueries({ type: "active" });
		};
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", update);
		};
	}, []);
	if (!offline) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		role: "status",
		className: "fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 border-t border-amber-500/30 bg-amber-950 px-4 py-2 text-xs font-medium text-amber-100",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CloudOff, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 30,
			columnNumber: 7
		}, this), " You are offline. Changes will not be submitted until your connection returns."]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 26,
		columnNumber: 5
	}, this);
}
function ProductionMonitoring() {
	(0, import_react.useEffect)(() => {
		const sentry = window.Sentry;
		if (sentry?.captureException) installSentryBridge({ captureException: sentry.captureException.bind(sentry) });
		const onError = (event) => {
			if (!(event.error instanceof Error) && !event.message) return;
			reportLovableError(event.error ?? new Error(event.message), {
				mechanism: "window_error",
				filename: event.filename,
				line: event.lineno
			});
		};
		const onRejection = (event) => {
			reportLovableError(event.reason, { mechanism: "unhandledrejection" });
		};
		window.addEventListener("error", onError);
		window.addEventListener("unhandledrejection", onRejection);
		return () => {
			window.removeEventListener("error", onError);
			window.removeEventListener("unhandledrejection", onRejection);
		};
	}, []);
	return null;
}
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 30,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 24,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 23,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 56,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 59,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 52,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 51,
		columnNumber: 5
	}, this);
}
var Route$20 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SOT — Stash Or Trash | The Brand Barometer" },
			{
				name: "description",
				content: "SOT (Stash Or Trash) is the Brand Barometer — a CX/UX marketing & PR tool where the community delivers a live verdict on brands. Cast yours and keep your streak alive."
			},
			{
				name: "author",
				content: "SOT — Stash Or Trash"
			},
			{
				property: "og:title",
				content: "SOT — Stash Or Trash | The Brand Barometer"
			},
			{
				property: "og:description",
				content: "Post anything about a brand and let the community decide: Stash it Or Trash it."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "96x96",
				href: "/favicon-96x96.png"
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/site.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 128,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 127,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 132,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 130,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 126,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$20.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 145,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
				position: "top-center",
				richColors: true
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 146,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OfflineStatus, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 147,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProductionMonitoring, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 148,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 143,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 142,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$18 = () => import("./routes-BhquaRe5.mjs");
var Route$19 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./route-CRRSyPUS.mjs");
var Route$18 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./auth-28xlY-Ld.mjs");
var Route$17 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Stash or Trash" }, {
		name: "description",
		content: "Sign in to post and vote on the Stash or Trash feed."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./awards-DTUWycXA.mjs");
var Route$16 = createFileRoute("/awards")({
	head: () => ({ meta: [
		{ title: "The SOT Awards | Stash Or Trash — The Brand Barometer" },
		{
			name: "description",
			content: "The annual SOT Awards crown the world's most trusted brands — decided entirely by real verdicts from real people. See the live leaderboard."
		},
		{
			property: "og:title",
			content: "The SOT Awards — The People's Verdict, Made Official"
		},
		{
			property: "og:description",
			content: "The most trusted brands, crowned by the crowd. Explore the live leaderboard powering this year's SOT Awards."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./feed-B6mIUwtQ.mjs");
var Route$15 = createFileRoute("/feed")({
	validateSearch: (search) => ({ filter: search.filter === "stash" || search.filter === "trash" || search.filter === "all" ? search.filter : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./privacy-C5kR0LGA.mjs");
var Route$14 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./terms-C5jXYvpa.mjs");
var Route$13 = createFileRoute("/terms")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin-BxZp_2bW.mjs");
var Route$12 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./dashboard-DvISzNiy.mjs");
var Route$11 = createFileRoute("/_authenticated/dashboard")({
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/auth" });
		const [{ data: roles }, { data: memberships }] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", data.user.id), supabase.from("brand_members").select("id").eq("user_id", data.user.id).not("accepted_at", "is", null).limit(1)]);
		if (!((roles ?? []).some((r) => r.role === "brand" || r.role === "admin") || (memberships ?? []).length > 0)) throw redirect({ to: "/profile" });
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./messages-CU822Jmf.mjs");
var Route$10 = createFileRoute("/_authenticated/messages")({
	validateSearch: (search) => ({ to: typeof search.to === "string" ? search.to : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./notifications-BBLpPfPl.mjs");
var Route$9 = createFileRoute("/_authenticated/notifications")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./profile-BjIbRxsI.mjs");
var Route$8 = createFileRoute("/_authenticated/profile")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var { RtcRole, RtcTokenBuilder } = import_agora_token.default;
var TOKEN_TTL_SECONDS = 600;
var Route$7 = createFileRoute("/api/agora-token")({ server: { handlers: { POST: async ({ request }) => {
	const authorization = request.headers.get("authorization");
	const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
	if (!token) return Response.json({ error: "Authentication required" }, { status: 401 });
	const appId = process.env.AGORA_APP_ID;
	const appCertificate = process.env.AGORA_APP_CERTIFICATE;
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
	if (!appId || !appCertificate || !supabaseUrl || !supabaseKey) return Response.json({ error: "Calling service is not configured" }, { status: 503 });
	const supabase = createClient(supabaseUrl, supabaseKey, {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data: { user }, error: userError } = await supabase.auth.getUser(token);
	if (userError || !user) return Response.json({ error: "Invalid session" }, { status: 401 });
	const body = await request.json().catch(() => null);
	if (!body?.partnerId || body.mode !== "voice" && body.mode !== "video") return Response.json({ error: "partnerId and mode are required" }, { status: 400 });
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.partnerId)) return Response.json({ error: "Invalid participant" }, { status: 400 });
	if (body.partnerId === user.id) return Response.json({ error: "Cannot call yourself" }, { status: 400 });
	const { data: relationship, error: relationshipError } = await supabase.from("messages").select("id").or(`and(sender_id.eq.${user.id},recipient_id.eq.${body.partnerId}),and(sender_id.eq.${body.partnerId},recipient_id.eq.${user.id})`).limit(1).maybeSingle();
	if (relationshipError || !relationship) return Response.json({ error: "Call access requires an existing conversation" }, { status: 403 });
	const channelName = `sot-${[user.id, body.partnerId].sort().join("-")}`.slice(0, 63);
	const uid = Math.floor(Math.random() * 2e9) + 1;
	const tokenExpiration = Math.floor(Date.now() / 1e3) + TOKEN_TTL_SECONDS;
	const rtcToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.PUBLISHER, tokenExpiration, tokenExpiration);
	return Response.json({
		appId,
		channelName,
		uid,
		token: rtcToken,
		expiresAt: tokenExpiration,
		mode: body.mode,
		recording: false
	}, { headers: { "cache-control": "no-store" } });
} } } });
var $$splitComponentImporter$6 = () => import("./auth_.callback-FsKcD5pl.mjs");
var Route$6 = createFileRoute("/auth_/callback")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./brands.index-CX6Kq4WU.mjs");
var Route$5 = createFileRoute("/brands/")({
	head: () => ({ meta: [{ title: "Brands — Stash or Trash" }, {
		name: "description",
		content: "Browse a multilingual global directory of brands by country and industry."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./brands._slug-DcXoDPhU.mjs");
var Route$4 = createFileRoute("/brands/$slug")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./hashtags._tag-BtM7NMoS.mjs");
var $$splitErrorComponentImporter$2 = () => import("./hashtags._tag-2nLrO89V.mjs");
var Route$3 = createFileRoute("/hashtags/$tag")({
	head: () => ({ meta: [
		{ title: "Hashtag — SOT · Stash Or Trash" },
		{
			name: "description",
			content: "Every post carrying this hashtag, with the live community verdict on SOT — the Brand Barometer."
		},
		{
			property: "og:title",
			content: "Hashtag — SOT · Stash Or Trash"
		},
		{
			property: "og:description",
			content: "Every post carrying this hashtag, with the live community verdict on SOT."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./items._id-DneS4B_C.mjs");
var $$splitNotFoundComponentImporter$1 = () => import("./items._id-CQPoVuQN.mjs");
var $$splitErrorComponentImporter$1 = () => import("./items._id-CXr1EfYn.mjs");
var Route$2 = createFileRoute("/items/$id")({
	head: () => ({ meta: [
		{ title: "Post — SOT · Stash Or Trash" },
		{
			name: "description",
			content: "See the community verdict on this post — Stash it or Trash it on SOT, the Brand Barometer."
		},
		{
			property: "og:title",
			content: "Post — SOT · Stash Or Trash"
		},
		{
			property: "og:description",
			content: "See the community verdict on this post and cast your own on SOT."
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./users._id-oJ4qDCgf.mjs");
var $$splitNotFoundComponentImporter = () => import("./users._id-DWvMSa9L.mjs");
var $$splitErrorComponentImporter = () => import("./users._id-BpPKCNka.mjs");
var Route$1 = createFileRoute("/users/$id")({
	head: () => ({ meta: [
		{ title: "Profile — SOT · Stash Or Trash" },
		{
			name: "description",
			content: "See this member's verdicts, trust score and posts on SOT — the Brand Barometer built on real people's feedback."
		},
		{
			property: "og:title",
			content: "Profile — SOT · Stash Or Trash"
		},
		{
			property: "og:description",
			content: "See this member's verdicts, trust score and posts on SOT."
		},
		{
			property: "og:type",
			content: "profile"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./brands.new-D4VbLuac.mjs");
var Route = createFileRoute("/_authenticated/brands/new")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (search) => ({ name: typeof search.name === "string" ? search.name : void 0 })
});
var IndexRoute = Route$19.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$20
});
var AuthenticatedRouteRoute = Route$18.update({
	id: "/_authenticated",
	getParentRoute: () => Route$20
});
var AuthRoute = Route$17.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$20
});
var AwardsRoute = Route$16.update({
	id: "/awards",
	path: "/awards",
	getParentRoute: () => Route$20
});
var FeedRoute = Route$15.update({
	id: "/feed",
	path: "/feed",
	getParentRoute: () => Route$20
});
var PrivacyRoute = Route$14.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$20
});
var TermsRoute = Route$13.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$20
});
var AuthenticatedAdminRoute = Route$12.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$11.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMessagesRoute = Route$10.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotificationsRoute = Route$9.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$8.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiAgoraTokenRoute = Route$7.update({
	id: "/api/agora-token",
	path: "/api/agora-token",
	getParentRoute: () => Route$20
});
var AuthCallbackRoute = Route$6.update({
	id: "/auth_/callback",
	path: "/auth/callback",
	getParentRoute: () => Route$20
});
var BrandsIndexRoute = Route$5.update({
	id: "/brands/",
	path: "/brands/",
	getParentRoute: () => Route$20
});
var BrandsSlugRoute = Route$4.update({
	id: "/brands/$slug",
	path: "/brands/$slug",
	getParentRoute: () => Route$20
});
var HashtagsTagRoute = Route$3.update({
	id: "/hashtags/$tag",
	path: "/hashtags/$tag",
	getParentRoute: () => Route$20
});
var ItemsIdRoute = Route$2.update({
	id: "/items/$id",
	path: "/items/$id",
	getParentRoute: () => Route$20
});
var UsersIdRoute = Route$1.update({
	id: "/users/$id",
	path: "/users/$id",
	getParentRoute: () => Route$20
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedMessagesRoute,
	AuthenticatedNotificationsRoute,
	AuthenticatedProfileRoute,
	AuthenticatedBrandsNewRoute: Route.update({
		id: "/brands/new",
		path: "/brands/new",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	AwardsRoute,
	FeedRoute,
	PrivacyRoute,
	TermsRoute,
	ApiAgoraTokenRoute,
	AuthCallbackRoute,
	BrandsSlugRoute,
	HashtagsTagRoute,
	ItemsIdRoute,
	UsersIdRoute,
	BrandsIndexRoute
};
var routeTree = Route$20._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$3 as a, Route$15 as c, Route$2 as i, useAuth as l, Route as n, Route$4 as o, Route$1 as r, Route$10 as s, router_exports as t };
