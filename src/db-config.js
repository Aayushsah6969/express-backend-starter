/**
 * Database configuration templates
 * Provides database connection setup for different databases
 */

/**
 * Get database configuration based on database type
 * @param {string} database - Database type (mongodb, postgresql, mysql)
 * @returns {string} Database configuration code
 */
export function getDbConfig(database) {
  switch (database) {
    case 'mongodb':
      return getMongoDbConfig();
    
    case 'postgresql':
      return getPostgreSQLConfig();
    
    case 'mysql':
      return getMySQLConfig();
    
    default:
      return getMongoDbConfig();
  }
}

/**
 * MongoDB configuration with Mongoose
 */
function getMongoDbConfig() {
  return `/**
 * MongoDB Database Configuration
 * Using Mongoose ORM
 */

import mongoose from 'mongoose';
import chalk from 'chalk';

/**
 * Connect to MongoDB database
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ no longer needs these options:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(chalk.green.bold(\`✅ MongoDB Connected: \${conn.connection.host}\`));
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error(chalk.red('MongoDB connection error:'), err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow('MongoDB disconnected'));
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log(chalk.yellow('MongoDB connection closed due to app termination'));
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red.bold('❌ MongoDB connection failed:'), error.message);
    process.exit(1);
  }
}
`;
}

/**
 * PostgreSQL configuration with Prisma
 */
function getPostgreSQLConfig() {
  return `/**
 * PostgreSQL Database Configuration
 * Using Prisma ORM
 */

import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

/**
 * Connect to PostgreSQL database
 */
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log(chalk.green.bold('✅ PostgreSQL Connected via Prisma'));

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log(chalk.yellow('PostgreSQL connection closed due to app termination'));
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red.bold('❌ PostgreSQL connection failed:'), error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Export prisma instance for use in other modules
export { prisma };
`;
}

/**
 * MySQL configuration with Prisma
 */
function getMySQLConfig() {
  return `/**
 * MySQL Database Configuration
 * Using Prisma ORM
 */

import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

/**
 * Connect to MySQL database
 */
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log(chalk.green.bold('✅ MySQL Connected via Prisma'));

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log(chalk.yellow('MySQL connection closed due to app termination'));
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red.bold('❌ MySQL connection failed:'), error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Export prisma instance for use in other modules
export { prisma };
`;
}
