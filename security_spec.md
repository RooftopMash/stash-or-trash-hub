# Security Specification & Test Payloads

## 1. Data Invariants

- **Users**: A user can only write to `/users/{userId}` if `request.auth.uid == userId`.
- **Brands**: Read access is public. Writes require authenticated user. Updates cannot alter `id`, `slug`, or `createdAt`. Only admins or the creator can delete or modify sensitive metrics.
- **Brand Votes**: Users can only create a vote where `userId == request.auth.uid` and `voteType` is either `"stash"` or `"trash"`. Votes cannot be forged on behalf of another user.
- **Crisis Alerts & Incidents**: Must have a valid `brandId`, `title`, and known `severity`.
- **Chat Messages**: Senders can only write messages where `senderId == request.auth.uid`. Content must be non-empty and <= 3000 chars.
- **Notifications**: Users can only read and update (`read: true`) their own notifications.
- **Default Deny**: All unmapped documents are locked (`allow read, write: if false;`).

---

## 2. The "Dirty Dozen" Payloads

1. **User Profile Impersonation**: Attacker attempts to write a profile document to `/users/victim_uid` with `request.auth.uid = attacker_uid`. Expected: `PERMISSION_DENIED`.
2. **Ghost Field Injection in User**: Attacker sends `{ id, username, isAdmin: true }` attempting privilege escalation. Expected: `PERMISSION_DENIED`.
3. **Vote Forgery**: Attacker sends a vote with `userId: "other_user"` to inflate brand ratings. Expected: `PERMISSION_DENIED`.
4. **Invalid Vote Type**: Attacker sends `voteType: "super_upvote"`. Expected: `PERMISSION_DENIED`.
5. **Brand ID Poisoning**: Attacker injects a 2MB string into document ID path. Expected: `PERMISSION_DENIED`.
6. **Brand Immutable Mutation**: Attacker attempts to update an existing brand's `createdAt` timestamp. Expected: `PERMISSION_DENIED`.
7. **Message Spoofing**: Attacker attempts to post a message with `senderId: "ceo_admin"` while authenticated as `user_123`. Expected: `PERMISSION_DENIED`.
8. **Oversized Message DOS**: Attacker attempts to write a message with content of length 50,000 chars. Expected: `PERMISSION_DENIED`.
9. **Notification Snoop**: User A attempts to list/read User B's notifications at `/notifications/user_b_notif`. Expected: `PERMISSION_DENIED`.
10. **Admin Record Self-Grant**: Attacker attempts to write to `/admins/attacker_uid`. Expected: `PERMISSION_DENIED`.
11. **Crisis Alert Fake News**: Unauthenticated client attempts to create an active critical crisis alert for a brand. Expected: `PERMISSION_DENIED`.
12. **Catch-All Probe**: Attacker attempts to read `/secrets/system_keys` or unknown collection. Expected: `PERMISSION_DENIED`.
