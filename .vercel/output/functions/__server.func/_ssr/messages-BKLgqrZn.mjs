import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, n as Button, o as useAuth, r as Input } from "./label-BlRLLIBM.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { Dt as useRoles, Ot as supabase, s as Route$11, x as Header } from "./router-BjpvJuyR.mjs";
import { a as sendMessage, i as partnerName, n as fetchThread, r as markThreadRead, t as fetchInbox } from "./messages-DMg_5OEi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-BKLgqrZn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MessagesPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { isBrand } = useRoles();
	const { to } = Route$11.useSearch();
	const [active, setActive] = (0, import_react.useState)(to ?? null);
	const [body, setBody] = (0, import_react.useState)("");
	const { data: inbox, refetch: refetchInbox } = useQuery({
		queryKey: ["inbox", user?.id],
		queryFn: () => fetchInbox(user.id),
		enabled: !!user
	});
	const { data: activeName } = useQuery({
		queryKey: ["partner-name", active],
		queryFn: () => partnerName(active),
		enabled: !!active
	});
	const { data: thread, refetch: refetchThread } = useQuery({
		queryKey: [
			"thread",
			user?.id,
			active
		],
		queryFn: () => fetchThread(user.id, active),
		enabled: !!user && !!active
	});
	(0, import_react.useEffect)(() => {
		if (user && active) markThreadRead(user.id, active).then(() => refetchInbox());
	}, [
		user,
		active,
		thread?.length,
		refetchInbox
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel(`messages-${user.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "messages",
			filter: `recipient_id=eq.${user.id}`
		}, () => {
			refetchInbox();
			refetchThread();
		}).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "messages",
			filter: `sender_id=eq.${user.id}`
		}, () => {
			refetchInbox();
			refetchThread();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		user,
		refetchInbox,
		refetchThread
	]);
	const conversations = (0, import_react.useMemo)(() => inbox ?? [], [inbox]);
	const send = async () => {
		if (!user || !active || !body.trim()) return;
		try {
			await sendMessage({
				senderId: user.id,
				recipientId: active,
				body
			});
			setBody("");
			refetchThread();
			refetchInbox();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not send.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-4xl gap-4 px-4 py-8 sm:grid-cols-[260px_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2 rounded-2xl border border-stash/20 bg-stash/5 px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: isBrand ? "Brand workspace" : "People workspace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: isBrand ? "Your brand identity, conversations, pitches, and collaboration tools stay separate from personal profiles." : "Your personal identity, conversations, and community work stay separate from brand workspaces."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-2xl border border-border bg-card p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "px-3 py-2 font-display text-lg font-bold",
						children: t("messages.title")
					}), conversations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-4 text-sm text-muted-foreground",
						children: t("messages.empty")
					}) : conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActive(c.partnerId),
						className: cn("flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent", active === c.partnerId && "bg-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: c.partnerName
							}), c.unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary px-1.5 text-xs text-primary-foreground",
								children: c.unread
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-xs text-muted-foreground",
							children: c.lastMessage
						})]
					}, c.partnerId))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "flex min-h-[60vh] flex-col rounded-2xl border border-border bg-card",
					children: !active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-1 items-center justify-center text-sm text-muted-foreground",
						children: "Select a conversation."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border px-4 py-3 font-semibold",
							children: activeName ?? t("messages.to")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 space-y-2 overflow-y-auto p-4",
							children: (thread ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("max-w-[75%] rounded-2xl px-3 py-2 text-sm", m.sender_id === user?.id ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"),
								children: m.body
							}, m.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 border-t border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: body,
								onChange: (e) => setBody(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && send(),
								placeholder: t("messages.placeholder")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: send,
								disabled: !body.trim(),
								children: t("messages.send")
							})]
						})
					] })
				})
			]
		})]
	});
}
//#endregion
export { MessagesPage as component };
