"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Check, Plus, Search } from "lucide-react";
import { searchBrands, type Brand } from "@/lib/brands";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function BrandSearch({
  onSelectBrand,
  selectedId,
  selectedName,
  placeholder,
  className,
}: {
  onSelectBrand?: (brand: Brand) => void;
  selectedId?: string;
  selectedName?: string;
  placeholder?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeBrandName, setActiveBrandName] = useState<string | undefined>(selectedName);

  const { data: results, isLoading } = useQuery({
    queryKey: ["brand-search", query],
    queryFn: () => searchBrands(query),
    enabled: open,
  });

  useEffect(() => {
    if (selectedId) {
      setOpen(false);
    }
  }, [selectedId]);

  useEffect(() => {
    if (selectedName) setActiveBrandName(selectedName);
  }, [selectedName]);

  const q = query.trim();

  const handleSelect = (brand: Brand) => {
    setActiveBrandName(brand.name);
    setOpen(false);
    setQuery("");
    if (onSelectBrand) onSelectBrand(brand);
    else navigate({ to: "/brands/$slug", params: { slug: brand.slug } });
  };

  const addNew = () => {
    setOpen(false);
    setQuery("");
    navigate({ to: "/brands/new", search: { name: q } });
  };

  const exactMatch = (results ?? []).some(
    (b) => b.name.toLowerCase() === q.toLowerCase(),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-start text-left font-normal", className)}
        >
          <Search className="h-4 w-4 shrink-0 opacity-60 mr-2" />
          <span className={cn("truncate", activeBrandName ? "text-foreground font-medium" : "text-muted-foreground")}>
            {activeBrandName || placeholder || t("brand.searchPlaceholder")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 max-w-[90vw] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder ?? t("brand.searchPlaceholder")}
          />
          <CommandList>
            {isLoading && (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                Searching brands...
              </div>
            )}
            {!isLoading && results && results.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t("brand.searchNoResults")}
              </div>
            )}
            {!isLoading && results && results.length > 0 && (
              <CommandGroup heading={q.length > 0 ? t("brand.searchResults") : "Popular Brands"}>
                {results.map((b) => (
                  <CommandItem key={b.id} value={b.id} onSelect={() => handleSelect(b)}>
                    <Check className={cn("mr-2 h-4 w-4", selectedId === b.id ? "opacity-100" : "opacity-0")} />
                    <span className="truncate font-medium">{b.name}</span>
                    {b.category && (
                      <span className="ml-auto shrink-0 pl-2 text-xs text-muted-foreground">{b.category}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {q.length > 0 && !exactMatch && (
              <CommandGroup>
                <CommandItem value="__add_new_brand__" onSelect={addNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("brand.addNew", { name: q })}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
