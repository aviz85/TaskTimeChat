import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env file");
}

// נתיב מלא לדאטהבייס
const dbPath = path.resolve(process.cwd(), process.env.DATABASE_URL);
console.log('Connecting to database at:', dbPath);  // לדיבוג

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
