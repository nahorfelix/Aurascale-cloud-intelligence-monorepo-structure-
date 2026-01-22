import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// This path must match your folder structure exactly
import { PrismaClient } from '../generated/client.ts';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;