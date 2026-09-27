"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Camera,
  Copy,
  Mic,
  MicOff,
  MonitorUp,
  Phone,
  PhoneCall,
  PhoneOff,
  Radio,
  ShieldCheck,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/lib/messages";
import type { IncomingSotCallPayload } from "@/components/LiveBroadcastModal";
import { toast } from "sonner";

type LiveCollaborationPanelProps = {
  partnerName: string;
  isBrandWorkspace: boolean;
  partnerId: string;
  initialCallMode?: "voice" | "video" | null;
  customRoom?: string;
  onOpenFullDialer?: (mode: "voice_call" | "video_call") => void;
};

const DEFAULT_GOOGLE_ICE: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

export function LiveCollaborationPanel({
  partnerName,
  isBrandWorkspace,
  partnerId,
  initialCallMode,
  customRoom,
  onOpenFullDialer,
}: LiveCollaborationPanelProps) {
  const { user, session } = useAuth();
  const [requestedMode, setRequestedMode] = useState<"voice" | "video" | "broadcast" | null>(null);
  const [connected, setConnected] = useState(false);
  const [engineLabel, setEngineLabel] = useState<string>("Google WebRTC + Agora Hybrid");
  const [channelName, setChannelName] = useState<string>("");
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const videoRef = useRef<ICameraVideoTrack | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoElRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoElRef = useRef<HTMLVideoElement | null>(null);
  const signalingRef = useRef<BroadcastChannel | null>(null);
  const supaChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!connected) {
      setCallSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [connected]);

  const leaveCall = useCallback(async () => {
    try {
      audioRef.current?.close();
      videoRef.current?.close();
      audioRef.current = null;
      videoRef.current = null;
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }
    } catch {
      // ignore Agora cleanup errors
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (signalingRef.current) {
      signalingRef.current.close();
      signalingRef.current = null;
    }
    if (supaChannelRef.current) {
      void supabase.removeChannel(supaChannelRef.current);
      supaChannelRef.current = null;
    }
    setConnected(false);
    setRemoteConnected(false);
    setScreenSharing(false);
    setRequestedMode(null);
  }, []);

  useEffect(
    () => () => {
      void leaveCall();
    },
    [leaveCall],
  );

  const setupGoogleWebRtcCall = async (
    room: string,
    mode: "voice" | "video" | "broadcast",
    iceServers: RTCIceServer[],
  ) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: mode !== "voice",
    });
    localStreamRef.current = stream;
    if (localVideoElRef.current && mode !== "voice") {
      localVideoElRef.current.srcObject = stream;
    }

    const pc = new RTCPeerConnection({
      iceServers: iceServers.length > 0 ? iceServers : DEFAULT_GOOGLE_ICE,
    });
    pcRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream && remoteVideoElRef.current) {
        remoteVideoElRef.current.srcObject = remoteStream;
        setRemoteConnected(true);
      }
    };

    const sendSignal = (data: Record<string, unknown>) => {
      signalingRef.current?.postMessage(data);
      void supaChannelRef.current?.send({
        type: "broadcast",
        event: "webrtc-signal",
        payload: data,
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "candidate",
          candidate: event.candidate.toJSON(),
          sender: user?.id ?? "anon",
        });
      }
    };

    const handleSignal = async (msg: Record<string, any>) => {
      if (!pcRef.current || msg.sender === (user?.id ?? "anon")) return;
      try {
        if (msg.type === "offer") {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          sendSignal({ type: "answer", sdp: answer, sender: user?.id ?? "anon" });
          setRemoteConnected(true);
        } else if (msg.type === "answer" && pcRef.current.signalingState === "have-local-offer") {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          setRemoteConnected(true);
        } else if (msg.type === "candidate" && msg.candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } else if (msg.type === "ready") {
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);
          sendSignal({ type: "offer", sdp: offer, sender: user?.id ?? "anon" });
        }
      } catch (err) {
        console.warn("WebRTC signal handling warning:", err);
      }
    };

    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(`sot-rtc-${room}`);
      bc.onmessage = (ev) => void handleSignal(ev.data);
      signalingRef.current = bc;
    }

    const supaChan = supabase
      .channel(`sot-rtc-${room}`)
      .on("broadcast", { event: "webrtc-signal" }, ({ payload }) => {
        if (payload) void handleSignal(payload as Record<string, any>);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          sendSignal({ type: "ready", sender: user?.id ?? "anon" });
        }
      });
    supaChannelRef.current = supaChan;

    // Also announce readiness on BroadcastChannel for instant multi-tab/local peer connection
    sendSignal({ type: "ready", sender: user?.id ?? "anon" });
  };

  const ringRecipientOnSot = useCallback(
    async (room: string, mode: "voice" | "video" | "broadcast") => {
      const callerDisplayName =
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        (isBrandWorkspace ? "Verified Brand Representative" : "SOT Community Member");

      const ringPayload: IncomingSotCallPayload = {
        callId: `call-${Date.now()}`,
        callerId: user?.id || "sot-caller",
        callerName: callerDisplayName,
        recipientId: partnerId || "community",
        recipientName: partnerName || "SOT Member",
        brandName: isBrandWorkspace ? callerDisplayName : partnerName,
        topic: isBrandWorkspace
          ? "Brand Owner reaching out via SOT Messaging (No Phone Number Needed)"
          : "Direct User-to-User Call via SOT Messaging",
        roomChannel: room,
        mode: mode === "voice" ? "voice_call" : "video_call",
        callDirection: isBrandWorkspace ? "brand_to_user" : "user_to_user",
        timestamp: new Date().toISOString(),
      };

      if (typeof BroadcastChannel !== "undefined") {
        const ringBc = new BroadcastChannel("sot-call-ring");
        ringBc.postMessage(ringPayload);
        ringBc.close();
      }

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

      if (user?.id && partnerId && partnerId !== "sot-community-desk" && partnerId !== user.id) {
        try {
          await sendMessage({
            senderId: user.id,
            recipientId: partnerId,
            body: `📞 Incoming ${mode === "voice" ? "Voice Call" : "Video Call"} on SOT from ${callerDisplayName} — Open this thread to join live room (${room}).`,
          });
        } catch {
          // Non-blocking if partnerId is a virtual channel
        }
      }
    },
    [user, isBrandWorkspace, partnerId, partnerName],
  );

  const requestCall = async (mode: "voice" | "video" | "broadcast") => {
    setRequestedMode(mode);
    setCameraOn(mode !== "voice");
    setMicrophoneOn(true);

    try {
      const response = await fetch("/api/agora-token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          partnerId: customRoom || partnerId || "community-room",
          callerId: user?.id || "sot-client",
          mode,
        }),
      });

      const payload = (await response.json()) as {
        provider?: "agora" | "google-webrtc";
        error?: string;
        appId?: string | null;
        channelName?: string;
        token?: string | null;
        uid?: number;
        iceServers?: RTCIceServer[];
      };

      const resolvedChannel = customRoom || payload.channelName || `sot-${partnerId || "live"}`;
      setChannelName(resolvedChannel);

      // Ring the target user or brand across SOT immediately
      void ringRecipientOnSot(resolvedChannel, mode);

      if (payload.provider === "agora" && payload.appId && payload.token && payload.uid) {
        setEngineLabel("Agora RTC + Google STUN");
        const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;
        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "audio") remoteUser.audioTrack?.play();
          if (mediaType === "video" && remoteVideoElRef.current) {
            remoteUser.videoTrack?.play(remoteVideoElRef.current);
          }
          setRemoteConnected(true);
        });
        await client.join(payload.appId, resolvedChannel, payload.token, payload.uid);
        audioRef.current = await AgoraRTC.createMicrophoneAudioTrack();
        await client.publish(audioRef.current);
        if (mode !== "voice") {
          videoRef.current = await AgoraRTC.createCameraVideoTrack();
          await client.publish(videoRef.current);
          if (localVideoElRef.current) {
            videoRef.current.play(localVideoElRef.current);
          }
        }
        setConnected(true);
        toast.success(
          `${mode === "voice" ? "Voice call" : mode === "broadcast" ? "Live broadcast" : "Video call"} connected via Agora RTC`,
        );
        return;
      }

      // Use Google WebRTC Engine (Google STUN stun.l.google.com:19302 + Realtime Signaling)
      setEngineLabel("Google WebRTC (stun.l.google.com)");
      await setupGoogleWebRtcCall(
        resolvedChannel,
        mode,
        payload.iceServers ?? DEFAULT_GOOGLE_ICE,
      );
      setConnected(true);
      toast.success(
        `${mode === "voice" ? "Voice call" : mode === "broadcast" ? "Live situation broadcast" : "Video call"} active via Google WebRTC!`,
      );
    } catch (error) {
      console.error("Call initialization failed:", error);
      const msg = error instanceof Error ? error.message : "Could not access microphone/camera";
      toast.error(
        msg.includes("Permission") || msg.includes("NotAllowedError")
          ? "Please allow microphone/camera access in your browser to start the call."
          : `Call notice: ${msg}`,
      );
      setRequestedMode(null);
    }
  };

  const toggleMic = () => {
    const next = !microphoneOn;
    setMicrophoneOn(next);
    if (audioRef.current) {
      void audioRef.current.setEnabled(next);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = next;
      });
    }
  };

  const toggleCam = () => {
    const next = !cameraOn;
    setCameraOn(next);
    if (videoRef.current) {
      void videoRef.current.setEnabled(next);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = next;
      });
    }
  };

  const toggleScreenShare = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Screen sharing is not supported on this device.");
      return;
    }
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      if (!screenTrack) return;

      if (pcRef.current) {
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(screenTrack);
      }
      if (localVideoElRef.current) {
        localVideoElRef.current.srcObject = displayStream;
      }
      setScreenSharing(true);
      toast.success("Sharing your screen / evidence live");

      screenTrack.onended = () => {
        setScreenSharing(false);
        if (localStreamRef.current && localVideoElRef.current) {
          localVideoElRef.current.srcObject = localStreamRef.current;
          const camTrack = localStreamRef.current.getVideoTracks()[0];
          if (camTrack && pcRef.current) {
            const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
            if (sender) void sender.replaceTrack(camTrack);
          }
        }
      };
    } catch {
      toast.info("Screen share cancelled.");
    }
  };

  const copyRoomLink = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/messages?to=${encodeURIComponent(partnerId)}&room=${encodeURIComponent(channelName)}`
        : channelName;
    await navigator.clipboard?.writeText(url);
    toast.success("Direct call link copied — share with your client or brand representative!");
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="border-b border-border bg-secondary/40 px-4 py-3">
      {initialCallMode && !requestedMode && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs">
          <div>
            <p className="font-bold text-foreground">
              Ready to place {initialCallMode === "voice" ? "Voice Call" : "Video Call"} to{" "}
              <span className="text-emerald-600">{partnerName}</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Rings {partnerName} directly on SOT (no personal phone number required).
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => void requestCall(initialCallMode)}
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
          >
            {initialCallMode === "voice" ? (
              <PhoneCall className="h-3.5 w-3.5" />
            ) : (
              <Video className="h-3.5 w-3.5" />
            )}
            Dial {partnerName} Now
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            Direct Voice &amp; Video Calling · {partnerName}
          </p>
          <p className="text-xs text-muted-foreground">
            {isBrandWorkspace
              ? "Call your client directly on SOT when you cannot reach their phone number."
              : "User-to-User & User-to-Brand Voice and Video Calling inside SOT Messaging."}
          </p>
        </div>
        {!requestedMode ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void requestCall("voice")}
              className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <Phone className="h-3.5 w-3.5" /> Voice Call
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => void requestCall("video")}
              className="gap-1.5 font-semibold"
            >
              <Video className="h-3.5 w-3.5" /> Video Call
            </Button>
            {onOpenFullDialer && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onOpenFullDialer("voice_call")}
                className="gap-1.5 font-semibold"
              >
                <PhoneCall className="h-3.5 w-3.5 text-[#d6a928]" /> Call Studio
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void ringRecipientOnSot(channelName, requestedMode);
                toast.success(`Ringing ${partnerName} on SOT...`);
              }}
              className="gap-1.5 border-emerald-500/40 text-xs font-semibold text-emerald-600"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Ring Again
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => void leaveCall()}
              className="gap-1.5 font-semibold"
            >
              <PhoneOff className="h-3.5 w-3.5" /> End ({formatDuration(callSeconds)})
            </Button>
          </div>
        )}
      </div>

      {requestedMode && (
        <div className="mt-3 rounded-xl border border-stash/30 bg-background p-3.5 text-sm shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-stash" aria-hidden="true" />
              <span className="font-bold text-xs">
                {requestedMode === "voice"
                  ? "Encrypted Voice Call"
                  : requestedMode === "broadcast"
                    ? "Live Consumer Situation Broadcast"
                    : "Two-Way Video Call"}
              </span>
              <span className="text-xs text-muted-foreground">· {engineLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-muted-foreground">
              <span>{remoteConnected ? "Peer Connected" : "Waiting for peer / broadcasting"}</span>
              <span>·</span>
              <span>{formatDuration(callSeconds)}</span>
            </div>
          </div>

          {requestedMode !== "voice" && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-slate-950">
                <video
                  ref={localVideoElRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${!cameraOn && !screenSharing ? "hidden" : ""}`}
                />
                {!cameraOn && !screenSharing && (
                  <div className="flex h-full flex-col items-center justify-center text-xs text-slate-400">
                    <VideoOff className="mb-1 h-6 w-6 opacity-60" />
                    <span>Camera Off (Audio Active)</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                  You ({screenSharing ? "Screen Evidence" : "Camera"})
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-slate-900">
                <video
                  ref={remoteVideoElRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
                {!remoteConnected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-xs text-slate-300">
                    <Radio className="mb-1.5 h-6 w-6 animate-pulse text-[#d6a928]" />
                    <p className="font-semibold">Channel Ready: {channelName}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Share the call link or open this thread on another device to connect peer video.
                    </p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                  {partnerName}
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={microphoneOn ? "secondary" : "outline"}
                onClick={toggleMic}
                className="gap-1.5 text-xs"
              >
                {microphoneOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                {microphoneOn ? "Mic On" : "Muted"}
              </Button>

              {requestedMode !== "voice" && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant={cameraOn ? "secondary" : "outline"}
                    onClick={toggleCam}
                    className="gap-1.5 text-xs"
                  >
                    {cameraOn ? (
                      <Camera className="h-3.5 w-3.5" />
                    ) : (
                      <VideoOff className="h-3.5 w-3.5" />
                    )}
                    {cameraOn ? "Camera On" : "Camera Off"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={screenSharing ? "default" : "outline"}
                    onClick={() => void toggleScreenShare()}
                    className="gap-1.5 text-xs"
                  >
                    <MonitorUp className="h-3.5 w-3.5" />
                    {screenSharing ? "Sharing Evidence" : "Share Screen / Receipt"}
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void copyRoomLink()}
                className="gap-1.5 text-xs"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Call Link
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => void leaveCall()}
                className="gap-1.5 text-xs"
              >
                <PhoneOff className="h-3.5 w-3.5" /> Leave Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

