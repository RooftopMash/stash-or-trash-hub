"use client";

import { useEffect, useRef, useState } from "react";
import AgoraRTC, { type IAgoraRTCClient, type ICameraVideoTrack, type IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Mic, Phone, ShieldCheck, Video, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LiveCollaborationPanelProps = {
  partnerName: string;
  isBrandWorkspace: boolean;
  partnerId: string;
};

export function LiveCollaborationPanel({ partnerName, isBrandWorkspace, partnerId }: LiveCollaborationPanelProps) {
  const { session } = useAuth();
  const [requestedMode, setRequestedMode] = useState<"voice" | "video" | null>(null);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const videoRef = useRef<ICameraVideoTrack | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [microphoneOn, setMicrophoneOn] = useState(true);

  const requestCall = async (mode: "voice" | "video") => {
    if (!session?.access_token) return;
    try {
      const response = await fetch("/api/agora-token", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ partnerId, mode }) });
      const payload = await response.json() as { error?: string; appId?: string; channelName?: string; token?: string; uid?: number };
      if (!response.ok || !payload.appId || !payload.channelName || !payload.token || !payload.uid) throw new Error(payload.error ?? "Could not start call");
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;
      client.on("user-published", async (user, mediaType) => { await client.subscribe(user, mediaType); if (mediaType === "audio") user.audioTrack?.play(); if (mediaType === "video") user.videoTrack?.play(); });
      await client.join(payload.appId, payload.channelName, payload.token, payload.uid);
      audioRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish(audioRef.current);
      if (mode === "video") { videoRef.current = await AgoraRTC.createCameraVideoTrack(); await client.publish(videoRef.current); }
      setConnected(true);
      setRequestedMode(mode);
    } catch (error) { console.error("Agora call failed", error); setRequestedMode(null); }
  };

  const leaveCall = async () => { audioRef.current?.close(); videoRef.current?.close(); if (clientRef.current) await clientRef.current.leave(); clientRef.current = null; setConnected(false); setRequestedMode(null); };
  useEffect(() => () => { void leaveCall(); }, []);

  return (
    <div className="border-b border-border bg-secondary/40 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Collaborate with {partnerName}</p>
          <p className="text-xs text-muted-foreground">
            {isBrandWorkspace ? "Represent your brand with a clear, professional workspace." : "Pitch ideas and improve everyday experiences together."}
          </p>
        </div>
        {!requestedMode ? (
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => requestCall("voice")}>
              <Phone data-icon="inline-start" /> Voice call
            </Button>
            <Button type="button" size="sm" onClick={() => requestCall("video")}>
              <Video data-icon="inline-start" /> Video call
            </Button>
          </div>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={() => setRequestedMode(null)}>
            <X data-icon="inline-start" /> Cancel request
          </Button>
        )}
      </div>
      {requestedMode && (
        <div className="mt-3 rounded-xl border border-stash/20 bg-background p-3 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-stash" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{requestedMode === "video" ? "Video" : "Voice"} calling is being prepared</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Agora is connected with short-lived server tokens. Recording is off by default; only invited participants can join, and your microphone or camera is used only after you start a call.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {connected && <Button type="button" size="sm" variant="destructive" onClick={() => void leaveCall()}><Phone data-icon="inline-start" /> Leave call</Button>}
                <Button type="button" size="sm" variant={microphoneOn ? "secondary" : "outline"} onClick={() => setMicrophoneOn((value) => !value)}>
                  <Mic data-icon="inline-start" /> {microphoneOn ? "Mic ready" : "Mic off"}
                </Button>
                {requestedMode === "video" && (
                  <Button type="button" size="sm" variant={cameraOn ? "secondary" : "outline"} onClick={() => setCameraOn((value) => !value)}>
                    {cameraOn ? <Camera data-icon="inline-start" /> : <VideoOff data-icon="inline-start" />} {cameraOn ? "Camera ready" : "Camera off"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
