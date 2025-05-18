import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "shared/schema.ts";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

let connectionString: string;
if (process.env.DATABASE_URL) {
    connectionString = process.env.DATABASE_URL;
} else {
    // Default local connection if DATABASE_URL is not set
    connectionString = 'postgres://postgres:Sandeep777@localhost:5432/ecofinds';
}

console.log("Attempting to connect to database...");

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

// Test the connection
pool.connect()
    .then(() => console.log("Successfully connected to PostgreSQL"))
    .catch(err => console.error("Error connecting to PostgreSQL:", err));
