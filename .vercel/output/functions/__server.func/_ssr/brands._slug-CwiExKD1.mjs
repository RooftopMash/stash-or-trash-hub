import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, n as Button, o as useAuth } from "./label-BlRLLIBM.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Minus, Ct as Copy, F as Radio, G as MessageCircle, Gt as BadgeCheck, I as QrCode, Kt as Award, Lt as ChartColumn, Pt as ChevronRight, _ as Ticket, h as TrendingDown, it as Info, jt as CircleCheckBig, lt as Gift, m as TrendingUp, v as ThumbsUp, wt as Coins, x as Sparkles, y as ThumbsDown, yt as ExternalLink, zt as Camera } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { At as triggerVerdictSuccess, E as icon_bin_default, I as DialogHeader, L as DialogTitle, M as Dialog, N as DialogContent, Ot as supabase, S as SubmitDialog, T as playTrashSound, U as fetchBrandVerdict, V as fetchBrandBySlug, X as requestVerification, Y as removeBrandVote, b as Skeleton, d as getBrandTier, f as getTierInfo, jt as icon_coin_default, kt as VerdictSuccess, m as PeopleTrustFactor, o as Route$4, q as fetchMyVerificationRequest, tt as fetchFeed, w as playStashSound, x as Header, z as castBrandVote } from "./router-BjpvJuyR.mjs";
import { t as BrandLogo } from "./BrandLogo-Nd6kylYm.mjs";
import { h as isFollowingBrand, o as getFollowerCount, r as followBrand, x as unfollowBrand } from "./social-CSxIyKrD.mjs";
import { n as emitEngagementChange, r as recordVote, t as ItemCard } from "./ItemCard-CHTXjOhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands._slug-CwiExKD1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* One-tap Stash / Trash on a brand itself. `compact` renders just the two
* buttons for use inside brand cards; the default renders the full panel with
* the live community meter.
*/
function BrandVerdict({ brandId, brandName, compact = false, className }) {
	const { user } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stashCelebration, setStashCelebration] = (0, import_react.useState)(false);
	const { data, refetch } = useQuery({
		queryKey: [
			"brand-verdict",
			brandId,
			user?.id ?? "anon"
		],
		queryFn: () => fetchBrandVerdict(brandId, user?.id ?? null)
	});
	const mine = data?.myVerdict ?? null;
	const pct = data?.stash_pct ?? 50;
	const vote = async (verdict) => {
		if (verdict === "stash" && mine !== "stash") {
			setStashCelebration(true);
			triggerVerdictSuccess({
				label: `STASHED ${brandName.toUpperCase()}!`,
				sublabel: "Keep what serves you · Brand gold verdict recorded"
			});
		}
		if (!user) {
			toast.info(t("vote.signInPrompt"));
			navigate({ to: "/auth" });
			return;
		}
		setBusy(true);
		try {
			if (mine === verdict) await removeBrandVote(brandId, user.id);
			else {
				await castBrandVote(brandId, user.id, verdict);
				const { reward, milestone } = recordVote();
				emitEngagementChange();
				toast.success(milestone ?? reward);
			}
			await refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("vote.voteFailed"));
		} finally {
			setBusy(false);
		}
	};
	const buttons = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("grid grid-cols-2 gap-2", !compact && "gap-3"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "stash",
			size: compact ? "sm" : "lg",
			disabled: busy,
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				playStashSound();
				vote("stash");
			},
			className: cn("gap-2", mine === "stash" && "verdict-picked", mine === "trash" && "verdict-dimmed"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: icon_coin_default,
					alt: "",
					"aria-hidden": true,
					className: "verdict-icon"
				}),
				" ",
				t("vote.stash")
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "trash",
			size: compact ? "sm" : "lg",
			disabled: busy,
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				playTrashSound();
				vote("trash");
			},
			className: cn("gap-2", mine === "trash" && "verdict-picked", mine === "stash" && "verdict-dimmed"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: icon_bin_default,
					alt: "",
					"aria-hidden": true,
					className: "verdict-icon"
				}),
				" ",
				t("vote.trash")
			]
		})]
	});
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSuccess, {
			active: stashCelebration,
			onComplete: () => setStashCelebration(false),
			inline: true,
			label: "STASHED!",
			sublabel: "Keep what serves you"
		}), buttons]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("relative overflow-hidden rounded-2xl border border-border bg-card p-5", className),
		"aria-label": t("brand.verdictTitle", { brand: brandName }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSuccess, {
				active: stashCelebration,
				onComplete: () => setStashCelebration(false),
				inline: true,
				label: `STASHED ${brandName.toUpperCase()}!`,
				sublabel: "Keep what serves you · Gold standard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-extrabold",
				children: t("brand.verdictTitle", { brand: brandName })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("brand.verdictHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: buttons
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-2.5 overflow-hidden rounded-full bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-stash",
						style: { width: `${pct}%` }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-trash",
						style: { width: `${100 - pct}%` }
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex justify-between text-xs font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-stash",
							children: t("vote.stashCount", { count: data?.stash ?? 0 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: (data?.total ?? 0) === 0 ? t("vote.noVotes") : t("vote.stashPct", { pct })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-trash",
							children: t("vote.trashCount", { count: data?.trash ?? 0 })
						})
					]
				})]
			})
		]
	});
}
/**
* Verdict Tally component
* Displays the real-time total count of 'Stash' vs 'Trash' votes for the current brand
* with a high-fidelity, accessible dual-track progress bar layout and live Supabase subscription.
*/
function VerdictTally({ brandId, brandName, className, compact = false, showLivePulse = true }) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [isLiveActive, setIsLiveActive] = (0, import_react.useState)(false);
	const { data: verdict, isLoading } = useQuery({
		queryKey: ["brand-verdict-tally", brandId],
		queryFn: () => fetchBrandVerdict(brandId, null),
		staleTime: 1e4
	});
	(0, import_react.useEffect)(() => {
		if (!brandId) return;
		const channelName = `verdict-tally-${brandId}-${Date.now().toString(36)}`;
		const channel = supabase.channel(channelName).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "brand_votes",
			filter: `brand_id=eq.${brandId}`
		}, () => {
			setIsLiveActive(true);
			queryClient.invalidateQueries({ queryKey: ["brand-verdict-tally", brandId] });
			setTimeout(() => setIsLiveActive(false), 2e3);
		}).subscribe((status) => {
			if (status === "SUBSCRIBED") setIsLiveActive(false);
		});
		const handleLocalEngagement = () => {
			queryClient.invalidateQueries({ queryKey: ["brand-verdict-tally", brandId] });
		};
		window.addEventListener("sot:engagement-change", handleLocalEngagement);
		return () => {
			window.removeEventListener("sot:engagement-change", handleLocalEngagement);
			supabase.removeChannel(channel);
		};
	}, [brandId, queryClient]);
	const stash = verdict?.stash ?? 0;
	const trash = verdict?.trash ?? 0;
	const total = verdict?.total ?? stash + trash;
	const hasVotes = total > 0;
	const stashPct = hasVotes ? Math.round(stash / total * 100) : 50;
	const trashPct = hasVotes ? 100 - stashPct : 50;
	const isStashLeading = stash > trash;
	const isTrashLeading = trash > stash;
	const isTied = stash === trash && hasVotes;
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: `verdict-tally-${brandId}`,
		className: cn("w-full rounded-xl border border-border bg-card p-3 shadow-xs space-y-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs font-semibold",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-stash",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: icon_coin_default,
							alt: "",
							"aria-hidden": true,
							className: "h-4 w-4 object-contain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							t("vote.stash", "Stash"),
							": ",
							stash.toLocaleString()
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-normal text-muted-foreground",
							children: [
								"(",
								hasVotes ? `${stashPct}%` : "—",
								")"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-[10px] text-muted-foreground",
					children: [showLivePulse && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-emerald-400", !isLiveActive && "hidden") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"· ",
						total.toLocaleString(),
						" ",
						t("brand.votes", "votes")
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-trash",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-normal text-muted-foreground",
							children: [
								"(",
								hasVotes ? `${trashPct}%` : "—",
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							t("vote.trash", "Trash"),
							": ",
							trash.toLocaleString()
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: icon_bin_default,
							alt: "",
							"aria-hidden": true,
							className: "h-4 w-4 object-contain"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/80 flex shadow-inner",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-stash transition-all duration-500 ease-out",
				style: { width: `${stashPct}%` },
				title: `Stash: ${stashPct}% (${stash} votes)`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-trash transition-all duration-500 ease-out",
				style: { width: `${trashPct}%` },
				title: `Trash: ${trashPct}% (${trash} votes)`
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: `verdict-tally-${brandId}`,
		"aria-labelledby": `verdict-tally-heading-${brandId}`,
		className: cn("relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-border/60 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-4 w-4 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						id: `verdict-tally-heading-${brandId}`,
						className: "text-base font-bold tracking-tight text-foreground",
						children: "Verdict Tally"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: brandName ? `Community sentiment for ${brandName}` : "Aggregated public votes"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [showLivePulse && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all", isLiveActive ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-border/80 bg-secondary/60 text-muted-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real-Time" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-secondary px-2.5 py-1 text-xs font-bold text-foreground",
						children: isLoading ? "..." : `${total.toLocaleString()} ${total === 1 ? "vote" : "votes"}`
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all", isStashLeading ? "border-stash/40 bg-stash/10 shadow-xs" : "border-border bg-card/60"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-xs border border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: icon_coin_default,
									alt: "",
									"aria-hidden": true,
									className: "h-6 w-6 object-contain"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold uppercase tracking-wider text-stash",
								children: t("vote.stash", "Stash")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Keep / Approve"
							})] })]
						}), isStashLeading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-stash/20 px-2 py-0.5 text-[10px] font-extrabold text-stash",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), " Leading"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-black tracking-tight text-foreground",
							children: stash.toLocaleString()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-stash",
							children: hasVotes ? `${stashPct}%` : "50%"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all", isTrashLeading ? "border-trash/40 bg-trash/10 shadow-xs" : "border-border bg-card/60"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-xs border border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: icon_bin_default,
									alt: "",
									"aria-hidden": true,
									className: "h-6 w-6 object-contain"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold uppercase tracking-wider text-trash",
								children: t("vote.trash", "Trash")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Dump / Reject"
							})] })]
						}), isTrashLeading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-trash/20 px-2 py-0.5 text-[10px] font-extrabold text-trash",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }), " Leading"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-black tracking-tight text-foreground",
							children: trash.toLocaleString()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-trash",
							children: hasVotes ? `${trashPct}%` : "50%"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-semibold text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-stash",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Stash Share: ", hasVotes ? `${stashPct}%` : "No votes yet"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-trash",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Trash Share: ", hasVotes ? `${trashPct}%` : "No votes yet"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3.5 w-3.5" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "progressbar",
						"aria-valuenow": stashPct,
						"aria-valuemin": 0,
						"aria-valuemax": 100,
						"aria-label": `Verdict progress bar: ${stashPct}% Stash vs ${trashPct}% Trash`,
						className: "relative h-4 w-full overflow-hidden rounded-full bg-secondary/80 flex p-0.5 shadow-inner",
						children: hasVotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-l-full bg-stash transition-all duration-700 ease-out flex items-center justify-end pr-1 text-[10px] font-black text-white",
							style: { width: `${stashPct}%` },
							children: stashPct >= 15 && `${stashPct}%`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-r-full bg-trash transition-all duration-700 ease-out flex items-center justify-start pl-1 text-[10px] font-black text-white",
							style: { width: `${trashPct}%` },
							children: trashPct >= 15 && `${trashPct}%`
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-full rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground",
							children: "Waiting for first vote"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-muted-foreground",
							children: [
								isStashLeading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-stash",
									children: [
										"Community consensus favors Stashing this brand (",
										stashPct,
										"% positive)."
									]
								}),
								isTrashLeading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-trash",
									children: [
										"Community consensus warns Trashing this brand (",
										trashPct,
										"% negative)."
									]
								}),
								isTied && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-semibold text-amber-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" }),
										"Dead Heat: Exactly tied ",
										stash,
										" to ",
										trash,
										"."
									]
								}),
								!hasVotes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Be the first community member to cast a Stash or Trash vote!" })
							]
						}), hasVotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-medium text-muted-foreground whitespace-nowrap",
							children: [
								"Ratio: ",
								trash > 0 ? (stash / trash).toFixed(1) : stash > 0 ? "∞" : "1.0",
								":1"
							]
						})]
					})
				]
			})
		]
	});
}
function getPeoplesSotGrade(score) {
	if (score >= 85) return {
		grade: "AAA",
		color: "bg-emerald-500 text-white",
		border: "border-emerald-500/20",
		textColor: "text-emerald-500",
		description: "Prime Trust Grade. Excellent community sentiment, extremely low dissatisfaction."
	};
	else if (score >= 70) return {
		grade: "AA",
		color: "bg-teal-500 text-white",
		border: "border-teal-500/20",
		textColor: "text-teal-500",
		description: "High Quality Grade. Strong customer loyalty and stable PR reputation."
	};
	else if (score >= 50) return {
		grade: "A",
		color: "bg-amber-500 text-black",
		border: "border-amber-500/20",
		textColor: "text-amber-600",
		description: "Satisfactory Grade. Balanced customer reviews, average market response."
	};
	else if (score >= 35) return {
		grade: "BBB",
		color: "bg-orange-500 text-white",
		border: "border-orange-500/20",
		textColor: "text-orange-500",
		description: "Vulnerable Grade. High customer service friction and visible negative sentiment."
	};
	else return {
		grade: "D (Trash)",
		color: "bg-red-500 text-white",
		border: "border-red-500/20",
		textColor: "text-red-500",
		description: "Substantial Risk. Severe dissatisfaction, action urgently required to restore goodwill."
	};
}
var BILLBOARDS = [
	{
		id: "bb-1",
		title: "Metro Plaza Digital Billboard — 35% Off Loyalty Pass",
		brandSlug: "adidas",
		type: "Discount Reward",
		qrContent: "SOT_BB_ADIDAS_35_LOYALTY",
		couponCode: "STASH_35_METRO",
		perk: "Unlocks a 35% discount coupon on online e-commerce checkout + 50 SOT Social Points.",
		targetUrl: "https://adidas.com"
	},
	{
		id: "bb-2",
		title: "Times Square Interactive CX Board — Free Premium Gift Card",
		brandSlug: "starbucks",
		type: "Freebie Reward",
		qrContent: "SOT_BB_SBUX_GIFT_10",
		couponCode: "TRASH_RECOVERY_10",
		perk: "Unlocks a $10 recovery e-gift card for customers who rate Starbucks on SOT + 100 SOT Social Points.",
		targetUrl: "https://starbucks.com"
	},
	{
		id: "bb-3",
		title: "Smart Transit Digital Banner — Priority Support Ticket",
		brandSlug: "apple",
		type: "VIP Service",
		qrContent: "SOT_BB_APPLE_VIP_ACCESS",
		couponCode: "APPLE_SOT_VIP",
		perk: "Unlocks priority verified CX queue, enabling direct channel to brand PR managers.",
		targetUrl: "https://apple.com"
	}
];
function BrandPage() {
	const { slug } = Route$4.useParams();
	const { t } = useTranslation();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)("feed");
	const [qrModalOpen, setQrModalOpen] = (0, import_react.useState)(false);
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [scannedBillboard, setScannedBillboard] = (0, import_react.useState)(null);
	const [claimedCoupons, setClaimedCoupons] = (0, import_react.useState)({});
	const { data: brand, isLoading } = useQuery({
		queryKey: ["brand", slug],
		queryFn: () => fetchBrandBySlug(slug)
	});
	const { data: feed, refetch } = useQuery({
		queryKey: [
			"brand-feed",
			brand?.id,
			user?.id ?? "anon"
		],
		queryFn: () => fetchFeed(user?.id ?? null, { brandId: brand.id }),
		enabled: !!brand
	});
	const isOwner = !!user && brand?.owner_id === user.id;
	const { data: brandFollowers, refetch: refetchBrandFollowers } = useQuery({
		queryKey: ["brand-followers", brand?.id],
		queryFn: () => getFollowerCount({ brandId: brand.id }),
		enabled: !!brand
	});
	const { data: isFollowing, refetch: refetchIsFollowing } = useQuery({
		queryKey: [
			"brand-following",
			user?.id,
			brand?.id
		],
		queryFn: () => user?.id && brand ? isFollowingBrand(user.id, brand.id) : false,
		enabled: !!user && !!brand
	});
	const toggleBrandFollow = async () => {
		if (!user || !brand) {
			toast.info(t("social.signInToFollow"));
			return;
		}
		try {
			if (isFollowing) await unfollowBrand(user.id, brand.id);
			else await followBrand(user.id, brand.id);
			await Promise.all([refetchBrandFollowers(), refetchIsFollowing()]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.loadFailed"));
		}
	};
	const { data: verReq, refetch: refetchVer } = useQuery({
		queryKey: [
			"brand-verify",
			brand?.id,
			user?.id
		],
		queryFn: () => fetchMyVerificationRequest(brand.id),
		enabled: !!brand && !!user
	});
	const askVerify = async (claim = false) => {
		if (!brand || !user) return;
		try {
			await requestVerification({
				brandId: brand.id,
				userId: user.id,
				message: claim ? `I represent ${brand.name} and would like to claim this SOT brand page.` : ""
			});
			toast.success(claim ? "Brand claim requested." : "Verification requested.");
			refetchVer();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not request verification.");
		}
	};
	const handleScanSimulation = (billboard) => {
		setScanning(true);
		setScannedBillboard(null);
		toast.loading("Simulating high-resolution digital billboard QR capture...");
		setTimeout(() => {
			setScanning(false);
			setScannedBillboard(billboard);
			toast.dismiss();
			toast.success("Successfully decoded digital billboard campaign!");
		}, 2e3);
	};
	const claimCoupon = (couponCode) => {
		setClaimedCoupons((prev) => ({
			...prev,
			[couponCode]: true
		}));
		navigator.clipboard?.writeText(couponCode);
		toast.success(`Coupon ${couponCode} copied to clipboard and social rewards claimed!`);
	};
	const mockCXMetrics = {
		customerService: brand ? Math.min(100, Math.max(10, brand.trust_score + 5)) : 75,
		productQuality: brand ? Math.min(100, Math.max(10, brand.trust_score - 2)) : 80,
		priceValue: brand ? Math.min(100, Math.max(10, brand.trust_score - 10)) : 65,
		deliverySpeed: brand ? Math.min(100, Math.max(10, brand.trust_score + 8)) : 85
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onPosted: () => refetch() }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-3xl px-4 py-8",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-2xl" }) : !brand ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
					children: ["Brand not found. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/brands",
						className: "text-primary hover:underline",
						children: "Back to brands"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
							name: brand.name,
							url: brand.signedLogoUrl,
							className: "h-20 w-20 rounded-2xl border border-border text-2xl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "font-display text-2xl font-extrabold",
											children: brand.name
										}),
										brand.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-5 w-5 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${getPeoplesSotGrade(brand.trust_score).color} ${getPeoplesSotGrade(brand.trust_score).border}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3 w-3" }),
												"People's SOT: ",
												getPeoplesSotGrade(brand.trust_score).grade
											]
										}),
										(() => {
											const tierName = getBrandTier(brand.name, brand.category);
											const tierInfo = getTierInfo(tierName);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${tierInfo.badgeClass}`,
												title: `${tierInfo.name} (${tierInfo.pricePoint}): ${tierInfo.description}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[11px] opacity-80",
													children: tierInfo.pricePoint
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tierInfo.shortName })]
											});
										})()
									]
								}),
								brand.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-0.5",
									children: brand.category
								}),
								brand.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-foreground/80 leading-relaxed",
									children: brand.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeopleTrustFactor, {
										signals: {
											evidence: Math.min(100, 50 + (feed?.length ?? 0) * 2),
											response: Math.min(100, 40 + (feed?.filter((item) => item.status === "resolved").length ?? 0) * 10),
											experience: Math.min(100, Math.max(0, brand.trust_score)),
											trust: Math.min(100, Math.max(0, brand.trust_score))
										},
										compact: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-4 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-stash" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: brand.trust_score
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: ["/ 100 ", t("brand.trustScore").toLowerCase()]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground",
											children: t("social.followers", { count: brandFollowers ?? 0 })
										}),
										brand.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: brand.website,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-1 text-primary hover:underline",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }),
												" ",
												t("brand.website")
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: [
										user && !isOwner && brand.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-1.5",
											onClick: () => navigate({
												to: "/messages",
												search: { to: brand.owner_id }
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }),
												" ",
												t("brand.message")
											]
										}),
										user && !isOwner && !brand.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											disabled: verReq?.status === "pending",
											onClick: () => askVerify(true),
											children: verReq?.status === "pending" ? "Claim pending" : "Claim this brand"
										}),
										isOwner && !brand.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											disabled: verReq?.status === "pending",
											onClick: () => askVerify(false),
											children: verReq?.status === "pending" ? t("brand.verificationPending") : t("brand.requestVerification")
										}),
										user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitDialog, {
											defaultBrandId: brand.id,
											onPosted: () => refetch()
										}),
										user && !isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: isFollowing ? "outline" : "default",
											onClick: toggleBrandFollow,
											children: isFollowing ? t("social.unfollow") : t("social.follow")
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandVerdict, {
						brandId: brand.id,
						brandName: brand.name,
						className: "mt-6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictTally, {
						brandId: brand.id,
						brandName: brand.name,
						className: "mt-4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 rounded-2xl border border-border bg-card p-1 shadow-sm overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 bg-secondary/40 p-1 rounded-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveTab("feed"),
										className: `flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === "feed" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }),
											" Feed (",
											feed?.length ?? 0,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveTab("rewards"),
										className: `flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === "rewards" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3.5 w-3.5 text-amber-500 animate-pulse" }), " Super Rewards"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveTab("people"),
										className: `flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === "people" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5 text-blue-500" }), " SOT Standard Grade"]
									})
								]
							}),
							activeTab === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wider",
										children: "Social Feed"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setQrModalOpen(true),
										className: "gap-1 text-primary hover:text-primary/80 font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3.5 w-3.5" }), " Scan Billboard QR"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: (feed ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground py-4 text-center",
										children: "No social ratings yet. Be the first to Stash or Trash!"
									}) : (feed ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
										item,
										onChange: () => refetch()
									}, item.id))
								})]
							}),
							activeTab === "rewards" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-extrabold text-lg flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-5 w-5 text-amber-500" }), " CX & Loyalty Reward Campaigns"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Exclusive rewards directed to verified clients and active raters."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => setQrModalOpen(true),
											className: "gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" }), " Scan Digital Billboard"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2 mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-500 uppercase tracking-wide",
														children: "Loyalty Campaign"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-0.5 text-xs font-semibold text-amber-500",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3 w-3" }), " 50 Pts"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "mt-2 font-display font-bold text-base text-foreground",
													children: "Verified Stashers Discount"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground mt-1",
													children: [
														"For active raters who voted \"Stash\" on ",
														brand.name,
														". Shows that loyalty deserves real rewards."
													]
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 border-t border-border/50 pt-3 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-mono font-bold bg-secondary px-2 py-1 rounded select-all",
													children: [
														"SOT_LOYAL_",
														brand.name.toUpperCase().slice(0, 4),
														"_20"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => claimCoupon(`SOT_LOYAL_${brand.name.toUpperCase().slice(0, 4)}_20`),
													className: "gap-1",
													children: claimedCoupons[`SOT_LOYAL_${brand.name.toUpperCase().slice(0, 4)}_20`] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), " Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Claim"] })
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-extrabold text-violet-500 uppercase tracking-wide",
														children: "CX Recovery Program"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-0.5 text-xs font-semibold text-amber-500",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3 w-3" }), " 100 Pts"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "mt-2 font-display font-bold text-base text-foreground",
													children: "Brand Recovery Voucher"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mt-1",
													children: "A customer care signal to rebuild relationships. Available for clients who shared constructive feedback."
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 border-t border-border/50 pt-3 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-mono font-bold bg-secondary px-2 py-1 rounded select-all",
													children: [
														"SOT_CARE_$",
														brand.name.toUpperCase().slice(0, 4),
														"_10"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => claimCoupon(`SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10`),
													className: "gap-1 border-primary text-primary hover:bg-primary/10",
													children: claimedCoupons[`SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10`] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), " Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Claim"] })
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-violet-500/5 border border-violet-500/10 p-4 text-xs flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-violet-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-violet-600",
											children: "The Power of Direct Feedback:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground mt-0.5",
											children: "By rating brands on Stash or Trash, you assist brands with actionable UX/CX data. In turn, brands direct digital rewards and gifts back to the community, establishing the ultimate credible feedback loop."
										})] })]
									})
								]
							}),
							activeTab === "people" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-display font-extrabold text-lg flex items-center gap-1.5 text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5 text-blue-500" }), " SOT Standard Grade Analysis"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "The People's Standard of consumer ratings, scaling credibility via decentralized rater feedback."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-secondary/10 p-4 flex flex-col sm:flex-row items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-16 w-16 rounded-2xl flex items-center justify-center font-display text-2xl font-black shadow-inner shrink-0 ${getPeoplesSotGrade(brand.trust_score).color}`,
											children: getPeoplesSotGrade(brand.trust_score).grade
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center sm:text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
												className: "font-display font-bold text-base",
												children: ["Current Brand Sovereign Grade: ", getPeoplesSotGrade(brand.trust_score).grade]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-0.5 leading-relaxed",
												children: getPeoplesSotGrade(brand.trust_score).description
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wide",
											children: "Consumer Experience Rating Matrix"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer Service & Support" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-emerald-500",
															children: [mockCXMetrics.customerService, "%"]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full bg-emerald-500",
															style: { width: `${mockCXMetrics.customerService}%` }
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Product Quality & Durability" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-emerald-500",
															children: [mockCXMetrics.productQuality, "%"]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full bg-emerald-500",
															style: { width: `${mockCXMetrics.productQuality}%` }
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pricing & Value For Money" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-amber-500",
															children: [mockCXMetrics.priceValue, "%"]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full bg-amber-500",
															style: { width: `${mockCXMetrics.priceValue}%` }
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery, Supply & Speed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-emerald-500",
															children: [mockCXMetrics.deliverySpeed, "%"]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full bg-emerald-500",
															style: { width: `${mockCXMetrics.deliverySpeed}%` }
														})
													})]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5 text-stash" }), " Real-time active voting"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Total rating weight: ",
											feed?.length ?? 0,
											" social signals"
										] })]
									})
								]
							})
						]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: qrModalOpen,
				onOpenChange: setQrModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-card rounded-2xl border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-black text-xl flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5 text-indigo-500" }), " Digital Billboard QR Scanner"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Direct clients from physical billboards & print ads to brand online e-commerce platforms and redeemable Stash or Trash client rewards. Select a simulated billboard below to scan:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-video rounded-xl bg-black border-2 border-indigo-500/20 flex flex-col items-center justify-center overflow-hidden",
								children: scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-bounce top-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-indigo-500/10 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-8 w-8 text-indigo-400 animate-spin" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest animate-pulse",
										children: "Capturing Digital Billboard QR..."
									})
								] }) : scannedBillboard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 text-center z-10 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-10 w-10 text-amber-500 mx-auto animate-bounce" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display font-extrabold text-sm text-white",
											children: "Billboard Decoded Successfully!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400 max-w-xs",
											children: scannedBillboard.title
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-20 w-20 mx-auto border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-10 w-10 text-zinc-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-indigo-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-indigo-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-indigo-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-indigo-500" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-mono text-zinc-500 mt-2",
										children: "Ready. Align digital billboard QR within focus."
									})]
								})
							}),
							scannedBillboard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-4 space-y-2 animate-fade-in",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-3.5 w-3.5" }),
												" ",
												scannedBillboard.type
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-mono font-bold bg-zinc-800 px-1.5 py-0.5 rounded text-white select-all",
											children: scannedBillboard.couponCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "font-bold text-sm text-foreground",
										children: scannedBillboard.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: scannedBillboard.perk
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "flex-1 font-bold gap-1 bg-amber-500 hover:bg-amber-600 text-black",
											onClick: () => claimCoupon(scannedBillboard.couponCode),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " Claim Reward"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-1 font-bold",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: scannedBillboard.targetUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												children: ["Go to Store ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 max-h-40 overflow-y-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-muted-foreground",
									children: "Select a Billboard Advertisement to Mock-Scan:"
								}), BILLBOARDS.map((bb) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: scanning,
									onClick: () => handleScanSimulation(bb),
									className: "w-full flex items-center justify-between p-2 text-left rounded-xl border border-border hover:bg-secondary/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1 pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold truncate",
											children: bb.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground truncate",
											children: [
												bb.type,
												" · ",
												bb.perk
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground shrink-0" })]
								}, bb.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border pt-3 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setQrModalOpen(false),
									children: "Close"
								})
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { BrandPage as component };
