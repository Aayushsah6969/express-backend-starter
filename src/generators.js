/**
 * Project structure and file generation
 * Creates folders and files for the new project
 */

import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getDbConfig } from './db-config.js';
import * as templates from './templates/index.js';

/**
 * Generate the complete project structure
 * @param {string} projectPath - Path to the project directory
 * @param {Object} answers - User's answers from prompts
 */
export async function generateProject(projectPath, answers) {
  const spinner = ora('Generating project structure...').start();

  try {
    // Create folder structure
    await createFolderStructure(projectPath);
    spinner.text = 'Folder structure created';

    // Generate configuration files
    await generateConfigFiles(projectPath, answers);
    spinner.text = 'Configuration files created';

    // Generate source files
    await generateSourceFiles(projectPath, answers);
    spinner.text = 'Source files created';

    // Generate README
    await generateReadme(projectPath, answers);

    spinner.succeed(chalk.green('Project structure generated'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate project structure'));
    throw error;
  }
}

/**
 * Create the folder structure
 * @param {string} projectPath - Path to the project directory
 */
async function createFolderStructure(projectPath) {
  const folders = [
    'src',
    'src/controllers',
    'src/routes',
    'src/middleware',
    'src/config',
    'src/services',
    'src/models',
    'src/utils'
  ];

  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }
}

/**
 * Generate configuration files
 * @param {string} projectPath - Path to the project directory
 * @param {Object} answers - User's answers
 */
async function generateConfigFiles(projectPath, answers) {
  // .env.example
  const envExample = templates.generateEnvExample(answers);
  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);

  // .gitignore
  const gitignore = templates.generateGitignore();
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Database configuration
  const dbConfig = getDbConfig(answers.database);
  await fs.writeFile(path.join(projectPath, 'src/config/db.js'), dbConfig);
}

/**
 * Generate source files
 * @param {string} projectPath - Path to the project directory
 * @param {Object} answers - User's answers
 */
async function generateSourceFiles(projectPath, answers) {
  // Main app.js
  const appJs = templates.generateAppJs(answers);
  await fs.writeFile(path.join(projectPath, 'src/app.js'), appJs);

  // Sample controller
  const sampleController = templates.generateSampleController();
  await fs.writeFile(path.join(projectPath, 'src/controllers/healthController.js'), sampleController);

  // Sample route
  const sampleRoute = templates.generateSampleRoute();
  await fs.writeFile(path.join(projectPath, 'src/routes/healthRoutes.js'), sampleRoute);

  // Error middleware
  const errorMiddleware = templates.generateErrorMiddleware();
  await fs.writeFile(path.join(projectPath, 'src/middleware/errorHandler.js'), errorMiddleware);

  // Auth middleware (JWT)
  const authMiddleware = templates.generateAuthMiddleware();
  await fs.writeFile(path.join(projectPath, 'src/middleware/auth.js'), authMiddleware);

  // Swagger configuration (if selected)
  if (answers.includeSwagger) {
    const swaggerConfig = templates.generateSwaggerConfig(answers);
    await fs.writeFile(path.join(projectPath, 'src/config/swagger.js'), swaggerConfig);
  }

  // Nodemailer configuration (if selected)
  if (answers.includeNodemailer) {
    const nodemailerConfig = templates.generateNodemailerConfig();
    await fs.writeFile(path.join(projectPath, 'src/config/nodemailer.js'), nodemailerConfig);
  }

  // Zod validation example (if selected)
  if (answers.includeZod) {
    const zodExample = templates.generateZodValidation();
    await fs.writeFile(path.join(projectPath, 'src/utils/validation.js'), zodExample);
  }

  // Sample model (database-specific)
  if (answers.database === 'mongodb') {
    const userModel = templates.generateMongooseModel();
    await fs.writeFile(path.join(projectPath, 'src/models/User.js'), userModel);
  }
}

/**
 * Generate README.md
 * @param {string} projectPath - Path to the project directory
 * @param {Object} answers - User's answers
 */
async function generateReadme(projectPath, answers) {
  const readme = templates.generateReadme(answers);
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}
