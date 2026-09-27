import { createFileRoute } from "@tanstack/react-router";
import agoraToken from "agora-token";

const { RtcRole, RtcTokenBuilder } = agoraToken;

const TOKEN_TTL_SECONDS = 10 * 60;

const GOOGLE_ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
];

export const Route = createFileRoute("/api/agora-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as {
          partnerId?: string;
          channelName?: string;
          mode?: "voice" | "video" | "broadcast";
          callerId?: string;
        } | null;

        const mode = body?.mode === "voice" || body?.mode === "video" || body?.mode === "broadcast"
          ? body.mode
          : "video";
        const partnerId = (body?.partnerId || "community-room").trim();
        const callerId = (body?.callerId || "sot-client").trim();

        const ids = [callerId, partnerId].sort();
        const rawChannel = body?.channelName?.trim() || `sot-${ids.join("-")}`;
        const channelName = rawChannel.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 63) || "sot-live-room";
        const uid = Math.floor(Math.random() * 2_000_000_000) + 1;
        const tokenExpiration = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

        const appId = process.env.AGORA_APP_ID?.trim();
        const appCertificate = process.env.AGORA_APP_CERTIFICATE?.trim();

        // If Agora credentials are configured, issue an official Agora RTC token + Google STUN backup
        if (appId && appCertificate) {
          try {
            const rtcToken = RtcTokenBuilder.buildTokenWithUid(
              appId,
              appCertificate,
              channelName,
              uid,
              RtcRole.PUBLISHER,
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
                iceServers: GOOGLE_ICE_SERVERS,
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

        // Google WebRTC (STUN + P2P Signaling) Engine — works anywhere with zero third-party secret failures
        return Response.json(
          {
            provider: "google-webrtc",
            appId: appId || null,
            channelName,
            uid,
            token: null,
            iceServers: GOOGLE_ICE_SERVERS,
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

