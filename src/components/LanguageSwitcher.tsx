import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, RTL_LANGUAGES } from "@/lib/i18n";
import { APP_SUPPORTED_LOCALES } from "@/lib/locale-app";
import { COUNTRY_LANGUAGE_DIRECTORY } from "@/lib/country-languages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Globe, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export async function switchAppLanguage(
  i18nInstance: { changeLanguage: (lng: string) => Promise<unknown> },
  code: string,
) {
  await i18nInstance.changeLanguage(code);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("sot-lang", code);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = code;
    document.documentElement.dir = RTL_LANGUAGES.includes(code) ? "rtl" : "ltr";
  }
}

const FEATURED_CODES = new Set<string>(APP_SUPPORTED_LOCALES.map((l) => l.code));

/**
 * Single unified top-of-screen language bar for the 8 core locales in src/lib/locale-app.ts
 * plus a "Country -> Local Languages" directory (1–2+ accurate flagship languages per country)
 * and a searchable "More" menu for all 52 languages.
 */
export function TopLanguageStrip() {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const activeCode = (i18n.language || "en").split("-")[0];

  const extraLanguages = useMemo(() => {
    const others = LANGUAGES.filter((l) => !FEATURED_CODES.has(l.code));
    const normalized = query.trim().toLowerCase();
    if (!normalized) return others;
    return others.filter((l) =>
      `${l.label} ${l.native ?? ""} ${l.code}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRY_LANGUAGE_DIRECTORY;
    return COUNTRY_LANGUAGE_DIRECTORY.filter((c) =>
      `${c.countryName} ${c.countryCode} ${c.languages.map((l) => `${l.nativeName} ${l.englishName}`).join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [countryQuery]);

  const activeExtra = !FEATURED_CODES.has(activeCode)
    ? LANGUAGES.find((l) => l.code === activeCode || l.code.startsWith(activeCode))
    : null;

  return (
    <div
      role="region"
      aria-label="Language switcher"
      className="w-full border-b border-[#d6a928]/25 bg-slate-950 text-white"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 overflow-x-auto px-4 py-1 sm:px-6 lg:px-8 no-scrollbar">
        <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#d6a928]">
          <Globe className="h-3 w-3 shrink-0 text-[#d6a928]" aria-hidden="true" />
          <span className="hidden sm:inline">Language</span>
        </div>

        <div className="flex items-center gap-1">
          {APP_SUPPORTED_LOCALES.map((locale) => {
            const isActive = activeCode === locale.code;
            return (
              <button
                key={locale.code}
                type="button"
                onClick={() => void switchAppLanguage(i18n, locale.code)}
                aria-pressed={isActive}
                aria-label={`Switch language to ${locale.label}`}
                data-lang={locale.code}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-md px-2.5 py-0.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                  isActive
                    ? "bg-[#d6a928] text-slate-950 shadow-xs"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {locale.label}
              </button>
            );
          })}

          {/* Country -> Flagship Local Languages Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Languages by Country"
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#d6a928]/40 bg-[#d6a928]/15 px-2 py-0.5 text-[11px] font-bold text-[#f5d061] whitespace-nowrap transition-colors hover:bg-[#d6a928]/25 cursor-pointer"
              >
                <MapPin className="h-3 w-3 text-[#d6a928]" />
                <span>By Country</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              <div className="border-b border-border px-2 pb-1.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#b88914]">
                  🌍 Country → Flagship Local Languages
                </p>
                <input
                  value={countryQuery}
                  onChange={(e) => setCountryQuery(e.target.value)}
                  placeholder="Search country or language..."
                  aria-label="Search country languages"
                  className="mt-1 h-7 w-full rounded border border-border bg-background px-2 text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="max-h-72 overflow-y-auto pt-1 space-y-1.5">
                {filteredCountries.map((country) => (
                  <div
                    key={country.countryCode}
                    className="rounded-lg border border-border/60 bg-secondary/30 p-2"
                  >
                    <p className="text-xs font-extrabold text-foreground">
                      {country.flag} {country.countryName}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {country.languages.map((lang) => {
                        const selected =
                          activeCode === lang.code || i18n.language === lang.code;
                        return (
                          <button
                            key={`${country.countryCode}-${lang.code}`}
                            type="button"
                            onClick={() => {
                              void switchAppLanguage(i18n, lang.code);
                              toast.success(
                                `${country.flag} Switched to ${lang.nativeName} (${lang.englishName}) for ${country.countryName}`,
                              );
                            }}
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[11px] font-bold transition cursor-pointer",
                              selected
                                ? "bg-[#d6a928] text-slate-950"
                                : "bg-background text-foreground border border-border hover:bg-secondary",
                            )}
                          >
                            {lang.nativeName} ({lang.englishName})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More languages"
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  activeExtra
                    ? "bg-[#d6a928] text-slate-950 font-bold"
                    : "text-slate-400 hover:bg-white/10 hover:text-white",
                )}
              >
                <span>{activeExtra ? activeExtra.label : "More"}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="border-b border-border px-2 pb-1.5">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search all 52 languages..."
                  aria-label="Search languages"
                  className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="max-h-56 overflow-y-auto pt-1">
                {extraLanguages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => void switchAppLanguage(i18n, l.code)}
                    className={
                      l.code === activeCode
                        ? "justify-between font-semibold text-primary"
                        : "justify-between"
                    }
                    dir={RTL_LANGUAGES.includes(l.code) ? "rtl" : "ltr"}
                  >
                    <span>{l.label}</span>
                    {l.code === activeCode && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
                {extraLanguages.length === 0 && (
                  <p className="px-2 py-3 text-xs text-muted-foreground">No matching language.</p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export function LanguageSwitcher() {
  return <TopLanguageStrip />;
}
