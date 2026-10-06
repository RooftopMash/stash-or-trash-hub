import { useState, useRef, useEffect, useCallback } from "react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
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
  Volume2,
  User,
  Sparkles,
  MessageSquare,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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

const DEFAULT_GOOGLE_ICE: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

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
  const [engineType, setEngineType] = useState<"agora" | "webrtc">("agora");

  const agoraClientRef = useRef<IAgoraRTCClient | null>(null);
  const agoraAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const agoraVideoRef = useRef<ICameraVideoTrack | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoElRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoElRef = useRef<HTMLVideoElement | null>(null);
  const supaChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const localPipVideoElRef = useRef<HTMLVideoElement | null>(null);
  const remotePipVideoElRef = useRef<HTMLVideoElement | null>(null);

  // Call timer
  useEffect(() => {
    if (callState !== "connected") {
      setCallDuration(0);
      return;
    }
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  // Clean shutdown
  const hangupCall = useCallback(async () => {
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
      // non-fatal
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (supaChannelRef.current) {
      void supabase.removeChannel(supaChannelRef.current);
      supaChannelRef.current = null;
    }

    setCallState("ended");
    setMinimized(false);
    onOpenChange(false);
    onCallEnded?.();
    toast.info("Private call ended.");
  }, [onOpenChange, onCallEnded]);

  // Connect engine
  useEffect(() => {
    if (!open || !session) return;
    setCallState("ringing");
    setIsMuted(false);
    setIsVideoDisabled(session.mode === "voice");
    setIsScreenSharing(false);

    let isSubscribed = true;

    async function startConnection() {
      if (!session) return;
      const room = session.roomChannel;

      // 1. Try Agora RTC Token API
      try {
        const res = await fetch("/api/agora-token", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            channelName: room,
            uid: Math.floor(Math.random() * 100000) + 1,
            role: "publisher",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.provider === "agora" && data?.appId && data?.token && data?.uid && isSubscribed) {
            setEngineType("agora");
            const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");
            const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            agoraClientRef.current = client;

            client.on("user-published", async (remoteUser, mediaType) => {
              await client.subscribe(remoteUser, mediaType);
              if (mediaType === "video" && remoteVideoElRef.current) {
                remoteUser.videoTrack?.play(remoteVideoElRef.current);
              }
              if (mediaType === "audio") {
                remoteUser.audioTrack?.play();
              }
              setCallState("connected");
            });

            client.on("user-unpublished", () => {
              // Partner stopped video or left
            });

            client.on("user-left", () => {
              void hangupCall();
            });

            await client.join(data.appId, room, data.token, data.uid);

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

            // Assume connected after joining and publishing
            setTimeout(() => {
              if (isSubscribed) setCallState("connected");
            }, 1800);
            return;
          }
        }
      } catch (err) {
        console.warn("Agora connection fell back to Google WebRTC:", err);
      }

      // 2. Google WebRTC Fallback
      if (!isSubscribed) return;
      setEngineType("webrtc");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: session.mode !== "voice",
        });
        localStreamRef.current = stream;
        if (localVideoElRef.current && session.mode !== "voice") {
          localVideoElRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection({ iceServers: DEFAULT_GOOGLE_ICE });
        pcRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          const [remoteStream] = event.streams;
          if (remoteStream && remoteVideoElRef.current) {
            remoteVideoElRef.current.srcObject = remoteStream;
            setCallState("connected");
          }
        };

        const chan = supabase.channel(`sot-rtc-${room}`);
        supaChannelRef.current = chan;

        chan
          .on("broadcast", { event: "signal" }, async ({ payload }) => {
            if (!pcRef.current || payload.sender === user?.id) return;
            try {
              if (payload.type === "offer") {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
                const answer = await pcRef.current.createAnswer();
                await pcRef.current.setLocalDescription(answer);
                void chan.send({
                  type: "broadcast",
                  event: "signal",
                  payload: { type: "answer", sdp: answer, sender: user?.id },
                });
                setCallState("connected");
              } else if (payload.type === "answer") {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
                setCallState("connected");
              } else if (payload.type === "candidate" && payload.candidate) {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
              }
            } catch (e) {
              console.warn("WebRTC message warn:", e);
            }
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              void chan.send({
                type: "broadcast",
                event: "signal",
                payload: { type: "offer", sdp: offer, sender: user?.id },
              });
            }
          });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            void chan.send({
              type: "broadcast",
              event: "signal",
              payload: {
                type: "candidate",
                candidate: event.candidate.toJSON(),
                sender: user?.id,
              },
            });
          }
        };
      } catch (err) {
        console.error("WebRTC mic/cam access error:", err);
        toast.error("Could not access microphone or camera. Check browser permissions.");
        void hangupCall();
      }
    }

    void startConnection();

    return () => {
      isSubscribed = false;
    };
  }, [open, session, user?.id, hangupCall]);

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

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenSharing(true);
      if (localVideoElRef.current) {
        localVideoElRef.current.srcObject = screenStream;
      }
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
      };
    } catch {
      toast.info("Screen sharing cancelled.");
    }
  };

  if (!open || !session) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ==========================================
  // 1. MINIMIZED PICTURE-IN-PICTURE BUBBLE
  // (Allows browsing SOT while on the call)
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
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] font-mono text-emerald-400 font-bold">
            {callState === "ringing" ? "Ringing..." : formatTimer(callDuration)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className={cn("h-8 w-8 rounded-full text-slate-300 hover:text-white", isMuted && "bg-rose-500/20 text-rose-400")}
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
      <div className="relative flex h-full max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
        {/* Top Header: Privacy badge, partner identity & minimize button */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-black text-sm">
              {session.partnerAvatar ? (
                <img src={session.partnerAvatar} alt={session.partnerName} className="h-full w-full rounded-xl object-cover" />
              ) : (
                session.partnerName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold tracking-tight text-white">
                  {session.partnerName}
                </h3>
                {session.isBrandCall && (
                  <Badge variant="outline" className="border-[#d6a928]/40 bg-[#d6a928]/10 text-[10px] text-[#f5d061] font-bold">
                    <Building2 className="mr-1 h-3 w-3" /> Brand Desk Line
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <Lock className="h-3 w-3" /> Private 1-on-1 Call
                </span>
                <span>·</span>
                <span className="font-mono text-slate-300">
                  {callState === "ringing" ? (
                    <span className="text-amber-400 animate-pulse">Calling &amp; Ringing...</span>
                  ) : (
                    `Connected ${formatTimer(callDuration)}`
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMinimized(true)}
              className="gap-1.5 border-slate-700 bg-slate-900 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Minimize to floating window while you browse"
            >
              <Minimize2 className="h-3.5 w-3.5" /> Minimize
            </Button>
          </div>
        </div>

        {/* Video / Call Centerstage */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Remote Video Track */}
          <video
            ref={remoteVideoElRef}
            autoPlay
            playsInline
            className={cn(
              "h-full w-full object-cover",
              session.mode === "voice" || isVideoDisabled ? "hidden" : "block",
            )}
          />

          {/* Voice-only or Audio Call Avatar Graphic */}
          {(session.mode === "voice" || isVideoDisabled) && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
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
                <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping pointer-events-none" />
              </div>
              <h4 className="font-display text-2xl font-black text-white">{session.partnerName}</h4>
              <p className="mt-1 text-sm text-slate-400 max-w-md">
                {session.isBrandCall
                  ? `Speaking directly with ${session.brandName || "Brand"} Desk Operator via SOT Zero-Phone private calling.`
                  : "Private peer-to-peer audio call connected via encrypted WebRTC."}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Zero Phone Numbers Shared · 100% Private
              </div>
            </div>
          )}

          {/* Local Picture-in-Picture Video Preview */}
          {session.mode === "video" && !isVideoDisabled && (
            <div className="absolute bottom-4 right-4 h-32 w-48 overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 shadow-2xl">
              <video
                ref={localVideoElRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover -scale-x-100"
              />
              <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white/80 bg-black/60 px-1 rounded">
                You (Private)
              </span>
            </div>
          )}
        </div>

        {/* Bottom Messenger Calling Control Bar */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-900 px-6 py-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Engine: {engineType === "agora" ? "Agora Secure RTC" : "Google WebRTC P2P"}</span>
          </div>

          <div className="flex items-center justify-center gap-3 mx-auto sm:mx-0">
            {/* Mic Toggle */}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleMute}
              className={cn(
                "h-12 w-12 rounded-full border-slate-700 text-white transition",
                isMuted ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-800 hover:bg-slate-700",
              )}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Video Toggle */}
            <Button
              size="icon"
              variant="outline"
              onClick={() => void toggleVideo()}
              className={cn(
                "h-12 w-12 rounded-full border-slate-700 text-white transition",
                isVideoDisabled ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-800 hover:bg-slate-700",
              )}
              title={isVideoDisabled ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoDisabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            {/* Screen Sharing Toggle */}
            <Button
              size="icon"
              variant="outline"
              onClick={() => void toggleScreenShare()}
              className={cn(
                "h-12 w-12 rounded-full border-slate-700 text-white transition",
                isScreenSharing ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-slate-800 hover:bg-slate-700",
              )}
              title="Share screen to inspect product or receipt"
            >
              <MonitorUp className="h-5 w-5" />
            </Button>

            {/* Red End Call Button */}
            <Button
              size="icon"
              onClick={() => void hangupCall()}
              className="h-12 w-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition"
              title="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[11px] text-slate-400 block">End-to-End Secure</span>
            <span className="text-xs font-bold text-slate-200">SOrT Private Line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
