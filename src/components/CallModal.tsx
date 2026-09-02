import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff, PhoneCall, Volume2 } from "lucide-react";
import { toast } from "sonner";

export function CallModal({
  open,
  onClose,
  partnerName,
  callType,
  currentUserId,
  partnerId,
}: {
  open: boolean;
  onClose: () => void;
  partnerName: string;
  callType: "audio" | "video";
  currentUserId: string;
  partnerId: string;
}) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(callType === "audio");
  const [status, setStatus] = useState<"calling" | "connected" | "ended">("calling");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const channelId = [currentUserId, partnerId].sort().join("_");
    const channel = supabase.channel(`call_${channelId}`);

    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === "video",
        });

        if (!isMounted) return;
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setStatus("connected");
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            channel.send({
              type: "broadcast",
              event: "candidate",
              payload: { candidate: event.candidate, sender: currentUserId },
            });
          }
        };

        // Signaling listener
        channel
          .on("broadcast", { event: "offer" }, async ({ payload }) => {
            if (payload.sender === currentUserId) return;
            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            channel.send({
              type: "broadcast",
              event: "answer",
              payload: { sdp: answer, sender: currentUserId },
            });
            setStatus("connected");
          })
          .on("broadcast", { event: "answer" }, async ({ payload }) => {
            if (payload.sender === currentUserId) return;
            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            setStatus("connected");
          })
          .on("broadcast", { event: "candidate" }, async ({ payload }) => {
            if (payload.sender === currentUserId) return;
            if (payload.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(() => {});
            }
          })
          .on("broadcast", { event: "end" }, () => {
            endCall();
          })
          .subscribe(async (s) => {
            if (s === "SUBSCRIBED") {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              channel.send({
                type: "broadcast",
                event: "offer",
                payload: { sdp: offer, sender: currentUserId },
              });
            }
          });
      } catch (err) {
        toast.error("Camera/Microphone access required for calls.");
        onClose();
      }
    };

    void startCall();

    return () => {
      isMounted = false;
      channel.send({ type: "broadcast", event: "end", payload: {} });
      supabase.removeChannel(channel);
      endCall();
    };
  }, [open, partnerId, currentUserId, callType]);

  const endCall = () => {
    setStatus("ended");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    onClose();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && endCall()}>
      <DialogContent className="max-w-lg bg-slate-950 text-white border-slate-800 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg font-bold">
            <span className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary animate-pulse" />
              {callType === "video" ? "Video Call" : "Audio Call"} with {partnerName}
            </span>
            <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {status === "calling" ? "Ringing..." : status === "connected" ? "Live Call" : "Ended"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center my-4">
          {/* Remote Video Stream */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {status === "calling" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm space-y-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 font-bold text-3xl text-primary animate-bounce">
                {partnerName.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold">Calling {partnerName}...</p>
            </div>
          )}

          {/* Local Video Stream Preview */}
          {callType === "video" && (
            <div className="absolute bottom-3 right-3 h-28 w-20 overflow-hidden rounded-xl border border-white/20 shadow-lg bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Call Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="icon"
            variant={muted ? "destructive" : "secondary"}
            onClick={toggleMute}
            className="h-12 w-12 rounded-full"
          >
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {callType === "video" && (
            <Button
              size="icon"
              variant={videoOff ? "destructive" : "secondary"}
              onClick={toggleVideo}
              className="h-12 w-12 rounded-full"
            >
              {videoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          )}

          <Button
            size="icon"
            variant="destructive"
            onClick={endCall}
            className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
