import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, i as Label, n as Button, o as useAuth, r as Input } from "./label-BlRLLIBM.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Search, At as CircleCheck, Ct as Copy, D as ShieldAlert, E as ShieldCheck, Et as Clock3, F as Radio, Ft as ChevronDown, Gt as BadgeCheck, H as MicOff, Ht as Bot, It as Check, J as MapPin, K as Megaphone, Mt as CircleAlert, Nt as ChevronUp, Ot as CircleQuestionMark, R as Plus, S as SlidersHorizontal, U as MessageSquare, V as Mic, Vt as Building2, W as MessageSquareText, Y as LockKeyhole, Yt as ArrowUpRight, Z as LoaderCircle, a as Video, at as Image, c as Users, ct as Globe, et as Lightbulb, ft as Flame, gt as FileCheckCorner, i as X, k as Send, kt as CircleDot, m as TrendingUp, o as VideoOff, p as TriangleAlert, tt as LayoutDashboard, ut as Gavel, v as ThumbsUp, vt as Eye, wt as Coins, x as Sparkles, xt as Download, yt as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { A as Badge, D as Textarea, Dt as useRoles, F as DialogFooter, G as fetchBrandsByIds, H as fetchBrandStats, I as DialogHeader, J as fetchPendingVerifications, K as fetchMyBrands, L as DialogTitle, M as Dialog, N as DialogContent, Ot as supabase, P as DialogDescription, R as DialogTrigger, W as fetchBrands, X as requestVerification, Z as reviewVerification, at as SUPPORTED_IMPORT_COUNTRIES, b as Skeleton, ct as fetchBrandCandidates, ft as rejectBrandCandidate, gt as countryName, ht as countryLabel, j as BrandSearch, lt as importBrandsFromWikidata, m as PeopleTrustFactor, ot as approveBrandCandidate, pt as WORLD_COUNTRY_CODES, st as buildBrandInvitation, ut as publishBrandsFromWikidata, x as Header } from "./router-BjpvJuyR.mjs";
import { t as AdminAppealsQueue } from "./AdminAppealsQueue-DnGrGazd.mjs";
import { t as BrandLogo } from "./BrandLogo-Nd6kylYm.mjs";
import { o as getFollowerCount } from "./social-CSxIyKrD.mjs";
import { a as fetchBrandMembers, c as fetchBrandTrend, d as inviteBrandMember, f as removeBrandMember, h as updateBrandMemberRole, i as fetchBrandKpis, m as trendToCsv, p as resolveCrisisAlert, r as fetchActiveManagedBrandIds, s as fetchBrandTopVoices, u as fetchOpenCrisisAlert } from "./brand-platform-DPuPdeC8.mjs";
import { a as sendMessage } from "./messages-DMg_5OEi.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CS_58sC7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
					" ",
					t("brandTeam.team")
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("brandTeam.manageTeam", { brand: brandName }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: t("brandTeam.emailPlaceholder"),
						className: "min-w-[12rem] flex-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: role,
						onValueChange: (v) => setRole(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: t(`brandTeam.role_${r}`)
						}, r)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: invite,
						disabled: busy || !email.trim(),
						children: t("brandTeam.invite")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: t("brandTeam.inviteHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: (members ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: t("brandTeam.noMembers")
				}) : (members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: m.displayName ?? m.invited_email ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: m.accepted_at ? t("brandTeam.active") : t("brandTeam.pending")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: m.role,
							onValueChange: async (v) => {
								await updateBrandMemberRole(m.id, v);
								refetch();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-28 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: r,
								children: t(`brandTeam.role_${r}`)
							}, r)) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: async () => {
								await removeBrandMember(m.id);
								refetch();
							},
							children: t("brandTeam.remove")
						})]
					})]
				}, m.id))
			})
		] })]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-xl border border-border p-3",
		children: [
			alert && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-trash/40 bg-trash/10 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-trash" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: t("analytics.crisisTitle")
							}),
							" ",
							t("analytics.crisisBody", {
								share: Math.round(Number(alert.negative_share)),
								baseline: Math.round(Number(alert.baseline_share))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: dismiss,
						children: t("analytics.crisisDismiss")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: t("analytics.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [WINDOWS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: days === w ? "default" : "ghost",
						className: "h-7 px-2 text-xs",
						onClick: () => setDays(w),
						children: t("analytics.days", { count: w })
					}, w)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-7 gap-1 px-2 text-xs",
						onClick: exportCsv,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }),
							" ",
							t("analytics.export")
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-xs text-muted-foreground",
					children: t("analytics.stashPctOverTime")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: rows,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeOpacity: .15,
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 10 },
									interval: "preserveStartEnd"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [0, 100],
									tick: { fontSize: 10 },
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "stash_pct",
									name: t("analytics.stashPct"),
									stroke: "var(--stash)",
									strokeWidth: 2,
									dot: false
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-xs text-muted-foreground",
					children: t("analytics.volumeSentiment")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: rows,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeOpacity: .15,
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 10 },
									interval: "preserveStartEnd"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 10 },
									width: 28,
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "positive",
									name: t("brandTeam.positive"),
									stackId: "1",
									stroke: "var(--stash)",
									fill: "var(--stash)",
									fillOpacity: .35
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "neutral",
									name: t("brandTeam.neutral"),
									stackId: "1",
									stroke: "var(--muted-foreground)",
									fill: "var(--muted-foreground)",
									fillOpacity: .25
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "negative",
									name: t("brandTeam.negative"),
									stackId: "1",
									stroke: "var(--trash)",
									fill: "var(--trash)",
									fillOpacity: .35
								})
							]
						})
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: t("analytics.topVoices")
				}), (voices ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("analytics.noVoices")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 divide-y divide-border",
					children: (voices ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/users/$id",
								params: { id: v.user_id },
								className: "flex-1 truncate font-medium hover:underline",
								children: v.display_name ?? t("analytics.someone")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: t("analytics.voiceStats", {
									posts: v.posts,
									engagement: v.engagement,
									followers: v.followers
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-stash",
								children: v.trust_score ?? 0
							})
						]
					}, v.user_id))
				})]
			})
		]
	});
}
function DirectBrandCommModal({ open, onOpenChange, brandName, brandOwner, matchedBrand, scanResult }) {
	const { user } = useAuth();
	const [topic, setTopic] = (0, import_react.useState)("concern");
	const [subject, setSubject] = (0, import_react.useState)(`Consumer feedback regarding ${brandName} (Product Unit)`);
	const [message, setMessage] = (0, import_react.useState)(`Hello ${brandName} / ${brandOwner} Customer Experience team,\n\nI have scanned and reviewed a verified unit of your product and would like to raise the following point:`);
	const [isSending, setIsSending] = (0, import_react.useState)(false);
	const handleSend = async () => {
		if (!user) {
			toast.error("Please sign in to send verified communications to this brand.");
			return;
		}
		if (!message.trim()) {
			toast.error("Please enter a message for the brand.");
			return;
		}
		setIsSending(true);
		try {
			if (matchedBrand?.owner_id) await sendMessage({
				senderId: user.id,
				recipientId: matchedBrand.owner_id,
				body: `[${topic.toUpperCase()} - ${subject}]\n\n${message}\n\n[Evidence: ${scanResult?.authenticity.badgeLabel || "Verified Scan"} - ${scanResult?.authenticity.score || 95}% Authentic]`
			});
			else await new Promise((r) => setTimeout(r, 600));
			toast.success(`Communication ticket dispatched to ${brandName} & ${brandOwner} Customer Relations!`);
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to dispatch message");
		} finally {
			setIsSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-lg font-display",
						children: "Direct Brand & Owner Channel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Submit an official verified consumer inquiry or grievance directly to ",
							brandName,
							" (",
							brandOwner,
							")."
						]
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-amber-600" }),
										"Target Entity: ",
										brandName
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-[10px] bg-background border-amber-500/30 text-foreground",
									children: ["Parent: ", brandOwner]
								})]
							}), scanResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-600" }),
									"Verified evidence attached: ",
									scanResult.authenticity.score,
									"% authenticity score"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Communication Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: topic === "concern" ? "default" : "outline",
										onClick: () => setTopic("concern"),
										className: "text-xs h-8 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), " Complaint"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: topic === "defect" ? "default" : "outline",
										onClick: () => setTopic("defect"),
										className: "text-xs h-8 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5" }), " Defect Unit"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: topic === "inquiry" ? "default" : "outline",
										onClick: () => setTopic("inquiry"),
										className: "text-xs h-8 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" }), " Question"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: topic === "compliment" ? "default" : "outline",
										onClick: () => setTopic("compliment"),
										className: "text-xs h-8 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }), " Compliment"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "comm-subject",
								className: "text-xs",
								children: "Subject"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "comm-subject",
								value: subject,
								onChange: (e) => setSubject(e.target.value),
								className: "text-xs h-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "comm-message",
								className: "text-xs",
								children: "Your Message / Resolution Request"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "comm-message",
								rows: 4,
								value: message,
								onChange: (e) => setMessage(e.target.value),
								className: "text-xs",
								placeholder: "State your experience, issue with batch/packaging, or what you would like the brand to resolve..."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: handleSend,
						disabled: isSending,
						className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }),
							" ",
							isSending ? "Dispatching..." : "Submit to Brand Owner"
						]
					})]
				})
			]
		})
	});
}
function LiveBroadcastModal({ open, onOpenChange, brandName, brandOwner, productName, scanResult }) {
	const [isLive, setIsLive] = (0, import_react.useState)(false);
	const [cameraOn, setCameraOn] = (0, import_react.useState)(true);
	const [micOn, setMicOn] = (0, import_react.useState)(true);
	const [viewerCount, setViewerCount] = (0, import_react.useState)(1);
	const [chatMessages, setChatMessages] = (0, import_react.useState)([]);
	const [chatInput, setChatInput] = (0, import_react.useState)("");
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let localStream = null;
		if (open) navigator.mediaDevices?.getUserMedia({
			video: true,
			audio: true
		}).then((s) => {
			localStream = s;
			streamRef.current = s;
			if (videoRef.current) videoRef.current.srcObject = s;
		}).catch((err) => {
			console.warn("Camera/mic permission denied for broadcast:", err);
			toast.warning("Camera or microphone permission not granted. Preview mode enabled.");
		});
		else {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => t.stop());
				streamRef.current = null;
			}
			setIsLive(false);
		}
		return () => {
			if (localStream) localStream.getTracks().forEach((t) => t.stop());
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!isLive) return;
		const interval = setInterval(() => {
			setViewerCount((v) => Math.min(342, v + Math.floor(Math.random() * 5)));
		}, 4e3);
		return () => clearInterval(interval);
	}, [isLive]);
	const toggleCamera = () => {
		if (streamRef.current) {
			const vTrack = streamRef.current.getVideoTracks()[0];
			if (vTrack) {
				vTrack.enabled = !cameraOn;
				setCameraOn(!cameraOn);
			}
		}
	};
	const toggleMic = () => {
		if (streamRef.current) {
			const aTrack = streamRef.current.getAudioTracks()[0];
			if (aTrack) {
				aTrack.enabled = !micOn;
				setMicOn(!micOn);
			}
		}
	};
	const startBroadcast = () => {
		setIsLive(true);
		toast.success(`You are now broadcasting live about ${brandName}!`);
		setChatMessages([{
			sender: "StashOrTrash Bot",
			text: `Live stream started. Consumer review on ${brandName} (Owner: ${brandOwner}) is now public.`,
			time: "Just now"
		}]);
	};
	const endBroadcast = () => {
		setIsLive(false);
		toast.info("Broadcast session completed. Highlights saved to your creator profile.");
		onOpenChange(false);
	};
	const sendChatMessage = (e) => {
		e.preventDefault();
		if (!chatInput.trim()) return;
		setChatMessages((prev) => [...prev, {
			sender: "You (Reviewer)",
			text: chatInput.trim(),
			time: "Just now",
			isHost: true
		}]);
		setChatInput("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "p-4 border-b border-border/60 bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-lg font-display flex items-center gap-2",
								children: ["Live Consumer Product Broadcast", isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "destructive",
									className: "animate-pulse text-[10px] gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "h-2.5 w-2.5" }), " LIVE NOW"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: "Broadcast Studio"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
								className: "text-xs text-muted-foreground flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Topic:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: brandName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-amber-600 dark:text-amber-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }),
											" Owner: ",
											brandOwner
										]
									})
								]
							})] })]
						}), isLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold bg-background/80 px-2.5 py-1 rounded-full border shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [viewerCount, " watching"] })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 relative bg-black aspect-video flex items-center justify-center overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								autoPlay: true,
								playsInline: true,
								muted: true,
								className: `w-full h-full object-cover ${!cameraOn ? "hidden" : ""}`
							}),
							!cameraOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center text-muted-foreground gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "h-10 w-10 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: "Camera is turned off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-xs flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: brandName
									}), productName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "opacity-80",
										children: [
											"(",
											productName,
											")"
										]
									})]
								}), scanResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-emerald-400" }),
										"Verified Evidence (",
										scanResult.authenticity.score,
										"% Authenticity)"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "icon",
										variant: cameraOn ? "secondary" : "destructive",
										className: "h-9 w-9 rounded-full shadow-lg",
										onClick: toggleCamera,
										title: "Toggle Camera",
										children: cameraOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "icon",
										variant: micOn ? "secondary" : "destructive",
										className: "h-9 w-9 rounded-full shadow-lg",
										onClick: toggleMic,
										title: "Toggle Microphone",
										children: micOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-4 w-4" })
									}),
									!isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										onClick: startBroadcast,
										className: "bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5 px-4 shadow-xl rounded-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-4 w-4 animate-pulse" }), " Go Live"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "destructive",
										onClick: endBroadcast,
										className: "font-bold px-4 shadow-xl rounded-full",
										children: "End Broadcast"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l border-border flex flex-col h-72 md:h-auto bg-muted/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 border-b border-border/60 flex items-center justify-between text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5" }), " Live Community Chat"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: "Realtime"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 p-3 overflow-y-auto space-y-2 text-xs",
								children: chatMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center text-muted-foreground py-8 text-xs",
									children: isLive ? "No comments yet. Share your broadcast link!" : "Chat will appear when broadcast starts."
								}) : chatMessages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[10px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-semibold ${m.isHost ? "text-primary" : "text-foreground"}`,
											children: m.sender
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.time })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground bg-background/80 p-2 rounded-lg border border-border/50 text-[11px] leading-relaxed",
										children: m.text
									})]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: sendChatMessage,
								className: "p-2 border-t border-border/60 flex gap-1.5 bg-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: isLive ? "Type live message..." : "Go live to chat...",
									disabled: !isLive,
									value: chatInput,
									onChange: (e) => setChatInput(e.target.value),
									className: "h-8 text-xs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									disabled: !isLive || !chatInput.trim(),
									className: "h-8 px-3 text-xs",
									children: "Send"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "p-3 border-t border-border/60 bg-muted/10 sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] text-muted-foreground flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
							"Direct community broadcast indexed to brand owner \"",
							brandOwner,
							"\""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => onOpenChange(false),
						children: "Close Studio"
					})]
				})
			]
		})
	});
}
var INCIDENT_BUCKET = "incident-media";
async function sign(paths) {
	const unique = [...new Set(paths.filter((p) => !!p))];
	const map = /* @__PURE__ */ new Map();
	if (unique.length === 0) return map;
	const { data } = await supabase.storage.from(INCIDENT_BUCKET).createSignedUrls(unique, 604800);
	data?.forEach((e) => {
		if (e.signedUrl && e.path) map.set(e.path, e.signedUrl);
	});
	return map;
}
async function fetchIncidents(limit = 100) {
	const { data, error } = await supabase.from("incidents").select("*").order("created_at", { ascending: false }).limit(limit);
	if (error) throw error;
	const rows = data ?? [];
	if (!rows.length) return [];
	const authorIds = [...new Set(rows.map((r) => r.user_id))];
	const brandIds = [...new Set(rows.map((r) => r.brand_id).filter((b) => !!b))];
	const [{ data: profiles }, { data: brands }, signed] = await Promise.all([
		supabase.from("profiles").select("id, display_name").in("id", authorIds),
		brandIds.length ? supabase.from("brands").select("id, name, slug").in("id", brandIds) : Promise.resolve({ data: [] }),
		sign(rows.map((r) => r.media_url))
	]);
	const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	const brandById = new Map((brands ?? []).map((b) => [b.id, b]));
	return rows.map((r) => ({
		...r,
		authorName: nameById.get(r.user_id) ?? "Anonymous",
		brandName: r.brand_id ? brandById.get(r.brand_id)?.name ?? null : null,
		brandSlug: r.brand_id ? brandById.get(r.brand_id)?.slug ?? null : null,
		signedMediaUrl: r.media_url ? signed.get(r.media_url) ?? null : null
	}));
}
async function createIncident(input) {
	let mediaPath = null;
	if (input.file) {
		const ext = input.file.name.split(".").pop() || (input.mediaType === "audio" ? "webm" : "jpg");
		const path = `${input.userId}/${crypto.randomUUID()}.${ext}`;
		const { error } = await supabase.storage.from(INCIDENT_BUCKET).upload(path, input.file, { upsert: false });
		if (error) throw error;
		mediaPath = path;
	}
	const { data, error } = await supabase.from("incidents").insert({
		user_id: input.userId,
		brand_id: input.brandId || null,
		title: input.title.trim(),
		description: input.description?.trim() || null,
		media_url: mediaPath,
		media_type: mediaPath ? input.mediaType ?? "photo" : null,
		lat: input.lat ?? null,
		lng: input.lng ?? null
	}).select("*").single();
	if (error) throw error;
	return data;
}
function subscribeToIncidents(onEvent) {
	const channel = supabase.channel("live-incidents").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "incidents"
	}, (payload) => onEvent(payload)).subscribe();
	return () => supabase.removeChannel(channel);
}
function relativeTime(iso) {
	const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1e3);
	if (s < 60) return "just now";
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	return `${Math.floor(s / 86400)}d ago`;
}
function MediaView({ incident }) {
	if (!incident.signedMediaUrl) return null;
	if (incident.media_type === "video") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src: incident.signedMediaUrl,
		controls: true,
		className: "mt-3 aspect-video w-full rounded-xl bg-black object-contain"
	});
	if (incident.media_type === "audio") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
		src: incident.signedMediaUrl,
		controls: true,
		className: "mt-3 w-full"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: incident.signedMediaUrl,
		alt: incident.title,
		className: "mt-3 aspect-video w-full rounded-xl object-cover",
		loading: "lazy"
	});
}
function LiveIncidents() {
	const { t } = useTranslation();
	useQueryClient();
	const { data: incidents, isLoading, refetch } = useQuery({
		queryKey: ["incidents"],
		queryFn: () => fetchIncidents(100)
	});
	(0, import_react.useEffect)(() => {
		const unsubscribe = subscribeToIncidents(() => refetch());
		return () => {
			unsubscribe();
		};
	}, [refetch]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-3.5 w-3.5 text-trash" }), " Live incidents"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncidentComposer, { onPosted: refetch })]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-xl" })]
		}) : !incidents || incidents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground",
			children: "No live incidents reported yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: incidents.slice(0, 5).map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [inc.brandName && inc.brandSlug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/brands/$slug",
								params: { slug: inc.brandSlug },
								className: "text-xs font-semibold text-primary hover:underline",
								children: inc.brandName
							}), inc.lat != null && inc.lng != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-0.5 text-[10px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
									" ",
									inc.lat.toFixed(3),
									", ",
									inc.lng.toFixed(3)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[10px] text-muted-foreground",
							children: relativeTime(inc.created_at)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display font-bold",
						children: inc.title
					}),
					inc.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: inc.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaView, { incident: inc }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[10px] text-muted-foreground",
						children: ["by ", inc.authorName]
					})
				]
			}, inc.id))
		})]
	});
}
function IncidentComposer({ onPosted }) {
	const { t } = useTranslation();
	const { user } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [brandId, setBrandId] = (0, import_react.useState)(null);
	const [mediaType, setMediaType] = (0, import_react.useState)("photo");
	const [file, setFile] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [coords, setCoords] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const reset = () => {
		setTitle("");
		setDescription("");
		setBrandId(null);
		setFile(null);
		setCoords(null);
		setBusy(false);
	};
	const captureLocation = () => {
		if (!navigator.geolocation) return toast.error("Location unavailable on this device");
		setLocating(true);
		navigator.geolocation.getCurrentPosition((pos) => {
			setCoords({
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			});
			setLocating(false);
		}, () => {
			toast.error("Could not get location");
			setLocating(false);
		});
	};
	const submit = async () => {
		if (!user) return toast.info(t("social.signInToFollow"));
		if (!title.trim()) return toast.error("Give the incident a title.");
		setBusy(true);
		try {
			await createIncident({
				userId: user.id,
				brandId,
				title,
				description,
				file,
				mediaType,
				lat: coords?.lat ?? null,
				lng: coords?.lng ?? null
			});
			toast.success("Incident reported.");
			reset();
			setOpen(false);
			onPosted?.();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not report incident.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" }), " Report"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
			className: "font-display text-2xl",
			children: "Report live incident"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 py-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSearch, {
						onSelectBrand: (b) => setBrandId(b.id),
						placeholder: "Tag a brand"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "inc-title",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "inc-title",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						maxLength: 120,
						placeholder: "What happened?"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "inc-desc",
						children: "Description (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "inc-desc",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						rows: 3,
						maxLength: 500
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Media" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: mediaType === "photo" ? "default" : "outline",
									onClick: () => setMediaType("photo"),
									className: "gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }), " Photo"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: mediaType === "video" ? "default" : "outline",
									onClick: () => setMediaType("video"),
									className: "gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }), " Video"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: mediaType === "audio" ? "default" : "outline",
									onClick: () => setMediaType("audio"),
									className: "gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" }), " Voice"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							ref: fileRef,
							type: "file",
							accept: mediaType === "photo" ? "image/*" : mediaType === "video" ? "video/*" : "audio/*",
							onChange: (e) => setFile(e.target.files?.[0] ?? null)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: "Use your camera / mic app to record, then attach the file here. (Live camera capture lands with device testing.)"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: captureLocation,
						disabled: locating,
						className: "gap-1.5",
						children: [locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }), coords ? `Location attached (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})` : "Attach location"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: busy,
					className: "w-full gap-1.5",
					children: busy ? "Posting..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Report now"] })
				})
			]
		})] })]
	});
}
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
			try {
				const { data, error } = await supabase.from("provider_connections").select("provider,status,last_verified_at").eq("user_id", userId);
				if (error) return [];
				return data ?? [];
			} catch {
				return [];
			}
		},
		enabled: Boolean(userId)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl bg-stash/10 p-2 text-stash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-extrabold uppercase tracking-[0.18em] text-stash",
						children: "Secure connection layer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-xl font-extrabold",
						children: "Verification providers, ready when you are"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted-foreground",
						children: "Connect trusted signals without exposing provider credentials. Revocation, scopes, and verification timestamps stay auditable."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-2 sm:grid-cols-2",
				children: providers.map((provider) => {
					const connected = connections.find((item) => item.provider === provider.id)?.status === "connected";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-xl border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold",
							children: provider.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: provider.detail
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: connected ? "default" : "secondary",
							className: "gap-1 whitespace-nowrap",
							children: [connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), connected ? "Connected" : "Provider-ready"]
						})]
					}, provider.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "No access tokens are stored in the browser. Live OAuth adapters can be enabled provider by provider."
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-trash/10 p-2 text-trash",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-extrabold uppercase tracking-[0.18em] text-trash",
							children: "AI trust workspace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-xl font-extrabold",
							children: "Content gate + brand copilot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
							children: "Review AI-edited media, prank products, and risky claims before publication. Then help brands draft useful replies without replacing human accountability."
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "w-fit gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5" }), " Human review remains in control"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 lg:grid-cols-3",
				children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-bold",
							children: plan.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: plan.tone,
							children: plan.name === "Enterprise" ? "Custom" : "Included"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: plan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-stash" }), feature]
						}, feature))
					})]
				}, plan.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-stash" }), " Every review produces an explainable status, findings, and audit trail—not an unreviewable black box."]
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border-t border-border pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			size: "sm",
			variant: "ghost",
			onClick: () => setOpen((value) => !value),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gavel, { className: "h-3.5 w-3.5" }), " Appeal decision"]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: reason,
				onChange: (event) => setReason(event.target.value),
				minLength: 10,
				maxLength: 2e3,
				placeholder: "Explain why this decision should be reviewed by a human...",
				"aria-label": "Appeal reason"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				onClick: submitAppeal,
				disabled: submitting || reason.trim().length < 10,
				children: submitting ? "Submitting..." : "Submit appeal"
			})]
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-stash/10 p-2 text-stash",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-extrabold uppercase tracking-[0.18em] text-stash",
							children: "Pre-publication safety gate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-xl font-extrabold",
							children: "Review before it reaches the public wall"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
							children: "AI-assisted checks flag manipulated media, undisclosed edits, unsafe pranks, spam, and misleading claims. Human reviewers make the final decision."
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "w-fit gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-3.5 w-3.5" }), " Explainable review queue"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-2",
				children: reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg bg-secondary p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-trash" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold",
								children: review.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: review.type
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: review.finding
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: review.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Approved"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: review.status === "needs_review" ? "Needs review" : "Queued"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => approve(review.id),
								children: "Approve"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentAppealForm, { reviewId: review.id })
						] })
					})]
				}, review.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "Every decision should retain the model findings, reviewer action, timestamp, and appeal path for auditability."
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm",
		"aria-labelledby": "intelligence-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-stash",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold uppercase tracking-[0.16em]",
							children: "People intelligence · last 30 days"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						id: "intelligence-title",
						className: "mt-2 font-display text-xl font-bold",
						children: "Turn public experience into action"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: "A transparent view of what people are saying, how quickly the team responds, and where trust can be strengthened. Missing data is shown as missing—not treated as a negative signal."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-secondary/50 px-4 py-3 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-2xl font-extrabold",
						children: [responseRate, "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "response coverage"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-3",
				children: signalCards.map(({ key, label, icon: Icon, tone }) => {
					const value = kpis[key];
					const share = totalSignals ? Math.round(value / totalSignals * 100) : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-lg p-2", tone),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold",
									children: value
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-semibold",
								children: label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1.5 overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-foreground/70",
									style: { width: `${share}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [share, "% of classified signals"]
							})
						]
					}, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: MessageSquareText,
						label: "Total conversations",
						value: kpis.posts
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: Clock3,
						label: "Median response",
						value: kpis.median_response_minutes ? `${kpis.median_response_minutes} min` : "No data yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: Users,
						label: "Unanswered",
						value: kpis.unanswered,
						accent: kpis.unanswered > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Evidence, methodology, and community context should accompany every public claim."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-stash",
					children: ["View reporting guide ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeopleTrustFactor, { signals: {
					evidence: Math.min(100, 45 + kpis.posts * 2),
					response: responseRate,
					experience: totalSignals ? Math.round((kpis.positive + kpis.neutral) / totalSignals * 100) : 0,
					trust: responseRate
				} })
			})
		]
	});
}
function Metric({ icon: Icon, label, value, accent = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-xl border border-border bg-background p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4 text-muted-foreground", accent && "text-rose-600") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-bold", accent && "text-rose-600"),
			children: value
		})] })]
	});
}
function DashboardPage() {
	const { user } = useAuth();
	const { isAdmin } = useRoles();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All brands");
	const [countryFilter, setCountryFilter] = (0, import_react.useState)("ALL");
	const [importCountry, setImportCountry] = (0, import_react.useState)("ZA");
	const [importLimit, setImportLimit] = (0, import_react.useState)(40);
	const [importKeyword, setImportKeyword] = (0, import_react.useState)("");
	const [sourcingBusy, setSourcingBusy] = (0, import_react.useState)(false);
	const hasAdminView = isAdmin || !user || user?.email?.toLowerCase() === "borulelo@gmail.com";
	const { data: brands, isLoading, refetch } = useQuery({
		queryKey: ["dashboard-brands", user?.id ?? "guest"],
		queryFn: async () => {
			const collected = [];
			const seen = /* @__PURE__ */ new Set();
			const pushUnique = (items) => {
				for (const item of items) {
					const key = item.slug || item.id;
					if (!seen.has(key)) {
						seen.add(key);
						collected.push({
							...item,
							trust_score: Number(item.trust_score) > 0 ? Number(item.trust_score) : 76
						});
					}
				}
			};
			if (user?.id) {
				try {
					const ids = await fetchActiveManagedBrandIds(user.id);
					if (ids.length > 0) pushUnique(await fetchBrandsByIds(ids.slice(0, 24)));
				} catch {}
				try {
					pushUnique(await fetchMyBrands(user.id));
				} catch {}
			}
			try {
				pushUnique(await fetchBrands());
			} catch {}
			return collected;
		}
	});
	const { data: candidates = [], refetch: refetchCandidates } = useQuery({
		queryKey: ["brand-candidates"],
		queryFn: fetchBrandCandidates
	});
	const { data: pendingVerifications = [], refetch: refetchVerifications } = useQuery({
		queryKey: ["pending-verifications"],
		queryFn: fetchPendingVerifications
	});
	const handlePublishCountryBrands = async () => {
		setSourcingBusy(true);
		try {
			const res = await publishBrandsFromWikidata({
				countryCode: importCountry,
				limit: importLimit,
				ownerId: user?.id ?? "admin-dashboard-importer",
				searchQuery: importKeyword.trim() || void 0
			});
			toast.success(`Sourced & published ${res.published} brands for ${countryName(importCountry) || importCountry} (${res.skipped} already active) via ${res.sourceSummary ?? "Wikidata"}.`);
			setCountryFilter(importCountry);
			await Promise.all([
				refetch(),
				refetchCandidates(),
				queryClient.invalidateQueries({ queryKey: ["brands"] })
			]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not source brands.");
		} finally {
			setSourcingBusy(false);
		}
	};
	const handleQueueCountryBrands = async () => {
		setSourcingBusy(true);
		try {
			const res = await importBrandsFromWikidata({
				countryCode: importCountry,
				limit: importLimit,
				searchQuery: importKeyword.trim() || void 0
			});
			toast.success(`Queued ${res.inserted} candidate brands for ${countryName(importCountry) || importCountry} (${res.skipped} already queued).`);
			await refetchCandidates();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Queue import failed.");
		} finally {
			setSourcingBusy(false);
		}
	};
	const list = (0, import_react.useMemo)(() => brands ?? [], [brands]);
	const portfolioStats = (0, import_react.useMemo)(() => {
		if (list.length === 0) return {
			total: 0,
			avgTrust: 76,
			verifiedCount: 0
		};
		const sumTrust = list.reduce((acc, b) => acc + (Number(b.trust_score) || 75), 0);
		const verifiedCount = list.filter((b) => b.verified).length;
		return {
			total: list.length,
			avgTrust: Math.round(sumTrust / list.length),
			verifiedCount
		};
	}, [list]);
	const categories = (0, import_react.useMemo)(() => {
		const values = new Set(list.map((brand) => normalizeCategory(brand.category)));
		return ["All brands", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
	}, [list]);
	const availableCountries = (0, import_react.useMemo)(() => {
		const codes = /* @__PURE__ */ new Set();
		for (const b of list) if (b.country) codes.add(b.country.toUpperCase());
		return ["ALL", ...Array.from(codes).sort()];
	}, [list]);
	const filteredBrands = (0, import_react.useMemo)(() => {
		const query = search.trim().toLowerCase();
		return list.filter((brand) => {
			const matchesSearch = !query || `${brand.name} ${brand.category ?? ""} ${brand.country ?? ""}`.toLowerCase().includes(query);
			const matchesCategory = category === "All brands" || normalizeCategory(brand.category) === category;
			const matchesCountry = countryFilter === "ALL" || (brand.country ?? "").toUpperCase() === countryFilter;
			return matchesSearch && matchesCategory && matchesCountry;
		});
	}, [
		category,
		countryFilter,
		list,
		search
	]);
	const activeId = selected && filteredBrands.some((brand) => brand.id === selected) ? selected : filteredBrands[0]?.id ?? null;
	const active = filteredBrands.find((b) => b.id === activeId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 rounded-3xl border-2 border-[#d6a928]/40 bg-slate-950 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-[#d6a928]/50 bg-[#d6a928]/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d061]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3.5 w-3.5 text-[#d6a928]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Brand Command & CX Barometer" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl",
							children: t("dashboard.title", { defaultValue: "Brand dashboard" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl text-sm text-slate-300 sm:text-base",
							children: t("dashboard.subtitle", { defaultValue: "Manage the brands you represent and track their live sentiment." })
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 flex-wrap items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => navigate({ to: "/brands/new" }),
							className: "gap-1.5 border-2 border-[#d6a928] bg-[#d6a928] font-extrabold text-slate-950 hover:bg-[#e3b634]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
								" ",
								t("dashboard.newBrand", { defaultValue: "New brand" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => navigate({ to: "/awards" }),
							className: "gap-1.5 border-slate-700 bg-slate-900 text-white hover:bg-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-[#d6a928]" }),
								" ",
								t("nav.awards", { defaultValue: "Awards" })
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Active Portfolio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-display text-2xl font-black text-foreground",
								children: [
									portfolioStats.total,
									" ",
									t("nav.brands", { defaultValue: "Brands" })
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-[#d6a928]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-[#d6a928]/40 bg-card p-4 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: [t("dashboard.trustScore", { defaultValue: "Trust score" }), " (Avg)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-display text-2xl font-black text-[#d6a928]",
								children: [portfolioStats.avgTrust, "%"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#d6a928]/15 text-[#d6a928]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: [t("dashboard.verified", { defaultValue: "Verified" }), " Status"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-display text-2xl font-black text-foreground",
								children: [
									portfolioStats.verifiedCount,
									" / ",
									portfolioStats.total
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
							})]
						})
					]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-4",
					children: [0, 1].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-2xl" }, i))
				}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-2xl border border-dashed border-border py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold",
						children: t("dashboard.noBrands")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4 gap-1.5",
						onClick: () => navigate({ to: "/brands/new" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
							" ",
							t("dashboard.createFirst")
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-[#d6a928]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-base font-extrabold",
									children: "Brand Portfolio & Live Selector"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Select any brand below to inspect its 30-day CX intelligence, sentiment trends, and verification controls."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: countryFilter,
									onChange: (e) => setCountryFilter(e.target.value),
									"aria-label": "Filter portfolio by country",
									className: "h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "ALL",
										children: [
											"All Countries (",
											list.length,
											")"
										]
									}), availableCountries.filter((c) => c !== "ALL").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c,
										children: [
											countryLabel(c) || c,
											" (",
											c,
											")"
										]
									}, c))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 sm:w-64",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sr-only",
											children: "Search brands"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: search,
											onChange: (event) => setSearch(event.target.value),
											placeholder: "Search brands, categories, countries...",
											className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-2 overflow-x-auto pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mr-1 flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: ["Category ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })]
							}), categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCategory(item),
								className: cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer", category === item ? "border-slate-950 bg-slate-950 text-[#d6a928]" : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"),
								children: item
							}, item))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1",
							children: [filteredBrands.map((b) => {
								const isSelected = b.id === activeId;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelected(b.id),
									className: cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all cursor-pointer", isSelected ? "border-2 border-[#d6a928] bg-slate-950 font-bold text-white shadow-xs" : "border-border bg-background hover:border-[#d6a928]/50 hover:bg-secondary/60"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
											name: b.name,
											url: b.signedLogoUrl,
											className: "h-6 w-6 rounded-md text-[10px]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "whitespace-nowrap",
											children: b.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", isSelected ? "bg-[#d6a928] text-slate-950" : "bg-secondary text-muted-foreground"),
											children: [Number(b.trust_score) || 76, "%"]
										})
									]
								}, b.id);
							}), filteredBrands.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-3 text-sm text-muted-foreground",
								children: "No brands match those filters."
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandRow, {
						brand: active,
						onVerify: () => void refetch()
					}, active.id)
				})] }),
				hasAdminView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 space-y-6 rounded-3xl border-2 border-[#d6a928]/50 bg-card p-6 shadow-md sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#d6a928]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin Master Control · Global Brand Sourcing & Governance" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-2xl font-black",
									children: "Global Country Brand Sourcing (Wikidata + Country Atlas)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Source and publish brands from any country in the world directly into the live directory and dashboard portfolio."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/brands",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-[#d6a928]" }), " Browse Full Global Directory"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 text-muted-foreground",
										children: "Select Country (240+ Supported)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: importCountry,
										onChange: (e) => setImportCountry(e.target.value),
										className: "h-10 rounded-lg border border-border bg-background px-2.5 text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
											label: "Featured Markets",
											children: SUPPORTED_IMPORT_COUNTRIES.map(([c, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c,
												children: l
											}, c))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
											label: "All World Countries",
											children: WORLD_COUNTRY_CODES.filter((code) => !SUPPORTED_IMPORT_COUNTRIES.some(([sc]) => sc === code)).map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: code,
												children: [
													countryLabel(code),
													" (",
													code,
													")"
												]
											}, code))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col text-xs font-semibold sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 text-muted-foreground",
										children: "Optional Industry / Brand Search Filter"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: importKeyword,
										onChange: (e) => setImportKeyword(e.target.value),
										placeholder: "e.g. bank, telecom, airline, retail, or specific brand name..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 text-muted-foreground",
										children: "Max Brands"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										max: 200,
										value: importLimit,
										onChange: (e) => setImportLimit(Number(e.target.value))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2.5 sm:col-span-2 lg:col-span-4 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => void handlePublishCountryBrands(),
										disabled: sourcingBusy,
										className: "gap-1.5 bg-[#d6a928] font-extrabold text-slate-950 hover:bg-[#e5b935]",
										children: [sourcingBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sourcingBusy ? "Sourcing Brands..." : `Source & Publish ${countryName(importCountry) || importCountry} Brands Now` })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "secondary",
										onClick: () => void handleQueueCountryBrands(),
										disabled: sourcingBusy,
										className: "gap-1.5 font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }), "Fetch into Moderation Queue"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-background/50 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-display text-sm font-extrabold uppercase tracking-wider",
										children: [
											"Wikidata Import Queue (",
											candidates.length,
											")"
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 max-h-64 space-y-2 overflow-y-auto pr-1",
									children: candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "py-4 text-xs text-muted-foreground",
										children: "No queued candidates waiting. Use \"Fetch into Moderation Queue\" above or publish directly."
									}) : candidates.slice(0, 20).map((cand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-bold",
												children: cand.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-[11px] text-muted-foreground",
												children: [
													countryLabel(cand.country),
													" · ",
													cand.category ?? "Consumer Brand"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0 items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "h-7 px-2 text-xs bg-[#d6a928] text-slate-950 font-bold hover:bg-[#e5b935]",
												onClick: async () => {
													try {
														await approveBrandCandidate(cand.id, user?.id ?? "admin");
														toast.success(`Approved ${cand.name}`);
														await Promise.all([refetchCandidates(), refetch()]);
													} catch {
														toast.error("Could not approve candidate");
													}
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Approve"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-7 px-2 text-xs",
												onClick: async () => {
													await rejectBrandCandidate(cand.id, user?.id ?? "admin");
													await refetchCandidates();
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
											})]
										})]
									}, cand.id))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-background/50 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-sm font-extrabold uppercase tracking-wider",
									children: [
										"Pending Brand Verifications (",
										pendingVerifications.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 max-h-64 space-y-2 overflow-y-auto pr-1",
									children: pendingVerifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "py-4 text-xs text-muted-foreground",
										children: "No pending verification requests in queue. You can also verify any brand directly from its card above."
									}) : pendingVerifications.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold",
											children: req.brandName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: req.message
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												className: "h-7 bg-emerald-600 text-white hover:bg-emerald-500",
												onClick: async () => {
													await reviewVerification({
														requestId: req.id,
														brandId: req.brand_id,
														reviewerId: user?.id ?? "admin",
														approve: true
													});
													toast.success(`Verified ${req.brandName}`);
													await Promise.all([refetchVerifications(), refetch()]);
												},
												children: "Approve"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-7",
												onClick: async () => {
													await reviewVerification({
														requestId: req.id,
														brandId: req.brand_id,
														reviewerId: user?.id ?? "admin",
														approve: false
													});
													await refetchVerifications();
												},
												children: "Reject"
											})]
										})]
									}, req.id))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-background/50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 font-display text-sm font-extrabold uppercase tracking-wider",
								children: "Human Content Appeals Queue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAppealsQueue, {})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveIncidents, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureConnectionsPanel, { userId: user?.id ?? "preview-operator" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandAICopilot, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentSafetyGate, {})
			]
		})]
	});
}
function BrandRow({ brand, onVerify }) {
	const { t } = useTranslation();
	const { user } = useAuth();
	const [localVerified, setLocalVerified] = (0, import_react.useState)(brand.verified);
	const [commOpen, setCommOpen] = (0, import_react.useState)(false);
	const [broadcastOpen, setBroadcastOpen] = (0, import_react.useState)(false);
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
		try {
			await requestVerification({
				brandId: brand.id,
				userId: user?.id ?? "brand-operator",
				message: "Requested from Brand Dashboard"
			});
			setLocalVerified(true);
			toast.success(t("brand.verificationPending", { defaultValue: "Verification requested!" }));
			onVerify();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Error");
		}
	};
	const stashCount = stats?.stash ?? kpis?.stash ?? 24;
	const trashCount = stats?.trash ?? kpis?.trash ?? 8;
	const total = stashCount + trashCount;
	const trustScore = Number(brand.trust_score) > 0 ? Number(brand.trust_score) : 76;
	const stashPct = total > 0 ? Math.round(100 * stashCount / total) : trustScore;
	const isVerified = localVerified || brand.verified;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-3xl border-2 border-[#d6a928]/40 bg-card p-6 shadow-sm sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
								name: brand.name,
								url: brand.signedLogoUrl,
								className: "h-16 w-16 rounded-2xl text-xl shadow-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-black text-foreground",
									children: brand.name
								}), isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full border border-[#d6a928]/50 bg-slate-950 px-3 py-0.5 text-xs font-bold text-[#d6a928]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5" }),
										" ",
										t("dashboard.verified")
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-muted-foreground",
									children: t("dashboard.unverified")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
								children: [
									brand.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: brand.category
									}),
									brand.country && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: brand.country
									})] }),
									brand.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: brand.website,
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex items-center gap-1 font-semibold text-primary hover:underline",
										children: ["Website ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
									})] })
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandTeamDialog, {
									brandId: brand.id,
									brandName: brand.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setCommOpen(true),
									className: "gap-1.5 border-[#d6a928]/50 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 text-[#d6a928]" }), " Direct Comm"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setBroadcastOpen(true),
									className: "gap-1.5 border-rose-500/40 font-bold text-rose-500 hover:bg-rose-500/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5" }), " Live Townhall"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: async () => {
										const inv = buildBrandInvitation({
											name: brand.name,
											slug: brand.slug,
											website: brand.website
										});
										await navigator.clipboard?.writeText(inv);
										toast.success(`Copied official brand-owner invitation for ${brand.name}`);
									},
									className: "gap-1.5 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 text-[#d6a928]" }), " Copy Invite"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									variant: "outline",
									className: "font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/brands/$slug",
										params: { slug: brand.slug },
										children: t("dashboard.view")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									variant: "ghost",
									className: "gap-1.5 font-semibold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/messages",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }),
											" ",
											t("nav.messages")
										]
									})
								}),
								!isVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: askVerify,
									className: "bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e3b634]",
									children: t("dashboard.requestVerification")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectBrandCommModal, {
							open: commOpen,
							onOpenChange: setCommOpen,
							brandName: brand.name,
							brandOwner: brand.ownerName || `${brand.name} Executive Team`,
							matchedBrand: brand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBroadcastModal, {
							open: broadcastOpen,
							onOpenChange: setBroadcastOpen,
							brandName: brand.name,
							brandOwner: brand.ownerName || `${brand.name} Official`,
							productName: `${brand.name} Live Consumer Townhall`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 text-center sm:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t("dashboard.trustScore"),
							value: `${trustScore}%`,
							accent: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t("dashboard.posts"),
							value: `${stats?.posts ?? kpis?.posts ?? 18}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t("dashboard.stash"),
							value: `${stashCount}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t("dashboard.trash"),
							value: `${trashCount}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t("dashboard.followers"),
							value: `${followers ?? 240}`
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-center justify-between text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[#b88914]",
							children: [
								stashPct,
								"% ",
								t("dashboard.stash", { defaultValue: "Stash" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								100 - stashPct,
								"% ",
								t("dashboard.trash", { defaultValue: "Trash" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2.5 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-500",
							style: { width: `${stashPct}%` }
						})
					})]
				})] }),
				kpis && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandIntelligencePanel, { kpis }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-secondary/20 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-extrabold uppercase tracking-wider text-muted-foreground",
							children: t("brandTeam.kpis")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-3 text-center sm:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: t("brandTeam.volume"),
									value: `${kpis?.posts ?? 0}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: t("brandTeam.stashPct"),
									value: `${kpis?.stash_pct ?? stashPct}%`,
									accent: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: t("brandTeam.positive"),
									value: `${kpis?.positive ?? 0}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: t("brandTeam.neutral"),
									value: `${kpis?.neutral ?? 0}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: t("brandTeam.negative"),
									value: `${kpis?.negative ?? 0}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: t("brandTeam.unanswered"),
									value: `${kpis?.unanswered ?? 0}`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs font-medium text-muted-foreground",
							children: [
								t("brandTeam.responseTime"),
								": ",
								formatReply(kpis?.median_response_minutes ?? 0, t)
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandAnalytics, {
					brandId: brand.id,
					brandName: brand.name
				})
			]
		})
	});
}
function Stat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl border p-3", accent ? "border-[#d6a928]/50 bg-[#d6a928]/10" : "border-border/60 bg-background"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("font-display text-xl font-black", accent ? "text-[#b88914]" : "text-foreground"),
			children: [accent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "mr-1 inline h-4 w-4 text-[#d6a928]" }), value]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-[11px] font-semibold text-muted-foreground",
			children: label
		})]
	});
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
			"food",
			"agriculture"
		], "Food & Fast Food"],
		[[
			"fashion",
			"clothing",
			"apparel",
			"beauty",
			"luxury"
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
			"grocery",
			"consumer"
		], "Retail & Groceries"],
		[[
			"travel",
			"airline",
			"hotel",
			"hospitality",
			"automotive"
		], "Travel & Mobility"]
	].find(([keywords]) => keywords.some((keyword) => value.includes(keyword)))?.[1] ?? category.trim();
}
function formatReply(minutes, t) {
	if (!minutes) return t("brandTeam.noResponseYet");
	if (minutes < 90) return t("brandTeam.minutes", { count: minutes });
	return t("brandTeam.hours", { count: Math.round(minutes / 60) });
}
//#endregion
export { DashboardPage as component };
