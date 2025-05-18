import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: './server/.env' });

export default {
  schema: './shared/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:Sandeep777@localhost:5432/ecofinds',
  },
} satisfies Config;