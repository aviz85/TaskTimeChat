import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env file");
}

const sqlite = new Database(process.env.DATABASE_URL.replace("sqlite://", ""));
export const db = drizzle(sqlite, { schema });
