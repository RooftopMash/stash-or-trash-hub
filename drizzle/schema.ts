import { pgTable, pgEnum, text, timestamp, boolean, integer, decimal, uuid, index, foreignKey, primaryKey, serial } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'analyst', 'viewer', 'customer']);
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative', 'unknown']);
export const postStatusEnum = pgEnum('post_status', ['published', 'archived', 'flagged']);
export const responseStatusEnum = pgEnum('response_status', ['pending', 'responded', 'resolved', 'escalated']);
export const socialPlatformEnum = pgEnum('social_platform', ['twitter', 'facebook', 'instagram', 'tiktok', 'linkedin']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  displayName: text('display_name').notNull(),
  avatar: text('avatar').default('').notNull(),
  bio: text('bio').default('').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Social profiles linked to users (identity verification)
export const socialProfiles = pgTable('social_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: socialPlatformEnum('platform').notNull(),
  socialId: text('social_id').notNull(),
  username: text('username').notNull(),
  profileUrl: text('profile_url'),
  avatar: text('avatar'),
  followers: integer('followers').default(0),
  verified: boolean('verified').default(false),
  influenceScore: decimal('influence_score', { precision: 5, scale: 2 }).default('0'),
  metadata: text('metadata'), // JSON: bio, location, etc
  linkedAt: timestamp('linked_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_user_id').on(table.userId),
  index('idx_platform_social_id').on(table.platform, table.socialId),
]));

// Brands table
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logo: text('logo'),
  description: text('description'),
  website: text('website'),
  category: text('category'),
  overallSentiment: sentimentEnum('overall_sentiment').default('unknown'),
  sentimentScore: decimal('sentiment_score', { precision: 5, scale: 2 }).default('0'),
  totalPosts: integer('total_posts').default(0),
  totalEngagement: integer('total_engagement').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_slug').on(table.slug),
]));

// Brand teams/workspaces
export const brandTeams = pgTable('brand_teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_brand_id').on(table.brandId),
]));

// Team members with roles
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull().references(() => brandTeams.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').default('viewer').notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_team_id').on(table.teamId),
  index('idx_user_id').on(table.userId),
  primaryKey({ columns: [table.teamId, table.userId] }),
]));

// Posts/Items
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  content: text('content').notNull(),
  sentiment: sentimentEnum('sentiment').default('unknown'),
  category: text('category'), // feedback, support, complaint, praise
  status: postStatusEnum('status').default('published'),
  stashCount: integer('stash_count').default(0),
  trashCount: integer('trash_count').default(0),
  commentCount: integer('comment_count').default(0),
  hasImage: boolean('has_image').default(false),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_brand_id').on(table.brandId),
  index('idx_author_id').on(table.authorId),
  index('idx_created_at').on(table.createdAt),
]));

// Votes (Stash/Trash)
export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  voteType: text('vote_type').notNull(), // 'stash' or 'trash'
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_post_id').on(table.postId),
  index('idx_user_id').on(table.userId),
  primaryKey({ columns: [table.postId, table.userId] }),
]));

// Comments
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  parentCommentId: uuid('parent_comment_id').references(() => comments.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_post_id').on(table.postId),
  index('idx_author_id').on(table.authorId),
  index('idx_parent_comment_id').on(table.parentCommentId),
]));

// Brand responses to posts
export const responses = pgTable('responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id').notNull().references(() => brandTeams.id, { onDelete: 'cascade' }),
  respondentId: uuid('respondent_id').notNull().references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  status: responseStatusEnum('status').default('pending'),
  respondedAt: timestamp('responded_at'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_post_id').on(table.postId),
  index('idx_team_id').on(table.teamId),
  index('idx_status').on(table.status),
]));

// Hashtags
export const hashtags = pgTable('hashtags', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
  postCount: integer('post_count').default(0),
  trending: boolean('trending').default(false),
  trend: decimal('trend', { precision: 5, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_brand_id').on(table.brandId),
  index('idx_tag').on(table.tag),
]));

// Post hashtag mapping
export const postHashtags = pgTable('post_hashtags', {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  hashtagId: uuid('hashtag_id').notNull().references(() => hashtags.id, { onDelete: 'cascade' }),
}, (table) => ([
  primaryKey({ columns: [table.postId, table.hashtagId] }),
]));

// Analytics snapshots
export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  totalPosts: integer('total_posts').default(0),
  totalSentiment: text('total_sentiment'), // JSON: { positive, neutral, negative, unknown }
  averageSentimentScore: decimal('average_sentiment_score', { precision: 5, scale: 2 }),
  topInfluencers: text('top_influencers'), // JSON array
  topHashtags: text('top_hashtags'), // JSON array
  crisisDetected: boolean('crisis_detected').default(false),
  crisisLevel: integer('crisis_level').default(0), // 0-100
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_brand_id').on(table.brandId),
  index('idx_date').on(table.date),
]));

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'crisis', 'response_needed', 'trending', 'mention'
  title: text('title').notNull(),
  message: text('message'),
  read: boolean('read').default(false),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_user_id').on(table.userId),
  index('idx_read').on(table.read),
]));

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  teamId: uuid('team_id').references(() => brandTeams.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  details: text('details'), // JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  index('idx_user_id').on(table.userId),
  index('idx_team_id').on(table.teamId),
  index('idx_created_at').on(table.createdAt),
]));
