# 🚀 Express Backend Starter CLI

A production-ready CLI tool to scaffold Express.js/Node.js backend projects in seconds.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🎯 **Interactive Setup** - Guided prompts for project configuration
- 🗄️ **Multiple Databases** - MongoDB, PostgreSQL, or MySQL support
- 📚 **Swagger Docs** - Auto-generated API documentation
- ✅ **Zod Validation** - Type-safe request validation
- 📧 **Email Support** - Nodemailer integration
- 🔒 **Security First** - Helmet, CORS, rate limiting, JWT auth
- 📁 **Clean Architecture** - Professional folder structure
- ⚡ **Production Ready** - Best practices built-in

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx express-backend-starter
```

### Or Install Globally

```bash
npm install -g express-backend-starter
express-backend-starter
```

## 📋 What Gets Generated?

### Always Included

- ✅ Express.js server setup
- ✅ JWT authentication middleware
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Cookie parser
- ✅ Bcrypt password hashing
- ✅ File upload with Multer
- ✅ Environment configuration
- ✅ Professional folder structure

### Database Options

- **MongoDB** → Mongoose ORM
- **PostgreSQL** → Prisma ORM
- **MySQL** → Prisma ORM

### Optional Features

- 📚 **Swagger** → API documentation UI
- ✅ **Zod** → Runtime validation
- 📧 **Nodemailer** → Email functionality

## 🎬 Demo

```bash
$ npx express-backend-starter

🚀 Welcome to Express Backend Starter CLI

Let's scaffold your backend project...

? What is your project name? my-awesome-api
? Which database do you want to use? MongoDB
? Include Swagger documentation? Yes
? Include Zod validation? Yes
? Include Nodemailer for email functionality? No

✅ Project created successfully!

Next steps:
  cd my-awesome-api
  npm run dev

Happy coding! 🎉
```

## 📁 Generated Project Structure

```
my-awesome-api/
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── src/
    ├── app.js                    # Main application
    ├── config/
    │   ├── db.js                 # Database connection
    │   └── swagger.js            # Swagger config (optional)
    ├── controllers/
    │   └── healthController.js   # Sample controller
    ├── middleware/
    │   ├── auth.js              # JWT authentication
    │   └── errorHandler.js      # Global error handler
    ├── models/
    │   └── User.js              # Sample model
    ├── routes/
    │   └── healthRoutes.js      # Sample routes
    ├── services/                 # Business logic
    └── utils/
        └── validation.js         # Zod schemas (optional)
```

## 🛠️ Tech Stack

- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, express-rate-limit
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Database ORMs:** Mongoose (MongoDB) or Prisma (PostgreSQL/MySQL)
- **Documentation:** Swagger (optional)
- **Validation:** Zod (optional)
- **Email:** Nodemailer (optional)

## 📖 Usage

### 1. Run the CLI

```bash
npx express-backend-starter
```

### 2. Answer the Prompts

The CLI will ask you:
- Project name
- Database choice (MongoDB/PostgreSQL/MySQL)
- Include Swagger? (y/n)
- Include Zod? (y/n)
- Include Nodemailer? (y/n)

### 3. Navigate to Your Project

```bash
cd your-project-name
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 5. For Prisma (PostgreSQL/MySQL)

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start Development

```bash
npm run dev
```

Your server will be running at `http://localhost:5000`

## 🌐 API Endpoints

Generated project includes:

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/health/info` - Server info
- `GET /api-docs` - Swagger UI (if enabled)

## 🔧 Available Scripts

```json
{
  "dev": "nodemon src/app.js",    // Development with auto-reload
  "start": "node src/app.js"       // Production start
}
```

## 🔐 Environment Variables

The generated `.env.example` includes:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Database URLs (based on your choice)
MONGO_URI=mongodb://localhost:27017/dbname
# or
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@email.com
# ... and more
```

## 📚 Documentation

For detailed development guide, see [devGuide.md](./devGuide.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

Built with:
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [Chalk](https://github.com/chalk/chalk)
- [Ora](https://github.com/sindresorhus/ora)
- [Execa](https://github.com/sindresorhus/execa)

## 💬 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for the Node.js community**
