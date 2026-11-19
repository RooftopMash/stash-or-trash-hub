import { createFileRoute } from "@tanstack/react-router";

interface B2BCheckoutRequestBody {
  brandName?: string;
  planId?: string;
  planName?: string;
  paymentMethod?: "google_pay" | "paystack_eft" | "stripe_card" | "corporate_invoice";
  currency?: "ZAR" | "USD";
  amount?: number;
  billingEmail?: string;
  companyRegName?: string;
  vatNumber?: string;
  origin?: string;
}

export const Route = (createFileRoute("/api/b2b-checkout") as any)({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json().catch(() => null)) as B2BCheckoutRequestBody | null;

        if (!body || !body.planId || typeof body.amount !== "number" || body.amount <= 0) {
          return Response.json(
            { error: "Valid planId and positive subscription amount are required." },
            { status: 400, headers: { "cache-control": "no-store" } },
          );
        }

        const brandName = (body.brandName || "Verified Brand").trim();
        const planId = body.planId.trim();
        const planName = (body.planName || planId).trim();
        const paymentMethod = body.paymentMethod || "corporate_invoice";
        const currency = body.currency === "USD" ? "USD" : "ZAR";
        const amount = Math.round(body.amount);
        const billingEmail = (body.billingEmail || "finance@brand-executive.co.za").trim();
        const companyRegName = (body.companyRegName || `${brandName} (Pty) Ltd`).trim();
        const vatNumber = (body.vatNumber || "").trim();
        const referenceCode = `SOT-B2B-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`;
        const origin =
          typeof body.origin === "string" && body.origin.startsWith("http")
            ? body.origin.replace(/\/$/, "")
            : "";

        if (paymentMethod === "corporate_invoice") {
          return Response.json(
            {
              mode: "pro_forma_invoice",
              gateway: "corporate_invoice",
              status: "pro_forma_issued",
              referenceCode,
              message: "Corporate Pro-Forma Tax Invoice generated.",
            },
            { headers: { "cache-control": "no-store" } },
          );
        }

        if (paymentMethod === "paystack_eft") {
          const paystackKey = process.env.PAYSTACK_SECRET_KEY?.trim();
          if (paystackKey) {
            try {
              const res = await fetch("https://api.paystack.co/transaction/initialize", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${paystackKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: billingEmail,
                  amount: amount * 100,
                  currency,
                  reference: referenceCode,
                  ...(origin ? { callback_url: `${origin}/dashboard?billing_ref=${referenceCode}` } : {}),
                  metadata: {
                    brandName,
                    planId,
                    planName,
                    companyRegName,
                    vatNumber,
                  },
                }),
              });
              const data = (await res.json().catch(() => null)) as {
                status?: boolean;
                message?: string;
                data?: { authorization_url?: string; reference?: string };
              } | null;

              if (!res.ok || !data?.status || !data.data?.authorization_url) {
                return Response.json(
                  {
                    error:
                      data?.message ||
                      "Paystack checkout initialization rejected the transaction request.",
                  },
                  { status: 502, headers: { "cache-control": "no-store" } },
                );
              }

              return Response.json(
                {
                  mode: "live_gateway",
                  gateway: "paystack",
                  status: "redirect_required",
                  authorizationUrl: data.data.authorization_url,
                  referenceCode: data.data.reference || referenceCode,
                },
                { headers: { "cache-control": "no-store" } },
              );
            } catch (err) {
              console.error("[api.b2b-checkout] Paystack initialization error:", err);
              return Response.json(
                { error: "Unable to reach Paystack gateway. Please retry or use Corporate Invoice." },
                { status: 502, headers: { "cache-control": "no-store" } },
              );
            }
          }
        }

        if (paymentMethod === "stripe_card") {
          const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
          if (stripeKey) {
            try {
              const params = new URLSearchParams();
              params.set("mode", "payment");
              params.set("customer_email", billingEmail);
              params.set("client_reference_id", referenceCode);
              params.set(
                "success_url",
                origin
                  ? `${origin}/dashboard?billing_ref=${referenceCode}&status=success`
                  : "https://stashortrash.com/dashboard",
              );
              params.set(
                "cancel_url",
                origin ? `${origin}/dashboard?billing_cancelled=1` : "https://stashortrash.com/dashboard",
              );
              params.set("line_items[0][quantity]", "1");
              params.set("line_items[0][price_data][currency]", currency.toLowerCase());
              params.set("line_items[0][price_data][unit_amount]", String(amount * 100));
              params.set(
                "line_items[0][price_data][product_data][name]",
                `SOT B2B · ${planName} (${brandName})`,
              );

              const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${stripeKey}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
              });

              const data = (await res.json().catch(() => null)) as {
                url?: string;
                id?: string;
                error?: { message?: string };
              } | null;

              if (!res.ok || !data?.url) {
                return Response.json(
                  {
                    error:
                      data?.error?.message ||
                      "Stripe checkout initialization rejected the transaction request.",
                  },
                  { status: 502, headers: { "cache-control": "no-store" } },
                );
              }

              return Response.json(
                {
                  mode: "live_gateway",
                  gateway: "stripe",
                  status: "redirect_required",
                  checkoutUrl: data.url,
                  referenceCode: data.id || referenceCode,
                },
                { headers: { "cache-control": "no-store" } },
              );
            } catch (err) {
              console.error("[api.b2b-checkout] Stripe initialization error:", err);
              return Response.json(
                { error: "Unable to reach Stripe gateway. Please retry or use Corporate Invoice." },
                { status: 502, headers: { "cache-control": "no-store" } },
              );
            }
          }
        }

        // Transparent sandbox pro-forma preview when PAYSTACK_SECRET_KEY / STRIPE_SECRET_KEY are absent
        return Response.json(
          {
            mode: "sandbox_preview",
            gateway: paymentMethod,
            status: "pro_forma_issued",
            referenceCode,
            message:
              "Live merchant keys (PAYSTACK_SECRET_KEY / STRIPE_SECRET_KEY) are not configured on host; issued sandbox pro-forma preview instead of live settlement.",
          },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
