## Documentation of my implementation plan and thought process

## 1. 

### a. Initializing the project

.gitignore 
- .env, 
- node_modules/

Making folders:
- /frontend
- /backend

- `cd backend`

Installing runtime dependencies
- `npm install express dotenv bcrypt jsonwebtoken helmet cors express-rate-limit drizzle-orm mysql2 swagger-jsdoc swagger-ui-express`


Dev dependencies:
- `npm install --save-dev drizzle-kit typescript ts-node nodemon jest supertest @types/node @types/express @types/bcrypt @types/jsonwebtoken`

Create .env in the backend folder and put in:
```
DATABASE_URL=mysql://username:password@host:port/database?ssl-mode=REQUIRED
```

### b. Configuring drizzle

Create `drizzle.config.ts` in root of backend folder

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Create `src/db/index.ts` 
```
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
```

Define database schema in `src/db/schema.ts`
```
import { mysqlTable, int, varchar, boolean, datetime, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  role: mysqlEnum("role", ["USER", "ADMIN", "MODERATOR"]).default("USER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
```

### Applying migrations

Generate migration files from schema
`npx drizzle-kit generate`


Apply migrations to the database
`npx drizzle-kit migrate`

Example query:

```
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const newUser = await db.insert(users).values({
  email: "test@example.com",
  password: "hashedPassword",
});
```
