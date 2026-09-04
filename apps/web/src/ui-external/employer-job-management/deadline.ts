/**
 * Deadline handling for job postings.
 *
 * `<input type="date">` gives a plain calendar date, "YYYY-MM-DD", with no time
 * and no timezone. The API expects an ISO date-time string, and
 * `validateJobInput` on the backend rejects anything not strictly in the future:
 *
 *     if (deadline <= new Date()) throw new HttpError(400, "Deadline must be a future date");
 *
 * These two helpers are the only place that bridges the two representations.
 */

/**
 * The earliest date the picker should allow, as "YYYY-MM-DD".
 * Used for the `min` attribute on the deadline input.
 */
export function earliestDeadline(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return toDateInputValue(date)
}

/** Format a Date as the "YYYY-MM-DD" string an `<input type="date">` expects. */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Convert the picker's "YYYY-MM-DD" into the ISO date-time string sent to the API,
 * set to the end of that calendar day (23:59:59:5999) in the employer's local time zone.
 */
export function toDeadlineIso(dateInputValue: string): string {
  const [year, month, day] = dateInputValue.split("-").map(Number)
  const localDate = new Date(year, month - 1, day, 23, 59, 59, 999)
  return localDate.toISOString()
}
