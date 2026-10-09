import { neon } from "@neondatabase/serverless";

// Lazy so `next build` never needs a database connection.
export const sql = (strings, ...values) => neon(process.env.DATABASE_URL)(strings, ...values);
