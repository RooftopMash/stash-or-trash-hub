import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn } from "./label-BlRLLIBM.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as Recycle, Pt as ChevronRight, Xt as ArrowRight, f as Trophy, nt as Layers, p as TriangleAlert, wt as Coins, x as Sparkles } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { At as triggerVerdictSuccess, C as playCoinSpinSound, E as icon_bin_default, T as playTrashSound, W as fetchBrands, d as getBrandTier, f as getTierInfo, jt as icon_coin_default, kt as VerdictSuccess, l as BRAND_TIERS, p as matchesTier, tt as fetchFeed, u as compareBrandTiers, x as Header } from "./router-BjpvJuyR.mjs";
import { t as BrandLogo } from "./BrandLogo-Nd6kylYm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BPsQEHRK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cascade = [
	{
		letter: "S",
		className: "text-[#d6a928]"
	},
	{
		letter: "O",
		className: "text-slate-950"
	},
	{
		letter: "r",
		className: "text-[#e34b4b]"
	},
	{
		letter: "T",
		className: "text-[#2563eb]"
	}
];
function SotHomeHero() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [activeObject, setActiveObject] = (0, import_react.useState)(null);
	const [statusMessage, setStatusMessage] = (0, import_react.useState)(null);
	const { data: feedItems } = useQuery({
		queryKey: ["feed", "anon"],
		queryFn: () => fetchFeed(null)
	});
	const { data: brands = [] } = useQuery({
		queryKey: ["brands"],
		queryFn: fetchBrands
	});
	const [barometerTier, setBarometerTier] = (0, import_react.useState)("All tiers");
	const [barometerSort, setBarometerSort] = (0, import_react.useState)("trust");
	const barometerBrands = (0, import_react.useMemo)(() => {
		return brands.filter((b) => {
			const bTier = getBrandTier(b.name, b.category);
			return matchesTier(bTier, barometerTier);
		}).sort((a, b) => {
			if (barometerSort === "trust") return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
			if (barometerSort === "tier") {
				const comp = compareBrandTiers(getBrandTier(a.name, a.category), getBrandTier(b.name, b.category));
				if (comp !== 0) return comp;
				return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
			}
			return a.name.localeCompare(b.name);
		});
	}, [
		brands,
		barometerTier,
		barometerSort
	]);
	const rawStashes = (0, import_react.useMemo)(() => (feedItems ?? []).reduce((sum, item) => sum + (item.stashCount || 0), 0), [feedItems]);
	const rawTrashes = (0, import_react.useMemo)(() => (feedItems ?? []).reduce((sum, item) => sum + (item.trashCount || 0), 0), [feedItems]);
	const totalStashes = rawStashes > 0 ? rawStashes : 221;
	const totalTrashes = rawTrashes > 0 ? rawTrashes : 165;
	const totalVotes = totalStashes + totalTrashes;
	const stashPct = Math.round(totalStashes / totalVotes * 100);
	const trashPct = 100 - stashPct;
	const topStashedItem = (0, import_react.useMemo)(() => {
		if (feedItems && feedItems.length > 0) {
			const sorted = [...feedItems].sort((a, b) => (b.stashCount || 0) - (a.stashCount || 0));
			if (sorted[0] && sorted[0].stashCount > 0) return sorted[0];
		}
		return {
			title: "Pricing at Woolworths is getting hard to justify",
			description: "Same basket, R180 more than last month. No explanation on the shelf. #Pricing",
			brandName: "Woolworths",
			stashCount: 4
		};
	}, [feedItems]);
	const topTrashedItem = (0, import_react.useMemo)(() => {
		if (feedItems && feedItems.length > 0) {
			const sorted = [...feedItems].sort((a, b) => (b.trashCount || 0) - (a.trashCount || 0));
			if (sorted[0] && sorted[0].trashCount > 0) return sorted[0];
		}
		return {
			title: "Telkom refund finally cleared",
			description: "Nine days for a refund that was promised in three. #Refunds",
			brandName: "Telkom",
			trashCount: 4
		};
	}, [feedItems]);
	const handleCoinClick = () => {
		playCoinSpinSound();
		setActiveObject("coin");
		triggerVerdictSuccess({
			label: "STASHED!",
			sublabel: "Keep what serves you · Loading Stashes of the Day",
			duration: 2600
		});
		setStatusMessage(t("hero.spinningZwepe", { defaultValue: "Spinning Zwepe... watching it lean, chatter and settle flat!" }));
		window.setTimeout(() => {
			navigate({
				to: "/feed",
				search: { filter: "stash" }
			});
		}, 2800);
	};
	const handleTrashClick = () => {
		playTrashSound();
		setActiveObject("bin");
		setStatusMessage(t("hero.droppingBin", { defaultValue: "Randy the Hungry Trash Can chomps! Loading Trashes of the Day..." }));
		window.setTimeout(() => {
			navigate({
				to: "/feed",
				search: { filter: "trash" }
			});
		}, 1150);
	};
	const getTierLabel = (tierOption) => {
		switch (tierOption) {
			case "All tiers": return t("hero.allTiers", { defaultValue: "All tiers" });
			case "Super Brands": return t("hero.superBrands", { defaultValue: "Super Brands" });
			case "National Powerhouses": return t("hero.nationalPowerhouses", { defaultValue: "National Powerhouses" });
			case "Emerging Challengers": return t("hero.emergingChallengers", { defaultValue: "Emerging Challengers" });
			case "Local Heroes": return t("hero.localHeroes", { defaultValue: "Local Heroes" });
			default: return tierOption;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate overflow-hidden border-b-2 border-[#d6a928]/30 bg-white text-slate-950",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 opacity-[0.08]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[10%] top-8 h-72 w-72 rounded-full border-[20px] border-[#d6a928]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-[12%] top-16 h-60 w-48 rotate-6 rounded-[2.5rem] border-[14px] border-slate-900" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-[#d6a928]/50 bg-slate-950 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#f5d061] shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {
								className: "h-3.5 w-3.5 text-[#d6a928]",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("hero.badge", { defaultValue: "The Brand Barometer" }) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-5 font-display text-4xl font-black tracking-tight sm:text-6xl leading-[1.08]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-slate-950",
								children: t("hero.headlineBlack", { defaultValue: "Keep what serves you." })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[#d6a928] drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]",
								children: t("hero.headlineGold", { defaultValue: "Challenge what does not." })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-900 sm:text-lg",
							children: t("hero.subtitle", { defaultValue: "Vote Stash or Trash on your real brand experiences — the CX & PR signal that matters." })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-1.5 max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-base",
							children: t("hero.tagline", { defaultValue: "Every verdict brings brands closer to the people they serve. Cast yours. 🔥" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-[320px] items-center justify-center lg:min-h-[400px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:max-w-4xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex flex-col items-center overflow-hidden rounded-3xl border-2 border-[#d6a928]/60 bg-gradient-to-b from-[#fffbeb] via-amber-50/40 to-white p-6 shadow-[0_12px_32px_-12px_rgba(214,169,40,0.35)] transition hover:border-[#d6a928] hover:shadow-[0_18px_40px_-10px_rgba(214,169,40,0.5)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSuccess, {
									active: activeObject === "coin",
									inline: true,
									label: "STASHED!",
									sublabel: "Keep what serves you · Gold standard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-label": t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" }),
									onClick: handleCoinClick,
									onMouseEnter: () => {
										if (activeObject !== "coin") {
											setActiveObject("coin");
											window.setTimeout(() => setActiveObject(null), 2900);
										}
									},
									className: "relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928] rounded-2xl p-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex h-60 w-full items-center justify-center sm:h-72 [perspective:900px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("sot-coin-shadow absolute bottom-5 h-8 w-44 rounded-full bg-slate-950/30 blur-md pointer-events-none", activeObject === "coin" && "sot-object-active") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: icon_coin_default,
											alt: "$OrT South African spinning gold coin",
											className: cn("sot-coin-art relative z-10 w-full max-w-[210px] sm:max-w-[250px] drop-shadow-md transition-transform group-hover:scale-105", activeObject === "coin" && "sot-object-active")
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col items-center gap-1.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/feed",
										search: { filter: "stash" },
										onClick: () => triggerVerdictSuccess({
											label: "STASHES OF THE DAY",
											sublabel: "Keep what serves you · Community Gold Standard"
										}),
										className: "inline-flex items-center gap-2 rounded-full border-2 border-slate-950 bg-[#d6a928] px-5 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_0_0_#0a0a0c] transition hover:bg-[#e3b634] active:translate-y-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }),
											t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" }),
											" (",
											totalStashes,
											")",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-slate-700",
										children: t("hero.tapCoin", { defaultValue: "Tap the Gold Coin to spin & view Stashes" })
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex flex-col items-center rounded-3xl border-2 border-slate-900/25 bg-gradient-to-b from-slate-100/90 via-slate-50/50 to-white p-6 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.22)] transition hover:border-slate-950 hover:shadow-[0_18px_40px_-10px_rgba(15,23,42,0.35)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": "Slam trash can for Trashes of the Day",
								onClick: handleTrashClick,
								onMouseEnter: () => {
									if (activeObject !== "bin") {
										setActiveObject("bin");
										window.setTimeout(() => setActiveObject(null), 1200);
									}
								},
								className: "relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-2xl p-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative flex h-60 w-full items-center justify-center sm:h-72",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "randy-can-stage relative flex items-center justify-center h-56 w-44 sm:h-64 sm:w-52",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[17%] left-[8%] right-[8%] h-9 rounded-full bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)] border border-slate-900 pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("randy-junk-contents absolute top-[11%] left-[10%] right-[10%] z-15 flex items-end justify-center pointer-events-none select-none", activeObject === "bin" && "randy-active"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
													viewBox: "0 0 160 55",
													className: "w-full h-11 drop-shadow-md overflow-visible",
													fill: "none",
													xmlns: "http://www.w3.org/2000/svg",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
															transform: "translate(18, 4) rotate(-14)",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
																	points: "0,0 26,-4 32,22 4,24",
																	fill: "#f8fafc",
																	stroke: "#cbd5e1",
																	strokeWidth: "1.5"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "4",
																	y1: "5",
																	x2: "22",
																	y2: "2",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "5",
																	y1: "9",
																	x2: "24",
																	y2: "7",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "5",
																	y1: "13",
																	x2: "18",
																	y2: "12",
																	stroke: "#ef4444",
																	strokeWidth: "1.8"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																	x: "4",
																	y: "16",
																	width: "16",
																	height: "5",
																	rx: "1",
																	fill: "#ef4444",
																	fillOpacity: "0.25",
																	stroke: "#ef4444",
																	strokeWidth: "0.8"
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
															transform: "translate(54, 8) rotate(12)",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																	x: "0",
																	y: "0",
																	width: "18",
																	height: "24",
																	rx: "3",
																	fill: "#dc2626",
																	stroke: "#991b1b",
																	strokeWidth: "1.2"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	d: "M0,8 Q9,14 18,8",
																	stroke: "#f87171",
																	strokeWidth: "1.5",
																	fill: "none"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	d: "M0,16 Q9,10 18,16",
																	stroke: "#ffffff",
																	strokeWidth: "1.2",
																	fill: "none"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
																	cx: "9",
																	cy: "0",
																	rx: "7",
																	ry: "2",
																	fill: "#e2e8f0",
																	stroke: "#94a3b8",
																	strokeWidth: "0.8"
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
															transform: "translate(86, 2) rotate(-22)",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "0",
																	y1: "12",
																	x2: "34",
																	y2: "12",
																	stroke: "#f1f5f9",
																	strokeWidth: "2",
																	strokeLinecap: "round"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
																	points: "34,12 44,7 44,17",
																	fill: "#f1f5f9",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																	cx: "41",
																	cy: "11",
																	r: "1.2",
																	fill: "#475569"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "8",
																	y1: "6",
																	x2: "8",
																	y2: "18",
																	stroke: "#f1f5f9",
																	strokeWidth: "1.8",
																	strokeLinecap: "round"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "16",
																	y1: "4",
																	x2: "16",
																	y2: "20",
																	stroke: "#f1f5f9",
																	strokeWidth: "1.8",
																	strokeLinecap: "round"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: "24",
																	y1: "6",
																	x2: "24",
																	y2: "18",
																	stroke: "#f1f5f9",
																	strokeWidth: "1.8",
																	strokeLinecap: "round"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
																	points: "0,12 -8,6 -8,18",
																	fill: "#f1f5f9",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
															transform: "translate(112, 16) rotate(18)",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	d: "M6,0 C12,8 24,14 26,26 C20,24 16,16 10,12 C4,16 2,24 -2,22 C2,14 4,6 6,0 Z",
																	fill: "#facc15",
																	stroke: "#ca8a04",
																	strokeWidth: "1.2"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																	cx: "6",
																	cy: "1",
																	r: "1.5",
																	fill: "#713f12"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	d: "M26,26 C26,27 25,28 24,28",
																	stroke: "#713f12",
																	strokeWidth: "1.5"
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
															transform: "translate(38, 16) rotate(-8)",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
																cx: "10",
																cy: "8",
																rx: "9",
																ry: "5",
																fill: "#38bdf8",
																fillOpacity: "0.85",
																stroke: "#0284c7",
																strokeWidth: "1"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
																points: "2,6 8,1 15,4 12,12 4,10",
																fill: "#fed7aa",
																stroke: "#fb923c",
																strokeWidth: "0.8"
															})]
														})
													]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("randy-body absolute inset-0 z-10 drop-shadow-md", activeObject === "bin" && "randy-active"),
												style: { clipPath: "polygon(0% 19.5%, 100% 19.5%, 100% 100%, 0% 100%)" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: icon_bin_default,
													alt: "SOrT solid stainless steel metallic trash can",
													className: "h-full w-full object-contain"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("randy-lid absolute inset-0 z-20 transition-transform", activeObject === "bin" && "randy-active"),
												style: { clipPath: "polygon(0% 0%, 100% 0%, 100% 21%, 0% 21%)" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: icon_bin_default,
													alt: "",
													"aria-hidden": "true",
													className: "h-full w-full object-contain"
												})
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Slam trash can for Trashes of the Day"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col items-center gap-1.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/feed",
									search: { filter: "trash" },
									className: "inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recycle, { className: "h-4 w-4" }),
										t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" }),
										" (",
										totalTrashes,
										")",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-slate-500",
									children: t("hero.tapBin", { defaultValue: "Click the trash can to slam & review public callouts" })
								})]
							})]
						})]
					})
				}),
				statusMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[#d6a928]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusMessage })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-3 w-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-3 w-3 rounded-full bg-emerald-500" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-black uppercase tracking-wide text-slate-950",
									children: t("hero.liveSentiment", { defaultValue: "Live Brand Barometer & Daily Verdicts" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs font-bold text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										totalVotes.toLocaleString(),
										" ",
										t("hero.realPeopleVerdicts", { defaultValue: "Total Community Votes" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-px bg-slate-300" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/awards",
										className: "text-slate-950 hover:underline",
										children: t("hero.seeStandings", { defaultValue: "View Awards Leaderboard →" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-extrabold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-amber-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-[#d6a928]" }),
										stashPct,
										"% ",
										t("vote.stash", { defaultValue: "Stash" }),
										" (",
										totalStashes.toLocaleString(),
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recycle, { className: "h-4 w-4 text-slate-500" }),
										trashPct,
										"% ",
										t("vote.trash", { defaultValue: "Trash" }),
										" (",
										totalTrashes.toLocaleString(),
										")"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 shadow-inner",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-l-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-700",
									style: { width: `${stashPct}%` }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-r-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-700",
									style: { width: `${trashPct}%` }
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-sm font-extrabold uppercase tracking-wider text-slate-950",
												children: t("hero.liveSentiment", { defaultValue: "Barometer Tier Segmentation" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600",
												children: [
													barometerBrands.length,
													" ",
													t("nav.brands", { defaultValue: "Brands" })
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-slate-500",
										children: t("hero.liveSentimentDesc", { defaultValue: "Filter and compare brand sentiments within defined market tiers." })
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-slate-500",
											children: t("hero.sortBy", { defaultValue: "Sort Barometer:" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: barometerSort,
											onChange: (e) => setBarometerSort(e.target.value),
											className: "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "trust",
													children: t("hero.trustScore", { defaultValue: "Highest Trust Score" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "tier",
													children: t("hero.brandTier", { defaultValue: "By Tier (Luxury → Budget)" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "name",
													children: t("hero.alphabetical", { defaultValue: "Brand Name (A-Z)" })
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex items-center gap-2 overflow-x-auto pb-1",
									children: BRAND_TIERS.map((tierOption) => {
										const info = tierOption !== "All tiers" ? getTierInfo(tierOption) : null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setBarometerTier(tierOption),
											className: cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all", barometerTier === tierOption ? "bg-slate-950 text-white shadow-xs scale-[1.02]" : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"),
											children: [info?.pricePoint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[10px] opacity-75",
												children: info.pricePoint
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getTierLabel(tierOption) })]
										}, tierOption);
									})
								}),
								barometerTier !== "All tiers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-0.5 inline-block size-2 rounded-full shrink-0 bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-slate-600",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-slate-900",
												children: [
													getTierInfo(barometerTier).label,
													" (",
													getTierInfo(barometerTier).pricePoint,
													"):"
												]
											}),
											" ",
											getTierInfo(barometerTier).description,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-slate-500 italic",
												children: [getTierInfo(barometerTier).examples.slice(0, 4).join(", "), "."]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
									children: barometerBrands.slice(0, 4).map((brand) => {
										const tierInfo = getTierInfo(getBrandTier(brand.name, brand.category));
										const trust = Number(brand.trust_score) || 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/brands/$slug",
											params: { slug: brand.slug },
											className: "group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
														name: brand.name,
														url: brand.signedLogoUrl,
														className: "size-8 rounded-lg text-xs"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold leading-none", tierInfo.badgeClass),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-[9px]",
															children: tierInfo.pricePoint
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tierInfo.shortName })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "mt-2.5 font-display text-sm font-bold text-slate-950 truncate group-hover:text-primary transition-colors",
													children: brand.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-500 truncate",
													children: brand.category || "Consumer Brand"
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 border-t border-slate-100 pt-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-[11px] font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-slate-500",
														children: [t("hero.trustScore", { defaultValue: "Trust score" }), ":"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: trust >= 75 ? "text-emerald-600" : trust >= 50 ? "text-amber-600" : "text-rose-600",
														children: [trust, "%"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: cn("h-full rounded-full transition-all duration-500", trust >= 75 ? "bg-emerald-500" : trust >= 50 ? "bg-amber-500" : "bg-rose-500"),
														style: { width: `${Math.max(5, Math.min(100, trust))}%` }
													})
												})]
											})]
										}, brand.id);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: t("hero.realPeopleVerdicts", { defaultValue: "Real consumer verdicts shaping trust scores in real time." })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/brands",
										className: "font-bold text-primary hover:underline inline-flex items-center gap-1",
										children: [
											t("hero.searchOrBrowse", { defaultValue: "Search brands or browse below" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between rounded-2xl border border-amber-200 bg-white p-5 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5 text-amber-700" }), t("hero.gettingStashed", { defaultValue: "Top Stashed of the Day" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-display text-sm font-black text-amber-700",
											children: [
												"+",
												topStashedItem?.stashCount ?? 0,
												" ",
												t("hero.stashes", { defaultValue: "Stashes" })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 font-display text-base font-bold text-slate-950 line-clamp-1",
										children: topStashedItem?.title ?? "Community Favorite Brand"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-slate-600 line-clamp-2",
										children: topStashedItem?.description ?? "Consumers are celebrating exceptional service, product durability, and ethical practices."
									}),
									topStashedItem?.brandName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs font-semibold text-slate-500",
										children: [
											t("nav.brands", { defaultValue: "Brand" }),
											": ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-900 font-bold",
												children: topStashedItem.brandName
											})
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 pt-3 border-t border-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/feed",
										search: { filter: "stash" },
										className: "inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline",
										children: [
											t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
										]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-slate-700" }), t("hero.gettingTrashed", { defaultValue: "Top Trashed of the Day" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-display text-sm font-black text-slate-900",
											children: [
												topTrashedItem?.trashCount ?? 0,
												" ",
												t("hero.trashes", { defaultValue: "Trashed" })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 font-display text-base font-bold text-slate-950 line-clamp-1",
										children: topTrashedItem?.title ?? "Critical Consumer Callout"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-slate-600 line-clamp-2",
										children: topTrashedItem?.description ?? "Public accountability on poor service delivery, pricing changes, or quality concerns."
									}),
									topTrashedItem?.brandName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs font-semibold text-slate-500",
										children: [
											t("nav.brands", { defaultValue: "Brand" }),
											": ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-900 font-bold",
												children: topTrashedItem.brandName
											})
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 pt-3 border-t border-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/feed",
										search: { filter: "trash" },
										className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline",
										children: [
											t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
										]
									})
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: "relative flex justify-center gap-4 overflow-hidden pt-4 pb-2 text-5xl font-black leading-none sm:gap-8 sm:text-7xl",
					children: cascade.map(({ letter, className }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `${className} sot-letter-cascade`,
						style: { animationDelay: `${index * 180}ms` },
						children: letter
					}, `${letter}-${index}`))
				})
			]
		})]
	});
}
var watermark_coins_default = "/assets/watermark-coins-Sl6CFqhN.png";
var watermark_bins_default = "/assets/watermark-bins-DF1LyL_8.png";
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-x-hidden bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-hidden": true,
			className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-y-0 left-0 w-1/2 opacity-[0.07]",
				style: {
					backgroundImage: `url(${watermark_coins_default})`,
					backgroundSize: "320px 320px",
					backgroundRepeat: "repeat",
					maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-y-0 right-0 w-1/2 opacity-[0.07]",
				style: {
					backgroundImage: `url(${watermark_bins_default})`,
					backgroundSize: "320px 320px",
					backgroundRepeat: "repeat",
					maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)"
				}
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SotHomeHero, {})]
		})]
	});
}
//#endregion
export { Index as component };
