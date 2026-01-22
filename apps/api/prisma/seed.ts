import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

// Import from the exact file you confirmed exists
import { PrismaClient, ResourceStatus } from '../src/generated/client.ts';

// Initialize the Adapter (Required in Prisma 7)
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 AuraScale: Starting Database Seed...');

  try {
    // 1. Clean old data (Order matters for foreign keys)
    console.log('🧹 Cleaning existing records...');
    await prisma.costMetric.deleteMany();
    await prisma.resource.deleteMany();

    // Update this section in your seed.ts
const services = [
  { name: 'Core-API-Gateway', type: 'Microservice', provider: 'AWS' },
  { name: 'Global-Edge-Cache', type: 'CDN', provider: 'Cloudflare' },
  { name: 'User-Auth-Service', type: 'Microservice', provider: 'Azure' },
  { name: 'BigQuery-Analytics', type: 'Database', provider: 'GCP' },
  { name: 'S3-User-Assets', type: 'Storage', provider: 'AWS' }
];

    console.log('🛰️ Generating fresh cloud data...');

    for (const svc of services) {
      // FIX: Explicitly map every field to ensure none are 'undefined'
      const resource = await prisma.resource.create({
        data: {
          name: svc.name,
          type: svc.type,
          provider: svc.provider,
          environment: 'Production',
          status: ResourceStatus.HEALTHY,
        }
      });

      // 3. Create a cost metric for each resource
      await prisma.costMetric.create({
        data: {
          amount: faker.number.float({ min: 100, max: 2000, fractionDigits: 2 }),
          timestamp: new Date(),
          resourceId: resource.id,
        }
      });
      console.log(`✅ Success: ${svc.name}`);
    }

    console.log('✨ AuraScale: Seeding successful!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Close the PG pool
  }
}

main();