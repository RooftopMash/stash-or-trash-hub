import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, RTL_LANGUAGES } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];
  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return LANGUAGES;
    return LANGUAGES.filter((language) => `${language.label} ${language.code}`.toLowerCase().includes(normalized));
  }, [query]);

  const change = (code: string) => {
    i18n.changeLanguage(code);
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
      document.documentElement.dir = RTL_LANGUAGES.includes(code) ? "rtl" : "ltr";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Change language">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current.label}</span>
          <span className="sr-only">{LANGUAGES.length} languages available</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="border-b border-border px-2 pb-2">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search languages" aria-label="Search languages" className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <p className="mt-1 text-[11px] text-muted-foreground">{LANGUAGES.length} launch languages</p>
        </div>
        <div className="max-h-72 overflow-y-auto pt-1">
          {filteredLanguages.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => change(l.code)}
              className={l.code === current.code ? "font-semibold text-primary" : "justify-between"}
              dir={RTL_LANGUAGES.includes(l.code) ? "rtl" : "ltr"}
            >
              <span>{l.label}</span><span className="text-xs text-muted-foreground">{l.code}</span>
            </DropdownMenuItem>
          ))}
          {filteredLanguages.length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">No matching language.</p>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
