# Setup Database Locally Using Docker

Follow the steps below to set up your database locally using Docker and Prisma.

## 1. Setup Docker Locally for Database

Run the following command to create and start a PostgreSQL container:

```bash
sudo docker run --name leetlab \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=leet-lab-DB \
  -p 5432:5432 \
  -d postgres
```

## 2. Install Prisma as a Dev Dependency

Install Prisma:

```bash
npm install prisma --save-dev
```

## 3. Define Your Schema

Write your model inside `schema.prisma`. Example:

```prisma
model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique
  name   String?
  posts  Post[]
}
```

## 4. Run Migration Command

Run the following to create your initial migration:

```bash
npx prisma migrate dev --name init
```

## 5. Run db push Command

Run the following will push migrations to database:

```bash
npx prisma db push
```

## 6. Install Prisma Client

Install Prisma Client to interact with your database:

```bash
npm install @prisma/client
```

## 7. Run Prisma Studio

Run following command to see database in prisma studio

```bash
npx prisma studio
```

> **Important:** Make sure you import `PrismaClient` correctly from the **generated folder’s `index.js` file**, not from the default `@prisma/client` if you are using a custom output path.
