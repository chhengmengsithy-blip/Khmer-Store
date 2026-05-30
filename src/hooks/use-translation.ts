"use client";

import { useState, useEffect } from "react";
import { useLocaleStore } from "@/stores/locale-store";
import { translations } from "@/constants/translations";
import type { Translations, Locale } from "@/constants/translations";

export function useTranslation() {
  const { locale, setLocale, toggleLocale } = useLocaleStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Always use 'en' on the server and during initial client render to avoid
  // hydration mismatch. Once mounted, use the persisted locale.
  const activeLocale: Locale = hydrated ? locale : "en";
  const t: Translations = translations[activeLocale];

  return { t, locale: activeLocale, setLocale, toggleLocale };
}
