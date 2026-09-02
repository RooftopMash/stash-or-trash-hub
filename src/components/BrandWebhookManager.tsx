import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBrandWebhooks,
  createBrandWebhook,
  deleteBrandWebhook,
  toggleBrandWebhook,
  type BrandWebhook,
} from "@/lib/webhooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Webhook, Plus, Trash2, Copy, Key, Check } from "lucide-react";
import { toast } from "sonner";

export function BrandWebhookManager({
  brandId,
  brandName,
}: {
  brandId: string;
  brandName: string;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

  const [events, setEvents] = useState({
    new_post: true,
    crisis_alert: true,
    new_response: true,
  });

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["brand-webhooks", brandId],
    queryFn: () => fetchBrandWebhooks(brandId),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const selectedEvents = Object.entries(events)
        .filter(([, selected]) => selected)
        .map(([evt]) => evt);
      if (selectedEvents.length === 0) throw new Error("Select at least one event.");
      return createBrandWebhook(brandId, url, selectedEvents);
    },
    onSuccess: () => {
      toast.success("Webhook endpoint created!");
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["brand-webhooks", brandId] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to create webhook.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (webhookId: string) => deleteBrandWebhook(webhookId),
    onSuccess: () => {
      toast.success("Webhook endpoint deleted.");
      queryClient.invalidateQueries({ queryKey: ["brand-webhooks", brandId] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleBrandWebhook(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-webhooks", brandId] });
    },
  });

  const copyToClipboard = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(secret);
    toast.success("Secret key copied to clipboard!");
    setTimeout(() => setCopiedSecret(null), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Webhook className="h-4 w-4" /> Webhooks
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Webhook className="h-5 w-5 text-primary" /> {brandName} Webhooks
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Add Webhook Form */}
          <div className="rounded-xl bg-secondary/50 p-3.5 space-y-3 border border-border/50">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <Plus className="h-4 w-4 text-primary" /> Add Webhook Endpoint
            </span>

            <Input
              type="url"
              placeholder="https://api.yourcompany.com/sot-webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-xs h-9"
            />

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Trigger Events
              </span>
              <div className="flex flex-wrap gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={events.new_post}
                    onCheckedChange={(checked) =>
                      setEvents((prev) => ({ ...prev, new_post: !!checked }))
                    }
                  />
                  <span>New Post</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={events.crisis_alert}
                    onCheckedChange={(checked) =>
                      setEvents((prev) => ({ ...prev, crisis_alert: !!checked }))
                    }
                  />
                  <span>Crisis Alert</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={events.new_response}
                    onCheckedChange={(checked) =>
                      setEvents((prev) => ({ ...prev, new_response: !!checked }))
                    }
                  />
                  <span>Brand Response</span>
                </label>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full h-8 text-xs gap-1 mt-2"
              disabled={!url.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              <Plus className="h-3.5 w-3.5" /> Save Endpoint
            </Button>
          </div>

          {/* Existing Webhooks List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <span className="text-xs font-medium text-muted-foreground">
              Configured Webhooks ({(webhooks ?? []).length})
            </span>

            {isLoading ? (
              <p className="text-xs text-muted-foreground py-2">Loading webhooks...</p>
            ) : (webhooks ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 italic">
                No webhooks configured for this brand yet.
              </p>
            ) : (
              (webhooks ?? []).map((wh: BrandWebhook) => (
                <div
                  key={wh.id}
                  className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono font-semibold text-foreground truncate max-w-[240px]">
                      {wh.url}
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={wh.active ? "default" : "secondary"}
                        className="text-[10px] cursor-pointer"
                        onClick={() =>
                          toggleMutation.mutate({ id: wh.id, active: !wh.active })
                        }
                      >
                        {wh.active ? "Active" : "Paused"}
                      </Badge>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-trash"
                        onClick={() => deleteMutation.mutate(wh.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((evt) => (
                        <Badge key={evt} variant="outline" className="text-[9px]">
                          {evt}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(wh.secret)}
                      className="h-6 px-2 text-[10px] gap-1 text-muted-foreground"
                    >
                      {copiedSecret === wh.secret ? (
                        <Check className="h-3 w-3 text-stash" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <Key className="h-3 w-3" /> Secret
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
