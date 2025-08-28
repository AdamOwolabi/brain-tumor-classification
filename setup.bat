@echo off
echo Setting up Brain Tumor Classification Project...

REM Check if we're in the right directory
if not exist "README.md" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

echo [INFO] Setting up Python backend...

REM Setup Python environment
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt

REM Create necessary directories
if not exist "models" mkdir models
if not exist "data" mkdir data
if not exist "logs" mkdir logs

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your API keys
)

cd ..

echo [INFO] Setting up React frontend...

REM Setup Node.js frontend
cd frontend

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    exit /b 1
)

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Build Tailwind CSS
echo [INFO] Building Tailwind CSS...
npx tailwindcss build -i src/index.css -o src/output.css

cd ..

echo [SUCCESS] Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your API keys
echo 2. Download dataset: cd backend && python download_data.py
echo 3. Train model: python train_model.py
echo 4. Start backend: uvicorn main:app --reload
echo 5. Start frontend: cd frontend && npm start
