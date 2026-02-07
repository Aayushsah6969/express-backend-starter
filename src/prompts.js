/**
 * Interactive prompts for user input
 * Uses inquirer to ask questions about project setup
 */

import inquirer from 'inquirer';

/**
 * Get all user input through interactive prompts
 * @returns {Promise<Object>} User's answers
 */
export async function getUserInput() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-backend-project',
      validate: (input) => {
        // Validate project name (npm package naming rules)
        if (!input || input.trim().length === 0) {
          return 'Project name cannot be empty';
        }
        
        if (!/^[a-z0-9-_]+$/.test(input)) {
          return 'Project name can only contain lowercase letters, numbers, hyphens, and underscores';
        }
        
        return true;
      },
      filter: (input) => input.trim().toLowerCase()
    },
    {
      type: 'list',
      name: 'database',
      message: 'Which database do you want to use?',
      choices: [
        { name: '📦 MongoDB', value: 'mongodb' },
        { name: '🐘 PostgreSQL', value: 'postgresql' },
        { name: '🐬 MySQL', value: 'mysql' }
      ],
      default: 'mongodb'
    },
    {
      type: 'confirm',
      name: 'includeSwagger',
      message: 'Include Swagger documentation?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeZod',
      message: 'Include Zod validation?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeNodemailer',
      message: 'Include Nodemailer for email functionality?',
      default: false
    }
  ]);

  return answers;
}

