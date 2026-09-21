import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { A as MessageSquare, Dt as ArrowUpRight, E as Plus, I as LockKeyhole, J as Gavel, Q as FileCheckCorner, S as Search, V as Lightbulb, _t as Check, a as Users, ct as Clock3, dt as CircleCheck, g as SlidersHorizontal, gt as ChevronDown, h as Sparkles, j as MessageSquareText, l as TriangleAlert, mt as ChevronUp, pt as CircleAlert, rt as Download, tt as ExternalLink, u as TrendingUp, v as ShieldCheck, wt as BadgeCheck, xt as Bot, y as ShieldAlert } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-I-3x-i8y.mjs";
import { i as cn, n as Input, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { N as requestVerification, S as fetchMyBrands, a as DialogHeader, c as Header, g as fetchBrandStats, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog, u as Textarea, y as fetchBrandsByIds } from "./Header-E8juhbIs.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { t as PeopleTrustFactor } from "./PeopleTrustFactor-Cldphfb0.mjs";
import { t as BrandLogo } from "./BrandLogo-C_F3Yd2U.mjs";
import { o as getFollowerCount } from "./social-CNdxEfFV.mjs";
import { d as removeBrandMember, f as resolveCrisisAlert, i as fetchBrandMembers, l as fetchOpenCrisisAlert, m as updateBrandMemberRole, o as fetchBrandTopVoices, p as trendToCsv, r as fetchBrandKpis, s as fetchBrandTrend, u as inviteBrandMember } from "./brand-platform-BZ3sz846.mjs";
import { t as Badge } from "./badge-DAskHgZn.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CGKkOepX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$8 = "/app/applet/src/components/ui/select.tsx";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-4 w-4 opacity-50" }, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 29,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 28,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$8,
	lineNumber: 19,
	columnNumber: 3
}, void 0));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronUp, { className: "h-4 w-4" }, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 44,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 39,
	columnNumber: 3
}, void 0));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-4 w-4" }, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 58,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 53,
	columnNumber: 3
}, void 0));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectScrollUpButton, {}, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 79,
			columnNumber: 7
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 80,
			columnNumber: 7
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectScrollDownButton, {}, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 89,
			columnNumber: 7
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName$8,
	lineNumber: 68,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 67,
	columnNumber: 3
}, void 0));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 99,
	columnNumber: 3
}, void 0));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 121,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 120,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 119,
		columnNumber: 5
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItemText, { children }, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 124,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$8,
	lineNumber: 111,
	columnNumber: 3
}, void 0));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 133,
	columnNumber: 3
}, void 0));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var _jsxFileName$7 = "/app/applet/src/components/BrandTeamDialog.tsx";
var ROLES = [
	"admin",
	"analyst",
	"viewer"
];
/** Invite and manage the team that represents one brand. */
function BrandTeamDialog({ brandId, brandName }) {
	const { t } = useTranslation();
	const { user } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("analyst");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: members, refetch } = useQuery({
		queryKey: ["brand-members", brandId],
		queryFn: () => fetchBrandMembers(brandId),
		enabled: open
	});
	const invite = async () => {
		if (!user) return;
		setBusy(true);
		try {
			await inviteBrandMember({
				brandId,
				email,
				role,
				invitedBy: user.id
			});
			setEmail("");
			toast.success(t("brandTeam.invited"));
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("brandTeam.inviteFailed"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				size: "sm",
				variant: "outline",
				className: "gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 67,
						columnNumber: 11
					}, this),
					" ",
					t("brandTeam.team")
				]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 66,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 65,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: t("brandTeam.manageTeam", { brand: brandName }) }, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 72,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 71,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: t("brandTeam.emailPlaceholder"),
						className: "min-w-[12rem] flex-1"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 76,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
						value: role,
						onValueChange: (v) => setRole(v),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
							className: "w-32",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 84,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 83,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
							value: r,
							children: t(`brandTeam.role_${r}`)
						}, r, false, {
							fileName: _jsxFileName$7,
							lineNumber: 88,
							columnNumber: 17
						}, this)) }, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 86,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$7,
						lineNumber: 82,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: invite,
						disabled: busy || !email.trim(),
						children: t("brandTeam.invite")
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 94,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 75,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-muted-foreground",
				children: t("brandTeam.inviteHint")
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 98,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-2 space-y-2",
				children: (members ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: t("brandTeam.noMembers")
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 102,
					columnNumber: 13
				}, this) : (members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-sm font-medium",
							children: m.displayName ?? m.invited_email ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 110,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] text-muted-foreground",
							children: m.accepted_at ? t("brandTeam.active") : t("brandTeam.pending")
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 113,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$7,
						lineNumber: 109,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
							value: m.role,
							onValueChange: async (v) => {
								await updateBrandMemberRole(m.id, v);
								refetch();
							},
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
								className: "h-8 w-28 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 126,
									columnNumber: 23
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 125,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: r,
								children: t(`brandTeam.role_${r}`)
							}, r, false, {
								fileName: _jsxFileName$7,
								lineNumber: 130,
								columnNumber: 25
							}, this)) }, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 128,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 118,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: async () => {
								await removeBrandMember(m.id);
								refetch();
							},
							children: t("brandTeam.remove")
						}, void 0, false, {
							fileName: _jsxFileName$7,
							lineNumber: 136,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$7,
						lineNumber: 117,
						columnNumber: 17
					}, this)]
				}, m.id, true, {
					fileName: _jsxFileName$7,
					lineNumber: 105,
					columnNumber: 15
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 100,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName$7,
			lineNumber: 70,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 64,
		columnNumber: 5
	}, this);
}
var _jsxFileName$6 = "/app/applet/src/components/BrandAnalytics.tsx";
var WINDOWS = [
	7,
	30,
	90
];
/** Phase B — trends, crisis alert banner, top voices and CSV export for one brand. */
function BrandAnalytics({ brandId, brandName }) {
	const { t } = useTranslation();
	const [days, setDays] = (0, import_react.useState)(30);
	const { data: trend } = useQuery({
		queryKey: [
			"brand-trend",
			brandId,
			days
		],
		queryFn: () => fetchBrandTrend(brandId, days)
	});
	const { data: voices } = useQuery({
		queryKey: [
			"brand-voices",
			brandId,
			days
		],
		queryFn: () => fetchBrandTopVoices(brandId, days)
	});
	const { data: alert, refetch: refetchAlert } = useQuery({
		queryKey: ["brand-crisis", brandId],
		queryFn: () => fetchOpenCrisisAlert(brandId)
	});
	const rows = (0, import_react.useMemo)(() => (trend ?? []).map((r) => ({
		...r,
		label: r.day.slice(5)
	})), [trend]);
	const exportCsv = () => {
		const csv = trendToCsv(trend ?? []);
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `sot-${brandName.toLowerCase().replace(/\s+/g, "-")}-${days}d.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const dismiss = async () => {
		if (!alert) return;
		try {
			await resolveCrisisAlert(alert.id);
			await refetchAlert();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("analytics.crisisDismissFailed"));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mt-4 rounded-xl border border-border p-3",
		children: [
			alert && /* @__PURE__ */ (void 0)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-trash/40 bg-trash/10 p-3",
				children: [
					/* @__PURE__ */ (void 0)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-trash" }, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 75,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("p", {
						className: "flex-1 text-sm",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "font-semibold",
								children: t("analytics.crisisTitle")
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 77,
								columnNumber: 13
							}, this),
							" ",
							t("analytics.crisisBody", {
								share: Math.round(Number(alert.negative_share)),
								baseline: Math.round(Number(alert.baseline_share))
							})
						]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 76,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)(Button, {
						size: "sm",
						variant: "outline",
						onClick: dismiss,
						children: t("analytics.crisisDismiss")
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 83,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 74,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: t("analytics.title")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 90,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1",
					children: [WINDOWS.map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: days === w ? "default" : "ghost",
						className: "h-7 px-2 text-xs",
						onClick: () => setDays(w),
						children: t("analytics.days", { count: w })
					}, w, false, {
						fileName: _jsxFileName$6,
						lineNumber: 95,
						columnNumber: 13
					}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-7 gap-1 px-2 text-xs",
						onClick: exportCsv,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 111,
								columnNumber: 13
							}, this),
							" ",
							t("analytics.export")
						]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 105,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 93,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 89,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-3 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mb-1 text-xs text-muted-foreground",
					children: t("analytics.stashPctOverTime")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 118,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-40",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LineChart, {
							data: rows,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
									strokeOpacity: .15,
									vertical: false
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 122,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 10 },
									interval: "preserveStartEnd"
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 123,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
									domain: [0, 100],
									tick: { fontSize: 10 },
									width: 28
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 124,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 125,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Line, {
									type: "monotone",
									dataKey: "stash_pct",
									name: t("analytics.stashPct"),
									stroke: "var(--stash)",
									strokeWidth: 2,
									dot: false
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 126,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 121,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 120,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 119,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 117,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mb-1 text-xs text-muted-foreground",
					children: t("analytics.volumeSentiment")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 140,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-40",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AreaChart, {
							data: rows,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
									strokeOpacity: .15,
									vertical: false
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 144,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 10 },
									interval: "preserveStartEnd"
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 145,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
									tick: { fontSize: 10 },
									width: 28,
									allowDecimals: false
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 146,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 147,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
									type: "monotone",
									dataKey: "positive",
									name: t("brandTeam.positive"),
									stackId: "1",
									stroke: "var(--stash)",
									fill: "var(--stash)",
									fillOpacity: .35
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 148,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
									type: "monotone",
									dataKey: "neutral",
									name: t("brandTeam.neutral"),
									stackId: "1",
									stroke: "var(--muted-foreground)",
									fill: "var(--muted-foreground)",
									fillOpacity: .25
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 157,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
									type: "monotone",
									dataKey: "negative",
									name: t("brandTeam.negative"),
									stackId: "1",
									stroke: "var(--trash)",
									fill: "var(--trash)",
									fillOpacity: .35
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 166,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 143,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 142,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 141,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 139,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 116,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: t("analytics.topVoices")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 182,
					columnNumber: 9
				}, this), (voices ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("analytics.noVoices")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 186,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
					className: "mt-2 divide-y divide-border",
					children: (voices ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "flex items-center gap-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/users/$id",
								params: { id: v.user_id },
								className: "flex-1 truncate font-medium hover:underline",
								children: v.display_name ?? t("analytics.someone")
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 191,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-muted-foreground",
								children: t("analytics.voiceStats", {
									posts: v.posts,
									engagement: v.engagement,
									followers: v.followers
								})
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 198,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-semibold text-stash",
								children: v.trust_score ?? 0
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 205,
								columnNumber: 17
							}, this)
						]
					}, v.user_id, true, {
						fileName: _jsxFileName$6,
						lineNumber: 190,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 188,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 181,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 72,
		columnNumber: 5
	}, this);
}
var _jsxFileName$5 = "/app/applet/src/components/SecureConnectionsPanel.tsx";
var providers = [
	{
		id: "instagram",
		name: "Instagram",
		detail: "Identity and social proof"
	},
	{
		id: "tiktok",
		name: "TikTok",
		detail: "Creator and media verification"
	},
	{
		id: "x",
		name: "X",
		detail: "Public account verification"
	},
	{
		id: "google",
		name: "Google",
		detail: "Account continuity"
	},
	{
		id: "government_id",
		name: "Government ID",
		detail: "Optional high-assurance review"
	}
];
function SecureConnectionsPanel({ userId }) {
	const { data: connections = [] } = useQuery({
		queryKey: ["provider-connections", userId],
		queryFn: async () => {
			const { data, error } = await supabase.from("provider_connections").select("provider,status,last_verified_at").eq("user_id", userId);
			if (error) throw error;
			return data ?? [];
		},
		enabled: Boolean(userId)
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-xl bg-stash/10 p-2 text-stash",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 36,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 35,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs font-extrabold uppercase tracking-[0.18em] text-stash",
						children: "Secure connection layer"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 39,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "mt-1 font-display text-xl font-extrabold",
						children: "Verification providers, ready when you are"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 42,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-sm leading-6 text-muted-foreground",
						children: "Connect trusted signals without exposing provider credentials. Revocation, scopes, and verification timestamps stay auditable."
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 45,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 38,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 34,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5 grid gap-2 sm:grid-cols-2",
				children: providers.map((provider) => {
					const connected = connections.find((item) => item.provider === provider.id)?.status === "connected";
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between gap-3 rounded-xl border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm font-bold",
							children: provider.name
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 61,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: provider.detail
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 62,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 60,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: connected ? "default" : "secondary",
							className: "gap-1 whitespace-nowrap",
							children: [connected ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 69,
								columnNumber: 19
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 71,
								columnNumber: 19
							}, this), connected ? "Connected" : "Provider-ready"]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 64,
							columnNumber: 15
						}, this)]
					}, provider.id, true, {
						fileName: _jsxFileName$5,
						lineNumber: 56,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 51,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "No access tokens are stored in the browser. Live OAuth adapters can be enabled provider by provider."
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 79,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 33,
		columnNumber: 5
	}, this);
}
var _jsxFileName$4 = "/app/applet/src/components/BrandAICopilot.tsx";
var plans = [
	{
		name: "Starter",
		tone: "secondary",
		features: ["Pre-publication text checks", "Basic brand guidance"]
	},
	{
		name: "Growth",
		tone: "default",
		features: [
			"Photo and video review queue",
			"CX response drafts",
			"Sentiment summaries"
		]
	},
	{
		name: "Enterprise",
		tone: "outline",
		features: [
			"Advanced media risk review",
			"Real-time diagnostics",
			"Audit exports and priority review"
		]
	}
];
function BrandAICopilot() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl bg-trash/10 p-2 text-trash",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 32,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 31,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs font-extrabold uppercase tracking-[0.18em] text-trash",
							children: "AI trust workspace"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 35,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-1 font-display text-xl font-extrabold",
							children: "Content gate + brand copilot"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 38,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
							children: "Review AI-edited media, prank products, and risky claims before publication. Then help brands draft useful replies without replacing human accountability."
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 41,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 34,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 30,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
					variant: "outline",
					className: "w-fit gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LockKeyhole, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 48,
						columnNumber: 11
					}, this), " Human review remains in control"]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 47,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 29,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5 grid gap-3 lg:grid-cols-3",
				children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-xl border border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-display font-bold",
							children: plan.name
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 55,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: plan.tone,
							children: plan.name === "Enterprise" ? "Custom" : "Included"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 56,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 54,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: plan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-stash" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 63,
								columnNumber: 19
							}, this), feature]
						}, feature, true, {
							fileName: _jsxFileName$4,
							lineNumber: 62,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 60,
						columnNumber: 13
					}, this)]
				}, plan.name, true, {
					fileName: _jsxFileName$4,
					lineNumber: 53,
					columnNumber: 11
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 51,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 flex items-center gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-4 w-4 text-stash" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 72,
					columnNumber: 9
				}, this), " Every review produces an explainable status, findings, and audit trail—not an unreviewable black box."]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 71,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 28,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/ContentAppealForm.tsx";
function ContentAppealForm({ reviewId }) {
	const { user } = useAuth();
	const [reason, setReason] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	async function submitAppeal() {
		if (!user || reason.trim().length < 10) {
			toast.error("Please explain the appeal in at least 10 characters");
			return;
		}
		setSubmitting(true);
		const { error } = await supabase.from("content_appeals").insert({
			review_id: reviewId,
			appellant_id: user.id,
			reason: reason.trim()
		});
		setSubmitting(false);
		if (error) {
			toast.error("Could not submit appeal");
			return;
		}
		setReason("");
		setOpen(false);
		toast.success("Appeal submitted for human review");
	}
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mt-3 border-t border-border pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			type: "button",
			size: "sm",
			variant: "ghost",
			onClick: () => setOpen((value) => !value),
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Gavel, { className: "h-3.5 w-3.5" }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 41,
				columnNumber: 9
			}, this), " Appeal decision"]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 40,
			columnNumber: 7
		}, this), open && /* @__PURE__ */ (void 0)("div", {
			className: "mt-2 space-y-2",
			children: [/* @__PURE__ */ (void 0)(Textarea, {
				value: reason,
				onChange: (event) => setReason(event.target.value),
				minLength: 10,
				maxLength: 2e3,
				placeholder: "Explain why this decision should be reviewed by a human...",
				"aria-label": "Appeal reason"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 45,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)(Button, {
				type: "button",
				size: "sm",
				onClick: submitAppeal,
				disabled: submitting || reason.trim().length < 10,
				children: submitting ? "Submitting..." : "Submit appeal"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 53,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 44,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 39,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/ContentSafetyGate.tsx";
var initialReviews = [
	{
		id: "review-1",
		type: "Video",
		title: "Customer experience clip",
		status: "needs_review",
		finding: "AI edit disclosure required"
	},
	{
		id: "review-2",
		type: "Product",
		title: "Prank product concept",
		status: "queued",
		finding: "Awaiting safety checks"
	},
	{
		id: "review-3",
		type: "Photo",
		title: "Brand comparison image",
		status: "approved",
		finding: "No material risk detected"
	}
];
function ContentSafetyGate() {
	const [reviews, setReviews] = (0, import_react.useState)(initialReviews);
	const approve = (id) => setReviews((items) => items.map((item) => item.id === id ? {
		...item,
		status: "approved",
		finding: "Approved by human reviewer"
	} : item));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl bg-stash/10 p-2 text-stash",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 46,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 45,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs font-extrabold uppercase tracking-[0.18em] text-stash",
							children: "Pre-publication safety gate"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 49,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-1 font-display text-xl font-extrabold",
							children: "Review before it reaches the public wall"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 52,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
							children: "AI-assisted checks flag manipulated media, undisclosed edits, unsafe pranks, spam, and misleading claims. Human reviewers make the final decision."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 55,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 48,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 44,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
					variant: "outline",
					className: "w-fit gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileCheckCorner, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 62,
						columnNumber: 11
					}, this), " Explainable review queue"]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 61,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 43,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5 space-y-2",
				children: reviews.map((review) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-lg bg-secondary p-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { className: "h-4 w-4 text-trash" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 73,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 72,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm font-bold",
								children: review.title
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 77,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "secondary",
								children: review.type
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 78,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 76,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: review.finding
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 80,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 75,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 71,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: review.status === "approved" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 86,
								columnNumber: 19
							}, this), " Approved"]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 85,
							columnNumber: 17
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								children: review.status === "needs_review" ? "Needs review" : "Queued"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 90,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => approve(review.id),
								children: "Approve"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 93,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ContentAppealForm, { reviewId: review.id }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 96,
								columnNumber: 19
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 89,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 83,
						columnNumber: 13
					}, this)]
				}, review.id, true, {
					fileName: _jsxFileName$2,
					lineNumber: 67,
					columnNumber: 11
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 65,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "Every decision should retain the model findings, reviewer action, timestamp, and appeal path for auditability."
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 103,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 42,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/BrandIntelligencePanel.tsx";
var signalCards = [
	{
		key: "positive",
		label: "Positive experiences",
		icon: CircleCheck,
		tone: "text-emerald-600 bg-emerald-500/10"
	},
	{
		key: "negative",
		label: "Issues to resolve",
		icon: CircleAlert,
		tone: "text-rose-600 bg-rose-500/10"
	},
	{
		key: "neutral",
		label: "Ideas and questions",
		icon: Lightbulb,
		tone: "text-amber-700 bg-amber-500/10"
	}
];
function BrandIntelligencePanel({ kpis }) {
	const answered = Math.max(0, kpis.posts - kpis.unanswered);
	const responseRate = kpis.posts ? Math.round(answered / kpis.posts * 100) : 0;
	const totalSignals = kpis.positive + kpis.neutral + kpis.negative;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm",
		"aria-labelledby": "intelligence-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 text-stash",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 49,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs font-bold uppercase tracking-[0.16em]",
							children: "People intelligence · last 30 days"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 50,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 48,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						id: "intelligence-title",
						className: "mt-2 font-display text-xl font-bold",
						children: "Turn public experience into action"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 54,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: "A transparent view of what people are saying, how quickly the team responds, and where trust can be strengthened. Missing data is shown as missing—not treated as a negative signal."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 57,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 47,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-xl border border-border bg-secondary/50 px-4 py-3 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-2xl font-extrabold",
						children: [responseRate, "%"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 64,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: "response coverage"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 65,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 63,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 46,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-3",
				children: signalCards.map(({ key, label, icon: Icon, tone }) => {
					const value = kpis[key];
					const share = totalSignals ? Math.round(value / totalSignals * 100) : 0;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: cn("rounded-lg p-2", tone),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 77,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 76,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-2xl font-bold",
									children: value
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 79,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 75,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 text-sm font-semibold",
								children: label
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 81,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 h-1.5 overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-full rounded-full bg-foreground/70",
									style: { width: `${share}%` }
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 83,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 82,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [share, "% of classified signals"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 88,
								columnNumber: 15
							}, this)
						]
					}, key, true, {
						fileName: _jsxFileName$1,
						lineNumber: 74,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 69,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Metric, {
						icon: MessageSquareText,
						label: "Total conversations",
						value: kpis.posts
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 95,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Metric, {
						icon: Clock3,
						label: "Median response",
						value: kpis.median_response_minutes ? `${kpis.median_response_minutes} min` : "No data yet"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 96,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Metric, {
						icon: Users,
						label: "Unanswered",
						value: kpis.unanswered,
						accent: kpis.unanswered > 0
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 103,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 94,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "Evidence, methodology, and community context should accompany every public claim."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 112,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					className: "inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-stash",
					children: ["View reporting guide ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 119,
						columnNumber: 32
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 115,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 111,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PeopleTrustFactor, { signals: {
					evidence: Math.min(100, 45 + kpis.posts * 2),
					response: responseRate,
					experience: totalSignals ? Math.round((kpis.positive + kpis.neutral) / totalSignals * 100) : 0,
					trust: responseRate
				} }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 123,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 122,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 42,
		columnNumber: 5
	}, this);
}
function Metric({ icon: Icon, label, value, accent = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center gap-3 rounded-xl border border-border bg-background p-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: cn("h-4 w-4 text-muted-foreground", accent && "text-rose-600") }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 151,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 153,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: cn("font-bold", accent && "text-rose-600"),
			children: value
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 154,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 152,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 150,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/dashboard.tsx?tsr-split=component";
function DashboardPage() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All brands");
	const { data: brands, isLoading, refetch } = useQuery({
		queryKey: ["dashboard-brands", user?.id],
		queryFn: async () => {
			const ids = await fetchActiveManagedBrandIds(user.id);
			if (ids.length > 0) {
				const list = await fetchBrandsByIds(ids.slice(0, 24));
				return ids.slice(0, 24).map((id) => list.find((b) => b.id === id)).filter((b) => !!b);
			}
			return (await fetchMyBrands(user.id)).slice(0, 12);
		},
		enabled: !!user
	});
	const list = brands ?? [];
	const categories = (0, import_react.useMemo)(() => {
		const values = new Set(list.map((brand) => normalizeCategory(brand.category)));
		return ["All brands", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
	}, [list]);
	const filteredBrands = (0, import_react.useMemo)(() => {
		const query = search.trim().toLowerCase();
		return list.filter((brand) => {
			const matchesSearch = !query || `${brand.name} ${brand.category ?? ""} ${brand.country ?? ""}`.toLowerCase().includes(query);
			const matchesCategory = category === "All brands" || normalizeCategory(brand.category) === category;
			return matchesSearch && matchesCategory;
		});
	}, [
		category,
		list,
		search
	]);
	const activeId = selected && filteredBrands.some((brand) => brand.id === selected) ? selected : filteredBrands[0]?.id ?? null;
	const active = filteredBrands.find((b) => b.id === activeId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 66,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-5xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "font-display text-3xl font-extrabold",
						children: t("dashboard.title")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-muted-foreground",
						children: t("dashboard.subtitle")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: () => navigate({ to: "/brands/new" }),
						className: "gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 76,
								columnNumber: 13
							}, this),
							" ",
							t("dashboard.newBrand")
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 68,
					columnNumber: 9
				}, this),
				user && /* @__PURE__ */ (void 0)(SecureConnectionsPanel, { userId: user.id }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 80,
					columnNumber: 18
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandAICopilot, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ContentSafetyGate, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 9
				}, this),
				isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-8 space-y-4",
					children: [0, 1].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-40 w-full rounded-2xl" }, i, false, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 30
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 84,
					columnNumber: 22
				}, this) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-8 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-display text-lg font-semibold",
						children: t("dashboard.noBrands")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						className: "mt-4 gap-1.5",
						onClick: () => navigate({ to: "/brands/new" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 15
							}, this),
							" ",
							t("dashboard.createFirst")
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 88,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 40
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SlidersHorizontal, { className: "h-4 w-4 text-stash" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 98,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-sm font-bold",
									children: "Your brand portfolio"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 99,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Search and filter your active brands without loading the full catalog."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 lg:max-w-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 106,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "sr-only",
										children: "Search brands"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 107,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										value: search,
										onChange: (event) => setSearch(event.target.value),
										placeholder: "Search brands, categories, countries",
										className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 108,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 95,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-4 flex items-center gap-2 overflow-x-auto pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "mr-1 flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: ["Category ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 113,
									columnNumber: 28
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 17
							}, this), categories.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setCategory(item),
								className: cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", category === item ? "border-stash bg-stash/10 text-foreground" : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"),
								children: item
							}, item, false, {
								fileName: _jsxFileName,
								lineNumber: 115,
								columnNumber: 41
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 111,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [filteredBrands.map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setSelected(b.id),
								className: cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors", b.id === activeId ? "border-stash bg-stash/10 font-semibold" : "border-border hover:bg-secondary"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandLogo, {
									name: b.name,
									url: b.signedLogoUrl,
									className: "h-6 w-6 rounded-md text-[10px]"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 121,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: b.name }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 122,
									columnNumber: 21
								}, this)]
							}, b.id, true, {
								fileName: _jsxFileName,
								lineNumber: 120,
								columnNumber: 42
							}, this)), filteredBrands.length === 0 && /* @__PURE__ */ (void 0)("p", {
								className: "py-3 text-sm text-muted-foreground",
								children: "No brands match those filters."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 49
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: active && /* @__PURE__ */ (void 0)(BrandRow, {
						brand: active,
						onVerify: () => refetch()
					}, active.id, false, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 26
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 128,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 20
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 65,
		columnNumber: 10
	}, this);
}
function BrandRow({ brand, onVerify }) {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { data: stats } = useQuery({
		queryKey: ["brand-stats", brand.id],
		queryFn: () => fetchBrandStats(brand.id)
	});
	const { data: followers } = useQuery({
		queryKey: ["brand-followers", brand.id],
		queryFn: () => getFollowerCount({ brandId: brand.id })
	});
	const { data: kpis } = useQuery({
		queryKey: ["brand-kpis", brand.id],
		queryFn: () => fetchBrandKpis(brand.id, 30)
	});
	const askVerify = async () => {
		if (!user) return;
		try {
			await requestVerification({
				brandId: brand.id,
				userId: user.id,
				message: ""
			});
			toast.success(t("brand.verificationPending"));
			onVerify();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Error");
		}
	};
	const total = (stats?.stash ?? 0) + (stats?.trash ?? 0);
	const stashPct = total > 0 ? Math.round(100 * (stats?.stash ?? 0) / total) : 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandLogo, {
				name: brand.name,
				url: brand.signedLogoUrl,
				className: "h-14 w-14 rounded-xl text-lg"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 186,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-lg font-bold",
							children: brand.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 189,
							columnNumber: 13
						}, this), brand.verified ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BadgeCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 191,
									columnNumber: 17
								}, this),
								" ",
								t("dashboard.verified")
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 190,
							columnNumber: 31
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground",
							children: t("dashboard.unverified")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 192,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 11
					}, this),
					brand.category && /* @__PURE__ */ (void 0)("p", {
						className: "text-sm text-muted-foreground",
						children: brand.category
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 196,
						columnNumber: 30
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
								label: t("dashboard.trustScore"),
								value: `${brand.trust_score}`,
								accent: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 199,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
								label: t("dashboard.posts"),
								value: `${stats?.posts ?? 0}`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 200,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
								label: t("dashboard.stash"),
								value: `${stats?.stash ?? 0}`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
								label: t("dashboard.trash"),
								value: `${stats?.trash ?? 0}`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 202,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
								label: t("dashboard.followers"),
								value: `${followers ?? 0}`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 203,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 198,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-3 h-2 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "h-full bg-stash transition-all",
							style: { width: `${stashPct}%` }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 207,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 206,
						columnNumber: 11
					}, this),
					kpis && /* @__PURE__ */ (void 0)(BrandIntelligencePanel, { kpis }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 213,
						columnNumber: 20
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-4 rounded-xl border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: t("brandTeam.kpis")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 216,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 grid grid-cols-2 gap-3 text-center sm:grid-cols-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
										label: t("brandTeam.volume"),
										value: `${kpis?.posts ?? 0}`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 220,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
										label: t("brandTeam.stashPct"),
										value: `${kpis?.stash_pct ?? 0}%`,
										accent: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
										label: t("brandTeam.positive"),
										value: `${kpis?.positive ?? 0}`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 222,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
										label: t("brandTeam.neutral"),
										value: `${kpis?.neutral ?? 0}`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 223,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
										label: t("brandTeam.negative"),
										value: `${kpis?.negative ?? 0}`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 224,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
										label: t("brandTeam.unanswered"),
										value: `${kpis?.unanswered ?? 0}`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 225,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									t("brandTeam.responseTime"),
									": ",
									formatReply(kpis?.median_response_minutes ?? 0, t)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 215,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandAnalytics, {
						brandId: brand.id,
						brandName: brand.name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 232,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandTeamDialog, {
								brandId: brand.id,
								brandName: brand.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 235,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/brands/$slug",
									params: { slug: brand.slug },
									children: t("dashboard.view")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 237,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								asChild: true,
								size: "sm",
								variant: "ghost",
								className: "gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/messages",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 245,
											columnNumber: 17
										}, this),
										" ",
										t("nav.messages")
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 244,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 243,
								columnNumber: 13
							}, this),
							!brand.verified && /* @__PURE__ */ (void 0)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: askVerify,
								children: t("dashboard.requestVerification")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 248,
								columnNumber: 33
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 234,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 187,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 185,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 184,
		columnNumber: 10
	}, this);
}
function Stat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-xl bg-secondary/50 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `font-display text-xl font-extrabold ${accent ? "text-stash" : ""}`,
			children: [accent && /* @__PURE__ */ (void 0)(TrendingUp, { className: "mr-1 inline h-4 w-4" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 267,
				columnNumber: 20
			}, this), value]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 266,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-[11px] text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 270,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 265,
		columnNumber: 10
	}, this);
}
function normalizeCategory(category) {
	if (!category?.trim()) return "Uncategorized";
	const value = category.trim().toLowerCase();
	return [
		[[
			"fast food",
			"fast-food",
			"restaurant",
			"restaurants",
			"food"
		], "Food & Fast Food"],
		[[
			"fashion",
			"clothing",
			"apparel",
			"beauty"
		], "Fashion & Beauty"],
		[[
			"telecom",
			"technology",
			"tech",
			"software",
			"electronics"
		], "Technology & Telecom"],
		[[
			"bank",
			"banking",
			"finance",
			"financial"
		], "Finance & Banking"],
		[[
			"retail",
			"shopping",
			"supermarket",
			"grocery"
		], "Retail & Groceries"],
		[[
			"travel",
			"airline",
			"hotel",
			"hospitality"
		], "Travel & Hospitality"]
	].find(([keywords]) => keywords.some((keyword) => value.includes(keyword)))?.[1] ?? category.trim();
}
function formatReply(minutes, t) {
	if (!minutes) return t("brandTeam.noResponseYet");
	if (minutes < 90) return t("brandTeam.minutes", { count: minutes });
	return t("brandTeam.hours", { count: Math.round(minutes / 60) });
}
//#endregion
export { DashboardPage as component };
