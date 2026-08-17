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

The `apps/web/src/` directory uses two top-level modules to separate pages by auth gate:

- **`ui-external/`** - Pages accessible **without authentication**: landing page, public job/company views, auth pages (login, register, forgot password), and profile/applications pages (which handle their own auth checks inline).
- **`ui-internal/`** - Pages that **require authentication** and are only accessible after login: the authenticated user dashboard.

Note: The frontend split is by **auth gate** (guest vs logged-in), while the backend split is by **actor persona** (end-user vs admin). These are different dimensions - the naming overlap is intentional but the criteria differ.

## Academic Scope

This project is intended for thesis demonstration and evaluation. Some advanced production features may be simplified or treated as future work.

## Author

Phung Dam Tien Si
