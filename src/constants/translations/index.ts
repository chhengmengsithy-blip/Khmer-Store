import { en } from "./en";
import { kh } from "./kh";

export type Locale = "en" | "kh";
export type Translations = typeof en;

export const translations: Record<Locale, Translations> = { en, kh };
