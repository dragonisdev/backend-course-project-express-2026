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

Installing old prisma client for better support. I chose to use Prisma 6.x because it is a stable, well-documented ORM with mature tooling. 7.x rewrites the stuff apparently.
`npm install prisma@6 @prisma/client@6`

Installing swagger
`npm install swagger-jsdoc swagger-ui-express`

Dev dependencies (for testing):
`npm install --save-dev jest supertest nodemon`

Setting up prisma with remote MySQL server
`npx prisma init`

Replace the right database URL in dotenv file that prisma generates:
`DATABASE_URL` = `your_url`

Replace schema.prisma
```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  USER
  ADMIN
  MODERATOR
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255) // Stores bcrypt hash (60 chars, but 255 for future-proofing)
  name      String?  @db.VarChar(100)
  role      UserRole @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@map("users") // Maps to 'users' table in database
}
```

We will test our connection by pushing our schema
`npx prisma db push`

After first verification we will do `npx prisma migrate dev --name` to track changes

Generate prisma client in the backend which we will use for interacting with the db instead of raw queries
`npx prisma generate`


