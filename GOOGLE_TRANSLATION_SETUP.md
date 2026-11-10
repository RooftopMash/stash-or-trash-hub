# Google-powered interface translation

The app's interface continues to use its existing `i18next` resources and `react-i18next` components. When a visitor selects a supported language, the client can ask the server to use Google Cloud Translation for English fallback entries in the locale resource bundle. Authored translations are preserved, and Google results are merged back into i18next resources and cached in the visitor's browser. There is no DOM-wide text rewriting, which avoids fighting React rendering and hydration.

To enable Google fallback translations:

1. Enable the **Cloud Translation API** in the Google Cloud project and configure billing and an appropriate quota.
2. Create an API key restricted to the Cloud Translation API. Keep it private; do not use a `VITE_` variable.
3. Set `GOOGLE_CLOUD_TRANSLATE_API_KEY` as a server-side environment secret, then redeploy.

The API route validates and bounds translation batches and applies a basic per-process request limit. For production, also configure provider-side quotas and infrastructure-level rate limiting because in-memory limits reset across serverless instances. Google translation usage may incur charges. Without the server secret, the existing hand-authored i18next translations remain available and English fallback entries are not dynamically translated.

Only text rendered through existing i18next translation keys can be dynamically filled this way. Hard-coded interface copy must still be moved into the i18next catalogs for consistent app-wide localization; user-generated review text is translated separately through the review translation control.
