import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { Ot as ArrowRight, c as Trophy, h as Sparkles, l as TriangleAlert, ot as Coins, w as Recycle } from "../_libs/lucide-react.mjs";
import { i as cn } from "./label-1cB10GDW.mjs";
import { A as playTrashSound, D as icon_coin_default, E as icon_bin_default, O as playCoinSpinSound, b as fetchFeed, c as Header } from "./Header-E8juhbIs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-eSkx3BEg.js
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
				lineNumber: 91,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute right-[12%] top-16 h-60 w-48 rotate-6 rounded-[2.5rem] border-[14px] border-slate-500" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 92,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 90,
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
								lineNumber: 99,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "People-Powered Brand Intelligence" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 100,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 98,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-5 font-display text-4xl font-black tracking-tight sm:text-6xl",
							children: ["Keep what serves you.", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "block text-[#d6a928]",
								children: "Challenge what does not."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 104,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 102,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg",
							children: "Direct public consumer signal where people speak clearly, brands respond responsibly, and the community delivers the verdict."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 106,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 97,
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
										lineNumber: 131,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: icon_coin_default,
										alt: "$OrT South African spinning gold coin",
										className: cn("sot-coin-art relative z-10 w-full max-w-[210px] sm:max-w-[250px] drop-shadow-md transition-transform group-hover:scale-105", activeObject === "coin" && "sot-object-active")
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 139,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 129,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "sr-only",
									children: "Spin coin for Stashes of the Day"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 148,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 117,
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
											lineNumber: 157,
											columnNumber: 19
										}, this),
										"Stashes of the Day (",
										totalStashes,
										")",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 159,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 152,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs font-medium text-slate-500",
									children: "Click the coin to spin on flat surface until flat"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 161,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 151,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 116,
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
												lineNumber: 184,
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
																	lineNumber: 202,
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
																	lineNumber: 209,
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
																	lineNumber: 210,
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
																	lineNumber: 211,
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
																	lineNumber: 212,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 201,
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
																	lineNumber: 217,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M0,8 Q9,14 18,8",
																	stroke: "#f87171",
																	strokeWidth: "1.5",
																	fill: "none"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 218,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M0,16 Q9,10 18,16",
																	stroke: "#ffffff",
																	strokeWidth: "1.2",
																	fill: "none"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 219,
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
																	lineNumber: 220,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 216,
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
																	lineNumber: 226,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																	points: "34,12 44,7 44,17",
																	fill: "#f1f5f9",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 228,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
																	cx: "41",
																	cy: "11",
																	r: "1.2",
																	fill: "#475569"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 229,
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
																	lineNumber: 231,
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
																	lineNumber: 232,
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
																	lineNumber: 233,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																	points: "0,12 -8,6 -8,18",
																	fill: "#f1f5f9",
																	stroke: "#94a3b8",
																	strokeWidth: "1"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 235,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 224,
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
																	lineNumber: 240,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
																	cx: "6",
																	cy: "1",
																	r: "1.5",
																	fill: "#713f12"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 246,
																	columnNumber: 27
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																	d: "M26,26 C26,27 25,28 24,28",
																	stroke: "#713f12",
																	strokeWidth: "1.5"
																}, void 0, false, {
																	fileName: _jsxFileName$1,
																	lineNumber: 247,
																	columnNumber: 27
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 239,
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
																lineNumber: 252,
																columnNumber: 27
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
																points: "2,6 8,1 15,4 12,12 4,10",
																fill: "#fed7aa",
																stroke: "#fb923c",
																strokeWidth: "0.8"
															}, void 0, false, {
																fileName: _jsxFileName$1,
																lineNumber: 253,
																columnNumber: 27
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName$1,
															lineNumber: 251,
															columnNumber: 25
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 194,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 187,
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
													lineNumber: 268,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 259,
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
													lineNumber: 285,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 276,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 182,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 181,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "sr-only",
									children: "Slam trash can for Trashes of the Day"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 294,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 169,
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
											lineNumber: 303,
											columnNumber: 19
										}, this),
										"Trashes of the Day (",
										totalTrashes,
										")",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 305,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 298,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs font-medium text-slate-500",
									children: "Click the trash can to slam & review public callouts"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 307,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 297,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 168,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 114,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 113,
					columnNumber: 9
				}, this),
				statusMessage && /* @__PURE__ */ (void 0)("div", {
					className: "mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2",
					children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "h-4 w-4 text-[#d6a928]" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 318,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", { children: statusMessage }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 319,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 317,
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
						lineNumber: 329,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 324,
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
										lineNumber: 344,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex h-3 w-3 rounded-full bg-emerald-500" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 345,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 343,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-lg font-black uppercase tracking-wide text-slate-950",
									children: "Live Brand Barometer & Daily Verdicts"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 347,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 342,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3 text-xs font-bold text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [totalVotes.toLocaleString(), " Total Community Votes"] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 352,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-3 w-px bg-slate-300" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 353,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/awards",
										className: "text-slate-950 hover:underline",
										children: "View Awards Leaderboard →"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 354,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 351,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 341,
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
											lineNumber: 364,
											columnNumber: 17
										}, this),
										stashPct,
										"% Stashed (",
										totalStashes.toLocaleString(),
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 363,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Recycle, { className: "h-4 w-4 text-slate-500" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 368,
											columnNumber: 17
										}, this),
										trashPct,
										"% Trashed (",
										totalTrashes.toLocaleString(),
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 367,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 362,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 shadow-inner",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-l-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-700",
									style: { width: `${stashPct}%` }
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 373,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-r-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-700",
									style: { width: `${trashPct}%` }
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 377,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 372,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 361,
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
												lineNumber: 391,
												columnNumber: 21
											}, this), "Top Stashed of the Day"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 390,
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
											lineNumber: 394,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 389,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-3 font-display text-base font-bold text-slate-950 line-clamp-1",
										children: topStashedItem?.title ?? "Community Favorite Brand"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 398,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs text-slate-600 line-clamp-2",
										children: topStashedItem?.description ?? "Consumers are celebrating exceptional service, product durability, and ethical practices."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 401,
										columnNumber: 17
									}, this),
									topStashedItem?.brandName && /* @__PURE__ */ (void 0)("p", {
										className: "mt-2 text-xs font-semibold text-slate-500",
										children: ["Brand: ", /* @__PURE__ */ (void 0)("span", {
											className: "text-slate-900 font-bold",
											children: topStashedItem.brandName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 406,
											columnNumber: 28
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 405,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 388,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 pt-3 border-t border-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/feed",
										search: { filter: "stash" },
										className: "inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline",
										children: ["Explore all Stashes of the Day ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 416,
											columnNumber: 50
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 411,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 410,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 387,
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
												lineNumber: 426,
												columnNumber: 21
											}, this), "Top Trashed of the Day"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 425,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-display text-sm font-black text-slate-900",
											children: [topTrashedItem?.trashCount ?? 0, " Trashed"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 429,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 424,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-3 font-display text-base font-bold text-slate-950 line-clamp-1",
										children: topTrashedItem?.title ?? "Critical Consumer Callout"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 433,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs text-slate-600 line-clamp-2",
										children: topTrashedItem?.description ?? "Public accountability on poor service delivery, pricing changes, or quality concerns."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 436,
										columnNumber: 17
									}, this),
									topTrashedItem?.brandName && /* @__PURE__ */ (void 0)("p", {
										className: "mt-2 text-xs font-semibold text-slate-500",
										children: ["Brand: ", /* @__PURE__ */ (void 0)("span", {
											className: "text-slate-900 font-bold",
											children: topTrashedItem.brandName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 441,
											columnNumber: 28
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 440,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 423,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 pt-3 border-t border-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/feed",
										search: { filter: "trash" },
										className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline",
										children: ["Explore all Trashes of the Day ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 451,
											columnNumber: 50
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 446,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 445,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 422,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 385,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 340,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 95,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 89,
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
