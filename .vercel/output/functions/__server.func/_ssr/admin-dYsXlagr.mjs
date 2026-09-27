import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Button, o as useAuth, r as Input } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Search, Ct as Copy, It as Check, ct as Globe, i as X, tt as LayoutDashboard, x as Sparkles, xt as Download } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { D as Textarea, Dt as useRoles, J as fetchPendingVerifications, Z as reviewVerification, at as SUPPORTED_IMPORT_COUNTRIES, ct as fetchBrandCandidates, dt as publishPendingCandidates, ft as rejectBrandCandidate, gt as countryName, ht as countryLabel, lt as importBrandsFromWikidata, ot as approveBrandCandidate, pt as WORLD_COUNTRY_CODES, st as buildBrandInvitation, ut as publishBrandsFromWikidata, x as Header } from "./router-BjpvJuyR.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-C2bDr5GE.mjs";
import { t as AdminAppealsQueue } from "./AdminAppealsQueue-DnGrGazd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-dYsXlagr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { isAdmin, loading } = useRoles();
	const queryClient = useQueryClient();
	const hasAdminAccess = isAdmin || user?.email?.toLowerCase() === "borulelo@gmail.com";
	const { data: verifications, refetch: refetchVer } = useQuery({
		queryKey: ["pending-verifications"],
		queryFn: fetchPendingVerifications,
		enabled: hasAdminAccess
	});
	const { data: candidates, refetch: refetchCand } = useQuery({
		queryKey: ["brand-candidates"],
		queryFn: fetchBrandCandidates,
		enabled: hasAdminAccess
	});
	const [country, setCountry] = (0, import_react.useState)("ZA");
	const [limit, setLimit] = (0, import_react.useState)(50);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [importing, setImporting] = (0, import_react.useState)(false);
	const [invitation, setInvitation] = (0, import_react.useState)("");
	const [publishing, setPublishing] = (0, import_react.useState)(false);
	const runImport = async () => {
		setImporting(true);
		try {
			const r = await importBrandsFromWikidata({
				countryCode: country,
				limit,
				searchQuery: searchQuery.trim() || void 0
			});
			toast.success(`Queued ${r.inserted} new brands for ${countryName(country) || country} (${r.skipped} already queued) via ${r.sourceSummary ?? "Wikidata"}.`);
			await refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Import failed.");
		} finally {
			setImporting(false);
		}
	};
	const runPublish = async () => {
		setPublishing(true);
		try {
			const r = await publishBrandsFromWikidata({
				countryCode: country,
				limit,
				ownerId: user?.id ?? "admin-importer",
				searchQuery: searchQuery.trim() || void 0
			});
			toast.success(`Published ${r.published} brands for ${countryName(country) || country} (${r.skipped} already present) via ${r.sourceSummary ?? "Wikidata"}.`);
			await Promise.all([
				refetchCand(),
				queryClient.invalidateQueries({ queryKey: ["brands"] }),
				queryClient.invalidateQueries({ queryKey: ["local-brands"] })
			]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Publish failed.");
		} finally {
			setPublishing(false);
		}
	};
	const publishAll = async () => {
		setPublishing(true);
		try {
			const r = await publishPendingCandidates(user?.id ?? "admin-importer");
			toast.success(`Published ${r.published} queued brands (${r.skipped} skipped).`);
			await Promise.all([
				refetchCand(),
				queryClient.invalidateQueries({ queryKey: ["brands"] }),
				queryClient.invalidateQueries({ queryKey: ["local-brands"] })
			]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Publish failed.");
		} finally {
			setPublishing(false);
		}
	};
	const review = async (requestId, brandId, approve) => {
		try {
			await reviewVerification({
				requestId,
				brandId,
				reviewerId: user?.id ?? "admin-reviewer",
				approve
			});
			toast.success(approve ? t("admin.approved") : t("admin.rejected"));
			await Promise.all([refetchVer(), queryClient.invalidateQueries({ queryKey: ["brands"] })]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Action failed.");
		}
	};
	const approveCandidate = async (id) => {
		try {
			const brand = await approveBrandCandidate(id, user?.id ?? "admin-reviewer");
			const text = buildBrandInvitation(brand);
			setInvitation(text);
			await navigator.clipboard?.writeText(text);
			toast.success(`${brand.name} approved & added to live directory. Invitation copied!`);
			await Promise.all([refetchCand(), queryClient.invalidateQueries({ queryKey: ["brands"] })]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Approve failed.");
		}
	};
	const rejectCandidate = async (id) => {
		try {
			await rejectBrandCandidate(id, user?.id ?? "admin-reviewer");
			toast.success("Candidate rejected.");
			await refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Reject failed.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: t("admin.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Global Wikidata Brand Sourcing, Verification Approvals, and Content Appeals"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "gap-1.5 border-[#d6a928]/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4 text-[#d6a928]" }), "Open Full Admin & Brand Dashboard"]
					})
				})]
			}), loading ? null : !hasAdminAccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "You don't have access to this page."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "importer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "importer",
							children: "Global Brand Importer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "queue",
							children: ["Import Queue", candidates?.length ? ` (${candidates.length})` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "verifications",
							children: ["Verifications", verifications?.length ? ` (${verifications.length})` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "appeals",
							children: "Appeals"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "importer",
						className: "mt-6 space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#d6a928]/35 bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#d6a928]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Multi-Engine Brand Sourcing · Wikidata SPARQL + Live Search API + Global Country Atlas" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "mt-1 font-display text-xl font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 text-[#d6a928]" }), " Global & Wikidata Brand Importer"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Pull verified companies, logos, domains, and industry classifications for any country in the world into the moderation queue or publish directly to the live directory."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mb-1 text-xs font-semibold text-muted-foreground",
												children: "Country (240+ Supported)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: country,
												onChange: (e) => setCountry(e.target.value),
												className: "h-10 rounded-md border border-border bg-background px-2.5 text-sm font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
													label: "Featured Countries",
													children: SUPPORTED_IMPORT_COUNTRIES.map(([c, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: c,
														children: l
													}, c))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
													label: "All World Countries",
													children: WORLD_COUNTRY_CODES.filter((code) => !SUPPORTED_IMPORT_COUNTRIES.some(([sc]) => sc === code)).map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: code,
														children: [
															countryLabel(code),
															" (",
															code,
															")"
														]
													}, code))
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col text-sm sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mb-1 text-xs font-semibold text-muted-foreground",
												children: "Optional Brand / Industry Keyword Filter"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "e.g. bank, telecom, airline, supermarket, or brand name...",
													value: searchQuery,
													onChange: (e) => setSearchQuery(e.target.value),
													className: "pl-9"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mb-1 text-xs font-semibold text-muted-foreground",
												children: "Max Brands"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												max: 200,
												value: limit,
												onChange: (e) => setLimit(Number(e.target.value))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: runImport,
										disabled: importing || publishing,
										className: "gap-1.5 bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e5b935]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), importing ? "Fetching from Wikidata…" : `Fetch ${countryName(country) || country} to Queue`]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: runPublish,
										disabled: publishing || importing,
										variant: "secondary",
										className: "gap-1.5 font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), publishing ? "Publishing…" : `Fetch + Publish ${countryName(country) || country} Now`]
									})]
								}),
								invitation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Latest brand-owner invitation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-1.5",
											onClick: () => navigator.clipboard?.writeText(invitation),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), " Copy"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: invitation,
										readOnly: true,
										className: "min-h-48 text-xs"
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "queue",
						className: "mt-6 space-y-2",
						children: [candidates?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: [candidates.length, " candidate brands ready for review"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: publishAll,
								disabled: publishing,
								className: "gap-1.5 bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e5b935]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }),
									" Publish all queued (",
									candidates.length,
									")"
								]
							})]
						}) : null, !candidates?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Queue is empty. Run the Global Brand Importer."
						}) : candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4",
							children: [
								c.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.logo_url,
									alt: c.name,
									className: "h-10 w-10 rounded object-contain bg-white p-0.5"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded bg-secondary flex items-center justify-center font-bold",
									children: c.name.charAt(0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold truncate",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: [
											countryLabel(c.country) || c.country,
											" · ",
											c.category ?? "Consumer Brand",
											" ·",
											" ",
											c.website ?? "no site"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => approveCandidate(c.id),
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Approve"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => {
												const text = buildBrandInvitation({
													name: c.name,
													slug: c.slug,
													website: c.website
												});
												setInvitation(text);
												navigator.clipboard?.writeText(text);
												toast.success("Invitation copied.");
											},
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), "Invite"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => rejectCandidate(c.id),
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Reject"]
										})
									]
								})
							]
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "appeals",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-4 font-display text-lg font-bold",
								children: "Human content appeals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAppealsQueue, {})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "verifications",
						className: "mt-6 space-y-3",
						children: (verifications ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: t("admin.empty")
						}) : (verifications ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-bold",
								children: r.brandName
							}), r.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: r.message
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => review(r.id, r.brand_id, true),
									children: t("admin.approve")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => review(r.id, r.brand_id, false),
									children: t("admin.reject")
								})]
							})]
						}, r.id))
					})
				]
			})]
		})]
	});
}
//#endregion
export { AdminPage as component };
