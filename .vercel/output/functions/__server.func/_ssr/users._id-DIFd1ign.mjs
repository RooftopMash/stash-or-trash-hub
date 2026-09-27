import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { x as Header } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users._id-DIFd1ign.js
var import_jsx_runtime = require_jsx_runtime();
function ProfileMissing() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground",
			children: t("social.profileNotFound")
		})]
	});
}
//#endregion
export { ProfileMissing as notFoundComponent };
