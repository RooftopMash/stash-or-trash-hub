import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as Label, n as Button, o as useAuth, r as Input } from "./label-BlRLLIBM.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { ot as ImagePlus } from "../_libs/lucide-react.mjs";
import { B as createBrand, D as Textarea, Q as searchBrands, h as BRAND_CATEGORIES, n as Route, x as Header } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands.new-CVQcVw22.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-lg px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: "Create a brand"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Set up a brand page so the community can post and vote on it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Brand name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: name,
									onChange: (e) => {
										setName(e.target.value);
										setDuplicate(null);
									},
									onBlur: checkForDuplicate,
									maxLength: 80
								}),
								checkingName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Checking the global brand directory…"
								}),
								duplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-700",
									children: [
										"A brand named “",
										duplicate,
										"” already exists. Check its page before creating a duplicate."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cat",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "cat",
								value: category,
								onChange: (e) => setCategory(e.target.value),
								className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select the closest category"
								}), BRAND_CATEGORIES.filter((item) => item !== "All categories").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: item
								}, item))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "country",
									children: "Country"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "country",
									value: country,
									onChange: (e) => setCountry(e.target.value.toUpperCase().slice(0, 2)),
									placeholder: "ZA",
									maxLength: 2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Use the ISO country code where the brand operates or is headquartered."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "web",
								children: "Website"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "web",
								value: website,
								onChange: (e) => setWebsite(e.target.value),
								placeholder: "https://…",
								maxLength: 200
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "desc",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "desc",
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 3,
								maxLength: 500
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "logo",
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-4 w-4" }), " Logo"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "logo",
								type: "file",
								accept: "image/*",
								onChange: (e) => setLogo(e.target.files?.[0] ?? null)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: "New brand pages are community-submitted and may be reviewed for duplicates, ownership, category, country, and source accuracy before verification."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: submit,
							disabled: busy || checkingName,
							children: busy ? "Submitting…" : "Submit brand for review"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { NewBrandPage as component };
