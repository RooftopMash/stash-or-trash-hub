import { useState, useRef, useEffect } from "react";
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
  Users,
  Eye,
  MessageSquare,
  Sparkles,
  Building2,
  Share2,
  ShieldCheck,
  CircleDot,
} from "lucide-react";
import { toast } from "sonner";
import type { AiScanResult } from "@/lib/ai-scanner";

interface LiveBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandOwner: string;
  productName: string;
  scanResult?: AiScanResult | null;
}

export function LiveBroadcastModal({
  open,
  onOpenChange,
  brandName,
  brandOwner,
  productName,
  scanResult,
}: LiveBroadcastModalProps) {
  const [isLive, setIsLive] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [viewerCount, setViewerCount] = useState(1);
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; isHost?: boolean }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Setup camera stream when modal is opened
  useEffect(() => {
    let localStream: MediaStream | null = null;
    if (open) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          localStream = s;
          streamRef.current = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera/mic permission denied for broadcast:", err);
          toast.warning("Camera or microphone permission not granted. Preview mode enabled.");
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsLive(false);
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [open]);

  // Simulate viewer counter when live
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setViewerCount((v) => Math.min(342, v + Math.floor(Math.random() * 5)));
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleCamera = () => {
    if (streamRef.current) {
      const vTrack = streamRef.current.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = !cameraOn;
        setCameraOn(!cameraOn);
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const aTrack = streamRef.current.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const startBroadcast = () => {
    setIsLive(true);
    toast.success(`You are now broadcasting live about ${brandName}!`);
    setChatMessages([
      {
        sender: "StashOrTrash Bot",
        text: `Live stream started. Consumer review on ${brandName} (Owner: ${brandOwner}) is now public.`,
        time: "Just now",
      },
    ]);
  };

  const endBroadcast = () => {
    setIsLive(false);
    toast.info("Broadcast session completed. Highlights saved to your creator profile.");
    onOpenChange(false);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "You (Reviewer)",
        text: chatInput.trim(),
        time: "Just now",
        isHost: true,
      },
    ]);
    setChatInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80">
        <DialogHeader className="p-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-display flex items-center gap-2">
                  Live Consumer Product Broadcast
                  {isLive ? (
                    <Badge variant="destructive" className="animate-pulse text-[10px] gap-1">
                      <CircleDot className="h-2.5 w-2.5" /> LIVE NOW
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Broadcast Studio
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>Topic:</span>
                  <span className="font-semibold text-foreground">{brandName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Building2 className="h-3 w-3" /> Owner: {brandOwner}
                  </span>
                </DialogDescription>
              </div>
            </div>

            {isLive && (
              <div className="flex items-center gap-2 text-xs font-semibold bg-background/80 px-2.5 py-1 rounded-full border shadow-xs">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{viewerCount} watching</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Main Video Viewport */}
          <div className="md:col-span-2 relative bg-black aspect-video flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!cameraOn ? "hidden" : ""}`}
            />
            {!cameraOn && (
              <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                <VideoOff className="h-10 w-10 text-muted-foreground/60" />
                <span className="text-xs">Camera is turned off</span>
              </div>
            )}

            {/* Live Overlay HUD */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-xs flex items-center gap-2">
                <span className="font-bold">{brandName}</span>
                {productName && <span className="opacity-80">({productName})</span>}
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
                  onClick={startBroadcast}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5 px-4 shadow-xl rounded-full"
                >
                  <Radio className="h-4 w-4 animate-pulse" /> Go Live
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={endBroadcast}
                  className="font-bold px-4 shadow-xl rounded-full"
                >
                  End Broadcast
                </Button>
              )}
            </div>
          </div>

          {/* Side Live Chat & Community Feed */}
          <div className="border-l border-border flex flex-col h-72 md:h-auto bg-muted/10">
            <div className="p-3 border-b border-border/60 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" /> Live Community Chat
              </span>
              <span className="text-[10px] text-muted-foreground">Realtime</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-xs">
                  {isLive ? "No comments yet. Share your broadcast link!" : "Chat will appear when broadcast starts."}
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
                placeholder={isLive ? "Type live message..." : "Go live to chat..."}
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
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Direct community broadcast indexed to brand owner "{brandOwner}"
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close Studio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
