import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Full list of selectable languages (native names). UI strings fall back to
// English until a full translation bundle exists for a given code.
export const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "ro", label: "Română" },
  { code: "sv", label: "Svenska" },
  { code: "no", label: "Norsk" },
  { code: "da", label: "Dansk" },
  { code: "fi", label: "Suomi" },
  { code: "cs", label: "Čeština" },
  { code: "sk", label: "Slovenčina" },
  { code: "hu", label: "Magyar" },
  { code: "el", label: "Ελληνικά" },
  { code: "bg", label: "Български" },
  { code: "uk", label: "Українська" },
  { code: "ru", label: "Русский" },
  { code: "sr", label: "Српски" },
  { code: "hr", label: "Hrvatski" },
  { code: "sl", label: "Slovenščina" },
  { code: "lt", label: "Lietuvių" },
  { code: "lv", label: "Latviešu" },
  { code: "et", label: "Eesti" },
  { code: "tr", label: "Türkçe" },
  { code: "ar", label: "العربية" },
  { code: "he", label: "עברית" },
  { code: "fa", label: "فارسی" },
  { code: "ur", label: "اردو" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "fil", label: "Filipino" },
  { code: "zh", label: "中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "sw", label: "Kiswahili" },
  { code: "am", label: "አማርኛ" },
  { code: "zu", label: "isiZulu" },
  { code: "af", label: "Afrikaans" },
  { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" },
];

export const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

const en = {
  translation: {
    nav: {
      feed: "Feed",
      brands: "Brands",
      messages: "Messages",
      admin: "Admin",
      post: "Post",
      signIn: "Sign in",
      signOut: "Sign out",
      profile: "Profile",
    },
    home: {
      titleA: "Post it.",
      stash: "Stash",
      or: "or",
      trash: "trash",
      titleB: "it.",
      subtitle:
        "The Brand Barometer. Post anything about a brand and let the community deliver its verdict in real time — the CX & PR signal that matters.",
      emptyTitle: "Nothing to judge yet",
      emptyBodyUser: "Be the first — hit Post something.",
      emptyBodyGuest: "Be the first — sign in and post something.",
    },
    vote: {
      stash: "Stash",
      trash: "Trash",
      noVotes: "No votes yet",
      stashPct: "{{pct}}% stash",
      stashCount: "{{count}} stash",
      trashCount: "{{count}} trash",
      signInPrompt: "Sign in to cast your verdict.",
    },
    brand: {
      title: "Brands",
      subtitle: "Verified brands and the community's live verdict on them.",
      create: "Create brand",
      verified: "Verified",
      trustScore: "Trust score",
      requestVerification: "Request verification",
      verificationPending: "Verification pending",
      message: "Message owner",
      posts: "Posts about this brand",
      noBrands: "No brands yet. Be the first to add one.",
      website: "Website",
      by: "Managed by",
    },
    messages: {
      title: "Messages",
      empty: "No messages yet.",
      placeholder: "Write a message…",
      send: "Send",
      to: "To",
    },
    admin: {
      title: "Verification queue",
      empty: "No pending verification requests.",
      approve: "Approve",
      reject: "Reject",
      approved: "Approved",
      rejected: "Rejected",
    },
    common: {
      cancel: "Cancel",
      save: "Save",
      loading: "Loading…",
    },
  },
};

const resources: Record<string, typeof en> = {
  en,
  es: {
    translation: {
      ...en.translation,
      nav: {
        feed: "Inicio",
        brands: "Marcas",
        messages: "Mensajes",
        admin: "Admin",
        post: "Publicar",
        signIn: "Entrar",
        signOut: "Salir",
        profile: "Perfil",
      },
    },
  },
  fr: {
    translation: {
      ...en.translation,
      nav: {
        feed: "Accueil",
        brands: "Marques",
        messages: "Messages",
        admin: "Admin",
        post: "Publier",
        signIn: "Connexion",
        signOut: "Déconnexion",
        profile: "Profil",
      },
    },
  },
  de: {
    translation: {
      ...en.translation,
      nav: {
        feed: "Feed",
        brands: "Marken",
        messages: "Nachrichten",
        admin: "Admin",
        post: "Posten",
        signIn: "Anmelden",
        signOut: "Abmelden",
        profile: "Profil",
      },
    },
  },
  pt: {
    translation: {
      ...en.translation,
      nav: {
        feed: "Início",
        brands: "Marcas",
        messages: "Mensagens",
        admin: "Admin",
        post: "Publicar",
        signIn: "Entrar",
        signOut: "Sair",
        profile: "Perfil",
      },
    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: LANGUAGES.map((l) => l.code),
      nonExplicitSupportedLngs: true,
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "sot-lang",
      },
    });
}

export default i18n;
