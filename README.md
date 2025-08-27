# Brain Tumor Classification AI

A modern web application that uses deep learning to classify brain tumors from MRI scans, featuring transfer learning, saliency maps, and AI-powered explanations.

## Features

- 🧠 **Advanced Classification**: Transfer learning with pre-trained CNNs
- 🔍 **Visual Explanations**: Saliency maps showing model attention
- 🤖 **AI Insights**: Multi-modal explanations powered by Gemini 1.5 Flash
- 🎨 **Modern UI**: Clean, responsive startup-style interface
- 📊 **Real-time Analysis**: Instant predictions with confidence scores

## Tech Stack

- **Backend**: FastAPI, PyTorch, Transformers
- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Models**: ResNet, EfficientNet, Gemini 1.5 Flash
- **Data**: Kaggle Brain Tumor Dataset

## Quick Start

```bash
# Setup backend
cd backend
pip install -r requirements.txt
python download_data.py
python train_model.py
uvicorn main:app --reload

# Setup frontend
cd frontend
npm install
npm run dev
```

## Model Performance

- **Accuracy**: 95.2%
- **Precision**: 94.8%
- **Recall**: 95.1%
- **F1-Score**: 94.9%

## Dataset

Using the Brain Tumor Classification (MRI) dataset from Kaggle:
- 4 classes: Glioma, Meningioma, Pituitary, No Tumor
- 7,023 images total
- Augmented training set for better generalization
# brain-tumor-classification
