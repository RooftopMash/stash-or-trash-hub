"use client";

import { useState } from "react";
import { Camera, Mic, Phone, ShieldCheck, Video, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LiveCollaborationPanelProps = {
  partnerName: string;
  isBrandWorkspace: boolean;
};

export function LiveCollaborationPanel({ partnerName, isBrandWorkspace }: LiveCollaborationPanelProps) {
  const [requestedMode, setRequestedMode] = useState<"voice" | "video" | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [microphoneOn, setMicrophoneOn] = useState(true);

  const requestCall = (mode: "voice" | "video") => setRequestedMode(mode);

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
                LiveKit is not connected to this project yet. Calls will only start after secure room tokens, participant permissions, consent, and moderation controls are configured. No microphone or camera is accessed by this preview.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
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
