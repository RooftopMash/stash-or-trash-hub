import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as Phone, i as VideoOff, k as Mic, n as X, r as Video, v as ShieldCheck, yt as Camera } from "../_libs/lucide-react.mjs";
import { l as useAuth, s as Route$10 } from "./router-Ymvu7mB_.mjs";
import { i as cn, n as Input, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { I as useRoles, c as Header } from "./Header-BKSLqlsv.mjs";
import { t as require_AgoraRTC_N_production } from "../_libs/agora-rtc-sdk-ng.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-CU822Jmf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var import_AgoraRTC_N_production = /* @__PURE__ */ __toESM(require_AgoraRTC_N_production());
async function fetchInbox(userId) {
	const { data, error } = await supabase.from("messages").select("*").or(`sender_id.eq.${userId},recipient_id.eq.${userId}`).order("created_at", { ascending: false });
	if (error) throw error;
	const rows = data ?? [];
	const byPartner = /* @__PURE__ */ new Map();
	for (const m of rows) {
		const partner = m.sender_id === userId ? m.recipient_id : m.sender_id;
		if (!byPartner.has(partner)) byPartner.set(partner, []);
		byPartner.get(partner).push(m);
	}
	const partnerIds = [...byPartner.keys()];
	const { data: profiles } = partnerIds.length ? await supabase.from("profiles").select("id, display_name").in("id", partnerIds) : { data: [] };
	const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return [...byPartner.entries()].map(([partnerId, msgs]) => {
		const last = msgs[0];
		return {
			partnerId,
			partnerName: nameById.get(partnerId) ?? "Someone",
			lastMessage: last.body,
			lastAt: last.created_at,
			unread: msgs.filter((m) => m.recipient_id === userId && !m.read_at).length
		};
	}).sort((a, b) => a.lastAt < b.lastAt ? 1 : -1);
}
async function fetchThread(userId, partnerId) {
	const { data, error } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`).order("created_at", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function sendMessage(input) {
	const { error } = await supabase.from("messages").insert({
		sender_id: input.senderId,
		recipient_id: input.recipientId,
		body: input.body.trim()
	});
	if (error) throw error;
}
async function markThreadRead(userId, partnerId) {
	await supabase.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("recipient_id", userId).eq("sender_id", partnerId).is("read_at", null);
}
async function partnerName(partnerId) {
	const { data } = await supabase.from("profiles").select("display_name").eq("id", partnerId).maybeSingle();
	return data?.display_name ?? "Someone";
}
var _jsxFileName$1 = "/app/applet/src/components/LiveCollaborationPanel.tsx";
function LiveCollaborationPanel({ partnerName, isBrandWorkspace, partnerId }) {
	const { session } = useAuth();
	const [requestedMode, setRequestedMode] = (0, import_react.useState)(null);
	const [connected, setConnected] = (0, import_react.useState)(false);
	const clientRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const [cameraOn, setCameraOn] = (0, import_react.useState)(true);
	const [microphoneOn, setMicrophoneOn] = (0, import_react.useState)(true);
	const requestCall = async (mode) => {
		if (!session?.access_token) return;
		try {
			const response = await fetch("/api/agora-token", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${session.access_token}`
				},
				body: JSON.stringify({
					partnerId,
					mode
				})
			});
			const payload = await response.json();
			if (!response.ok || !payload.appId || !payload.channelName || !payload.token || !payload.uid) throw new Error(payload.error ?? "Could not start call");
			const client = import_AgoraRTC_N_production.default.createClient({
				mode: "rtc",
				codec: "vp8"
			});
			clientRef.current = client;
			client.on("user-published", async (user, mediaType) => {
				await client.subscribe(user, mediaType);
				if (mediaType === "audio") user.audioTrack?.play();
				if (mediaType === "video") user.videoTrack?.play();
			});
			await client.join(payload.appId, payload.channelName, payload.token, payload.uid);
			audioRef.current = await import_AgoraRTC_N_production.default.createMicrophoneAudioTrack();
			await client.publish(audioRef.current);
			if (mode === "video") {
				videoRef.current = await import_AgoraRTC_N_production.default.createCameraVideoTrack();
				await client.publish(videoRef.current);
			}
			setConnected(true);
			setRequestedMode(mode);
		} catch (error) {
			console.error("Agora call failed", error);
			const msg = error instanceof Error ? error.message : "Could not start call";
			toast.error(msg.includes("not configured") ? "Voice/Video calling requires AGORA_APP_ID and AGORA_APP_CERTIFICATE in the environment." : msg);
			setRequestedMode(null);
		}
	};
	const leaveCall = async () => {
		audioRef.current?.close();
		videoRef.current?.close();
		if (clientRef.current) await clientRef.current.leave();
		clientRef.current = null;
		setConnected(false);
		setRequestedMode(null);
	};
	(0, import_react.useEffect)(() => () => {
		leaveCall();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "border-b border-border bg-secondary/40 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm font-semibold",
				children: ["Collaborate with ", partnerName]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 102,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-muted-foreground",
				children: isBrandWorkspace ? "Represent your brand with a clear, professional workspace." : "Pitch ideas and improve everyday experiences together."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 103,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 101,
				columnNumber: 9
			}, this), !requestedMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: () => requestCall("voice"),
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { "data-icon": "inline-start" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 112,
						columnNumber: 15
					}, this), " Voice call"]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 111,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "button",
					size: "sm",
					onClick: () => requestCall("video"),
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Video, { "data-icon": "inline-start" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 115,
						columnNumber: 15
					}, this), " Video call"]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 114,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 110,
				columnNumber: 11
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: () => setRequestedMode(null),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { "data-icon": "inline-start" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 120,
					columnNumber: 13
				}, this), " Cancel request"]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 119,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 100,
			columnNumber: 7
		}, this), requestedMode && /* @__PURE__ */ (void 0)("div", {
			className: "mt-3 rounded-xl border border-stash/20 bg-background p-3 text-sm",
			children: /* @__PURE__ */ (void 0)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (void 0)(ShieldCheck, {
					className: "mt-0.5 text-stash",
					"aria-hidden": "true"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 127,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (void 0)("p", {
							className: "font-semibold",
							children: [requestedMode === "video" ? "Video" : "Voice", " calling is being prepared"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 129,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: "Agora is connected with short-lived server tokens. Recording is off by default; only invited participants can join, and your microphone or camera is used only after you start a call."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 132,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								connected && /* @__PURE__ */ (void 0)(Button, {
									type: "button",
									size: "sm",
									variant: "destructive",
									onClick: () => void leaveCall(),
									children: [/* @__PURE__ */ (void 0)(Phone, { "data-icon": "inline-start" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 145,
										columnNumber: 21
									}, this), " Leave call"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 139,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)(Button, {
									type: "button",
									size: "sm",
									variant: microphoneOn ? "secondary" : "outline",
									onClick: () => setMicrophoneOn((value) => !value),
									children: [
										/* @__PURE__ */ (void 0)(Mic, { "data-icon": "inline-start" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 154,
											columnNumber: 19
										}, this),
										" ",
										microphoneOn ? "Mic ready" : "Mic off"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 148,
									columnNumber: 17
								}, this),
								requestedMode === "video" && /* @__PURE__ */ (void 0)(Button, {
									type: "button",
									size: "sm",
									variant: cameraOn ? "secondary" : "outline",
									onClick: () => setCameraOn((value) => !value),
									children: [
										cameraOn ? /* @__PURE__ */ (void 0)(Camera, { "data-icon": "inline-start" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 164,
											columnNumber: 23
										}, this) : /* @__PURE__ */ (void 0)(VideoOff, { "data-icon": "inline-start" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 166,
											columnNumber: 23
										}, this),
										" ",
										cameraOn ? "Camera ready" : "Camera off"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 157,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 137,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 128,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 126,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 125,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 99,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/messages.tsx?tsr-split=component";
function MessagesPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { isBrand } = useRoles();
	const { to } = Route$10.useSearch();
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 98,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto grid max-w-4xl gap-4 px-4 py-8 sm:grid-cols-[260px_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "sm:col-span-2 rounded-2xl border border-stash/20 bg-stash/5 px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-semibold",
						children: isBrand ? "Brand workspace" : "People workspace"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: isBrand ? "Your brand identity, conversations, pitches, and collaboration tools stay separate from personal profiles." : "Your personal identity, conversations, and community work stay separate from brand workspaces."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: "rounded-2xl border border-border bg-card p-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "px-3 py-2 font-display text-lg font-bold",
						children: t("messages.title")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 11
					}, this), conversations.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "px-3 py-4 text-sm text-muted-foreground",
						children: t("messages.empty")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 41
					}, this) : conversations.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setActive(c.partnerId),
						className: cn("flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent", active === c.partnerId && "bg-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-medium",
								children: c.partnerName
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 19
							}, this), c.unread > 0 && /* @__PURE__ */ (void 0)("span", {
								className: "rounded-full bg-primary px-1.5 text-xs text-primary-foreground",
								children: c.unread
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 109,
								columnNumber: 36
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "truncate text-xs text-muted-foreground",
							children: c.lastMessage
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 113,
							columnNumber: 17
						}, this)]
					}, c.partnerId, true, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 147
					}, this))]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 104,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "flex min-h-[60vh] flex-col rounded-2xl border border-border bg-card",
					children: !active ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-1 items-center justify-center text-sm text-muted-foreground",
						children: "Select a conversation."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 118,
						columnNumber: 22
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "border-b border-border px-4 py-3 font-semibold",
							children: activeName ?? t("messages.to")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LiveCollaborationPanel, {
							partnerName: activeName ?? "your collaborator",
							partnerId: active,
							isBrandWorkspace: isBrand
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1 space-y-2 overflow-y-auto p-4",
							children: (thread ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: cn("max-w-[75%] rounded-2xl px-3 py-2 text-sm", m.sender_id === user?.id ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"),
								children: m.body
							}, m.id, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 42
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2 border-t border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								value: body,
								onChange: (e) => setBody(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && send(),
								placeholder: t("messages.placeholder")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 131,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: send,
								disabled: !body.trim(),
								children: t("messages.send")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 120,
						columnNumber: 22
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 99,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 97,
		columnNumber: 10
	}, this);
}
//#endregion
export { MessagesPage as component };
