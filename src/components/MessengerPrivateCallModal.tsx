import { useState, useRef, useEffect, useCallback } from "react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Lock,
  Building2,
  MessageSquare,
  Send,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { sendMessage } from "@/lib/messages";
import {
  FALLBACK_ICE_SERVERS,
  attachUnifiedRtcSignaling,
  broadcastCallStatus,
  createPoliteWebRtcController,
  createStablePeerId,
  samplePeerConnectionQuality,
  type RtcNetworkQuality,
} from "@/lib/rtc-signaling";
import { cn } from "@/lib/utils";

export interface MessengerCallSession {
  roomChannel: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRole?: string;
  isBrandCall?: boolean;
  brandName?: string;
  mode: "voice" | "video";
  callDirection: "user_to_user" | "brand_to_user" | "user_to_brand";
}

interface MessengerPrivateCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: MessengerCallSession | null;
  onCallEnded?: () => void;
}

type CallChatEntry = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf?: boolean;
};

const QUICK_REACTIONS = ["👍", "🤝", "🪙", "🙏", "✅"];

export function MessengerPrivateCallModal({
  open,
  onOpenChange,
  session,
  onCallEnded,
}: MessengerPrivateCallModalProps) {
  const { user } = useAuth();
  const [callState, setCallState] = useState<"ringing" | "connected" | "ended">("ringing");
  const [minimized, setMinimized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [engineType, setEngineType] = useState<"agora" | "webrtc">("webrtc");
  const [turnActive, setTurnActive] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<RtcNetworkQuality>({
    label: "Connecting",
    rttMs: null,
    kbps: null,
  });

  // In-call chat & reactions + audio/video device selection
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [callChat, setCallChat] = useState<CallChatEntry[]>([]);
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");

  const agoraClientRef = useRef<IAgoraRTCClient | null>(null);
  const agoraAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const agoraVideoRef = useRef<ICameraVideoTrack | null>(null);
  const agoraScreenRef = useRef<ILocalVideoTrack | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const localVideoElRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoElRef = useRef<HTMLVideoElement | null>(null);
  const signalingCleanupRef = useRef<(() => void) | null>(null);
  const emitSignalRef = useRef<ReturnType<typeof attachUnifiedRtcSignaling>["emit"] | null>(null);
  const statsIntervalRef = useRef<number | null>(null);
  const prevBytesSentRef = useRef<number | undefined>(undefined);
  const callStateRef = useRef<"ringing" | "connected" | "ended">("ringing");
  const callDurationRef = useRef<number>(0);
  const closedByRemoteRef = useRef(false);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);

  // Call timer (only counts once a remote peer actually joins / connects)
  useEffect(() => {
    if (callState !== "connected") {
      setCallDuration(0);
      return;
    }
    const interval = window.setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [callState]);

  const formatTimer = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const releaseMediaAndConnections = useCallback(async () => {
    if (statsIntervalRef.current !== null) {
      window.clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
    prevBytesSentRef.current = undefined;

    if (signalingCleanupRef.current) {
      signalingCleanupRef.current();
      signalingCleanupRef.current = null;
    }
    emitSignalRef.current = null;

    try {
      agoraAudioRef.current?.close();
      agoraVideoRef.current?.close();
      agoraScreenRef.current?.close();
      agoraAudioRef.current = null;
      agoraVideoRef.current = null;
      agoraScreenRef.current = null;
      if (agoraClientRef.current) {
        await agoraClientRef.current.leave();
        agoraClientRef.current = null;
      }
    } catch {
      // non-fatal Agora teardown
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localVideoElRef.current) {
      localVideoElRef.current.srcObject = null;
    }
    if (remoteVideoElRef.current) {
      remoteVideoElRef.current.srcObject = null;
    }
  }, []);

  // Clean shutdown
  const hangupCall = useCallback(
    async (options?: { silent?: boolean; remoteReason?: string }) => {
      const wasConnected = callStateRef.current === "connected";
      const elapsed = callDurationRef.current;

      if (session?.roomChannel && !options?.remoteReason) {
        if (emitSignalRef.current) {
          emitSignalRef.current({ type: "call-ended" });
        } else {
          broadcastCallStatus({
            roomChannel: session.roomChannel,
            senderId: user?.id || "sot-peer",
            type: "call-ended",
          });
        }
      }

      await releaseMediaAndConnections();

      if (user?.id && session?.partnerId && session.partnerId !== user.id && !closedByRemoteRef.current) {
        const modeWord = session.mode === "voice" ? "Voice Call" : "Video Call";
        const logText = options?.remoteReason
          ? `📵 ${modeWord} with ${session.partnerName} was declined.`
          : wasConnected
            ? `📞 ${modeWord} ended (${formatTimer(elapsed)}).`
            : `📞 ${modeWord} attempt ended before answer.`;
        void sendMessage({
          senderId: user.id,
          recipientId: session.partnerId,
          body: logText,
        });
      }

      setCallState("ended");
      setMinimized(false);
      setIsScreenSharing(false);
      onOpenChange(false);
      onCallEnded?.();

      if (!options?.silent) {
        toast.info(options?.remoteReason || "Private call ended.");
      }
    },
    [session, user?.id, formatTimer, onOpenChange, onCallEnded, releaseMediaAndConnections],
  );

  // Connect engine
  useEffect(() => {
    if (!open || !session) return;
    closedByRemoteRef.current = false;
    setCallState("ringing");
    setIsMuted(false);
    setIsVideoDisabled(session.mode === "voice");
    setIsScreenSharing(false);
    setNetworkQuality({ label: "Connecting", rttMs: null, kbps: null });
    setCallChat([]);
    setChatOpen(false);
    setDevicesOpen(false);

    let isSubscribed = true;
    const myPeerId = createStablePeerId(user?.id);

    async function refreshDeviceList() {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        if (!isSubscribed) return;
        setAudioInputs(list.filter((d) => d.kind === "audioinput"));
        setVideoInputs(list.filter((d) => d.kind === "videoinput"));
      } catch {
        // ignore enumeration restriction
      }
    }

    async function startConnection() {
      if (!session) return;
      const room = session.roomChannel;

      let fetchedIceServers: RTCIceServer[] = FALLBACK_ICE_SERVERS;
      let agoraData: {
        provider?: "agora" | "google-webrtc";
        appId?: string | null;
        channelName?: string;
        token?: string | null;
        uid?: number;
        iceServers?: RTCIceServer[];
        turnConfigured?: boolean;
      } | null = null;

      try {
        const res = await fetch("/api/agora-token", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            channelName: room,
            partnerId: session.partnerId,
            callerId: user?.id || "sot-client",
            mode: session.mode,
            role: "publisher",
          }),
        });
        if (res.ok) {
          agoraData = await res.json();
          if (agoraData?.iceServers?.length) {
            fetchedIceServers = agoraData.iceServers;
          }
          setTurnActive(Boolean(agoraData?.turnConfigured));
        }
      } catch {
        // fallback to default STUN list
      }

      // 1. Agora RTC Path (only when server issued real Agora App ID + Token)
      if (
        agoraData?.provider === "agora" &&
        agoraData.appId &&
        agoraData.token &&
        agoraData.uid &&
        isSubscribed
      ) {
        try {
          setEngineType("agora");
          const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");
          const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
          agoraClientRef.current = client;

          // Keep lightweight data-channel signaling open for decline/chat/reactions even during Agora mode
          const controlBridge = attachUnifiedRtcSignaling({
            roomChannel: room,
            peerId: myPeerId,
            onSignal: (msg) => {
              if (!isSubscribed) return;
              if (msg.type === "call-declined") {
                closedByRemoteRef.current = true;
                void hangupCall({ remoteReason: "Recipient declined the call." });
              } else if (msg.type === "call-ended") {
                closedByRemoteRef.current = true;
                void hangupCall({ silent: true });
                toast.info(`${session.partnerName} ended the call.`);
              } else if (msg.type === "chat" && msg.message) {
                setCallChat((prev) => [...prev, { ...msg.message!, id: `${Date.now()}` }]);
                setChatOpen(true);
              } else if (msg.type === "reaction" && msg.emoji) {
                setFloatingReaction(msg.emoji);
                window.setTimeout(() => setFloatingReaction(null), 2200);
              }
            },
          });
          signalingCleanupRef.current = controlBridge.cleanup;
          emitSignalRef.current = controlBridge.emit;

          client.on("user-joined", () => {
            if (isSubscribed) setCallState("connected");
          });

          client.on("user-published", async (remoteUser, mediaType) => {
            await client.subscribe(remoteUser, mediaType);
            if (mediaType === "video" && remoteVideoElRef.current) {
              remoteUser.videoTrack?.play(remoteVideoElRef.current);
            }
            if (mediaType === "audio") {
              remoteUser.audioTrack?.play();
            }
            if (isSubscribed) setCallState("connected");
          });

          client.on("network-quality", (stats) => {
            if (!isSubscribed) return;
            const worst = Math.max(stats.uplinkNetworkQuality, stats.downlinkNetworkQuality);
            const label: RtcNetworkQuality["label"] =
              worst === 0
                ? "Connecting"
                : worst <= 2
                  ? "HD"
                  : worst === 3
                    ? "Good"
                    : worst === 4
                      ? "Fair"
                      : "Weak";
            setNetworkQuality((prev) => ({ ...prev, label }));
          });

          client.on("user-left", () => {
            if (!isSubscribed) return;
            closedByRemoteRef.current = true;
            void hangupCall({ silent: true });
            toast.info(`${session.partnerName} left the private call.`);
          });

          await client.join(agoraData.appId, agoraData.channelName || room, agoraData.token, agoraData.uid);

          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          agoraAudioRef.current = audioTrack;
          await client.publish(audioTrack);

          if (session.mode !== "voice") {
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            agoraVideoRef.current = videoTrack;
            if (localVideoElRef.current) {
              videoTrack.play(localVideoElRef.current);
            }
            await client.publish(videoTrack);
          }

          void refreshDeviceList();
          return;
        } catch (err) {
          console.warn("Agora connection fell back to Google WebRTC:", err);
          await releaseMediaAndConnections();
        }
      }

      // 2. Unified WebRTC Peer-to-Peer Path (Dual-Event Signaling + Polite Glare Resolution)
      if (!isSubscribed) return;
      setEngineType("webrtc");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: session.mode !== "voice",
        });
        if (!isSubscribed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoElRef.current && session.mode !== "voice") {
          localVideoElRef.current.srcObject = stream;
        }
        void refreshDeviceList();

        const pc = new RTCPeerConnection({ iceServers: fetchedIceServers });
        pcRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          const [remoteStream] = event.streams;
          if (remoteStream && remoteVideoElRef.current) {
            remoteVideoElRef.current.srcObject = remoteStream;
          }
          if (isSubscribed) setCallState("connected");
        };

        pc.oniceconnectionstatechange = () => {
          if (!isSubscribed) return;
          if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
            setCallState("connected");
          } else if (pc.iceConnectionState === "failed") {
            setNetworkQuality({ label: "Weak", rttMs: null, kbps: null });
          }
        };

        let controller: ReturnType<typeof createPoliteWebRtcController> | null = null;

        const bridge = attachUnifiedRtcSignaling({
          roomChannel: room,
          peerId: myPeerId,
          onSignal: (msg) => controller?.handleSignal(msg),
          onSubscribed: () => {
            bridge.emit({ type: "ready" });
          },
        });
        signalingCleanupRef.current = bridge.cleanup;
        emitSignalRef.current = bridge.emit;

        controller = createPoliteWebRtcController({
          pc,
          peerId: myPeerId,
          emit: bridge.emit,
          onRemoteJoined: () => {
            if (isSubscribed) setCallState("connected");
          },
          onCallDeclined: (reason) => {
            if (!isSubscribed) return;
            closedByRemoteRef.current = true;
            void hangupCall({ remoteReason: reason || `${session.partnerName} declined the call.` });
          },
          onCallEnded: () => {
            if (!isSubscribed) return;
            closedByRemoteRef.current = true;
            void hangupCall({ silent: true });
            toast.info(`${session.partnerName} ended the call.`);
          },
          onChatMessage: (msg) => {
            if (!isSubscribed) return;
            setCallChat((prev) => [...prev, { ...msg, id: msg.id || `${Date.now()}` }]);
            setChatOpen(true);
          },
          onReaction: (emoji) => {
            if (!isSubscribed) return;
            setFloatingReaction(emoji);
            window.setTimeout(() => setFloatingReaction(null), 2200);
          },
        });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            bridge.emit({
              type: "candidate",
              candidate: event.candidate.toJSON(),
            });
          }
        };

        // Also announce on BroadcastChannel right away for instant same-browser peer tabs
        bridge.emit({ type: "ready" });

        // Poll real WebRTC connection stats every 2 seconds
        statsIntervalRef.current = window.setInterval(async () => {
          if (!pcRef.current || !isSubscribed) return;
          const { quality, bytesSent } = await samplePeerConnectionQuality(
            pcRef.current,
            prevBytesSentRef.current,
            2,
          );
          prevBytesSentRef.current = bytesSent;
          if (isSubscribed) setNetworkQuality(quality);
        }, 2000);
      } catch (err) {
        console.error("WebRTC mic/cam access error:", err);
        toast.error("Could not access microphone or camera. Check browser permissions.");
        await releaseMediaAndConnections();
        onOpenChange(false);
        onCallEnded?.();
      }
    }

    void startConnection();

    return () => {
      isSubscribed = false;
      void releaseMediaAndConnections();
    };
  }, [open, session, user?.id, hangupCall, releaseMediaAndConnections, onOpenChange, onCallEnded]);

  // Toggle Microphone
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (agoraAudioRef.current) {
      void agoraAudioRef.current.setEnabled(!next);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !next;
      });
    }
    toast.info(next ? "Microphone muted" : "Microphone active");
  };

  // Toggle Camera
  const toggleVideo = async () => {
    const next = !isVideoDisabled;
    setIsVideoDisabled(next);
    if (agoraVideoRef.current) {
      void agoraVideoRef.current.setEnabled(!next);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !next;
      });
    }
  };

  // Stop active screen share and restore camera track cleanly for both Agora & WebRTC
  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }

    if (engineType === "agora" && agoraClientRef.current) {
      try {
        if (agoraScreenRef.current) {
          await agoraClientRef.current.unpublish(agoraScreenRef.current);
          agoraScreenRef.current.close();
          agoraScreenRef.current = null;
        }
        if (agoraVideoRef.current && !isVideoDisabled) {
          await agoraClientRef.current.publish(agoraVideoRef.current);
          if (localVideoElRef.current) {
            agoraVideoRef.current.play(localVideoElRef.current);
          }
        }
      } catch {
        // non-fatal Agora restore
      }
    } else if (pcRef.current && localStreamRef.current) {
      const camTrack = localStreamRef.current.getVideoTracks()[0];
      if (camTrack) {
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(camTrack);
        }
      }
      if (localVideoElRef.current) {
        localVideoElRef.current.srcObject = localStreamRef.current;
      }
    }

    setIsScreenSharing(false);
  }, [engineType, isVideoDisabled]);

  // Toggle Screen Sharing (replaces outgoing track so partner actually receives it)
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      return;
    }
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Screen sharing is not supported on this device.");
      return;
    }

    try {
      if (engineType === "agora" && agoraClientRef.current) {
        const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");
        const screenTrackResult = await AgoraRTC.createScreenVideoTrack({ encoderConfig: "1080p_1" }, "disable");
        const screenVideoTrack = Array.isArray(screenTrackResult) ? screenTrackResult[0] : screenTrackResult;
        agoraScreenRef.current = screenVideoTrack;

        if (agoraVideoRef.current) {
          await agoraClientRef.current.unpublish(agoraVideoRef.current);
        }
        await agoraClientRef.current.publish(screenVideoTrack);
        if (localVideoElRef.current) {
          screenVideoTrack.play(localVideoElRef.current);
        }
        screenVideoTrack.on("track-ended", () => {
          void stopScreenShare();
        });
        setIsScreenSharing(true);
        toast.success("Sharing screen live to partner");
        return;
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) return;
      screenStreamRef.current = screenStream;

      if (pcRef.current) {
        const videoSender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (videoSender) {
          await videoSender.replaceTrack(screenTrack);
        } else {
          pcRef.current.addTrack(screenTrack, screenStream);
        }
      }
      if (localVideoElRef.current) {
        localVideoElRef.current.srcObject = screenStream;
      }
      screenTrack.onended = () => {
        void stopScreenShare();
      };
      setIsScreenSharing(true);
      toast.success("Sharing screen live to partner");
    } catch {
      toast.info("Screen sharing cancelled.");
    }
  };

  // Switch active microphone or camera live mid-call
  const switchDevice = async (kind: "audio" | "video", deviceId: string) => {
    if (!deviceId) return;
    if (kind === "audio") setSelectedAudioId(deviceId);
    else setSelectedVideoId(deviceId);

    if (engineType === "agora") {
      try {
        if (kind === "audio" && agoraAudioRef.current) {
          await agoraAudioRef.current.setDevice(deviceId);
        }
        if (kind === "video" && agoraVideoRef.current) {
          await agoraVideoRef.current.setDevice(deviceId);
        }
        toast.success(`Switched ${kind === "audio" ? "microphone" : "camera"} cleanly.`);
      } catch {
        toast.error(`Could not switch ${kind === "audio" ? "microphone" : "camera"}.`);
      }
      return;
    }

    if (!pcRef.current || !localStreamRef.current) return;
    try {
      const freshStream = await navigator.mediaDevices.getUserMedia(
        kind === "audio" ? { audio: { deviceId: { exact: deviceId } } } : { video: { deviceId: { exact: deviceId } } },
      );
      const newTrack = kind === "audio" ? freshStream.getAudioTracks()[0] : freshStream.getVideoTracks()[0];
      if (!newTrack) return;

      const sender = pcRef.current.getSenders().find((s) => s.track?.kind === kind);
      if (sender) {
        await sender.replaceTrack(newTrack);
      }
      const oldTracks = kind === "audio" ? localStreamRef.current.getAudioTracks() : localStreamRef.current.getVideoTracks();
      oldTracks.forEach((t) => {
        localStreamRef.current?.removeTrack(t);
        t.stop();
      });
      localStreamRef.current.addTrack(newTrack);
      if (kind === "video" && localVideoElRef.current && !isScreenSharing) {
        localVideoElRef.current.srcObject = localStreamRef.current;
      }
      toast.success(`Switched ${kind === "audio" ? "microphone" : "camera"} cleanly.`);
    } catch {
      toast.error(`Could not switch ${kind === "audio" ? "microphone" : "camera"}.`);
    }
  };

  const sendInCallChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const entry: CallChatEntry = {
      id: `${Date.now()}`,
      sender: user?.email?.split("@")[0] || "You",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };
    setCallChat((prev) => [...prev, entry]);
    emitSignalRef.current?.({
      type: "chat",
      message: { id: entry.id, sender: entry.sender, text: entry.text, time: entry.time },
    });
    setChatInput("");
  };

  const sendReaction = (emoji: string) => {
    setFloatingReaction(emoji);
    emitSignalRef.current?.({ type: "reaction", emoji });
    window.setTimeout(() => setFloatingReaction(null), 2000);
  };

  if (!open || !session) return null;

  const qualityBadgeColor =
    networkQuality.label === "HD"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
      : networkQuality.label === "Good"
        ? "border-sky-500/40 bg-sky-500/15 text-sky-300"
        : networkQuality.label === "Fair"
          ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
          : networkQuality.label === "Weak"
            ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
            : "border-slate-600 bg-slate-800 text-slate-300";

  // ==========================================
  // 1. MINIMIZED PICTURE-IN-PICTURE BUBBLE
  // ==========================================
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 text-white font-black text-lg">
          {session.partnerAvatar ? (
            <img src={session.partnerAvatar} alt={session.partnerName} className="h-full w-full object-cover" />
          ) : (
            session.partnerName.charAt(0).toUpperCase()
          )}
          {session.mode === "video" && !isVideoDisabled && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Video className="h-4 w-4 text-emerald-400" />
            </div>
          )}
        </div>

        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-bold text-white max-w-[120px]">
              {session.partnerName}
            </span>
            <span
              className={cn(
                "flex h-2 w-2 rounded-full",
                callState === "connected" ? "bg-emerald-500" : "bg-amber-400 animate-pulse",
              )}
            />
          </div>
          <p className="text-[11px] font-mono tabular-nums text-emerald-400 font-bold">
            {callState === "ringing" ? "Waiting for partner..." : formatTimer(callDuration)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className={cn(
              "h-8 w-8 rounded-full text-slate-300 hover:text-white",
              isMuted && "bg-rose-500/20 text-rose-400",
            )}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMinimized(false)}
            className="h-8 w-8 rounded-full text-slate-300 hover:text-white"
            title="Maximize call window"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => void hangupCall()}
            className="h-8 w-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white"
            title="End call"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. FULL MESSENGER-STYLE PRIVATE CALL WINDOW
  // ==========================================
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Private call with ${session.partnerName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
    >
      <div className="relative flex h-full max-h-[820px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-5 py-3.5 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-black text-sm">
              {session.partnerAvatar ? (
                <img
                  src={session.partnerAvatar}
                  alt={session.partnerName}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                session.partnerName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-bold tracking-tight text-white">
                  {session.partnerName}
                </h3>
                {session.isBrandCall && (
                  <Badge
                    variant="outline"
                    className="border-[#d6a928]/40 bg-[#d6a928]/10 text-[10px] text-[#f5d061] font-bold"
                  >
                    <Building2 className="mr-1 h-3 w-3" /> Brand Desk Line
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <Lock className="h-3 w-3" /> Private 1-on-1 Call
                </span>
                <span>·</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {callState === "ringing" ? (
                    <span className="text-amber-400 animate-pulse">Ringing / Waiting for peer...</span>
                  ) : (
                    `Connected ${formatTimer(callDuration)}`
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-mono tabular-nums font-semibold",
                qualityBadgeColor,
              )}
              title="Live connection health & latency"
            >
              <Wifi className="h-3 w-3" />
              {networkQuality.label}
              {networkQuality.rttMs !== null ? ` · ${networkQuality.rttMs}ms` : ""}
              {networkQuality.kbps !== null && networkQuality.kbps > 0 ? ` · ${networkQuality.kbps}kbps` : ""}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDevicesOpen((v) => !v)}
              className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs text-slate-300 hover:bg-slate-800 hover:text-white whitespace-nowrap shrink-0"
              title="Switch microphone or camera"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Devices
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setChatOpen((v) => !v)}
              className={cn(
                "h-8 gap-1.5 border-slate-700 text-xs whitespace-nowrap shrink-0",
                chatOpen
                  ? "bg-[#d6a928] text-slate-950 border-[#d6a928] font-bold"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
              title="Open in-call text & receipt chat"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Chat
              {callChat.length > 0 ? ` (${callChat.length})` : ""}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMinimized(true)}
              className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs text-slate-300 hover:bg-slate-800 hover:text-white whitespace-nowrap shrink-0"
              title="Minimize to floating window while you browse"
            >
              <Minimize2 className="h-3.5 w-3.5" /> Minimize
            </Button>
          </div>
        </div>

        {/* Device Switcher Tray */}
        {devicesOpen && (
          <div className="grid gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-3 sm:grid-cols-2 text-xs">
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-slate-300">Microphone Input</span>
              <select
                value={selectedAudioId}
                onChange={(e) => void switchDevice("audio", e.target.value)}
                className="h-8 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs text-white outline-none"
              >
                <option value="">Default System Microphone</option>
                {audioInputs.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
            {session.mode === "video" && (
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-slate-300">Camera Input</span>
                <select
                  value={selectedVideoId}
                  onChange={(e) => void switchDevice("video", e.target.value)}
                  className="h-8 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs text-white outline-none"
                >
                  <option value="">Default System Camera</option>
                  {videoInputs.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId}>
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {/* Main Centerstage + Optional Side In-Call Chat */}
        <div className="relative flex flex-1 overflow-hidden">
          <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Remote Video Track */}
            <video
              ref={remoteVideoElRef}
              autoPlay
              playsInline
              className={cn(
                "h-full w-full object-cover",
                session.mode === "voice" && callState !== "connected" ? "hidden" : "block",
              )}
            />

            {/* Voice-only / Waiting Avatar Centerpiece */}
            {(session.mode === "voice" || callState === "ringing") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-950/90">
                <div className="relative mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 border-2 border-slate-700 text-3xl font-black text-white shadow-2xl">
                  {session.partnerAvatar ? (
                    <img
                      src={session.partnerAvatar}
                      alt={session.partnerName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    session.partnerName.charAt(0).toUpperCase()
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full border pointer-events-none",
                      callState === "connected"
                        ? "border-emerald-500/40"
                        : "border-amber-400/50 animate-ping",
                    )}
                  />
                </div>
                <h4 className="font-display text-2xl font-black text-white">{session.partnerName}</h4>
                <p className="mt-1 text-sm text-slate-300 max-w-md">
                  {callState === "ringing"
                    ? `Ringing ${session.partnerName} privately on SOrT... waiting for them to answer.`
                    : session.isBrandCall
                      ? `Speaking live with ${session.brandName || "Brand"} Desk Operator via SOrT Zero-Phone calling.`
                      : "Private peer-to-peer call active."}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Zero Phone Numbers Shared · Encrypted Media
                </div>
              </div>
            )}

            {/* Floating Live Reaction */}
            {floatingReaction && (
              <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-3xl shadow-xl animate-bounce">
                {floatingReaction}
              </div>
            )}

            {/* Local Picture-in-Picture Video Preview */}
            {(session.mode === "video" || isScreenSharing) && (!isVideoDisabled || isScreenSharing) && (
              <div className="absolute bottom-4 right-4 h-32 w-48 overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 shadow-2xl">
                <video
                  ref={localVideoElRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "h-full w-full object-cover",
                    !isScreenSharing && "-scale-x-100",
                  )}
                />
                <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white/85 bg-black/70 px-1.5 py-0.5 rounded">
                  {isScreenSharing ? "Screen Shared" : "You (Private)"}
                </span>
              </div>
            )}
          </div>

          {/* Slide-over In-Call Text Chat */}
          {chatOpen && (
            <div className="w-72 sm:w-80 border-l border-slate-800 bg-slate-900/95 flex flex-col">
              <div className="border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between text-xs font-bold">
                <span>In-Call Notes &amp; Batch Codes</span>
                <span className="text-[10px] text-slate-400">Encrypted Room</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
                {callChat.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">
                    Drop a barcode number, store location, or order code mid-call without leaving video.
                  </p>
                ) : (
                  callChat.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "rounded-xl px-2.5 py-2",
                        entry.isSelf ? "bg-[#d6a928] text-slate-950 ml-4" : "bg-slate-800 text-slate-100 mr-4",
                      )}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5 font-semibold">
                        <span>{entry.sender}</span>
                        <span>{entry.time}</span>
                      </div>
                      <p className="leading-snug break-words">{entry.text}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendInCallChat} className="border-t border-slate-800 p-2 flex gap-1.5">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share code or note..."
                  className="h-8 bg-slate-950 border-slate-700 text-xs text-white"
                />
                <Button type="submit" size="icon" className="h-8 w-8 shrink-0 bg-[#d6a928] text-slate-950 hover:bg-[#e5b935]">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Messenger Calling Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-5 py-3.5">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>
              {engineType === "agora"
                ? "Agora Global Edge RTC"
                : turnActive
                  ? "WebRTC + TURN Relay Active"
                  : "WebRTC Direct P2P (STUN)"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mx-auto lg:mx-0">
            <Button
              size="icon"
              variant="outline"
              onClick={toggleMute}
              className={cn(
                "h-11 w-11 rounded-full border-slate-700 text-white transition",
                isMuted ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-800 hover:bg-slate-700",
              )}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => void toggleVideo()}
              className={cn(
                "h-11 w-11 rounded-full border-slate-700 text-white transition",
                isVideoDisabled ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-800 hover:bg-slate-700",
              )}
              title={isVideoDisabled ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoDisabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => void toggleScreenShare()}
              className={cn(
                "h-11 w-11 rounded-full border-slate-700 text-white transition",
                isScreenSharing ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-slate-800 hover:bg-slate-700",
              )}
              title={isScreenSharing ? "Stop sharing screen" : "Share screen to inspect product or receipt"}
            >
              <MonitorUp className="h-5 w-5" />
            </Button>

            {/* Quick Live Reactions */}
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => sendReaction(emoji)}
                  className="rounded-full px-1.5 py-0.5 text-sm hover:bg-slate-700 transition cursor-pointer"
                  title={`Send ${emoji} reaction`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <Button
              size="icon"
              onClick={() => void hangupCall()}
              className="h-11 w-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition"
              title="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden lg:block text-right">
            <span className="text-[11px] text-slate-400 block">Zero Phone Privacy</span>
            <span className="text-xs font-bold text-slate-200">SOrT Private Line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
