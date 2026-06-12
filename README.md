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

## Academic Scope

This project is intended for thesis demonstration and evaluation. Some advanced production features may be simplified or treated as future work.

## Author

Phung Dam Tien Si
