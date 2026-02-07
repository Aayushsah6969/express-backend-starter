/**
 * Template generator functions
 * Contains all template generation logic for project files
 */

/**
 * Generate .env.example file
 */
export function generateEnvExample(answers) {
  let envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

`;

  // Database-specific environment variables
  if (answers.database === 'mongodb') {
    envContent += `# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/your_database_name

`;
  } else if (answers.database === 'postgresql') {
    envContent += `# PostgreSQL Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"

`;
  } else if (answers.database === 'mysql') {
    envContent += `# MySQL Configuration
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"

`;
  }

  // Optional configurations
  if (answers.includeNodemailer) {
    envContent += `# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com

`;
  }

  envContent += `# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  return envContent;
}

/**
 * Generate .gitignore file
 */
export function generateGitignore() {
  return `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Testing
coverage/
.nyc_output

# Build files
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/
public/uploads/

# Prisma
prisma/migrations/
`;
}

/**
 * Generate main app.js file
 */
export function generateAppJs(answers) {
  let imports = `/**
 * Main Application Entry Point
 * Express.js server with all configurations
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
`;

  if (answers.includeSwagger) {
    imports += `import { swaggerUi, swaggerSpec } from './config/swagger.js';\n`;
  }

  let appSetup = `
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
`;

  if (answers.includeSwagger) {
    appSetup += `
// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
`;
  }

  appSetup += `
// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ${answers.projectName} API',
    version: '1.0.0'
  });
});

app.use('/api/health', healthRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📝 Environment: \${process.env.NODE_ENV || 'development'}\`);`;

  if (answers.includeSwagger) {
    appSetup += `\n  console.log(\`📚 API Docs: http://localhost:\${PORT}/api-docs\`);\n`;
  }

  appSetup += `});

export default app;
`;

  return imports + appSetup;
}

/**
 * Generate sample health controller
 */
export function generateSampleController() {
  return `/**
 * Health Check Controller
 * Simple endpoints to verify server is running
 */

/**
 * @desc    Get server health status
 * @route   GET /api/health
 * @access  Public
 */
export const healthCheck = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

/**
 * @desc    Get detailed server info
 * @route   GET /api/health/info
 * @access  Public
 */
export const serverInfo = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        total: \`\${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB\`,
        used: \`\${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\`
      },
      uptime: \`\${Math.floor(process.uptime())}s\`
    }
  });
};
`;
}

/**
 * Generate sample routes
 */
export function generateSampleRoute() {
  return `/**
 * Health Routes
 * Routes for health check endpoints
 */

import express from 'express';
import { healthCheck, serverInfo } from '../controllers/healthController.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/', healthCheck);

/**
 * @swagger
 * /api/health/info:
 *   get:
 *     summary: Get server information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server information
 */
router.get('/info', serverInfo);

export default router;
`;
}

/**
 * Generate error handling middleware
 */
export function generateErrorMiddleware() {
  return `/**
 * Global Error Handler Middleware
 * Catches and formats all errors
 */

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async handler wrapper to avoid try-catch blocks
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
`;
}

/**
 * Generate auth middleware
 */
export function generateAuthMiddleware() {
  return `/**
 * Authentication Middleware
 * JWT-based authentication
 */

import jwt from 'jsonwebtoken';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
`;
}

/**
 * Generate Swagger configuration
 */
export function generateSwaggerConfig(answers) {
  return `/**
 * Swagger API Documentation Configuration
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '${answers.projectName} API',
      version: '1.0.0',
      description: 'API documentation for ${answers.projectName}',
      contact: {
        name: 'API Support',
        email: 'support@${answers.projectName}.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
`;
}

/**
 * Generate Nodemailer configuration
 */
export function generateNodemailerConfig() {
  return `/**
 * Nodemailer Email Configuration
 */

import nodemailer from 'nodemailer';

/**
 * Create email transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email function
 * @param {Object} options - Email options
 */
export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default transporter;
`;
}

/**
 * Generate Zod validation example
 */
export function generateZodValidation() {
  return `/**
 * Zod Validation Schemas
 * Type-safe validation for request data
 */

import { z } from 'zod';

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Validation middleware wrapper
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
`;
}

/**
 * Generate Mongoose User model
 */
export function generateMongooseModel() {
  return `/**
 * User Model (Mongoose)
 * MongoDB user schema and model
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
`;
}

/**
 * Generate README.md
 */
export function generateReadme(answers) {
  let readme = `# ${answers.projectName}

Backend project generated by Express Backend Starter CLI

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
`;

  if (answers.database === 'mongodb') {
    readme += `- MongoDB installed and running\n`;
  } else if (answers.database === 'postgresql') {
    readme += `- PostgreSQL installed and running\n`;
  } else if (answers.database === 'mysql') {
    readme += `- MySQL installed and running\n`;
  }

  readme += `
### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create a \`.env\` file from \`.env.example\`:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update the \`.env\` file with your configuration

`;

  if (answers.database === 'postgresql' || answers.database === 'mysql') {
    readme += `4. Run Prisma migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Generate Prisma Client:
\`\`\`bash
npx prisma generate
\`\`\`

`;
  }

  readme += `### Running the Application

Development mode with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

## 📦 Tech Stack

- **Framework:** Express.js
- **Database:** ${answers.database.charAt(0).toUpperCase() + answers.database.slice(1)}
`;

  if (answers.database === 'mongodb') {
    readme += `- **ORM:** Mongoose\n`;
  } else {
    readme += `- **ORM:** Prisma\n`;
  }

  readme += `- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, Rate Limiting
- **File Upload:** Multer
`;

  if (answers.includeSwagger) {
    readme += `- **Documentation:** Swagger/OpenAPI\n`;
  }

  if (answers.includeZod) {
    readme += `- **Validation:** Zod\n`;
  }

  if (answers.includeNodemailer) {
    readme += `- **Email:** Nodemailer\n`;
  }

  readme += `
## 📁 Project Structure

\`\`\`
src/
├── config/          # Configuration files (DB, Swagger, etc.)
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Utility functions
\`\`\`

## 🔑 Environment Variables

See \`.env.example\` for all required environment variables.

## 📚 API Documentation

`;

  if (answers.includeSwagger) {
    readme += `Swagger documentation is available at: \`http://localhost:5000/api-docs\`

`;
  } else {
    readme += `API documentation coming soon...

`;
  }

  readme += `## 🛡️ Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Password hashing with bcrypt
- Cookie parser

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
`;

  return readme;
}
