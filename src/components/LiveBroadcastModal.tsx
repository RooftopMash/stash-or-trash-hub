import { useState, useRef, useEffect, useCallback } from "react";
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
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
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AiScanResult } from "@/lib/ai-scanner";

interface LiveBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandOwner: string;
  productName: string;
  scanResult?: AiScanResult | null;
}

const GOOGLE_STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

export function LiveBroadcastModal({
  open,
  onOpenChange,
  brandName,
  brandOwner,
  productName,
  scanResult,
}: LiveBroadcastModalProps) {
  const [isLive, setIsLive] = useState(false);
  const [sessionMode, setSessionMode] = useState<"broadcast" | "video_call" | "voice_call">("broadcast");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(1);
  const [engineUsed, setEngineUsed] = useState<string>("Google WebRTC (stun.l.google.com)");
  const [roomChannel, setRoomChannel] = useState<string>("");
  const [peerJoined, setPeerJoined] = useState(false);

  // Situation & Counterfeit Batch Metadata
  const [situationType, setSituationType] = useState<"counterfeit" | "defect" | "service" | "review">("counterfeit");
  const [batchNumber, setBatchNumber] = useState("");
  const [storeLocation, setStoreLocation] = useState("");

  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; isHost?: boolean }[]
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

  // Setup camera/mic preview when modal is opened
  useEffect(() => {
    let active = true;
    if (open) {
      const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || "sot";
      setRoomChannel(`sot-live-${slug}`);
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
  }, [open, brandName, sessionMode, cleanupSession]);

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
      toast.success("Sharing screen / receipt evidence live!");
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

      setIsLive(true);
      toast.success(
        sessionMode === "voice_call"
          ? `Voice call room active for ${brandName}!`
          : sessionMode === "video_call"
            ? `2-Way Video Call active for ${brandName}!`
            : `Broadcasting your situation live for ${brandName}!`,
      );
      setChatMessages([
        {
          sender: "SOT Live Studio",
          text: `Session active (${engineUsed}). Topic: ${brandName} (${brandOwner})${batchNumber ? ` · Batch #${batchNumber}` : ""}${storeLocation ? ` · Store: ${storeLocation}` : ""}.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start live session");
    }
  };

  const endBroadcast = async () => {
    await cleanupSession();
    toast.info("Live session ended. Audit log saved.");
    onOpenChange(false);
  };

  const shareRoomLink = async () => {
    const link =
      typeof window !== "undefined"
        ? `${window.location.origin}/messages?to=${encodeURIComponent(brandName)}&room=${encodeURIComponent(roomChannel)}`
        : roomChannel;
    await navigator.clipboard?.writeText(link);
    toast.success("Live call/broadcast link copied! Send it to the brand or another client to join.");
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      sender: "You (Host)",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isHost: true,
    };
    setChatMessages((prev) => [...prev, msg]);
    bcRef.current?.postMessage({ type: "chat", message: { ...msg, sender: "Live Peer", isHost: false } });
    void supaChanRef.current?.send({
      type: "broadcast",
      event: "sot-live-signal",
      payload: { type: "chat", message: { ...msg, sender: "Live Peer", isHost: false } },
    });
    setChatInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-border/80">
        <DialogHeader className="p-4 border-b border-border/60 bg-muted/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-display flex items-center gap-2">
                  Live Voice, Video &amp; Consumer Situation Studio
                  {isLive ? (
                    <Badge variant="destructive" className="animate-pulse text-[10px] gap-1">
                      <CircleDot className="h-2.5 w-2.5" /> LIVE NOW
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {engineUsed}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                  <span>Target:</span>
                  <span className="font-semibold text-foreground">{brandName}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Building2 className="h-3 w-3" /> {brandOwner}
                  </span>
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-background/80 px-2.5 py-1 rounded-md border">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="tabular-nums">{viewerCount} connected</span>
                </div>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void shareRoomLink()}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <Share2 className="h-3.5 w-3.5" /> Invite Peer / Brand
              </Button>
            </div>
          </div>

          {/* Mode & Situation Tagging Bar */}
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
                placeholder="Batch / Lot # or Barcode (Optional)"
                className="h-8 pl-8 text-xs"
              />
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                placeholder="Store / Branch / Spaza Location"
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
                    {isLive ? "Live Voice Call & Audio Situation Stream" : "Voice Call Ready"}
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

            {/* Live Overlay HUD */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-xs flex flex-wrap items-center gap-2">
                <span className="font-bold">{brandName}</span>
                {productName && <span className="opacity-80">({productName})</span>}
                {batchNumber && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                    Batch #{batchNumber}
                  </span>
                )}
                {storeLocation && (
                  <span className="text-[10px] text-slate-300">📍 {storeLocation}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                {(
                  [
                    ["counterfeit", "Suspected Fake / Counterfeit"],
                    ["defect", "Defective / Expired Batch"],
                    ["service", "Customer Service Issue"],
                    ["review", "Verified Product Review"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSituationType(key)}
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold transition ${
                      situationType === key
                        ? "bg-[#d6a928] text-slate-950 font-bold"
                        : "bg-black/60 text-white/80 hover:bg-black/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {scanResult && (
                <div className="bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Verified Evidence ({scanResult.authenticity.score}% Authenticity)
                </div>
              )}
            </div>

            {/* Bottom In-Broadcast Controls */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
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
                    title="Share Screen or Receipt Evidence"
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
                  className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5 px-4 shadow-xl rounded-full"
                >
                  <Radio className="h-4 w-4 animate-pulse" />
                  {sessionMode === "voice_call"
                    ? "Start Voice Call"
                    : sessionMode === "video_call"
                      ? "Start Video Call"
                      : "Go Live Now"}
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

          {/* Side Live Chat & Community Feed */}
          <div className="border-l border-border flex flex-col h-72 md:h-auto bg-muted/10">
            <div className="p-3 border-b border-border/60 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" /> Live Situation Chat
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{roomChannel}</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-xs space-y-1">
                  <AlertTriangle className="h-5 w-5 mx-auto text-amber-500/80" />
                  <p>
                    {isLive
                      ? "No comments yet. Share your room link to invite peers or brand reps!"
                      : "Start your voice call, video call, or situation broadcast to open live chat."}
                  </p>
                </div>
              ) : (
                chatMessages.map((m, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className={`font-semibold ${m.isHost ? "text-primary" : "text-foreground"}`}>
                        {m.sender}
                      </span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-foreground bg-background/80 p-2 rounded-lg border border-border/50 text-[11px] leading-relaxed">
                      {m.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={sendChatMessage} className="p-2 border-t border-border/60 flex gap-1.5 bg-background">
              <Input
                placeholder={isLive ? "Type live situation note..." : "Start session to chat..."}
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
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>
              Powered by Google WebRTC (<code>stun.l.google.com</code>) &amp; Agora RTC · Indexed to{" "}
              <strong>{brandOwner}</strong>
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

