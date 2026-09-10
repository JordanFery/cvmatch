/**
 * Minimal "reach a human" hook for unexpected failures — no SDK, no
 * account signup required to use it. Always logs to the console (existing
 * behavior, unchanged). If `ALERT_WEBHOOK_URL` is set (a Slack or Discord
 * incoming-webhook URL, or any endpoint that accepts `{ text: string }`
 * JSON), also fires a short-timeout, best-effort POST — never throws, never
 * blocks the caller beyond a 3s cap, so it can't slow down or break the
 * error path it's called from.
 */
export function reportError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);

  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;

  const message = error instanceof Error ? error.message : String(error);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `🚨 [CVMatch] [${context}] ${message}` }),
    signal: controller.signal,
  })
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
}
