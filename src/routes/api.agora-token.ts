import { createFileRoute } from "@tanstack/react-router";
import { RtcRole, RtcTokenBuilder } from "agora-token";
import { createClient } from "@supabase/supabase-js";

const TOKEN_TTL_SECONDS = 10 * 60;

export const Route = createFileRoute("/api/agora-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authorization = request.headers.get("authorization");
        const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
        if (!token) return Response.json({ error: "Authentication required" }, { status: 401 });

        const appId = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
        if (!appId || !appCertificate || !supabaseUrl || !supabaseKey) {
          return Response.json({ error: "Calling service is not configured" }, { status: 503 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) return Response.json({ error: "Invalid session" }, { status: 401 });

        const body = await request.json().catch(() => null) as { partnerId?: string; mode?: "voice" | "video" } | null;
        if (!body?.partnerId || (body.mode !== "voice" && body.mode !== "video")) {
          return Response.json({ error: "partnerId and mode are required" }, { status: 400 });
        }
        if (body.partnerId === user.id) return Response.json({ error: "Cannot call yourself" }, { status: 400 });

        const ids = [user.id, body.partnerId].sort();
        const channelName = `sot-${ids.join("-")}`.slice(0, 63);
        const uid = Math.floor(Math.random() * 2_000_000_000) + 1;
        const tokenExpiration = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
        const rtcToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.PUBLISHER, tokenExpiration, tokenExpiration);

        return Response.json({ appId, channelName, uid, token: rtcToken, expiresAt: tokenExpiration, mode: body.mode }, {
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
