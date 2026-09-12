# Election-readiness security program

This project is not certified for elections. This document defines the work required before any government, political-party, or election authority relies on it.

## Standards baseline

- NIST Cybersecurity Framework Election Infrastructure Profile (VTS 200-1)
- NIST CSF 2.0
- OWASP ASVS for web/API controls
- OWASP MASVS for mobile releases
- ISO/IEC 27001 information-security management system
- ISO/IEC 27701 privacy controls where personal data is processed
- Applicable national electoral law, accessibility law, data-protection law, and vendor certification requirements

## Release gates

1. Threat model signed by an independent election-security specialist.
2. RLS, RPC, storage, authentication, authorization, and privileged-action review completed.
3. MFA/passkeys required for administrators, reviewers, and deployment operators.
4. Ratings and organization records carry source, methodology version, evidence, confidence, reviewer, and history.
5. Append-only audit records are exported to a separate protected system and monitored.
6. Backups are encrypted, access-controlled, and restored successfully in a documented drill.
7. Independent penetration test and mobile/API assessment completed with all critical and high findings closed or formally accepted.
8. Disaster-recovery, incident-response, business-continuity, and coordinated-vulnerability-disclosure plans are exercised.
9. Privacy impact assessment, data-retention schedule, deletion process, and data-residency review are approved.
10. Jurisdiction-specific election authority approval is obtained before election use.

## Required evidence

Maintain versioned evidence for policies, access reviews, code/dependency scans, backup restores, incident exercises, penetration tests, vendor reviews, training, and every production release.

## Data trust rules

A community rating is not an official election result or government determination. The product must display provenance and uncertainty, preserve superseded versions, separate verified organization claims from opinions, and provide an appeal and correction process.

## External program procurement

Engage an accredited ISO 27001 certification body, an independent CREST- or OSCP-qualified penetration-testing firm, an election-security assessor familiar with the target jurisdiction, and privacy counsel. Contracts must require conflict-of-interest disclosure, production-environment testing, retesting after remediation, written findings, and permission to publish a customer-facing assurance statement.

Certification cannot be created by code alone. It requires an operating management system, trained people, evidence over time, independent assessment, and legal approval.
