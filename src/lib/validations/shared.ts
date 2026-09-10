import { z } from "zod";

/** A trimmed, non-empty string, or `null` — the standard shape for a field an extraction pipeline must never fabricate. */
export const nullableString = z.string().trim().min(1).nullable().catch(null);
