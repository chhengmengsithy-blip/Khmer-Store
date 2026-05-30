"use client";

import { useLocaleStore } from "@/stores/locale-store";
import { translations } from "@/constants/translations";
import type { Translations, Locale } from "@/constants/translations";

export function useTranslation() {
  const { locale, setLocale, toggleLocale } = useLocaleStore();
  const t: Translations = translations[locale];
  return { t, locale, setLocale, toggleLocale };
}
