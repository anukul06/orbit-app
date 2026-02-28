#!/bin/bash
# Build script for Render deployment
# Builds React frontend and copies to Flask static folder

set -e

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📦 Installing Node.js dependencies..."
cd frontend
npm install

echo "🔨 Building React frontend..."
npm run build

echo "📁 Copying build to Flask static folder..."
cd ..
rm -rf static
cp -r frontend/dist static

echo "✅ Build complete — static folder ready"
