import { PrismaClient } from '@prisma/client';

import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const { TIDB_USER, TIDB_PASSWORD, TIDB_HOST, TIDB_PORT, TIDB_DB_NAME = 'db', DATABASE_URL } = process.env;
// Notice: When using TiDb Cloud Serverless Tier, you **MUST** set the following flags to enable tls connection.
const SSL_FLAGS = 'pool_timeout=60&sslaccept=accept_invalid_certs';
// TODO: When TiDB Cloud support return DATABASE_URL, we can remove it.
const databaseURL = DATABASE_URL
    ? `${DATABASE_URL}?${SSL_FLAGS}`
    : `mysql://${TIDB_USER}:${TIDB_PASSWORD}@${TIDB_HOST}:${TIDB_PORT}/${TIDB_DB_NAME}?${SSL_FLAGS}`;

const setup = async () => {
  let client;

  try {
    client = new PrismaClient({
      datasources: {
        db: {
          url: databaseURL
        }
      }
    });
    await client.$connect();

    const hasData = await client.user.count() > 0;

    if (hasData) {
      console.log('Database already exists with data');
      client.$disconnect();
      return;
    }

    // Seed data.
    const users = await seedUsers(client, 20);
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      await client.$disconnect();
    }
  }
};

// Seed users data.
async function seedUsers(client, num) {
  const records = [...Array(num)].map((value, index) => {
    const id = index + 1;
    const nickname = faker.internet.userName();
    const balance = faker.random.numeric(6);

    return {
      id,
      nickname,
      balance
    };
  });

  const added = await client.user.createMany({
      data: records,
      skipDuplicates: true
  });

  if (added.count > 0) {
    console.log(`Successfully inserted ${added.count} user records.`);
  }

  return records;
}

try {
  await setup();
  console.log('Setup completed.');
} catch(error) {
  console.warn('Database is not ready yet. Skipping seeding...\n', error);
}

export { setup };