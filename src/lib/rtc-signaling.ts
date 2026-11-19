import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type RtcSignalMessage = {
  type:
    | "ready"
    | "join"
    | "offer"
    | "answer"
    | "candidate"
    | "call-declined"
    | "call-ended"
    | "chat"
    | "reaction";
  sender: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  reason?: string;
  message?: {
    id?: string;
    sender: string;
    text: string;
    time: string;
  };
  emoji?: string;
  sentAt?: number;
};

export type RtcNetworkQuality = {
  label: "HD" | "Good" | "Fair" | "Weak" | "Connecting";
  rttMs: number | null;
  kbps: number | null;
};

export const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
];

export function sanitizeRoomChannel(raw: string): string {
  return (raw || "sot-live-room").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 63) || "sot-live-room";
}

export function createStablePeerId(userId?: string | null): string {
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${userId || "sot-peer"}-${randomSuffix}`;
}

/**
 * Dual-transport signaling bridge (Supabase Realtime + BroadcastChannel) that stays
 * backwards-compatible across both `"webrtc-signal"` and `"signal"` event names.
 */
export function attachUnifiedRtcSignaling(options: {
  roomChannel: string;
  peerId: string;
  onSignal: (msg: RtcSignalMessage) => void | Promise<void>;
  onSubscribed?: () => void;
}) {
  const room = sanitizeRoomChannel(options.roomChannel);
  let bc: BroadcastChannel | null = null;
  let closed = false;
  const seenIds = new Set<string>();

  const dispatchIfNew = (raw: unknown) => {
    if (closed || !raw || typeof raw !== "object") return;
    const msg = raw as RtcSignalMessage & { _mid?: string };
    if (!msg.type || msg.sender === options.peerId) return;
    if (msg._mid) {
      if (seenIds.has(msg._mid)) return;
      seenIds.add(msg._mid);
      if (seenIds.size > 200) {
        const first = seenIds.values().next().value;
        if (first) seenIds.delete(first);
      }
    }
    void options.onSignal(msg);
  };

  if (typeof BroadcastChannel !== "undefined") {
    try {
      bc = new BroadcastChannel(`sot-rtc-${room}`);
      bc.onmessage = (ev) => dispatchIfNew(ev.data);
    } catch {
      bc = null;
    }
  }

  const supaChan: RealtimeChannel = supabase
    .channel(`sot-rtc-${room}`)
    .on("broadcast", { event: "webrtc-signal" }, ({ payload }) => dispatchIfNew(payload))
    .on("broadcast", { event: "signal" }, ({ payload }) => dispatchIfNew(payload))
    .subscribe((status) => {
      if (!closed && status === "SUBSCRIBED") {
        options.onSubscribed?.();
      }
    });

  const emit = (payload: Omit<RtcSignalMessage, "sender" | "sentAt">) => {
    if (closed) return;
    const envelope = {
      ...payload,
      sender: options.peerId,
      sentAt: Date.now(),
      _mid: `${options.peerId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    try {
      bc?.postMessage(envelope);
    } catch {
      // ignore closed BC
    }
    void supaChan.send({
      type: "broadcast",
      event: "webrtc-signal",
      payload: envelope,
    });
    // Also emit legacy event name for any peer tab still running older cached bundles
    void supaChan.send({
      type: "broadcast",
      event: "signal",
      payload: envelope,
    });
  };

  const cleanup = () => {
    if (closed) return;
    closed = true;
    try {
      bc?.close();
    } catch {
      // ignore
    }
    bc = null;
    void supabase.removeChannel(supaChan);
  };

  return { emit, cleanup };
}

/**
 * WebRTC polite-peer glare controller to prevent offer collisions when both peers
 * subscribe at the exact same millisecond.
 */
export function createPoliteWebRtcController(options: {
  pc: RTCPeerConnection;
  peerId: string;
  emit: (payload: Omit<RtcSignalMessage, "sender" | "sentAt">) => void;
  onRemoteJoined?: () => void;
  onCallDeclined?: (reason?: string) => void;
  onCallEnded?: () => void;
  onChatMessage?: (msg: NonNullable<RtcSignalMessage["message"]>) => void;
  onReaction?: (emoji: string, sender: string) => void;
}) {
  let makingOffer = false;
  let ignoreOffer = false;
  let remotePeerId: string | null = null;
  let queuedCandidates: RTCIceCandidateInit[] = [];

  const isPoliteFor = (otherSender: string) => options.peerId.localeCompare(otherSender) > 0;

  const sendOffer = async () => {
    if (makingOffer || options.pc.signalingState === "closed") return;
    try {
      makingOffer = true;
      await options.pc.setLocalDescription();
      if (options.pc.localDescription) {
        options.emit({
          type: "offer",
          sdp: options.pc.localDescription.toJSON(),
        });
      }
    } catch {
      // ignore transient state errors during renegotiation
    } finally {
      makingOffer = false;
    }
  };

  const flushCandidates = async () => {
    if (!options.pc.remoteDescription || queuedCandidates.length === 0) return;
    const pending = [...queuedCandidates];
    queuedCandidates = [];
    for (const candidate of pending) {
      try {
        await options.pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        // ignore stale ICE candidates
      }
    }
  };

  const handleSignal = async (msg: RtcSignalMessage) => {
    if (options.pc.signalingState === "closed") return;
    if (msg.type === "call-declined") {
      options.onCallDeclined?.(msg.reason);
      return;
    }
    if (msg.type === "call-ended") {
      options.onCallEnded?.();
      return;
    }
    if (msg.type === "chat" && msg.message) {
      options.onChatMessage?.(msg.message);
      return;
    }
    if (msg.type === "reaction" && msg.emoji) {
      options.onReaction?.(msg.emoji, msg.sender);
      return;
    }

    if (msg.type === "ready" || msg.type === "join") {
      remotePeerId = msg.sender;
      // Deterministically only one peer initiates immediately so glare stays minimal
      if (!isPoliteFor(msg.sender) || options.pc.signalingState === "stable") {
        await sendOffer();
      }
      return;
    }

    if (msg.type === "offer" && msg.sdp) {
      remotePeerId = msg.sender;
      const polite = isPoliteFor(msg.sender);
      const offerCollision = makingOffer || options.pc.signalingState !== "stable";
      ignoreOffer = !polite && offerCollision;
      if (ignoreOffer) return;

      await options.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      await flushCandidates();
      await options.pc.setLocalDescription();
      if (options.pc.localDescription) {
        options.emit({
          type: "answer",
          sdp: options.pc.localDescription.toJSON(),
        });
      }
      options.onRemoteJoined?.();
      return;
    }

    if (msg.type === "answer" && msg.sdp) {
      remotePeerId = msg.sender;
      if (options.pc.signalingState === "have-local-offer") {
        await options.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        await flushCandidates();
        options.onRemoteJoined?.();
      }
      return;
    }

    if (msg.type === "candidate" && msg.candidate) {
      if (!options.pc.remoteDescription) {
        queuedCandidates.push(msg.candidate);
        return;
      }
      try {
        await options.pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
      } catch {
        if (!ignoreOffer) {
          // non-fatal ICE mismatch
        }
      }
    }
  };

  return {
    sendOffer,
    handleSignal,
    getRemotePeerId: () => remotePeerId,
  };
}

/**
 * Sample WebRTC connection health telemetry (RTT latency & active bitrate).
 */
export async function samplePeerConnectionQuality(
  pc: RTCPeerConnection | null,
  prevBytesSent?: number,
  elapsedSec = 2,
): Promise<{ quality: RtcNetworkQuality; bytesSent: number }> {
  if (!pc || pc.connectionState === "closed") {
    return { quality: { label: "Connecting", rttMs: null, kbps: null }, bytesSent: prevBytesSent ?? 0 };
  }
  try {
    const stats = await pc.getStats();
    let rttMs: number | null = null;
    let totalBytesSent = 0;

    stats.forEach((report) => {
      if (report.type === "candidate-pair" && report.state === "succeeded" && report.nominated) {
        if (typeof report.currentRoundTripTime === "number") {
          rttMs = Math.round(report.currentRoundTripTime * 1000);
        }
      }
      if (report.type === "outbound-rtp" && typeof report.bytesSent === "number") {
        totalBytesSent += report.bytesSent;
      }
    });

    const kbps =
      typeof prevBytesSent === "number" && totalBytesSent >= prevBytesSent
        ? Math.round(((totalBytesSent - prevBytesSent) * 8) / (Math.max(1, elapsedSec) * 1000))
        : null;

    let label: RtcNetworkQuality["label"] = "Connecting";
    if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
      if (rttMs === null || rttMs < 110) label = "HD";
      else if (rttMs < 240) label = "Good";
      else if (rttMs < 420) label = "Fair";
      else label = "Weak";
    }

    return { quality: { label, rttMs, kbps }, bytesSent: totalBytesSent };
  } catch {
    return { quality: { label: "Good", rttMs: null, kbps: null }, bytesSent: prevBytesSent ?? 0 };
  }
}

/**
 * Synthesized soft dual-tone telephone ringtone using Web Audio API.
 * Cleanly stops and closes AudioContext when answered, declined, or unmounted.
 */
export function startIncomingRingtone(): () => void {
  if (typeof window === "undefined") return () => {};
  const AudioCtx =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return () => {};

  let ctx: AudioContext | null = null;
  let timer: number | null = null;
  let stopped = false;

  const playBurst = () => {
    if (stopped) return;
    try {
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.04);
      gain.gain.setValueAtTime(0.045, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      gain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);
      osc1.connect(gain);
      osc2.connect(gain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.46);
      osc2.stop(now + 0.46);
    } catch {
      // Browser autoplay restriction before user gesture — harmless no-op
    }
  };

  playBurst();
  timer = window.setInterval(playBurst, 2400);

  return () => {
    stopped = true;
    if (timer !== null) window.clearInterval(timer);
    if (ctx) {
      void ctx.close().catch(() => {});
      ctx = null;
    }
  };
}

/**
 * Broadcast a call-declined or call-ended signal onto both global ring channel
 * and the room RTC channel so the remote caller immediately stops ringing.
 */
export function broadcastCallStatus(options: {
  roomChannel: string;
  senderId: string;
  type: "call-declined" | "call-ended";
  reason?: string;
}) {
  const room = sanitizeRoomChannel(options.roomChannel);
  const payload = {
    type: options.type,
    sender: options.senderId,
    roomChannel: room,
    reason: options.reason,
    sentAt: Date.now(),
  };

  if (typeof BroadcastChannel !== "undefined") {
    try {
      const rtcBc = new BroadcastChannel(`sot-rtc-${room}`);
      rtcBc.postMessage(payload);
      rtcBc.close();
      const ringBc = new BroadcastChannel("sot-call-ring-status");
      ringBc.postMessage(payload);
      ringBc.close();
    } catch {
      // ignore
    }
  }

  const rtcChan = supabase.channel(`sot-rtc-${room}`);
  rtcChan.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      void rtcChan.send({ type: "broadcast", event: "webrtc-signal", payload });
      void rtcChan.send({ type: "broadcast", event: "signal", payload });
      window.setTimeout(() => void supabase.removeChannel(rtcChan), 600);
    }
  });
}
