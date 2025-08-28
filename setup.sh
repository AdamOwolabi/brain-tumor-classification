#!/bin/bash

# Brain Tumor Classification Project Setup Script
echo "Setting up Brain Tumor Classification Project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Setting up Python backend..."

# Setup Python environment
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
mkdir -p models
mkdir -p data
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cp .env.example .env
    print_warning "Please edit .env file with your API keys:"
    print_warning "- GEMINI_API_KEY: Get from Google AI Studio"
    print_warning "- KAGGLE_USERNAME & KAGGLE_KEY: Get from Kaggle API"
fi

cd ..

print_status "Setting up React frontend..."

# Setup Node.js frontend
cd frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    print_status "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Build Tailwind CSS
print_status "Building Tailwind CSS..."
npx tailwindcss build -i src/index.css -o src/output.css

cd ..

print_success "Setup complete!"
echo ""
print_status "Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Download dataset: cd backend && python download_data.py"
echo "3. Train model: python train_model.py"
echo "4. Start backend: uvicorn main:app --reload"
echo "5. Start frontend: cd frontend && npm start"
echo ""
print_warning "Note: Training the model may take 1-2 hours depending on your hardware"
