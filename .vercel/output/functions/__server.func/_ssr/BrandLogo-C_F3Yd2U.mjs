import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as cn } from "./label-1cB10GDW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BrandLogo-C_F3Yd2U.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/BrandLogo.tsx";
/**
* Shared brand logo renderer. Logos are fitted (never cropped) on a neutral pad
* so wide wordmarks and pale marks both stay readable.
*/
function BrandLogo({ name, url, className, imgClassName }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary p-1 font-bold", className),
		children: url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
			src: url,
			alt: name,
			loading: "lazy",
			className: cn("h-full w-full object-contain", imgClassName)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			"aria-hidden": true,
			children: name.charAt(0).toUpperCase()
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 33,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 19,
		columnNumber: 5
	}, this);
}
//#endregion
export { BrandLogo as t };
