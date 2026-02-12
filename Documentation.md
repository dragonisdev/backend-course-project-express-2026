## Documentation of my implementation plan and thought process

## 1. 

### a. Initializing the project

.gitignore 
- .env, 
- node_modules/

Making folders:
- /frontend
- /backend

`cd backend`

Installing the dependencies
`npm install express dotenv bcrypt jsonwebtoken helmet cors express-rate-limit`

Install Drizzle and required MySQL dependencies:
`npm install drizzle-orm mysql2`
`npm install --save-dev drizzle-kit`

Installing swagger
`npm install swagger-jsdoc swagger-ui-express`

Dev dependencies (for testing):
`npm install --save-dev jest supertest nodemon`

Replace the right database URL in dotenv file that prisma generates:
`DATABASE_URL` = `your_url`

Create `drizzle.config.ts`

```
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Replace `src/db/indx.ts` 
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

Define database schema `src/db/schema.ts`
```
import { mysqlTable, int, varchar, boolean, datetime, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const userRoleEnum = mysqlEnum("user_role", ["USER", "ADMIN", "MODERATOR"]);

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  role: userRoleEnum("role").default("USER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
```

Generate migration files
`npx drizzle-kit generate`

Push to database
`npx drizzle-kit push`

