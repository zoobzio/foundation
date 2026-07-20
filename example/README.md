# Foundation Example

A playground app that extends the foundation layer and exercises its componentry
against a real CRUD API.

```sh
pnpm dev:example   # from the repo root
```

## Domain

**Commissions** — custom metalwork orders for the forge. The shape is deliberately
varied so every form control gets exercised:

| Field         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| `title`       | text                                                          |
| `client`      | text                                                          |
| `description` | long text                                                     |
| `status`      | enum: `draft` `quoted` `in_progress` `complete` `cancelled`   |
| `material`    | enum: `steel` `iron` `bronze` `brass` `copper` `silver`       |
| `price`       | number                                                        |
| `dueDate`     | ISO date, nullable                                            |

Zod schemas and types live in `shared/commissions.ts` and are shared between the
server routes and (eventually) app-side forms via `#shared/commissions`.

## API

Backed by SQLite (`node:sqlite`, zero dependencies). The database file is created
at `example/.data/example.sqlite` on first request and seeded with a dozen rows.
Delete the file to reset.

| Method   | Route                  | Notes                                       |
| -------- | ---------------------- | ------------------------------------------- |
| `GET`    | `/api/commissions`     | List; filters: `?status=quoted`, `?q=text`  |
| `POST`   | `/api/commissions`     | Create, 201; body validated with zod        |
| `GET`    | `/api/commissions/:id` | Read, 404 if missing                        |
| `PATCH`  | `/api/commissions/:id` | Partial update, 404 if missing              |
| `DELETE` | `/api/commissions/:id` | Delete, 204 / 404                           |
