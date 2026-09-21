import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { M as MessageCircle, T as QrCode, Tt as Award, U as Info, at as Copy, f as Ticket, ft as CircleCheckBig, h as Sparkles, ht as ChevronRight, ot as Coins, p as ThumbsUp, q as Gift, tt as ExternalLink, u as TrendingUp, vt as ChartColumn, wt as BadgeCheck, yt as Camera } from "../_libs/lucide-react.mjs";
import { l as useAuth, o as Route$4 } from "./router-I-3x-i8y.mjs";
import { i as cn, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { A as playTrashSound, C as fetchMyVerificationRequest, D as icon_coin_default, E as icon_bin_default, N as requestVerification, _ as fetchBrandVerdict, a as DialogHeader, b as fetchFeed, c as Header, d as castBrandVote, h as fetchBrandBySlug, j as removeBrandVote, k as playStashSound, l as SubmitDialog, n as DialogContent, o as DialogTitle, t as Dialog } from "./Header-E8juhbIs.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { t as PeopleTrustFactor } from "./PeopleTrustFactor-Cldphfb0.mjs";
import { n as getBrandTier, r as getTierInfo } from "./brandTiers-B_KPABqh.mjs";
import { t as BrandLogo } from "./BrandLogo-C_F3Yd2U.mjs";
import { h as isFollowingBrand, o as getFollowerCount, r as followBrand, x as unfollowBrand } from "./social-CNdxEfFV.mjs";
import { n as emitEngagementChange, r as recordVote, t as ItemCard } from "./ItemCard-MVCZJdhp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands._slug-DnjxaFPL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/BrandVerdict.tsx";
/**
* One-tap Stash / Trash on a brand itself. `compact` renders just the two
* buttons for use inside brand cards; the default renders the full panel with
* the live community meter.
*/
function BrandVerdict({ brandId, brandName, compact = false, className }) {
	const { user } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data, refetch } = useQuery({
		queryKey: [
			"brand-verdict",
			brandId,
			user?.id ?? "anon"
		],
		queryFn: () => fetchBrandVerdict(brandId, user?.id ?? null)
	});
	const mine = data?.myVerdict ?? null;
	const pct = data?.stash_pct ?? 50;
	const vote = async (verdict) => {
		if (!user) {
			toast.info(t("vote.signInPrompt"));
			navigate({ to: "/auth" });
			return;
		}
		setBusy(true);
		try {
			if (mine === verdict) await removeBrandVote(brandId, user.id);
			else {
				await castBrandVote(brandId, user.id, verdict);
				const { reward, milestone } = recordVote();
				emitEngagementChange();
				toast.success(milestone ?? reward);
			}
			await refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("vote.voteFailed"));
		} finally {
			setBusy(false);
		}
	};
	const buttons = /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("grid grid-cols-2 gap-2", !compact && "gap-3"),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			variant: "stash",
			size: compact ? "sm" : "lg",
			disabled: busy,
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				playStashSound();
				vote("stash");
			},
			className: cn("gap-2", mine === "stash" && "verdict-picked", mine === "trash" && "verdict-dimmed"),
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: icon_coin_default,
					alt: "",
					"aria-hidden": true,
					className: "verdict-icon"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 86,
					columnNumber: 9
				}, this),
				" ",
				t("vote.stash")
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 70,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			variant: "trash",
			size: compact ? "sm" : "lg",
			disabled: busy,
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				playTrashSound();
				vote("trash");
			},
			className: cn("gap-2", mine === "trash" && "verdict-picked", mine === "stash" && "verdict-dimmed"),
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: icon_bin_default,
					alt: "",
					"aria-hidden": true,
					className: "verdict-icon"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 104,
					columnNumber: 9
				}, this),
				" ",
				t("vote.trash")
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 88,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 69,
		columnNumber: 5
	}, this);
	if (compact) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className,
		children: buttons
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 109,
		columnNumber: 23
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: cn("rounded-2xl border border-border bg-card p-5", className),
		"aria-label": t("brand.verdictTitle", { brand: brandName }),
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "font-display text-xl font-extrabold",
				children: t("brand.verdictTitle", { brand: brandName })
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 116,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("brand.verdictHint")
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 119,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4",
				children: buttons
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 121,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex h-2.5 overflow-hidden rounded-full bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-stash",
						style: { width: `${pct}%` }
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 125,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-trash",
						style: { width: `${100 - pct}%` }
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 126,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 124,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-1.5 flex justify-between text-xs font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-stash",
							children: t("vote.stashCount", { count: data?.stash ?? 0 })
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 129,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-muted-foreground",
							children: (data?.total ?? 0) === 0 ? t("vote.noVotes") : t("vote.stashPct", { pct })
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 130,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-trash",
							children: t("vote.trashCount", { count: data?.trash ?? 0 })
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 133,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 128,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 123,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 112,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/brands.$slug.tsx?tsr-split=component";
function getPeoplesSotGrade(score) {
	if (score >= 85) return {
		grade: "AAA",
		color: "bg-emerald-500 text-white",
		border: "border-emerald-500/20",
		textColor: "text-emerald-500",
		description: "Prime Trust Grade. Excellent community sentiment, extremely low dissatisfaction."
	};
	else if (score >= 70) return {
		grade: "AA",
		color: "bg-teal-500 text-white",
		border: "border-teal-500/20",
		textColor: "text-teal-500",
		description: "High Quality Grade. Strong customer loyalty and stable PR reputation."
	};
	else if (score >= 50) return {
		grade: "A",
		color: "bg-amber-500 text-black",
		border: "border-amber-500/20",
		textColor: "text-amber-600",
		description: "Satisfactory Grade. Balanced customer reviews, average market response."
	};
	else if (score >= 35) return {
		grade: "BBB",
		color: "bg-orange-500 text-white",
		border: "border-orange-500/20",
		textColor: "text-orange-500",
		description: "Vulnerable Grade. High customer service friction and visible negative sentiment."
	};
	else return {
		grade: "D (Trash)",
		color: "bg-red-500 text-white",
		border: "border-red-500/20",
		textColor: "text-red-500",
		description: "Substantial Risk. Severe dissatisfaction, action urgently required to restore goodwill."
	};
}
var BILLBOARDS = [
	{
		id: "bb-1",
		title: "Metro Plaza Digital Billboard — 35% Off Loyalty Pass",
		brandSlug: "adidas",
		type: "Discount Reward",
		qrContent: "SOT_BB_ADIDAS_35_LOYALTY",
		couponCode: "STASH_35_METRO",
		perk: "Unlocks a 35% discount coupon on online e-commerce checkout + 50 SOT Social Points.",
		targetUrl: "https://adidas.com"
	},
	{
		id: "bb-2",
		title: "Times Square Interactive CX Board — Free Premium Gift Card",
		brandSlug: "starbucks",
		type: "Freebie Reward",
		qrContent: "SOT_BB_SBUX_GIFT_10",
		couponCode: "TRASH_RECOVERY_10",
		perk: "Unlocks a $10 recovery e-gift card for customers who rate Starbucks on SOT + 100 SOT Social Points.",
		targetUrl: "https://starbucks.com"
	},
	{
		id: "bb-3",
		title: "Smart Transit Digital Banner — Priority Support Ticket",
		brandSlug: "apple",
		type: "VIP Service",
		qrContent: "SOT_BB_APPLE_VIP_ACCESS",
		couponCode: "APPLE_SOT_VIP",
		perk: "Unlocks priority verified CX queue, enabling direct channel to brand PR managers.",
		targetUrl: "https://apple.com"
	}
];
function BrandPage() {
	const { slug } = Route$4.useParams();
	const { t } = useTranslation();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)("feed");
	const [qrModalOpen, setQrModalOpen] = (0, import_react.useState)(false);
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [scannedBillboard, setScannedBillboard] = (0, import_react.useState)(null);
	const [claimedCoupons, setClaimedCoupons] = (0, import_react.useState)({});
	const { data: brand, isLoading } = useQuery({
		queryKey: ["brand", slug],
		queryFn: () => fetchBrandBySlug(slug)
	});
	const { data: feed, refetch } = useQuery({
		queryKey: [
			"brand-feed",
			brand?.id,
			user?.id ?? "anon"
		],
		queryFn: () => fetchFeed(user?.id ?? null, { brandId: brand.id }),
		enabled: !!brand
	});
	const isOwner = !!user && brand?.owner_id === user.id;
	const { data: brandFollowers, refetch: refetchBrandFollowers } = useQuery({
		queryKey: ["brand-followers", brand?.id],
		queryFn: () => getFollowerCount({ brandId: brand.id }),
		enabled: !!brand
	});
	const { data: isFollowing, refetch: refetchIsFollowing } = useQuery({
		queryKey: [
			"brand-following",
			user?.id,
			brand?.id
		],
		queryFn: () => user?.id && brand ? isFollowingBrand(user.id, brand.id) : false,
		enabled: !!user && !!brand
	});
	const toggleBrandFollow = async () => {
		if (!user || !brand) {
			toast.info(t("social.signInToFollow"));
			return;
		}
		try {
			if (isFollowing) await unfollowBrand(user.id, brand.id);
			else await followBrand(user.id, brand.id);
			await Promise.all([refetchBrandFollowers(), refetchIsFollowing()]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("social.loadFailed"));
		}
	};
	const { data: verReq, refetch: refetchVer } = useQuery({
		queryKey: [
			"brand-verify",
			brand?.id,
			user?.id
		],
		queryFn: () => fetchMyVerificationRequest(brand.id),
		enabled: !!brand && !!user
	});
	const askVerify = async (claim = false) => {
		if (!brand || !user) return;
		try {
			await requestVerification({
				brandId: brand.id,
				userId: user.id,
				message: claim ? `I represent ${brand.name} and would like to claim this SOT brand page.` : ""
			});
			toast.success(claim ? "Brand claim requested." : "Verification requested.");
			refetchVer();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not request verification.");
		}
	};
	const handleScanSimulation = (billboard) => {
		setScanning(true);
		setScannedBillboard(null);
		toast.loading("Simulating high-resolution digital billboard QR capture...");
		setTimeout(() => {
			setScanning(false);
			setScannedBillboard(billboard);
			toast.dismiss();
			toast.success("Successfully decoded digital billboard campaign!");
		}, 2e3);
	};
	const claimCoupon = (couponCode) => {
		setClaimedCoupons((prev) => ({
			...prev,
			[couponCode]: true
		}));
		navigator.clipboard?.writeText(couponCode);
		toast.success(`Coupon ${couponCode} copied to clipboard and social rewards claimed!`);
	};
	const mockCXMetrics = {
		customerService: brand ? Math.min(100, Math.max(10, brand.trust_score + 5)) : 75,
		productQuality: brand ? Math.min(100, Math.max(10, brand.trust_score - 2)) : 80,
		priceValue: brand ? Math.min(100, Math.max(10, brand.trust_score - 10)) : 65,
		deliverySpeed: brand ? Math.min(100, Math.max(10, brand.trust_score + 8)) : 85
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, { onPosted: () => refetch() }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 215,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto max-w-3xl px-4 py-8",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-40 w-full rounded-2xl" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 217,
					columnNumber: 22
				}, this) : !brand ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground",
					children: ["Brand not found. ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/brands",
						className: "text-primary hover:underline",
						children: "Back to brands"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 218,
						columnNumber: 30
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 217,
					columnNumber: 82
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandLogo, {
							name: brand.name,
							url: brand.signedLogoUrl,
							className: "h-20 w-20 rounded-2xl border border-border text-2xl"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 222,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
											className: "font-display text-2xl font-extrabold",
											children: brand.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 225,
											columnNumber: 19
										}, this),
										brand.verified && /* @__PURE__ */ (void 0)(BadgeCheck, { className: "h-5 w-5 text-primary" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 226,
											columnNumber: 38
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${getPeoplesSotGrade(brand.trust_score).color} ${getPeoplesSotGrade(brand.trust_score).border}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Award, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 230,
													columnNumber: 21
												}, this),
												"People's SOT: ",
												getPeoplesSotGrade(brand.trust_score).grade
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 229,
											columnNumber: 19
										}, this),
										(() => {
											const tierName = getBrandTier(brand.name, brand.category);
											const tierInfo = getTierInfo(tierName);
											return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${tierInfo.badgeClass}`,
												title: tierInfo.description,
												children: ["Tier: ", tierInfo.shortName]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 238,
												columnNumber: 24
											}, this);
										})()
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 17
								}, this),
								brand.category && /* @__PURE__ */ (void 0)("p", {
									className: "text-sm text-muted-foreground mt-0.5",
									children: brand.category
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 243,
									columnNumber: 36
								}, this),
								brand.description && /* @__PURE__ */ (void 0)("p", {
									className: "mt-2 text-sm text-foreground/80 leading-relaxed",
									children: brand.description
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 244,
									columnNumber: 39
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PeopleTrustFactor, {
										signals: {
											evidence: Math.min(100, 50 + (feed?.length ?? 0) * 2),
											response: Math.min(100, 40 + (feed?.filter((item) => item.status === "resolved").length ?? 0) * 10),
											experience: Math.min(100, Math.max(0, brand.trust_score)),
											trust: Math.min(100, Math.max(0, brand.trust_score))
										},
										compact: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 246,
										columnNumber: 39
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 246,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-3 flex flex-wrap items-center gap-4 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "h-4 w-4 text-stash" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 255,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-semibold",
													children: brand.trust_score
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 256,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-muted-foreground",
													children: ["/ 100 ", t("brand.trustScore").toLowerCase()]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 257,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 254,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground",
											children: t("social.followers", { count: brandFollowers ?? 0 })
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 259,
											columnNumber: 19
										}, this),
										brand.website && /* @__PURE__ */ (void 0)("a", {
											href: brand.website,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-1 text-primary hover:underline",
											children: [
												/* @__PURE__ */ (void 0)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 265,
													columnNumber: 23
												}, this),
												" ",
												t("brand.website")
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 264,
											columnNumber: 37
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 3
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: [
										user && !isOwner && brand.verified && /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-1.5",
											onClick: () => navigate({
												to: "/messages",
												search: { to: brand.owner_id }
											}),
											children: [
												/* @__PURE__ */ (void 0)(MessageCircle, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 276,
													columnNumber: 23
												}, this),
												" ",
												t("brand.message")
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 270,
											columnNumber: 58
										}, this),
										user && !isOwner && !brand.verified && /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											disabled: verReq?.status === "pending",
											onClick: () => askVerify(true),
											children: verReq?.status === "pending" ? "Claim pending" : "Claim this brand"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 278,
											columnNumber: 59
										}, this),
										isOwner && !brand.verified && /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											disabled: verReq?.status === "pending",
											onClick: () => askVerify(false),
											children: verReq?.status === "pending" ? t("brand.verificationPending") : t("brand.requestVerification")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 281,
											columnNumber: 50
										}, this),
										user && /* @__PURE__ */ (void 0)(SubmitDialog, {
											defaultBrandId: brand.id,
											onPosted: () => refetch()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 284,
											columnNumber: 28
										}, this),
										user && !isOwner && /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: isFollowing ? "outline" : "default",
											onClick: toggleBrandFollow,
											children: isFollowing ? t("social.unfollow") : t("social.follow")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 285,
											columnNumber: 40
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 269,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 223,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 221,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandVerdict, {
						brandId: brand.id,
						brandName: brand.name,
						className: "mt-6"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 292,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "mt-6 rounded-2xl border border-border bg-card p-1 shadow-sm overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-3 bg-secondary/40 p-1 rounded-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setActiveTab("feed"),
										className: `flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === "feed" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 300,
												columnNumber: 19
											}, this),
											" Feed (",
											feed?.length ?? 0,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 299,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setActiveTab("rewards"),
										className: `flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === "rewards" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Gift, { className: "h-3.5 w-3.5 text-amber-500 animate-pulse" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 303,
											columnNumber: 19
										}, this), " Super Rewards"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 302,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setActiveTab("people"),
										className: `flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === "people" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-3.5 w-3.5 text-blue-500" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 306,
											columnNumber: 19
										}, this), " SOT Standard Grade"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 305,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 15
							}, this),
							activeTab === "feed" && /* @__PURE__ */ (void 0)("div", {
								className: "p-4 space-y-4",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("h3", {
										className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wider",
										children: "Social Feed"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 313,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setQrModalOpen(true),
										className: "gap-1 text-primary hover:text-primary/80 font-bold",
										children: [/* @__PURE__ */ (void 0)(QrCode, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 315,
											columnNumber: 23
										}, this), " Scan Billboard QR"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 314,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 312,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "space-y-4",
									children: (feed ?? []).length === 0 ? /* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-muted-foreground py-4 text-center",
										children: "No social ratings yet. Be the first to Stash or Trash!"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 319,
										columnNumber: 50
									}, this) : (feed ?? []).map((item) => /* @__PURE__ */ (void 0)(ItemCard, {
										item,
										onChange: () => refetch()
									}, item.id, false, {
										fileName: _jsxFileName,
										lineNumber: 319,
										columnNumber: 198
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 318,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 311,
								columnNumber: 40
							}, this),
							activeTab === "rewards" && /* @__PURE__ */ (void 0)("div", {
								className: "p-4 space-y-4",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3",
										children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
											className: "font-display font-extrabold text-lg flex items-center gap-1.5",
											children: [/* @__PURE__ */ (void 0)(Gift, { className: "h-5 w-5 text-amber-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 328,
												columnNumber: 25
											}, this), " CX & Loyalty Reward Campaigns"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 327,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-muted-foreground",
											children: "Exclusive rewards directed to verified clients and active raters."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 330,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 326,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											onClick: () => setQrModalOpen(true),
											className: "gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold",
											children: [/* @__PURE__ */ (void 0)(QrCode, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 333,
												columnNumber: 23
											}, this), " Scan Digital Billboard"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 332,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 325,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "grid gap-4 sm:grid-cols-2 mt-2",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between",
											children: [/* @__PURE__ */ (void 0)("div", { children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-500 uppercase tracking-wide",
														children: "Loyalty Campaign"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 342,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)("span", {
														className: "flex items-center gap-0.5 text-xs font-semibold text-amber-500",
														children: [/* @__PURE__ */ (void 0)(Coins, { className: "h-3 w-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 346,
															columnNumber: 29
														}, this), " 50 Pts"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 345,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 341,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("h4", {
													className: "mt-2 font-display font-bold text-base text-foreground",
													children: "Verified Stashers Discount"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 349,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-muted-foreground mt-1",
													children: [
														"For active raters who voted \"Stash\" on ",
														brand.name,
														". Shows that loyalty deserves real rewards."
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 350,
													columnNumber: 25
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 340,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "mt-4 border-t border-border/50 pt-3 flex items-center justify-between",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-xs font-mono font-bold bg-secondary px-2 py-1 rounded select-all",
													children: [
														"SOT_LOYAL_",
														brand.name.toUpperCase().slice(0, 4),
														"_20"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 355,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)(Button, {
													size: "sm",
													onClick: () => claimCoupon(`SOT_LOYAL_${brand.name.toUpperCase().slice(0, 4)}_20`),
													className: "gap-1",
													children: claimedCoupons[`SOT_LOYAL_${brand.name.toUpperCase().slice(0, 4)}_20`] ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 360,
														columnNumber: 31
													}, this), " Copied"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 359,
														columnNumber: 101
													}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Copy, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 362,
														columnNumber: 31
													}, this), " Claim"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 361,
														columnNumber: 35
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 358,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 354,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 339,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-border bg-secondary/20 p-4 flex flex-col justify-between",
											children: [/* @__PURE__ */ (void 0)("div", { children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-extrabold text-violet-500 uppercase tracking-wide",
														children: "CX Recovery Program"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 372,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)("span", {
														className: "flex items-center gap-0.5 text-xs font-semibold text-amber-500",
														children: [/* @__PURE__ */ (void 0)(Coins, { className: "h-3 w-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 376,
															columnNumber: 29
														}, this), " 100 Pts"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 375,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 371,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("h4", {
													className: "mt-2 font-display font-bold text-base text-foreground",
													children: "Brand Recovery Voucher"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 379,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-muted-foreground mt-1",
													children: "A customer care signal to rebuild relationships. Available for clients who shared constructive feedback."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 380,
													columnNumber: 25
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 370,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "mt-4 border-t border-border/50 pt-3 flex items-center justify-between",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-xs font-mono font-bold bg-secondary px-2 py-1 rounded select-all",
													children: [
														"SOT_CARE_$",
														brand.name.toUpperCase().slice(0, 4),
														"_10"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 385,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => claimCoupon(`SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10`),
													className: "gap-1 border-primary text-primary hover:bg-primary/10",
													children: claimedCoupons[`SOT_CARE_${brand.name.toUpperCase().slice(0, 4)}_10`] ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 390,
														columnNumber: 31
													}, this), " Copied"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 389,
														columnNumber: 100
													}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Copy, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 392,
														columnNumber: 31
													}, this), " Claim"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 391,
														columnNumber: 35
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 388,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 384,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 369,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 337,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl bg-violet-500/5 border border-violet-500/10 p-4 text-xs flex gap-2",
										children: [/* @__PURE__ */ (void 0)(Info, { className: "h-4 w-4 text-violet-500 shrink-0 mt-0.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 400,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
											className: "font-semibold text-violet-600",
											children: "The Power of Direct Feedback:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 402,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-muted-foreground mt-0.5",
											children: "By rating brands on Stash or Trash, you assist brands with actionable UX/CX data. In turn, brands direct digital rewards and gifts back to the community, establishing the ultimate credible feedback loop."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 403,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 401,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 399,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 324,
								columnNumber: 43
							}, this),
							activeTab === "people" && /* @__PURE__ */ (void 0)("div", {
								className: "p-4 space-y-4",
								children: [
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
										className: "font-display font-extrabold text-lg flex items-center gap-1.5 text-foreground",
										children: [/* @__PURE__ */ (void 0)(ChartColumn, { className: "h-5 w-5 text-blue-500" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 414,
											columnNumber: 23
										}, this), " SOT Standard Grade Analysis"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 413,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground",
										children: "The People's Standard of consumer ratings, scaling credibility via decentralized rater feedback."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 412,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-border bg-secondary/10 p-4 flex flex-col sm:flex-row items-center gap-4",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: `h-16 w-16 rounded-2xl flex items-center justify-center font-display text-2xl font-black shadow-inner shrink-0 ${getPeoplesSotGrade(brand.trust_score).color}`,
											children: getPeoplesSotGrade(brand.trust_score).grade
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 421,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-center sm:text-left",
											children: [/* @__PURE__ */ (void 0)("h4", {
												className: "font-display font-bold text-base",
												children: ["Current Brand Sovereign Grade: ", getPeoplesSotGrade(brand.trust_score).grade]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 425,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-muted-foreground mt-0.5 leading-relaxed",
												children: getPeoplesSotGrade(brand.trust_score).description
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 426,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 424,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 420,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (void 0)("h4", {
											className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wide",
											children: "Consumer Experience Rating Matrix"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 432,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (void 0)("span", { children: "Customer Service & Support" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 437,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-emerald-500",
															children: [mockCXMetrics.customerService, "%"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 438,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 436,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (void 0)("div", {
															className: "h-full bg-emerald-500",
															style: { width: `${mockCXMetrics.customerService}%` }
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 441,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 440,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 435,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (void 0)("span", { children: "Product Quality & Durability" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 449,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-emerald-500",
															children: [mockCXMetrics.productQuality, "%"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 450,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 448,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (void 0)("div", {
															className: "h-full bg-emerald-500",
															style: { width: `${mockCXMetrics.productQuality}%` }
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 453,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 452,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 447,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (void 0)("span", { children: "Pricing & Value For Money" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 461,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-amber-500",
															children: [mockCXMetrics.priceValue, "%"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 462,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 460,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (void 0)("div", {
															className: "h-full bg-amber-500",
															style: { width: `${mockCXMetrics.priceValue}%` }
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 465,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 464,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 459,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "p-3 rounded-xl bg-secondary/30 border border-border/40",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex justify-between text-xs font-semibold",
														children: [/* @__PURE__ */ (void 0)("span", { children: "Delivery, Supply & Speed" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 473,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-emerald-500",
															children: [mockCXMetrics.deliverySpeed, "%"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 474,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 472,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden",
														children: /* @__PURE__ */ (void 0)("div", {
															className: "h-full bg-emerald-500",
															style: { width: `${mockCXMetrics.deliverySpeed}%` }
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 477,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 476,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 471,
													columnNumber: 23
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 434,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 431,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (void 0)(ThumbsUp, { className: "h-3.5 w-3.5 text-stash" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 486,
												columnNumber: 63
											}, this), " Real-time active voting"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 486,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: [
											"Total rating weight: ",
											feed?.length ?? 0,
											" social signals"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 487,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 485,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 411,
								columnNumber: 42
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 297,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 219,
					columnNumber: 20
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 216,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: qrModalOpen,
				onOpenChange: setQrModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "sm:max-w-md bg-card rounded-2xl border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
						className: "font-display font-black text-xl flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "h-5 w-5 text-indigo-500" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 499,
							columnNumber: 15
						}, this), " Digital Billboard QR Scanner"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 498,
						columnNumber: 13
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 497,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Direct clients from physical billboards & print ads to brand online e-commerce platforms and redeemable Stash or Trash client rewards. Select a simulated billboard below to scan:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 504,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative aspect-video rounded-xl bg-black border-2 border-indigo-500/20 flex flex-col items-center justify-center overflow-hidden",
								children: scanning ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-x-0 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-bounce top-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 512,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-indigo-500/10 animate-pulse" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 513,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "h-8 w-8 text-indigo-400 animate-spin" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 514,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "mt-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest animate-pulse",
										children: "Capturing Digital Billboard QR..."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 515,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 510,
									columnNumber: 27
								}, this) : scannedBillboard ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-4 text-center z-10 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-10 w-10 text-amber-500 mx-auto animate-bounce" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 517,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
											className: "font-display font-extrabold text-sm text-white",
											children: "Billboard Decoded Successfully!"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 518,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-zinc-400 max-w-xs",
											children: scannedBillboard.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 519,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 516,
									columnNumber: 42
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-center p-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "relative h-20 w-20 mx-auto border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "h-10 w-10 text-zinc-600" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 522,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-indigo-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 524,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-indigo-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 525,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-indigo-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 526,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-indigo-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 527,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 521,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] font-mono text-zinc-500 mt-2",
										children: "Ready. Align digital billboard QR within focus."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 529,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 520,
									columnNumber: 26
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 509,
								columnNumber: 13
							}, this),
							scannedBillboard && /* @__PURE__ */ (void 0)("div", {
								className: "rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-4 space-y-2 animate-fade-in",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center gap-1",
											children: [
												/* @__PURE__ */ (void 0)(Ticket, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 537,
													columnNumber: 21
												}, this),
												" ",
												scannedBillboard.type
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 536,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "text-xs font-mono font-bold bg-zinc-800 px-1.5 py-0.5 rounded text-white select-all",
											children: scannedBillboard.couponCode
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 539,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 535,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("h5", {
										className: "font-bold text-sm text-foreground",
										children: scannedBillboard.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 543,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: scannedBillboard.perk
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 544,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "pt-2 flex gap-2",
										children: [/* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											className: "flex-1 font-bold gap-1 bg-amber-500 hover:bg-amber-600 text-black",
											onClick: () => claimCoupon(scannedBillboard.couponCode),
											children: [/* @__PURE__ */ (void 0)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 548,
												columnNumber: 21
											}, this), " Claim Reward"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 547,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-1 font-bold",
											asChild: true,
											children: /* @__PURE__ */ (void 0)("a", {
												href: scannedBillboard.targetUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												children: ["Go to Store ", /* @__PURE__ */ (void 0)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 552,
													columnNumber: 35
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 551,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 550,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 546,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 534,
								columnNumber: 34
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2 max-h-40 overflow-y-auto",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "text-xs font-bold text-muted-foreground",
									children: "Select a Billboard Advertisement to Mock-Scan:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 560,
									columnNumber: 15
								}, this), BILLBOARDS.map((bb) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									disabled: scanning,
									onClick: () => handleScanSimulation(bb),
									className: "w-full flex items-center justify-between p-2 text-left rounded-xl border border-border hover:bg-secondary/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0 flex-1 pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs font-semibold truncate",
											children: bb.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 563,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[10px] text-muted-foreground truncate",
											children: [
												bb.type,
												" · ",
												bb.perk
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 564,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 562,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-4 w-4 text-muted-foreground shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 566,
										columnNumber: 19
									}, this)]
								}, bb.id, true, {
									fileName: _jsxFileName,
									lineNumber: 561,
									columnNumber: 37
								}, this))]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 559,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "border-t border-border pt-3 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setQrModalOpen(false),
									children: "Close"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 571,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 570,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 503,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 496,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 495,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 214,
		columnNumber: 10
	}, this);
}
//#endregion
export { BrandPage as component };
