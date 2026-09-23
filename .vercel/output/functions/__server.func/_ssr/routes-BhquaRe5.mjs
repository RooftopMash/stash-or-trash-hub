import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { H as Layers, Ot as ArrowRight, c as Trophy, h as Sparkles, ht as ChevronRight, l as TriangleAlert, ot as Coins, w as Recycle } from "../_libs/lucide-react.mjs";
import { i as cn } from "./label-1cB10GDW.mjs";
import { A as playTrashSound, D as icon_coin_default, E as icon_bin_default, O as playCoinSpinSound, b as fetchFeed, c as Header, v as fetchBrands } from "./Header-BKSLqlsv.mjs";
import { a as matchesTier, i as getTierInfo, n as compareBrandTiers, r as getBrandTier, t as BRAND_TIERS } from "./brandTiers-DEeWmtQa.mjs";
import { t as BrandLogo } from "./BrandLogo-C_F3Yd2U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BhquaRe5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/SotHomeHero.tsx";
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
		setStatusMessage("Spinning Zwepe... watching it lean, chatter and settle flat!");
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
		setStatusMessage("Randy the Hungry Trash Can chomps! Loading Trashes of the Day...");
		window.setTimeout(() => {
			navigate({
				to: "/feed",
				search: { filter: "trash" }
			});
		}, 1150);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative isolate overflow-hidden border-b border-slate-200 bg-white text-slate-950",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 opacity-[0.06]",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute left-[10%] top-8 h-72 w-72 rounded-full border-[20px] border-[#d6a928]" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 131,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute right-[12%] top-16 h-60 w-48 rotate-6 rounded-[2.5rem] border-[14px] border-slate-500" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 132,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 130,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Coins, {
								className: "h-3.5 w-3.5 text-[#d6a928]",
								"aria-hidden": "true"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 139,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "People-Powered Brand Intelligence" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 140,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 138,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-5 font-display text-4xl font-black tracking-tight sm:text-6xl",
							children: ["Keep what serves you.", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "block text-[#d6a928]",
								children: "Challenge what does not."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 144,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 142,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg",
							children: "Direct public consumer signal where people speak clearly, brands respond responsibly, and the community delivers the verdict."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 146,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 137,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex min-h-[320px] items-center justify-center lg:min-h-[400px]",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:max-w-4xl",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "group relative flex flex-col items-center rounded-3xl border border-slate-200/80 bg-gradient-to-b from-amber-50/40 to-white p-6 shadow-sm transition hover:border-[#d6a928]/60 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								"aria-label": "Spin coin for Stashes of the Day",
								onClick: handleCoinClick,
								onMouseEnter: () => {
									if (activeObject !== "coin") {
										setActiveObject("coin");
										window.setTimeout(() => setActiveObject(null), 2900);
									}
								},
								className: "relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928]/60 rounded-2xl p-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "relative flex h-60 w-full items-center justify-center sm:h-72 [perspective:900px]",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: cn("sot-coin-shadow absolute bottom-5 h-8 w-44 rounded-full bg-slate-950/25 blur-md pointer-events-none", activeObject === "coin" && "sot-object-active") }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 171,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: icon_coin_default,
										alt: "$OrT South African spinning gold coin",
										className: cn("sot-coin-art relative z-10 w-full max-w-[210px] sm:max-w-[250px] drop-shadow-md transition-transform group-hover:scale-105", activeObject === "coin" && "sot-object-active")
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 179,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 169,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "sr-only",
									children: "Spin coin for Stashes of the Day"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 188,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 157,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 flex flex-col items-center gap-1.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/feed",
									search: { filter: "stash" },
									className: "inline-flex items-center gap-2 rounded-full bg-[#d6a928] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-sm transition hover:bg-[#c4981e] hover:shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Coins, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 197,
											columnNumber: 19
										}, this),
										"Stashes of the Day (",
										totalStashes,
										")",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 199,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 192,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs font-medium text-slate-500",
									children: "Click the coin to spin on flat surface until flat"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 201,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 191,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 156,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "group relative flex flex-col items-center rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm transition hover:border-slate-400 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								"aria-label": "Slam trash can for Trashes of the Day",
								onClick: handleTrashClick,
								onMouseEnter: () => {
									if (activeObject !== "bin") {
										setActiveObject("bin");
										window.setTimeout(() => setActiveObject(null), 1200);
									}
								},
								className: "relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-2xl p-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "relative flex h-60 w-full items-center justify-center sm:h-72",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "randy-can-stage relative flex items-center justify-center h-56 w-44 sm:h-64 sm:w-52",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-[17%] left-[8%] right-[8%] h-9 rounded-full bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)] border border-slate-900 pointer-events-none" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 224,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: cn("randy-junk-contents absolute top-[11%] left-[10%] right-[10%] z-15 flex items-end justify-center pointer-events-none select-none", activeObject === "bin" && "randy-active"),
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
													viewBox: "0 0 160 55",
													className: "w-full h-11 drop-shadow-md overflow-visible",
													fill: "none",
													xmlns: "http://www.w3.org/2000/svg",
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
															transform: "translate(18, 4) rotate(-14)",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																	points: "0,0 26,-4 32,22 4,24",
																	fill: "#f8fafc",
																	stroke: "#cbd5e1",
																	strokeWidth: "1.5"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 242,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "4",
																	y1: "5",
																	x2: "22",
																	y2: "2",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 249,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "5",
																	y1: "9",
																	x2: "24",
																	y2: "7",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 250,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "5",
																	y1: "13",
																	x2: "18",
																	y2: "12",
																	stroke: "#ef4444",
																	strokeWidth: "1.8"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 251,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
																	x: "4",
																	y: "16",
																	width: "16",
																	height: "5",
																	rx: "1",
																	fill: "#ef4444",
																	fillOpacity: "0.25",
																	stroke: "#ef4444",
																	strokeWidth: "0.8"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 252,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 241,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
															transform: "translate(54, 8) rotate(12)",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
																	x: "0",
																	y: "0",
																	width: "18",
																	height: "24",
																	rx: "3",
																	fill: "#dc2626",
																	stroke: "#991b1b",
																	strokeWidth: "1.2"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 257,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M0,8 Q9,14 18,8",
																	stroke: "#f87171",
																	strokeWidth: "1.5",
																	fill: "none"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 258,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M0,16 Q9,10 18,16",
																	stroke: "#ffffff",
																	strokeWidth: "1.2",
																	fill: "none"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 259,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ellipse", {
																	cx: "9",
																	cy: "0",
																	rx: "7",
																	ry: "2",
																	fill: "#e2e8f0",
																	stroke: "#94a3b8",
																	strokeWidth: "0.8"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 260,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 256,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
															transform: "translate(86, 2) rotate(-22)",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "0",
																	y1: "12",
																	x2: "34",
																	y2: "12",
																	stroke: "#f1f5f9",
																	strokeWidth: "2",
																	strokeLinecap: "round"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 266,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																	points: "34,12 44,7 44,17",
																	fill: "#f1f5f9",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 268,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
																	cx: "41",
																	cy: "11",
																	r: "1.2",
																	fill: "#475569"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 269,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "8",
																	y1: "6",
																	x2: "8",
																	y2: "18",
																	stroke: "#f1f5f9",
																	strokeWidth: "1.8",
																	strokeLinecap: "round"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 271,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "16",
																	y1: "4",
																	x2: "16",
																	y2: "20",
																	stroke: "#f1f5f9",
																	strokeWidth: "1.8",
																	strokeLinecap: "round"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 272,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
																	x1: "24",
																	y1: "6",
																	x2: "24",
																	y2: "18",
																	stroke: "#f1f5f9",
																	strokeWidth: "1.8",
																	strokeLinecap: "round"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 273,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																	points: "0,12 -8,6 -8,18",
																	fill: "#f1f5f9",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 275,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 264,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
															transform: "translate(112, 16) rotate(18)",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M6,0 C12,8 24,14 26,26 C20,24 16,16 10,12 C4,16 2,24 -2,22 C2,14 4,6 6,0 Z",
																	fill: "#facc15",
																	stroke: "#ca8a04",
																	strokeWidth: "1.2"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 280,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
																	cx: "6",
																	cy: "1",
																	r: "1.5",
																	fill: "#713f12"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 286,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M26,26 C26,27 25,28 24,28",
																	stroke: "#713f12",
																	strokeWidth: "1.5"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 287,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 279,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
															transform: "translate(38, 16) rotate(-8)",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ellipse", {
																cx: "10",
																cy: "8",
																rx: "9",
																ry: "5",
																fill: "#38bdf8",
																fillOpacity: "0.85",
																stroke: "#0284c7",
																strokeWidth: "1"
															}, void 0, false, {
																fileName: _jsxFileName$1,
																lineNumber: 292,
																columnNumber: 27
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																points: "2,6 8,1 15,4 12,12 4,10",
																fill: "#fed7aa",
																stroke: "#fb923c",
																strokeWidth: "0.8"
															}, void 0, false, {
																fileName: _jsxFileName$1,
																lineNumber: 293,
																columnNumber: 27
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 291,
															columnNumber: 25
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 234,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 227,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: cn("randy-body absolute inset-0 z-10 drop-shadow-md", activeObject === "bin" && "randy-active"),
												style: { clipPath: "polygon(0% 19.5%, 100% 19.5%, 100% 100%, 0% 100%)" },
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
													src: icon_bin_default,
													alt: "SOrT solid stainless steel metallic trash can",
													className: "h-full w-full object-contain"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 308,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 299,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: cn("randy-lid absolute inset-0 z-20 transition-transform", activeObject === "bin" && "randy-active"),
												style: { clipPath: "polygon(0% 0%, 100% 0%, 100% 21%, 0% 21%)" },
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
													src: icon_bin_default,
													alt: "",
													"aria-hidden": "true",
													className: "h-full w-full object-contain"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 325,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 316,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 222,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 221,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "sr-only",
									children: "Slam trash can for Trashes of the Day"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 334,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 209,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 flex flex-col items-center gap-1.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/feed",
									search: { filter: "trash" },
									className: "inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Recycle, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 343,
											columnNumber: 19
										}, this),
										"Trashes of the Day (",
										totalTrashes,
										")",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 345,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 338,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs font-medium text-slate-500",
									children: "Click the trash can to slam & review public callouts"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 347,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 337,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 208,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 154,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 153,
					columnNumber: 9
				}, this),
				statusMessage && /* @__PURE__ */ (void 0)("div", {
					className: "mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2",
					children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "h-4 w-4 text-[#d6a928]" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 358,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", { children: statusMessage }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 359,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 357,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					"aria-hidden": "true",
					className: "relative flex justify-center gap-4 overflow-hidden pt-4 pb-2 text-5xl font-black leading-none sm:gap-8 sm:text-7xl",
					children: cascade.map(({ letter, className }, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: `${className} sot-letter-cascade`,
						style: { animationDelay: `${index * 180}ms` },
						children: letter
					}, `${letter}-${index}`, false, {
						fileName: _jsxFileName$1,
						lineNumber: 369,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 364,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "relative flex h-3 w-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 384,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex h-3 w-3 rounded-full bg-emerald-500" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 385,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 383,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-lg font-black uppercase tracking-wide text-slate-950",
									children: "Live Brand Barometer & Daily Verdicts"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 387,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 382,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3 text-xs font-bold text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [totalVotes.toLocaleString(), " Total Community Votes"] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 392,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-3 w-px bg-slate-300" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 393,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/awards",
										className: "text-slate-950 hover:underline",
										children: "View Awards Leaderboard →"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 394,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 391,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 381,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between text-xs font-extrabold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-amber-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Coins, { className: "h-4 w-4 text-[#d6a928]" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 404,
											columnNumber: 17
										}, this),
										stashPct,
										"% Stashed (",
										totalStashes.toLocaleString(),
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 403,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Recycle, { className: "h-4 w-4 text-slate-500" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 408,
											columnNumber: 17
										}, this),
										trashPct,
										"% Trashed (",
										totalTrashes.toLocaleString(),
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 407,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 402,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 shadow-inner",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-l-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-700",
									style: { width: `${stashPct}%` }
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 413,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-r-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-700",
									style: { width: `${trashPct}%` }
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 417,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 412,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 401,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "h-4 w-4 text-primary" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 429,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
												className: "font-display text-sm font-extrabold uppercase tracking-wider text-slate-950",
												children: "Barometer Tier Segmentation"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 430,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600",
												children: [barometerBrands.length, " Brands"]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 433,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 428,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs text-slate-500",
										children: "Filter and compare brand sentiments within defined market tiers (Luxury, Premium, Mass Market, Budget)."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 437,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 427,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs font-semibold text-slate-500",
											children: "Sort Barometer:"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 444,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
											value: barometerSort,
											onChange: (e) => setBarometerSort(e.target.value),
											className: "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "trust",
													children: "Highest Trust Score"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 450,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "tier",
													children: "By Tier (Luxury → Budget)"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 451,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "name",
													children: "Brand Name (A-Z)"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 452,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 445,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 443,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 426,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex items-center gap-2 overflow-x-auto pb-1",
									children: BRAND_TIERS.map((tierOption) => {
										const info = tierOption !== "All tiers" ? getTierInfo(tierOption) : null;
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											onClick: () => setBarometerTier(tierOption),
											className: cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all", barometerTier === tierOption ? "bg-slate-950 text-white shadow-xs scale-[1.02]" : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"),
											children: [info?.pricePoint && /* @__PURE__ */ (void 0)("span", {
												className: "font-mono text-[10px] opacity-75",
												children: info.pricePoint
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 474,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: tierOption }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 476,
												columnNumber: 21
											}, this)]
										}, tierOption, true, {
											fileName: _jsxFileName$1,
											lineNumber: 463,
											columnNumber: 19
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 458,
									columnNumber: 13
								}, this),
								barometerTier !== "All tiers" && /* @__PURE__ */ (void 0)("div", {
									className: "mt-3 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs",
									children: [/* @__PURE__ */ (void 0)("span", { className: "mt-0.5 inline-block size-2 rounded-full shrink-0 bg-primary" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 485,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-slate-600",
										children: [
											/* @__PURE__ */ (void 0)("span", {
												className: "font-bold text-slate-900",
												children: [
													getTierInfo(barometerTier).label,
													" (",
													getTierInfo(barometerTier).pricePoint,
													"):"
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 487,
												columnNumber: 19
											}, this),
											" ",
											getTierInfo(barometerTier).description,
											" ",
											/* @__PURE__ */ (void 0)("span", {
												className: "text-slate-500 italic",
												children: [
													"Examples: ",
													getTierInfo(barometerTier).examples.slice(0, 4).join(", "),
													"."
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 491,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 486,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 484,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
									children: barometerBrands.slice(0, 4).map((brand) => {
										const tierInfo = getTierInfo(getBrandTier(brand.name, brand.category));
										const trust = Number(brand.trust_score) || 0;
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/brands/$slug",
											params: { slug: brand.slug },
											className: "group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-xs",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandLogo, {
														name: brand.name,
														url: brand.signedLogoUrl,
														className: "size-8 rounded-lg text-xs"
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 512,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold leading-none", tierInfo.badgeClass),
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "font-mono text-[9px]",
															children: tierInfo.pricePoint
														}, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 523,
															columnNumber: 27
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: tierInfo.shortName }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 524,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName$1,
														lineNumber: 517,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 511,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
													className: "mt-2.5 font-display text-sm font-bold text-slate-950 truncate group-hover:text-primary transition-colors",
													children: brand.name
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 527,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-[11px] text-slate-500 truncate",
													children: brand.category || "Consumer Brand"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 530,
													columnNumber: 23
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 510,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "mt-3 border-t border-slate-100 pt-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center justify-between text-[11px] font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-slate-500",
														children: "Barometer:"
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 537,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: trust >= 75 ? "text-emerald-600" : trust >= 50 ? "text-amber-600" : "text-rose-600",
														children: [trust, "% Trust"]
													}, void 0, true, {
														fileName: _jsxFileName$1,
														lineNumber: 538,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 536,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: cn("h-full rounded-full transition-all duration-500", trust >= 75 ? "bg-emerald-500" : trust >= 50 ? "bg-amber-500" : "bg-rose-500"),
														style: { width: `${Math.max(5, Math.min(100, trust))}%` }
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 551,
														columnNumber: 25
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 550,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 535,
												columnNumber: 21
											}, this)]
										}, brand.id, true, {
											fileName: _jsxFileName$1,
											lineNumber: 504,
											columnNumber: 19
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 499,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-slate-500",
										children: "Fair comparison: Brands only compete within proportional peer standards."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 571,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/brands",
										className: "font-bold text-primary hover:underline inline-flex items-center gap-1",
										children: [
											"Browse all ",
											brands.length,
											" brands ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "size-3.5" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 578,
												columnNumber: 51
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 574,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 570,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 425,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-6 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col justify-between rounded-2xl border border-amber-200 bg-white p-5 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "h-3.5 w-3.5 text-amber-700" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 590,
												columnNumber: 21
											}, this), "Top Stashed of the Day"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 589,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-display text-sm font-black text-amber-700",
											children: [
												"+",
												topStashedItem?.stashCount ?? 0,
												" Stashes"
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 593,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 588,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-3 font-display text-base font-bold text-slate-950 line-clamp-1",
										children: topStashedItem?.title ?? "Community Favorite Brand"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 597,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs text-slate-600 line-clamp-2",
										children: topStashedItem?.description ?? "Consumers are celebrating exceptional service, product durability, and ethical practices."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 600,
										columnNumber: 17
									}, this),
									topStashedItem?.brandName && /* @__PURE__ */ (void 0)("p", {
										className: "mt-2 text-xs font-semibold text-slate-500",
										children: ["Brand: ", /* @__PURE__ */ (void 0)("span", {
											className: "text-slate-900 font-bold",
											children: topStashedItem.brandName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 605,
											columnNumber: 28
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 604,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 587,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 pt-3 border-t border-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/feed",
										search: { filter: "stash" },
										className: "inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline",
										children: ["Explore all Stashes of the Day ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 615,
											columnNumber: 50
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 610,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 609,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 586,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { className: "h-3.5 w-3.5 text-slate-700" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 625,
												columnNumber: 21
											}, this), "Top Trashed of the Day"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 624,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-display text-sm font-black text-slate-900",
											children: [topTrashedItem?.trashCount ?? 0, " Trashed"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 628,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 623,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-3 font-display text-base font-bold text-slate-950 line-clamp-1",
										children: topTrashedItem?.title ?? "Critical Consumer Callout"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 632,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs text-slate-600 line-clamp-2",
										children: topTrashedItem?.description ?? "Public accountability on poor service delivery, pricing changes, or quality concerns."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 635,
										columnNumber: 17
									}, this),
									topTrashedItem?.brandName && /* @__PURE__ */ (void 0)("p", {
										className: "mt-2 text-xs font-semibold text-slate-500",
										children: ["Brand: ", /* @__PURE__ */ (void 0)("span", {
											className: "text-slate-900 font-bold",
											children: topTrashedItem.brandName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 640,
											columnNumber: 28
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 639,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 622,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 pt-3 border-t border-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/feed",
										search: { filter: "trash" },
										className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline",
										children: ["Explore all Trashes of the Day ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 650,
											columnNumber: 50
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 645,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 644,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 621,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 584,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 380,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 135,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 129,
		columnNumber: 5
	}, this);
}
var watermark_coins_default = "/assets/watermark-coins-Sl6CFqhN.png";
var watermark_bins_default = "/assets/watermark-bins-DF1LyL_8.png";
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
function Index() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-screen overflow-x-hidden bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			"aria-hidden": true,
			className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-y-0 left-0 w-1/2 opacity-[0.07]",
				style: {
					backgroundImage: `url(${watermark_coins_default})`,
					backgroundSize: "320px 320px",
					backgroundRepeat: "repeat",
					maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)"
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 9,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-y-0 right-0 w-1/2 opacity-[0.07]",
				style: {
					backgroundImage: `url(${watermark_bins_default})`,
					backgroundSize: "320px 320px",
					backgroundRepeat: "repeat",
					maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)"
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 16,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 8,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 26,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SotHomeHero, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 25,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
