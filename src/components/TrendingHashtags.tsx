import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrendingHashtags } from "@/lib/social";

export function TrendingHashtags() {
  const { t } = useTranslation();

  const { data: hashtags, isLoading } = useQuery({
    queryKey: ["trending-hashtags"],
    queryFn: () => getTrendingHashtags(10),
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-full rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="font-display font-bold text-lg flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-stash" /> Trending
      </h2>
      <div className="space-y-2">
        {hashtags && hashtags.length > 0 ? (
          hashtags.map((tag: any) => (
            <Link
              key={tag.id}
              to="/hashtags/$tag"
              params={{ tag: tag.tag }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors group"
            >
              <div>
                <p className="font-semibold text-sm group-hover:text-primary">
                  #{tag.tag}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tag.use_count} posts
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{tag.use_count.toLocaleString()}</span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No trending hashtags yet
          </p>
        )}
      </div>
    </div>
  );
}
