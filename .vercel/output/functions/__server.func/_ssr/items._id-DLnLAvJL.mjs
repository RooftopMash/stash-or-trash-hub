import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { c as Header } from "./Header-E8juhbIs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/items._id-DLnLAvJL.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/items.$id.tsx?tsr-split=errorComponent";
function PostError() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 8,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground",
			children: t("social.loadFailed")
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 9,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 10
	}, this);
}
//#endregion
export { PostError as errorComponent };
