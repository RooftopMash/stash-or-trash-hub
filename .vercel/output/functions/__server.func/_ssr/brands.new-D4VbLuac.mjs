import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { W as ImagePlus } from "../_libs/lucide-react.mjs";
import { l as useAuth, n as Route } from "./router-Ymvu7mB_.mjs";
import { n as Input, r as Label, t as Button } from "./label-1cB10GDW.mjs";
import { F as searchBrands, c as Header, p as createBrand, u as Textarea } from "./Header-BKSLqlsv.mjs";
import { t as BRAND_CATEGORIES } from "./categories-CjnOH3FO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands.new-D4VbLuac.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/brands.new.tsx?tsr-split=component";
function NewBrandPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { name: initialName } = Route.useSearch();
	const [name, setName] = (0, import_react.useState)(initialName ?? "");
	const [description, setDescription] = (0, import_react.useState)("");
	const [website, setWebsite] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("ZA");
	const [logo, setLogo] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [duplicate, setDuplicate] = (0, import_react.useState)(null);
	const [checkingName, setCheckingName] = (0, import_react.useState)(false);
	const checkForDuplicate = async () => {
		if (!name.trim()) {
			setDuplicate(null);
			return;
		}
		setCheckingName(true);
		try {
			const matches = await searchBrands(name.trim(), 3);
			setDuplicate(matches.find((match) => match.name.trim().toLowerCase() === name.trim().toLowerCase())?.name ?? null);
		} finally {
			setCheckingName(false);
		}
	};
	const submit = async () => {
		if (!user) return;
		if (!name.trim()) return toast.error("A brand needs a name.");
		setBusy(true);
		try {
			const brand = await createBrand({
				ownerId: user.id,
				name,
				description,
				website,
				category,
				country,
				logo
			});
			toast.success("Brand created!");
			navigate({
				to: "/brands/$slug",
				params: { slug: brand.slug }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not create brand.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 72,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-lg px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: "Create a brand"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Set up a brand page so the community can post and vote on it."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "name",
									children: "Brand name"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 80,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "name",
									value: name,
									onChange: (e) => {
										setName(e.target.value);
										setDuplicate(null);
									},
									onBlur: checkForDuplicate,
									maxLength: 80
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 81,
									columnNumber: 13
								}, this),
								checkingName && /* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-muted-foreground",
									children: "Checking the global brand directory…"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 30
								}, this),
								duplicate && /* @__PURE__ */ (void 0)("p", {
									className: "rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-700",
									children: [
										"A brand named “",
										duplicate,
										"” already exists. Check its page before creating a duplicate."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 27
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 79,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "cat",
								children: "Category"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								id: "cat",
								value: category,
								onChange: (e) => setCategory(e.target.value),
								className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: "",
									children: "Select the closest category"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 94,
									columnNumber: 15
								}, this), BRAND_CATEGORIES.filter((item) => item !== "All categories").map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: item,
									children: item
								}, item, false, {
									fileName: _jsxFileName,
									lineNumber: 95,
									columnNumber: 87
								}, this))]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "country",
									children: "Country"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 101,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "country",
									value: country,
									onChange: (e) => setCountry(e.target.value.toUpperCase().slice(0, 2)),
									placeholder: "ZA",
									maxLength: 2
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 102,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: "Use the ISO country code where the brand operates or is headquartered."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 100,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "web",
								children: "Website"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "web",
								value: website,
								onChange: (e) => setWebsite(e.target.value),
								placeholder: "https://…",
								maxLength: 200
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 109,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "desc",
								children: "Description"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
								id: "desc",
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 3,
								maxLength: 500
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 111,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "logo",
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ImagePlus, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 117,
									columnNumber: 15
								}, this), " Logo"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 116,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "logo",
								type: "file",
								accept: "image/*",
								onChange: (e) => setLogo(e.target.files?.[0] ?? null)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: "New brand pages are community-submitted and may be reviewed for duplicates, ownership, category, country, and source accuracy before verification."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							className: "w-full",
							onClick: submit,
							disabled: busy || checkingName,
							children: busy ? "Submitting…" : "Submit brand for review"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 73,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 71,
		columnNumber: 10
	}, this);
}
//#endregion
export { NewBrandPage as component };
