/**
 * Shared date formatting.
 *
 * The API sends every timestamp as an ISO string, which is an *instant* — a
 * point on the world timeline. Rendering an instant without saying whose clock
 * it is read on is what causes timezone confusion, so these helpers pin the
 * display to one zone rather than leaving it to the viewer's browser.
 *
 * See UC-EMP-01: a deadline is the end of the chosen day in the employer's
 * local time. With the MVP scoped to Vietnam, that is `PLATFORM_TIME_ZONE`.
 */

/** Every date in the UI is rendered on this clock, whoever is looking. */
export const PLATFORM_TIME_ZONE = "Asia/Ho_Chi_Minh"

const LOCALE = "en-GB"

/**
 * A calendar date: "15 Sep 2026".
 * Use for created/applied/posted dates, where the time of day is not meaningful.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString(LOCALE, {
    timeZone: PLATFORM_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/**
 * A deadline, with the hour and the zone spelled out:
 * "15 Sep 2026, 23:59 GMT+7".
 *
 * The time matters here — a job seeker reading only "15 Sep" assumes the end of
 * their own day, which can be many hours after applications actually close.
 */
export function formatDeadline(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleString(LOCALE, {
    timeZone: PLATFORM_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

/** Whether the cutoff instant has already passed. */
export function isPastDeadline(iso: string): boolean {
  const date = new Date(iso)
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now()
}
