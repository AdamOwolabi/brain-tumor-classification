# Setup Scripts and Instructions

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Download dataset (requires Kaggle API setup)
python download_data.py

# Train the model
python train_model.py

# Start the API server
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Setup

### Kaggle API Setup
1. Create a Kaggle account at https://kaggle.com
2. Go to Account → API → Create New API Token
3. Download `kaggle.json` to `~/.kaggle/`
4. Run: `chmod 600 ~/.kaggle/kaggle.json`

### Gemini API Setup
1. Get API key from Google AI Studio
2. Add to `.env` file: `GEMINI_API_KEY=your_key_here`

## Project Structure
```
brainTumor/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── train_model.py       # Model training
│   ├── download_data.py     # Dataset download
│   ├── saliency_maps.py     # Visualization
│   ├── gemini_explainer.py  # AI explanations
│   ├── requirements.txt     # Dependencies
│   └── models/              # Trained models
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Main pages
│   │   └── App.tsx          # Main app
│   └── package.json         # Dependencies
└── README.md
```

## Features
- 🧠 Brain tumor classification (4 classes)
- 🔍 Saliency maps (Grad-CAM, Integrated Gradients)
- 🤖 AI explanations (Gemini 1.5 Flash)
- 🎨 Modern React UI with Tailwind CSS
- 📊 Real-time analysis and confidence scores
