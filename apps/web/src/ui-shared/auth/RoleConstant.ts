/**
 * Mirrors `api-shared/constant/RoleConstant.ts` on the backend.
 * These ids come from the `roles` table and are what `LoginResponse.user.roleId`
 * carries, so the two sides must stay in step.
 *
 * Written as a const object rather than an `enum` because the web tsconfig sets
 * `erasableSyntaxOnly`, which forbids TypeScript constructs that emit runtime code.
 */
export const RoleConstant = {
  JOB_SEEKER: 1,
  EMPLOYER: 2,
  ADMIN: 3,
} as const

export type RoleName = keyof typeof RoleConstant
