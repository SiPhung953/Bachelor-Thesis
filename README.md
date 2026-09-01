# Online Recruitment Platform

A full-stack web-based recruitment platform developed as part of a Bachelor's thesis project.

The system supports job discovery, user authentication, profile management, job applications, employer job management, and basic moderation/admin workflows.

## Tech Stack

### Frontend

* React
* Vite
* TypeScript
* React Router
* Axios
* shadcn/ui

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* tsoa / OpenAPI
* Swagger UI
* JWT authentication
* bcrypt password hashing

### Tooling

* pnpm workspace
* ESLint
* Prettier

## Project Structure

```txt
bachelor-thesis-prj/
├── apps/
│   ├── web/      # Frontend application
│   └── api/      # Backend API
├── packages/     # Shared packages if needed
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Main Modules

* Public job search
* Company profile viewing
* Authentication
* User profile management
* CV management
* Job application management
* Employer job posting management
* Application review
* Moderation/admin management

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the frontend:

```bash
pnpm dev:web
```

Run the backend:

```bash
pnpm dev:api
```

## API Documentation

The backend uses `tsoa` to generate OpenAPI documentation from TypeScript controllers and DTOs.

Swagger UI is used to inspect and test available API endpoints during development.

## Development Notes

This project is structured as a monorepo with separate frontend and backend applications.

The backend follows a controller-service structure and uses Prisma for database access. API contracts are documented through OpenAPI generation.

The frontend communicates with the backend through HTTP APIs and is implemented as a React single-page application.

## Naming Conventions

### `api-external` vs `api-internal` (Backend)

The `apps/api/src/` directory uses two top-level modules to separate API endpoints by audience:

- **`api-external/`** - Endpoints consumed by the **web frontend** (i.e., the Job Seeker and Employer personas). This includes both public endpoints (no auth) and authenticated endpoints (JWT required).
- **`api-internal/`** - Endpoints consumed by **internal/back-office tooling** (i.e., the Admin/Moderator persona). This includes moderation, user management, and system administration endpoints.

Both modules may contain public and authenticated routes - the distinction is **which human actor** the API serves, not whether authentication is required.

### `ui-external` vs `ui-internal` (Frontend)

The `apps/web/src/` directory uses the **same axis as the backend**: which human actor the UI serves.

- **`ui-external/`** - Pages for the **end-user personas** (Job Seeker and Employer). Contains both public pages (landing, job search, job detail, auth) and authenticated pages (dashboard, profile, applications, employer job management).
- **`ui-internal/`** - Pages for the **Admin/Moderator persona** (moderation, user management). Not yet implemented, mirroring the empty `api-internal/`.
- **`ui-shared/`** - Components used by both: `components/ui/` for shadcn primitives, `components/` for shared app components.

Authentication is **not** the axis. Whether a page requires login is enforced by route guards in `App.tsx`, not by which folder it lives in.

### Feature folders

Inside `ui-external/`, feature folders mirror the backend folder names wherever the same use cases are involved, so a feature can be traced end to end:

| Backend | Frontend |
| :--- | :--- |
| `api-external/employer-company/` | `ui-external/employer-company/` |
| `api-external/employer-job-management/` | `ui-external/employer-job-management/` |
| `api-external/employer-application-management/` | `ui-external/employer-application-management/` |
| `api-external/job-application/` | `ui-external/applications/` |
| `api-external/job-discovery/` | `ui-external/public/` |

Page components sit at the folder root (`MyJobPostingsPage.tsx`); components used only by that feature go in its `components/` subfolder.

<!-- ### Client-side guards are not access control

Route guards decide **what is rendered**, not what a user is allowed to do. Every request is independently authorized server-side by `expressAuthentication` (JWT + ban check), the tsoa `@Security` scope, and `assertRole` in the service. A user who edits client state in DevTools reaches a page whose API calls return 401 or 403. -->

## Academic Scope

This project is intended for thesis demonstration and evaluation. Some advanced production features may be simplified or treated as future work.

## Author

Phung Dam Tien Si
