# 🧪 Local Testing Guide for Express Backend Starter CLI

This guide will help you test the Express Backend Starter CLI tool on your local machine before publishing to npm.

## 📋 Prerequisites

Before testing, ensure you have:
- Node.js (v14 or higher) installed
- npm installed
- A terminal/command prompt
- Git (optional, for version control)

## 🔧 Setup Steps

### 1. Navigate to the Project Directory

```bash
cd /home/aayushdai/Desktop/Projects/Mern-Starter
```

### 2. Install Dependencies

Install all required dependencies for the CLI tool itself:

```bash
npm install
```

This will install:
- chalk (terminal colors)
- commander (CLI framework)
- execa (process execution)
- fs-extra (file system utilities)
- inquirer (interactive prompts)
- ora (loading spinners)

### 3. Link the Package Locally

Link the package to make it available globally on your machine:

```bash
npm link
```

This creates a symlink in your global `node_modules` directory, allowing you to run the CLI command from anywhere.

**Expected output:**
```
added 1 package in Xs
```

## 🚀 Testing the CLI

### Test 1: Run the CLI Command

After linking, you can run the CLI from anywhere:

```bash
express-backend-starter
```

**What should happen:**
1. You'll see a welcome message: "🚀 Welcome to Express Backend Starter CLI"
2. Interactive prompts will ask you questions
3. Answer each prompt to test the flow

### Test 2: Test with Different Options

Create multiple test projects with different configurations:

#### MongoDB + All Features
```bash
# Run the CLI
express-backend-starter

# Answer the prompts:
# - Project name: test-mongo-project
# - Database: MongoDB
# - Include Swagger? Yes
# - Include Zod? Yes
# - Include Nodemailer? Yes
```

#### PostgreSQL + Basic Setup
```bash
# Run the CLI again
express-backend-starter

# Answer the prompts:
# - Project name: test-postgres-project
# - Database: PostgreSQL
# - Include Swagger? No
# - Include Zod? No
# - Include Nodemailer? No
```

#### MySQL + Partial Features
```bash
# Run the CLI again
express-backend-starter

# Answer the prompts:
# - Project name: test-mysql-project
# - Database: MySQL
# - Include Swagger? Yes
# - Include Zod? No
# - Include Nodemailer? Yes
```

### Test 3: Verify Generated Projects

For each generated project, verify the structure:

```bash
cd test-mongo-project
ls -la
```

**Expected structure:**
```
test-mongo-project/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── node_modules/
└── src/
    ├── app.js
    ├── config/
    │   ├── db.js
    │   └── swagger.js (if Swagger enabled)
    ├── controllers/
    │   └── healthController.js
    ├── middleware/
    │   ├── auth.js
    │   └── errorHandler.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── healthRoutes.js
    ├── services/
    └── utils/
        └── validation.js (if Zod enabled)
```

### Test 4: Run the Generated Project

Test if the generated project actually works:

```bash
# Navigate to generated project
cd test-mongo-project

# Set up environment
cp .env.example .env

# Edit .env file (use your favorite editor)
nano .env
# or
vim .env
# or
code .env

# Update MongoDB URI (example):
# MONGO_URI=mongodb://localhost:27017/test-mongo-project
```

**Start the server:**
```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected: localhost
📚 API Docs: http://localhost:5000/api-docs (if Swagger enabled)
```

### Test 5: Test API Endpoints

While the server is running, test the endpoints:

```bash
# Open a new terminal and test the health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "success": true,
#   "message": "Server is healthy",
#   "timestamp": "2026-02-07T...",
#   "uptime": 5.123
# }

# Test server info endpoint
curl http://localhost:5000/api/health/info

# Test Swagger docs (if enabled) - open in browser:
# http://localhost:5000/api-docs
```

## 🧹 Cleanup After Testing

### Remove Test Projects

```bash
# Navigate back to your projects directory
cd /home/aayushdai/Desktop/Projects

# Remove test projects
rm -rf test-mongo-project
rm -rf test-postgres-project
rm -rf test-mysql-project
```

### Unlink the Package

When you're done testing and want to remove the global link:

```bash
# Navigate to the CLI project directory
cd /home/aayushdai/Desktop/Projects/Mern-Starter

# Unlink
npm unlink -g
```

## ✅ Testing Checklist

Use this checklist to ensure thorough testing:

- [ ] CLI runs without errors
- [ ] All prompts display correctly
- [ ] Project name validation works (try invalid names)
- [ ] All database options generate correct configs
- [ ] MongoDB project includes Mongoose
- [ ] PostgreSQL/MySQL projects include Prisma
- [ ] Swagger files generate when selected
- [ ] Zod validation files generate when selected
- [ ] Nodemailer config generates when selected
- [ ] package.json has correct scripts
- [ ] .env.example includes all necessary variables
- [ ] .gitignore is present
- [ ] Generated project installs dependencies
- [ ] Generated project starts successfully
- [ ] Health endpoints respond correctly
- [ ] No naming conflicts (all references say "express-backend-starter")

## 🐛 Common Issues and Solutions

### Issue 1: "Command not found: express-backend-starter"

**Solution:**
```bash
# Re-link the package
cd /home/aayushdai/Desktop/Projects/Mern-Starter
npm link
```

### Issue 2: "Directory already exists"

**Solution:**
```bash
# Remove the existing directory
rm -rf existing-project-name
# Or choose a different project name
```

### Issue 3: MongoDB Connection Error

**Solution:**
```bash
# Ensure MongoDB is running
sudo systemctl status mongodb
# or
sudo systemctl start mongodb
```

### Issue 4: Port Already in Use

**Solution:**
```bash
# Change port in .env file
PORT=5001

# Or kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue 5: Permission Errors

**Solution:**
```bash
# Fix permissions
chmod +x bin/cli.js
```

## 📊 Testing Different Scenarios

### Scenario 1: Testing Validation
Try entering invalid project names:
- Empty name
- Name with spaces: "my project"
- Name with uppercase: "MyProject"
- Name with special chars: "my@project"

All should be rejected with appropriate error messages.

### Scenario 2: Testing Database Connections

For **MongoDB**:
```bash
# Start MongoDB
sudo systemctl start mongodb

# Verify it's running
mongosh
> show dbs
> exit
```

For **PostgreSQL**:
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Create test database
sudo -u postgres createdb test_db
```

For **MySQL**:
```bash
# Start MySQL
sudo systemctl start mysql

# Create test database
mysql -u root -p
> CREATE DATABASE test_db;
> exit
```

### Scenario 3: Testing Prisma (PostgreSQL/MySQL)

```bash
cd test-postgres-project

# Initialize Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Start server
npm run dev
```

## 📝 Testing Log Template

Keep a log of your tests:

```
Test Date: ___________
Test Environment: Linux / Mac / Windows
Node Version: ___________

Test 1 - MongoDB + All Features:
- CLI Run: ✅ / ❌
- Project Generated: ✅ / ❌
- Dependencies Installed: ✅ / ❌
- Server Started: ✅ / ❌
- API Responded: ✅ / ❌
- Notes: _________________

Test 2 - PostgreSQL + Basic:
- CLI Run: ✅ / ❌
- Project Generated: ✅ / ❌
- Dependencies Installed: ✅ / ❌
- Prisma Setup: ✅ / ❌
- Server Started: ✅ / ❌
- API Responded: ✅ / ❌
- Notes: _________________

Test 3 - MySQL + Partial:
- CLI Run: ✅ / ❌
- Project Generated: ✅ / ❌
- Dependencies Installed: ✅ / ❌
- Prisma Setup: ✅ / ❌
- Server Started: ✅ / ❌
- API Responded: ✅ / ❌
- Notes: _________________
```

## 🚀 Ready to Publish?

Once all tests pass:

1. **Update version** in package.json if needed
2. **Create npm account** (if you don't have one)
3. **Login to npm**:
   ```bash
   npm login
   ```
4. **Publish** (dry run first):
   ```bash
   npm publish --dry-run
   ```
5. **Actually publish**:
   ```bash
   npm publish
   ```

## 📧 Support

If you encounter issues during testing:
- Check the error messages carefully
- Verify all prerequisites are installed
- Review the generated files for any inconsistencies
- Check this guide for common issues

---

**Happy Testing! 🎉**
