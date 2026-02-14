## Backend Course Spring 2026 Project written in Express, Prisma ORM, MariaDB

This is an API with simple HTML frontend. The purpose of this project is to familiarize myself with Express API, CRUD, admin and normal users, security concepts and writing tests

I will try not to use any AI generated code for this project, so expect some real human slop

Refer to [`Documentation.md` for technical implementation guides](Documentation.md)

### Technical implementation:
- Security: Helmet, rate limiting, CORS, CSRF
- DB: MySQL, Drizzle ORM
- Swagger Docs
- Jest for tests

### Scope:
- Login, register, password reset 
- Normal user CRUD: Add records, edit their records, delete records
- Admin CRUD: Delete users, add users, change password, all normal user functions
- Some external API feature (Email autosend, weather API, Spotify API)

### Hosting:
- Frontend: Netlify?
- Backend: Railway
- DB: Aivevn.io

My Node version: `node -v` : `v22.12.0`

When wanting to interact in Aiven's web console, go to MySQL service on Aiven and connect, then input:
`mysql -h <host> -P <port> -u <user> -p <database>`

Or use DBeaver and input Aiven DB credentials

Finally `SHOW TABLES`

Backend folder plan:
```
backend/
├── src/                      # Your TypeScript source code
│   ├── db/                   # Database logic
│   │   ├── index.ts          # Connection pool and Drizzle instance
│   │   └── schema.ts         # Table definitions (Users, etc.)
│   ├── middleware/           # (Recommended) Auth and validation logic
│   ├── routes/               # (Recommended) Express route definitions
│   ├── app.ts                # Express app setup and middleware configuration
│   └── server.ts
```

Frontend folder plan:
frontend/
├──
|
|