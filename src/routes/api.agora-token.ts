import { createFileRoute } from "@tanstack/react-router";
import agoraToken from "agora-token";

const { RtcRole, RtcTokenBuilder } = agoraToken;
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
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.partnerId)) {
          return Response.json({ error: "Invalid participant" }, { status: 400 });
        }
        if (body.partnerId === user.id) return Response.json({ error: "Cannot call yourself" }, { status: 400 });

        const { data: relationship, error: relationshipError } = await supabase
          .from("messages")
          .select("id")
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${body.partnerId}),and(sender_id.eq.${body.partnerId},recipient_id.eq.${user.id})`)
          .limit(1)
          .maybeSingle();
        if (relationshipError || !relationship) return Response.json({ error: "Call access requires an existing conversation" }, { status: 403 });

        const ids = [user.id, body.partnerId].sort();
        const channelName = `sot-${ids.join("-")}`.slice(0, 63);
        const uid = Math.floor(Math.random() * 2_000_000_000) + 1;
        const tokenExpiration = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
        const rtcToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.PUBLISHER, tokenExpiration, tokenExpiration);

        return Response.json({ appId, channelName, uid, token: rtcToken, expiresAt: tokenExpiration, mode: body.mode, recording: false }, {
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
