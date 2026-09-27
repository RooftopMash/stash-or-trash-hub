import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn } from "./label-BlRLLIBM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BrandLogo-Nd6kylYm.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Shared brand logo renderer. Logos are fitted (never cropped) on a neutral pad
* so wide wordmarks and pale marks both stay readable.
*/
function BrandLogo({ name, url, className, imgClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary p-1 font-bold", className),
		children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: name,
			loading: "lazy",
			className: cn("h-full w-full object-contain", imgClassName)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": true,
			children: name.charAt(0).toUpperCase()
		})
	});
}
//#endregion
export { BrandLogo as t };
