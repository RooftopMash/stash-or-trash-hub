import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Search, At as CircleCheck, C as ShoppingBag, E as ShieldCheck, I as QrCode, Vt as Building2, b as Tag, x as Sparkles } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { S as SubmitDialog, k as ProductAuthenticityCameraScanner, x as Header } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-Dt3WR_nX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScanPage() {
	useNavigate();
	const { t } = useTranslation();
	const [prefilledPost, setPrefilledPost] = (0, import_react.useState)(null);
	const [submitDialogOpen, setSubmitDialogOpen] = (0, import_react.useState)(false);
	const handleApplyToPost = (params) => {
		setPrefilledPost(params);
		setSubmitDialogOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
								" ",
								t("scanner.badge", { defaultValue: "AI Product & Authenticity Barometer" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl sm:text-4xl font-extrabold font-display tracking-tight",
							children: t("scanner.title", { defaultValue: "Scan Product Barcodes & Logos to Verify Authenticity" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto",
							children: t("scanner.subtitle", { defaultValue: "Point your camera at any product packaging, barcode, luxury logo, or care tag. Instantly trace corporate brand owner and verify whether the product is genuine or a fake replica." })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductAuthenticityCameraScanner, {
					standalone: true,
					onApplyToPost: handleApplyToPost
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
										" ",
										t("scanner.fashionTitle", { defaultValue: "Fashion & Retail Anti-Counterfeit Verification" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl sm:text-2xl font-bold font-display",
									children: t("scanner.fashionHeading", { defaultValue: "Helping Fashion & Brands Track Sales and Confirm Authenticity" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: t("scanner.fashionDescription", { defaultValue: "Counterfeiting costs the global economy over $500 billion annually. Stash Or Trash helps consumers and brands verify authentic ownership in seconds." })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-border bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm",
											children: t("scanner.gs1Title", { defaultValue: "GS1 GTIN & Barcode Checksum" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: t("scanner.gs1Desc", { defaultValue: "Validates manufacturing origin against global GS1 checksums and retail registries." })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-border bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm",
											children: t("scanner.opticalTitle", { defaultValue: "Optical Brand Mark & Typography" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: t("scanner.opticalDesc", { defaultValue: "Neural inspection of kerning, serifs, print registration, and embossed packaging hallmarks." })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-border bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm",
											children: t("scanner.tamperTitle", { defaultValue: "Tamper & Media Forensics" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: t("scanner.tamperDesc", { defaultValue: "Detects synthetic AI media generation, Photoshop manipulation, spliced labels, and altered video clips." })
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-sm text-foreground flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }),
										" ",
										t("scanner.prPortalTitle", { defaultValue: "Brand PR & Client Verification Dossier" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: t("scanner.prPortalDesc", { defaultValue: "Brand PR Officers and clients can verify authentic batches, audit media integrity, and issue official brand certificates." })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "1. Corporate Brand Lineage & Registry:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Confirms corporate parent company, official headquarters, and authorized retail distribution channels." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "2. Non-Tampering Video & Image Audit:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Verifies physical lighting vectors, sensor grain, text consistency, and flags synthetic AI manipulation." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "3. Step-by-Step Client Verification:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Provides clients with exact physical inspection cues (laser-etched codes, stitching density, bottle seals)." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "4. Downloadable PR Audit Dossier:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Generates an official tamper-free certificate to share with PR teams, retail partners, and customer service." })]
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-xl border border-border bg-card/60 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm",
									children: "Instant Brand Owner Mapping"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Find out who actually owns the product you're buying (e.g. Mondelēz owns Oreo; Unilever owns Ben & Jerry's; Kering owns Gucci). No manual corporate searches required."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-xl border border-border bg-card/60 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm",
									children: "AI Legitimacy & Deepfake Shield"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Forensic inspection detects AI-generated renders, synthetic diffusion artifacts, and Photoshop manipulation to ensure all review evidence is 100% genuine."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-xl border border-border bg-card/60 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm",
									children: "Brand Directory Integration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Directly cross-reference identified brands with Stash Or Trash community ratings, customer verdicts, and brand response records."
								})
							]
						})
					]
				}),
				prefilledPost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitDialog, {
					open: submitDialogOpen,
					onOpenChange: setSubmitDialogOpen,
					defaultBrandId: prefilledPost.matchedBrandId,
					initialValues: {
						title: `${prefilledPost.brandName} ${prefilledPost.productName || ""}`.trim(),
						description: `Brand: ${prefilledPost.brandName} | Corporate Owner: ${prefilledPost.brandOwner}\n${prefilledPost.scanResult.brandInfo.parentCompanyContext}\n[Authenticity Verdict: ${prefilledPost.scanResult.counterfeitAssessment?.verdict?.toUpperCase() || prefilledPost.scanResult.authenticity.verdictStatus} (Score: ${prefilledPost.scanResult.counterfeitAssessment?.authenticityScore ?? prefilledPost.scanResult.authenticity.score}%)]`,
						category: prefilledPost.category,
						file: prefilledPost.file || null,
						aiScanResult: prefilledPost.scanResult
					}
				})
			]
		})]
	});
}
//#endregion
export { ScanPage as component };
