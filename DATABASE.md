# SOT Database Schema Documentation

## Overview
SOT is the unified brand-customer platform. This schema supports:
- Multi-social authentication (X, Facebook, Instagram, TikTok, LinkedIn)
- Brand team collaboration with RBAC
- Real-time customer feedback & posts
- Brand response management
- Analytics & sentiment tracking
- Audit logging

## Core Tables

### Users
All platform users (customers, brand representatives, analysts).

```sql
id: UUID
email: TEXT (unique)
displayName: TEXT
avatar: TEXT
bio: TEXT
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

### Social Profiles
Linked social accounts for user verification and influence scoring.

```sql
id: UUID
user_id: UUID (fk → users)
platform: ENUM ('twitter', 'facebook', 'instagram', 'tiktok', 'linkedin')
social_id: TEXT
username: TEXT
profile_url: TEXT
avatar: TEXT
followers: INTEGER
verified: BOOLEAN
influence_score: DECIMAL (0-100)
metadata: JSON (platform-specific data)
linked_at: TIMESTAMP
```

### Brands
Brand profiles tracked in SOT.

```sql
id: UUID
name: TEXT
slug: TEXT (unique)
logo: TEXT
description: TEXT
website: TEXT
category: TEXT
overall_sentiment: ENUM ('positive', 'neutral', 'negative', 'unknown')
sentiment_score: DECIMAL (-100 to +100)
total_posts: INTEGER
total_engagement: INTEGER
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

### Brand Teams
Teams managing a brand's SOT presence.

```sql
id: UUID
brand_id: UUID (fk → brands)
name: TEXT
description: TEXT
createdAt: TIMESTAMP
```

### Team Members
Users assigned to brand teams with role-based access.

```sql
id: UUID
team_id: UUID (fk → brand_teams)
user_id: UUID (fk → users)
role: ENUM ('admin', 'analyst', 'viewer')
added_at: TIMESTAMP
```

### Posts
Customer posts about brands (the core content).

```sql
id: UUID
brand_id: UUID (fk → brands)
author_id: UUID (fk → users)
title: TEXT
content: TEXT (required)
sentiment: ENUM ('positive', 'neutral', 'negative', 'unknown')
category: TEXT ('feedback', 'support', 'complaint', 'praise')
status: ENUM ('published', 'archived', 'flagged')
stash_count: INTEGER
trash_count: INTEGER
comment_count: INTEGER
has_image: BOOLEAN
image_url: TEXT
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

### Votes
Stash (positive) or Trash (negative) votes on posts.

```sql
id: UUID
post_id: UUID (fk → posts)
user_id: UUID (fk → users)
vote_type: TEXT ('stash' | 'trash')
createdAt: TIMESTAMP

UNIQUE(post_id, user_id) // One vote per user per post
```

### Comments
Replies to posts (threaded).

```sql
id: UUID
post_id: UUID (fk → posts)
author_id: UUID (fk → users)
parent_comment_id: UUID (fk → comments, nullable)
content: TEXT
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

### Responses
Brand team responses to customer posts (crisis management).

```sql
id: UUID
post_id: UUID (fk → posts)
team_id: UUID (fk → brand_teams)
respondent_id: UUID (fk → users)
content: TEXT
status: ENUM ('pending', 'responded', 'resolved', 'escalated')
responded_at: TIMESTAMP (nullable)
resolved_at: TIMESTAMP (nullable)
createdAt: TIMESTAMP
```

### Hashtags
Tracking trending topics per brand.

```sql
id: UUID
brand_id: UUID (fk → brands)
tag: TEXT
post_count: INTEGER
trending: BOOLEAN
trend: DECIMAL (-100 to +100)
createdAt: TIMESTAMP
```

### Analytics
Daily sentiment snapshots for dashboards.

```sql
id: UUID
brand_id: UUID (fk → brands)
date: TIMESTAMP
total_posts: INTEGER
total_sentiment: JSON { positive, neutral, negative, unknown: INT }
average_sentiment_score: DECIMAL
top_influencers: JSON (array of user profiles)
top_hashtags: JSON (array of hashtags)
crisis_detected: BOOLEAN
crisis_level: INTEGER (0-100)
createdAt: TIMESTAMP
```

### Notifications
Real-time alerts for users.

```sql
id: UUID
user_id: UUID (fk → users)
type: TEXT ('crisis', 'response_needed', 'trending', 'mention')
title: TEXT
message: TEXT
read: BOOLEAN
action_url: TEXT
createdAt: TIMESTAMP
```

### Audit Logs
All platform actions for compliance.

```sql
id: UUID
user_id: UUID (nullable, fk → users)
team_id: UUID (nullable, fk → brand_teams)
action: TEXT
resource_type: TEXT
resource_id: TEXT
details: JSON
createdAt: TIMESTAMP
```

## Relationships

```
Users (1) ──→ (N) Social Profiles
Users (1) ──→ (N) Posts (as author)
Users (1) ──→ (N) Votes
Users (1) ──→ (N) Comments (as author)
Users (1) ──→ (N) Team Members
Users (1) ──→ (N) Responses (as respondent)
Users (1) ──→ (N) Notifications
Users (1) ──→ (N) Audit Logs

Brands (1) ──→ (N) Posts
Brands (1) ──→ (N) Brand Teams
Brands (1) ──→ (N) Hashtags
Brands (1) ──→ (N) Analytics

Brand Teams (1) ──→ (N) Team Members
Brand Teams (1) ──→ (N) Responses

Posts (1) ──→ (N) Votes
Posts (1) ──→ (N) Comments
Posts (1) ──→ (N) Responses
Posts (N) ──→ (N) Hashtags (via post_hashtags)

Comments (1) ──→ (N) Comments (self-referential for threads)
```

## Indexes (Performance)

- `social_profiles(user_id)`
- `social_profiles(platform, social_id)` ← Unique lookup
- `posts(brand_id, created_at)` ← Feed queries
- `posts(author_id)`
- `votes(post_id, user_id)` ← Unique constraint
- `comments(post_id)`
- `responses(post_id, team_id, status)` ← Crisis queries
- `hashtags(brand_id, tag)` ← Trending queries
- `analytics(brand_id, date)` ← Dashboard queries
- `notifications(user_id, read)` ← Notification feed
- `audit_logs(user_id, team_id, created_at)` ← Compliance queries

## Row-Level Security (Supabase)

```sql
-- Users can only see/edit their own profile
CREATE POLICY users_self ON users
  FOR ALL USING (auth.uid()::uuid = id);

-- Posts are public readable, writable by author only
CREATE POLICY posts_read ON posts FOR SELECT USING (true);
CREATE POLICY posts_write ON posts FOR INSERT, UPDATE, DELETE
  USING (auth.uid()::uuid = author_id);

-- Responses writable by team members only
CREATE POLICY responses_write ON responses FOR INSERT, UPDATE, DELETE
  USING (
    auth.uid()::uuid IN (
      SELECT user_id FROM team_members WHERE team_id = responses.team_id
    )
  );

-- Audit logs are append-only
CREATE POLICY audit_logs_append ON audit_logs FOR INSERT USING (true);
CREATE POLICY audit_logs_read ON audit_logs FOR SELECT
  USING (
    auth.uid()::uuid = user_id OR
    auth.uid()::uuid IN (
      SELECT user_id FROM team_members WHERE team_id = audit_logs.team_id
    )
  );
```

## Future Enhancements

1. **Integrations Table**: Store Slack, Jira, email webhook configs
2. **Campaigns Table**: Track specific PR campaigns and their impact
3. **Alerts Table**: Configure crisis thresholds and notification rules
4. **Reports Table**: Store generated PDFs and CSV exports
5. **Media Table**: Separate media handling for posts/responses
