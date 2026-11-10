# Google-powered interface translation

The client uses the existing i18next language choice and Google Cloud Translation to translate visible app text that is not already translated in the local language bundles. It runs across the app, preserves original text when switching languages, and leaves text unchanged if the Google service is unavailable. Code blocks, editable fields, and elements marked `data-translation-exclude` are excluded.

To enable it in each deployment environment:

1. Enable the **Cloud Translation API** in the Google Cloud project and configure billing and an appropriate quota.
2. Create a restricted API key that is limited to the Cloud Translation API. Keep it private; do not use a `VITE_` variable.
3. Set `GOOGLE_CLOUD_TRANSLATE_API_KEY` as a server-side environment secret, then redeploy.

The API route validates and bounds translation batches and applies a basic per-process request limit. For production, also configure provider-side quotas and infrastructure-level rate limiting because in-memory limits reset across serverless instances. Google translation usage may incur charges. Without the server secret, the current static i18next translations continue to work, but missing strings remain in their original language.
