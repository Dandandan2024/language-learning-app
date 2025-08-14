export type LanguageCode = "en" | "ru" | "es";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  ru: "Russian",
  es: "Spanish",
};

export function codeToLanguageName(code: string): string {
  const normalized = code.toLowerCase() as LanguageCode;
  return LANGUAGE_LABELS[normalized] || code;
}

export const TARGET_LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string }> = [
  { code: "ru", label: LANGUAGE_LABELS.ru },
  { code: "es", label: LANGUAGE_LABELS.es },
];

export const NATIVE_LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string }> = [
  { code: "en", label: LANGUAGE_LABELS.en },
  { code: "es", label: LANGUAGE_LABELS.es },
];