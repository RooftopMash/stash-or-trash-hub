import { createFileRoute } from "@tanstack/react-router";

interface DnsQueryAnswer {
  name?: string;
  type?: number;
  TTL?: number;
  data?: string;
}

interface DnsJsonResponse {
  Status?: number;
  Answer?: DnsQueryAnswer[];
}

async function queryDohTxt(domain: string, provider: "cloudflare" | "google"): Promise<string[]> {
  const endpoint =
    provider === "cloudflare"
      ? `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=TXT`
      : `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=TXT`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const res = await fetch(endpoint, {
      headers: { Accept: "application/dns-json" },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as DnsJsonResponse;
    if (!Array.isArray(data.Answer)) return [];
    return data.Answer.map((a) => String(a.data || "").replace(/^"|"$/g, "").trim()).filter(Boolean);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export const Route = createFileRoute("/api/verify-domain-dns")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            domain?: string;
            expectedToken?: string;
          };

          const cleanDomain = String(body.domain || "")
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0];
          const expectedToken = String(body.expectedToken || "").trim();

          if (!cleanDomain || !cleanDomain.includes(".") || !expectedToken) {
            return new Response(
              JSON.stringify({
                verified: false,
                error: "Both a valid corporate domain and expected DNS TXT verification token are required.",
                recordsFound: [],
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const [cfRoot, googleRoot, cfSub] = await Promise.all([
            queryDohTxt(cleanDomain, "cloudflare"),
            queryDohTxt(cleanDomain, "google"),
            queryDohTxt(`_sot-verify.${cleanDomain}`, "cloudflare"),
          ]);

          const recordsFound = Array.from(new Set([...cfRoot, ...googleRoot, ...cfSub]));
          const matched = recordsFound.some(
            (txt) => txt.includes(expectedToken) || txt.includes(`sot-domain-verify=${expectedToken}`),
          );

          return new Response(
            JSON.stringify({
              verified: matched,
              domain: cleanDomain,
              expectedRecordHost: `_sot-verify.${cleanDomain} (or apex ${cleanDomain})`,
              expectedRecordValue: `sot-domain-verify=${expectedToken}`,
              recordsFoundCount: recordsFound.length,
              recordsFound: recordsFound.slice(0, 10),
              checkedAt: new Date().toISOString(),
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err) {
          return new Response(
            JSON.stringify({
              verified: false,
              error: err instanceof Error ? err.message : "DNS TXT lookup failed.",
              recordsFound: [],
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
