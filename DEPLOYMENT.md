# SOT Production Deployment Guide

## Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Lovable Auth
VITE_LOVABLE_APP_ID=your-app-id
VITE_LOVABLE_PUBLIC_KEY=your-public-key

# Analytics & Monitoring
VITE_SENTRY_DSN=https://...
VITE_ANALYTICS_ID=G-...

# Webhooks
WEBHOOK_SECRET=your-secret

# Email (optional)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

## Deployment (Vercel)

```bash
# Install dependencies
bun install

# Build
bun run build

# Deploy
vercel deploy --prod
```

## Database Migrations (Supabase)

```bash
# Generate migrations from schema
drizzle-kit generate:pg

# Apply migrations
drizzle-kit migrate:pg
```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] CDN cache configured (Vercel Edge)
- [ ] Service Worker deployed
- [ ] Health check endpoint responding
- [ ] Analytics dashboard accessible
- [ ] Webhook endpoints registered
- [ ] SSL certificate valid
- [ ] Error tracking (Sentry) enabled

## Performance Targets

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 600ms
- **JavaScript Bundle Size**: < 200KB (gzipped)

## Monitoring

- Sentry: Error tracking
- Vercel Analytics: Performance monitoring
- Supabase Dashboard: Database metrics
- Custom Health: `/api/health` endpoint

## Scaling

- Database: Supabase auto-scaling (PostgreSQL connection pooling)
- API: Vercel serverless auto-scaling
- CDN: Vercel Edge Network (80+ regions)
- Real-time: Supabase Realtime (WebSocket)

## Backup & Recovery

- Daily Supabase backups (configurable retention)
- GitHub repository as code backup
- Weekly manual export of critical analytics
