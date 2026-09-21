import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { U as Info, v as ShieldCheck, vt as ChartColumn } from "../_libs/lucide-react.mjs";
import { i as cn } from "./label-1cB10GDW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PeopleTrustFactor-Cldphfb0.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/PeopleTrustFactor.tsx";
function calculatePeopleTrustFactor(signals) {
	const values = Object.values(signals);
	return {
		score: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
		signals
	};
}
function PeopleTrustFactor({ signals, compact = false }) {
	const { score } = calculatePeopleTrustFactor(signals);
	const status = score >= 75 ? "Strong" : score >= 55 ? "Developing" : "Insufficient data";
	const scoreColor = score >= 75 ? "text-emerald-600" : score >= 55 ? "text-amber-600" : "text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: cn("rounded-2xl border border-stash/20 bg-stash/5", compact ? "p-4" : "p-5"),
		"aria-labelledby": "people-trust-factor-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 text-stash",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 37,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs font-bold uppercase tracking-[0.16em]",
						children: "People Trust Factor"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 38,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 36,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					id: "people-trust-factor-title",
					className: "mt-2 font-display text-xl font-bold",
					children: "A transparent people-to-brand signal"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 42,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 35,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: cn("text-3xl font-extrabold", scoreColor),
						children: score
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 47,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs font-semibold text-muted-foreground",
						children: status
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 34,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted-foreground",
				children: "An internal SOT framework combining evidence quality, brand response, lived experience, and trust signals. It is not an external certification or endorsement."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 51,
				columnNumber: 7
			}, this),
			!compact && /* @__PURE__ */ (void 0)("div", {
				className: "mt-4 grid gap-2 sm:grid-cols-4",
				children: Object.entries(signals).map(([label, value]) => /* @__PURE__ */ (void 0)("div", {
					className: "rounded-xl border border-border bg-background p-3",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "text-xs capitalize text-muted-foreground",
							children: label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "text-sm font-bold",
							children: value
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 61,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "mt-2 h-1.5 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (void 0)("div", {
							className: "h-full rounded-full bg-stash",
							style: { width: `${value}%` }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 64,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 15
					}, this)]
				}, label, true, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Info, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 71,
					columnNumber: 9
				}, this), "Scores require sufficient, comparable data and should be read with the supporting evidence."]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 70,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 30,
		columnNumber: 5
	}, this);
}
function PeopleTrustFactorLink() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1 text-xs font-semibold text-stash",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-3.5 w-3.5" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 7
		}, this), "People Trust framework"]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 80,
		columnNumber: 5
	}, this);
}
//#endregion
export { PeopleTrustFactorLink as n, PeopleTrustFactor as t };
