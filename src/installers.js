/**
 * Dependency installation logic
 * Handles npm package installation based on user choices
 */

import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

/**
 * Install all dependencies based on user's choices
 * @param {string} projectPath - Path to the project directory
 * @param {Object} answers - User's answers from prompts
 */
export async function installDependencies(projectPath, answers) {
  // Core dependencies (always installed)
  const coreDependencies = [
    'express',
    'cors',
    'dotenv',
    'helmet',
    'cookie-parser',
    'bcryptjs',
    'jsonwebtoken',
    'express-rate-limit',
    'multer'
  ];

  // Dev dependencies (always installed)
  const devDependencies = [
    'nodemon'
  ];

  // Database-specific dependencies
  const databaseDeps = getDatabaseDependencies(answers.database);

  // Optional dependencies
  const optionalDeps = getOptionalDependencies(answers);

  // Combine all production dependencies
  const allDependencies = [...coreDependencies, ...databaseDeps, ...optionalDeps];

  // Install production dependencies
  if (allDependencies.length > 0) {
    const depSpinner = ora('Installing production dependencies...').start();
    try {
      await execa('npm', ['install', ...allDependencies], {
        cwd: projectPath,
        stdio: 'pipe'
      });
      depSpinner.succeed(chalk.green('Production dependencies installed'));
    } catch (error) {
      depSpinner.fail(chalk.red('Failed to install production dependencies'));
      throw error;
    }
  }

  // Install dev dependencies
  if (devDependencies.length > 0) {
    const devSpinner = ora('Installing dev dependencies...').start();
    try {
      await execa('npm', ['install', '--save-dev', ...devDependencies], {
        cwd: projectPath,
        stdio: 'pipe'
      });
      devSpinner.succeed(chalk.green('Dev dependencies installed'));
    } catch (error) {
      devSpinner.fail(chalk.red('Failed to install dev dependencies'));
      throw error;
    }
  }

  // Special handling for Prisma (if PostgreSQL or MySQL)
  if (answers.database === 'postgresql' || answers.database === 'mysql') {
    await initializePrisma(projectPath, answers.database);
  }
}

/**
 * Get database-specific dependencies
 * @param {string} database - Selected database
 * @returns {Array} List of dependencies
 */
function getDatabaseDependencies(database) {
  switch (database) {
    case 'mongodb':
      return ['mongoose'];
    
    case 'postgresql':
      return ['pg', 'prisma', '@prisma/client'];
    
    case 'mysql':
      return ['mysql2', 'prisma', '@prisma/client'];
    
    default:
      return [];
  }
}

/**
 * Get optional dependencies based on user choices
 * @param {Object} answers - User's answers
 * @returns {Array} List of optional dependencies
 */
function getOptionalDependencies(answers) {
  const deps = [];

  if (answers.includeSwagger) {
    deps.push('swagger-ui-express', 'swagger-jsdoc');
  }

  if (answers.includeZod) {
    deps.push('zod');
  }

  if (answers.includeNodemailer) {
    deps.push('nodemailer');
  }

  return deps;
}

/**
 * Initialize Prisma for PostgreSQL or MySQL
 * @param {string} projectPath - Path to the project directory
 * @param {string} database - Database type
 */
async function initializePrisma(projectPath, database) {
  const prismaSpinner = ora('Initializing Prisma...').start();
  
  try {
    // Initialize Prisma with the correct database provider
    const provider = database === 'postgresql' ? 'postgresql' : 'mysql';
    
    await execa('npx', ['prisma', 'init', '--datasource-provider', provider], {
      cwd: projectPath,
      stdio: 'pipe'
    });
    
    prismaSpinner.text = 'Prisma initialized, generating client...';
    
    // Generate Prisma Client
    await execa('npx', ['prisma', 'generate'], {
      cwd: projectPath,
      stdio: 'pipe'
    });
    
    prismaSpinner.succeed(chalk.green('Prisma initialized and client generated'));
  } catch (error) {
    prismaSpinner.fail(chalk.red('Failed to initialize Prisma'));
    throw error;
  }
}

