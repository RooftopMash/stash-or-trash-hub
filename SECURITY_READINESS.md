# Security readiness baseline

This document records the internal controls we operate before any future regulated or election use. It is not a certification, legal opinion, or claim that the platform is election-ready.

## Operating principles

- Protect users, brands, ratings, awards, evidence, and moderation history from unauthorized access or manipulation.
- Treat every score as a traceable, reviewable data product; never present missing data as a negative result.
- Separate public catalog data, verified evidence, reviewer decisions, and privileged administration.
- Changes must be reviewed, tested, logged, and reversible. No automated job may silently deploy code.

## Control baseline

- **Identity:** MFA/passkeys for privileged users, least privilege, short-lived sessions, quarterly access review, and immediate offboarding.
- **Authorization:** Supabase RLS on exposed tables, server-side validation for every mutation, no client-controlled role claims, and service credentials kept server-side.
- **Integrity:** Append-only audit events, versioned methodologies, evidence provenance, review/appeal records, and timestamped publication snapshots.
- **Availability:** Encrypted backups, restore drills, documented recovery objectives, monitoring, incident escalation, and tested dependency recovery.
- **Application security:** OWASP ASVS review, dependency updates, lockfile integrity, monthly vulnerability scans, SBOM artifacts, lint/build/E2E gates, and external penetration testing before institutional use.
- **Privacy:** Data minimization, retention rules, deletion/appeal procedures, access logging, and jurisdiction-specific privacy review.

## Monthly maintenance

Dependabot opens reviewable updates monthly. The monthly security workflow audits production dependencies, generates an SBOM, runs lint/build/E2E checks, and stores evidence as an artifact. Maintainers must review changelogs, breaking changes, licenses, migration risk, and security advisories before merging.

Critical advisories may be fast-tracked by two-person approval, with the reason, scope, test results, and rollback plan recorded in the pull request. Production deployment remains a separately approved action.

## Evidence register

For each release, retain the pull request, dependency audit, SBOM, test output, migration review, access review, backup result, incidents/exceptions, and deployment approval. Review this register monthly and after any security incident.

## Future certification gate

If the product later enters a government or election-regulated use case, commission an independent threat model, RLS/API assessment, penetration test, privacy impact assessment, red-team exercise, disaster-recovery test, and jurisdiction-specific legal/election review. Then engage an accredited assessor for the applicable certification or authorization. Controls begin now; certification claims wait until independently assessed.
