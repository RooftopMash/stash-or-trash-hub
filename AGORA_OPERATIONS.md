# Agora operations baseline

## Secrets

- `AGORA_APP_ID` may be used by the browser only through the server response.
- `AGORA_APP_CERTIFICATE` is server-only and must never use a `VITE_` or `NEXT_PUBLIC_` prefix.
- Rotate the certificate through the Agora Console and the deployment secret manager together. Revoke the previous credential after all active tokens expire.

## Console settings

- Enable App Certificate/token authentication before production use.
- Keep recording disabled until every participant has explicitly consented and retention, deletion, access, and jurisdiction rules are approved.
- Restrict project members with least privilege and MFA.
- Review allowed regions, data processing, support access, and retention settings before enabling global production traffic.
- Configure Agora quality alerts and abuse escalation contacts.

## Application controls

The token endpoint:

- Requires a valid Supabase access token.
- Requires an existing two-party conversation.
- Issues publisher tokens for ten minutes only.
- Uses `no-store` responses.
- Does not issue tokens for self-calls.
- Does not enable recording.

Call security events are stored with actor, peer, mode, recording state, and timestamp. This is an internal control record, not a substitute for provider logs or an independent audit.

## Incident response

For suspected account compromise, harassment, or call abuse: revoke the user session, block the participant, preserve the call event and provider logs, rotate credentials if exposure is suspected, and document the incident and remediation. Do not publish recordings or transcripts without consent and a documented legal/privacy basis.
