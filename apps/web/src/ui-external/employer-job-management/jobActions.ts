import type { JobStatus } from "./components/JobStatusBadge"


/**
 * The actions an employer can take on one job posting from the list page.
 * "VIEW" is always available and is therefore not part of this set.
*/
export type JobAction = "EDIT" | "CLOSE" | "REOPEN" | "DELETE"

/**
 * The status of a job posting dictate which action is available on a Job Posting Card.
 * A reminder: EXPIRED and DELETED is stored for historical records, not for position reopen. (UC-EMP-01)
 */
const ACTIONS_BY_STATUS: Record<JobStatus, JobAction[]> = {
  PENDING_APPROVAL: ["EDIT", "DELETE"],
  ACTIVE: ["EDIT", "CLOSE", "DELETE"],
  REJECTED: ["EDIT", "DELETE"],
  CLOSED: ["EDIT", "REOPEN", "DELETE"],
  EXPIRED: ["DELETE"],
  DELETED: []
}

/**
 * Which actions the UI should offer for a job in the given status.
 *
 * This mirrors the rules already enforced by JobManagementService on the
 * backend. The server is the authority — this function only decides which
 * buttons are worth showing, so the employer never clicks something that
 * is guaranteed to fail.
 */
export function getAvailableActions(status: JobStatus): JobAction[] {
  return ACTIONS_BY_STATUS[status];
}
