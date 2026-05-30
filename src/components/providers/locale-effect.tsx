"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/stores/locale-store";

export function LocaleEffect() {
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    document.documentElement.lang = locale === "kh" ? "km" : "en";
  }, [locale]);

  return null;
}
