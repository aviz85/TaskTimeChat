import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const sqlite = new Database(process.env.DATABASE_URL!.replace('sqlite://', ''));
  const db = drizzle(sqlite);

  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: 'drizzle' });
  
  console.log('Migrations completed successfully!');
  
  sqlite.close();
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
}); 