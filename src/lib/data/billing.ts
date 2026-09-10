import { requireAuthUser } from "@/lib/data/profile";
import { getOrCreateSubscription } from "@/lib/billing/credits";

export async function getCurrentSubscription() {
  const user = await requireAuthUser();
  return getOrCreateSubscription(user.id);
}
