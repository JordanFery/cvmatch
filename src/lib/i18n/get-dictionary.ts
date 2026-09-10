import { dictionaries } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

/** Current locale's dictionary, in one call — the common case for Server Components. */
export async function getDictionary() {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}
