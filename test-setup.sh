#!/bin/bash

# Quick Test Script for Express Backend Starter CLI
# This script helps you test the CLI tool locally

echo "🧪 Express Backend Starter CLI - Quick Test Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the express-backend-starter project root"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔗 Step 2: Linking CLI globally..."
npm link

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 You can now test the CLI with:"
echo "   express-backend-starter"
echo ""
echo "🧪 Suggested test sequence:"
echo ""
echo "Test 1: MongoDB + All Features"
echo "   cd ~/Desktop && express-backend-starter"
echo "   Project name: test-mongo-app"
echo "   Database: MongoDB"
echo "   Swagger: Yes"
echo "   Zod: Yes"
echo "   Nodemailer: Yes"
echo ""
echo "Test 2: PostgreSQL + Minimal"
echo "   cd ~/Desktop && express-backend-starter"
echo "   Project name: test-postgres-app"
echo "   Database: PostgreSQL"
echo "   Swagger: No"
echo "   Zod: No"
echo "   Nodemailer: No"
echo ""
echo "Test 3: MySQL + Swagger Only"
echo "   cd ~/Desktop && express-backend-starter"
echo "   Project name: test-mysql-app"
echo "   Database: MySQL"
echo "   Swagger: Yes"
echo "   Zod: No"
echo "   Nodemailer: No"
echo ""
echo "📚 For detailed testing guide, see LOCAL-TESTING-GUIDE.md"
echo ""
echo "🚀 Ready to test! Run: express-backend-starter"
