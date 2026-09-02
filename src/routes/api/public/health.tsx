import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getHealth = createServerFn({ method: "GET" }).handler(async () => {
  return {
    status: "ok",
    service: "SOT Enterprise Edition",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };
});

export const Route = createFileRoute("/api/public/health")({
  component: function HealthPage() {
    return (
      <div className="p-4 font-mono text-xs">
        SOT Health Endpoint Active
      </div>
    );
  },
});
