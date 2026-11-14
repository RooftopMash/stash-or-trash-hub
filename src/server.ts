import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: securityHeaders("text/html; charset=utf-8"),
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const DEV_SW_RECOVERY_SCRIPT = `<script>(function(){try{var s=document.currentScript;if(s&&s.parentNode)s.parentNode.removeChild(s);var h=location.hostname;var isDev=h==='localhost'||h==='127.0.0.1'||h.indexOf('ais-dev-')===0;if(!isDev||!('serviceWorker' in navigator))return;var ctrl=navigator.serviceWorker.controller;Promise.all([navigator.serviceWorker.getRegistrations().then(function(regs){return Promise.all(regs.map(function(r){return r.unregister();}));}),'caches' in window?caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k);}));}):Promise.resolve()]).then(function(){if(ctrl&&!sessionStorage.getItem('__sot_sw_escaped')){sessionStorage.setItem('__sot_sw_escaped','1');location.reload();}else if(!ctrl){sessionStorage.removeItem('__sot_sw_escaped');}}).catch(function(){});}catch(e){}})();</script>`;

function injectDevSwRecoveryIntoHtml(response: Response): Response {
  if (process.env.NODE_ENV === "production") return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") || !response.body) return response;

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let injected = false;
  let buffer = "";

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      if (injected) {
        controller.enqueue(chunk);
        return;
      }
      buffer += decoder.decode(chunk, { stream: true });
      const headMatch = /<head(?:\s[^>]*)?>/i.exec(buffer);
      if (headMatch) {
        const insertAt = headMatch.index + headMatch[0].length;
        const out = buffer.slice(0, insertAt) + DEV_SW_RECOVERY_SCRIPT + buffer.slice(insertAt);
        injected = true;
        buffer = "";
        controller.enqueue(encoder.encode(out));
      } else if (buffer.length > 8192) {
        injected = true;
        controller.enqueue(encoder.encode(buffer));
        buffer = "";
      }
    },
    flush(controller) {
      if (buffer.length > 0) {
        controller.enqueue(encoder.encode(buffer));
        buffer = "";
      }
    },
  });

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(response.body.pipeThrough(transform), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function securityHeaders(contentType?: string): HeadersInit {
  return {
    ...(contentType ? { "content-type": contentType } : {}),
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(self), microphone=(self), geolocation=(self)",
    "strict-transport-security": "max-age=63072000",
  };
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders())) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withSecurityHeaders(injectDevSwRecoveryIntoHtml(normalized));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: securityHeaders("text/html; charset=utf-8"),
      });
    }
  },
};
