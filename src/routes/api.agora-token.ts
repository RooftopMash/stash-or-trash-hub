import { createFileRoute } from "@tanstack/react-router";
import agoraToken from "agora-token";

const { RtcRole, RtcTokenBuilder } = agoraToken;

const TOKEN_TTL_SECONDS = 10 * 60;

const GOOGLE_STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
];

function buildIceServers(): { iceServers: RTCIceServer[]; turnConfigured: boolean } {
  const turnUrl = process.env.TURN_URL?.trim();
  const turnUsername = process.env.TURN_USERNAME?.trim();
  const turnCredential = process.env.TURN_CREDENTIAL?.trim();

  if (turnUrl) {
    const turnEntry: RTCIceServer = {
      urls: turnUrl.split(",").map((u) => u.trim()).filter(Boolean),
      ...(turnUsername ? { username: turnUsername } : {}),
      ...(turnCredential ? { credential: turnCredential } : {}),
    };
    return {
      iceServers: [...GOOGLE_STUN_SERVERS, turnEntry],
      turnConfigured: true,
    };
  }

  return {
    iceServers: GOOGLE_STUN_SERVERS,
    turnConfigured: false,
  };
}

function stableNumericUid(seed?: string, explicitUid?: number): number {
  if (typeof explicitUid === "number" && Number.isFinite(explicitUid) && explicitUid > 0) {
    return Math.floor(explicitUid) % 2_000_000_000;
  }
  if (seed) {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const positive = (hash >>> 0) % 1_900_000_000;
    return positive + 1;
  }
  return Math.floor(Math.random() * 1_900_000_000) + 1;
}

export const Route = (createFileRoute("/api/agora-token") as any)({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json().catch(() => null)) as {
          partnerId?: string;
          channelName?: string;
          mode?: "voice" | "video" | "broadcast";
          callerId?: string;
          uid?: number;
          role?: "publisher" | "subscriber";
        } | null;

        const mode =
          body?.mode === "voice" || body?.mode === "video" || body?.mode === "broadcast"
            ? body.mode
            : "video";
        const partnerId = (body?.partnerId || "community-room").trim();
        const callerId = (body?.callerId || "sot-client").trim();

        const ids = [callerId, partnerId].sort();
        const rawChannel = body?.channelName?.trim() || `sot-${ids.join("-")}`;
        const channelName =
          rawChannel.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 63) || "sot-live-room";
        const uid = stableNumericUid(
          body?.callerId ? `${body.callerId}-${Date.now() % 1000}` : undefined,
          body?.uid,
        );
        const tokenExpiration = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
        const rtcRole = body?.role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

        const appId = process.env.AGORA_APP_ID?.trim();
        const appCertificate = process.env.AGORA_APP_CERTIFICATE?.trim();
        const { iceServers, turnConfigured } = buildIceServers();

        // Issue an Agora RTC token when AGORA_APP_ID & AGORA_APP_CERTIFICATE are configured
        if (appId && appCertificate) {
          try {
            const rtcToken = RtcTokenBuilder.buildTokenWithUid(
              appId,
              appCertificate,
              channelName,
              uid,
              rtcRole,
              tokenExpiration,
              tokenExpiration,
            );

            return Response.json(
              {
                provider: "agora",
                appId,
                channelName,
                uid,
                token: rtcToken,
                iceServers,
                turnConfigured,
                expiresAt: tokenExpiration,
                mode,
                recording: false,
              },
              { headers: { "cache-control": "no-store" } },
            );
          } catch (err) {
            console.warn("Agora token build failed, falling back to Google WebRTC:", err);
          }
        }

        // Google WebRTC (STUN + optional TURN relay + Realtime Signaling) Engine
        return Response.json(
          {
            provider: "google-webrtc",
            appId: appId || null,
            channelName,
            uid,
            token: null,
            iceServers,
            turnConfigured,
            expiresAt: tokenExpiration,
            mode,
            recording: false,
          },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
