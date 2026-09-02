import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { verifyHMACSignature } from "@/lib/webhooks";

export const getWebhookInfo = createServerFn({ method: "GET" }).handler(async () => {
  return {
    endpoint: "/api/public/webhooks",
    description: "SOT Inbound Webhook Integration Endpoint",
    supported_events: ["new_post", "crisis_alert", "new_response"],
    signature_header: "x-sot-signature",
  };
});

export const handleInboundWebhook = createServerFn({ method: "POST" })
  .validator((data: { payload: string; signature?: string; secret?: string }) => data)
  .handler(async ({ data }) => {
    const { payload, signature, secret } = data;

    if (secret && signature) {
      const isValid = await verifyHMACSignature(payload, signature, secret);
      if (!isValid) {
        return { error: "Invalid HMAC signature", success: false };
      }
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(payload);
    } catch {
      parsed = { raw: payload };
    }

    return {
      received: true,
      verified: !!(secret && signature),
      event: parsed.event || "custom_inbound",
      timestamp: new Date().toISOString(),
    };
  });

export const Route = createFileRoute("/api/public/webhooks")({
  component: function WebhooksPage() {
    return (
      <div className="p-4 font-mono text-xs">
        SOT Inbound Webhooks Endpoint Active
      </div>
    );
  },
});
