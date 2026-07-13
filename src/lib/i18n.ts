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
  { code: "xh", label: "isiXhosa" },
  { code: "st", label: "Sesotho" },
  { code: "tn", label: "Setswana" },
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
      dashboard: "Dashboard",
      awards: "Awards",
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
    dashboard: {
      title: "Brand dashboard",
      subtitle: "Manage the brands you represent and track their live sentiment.",
      noBrands: "You don't manage any brands yet.",
      createFirst: "Create your first brand",
      newBrand: "New brand",
      trustScore: "Trust score",
      posts: "Posts",
      stash: "Stash",
      trash: "Trash",
      verified: "Verified",
      unverified: "Unverified",
      requestVerification: "Request verification",
      view: "View page",
      manage: "Manage",
    },
    awards: {
      title: "The SOT Awards",
      tagline: "The people's verdict, made official.",
      intro:
        "Every year, the brands the world trusts most are crowned at the SOT Awards — decided entirely by real verdicts from real people. No paid panels. No boardrooms. Just the crowd.",
      leaderboard: "Live leaderboard",
      leaderboardNote: "The current standings that shape this year's awards.",
      rank: "Rank",
      brand: "Brand",
      score: "Trust score",
      categoryTitle: "Award categories",
      cat1: "Most Trusted Brand",
      cat1d: "Highest overall trust score across the year.",
      cat2: "People's Champion",
      cat2d: "Most Stash verdicts from the community.",
      cat3: "Biggest Turnaround",
      cat3d: "Largest trust-score climb over 12 months.",
      cat4: "Rising Star",
      cat4d: "Best new brand of the year.",
      cta: "Represent your brand",
      ctaNote: "Own a brand? Claim your page and climb the leaderboard.",
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

// Helper to build a translation bundle from just a nav override, keeping the
// rest of the English strings so nothing renders blank.
function withNav(nav: Record<string, string>): typeof en {
  return { translation: { ...en.translation, nav: { ...en.translation.nav, ...nav } } };
}

const resources: Record<string, typeof en> = {
  en,
  es: withNav({
    feed: "Inicio", brands: "Marcas", messages: "Mensajes", admin: "Admin",
    dashboard: "Panel", awards: "Premios", post: "Publicar",
    signIn: "Entrar", signOut: "Salir", profile: "Perfil",
  }),
  fr: withNav({
    feed: "Accueil", brands: "Marques", messages: "Messages", admin: "Admin",
    dashboard: "Tableau de bord", awards: "Prix", post: "Publier",
    signIn: "Connexion", signOut: "Déconnexion", profile: "Profil",
  }),
  de: withNav({
    feed: "Feed", brands: "Marken", messages: "Nachrichten", admin: "Admin",
    dashboard: "Dashboard", awards: "Awards", post: "Posten",
    signIn: "Anmelden", signOut: "Abmelden", profile: "Profil",
  }),
  pt: withNav({
    feed: "Início", brands: "Marcas", messages: "Mensagens", admin: "Admin",
    dashboard: "Painel", awards: "Prémios", post: "Publicar",
    signIn: "Entrar", signOut: "Sair", profile: "Perfil",
  }),
  it: withNav({
    feed: "Feed", brands: "Marchi", messages: "Messaggi", admin: "Admin",
    dashboard: "Cruscotto", awards: "Premi", post: "Pubblica",
    signIn: "Accedi", signOut: "Esci", profile: "Profilo",
  }),
  nl: withNav({
    feed: "Feed", brands: "Merken", messages: "Berichten", admin: "Admin",
    dashboard: "Dashboard", awards: "Awards", post: "Plaatsen",
    signIn: "Inloggen", signOut: "Uitloggen", profile: "Profiel",
  }),
  ru: withNav({
    feed: "Лента", brands: "Бренды", messages: "Сообщения", admin: "Админ",
    dashboard: "Панель", awards: "Награды", post: "Опубликовать",
    signIn: "Войти", signOut: "Выйти", profile: "Профиль",
  }),
  ar: withNav({
    feed: "الرئيسية", brands: "العلامات", messages: "الرسائل", admin: "المشرف",
    dashboard: "لوحة التحكم", awards: "الجوائز", post: "نشر",
    signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", profile: "الملف الشخصي",
  }),
  hi: withNav({
    feed: "फ़ीड", brands: "ब्रांड", messages: "संदेश", admin: "एडमिन",
    dashboard: "डैशबोर्ड", awards: "पुरस्कार", post: "पोस्ट करें",
    signIn: "साइन इन", signOut: "साइन आउट", profile: "प्रोफ़ाइल",
  }),
  zh: withNav({
    feed: "动态", brands: "品牌", messages: "消息", admin: "管理",
    dashboard: "仪表板", awards: "大奖", post: "发布",
    signIn: "登录", signOut: "退出", profile: "个人资料",
  }),
  ja: withNav({
    feed: "フィード", brands: "ブランド", messages: "メッセージ", admin: "管理",
    dashboard: "ダッシュボード", awards: "アワード", post: "投稿",
    signIn: "ログイン", signOut: "ログアウト", profile: "プロフィール",
  }),
  sw: withNav({
    feed: "Mlisho", brands: "Chapa", messages: "Ujumbe", admin: "Msimamizi",
    dashboard: "Dashibodi", awards: "Tuzo", post: "Chapisha",
    signIn: "Ingia", signOut: "Toka", profile: "Wasifu",
  }),
  zu: withNav({
    feed: "Ifidi", brands: "Amabhrendi", messages: "Imilayezo", admin: "Umlawuli",
    dashboard: "Ideshubhodi", awards: "Imiklomelo", post: "Thumela",
    signIn: "Ngena", signOut: "Phuma", profile: "Iphrofayela",
  }),
  xh: withNav({
    feed: "Ifidi", brands: "Iimpawu", messages: "Imiyalezo", admin: "Umlawuli",
    dashboard: "Ideshbhodi", awards: "Amabhaso", post: "Thumela",
    signIn: "Ngena", signOut: "Phuma", profile: "Iprofayile",
  }),
  st: withNav({
    feed: "Phepha", brands: "Diteko", messages: "Melaetsa", admin: "Molaodi",
    dashboard: "Laeboto", awards: "Dikgau", post: "Phatlalatsa",
    signIn: "Kena", signOut: "Tswa", profile: "Boemo",
  }),
  tn: withNav({
    feed: "Phephe", brands: "Diteko", messages: "Melaetsa", admin: "Molaodi",
    dashboard: "Laeboto", awards: "Dituelo", post: "Phasalatsa",
    signIn: "Tsena", signOut: "Tswa", profile: "Semelo",
  }),
  af: withNav({
    feed: "Voer", brands: "Handelsmerke", messages: "Boodskappe", admin: "Admin",
    dashboard: "Kontroleskerm", awards: "Toekennings", post: "Plaas",
    signIn: "Meld aan", signOut: "Meld af", profile: "Profiel",
  }),
  ha: withNav({
    feed: "Ciyarwa", brands: "Alamu", messages: "Saƙonni", admin: "Admin",
    dashboard: "Dashboard", awards: "Kyaututtuka", post: "Turawa",
    signIn: "Shiga", signOut: "Fita", profile: "Bayani",
  }),
  yo: withNav({
    feed: "Ìfúnnì", brands: "Àmì", messages: "Ìránṣẹ́", admin: "Alámòjútó",
    dashboard: "Pátákó", awards: "Ẹ̀bùn", post: "Fìránṣẹ́",
    signIn: "Wọlé", signOut: "Jáde", profile: "Àkọọ́lẹ̀",
  }),
  ig: withNav({
    feed: "Ntanetị", brands: "Akara", messages: "Ozi", admin: "Onye nchịkwa",
    dashboard: "Dashboard", awards: "Onyinye", post: "Tinye",
    signIn: "Banye", signOut: "Pụọ", profile: "Profaịlụ",
  }),
  tr: withNav({
    feed: "Akış", brands: "Markalar", messages: "Mesajlar", admin: "Yönetici",
    dashboard: "Panel", awards: "Ödüller", post: "Paylaş",
    signIn: "Giriş", signOut: "Çıkış", profile: "Profil",
  }),
  id: withNav({
    feed: "Beranda", brands: "Merek", messages: "Pesan", admin: "Admin",
    dashboard: "Dasbor", awards: "Penghargaan", post: "Posting",
    signIn: "Masuk", signOut: "Keluar", profile: "Profil",
  }),
  ko: withNav({
    feed: "피드", brands: "브랜드", messages: "메시지", admin: "관리자",
    dashboard: "대시보드", awards: "어워드", post: "게시",
    signIn: "로그인", signOut: "로그아웃", profile: "프로필",
  }),
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
