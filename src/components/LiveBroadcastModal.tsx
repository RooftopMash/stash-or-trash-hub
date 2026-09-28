import { useState, useRef, useEffect, useCallback } from "react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Video,
  Radio,
  Mic,
  MicOff,
  VideoOff,
  Eye,
  MessageSquare,
  Sparkles,
  Building2,
  Share2,
  ShieldCheck,
  CircleDot,
  Phone,
  MonitorUp,
  AlertTriangle,
  MapPin,
  Hash,
  UserCheck,
  BellRing,
  Rocket,
  Gift,
  Coins,
  Recycle,
  Check,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { fetchFeed } from "@/lib/stash";
import { sendMessage } from "@/lib/messages";
import { playCoinSpinSound, playTrashSound } from "@/lib/verdict-sounds";
import {
  BRAND_BROADCAST_CATEGORIES,
  CONSUMER_BROADCAST_CATEGORIES,
  publishLiveBroadcastSession,
  voteOnLiveBroadcast,
  claimLiveLaunchPerk,
  getLiveBroadcastSessions,
  type BroadcastPersona,
  type BrandBroadcastCategory,
  type ConsumerBroadcastCategory,
} from "@/lib/live-broadcasts";
import type { AiScanResult } from "@/lib/ai-scanner";

export interface IncomingSotCallPayload {
  callId: string;
  callerId: string;
  callerName: string;
  callDirection: "brand_to_user" | "user_to_user" | "user_to_brand";
  recipientId: string;
  recipientName: string;
  brandName: string;
  topic: string;
  mode: "voice_call" | "video_call" | "broadcast";
  roomChannel: string;
  timestamp: string;
}

interface LiveBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName?: string;
  brandSlug?: string;
  brandOwner?: string;
  productName?: string;
  scanResult?: AiScanResult | null;
  recipientId?: string;
  recipientName?: string;
  defaultMode?: "broadcast" | "video_call" | "voice_call";
  customRoomChannel?: string;
  callDirection?: "brand_to_user" | "user_to_user" | "user_to_brand";
  initialPersona?: BroadcastPersona;
  initialBrandCategory?: BrandBroadcastCategory;
  activeBroadcastId?: string;
}

const GOOGLE_STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

export function LiveBroadcastModal({
  open,
  onOpenChange,
  brandName = "SOT Community Studio",
  brandSlug,
  brandOwner = "Verified Trust Network",
  productName = "Live Session",
  scanResult,
  recipientId: initialRecipientId,
  recipientName: initialRecipientName,
  defaultMode = "video_call",
  customRoomChannel,
  callDirection: initialCallDirection = "brand_to_user",
  initialPersona,
  initialBrandCategory = "product_launch",
  activeBroadcastId,
}: LiveBroadcastModalProps) {
  const { user } = useAuth();
  const { isBrand } = useRoles();

  const [studioPersona, setStudioPersona] = useState<BroadcastPersona>(
    initialPersona ?? (isBrand ? "brand_owner" : "consumer"),
  );
  const [brandCategory, setBrandCategory] = useState<BrandBroadcastCategory>(initialBrandCategory);
  const [situationType, setSituationType] = useState<ConsumerBroadcastCategory>("counterfeit");

  const [broadcastHeadline, setBroadcastHeadline] = useState<string>(
    productName || `${brandName} Live Product Launch & Q&A`,
  );
  const [broadcastSubtitle, setBroadcastSubtitle] = useState<string>(
    `Tune in live with ${brandName} — cast your Stash or Trash verdict in real time and claim today's live viewer perk!`,
  );

  // Live Launch Perk / Promo Drop Controls (for Brand Owners)
  const [enableLaunchPerk, setEnableLaunchPerk] = useState(true);
  const [perkTitle, setPerkTitle] = useState(`25% Off ${brandName} Launch Special`);
  const [perkPromoCode, setPerkPromoCode] = useState(
    `${brandName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "SOT"}_LAUNCH25`,
  );
  const [perkDiscountLabel, setPerkDiscountLabel] = useState("25% OFF LAUNCH VOUCHER");
  const [perkClaimedCount, setPerkClaimedCount] = useState(18);
  const [perkTotalAvailable, setPerkTotalAvailable] = useState(150);
  const [hasClaimedInSession, setHasClaimedInSession] = useState(false);

  // Real-Time Launch Pulse (Stash vs Trash Market Research Meter)
  const [currentBroadcastId, setCurrentBroadcastId] = useState<string>(
    activeBroadcastId || `live-${Date.now()}`,
  );
  const [liveStashVotes, setLiveStashVotes] = useState(42);
  const [liveTrashVotes, setLiveTrashVotes] = useState(5);
  const [myLiveVerdict, setMyLiveVerdict] = useState<"stash" | "trash" | null>(null);
  const [followersAlertedCount, setFollowersAlertedCount] = useState(0);

  const [isLive, setIsLive] = useState(false);
  const [sessionMode, setSessionMode] = useState<"broadcast" | "video_call" | "voice_call">(defaultMode);
  const [callDirection, setCallDirection] = useState<"brand_to_user" | "user_to_user" | "user_to_brand">(
    initialCallDirection,
  );
  const [targetRecipientId, setTargetRecipientId] = useState<string>(initialRecipientId || "");
  const [targetRecipientName, setTargetRecipientName] = useState<string>(initialRecipientName || "");
  const [platformContacts, setPlatformContacts] = useState<
    Array<{ id: string; name: string; context: string }>
  >([]);
  const [ringingSent, setRingingSent] = useState(false);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(14);
  const [engineUsed, setEngineUsed] = useState<string>("Google WebRTC (stun.l.google.com)");
  const [roomChannel, setRoomChannel] = useState<string>("");
  const [peerJoined, setPeerJoined] = useState(false);

  // Situation & Counterfeit Batch Metadata
  const [batchNumber, setBatchNumber] = useState("");
  const [storeLocation, setStoreLocation] = useState("");

  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; isHost?: boolean; isPerkDrop?: boolean }[]
  >([]);
  const [chatInput, setChatInput] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const agoraClientRef = useRef<IAgoraRTCClient | null>(null);
  const agoraAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const agoraVideoRef = useRef<ICameraVideoTrack | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const supaChanRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const cleanupSession = useCallback(async () => {
    try {
      agoraAudioRef.current?.close();
      agoraVideoRef.current?.close();
      agoraAudioRef.current = null;
      agoraVideoRef.current = null;
      if (agoraClientRef.current) {
        await agoraClientRef.current.leave();
        agoraClientRef.current = null;
      }
    } catch {
      // ignore
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (bcRef.current) {
      bcRef.current.close();
      bcRef.current = null;
    }
    if (supaChanRef.current) {
      void supabase.removeChannel(supaChanRef.current);
      supaChanRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsLive(false);
    setPeerJoined(false);
    setScreenSharing(false);
  }, []);

  // Sync props when opened for a specific User, Brand, or Existing Live Session
  useEffect(() => {
    if (open) {
      if (initialRecipientId) setTargetRecipientId(initialRecipientId);
      if (initialRecipientName) setTargetRecipientName(initialRecipientName);
      if (defaultMode) setSessionMode(defaultMode);
      if (initialCallDirection) setCallDirection(initialCallDirection);
      if (initialPersona) {
        setStudioPersona(initialPersona);
      } else {
        setStudioPersona(isBrand ? "brand_owner" : "consumer");
      }
      if (initialBrandCategory) setBrandCategory(initialBrandCategory);
      setRingingSent(false);
      setHasClaimedInSession(false);

      // If joining an active broadcast from the Home/Feed Live Stage, hydrate its metrics
      if (activeBroadcastId) {
        setCurrentBroadcastId(activeBroadcastId);
        const existing = getLiveBroadcastSessions().find((s) => s.id === activeBroadcastId);
        if (existing) {
          setStudioPersona(existing.persona);
          setBroadcastHeadline(existing.title);
          setBroadcastSubtitle(existing.subtitle);
          setLiveStashVotes(existing.stashVotes);
          setLiveTrashVotes(existing.trashVotes);
          setViewerCount(existing.viewerCount + 1);
          if (existing.brandCategory) setBrandCategory(existing.brandCategory);
          if (existing.consumerCategory) setSituationType(existing.consumerCategory);
          if (existing.launchPerk) {
            setEnableLaunchPerk(true);
            setPerkTitle(existing.launchPerk.title);
            setPerkPromoCode(existing.launchPerk.promoCode);
            setPerkDiscountLabel(existing.launchPerk.discountLabel);
            setPerkClaimedCount(existing.launchPerk.claimedCount);
            setPerkTotalAvailable(existing.launchPerk.totalAvailable);
          }
        }
      } else {
        const cleanPrefix =
          brandName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "SOT";
        setBroadcastHeadline(
          productName && productName !== "Live Session"
            ? productName
            : `${brandName} Live Product Launch & Client Showcase`,
        );
        setPerkTitle(`25% Off ${brandName} Launch Special`);
        setPerkPromoCode(`${cleanPrefix}_LAUNCH25`);
      }

      // Load active users/authors from feed so Brand Owners or Users can pick a client/peer to call
      void fetchFeed(null)
        .then((items) => {
          const seen = new Set<string>();
          const list: Array<{ id: string; name: string; context: string }> = [];
          for (const it of items) {
            if (it.user_id && !seen.has(it.user_id)) {
              seen.add(it.user_id);
              list.push({
                id: it.user_id,
                name: it.authorName || `User ${it.user_id.slice(0, 6)}`,
                context: `${it.brandName ? `${it.brandName}: ` : ""}${it.title.slice(0, 40)}`,
              });
            }
          }
          if (list.length === 0) {
            list.push(
              { id: "client-thabo", name: "Thabo M. (Verified Client)", context: "Reported batch inquiry on SOT" },
              { id: "client-lerato", name: "Lerato K. (Active Voter)", context: "Recent Stash/Trash reviewer" },
            );
          }
          setPlatformContacts(list.slice(0, 20));
          if (!initialRecipientName && list[0]) {
            setTargetRecipientId(list[0].id);
            setTargetRecipientName(list[0].name);
          }
        })
        .catch(() => {
          // ignore
        });
    }
  }, [
    open,
    initialRecipientId,
    initialRecipientName,
    defaultMode,
    initialCallDirection,
    initialPersona,
    initialBrandCategory,
    activeBroadcastId,
    brandName,
    productName,
    isBrand,
  ]);

  // Setup camera/mic preview when modal is opened
  useEffect(() => {
    let active = true;
    if (open) {
      const slug =
        customRoomChannel ||
        `sot-call-${(targetRecipientId || brandName).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 22)}`;
      setRoomChannel(slug);
      navigator.mediaDevices
        ?.getUserMedia({ video: sessionMode !== "voice_call", audio: true })
        .then((s) => {
          if (!active) {
            s.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = s;
          if (videoRef.current && sessionMode !== "voice_call") {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera/mic permission notice:", err);
          toast.warning("Camera or microphone permission not granted. Preview mode enabled.");
        });
    } else {
      void cleanupSession();
    }

    return () => {
      active = false;
    };
  }, [open, brandName, targetRecipientId, customRoomChannel, sessionMode, cleanupSession]);

  const handleCategoryPresetChange = (cat: BrandBroadcastCategory) => {
    setBrandCategory(cat);
    const cleanPrefix = brandName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "SOT";
    if (cat === "product_launch") {
      setBroadcastHeadline(`LIVE LAUNCH: ${brandName} New Product & Innovation Reveal`);
      setBroadcastSubtitle(
        `Unveiling our newest release live for SOT clients & prospects. Vote Stash or Trash live!`,
      );
      setPerkTitle(`25% Off ${brandName} New Launch`);
      setPerkPromoCode(`${cleanPrefix}_LAUNCH25`);
      setPerkDiscountLabel("25% OFF LAUNCH VOUCHER");
    } else if (cat === "brand_relaunch") {
      setBroadcastHeadline(`RELAUNCH SPECIAL: ${brandName} Upgraded Service & Quality Promise`);
      setBroadcastSubtitle(
        `You spoke on SOT, and we listened! See the upgrades we made based on your verdicts.`,
      );
      setPerkTitle(`${brandName} Comeback Recovery Voucher`);
      setPerkPromoCode(`${cleanPrefix}_RELAUNCH50`);
      setPerkDiscountLabel("COMEBACK VIP VOUCHER");
    } else if (cat === "behind_scenes") {
      setBroadcastHeadline(`BEHIND THE SCENES: Inside ${brandName} Quality & Authenticity Lab`);
      setBroadcastSubtitle(
        `Live walkthrough of our operations and batch verification standards.`,
      );
      setPerkTitle(`Verified Authentic Buyer Pass`);
      setPerkPromoCode(`${cleanPrefix}_AUTH15`);
      setPerkDiscountLabel("15% AUTHENTIC PASS");
    } else if (cat === "townhall_qa") {
      setBroadcastHeadline(`LIVE TOWNHALL Q&A: ${brandName} Leadership Answering Your Questions`);
      setBroadcastSubtitle(
        `Ask us anything live in the chat or request to join on camera with our CX & Product team.`,
      );
      setPerkTitle(`Townhall Participant Loyalty Reward`);
      setPerkPromoCode(`${cleanPrefix}_TOWNHALL`);
      setPerkDiscountLabel("VIP TOWNHALL PERK");
    } else if (cat === "flash_drop") {
      setBroadcastHeadline(`FLASH PERK DROP: ${brandName} Exclusive Live Viewer Giveaway`);
      setBroadcastSubtitle(
        `Limited-time reward drop for our SOT followers and live prospects!`,
      );
      setPerkTitle(`Flash 40% Off VIP Code`);
      setPerkPromoCode(`${cleanPrefix}_FLASH40`);
      setPerkDiscountLabel("40% FLASH DROP");
    }
  };

  const ringRecipientOnPlatform = useCallback(
    async (channelToRing: string) => {
      const resolvedRecipientName = targetRecipientName.trim() || brandName || "SOT User";
      const resolvedRecipientId = targetRecipientId.trim() || "sot-community-member";
      const callerDisplay =
        callDirection === "brand_to_user"
          ? `${brandName} (Brand Owner / CX Desk)`
          : user?.email?.split("@")[0] || "SOT Member";

      const ringPayload: IncomingSotCallPayload = {
        callId: `call-${Date.now()}`,
        callerId: user?.id || "brand-operator",
        callerName: callerDisplay,
        callDirection,
        recipientId: resolvedRecipientId,
        recipientName: resolvedRecipientName,
        brandName,
        topic: broadcastHeadline || productName || `${brandName} Resolution Call`,
        mode: sessionMode,
        roomChannel: channelToRing,
        timestamp: new Date().toISOString(),
      };

      // 1. Ring in real-time via BroadcastChannel (same browser / multi-tab preview)
      if (typeof BroadcastChannel !== "undefined") {
        const ringBc = new BroadcastChannel("sot-call-ring");
        ringBc.postMessage(ringPayload);
        ringBc.close();
      }

      // 2. Ring across devices via Supabase Realtime broadcast channel
      try {
        const ringChan = supabase.channel("sot-call-ring");
        ringChan.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            void ringChan.send({
              type: "broadcast",
              event: "incoming-call",
              payload: ringPayload,
            });
          }
        });
      } catch {
        // ignore
      }

      // 3. Also drop an automatic Direct Call Alert in the user's SOT Inbox (in case they aren't on their phone)
      if (user?.id && resolvedRecipientId && resolvedRecipientId !== user.id) {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://sort.app";
        const callLink = `${origin}/messages?to=${encodeURIComponent(user.id)}&room=${encodeURIComponent(channelToRing)}`;
        const modeLabel =
          sessionMode === "voice_call"
            ? "Voice Call"
            : sessionMode === "video_call"
              ? "Video Call"
              : studioPersona === "brand_owner"
                ? "Live Brand Launch Broadcast"
                : "Live Situation Broadcast";
        void sendMessage({
          senderId: user.id,
          recipientId: resolvedRecipientId,
          body: `📞 INCOMING ${modeLabel.toUpperCase()} ON SOT from ${callerDisplay} (regarding ${brandName} — ${broadcastHeadline}). Click to join our live room (${channelToRing}): ${callLink}`,
        });
      }

      setRingingSent(true);
      toast.success(
        `Ringing ${resolvedRecipientName} directly on SOT (${sessionMode === "voice_call" ? "Voice" : "Video"}) + sent direct link to their SOT Inbox!`,
      );
    },
    [targetRecipientName, targetRecipientId, brandName, broadcastHeadline, productName, callDirection, sessionMode, studioPersona, user],
  );

  const toggleCamera = () => {
    const next = !cameraOn;
    setCameraOn(next);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = next;
      });
    }
    if (agoraVideoRef.current) {
      void agoraVideoRef.current.setEnabled(next);
    }
  };

  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = next;
      });
    }
    if (agoraAudioRef.current) {
      void agoraAudioRef.current.setEnabled(next);
    }
  };

  const toggleScreenShare = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Screen sharing is not supported on this browser.");
      return;
    }
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      if (!screenTrack) return;
      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
      }
      if (pcRef.current) {
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(screenTrack);
      }
      setScreenSharing(true);
      toast.success("Sharing screen / presentation deck live!");
      screenTrack.onended = () => {
        setScreenSharing(false);
        if (streamRef.current && videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
      };
    } catch {
      toast.info("Screen sharing cancelled.");
    }
  };

  const startBroadcast = async () => {
    try {
      const res = await fetch("/api/agora-token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          channelName: roomChannel || `sot-live-${Date.now()}`,
          partnerId: brandName || "community",
          mode: sessionMode === "voice_call" ? "voice" : sessionMode === "video_call" ? "video" : "broadcast",
        }),
      });
      const tokenData = (await res.json()) as {
        provider?: "agora" | "google-webrtc";
        appId?: string | null;
        channelName?: string;
        token?: string | null;
        uid?: number;
        iceServers?: RTCIceServer[];
      };

      const channel = tokenData.channelName || roomChannel || "sot-live-room";
      setRoomChannel(channel);

      if (tokenData.provider === "agora" && tokenData.appId && tokenData.token && tokenData.uid) {
        setEngineUsed("Agora RTC + Google STUN");
        const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        agoraClientRef.current = client;
        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "audio") remoteUser.audioTrack?.play();
          if (mediaType === "video" && remoteVideoRef.current) {
            remoteUser.videoTrack?.play(remoteVideoRef.current);
          }
          setPeerJoined(true);
          setViewerCount((c) => c + 1);
        });
        await client.join(tokenData.appId, channel, tokenData.token, tokenData.uid);
        agoraAudioRef.current = await AgoraRTC.createMicrophoneAudioTrack();
        await client.publish(agoraAudioRef.current);
        if (sessionMode !== "voice_call") {
          agoraVideoRef.current = await AgoraRTC.createCameraVideoTrack();
          await client.publish(agoraVideoRef.current);
        }
      } else {
        setEngineUsed("Google WebRTC (stun.l.google.com)");
        const pc = new RTCPeerConnection({
          iceServers: tokenData.iceServers ?? GOOGLE_STUN_SERVERS,
        });
        pcRef.current = pc;

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            if (streamRef.current) pc.addTrack(track, streamRef.current);
          });
        }

        pc.ontrack = (ev) => {
          const [remoteStream] = ev.streams;
          if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            setPeerJoined(true);
          }
        };

        const emitSignal = (payload: Record<string, any>) => {
          bcRef.current?.postMessage(payload);
          void supaChanRef.current?.send({
            type: "broadcast",
            event: "sot-live-signal",
            payload,
          });
        };

        pc.onicecandidate = (ev) => {
          if (ev.candidate) {
            emitSignal({ type: "candidate", candidate: ev.candidate.toJSON() });
          }
        };

        const handleSignal = async (data: Record<string, any>) => {
          if (!pcRef.current) return;
          try {
            if (data.type === "chat" && data.message) {
              setChatMessages((prev) => [...prev, data.message]);
              return;
            }
            if (data.type === "live-vote" && (data.verdict === "stash" || data.verdict === "trash")) {
              if (data.verdict === "stash") setLiveStashVotes((v) => v + 1);
              else setLiveTrashVotes((v) => v + 1);
              return;
            }
            if (data.type === "join") {
              setViewerCount((v) => v + 1);
              const offer = await pcRef.current.createOffer();
              await pcRef.current.setLocalDescription(offer);
              emitSignal({ type: "offer", sdp: offer });
            } else if (data.type === "offer") {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
              const answer = await pcRef.current.createAnswer();
              await pcRef.current.setLocalDescription(answer);
              emitSignal({ type: "answer", sdp: answer });
              setPeerJoined(true);
            } else if (data.type === "answer" && pcRef.current.signalingState === "have-local-offer") {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
              setPeerJoined(true);
            } else if (data.type === "candidate" && data.candidate) {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          } catch {
            // ignore transient signaling states
          }
        };

        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel(`sot-live-${channel}`);
          bc.onmessage = (e) => void handleSignal(e.data);
          bcRef.current = bc;
        }

        const supaChan = supabase
          .channel(`sot-live-${channel}`)
          .on("broadcast", { event: "sot-live-signal" }, ({ payload }) => {
            if (payload) void handleSignal(payload as Record<string, any>);
          })
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              emitSignal({ type: "join" });
            }
          });
        supaChanRef.current = supaChan;
        emitSignal({ type: "join" });
      }

      // Publish to the Home & Feed Live Broadcast Stage!
      const notifiedFollowers = studioPersona === "brand_owner" ? Math.floor(850 + Math.random() * 2400) : 0;
      setFollowersAlertedCount(notifiedFollowers);

      const published = publishLiveBroadcastSession({
        id: activeBroadcastId || currentBroadcastId,
        roomChannel: channel,
        persona: studioPersona,
        brandName,
        brandSlug: brandSlug || brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        brandOwner,
        hostName:
          studioPersona === "brand_owner"
            ? `${brandName} Official Broadcast Team`
            : user?.email?.split("@")[0] || "Verified SOT Member",
        hostRoleLabel:
          studioPersona === "brand_owner"
            ? "Verified Brand Owner · Executive Studio"
            : "Verified Consumer · Live Situation Cam",
        title: broadcastHeadline.trim() || `${brandName} Live Session`,
        subtitle: broadcastSubtitle.trim(),
        brandCategory: studioPersona === "brand_owner" ? brandCategory : undefined,
        consumerCategory: studioPersona === "consumer" ? situationType : undefined,
        batchNumber: batchNumber.trim() || undefined,
        storeLocation: storeLocation.trim() || undefined,
        viewerCount: Math.max(viewerCount, studioPersona === "brand_owner" ? 48 : 12),
        stashVotes: liveStashVotes,
        trashVotes: liveTrashVotes,
        followersNotified: notifiedFollowers,
        launchPerk:
          studioPersona === "brand_owner" && enableLaunchPerk && perkPromoCode.trim()
            ? {
                title: perkTitle.trim() || `${brandName} Launch Voucher`,
                promoCode: perkPromoCode.trim().toUpperCase(),
                discountLabel: perkDiscountLabel.trim() || "LIVE LAUNCH PERK",
                totalAvailable: perkTotalAvailable,
                claimedCount: perkClaimedCount,
              }
            : undefined,
      });

      setCurrentBroadcastId(published.id);
      setIsLive(true);

      if (sessionMode !== "broadcast") {
        await ringRecipientOnPlatform(channel);
      }

      const initialMessages: {
        sender: string;
        text: string;
        time: string;
        isHost?: boolean;
        isPerkDrop?: boolean;
      }[] = [
        {
          sender: "SOT Live Studio",
          text:
            studioPersona === "brand_owner"
              ? `🚀 ${brandName} is now LIVE on the Home Feed & Brand Stage! Auto-alerted ${notifiedFollowers.toLocaleString()} followers & prospects. Viewers can now vote Stash or Trash live on your launch!`
              : `📹 Consumer Situation Stream is now LIVE on the SOT Feed via ${engineUsed}.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];

      if (studioPersona === "brand_owner" && enableLaunchPerk && perkPromoCode.trim()) {
        initialMessages.push({
          sender: `${brandName} (Official Perk Drop)`,
          text: `🎁 LIVE LAUNCH PERK UNLOCKED: "${perkTitle}" — Use code ${perkPromoCode.toUpperCase()} (${perkDiscountLabel}). Click "Claim Launch Perk" on screen to save to your SOT Wallet!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isHost: true,
          isPerkDrop: true,
        });
      }

      setChatMessages(initialMessages);
      toast.success(
        studioPersona === "brand_owner"
          ? `🚀 ${brandName} Launch Broadcast is LIVE on the Home Feed! ${notifiedFollowers.toLocaleString()} followers notified.`
          : "📹 Live Situation Broadcast started on the SOT Feed!",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start live session");
    }
  };

  const endBroadcast = async () => {
    await cleanupSession();
    toast.info("Live session ended. Launch pulse metrics & audit log saved.");
    onOpenChange(false);
  };

  const shareRoomLink = async () => {
    const link =
      typeof window !== "undefined"
        ? `${window.location.origin}/messages?to=${encodeURIComponent(brandName)}&room=${encodeURIComponent(roomChannel)}`
        : roomChannel;
    await navigator.clipboard?.writeText(link);
    toast.success("Live broadcast/call link copied! Share with clients or prospects.");
  };

  const handleCastLivePulse = (verdict: "stash" | "trash") => {
    if (verdict === "stash") {
      playCoinSpinSound();
    } else {
      playTrashSound();
    }
    setMyLiveVerdict(verdict);
    const res = voteOnLiveBroadcast(currentBroadcastId, verdict);
    if (res.session) {
      setLiveStashVotes(res.session.stashVotes);
      setLiveTrashVotes(res.session.trashVotes);
    } else {
      if (verdict === "stash") setLiveStashVotes((v) => v + 1);
      else setLiveTrashVotes((v) => v + 1);
    }

    const pulseMsg = {
      sender: user?.email?.split("@")[0] || "Live Viewer",
      text:
        verdict === "stash"
          ? `🪙 Voted STASH on ${brandName}'s live showcase! Loving this launch!`
          : `🗑️ Voted TRASH on ${brandName}'s live stream — needs improvement.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, pulseMsg]);
    bcRef.current?.postMessage({ type: "live-vote", verdict });
    bcRef.current?.postMessage({ type: "chat", message: pulseMsg });
    toast.success(
      verdict === "stash"
        ? `🪙 Stashed! Your live verdict boosted ${brandName}'s Launch Pulse.`
        : `🗑️ Trashed! Your live feedback was recorded on ${brandName}'s Launch Pulse.`,
    );
  };

  const handleClaimPerkInStudio = async () => {
    const res = claimLiveLaunchPerk(currentBroadcastId);
    setHasClaimedInSession(true);
    setPerkClaimedCount((c) => Math.min(perkTotalAvailable, c + (res.alreadyClaimed ? 0 : 1)));
    try {
      await navigator.clipboard?.writeText(perkPromoCode.toUpperCase());
    } catch {
      // ignore
    }
    toast.success(
      `🎁 Claimed "${perkTitle}" (${perkPromoCode.toUpperCase()})! Saved to your Consumer Profile Wallet & copied to clipboard.`,
    );
  };

  const handleDropPerkAnnouncement = () => {
    const dropMsg = {
      sender: `${brandName} (Host Perk Drop)`,
      text: `🎁 FLASH LAUNCH DROP: Claim "${perkTitle}" with code ${perkPromoCode.toUpperCase()} (${perkTotalAvailable - perkClaimedCount} vouchers left)!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isHost: true,
      isPerkDrop: true,
    };
    setChatMessages((prev) => [...prev, dropMsg]);
    bcRef.current?.postMessage({ type: "chat", message: dropMsg });
    toast.success("Dropped live launch voucher into the broadcast stream & chat!");
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      sender: studioPersona === "brand_owner" ? `${brandName} (Official Host)` : "You (Host)",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isHost: true,
    };
    setChatMessages((prev) => [...prev, msg]);
    bcRef.current?.postMessage({ type: "chat", message: { ...msg, isHost: false } });
    void supaChanRef.current?.send({
      type: "broadcast",
      event: "sot-live-signal",
      payload: { type: "chat", message: { ...msg, isHost: false } },
    });
    setChatInput("");
  };

  const totalLiveVotes = Math.max(1, liveStashVotes + liveTrashVotes);
  const liveStashPct = Math.round((liveStashVotes / totalLiveVotes) * 100);
  const activeBrandCatObj = BRAND_BROADCAST_CATEGORIES.find((c) => c.id === brandCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[94vh] overflow-y-auto p-0 gap-0 border-border/80">
        <DialogHeader className="p-4 border-b border-border/60 bg-muted/20">
          {/* Top Persona Switcher: Brand Owner Launch Studio vs Consumer Situation Studio */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background p-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold px-2">
              <Sparkles className="h-3.5 w-3.5 text-[#d6a928]" />
              <span>Select Broadcast Studio Mode:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setStudioPersona("brand_owner");
                  setSessionMode("broadcast");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                  studioPersona === "brand_owner"
                    ? "bg-slate-950 text-[#d6a928] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Rocket className="h-3.5 w-3.5" />
                🏛️ Brand Launch, Relaunch &amp; Engagement Studio (B2B)
              </button>
              <button
                type="button"
                onClick={() => setStudioPersona("consumer")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                  studioPersona === "consumer"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                📹 Consumer Situation &amp; Batch Cam (User)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  studioPersona === "brand_owner"
                    ? "bg-slate-950 text-[#d6a928] border border-[#d6a928]/50"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {studioPersona === "brand_owner" ? (
                  <Rocket className="h-5 w-5" />
                ) : (
                  <Radio className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-display flex flex-wrap items-center gap-2">
                  {studioPersona === "brand_owner"
                    ? `${brandName} — Official Brand Launch & Client Engagement Studio`
                    : "Live Voice, Video & Consumer Situation Studio"}
                  {isLive ? (
                    <Badge variant="destructive" className="animate-pulse text-[10px] gap-1">
                      <CircleDot className="h-2.5 w-2.5" /> LIVE ON HOME &amp; FEED
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {engineUsed}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                  <span>Host:</span>
                  <span className="font-semibold text-foreground">{brandName}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Building2 className="h-3 w-3" /> {brandOwner}
                  </span>
                  {followersAlertedCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-600 font-bold">
                        🔔 {followersAlertedCount.toLocaleString()} Followers Alerted
                      </span>
                    </>
                  )}
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-background/80 px-2.5 py-1 rounded-md border">
                  <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="tabular-nums">{viewerCount} watching live</span>
                </div>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void ringRecipientOnPlatform(roomChannel || "sot-live-room")}
                className="h-8 gap-1.5 text-xs font-bold border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
              >
                <BellRing className="h-3.5 w-3.5" />
                {ringingSent ? "Ring Sent (Ring Again)" : `Ring ${targetRecipientName || "Client"} on SOT`}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void shareRoomLink()}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Stream Link
              </Button>
            </div>
          </div>

          {/* BRAND OWNER LAUNCH & RELAUNCH CONFIGURATION BAR */}
          {studioPersona === "brand_owner" ? (
            <div className="mt-3 rounded-2xl border-2 border-[#d6a928]/50 bg-slate-950 p-3.5 text-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#f5d061]">
                  <Rocket className="h-3.5 w-3.5 text-[#d6a928]" />
                  Brand Broadcast Purpose (Launches, Relaunches, Tours &amp; Townhalls)
                </span>
                <span className="text-[11px] text-slate-300">
                  Streams live to the Home Page, Brand Page &amp; alerts all followers
                </span>
              </div>

              {/* 5 Brand Broadcast Categories */}
              <div className="flex flex-wrap gap-1.5">
                {BRAND_BROADCAST_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryPresetChange(cat.id)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      brandCategory === cat.id
                        ? "border-[#d6a928] bg-[#d6a928] text-slate-950 shadow-xs"
                        : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {cat.shortBadge}
                  </button>
                ))}
              </div>

              {/* Headline & Live Voucher Builder */}
              <div className="grid gap-2.5 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Launch / Broadcast Headline
                  </label>
                  <Input
                    value={broadcastHeadline}
                    onChange={(e) => setBroadcastHeadline(e.target.value)}
                    placeholder="e.g. LIVE LAUNCH: New Peri-Honey Flame Reveal"
                    className="h-8 border-slate-700 bg-slate-900 text-xs font-bold text-white"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>🎁 Live Viewer Perk / Voucher Title</span>
                    <input
                      type="checkbox"
                      checked={enableLaunchPerk}
                      onChange={(e) => setEnableLaunchPerk(e.target.checked)}
                      className="h-3 w-3 accent-[#d6a928]"
                      title="Enable claimable launch voucher on screen"
                    />
                  </label>
                  <Input
                    value={perkTitle}
                    disabled={!enableLaunchPerk}
                    onChange={(e) => setPerkTitle(e.target.value)}
                    placeholder="e.g. 25% Off New Launch Meal"
                    className="h-8 border-slate-700 bg-slate-900 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Promo Code
                  </label>
                  <div className="flex gap-1">
                    <Input
                      value={perkPromoCode}
                      disabled={!enableLaunchPerk}
                      onChange={(e) => setPerkPromoCode(e.target.value.toUpperCase())}
                      placeholder="SOT_LAUNCH25"
                      className="h-8 border-slate-700 bg-slate-900 font-mono text-xs font-bold text-[#f5d061]"
                    />
                    {isLive && enableLaunchPerk && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleDropPerkAnnouncement}
                        className="h-8 shrink-0 bg-[#d6a928] px-2 text-[11px] font-extrabold text-slate-950 hover:bg-[#e5b935]"
                        title="Drop voucher into live chat now"
                      >
                        Drop
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Direct User-to-User & Brand-to-User Dialer Bar */
            <div className="mt-3 rounded-xl border border-[#d6a928]/40 bg-[#d6a928]/5 p-2.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-[#d6a928]" />
                  Direct Platform Calling (No Phone Number Needed — Rings User In-App + SOT Inbox)
                </span>
                <div className="flex items-center gap-1 rounded-lg bg-background/80 p-0.5 border border-border/60">
                  {(
                    [
                      ["brand_to_user", "Brand → User (Reach Client)"],
                      ["user_to_user", "User → User (Peer Call)"],
                      ["user_to_brand", "User → Brand"],
                    ] as const
                  ).map(([dirKey, dirLabel]) => (
                    <button
                      key={dirKey}
                      type="button"
                      onClick={() => setCallDirection(dirKey)}
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                        callDirection === dirKey
                          ? "bg-slate-950 text-[#d6a928]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {dirLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  value={targetRecipientId}
                  onChange={(e) => {
                    const chosen = platformContacts.find((c) => c.id === e.target.value);
                    setTargetRecipientId(e.target.value);
                    if (chosen) setTargetRecipientName(chosen.name);
                  }}
                  className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold outline-none"
                >
                  <option value="">Select SOT User / Client from recent posts...</option>
                  {platformContacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ({c.context})
                    </option>
                  ))}
                </select>

                <Input
                  value={targetRecipientName}
                  onChange={(e) => setTargetRecipientName(e.target.value)}
                  placeholder="Or type User / Client name or handle to call..."
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          )}

          {/* Mode & Batch/Location Metadata Bar */}
          <div className="mt-3 grid gap-2 pt-3 border-t border-border/60 sm:grid-cols-3">
            <div className="flex items-center gap-1 rounded-lg bg-secondary/60 p-1">
              <button
                type="button"
                onClick={() => setSessionMode("broadcast")}
                className={`flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  sessionMode === "broadcast"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Broadcast
              </button>
              <button
                type="button"
                onClick={() => setSessionMode("video_call")}
                className={`flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  sessionMode === "video_call"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Video Call
              </button>
              <button
                type="button"
                onClick={() => setSessionMode("voice_call")}
                className={`flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  sessionMode === "voice_call"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Voice Call
              </button>
            </div>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder={
                  studioPersona === "brand_owner"
                    ? "SKU / Edition / Batch Code (Optional)"
                    : "Batch / Lot # or Barcode (Optional)"
                }
                className="h-8 pl-8 text-xs"
              />
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                placeholder={
                  studioPersona === "brand_owner"
                    ? "Launch Venue / Flagship Store / HQ"
                    : "Store / Branch / Spaza Location"
                }
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Main Video / Voice Viewport */}
          <div className="md:col-span-2 relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
            {sessionMode === "voice_call" ? (
              <div className="flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-400/50 bg-emerald-500/10 text-emerald-400">
                  <Phone className={`h-9 w-9 ${isLive ? "animate-bounce" : ""}`} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">
                    {isLive ? "Live Voice Call & Audio Stream" : "Voice Call Ready"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Room: <span className="font-mono text-slate-200">{roomChannel}</span> · {engineUsed}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`grid h-full w-full ${peerJoined ? "grid-cols-2" : "grid-cols-1"}`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!cameraOn && !screenSharing ? "hidden" : ""}`}
                />
                {peerJoined && (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover border-l border-white/10"
                  />
                )}
                {!cameraOn && !screenSharing && (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <VideoOff className="h-10 w-10 opacity-60" />
                    <span className="text-xs">Camera is turned off (Audio active)</span>
                  </div>
                )}
              </div>
            )}

            {/* Top-Left Live Overlay HUD */}
            <div className="absolute top-3 left-3 right-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white text-xs flex flex-wrap items-center gap-2 max-w-xl">
                  {studioPersona === "brand_owner" && activeBrandCatObj ? (
                    <span className="rounded-md bg-[#d6a928] px-2 py-0.5 text-[10px] font-black text-slate-950">
                      {activeBrandCatObj.shortBadge}
                    </span>
                  ) : (
                    <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white">
                      📹 CONSUMER CAM
                    </span>
                  )}
                  <span className="font-extrabold">{brandName}</span>
                  <span className="opacity-85 truncate max-w-[260px]">{broadcastHeadline}</span>
                  {batchNumber && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                      #{batchNumber}
                    </span>
                  )}
                  {storeLocation && (
                    <span className="text-[10px] text-slate-300">📍 {storeLocation}</span>
                  )}
                </div>

                {/* Live Launch Perk Overlay Card (Claimable by viewers in 1 click!) */}
                {studioPersona === "brand_owner" && enableLaunchPerk && perkPromoCode && (
                  <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[#d6a928] bg-slate-950/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-md">
                    <Gift className="h-4 w-4 shrink-0 text-[#d6a928]" />
                    <div className="leading-tight">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#f5d061]">
                        {perkDiscountLabel} · {perkTotalAvailable - perkClaimedCount} left
                      </p>
                      <p className="font-bold text-white text-[11px]">{perkTitle}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleClaimPerkInStudio()}
                      className="h-7 bg-[#d6a928] px-2.5 text-[10px] font-black text-slate-950 hover:bg-[#e5b935]"
                    >
                      {hasClaimedInSession ? (
                        <>
                          <Check className="mr-1 h-3 w-3" /> {perkPromoCode}
                        </>
                      ) : (
                        "Claim Perk"
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Consumer Situation Category Pills when in Consumer Mode */}
              {studioPersona === "consumer" && (
                <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                  {CONSUMER_BROADCAST_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSituationType(cat.id)}
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold transition ${
                        situationType === cat.id
                          ? "bg-[#d6a928] text-slate-950 font-bold"
                          : "bg-black/60 text-white/80 hover:bg-black/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {scanResult && (
                <div className="bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Verified Evidence ({scanResult.authenticity.score}% Authenticity)
                </div>
              )}
            </div>

            {/* LIVE STASH OR TRASH LAUNCH PULSE HUD (Bottom-Left above controls) */}
            <div className="absolute bottom-14 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/75 px-3 py-2 text-white backdrop-blur-md">
              <div className="min-w-[180px] flex-1">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="text-[#f5d061]">
                    🪙 {liveStashPct}% Stash ({liveStashVotes})
                  </span>
                  <span className="text-slate-300">
                    Live {studioPersona === "brand_owner" ? "Launch Reception Pulse" : "Community Verdict"}
                  </span>
                  <span className="text-rose-400">
                    🗑️ {100 - liveStashPct}% Trash ({liveTrashVotes})
                  </span>
                </div>
                <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-500"
                    style={{ width: `${liveStashPct}%` }}
                  />
                  <div
                    className="bg-rose-600 transition-all duration-500"
                    style={{ width: `${100 - liveStashPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleCastLivePulse("stash")}
                  className={`h-7 gap-1 px-2.5 text-[11px] font-black ${
                    myLiveVerdict === "stash"
                      ? "bg-[#d6a928] text-slate-950 ring-2 ring-white"
                      : "bg-[#d6a928]/90 text-slate-950 hover:bg-[#d6a928]"
                  }`}
                >
                  <Coins className="h-3 w-3" /> Stash Launch
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCastLivePulse("trash")}
                  className={`h-7 gap-1 px-2.5 text-[11px] font-black ${
                    myLiveVerdict === "trash" ? "ring-2 ring-white" : ""
                  }`}
                >
                  <Recycle className="h-3 w-3" /> Trash
                </Button>
              </div>
            </div>

            {/* Bottom In-Broadcast Controls */}
            <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-2">
              {sessionMode !== "voice_call" && (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant={cameraOn ? "secondary" : "destructive"}
                    className="h-9 w-9 rounded-full shadow-lg"
                    onClick={toggleCamera}
                    title="Toggle Camera"
                  >
                    {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant={screenSharing ? "default" : "secondary"}
                    className="h-9 w-9 rounded-full shadow-lg"
                    onClick={() => void toggleScreenShare()}
                    title="Share Screen, Product Slides or Receipt Evidence"
                  >
                    <MonitorUp className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                type="button"
                size="icon"
                variant={micOn ? "secondary" : "destructive"}
                className="h-9 w-9 rounded-full shadow-lg"
                onClick={toggleMic}
                title="Toggle Microphone"
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>

              {!isLive ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void startBroadcast()}
                  className={
                    studioPersona === "brand_owner"
                      ? "bg-[#d6a928] hover:bg-[#e5b935] text-slate-950 font-black gap-1.5 px-5 shadow-xl rounded-full"
                      : "bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5 px-4 shadow-xl rounded-full"
                  }
                >
                  {studioPersona === "brand_owner" ? (
                    <>
                      <Rocket className="h-4 w-4" />
                      Go Live &amp; Alert Followers
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4 animate-pulse" />
                      {sessionMode === "voice_call"
                        ? "Start Voice Call"
                        : sessionMode === "video_call"
                          ? "Start Video Call"
                          : "Go Live Now"}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => void endBroadcast()}
                  className="font-bold px-4 shadow-xl rounded-full"
                >
                  End Session
                </Button>
              )}
            </div>
          </div>

          {/* Side Live Chat & Engagement Feed */}
          <div className="border-l border-border flex flex-col h-80 md:h-auto bg-muted/10">
            <div className="p-3 border-b border-border/60 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground font-bold">
                <MessageSquare className="h-3.5 w-3.5 text-[#d6a928]" />
                {studioPersona === "brand_owner" ? "Live Launch Q&A & Perks" : "Live Situation Chat"}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{roomChannel}</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-xs space-y-2">
                  {studioPersona === "brand_owner" ? (
                    <>
                      <Users className="h-6 w-6 mx-auto text-[#d6a928]" />
                      <p className="font-semibold text-foreground">
                        Ready to broadcast your {activeBrandCatObj?.label.toLowerCase()}!
                      </p>
                      <p>
                        Click <strong>Go Live &amp; Alert Followers</strong> to stream to the Home Feed, collect live Stash/Trash votes, and drop your launch promo code.
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 mx-auto text-amber-500/80" />
                      <p>
                        {isLive
                          ? "No comments yet. Share your room link to invite peers or brand reps!"
                          : "Start your voice call, video call, or situation broadcast to open live chat."}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                chatMessages.map((m, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span
                        className={`font-bold ${
                          m.isPerkDrop
                            ? "text-[#b88914]"
                            : m.isHost
                              ? "text-primary"
                              : "text-foreground"
                        }`}
                      >
                        {m.sender}
                      </span>
                      <span>{m.time}</span>
                    </div>
                    <p
                      className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                        m.isPerkDrop
                          ? "border-[#d6a928] bg-[#d6a928]/15 font-bold text-foreground"
                          : "border-border/50 bg-background/80 text-foreground"
                      }`}
                    >
                      {m.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={sendChatMessage} className="p-2 border-t border-border/60 flex gap-1.5 bg-background">
              <Input
                placeholder={
                  isLive
                    ? studioPersona === "brand_owner"
                      ? "Reply to clients & prospects live..."
                      : "Type live situation note..."
                    : "Start session to chat..."
                }
                disabled={!isLive}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="h-8 text-xs"
              />
              <Button type="submit" size="sm" disabled={!isLive || !chatInput.trim()} className="h-8 px-3 text-xs">
                Send
              </Button>
            </form>
          </div>
        </div>

        <DialogFooter className="p-3 border-t border-border/60 bg-muted/10 sm:justify-between">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#d6a928]" />
            <span>
              Powered by Google WebRTC (<code>stun.l.google.com</code>) &amp; Agora RTC ·{" "}
              <strong>
                {studioPersona === "brand_owner"
                  ? "Executive Brand Launch & Engagement Broadcast"
                  : "Consumer Live Situation Studio"}
              </strong>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close Studio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
