import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

db.$connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });

export { db };
