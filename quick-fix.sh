#!/bin/bash

echo "Quick Fix for TypeScript/React Issues..."

# Navigate to frontend directory
cd frontend

# Install essential dependencies first to fix import errors
echo "Installing essential React dependencies..."
npm install --save react react-dom react-scripts
npm install --save-dev @types/react @types/react-dom @types/node typescript

# Install other dependencies
echo "Installing additional dependencies..."
npm install --save axios react-router-dom react-dropzone framer-motion
npm install --save-dev tailwindcss autoprefixer postcss @heroicons/react @tailwindcss/forms recharts

echo "Dependencies installed!"
echo ""
echo "The TypeScript errors should now be resolved."
echo "Run 'npm start' to start the development server."

cd ..
