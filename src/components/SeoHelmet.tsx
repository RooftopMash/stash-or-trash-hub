import { useEffect } from "react";

export interface SeoHelmetProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: "website" | "article" | "profile" | "product";
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "SOT — Stash Or Trash | The Brand Barometer";
const DEFAULT_DESC =
  "SOT (Stash Or Trash) is the Brand Barometer — a CX/UX marketing & PR tool where the community delivers a live verdict on brands. Cast yours and keep your streak alive.";
const SITE_NAME = "SOT — Stash Or Trash";

function updateMetaTag(attributeName: "name" | "property", attributeValue: string, content: string | null) {
  if (typeof document === "undefined") return;

  let element = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
  if (!content) {
    if (element) {
      element.remove();
    }
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string | null) {
  if (typeof document === "undefined") return;

  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    if (element) {
      element.remove();
    }
    return;
  }

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/**
 * React Helmet component for the SOT Brand Barometer app shell & views.
 * Dynamically updates document title, standard meta descriptions, OpenGraph,
 * Twitter card tags, and Schema.org JSON-LD structured data.
 */
export function SeoHelmet({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonicalUrl,
  ogType = "website",
  ogImage = "/apple-touch-icon.png",
  ogTitle,
  ogDescription,
  twitterCard = "summary_large_image",
  noIndex = false,
  structuredData,
}: SeoHelmetProps) {
  const fullTitle = title
    ? title.includes("SOT") || title.includes("Brand Barometer")
      ? title
      : `${title} | SOT Brand Barometer`
    : DEFAULT_TITLE;

  const resolvedOgTitle = ogTitle || fullTitle;
  const resolvedOgDesc = ogDescription || description;

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Document title
    document.title = fullTitle;

    // Standard meta tags
    updateMetaTag("name", "description", description);
    if (keywords && keywords.length > 0) {
      updateMetaTag("name", "keywords", keywords.join(", "));
    }
    if (noIndex) {
      updateMetaTag("name", "robots", "noindex, nofollow");
    } else {
      updateMetaTag("name", "robots", "index, follow");
    }

    // Canonical link
    const resolvedCanonical =
      canonicalUrl || (typeof window !== "undefined" ? window.location.origin + window.location.pathname : null);
    updateLinkTag("canonical", resolvedCanonical);

    // OpenGraph meta tags
    updateMetaTag("property", "og:title", resolvedOgTitle);
    updateMetaTag("property", "og:description", resolvedOgDesc);
    updateMetaTag("property", "og:type", ogType);
    updateMetaTag("property", "og:site_name", SITE_NAME);
    if (resolvedCanonical) {
      updateMetaTag("property", "og:url", resolvedCanonical);
    }
    if (ogImage) {
      const fullImageUrl =
        ogImage.startsWith("http") || typeof window === "undefined"
          ? ogImage
          : `${window.location.origin}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
      updateMetaTag("property", "og:image", fullImageUrl);
    }

    // Twitter card tags
    updateMetaTag("name", "twitter:card", twitterCard);
    updateMetaTag("name", "twitter:title", resolvedOgTitle);
    updateMetaTag("name", "twitter:description", resolvedOgDesc);
    if (ogImage) {
      const fullImageUrl =
        ogImage.startsWith("http") || typeof window === "undefined"
          ? ogImage
          : `${window.location.origin}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
      updateMetaTag("name", "twitter:image", fullImageUrl);
    }

    // JSON-LD Structured Data
    const scriptId = "sot-seo-jsonld";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [
    fullTitle,
    description,
    keywords,
    canonicalUrl,
    ogType,
    ogImage,
    resolvedOgTitle,
    resolvedOgDesc,
    twitterCard,
    noIndex,
    structuredData,
  ]);

  return null;
}

export default SeoHelmet;
