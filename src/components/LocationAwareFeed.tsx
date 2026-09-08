import { useEffect, useMemo, useState } from "react";
import { LocateFixed, MapPin, ShieldCheck } from "lucide-react";
import { countryName, detectCountry, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";

type LocationAwareFeedProps = {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  availableCountries: string[];
};

type LocationState = "detecting" | "gps" | "fallback" | "manual" | "unavailable";

export function LocationAwareFeed({ selectedCountry, onCountryChange, availableCountries }: LocationAwareFeedProps) {
  const [state, setState] = useState<LocationState>("detecting");
  const [requested, setRequested] = useState(false);
  const detected = useMemo(() => normalizeCountryCode(detectCountry()), []);

  useEffect(() => {
    if (requested || typeof navigator === "undefined" || !navigator.geolocation) {
      if (!requested) setState("fallback");
      return;
    }

    setRequested(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        // Coordinates are deliberately discarded. Without a reverse-geocoding provider,
        // the app keeps the privacy-safe locale fallback as the country signal.
        setState("gps");
        if (detected && availableCountries.includes(detected)) onCountryChange(detected);
      },
      () => {
        setState(detected ? "fallback" : "unavailable");
        if (detected && availableCountries.includes(detected)) onCountryChange(detected);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }, [availableCountries, detected, onCountryChange, requested]);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-background/80 p-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {state === "gps" ? <LocateFixed className="h-4 w-4 shrink-0 text-stash" /> : <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">Local feed: {countryName(selectedCountry)}</p>
          <p className="text-[11px] text-muted-foreground">
            {state === "gps" ? "Location permission granted; coordinates are not stored." : state === "detecting" ? "Checking your location preference…" : "Using your profile, locale, or timezone country."}
          </p>
        </div>
        <ShieldCheck className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="Privacy-safe location" />
      </div>
      <label className="sr-only" htmlFor="feed-country">Choose country</label>
      <select id="feed-country" value={selectedCountry} onChange={(event) => { setState("manual"); onCountryChange(event.target.value); }} className={cn("h-9 rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none", "sm:w-44")}>
        {availableCountries.map((code) => <option key={code} value={code}>{countryName(code)}</option>)}
      </select>
    </div>
  );
}
