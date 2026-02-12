## Documentation of my implementation plan and thought process

## 1a. Initializing the project

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
- `npm install --save-dev drizzle-kit typescript tsx nodemon jest supertest @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors @types/swagger-jsdoc @types/swagger-ui-express`

Initialize typescript
`npx tsc --init`

AI generated docs to make this thing work (Claude Sonnet 4.5):
**Critical Configuration Updates (Required for the project to work):**

1. **Update package.json** - Add ES module support and scripts:
```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

2. **Update tsconfig.json** - Uncomment and configure build settings, plus exclude config files:
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "types": ["node"],
    "lib": ["esnext"],
    // ... other options
  },
  "exclude": [
    "drizzle.config.ts",
    "node_modules",
    "dist"
  ]
}
```

**Why these are required:**
- `"type": "module"` enables ES module imports/exports (required by your tsconfig)
- Scripts provide dev/build/start commands (no project works without these)
- `exclude` prevents TypeScript from processing config files outside src/
- `rootDir`/`outDir` ensure proper compilation structure

## 1b. Configuring drizzle

Create `drizzle.config.ts` in root of backend folder

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
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

## 1c. Applying migrations

Generate migration files from schema
`npx drizzle-kit generate`


Apply migrations to the database
`npx drizzle-kit migrate`

To view our database, we must use mysql client or DBeaver because Aiven doesn't have any SQL editor (for some reason hmm...)

You can either 
- `mysql --host=[HOSTNAME] --port=[PORT] --user=[USERNAME] --password --database defaultdb`
- `SHOW TABLES`

Or use DBeaver and set up your connection with the right parameters and test your connection. After which you will be able to see your tables:

<img src="screenshots/1.png" alt=""/>

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

## 2a. Setting up Express

Create `.env` file and include:
```
PORT=3000
JWT_SECRET=your-secret-key-here
DATABASE_URL=mysql://username:password@host:port/database
```

Create `src/app.ts` for Express application setup:
```
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Course Project API',
      version: '1.0.0',
      description: 'API documentation for the Express backend project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.{ts,js}'], // Handles both dev (.ts) and production (.js)
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes will be added here
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

export default app;
```

Create `src/server.ts` to start the server:
```
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Update `package.json` scripts:
```
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Create `nodemon.json` in backend root:
```
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "tsx src/server.ts"
}
```

Run the development server:
`npm run dev`

Once the server is running, you can access the Swagger API documentation at http://localhost:3000/api-docs


If this runs for you then you're lucky. Now we can actually start writing code.