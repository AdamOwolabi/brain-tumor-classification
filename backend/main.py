from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import numpy as np
import io
import base64
import json
from pathlib import Path
import logging

# Import our custom modules
from train_model import BrainTumorClassifier
from saliency_maps import SaliencyMapGenerator
from gemini_explainer import GeminiExplainer

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Brain Tumor Classification API",
    description="AI-powered brain tumor classification with saliency maps and explanations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and utilities
model = None
saliency_generator = None
explainer = None
class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Image preprocessing transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_model():
    """Load the trained model"""
    global model, saliency_generator
    
    try:
        model = BrainTumorClassifier(num_classes=4, model_name='resnet50')
        model_path = Path("models/best_brain_tumor_model.pth")
        
        if model_path.exists():
            model.load_state_dict(torch.load(model_path, map_location=device))
            logger.info("✅ Model loaded successfully")
        else:
            logger.warning("⚠️ Model file not found, using untrained model")
        
        model.to(device)
        model.eval()
        
        # Initialize saliency map generator
        saliency_generator = SaliencyMapGenerator(model, device)
        
        return True
    except Exception as e:
        logger.error(f"❌ Error loading model: {e}")
        return False

def initialize_explainer():
    """Initialize Gemini explainer"""
    global explainer
    
    try:
        explainer = GeminiExplainer()
        logger.info("✅ Gemini explainer initialized")
        return True
    except Exception as e:
        logger.warning(f"⚠️ Gemini explainer not available: {e}")
        explainer = None
        return False

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("🚀 Starting Brain Tumor Classification API")
    
    # Load model
    model_loaded = load_model()
    if not model_loaded:
        logger.error("❌ Failed to load model")
    
    # Initialize explainer
    initialize_explainer()
    
    logger.info("✅ API ready!")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Brain Tumor Classification API",
        "status": "healthy",
        "model_loaded": model is not None,
        "gemini_available": explainer is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "api_status": "healthy",
        "model_status": "loaded" if model is not None else "not_loaded",
        "device": str(device),
        "gemini_status": "available" if explainer is not None else "unavailable",
        "classes": class_names
    }

def preprocess_image(image: Image.Image):
    """Preprocess image for model inference"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Apply transforms
    image_tensor = transform(image)
    return image_tensor

def numpy_to_base64(array):
    """Convert numpy array to base64 string"""
    # Normalize to 0-255
    array_normalized = (array * 255).astype(np.uint8)
    
    # Convert to PIL Image
    img = Image.fromarray(array_normalized, mode='L')
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Make prediction on uploaded image"""
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read and process image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess
        image_tensor = preprocess_image(image)
        
        # Make prediction
        with torch.no_grad():
            image_batch = image_tensor.unsqueeze(0).to(device)
            outputs = model(image_batch)
            probabilities = F.softmax(outputs, dim=1)
            confidence, predicted_class = torch.max(probabilities, 1)
            
            predicted_class = predicted_class.item()
            confidence = confidence.item()
        
        # Get all class probabilities
        all_probs = probabilities[0].cpu().numpy()
        class_probabilities = {
            class_names[i]: float(all_probs[i]) for i in range(len(class_names))
        }
        
        return {
            "prediction": {
                "class": class_names[predicted_class],
                "confidence": confidence,
                "class_index": predicted_class
            },
            "probabilities": class_probabilities,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/analyze")
async def analyze_with_saliency(file: UploadFile = File(...)):
    """Complete analysis with prediction, saliency maps, and explanation"""
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read and process image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        original_image = image.copy()
        
        # Preprocess
        image_tensor = preprocess_image(image)
        
        # Make prediction
        with torch.no_grad():
            image_batch = image_tensor.unsqueeze(0).to(device)
            outputs = model(image_batch)
            probabilities = F.softmax(outputs, dim=1)
            confidence, predicted_class = torch.max(probabilities, 1)
            
            predicted_class = predicted_class.item()
            confidence = confidence.item()
        
        # Generate saliency maps
        saliency_maps = {}
        
        if saliency_generator:
            try:
                # Grad-CAM
                gradcam_map, _, _ = saliency_generator.generate_gradcam(
                    image_tensor, predicted_class
                )
                saliency_maps['gradcam'] = numpy_to_base64(gradcam_map)
                
                # Integrated Gradients
                ig_map, _ = saliency_generator.generate_integrated_gradients(
                    image_tensor, predicted_class
                )
                saliency_maps['integrated_gradients'] = numpy_to_base64(ig_map)
                
            except Exception as e:
                logger.warning(f"Saliency map generation failed: {e}")
                saliency_maps = {"error": "Saliency maps unavailable"}
        
        # Generate explanation
        explanation = None
        if explainer:
            try:
                explanation = explainer.generate_explanation(
                    original_image, 
                    class_names[predicted_class], 
                    confidence
                )
            except Exception as e:
                logger.warning(f"Explanation generation failed: {e}")
                explanation = {"error": "Explanation unavailable"}
        
        # Get all class probabilities
        all_probs = probabilities[0].cpu().numpy()
        class_probabilities = {
            class_names[i]: float(all_probs[i]) for i in range(len(class_names))
        }
        
        return {
            "prediction": {
                "class": class_names[predicted_class],
                "confidence": confidence,
                "class_index": predicted_class
            },
            "probabilities": class_probabilities,
            "saliency_maps": saliency_maps,
            "explanation": explanation,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/classes")
async def get_classes():
    """Get available classes"""
    return {
        "classes": class_names,
        "descriptions": {
            "glioma": "Glioma tumor - originates from glial cells",
            "meningioma": "Meningioma tumor - arises from meninges",
            "notumor": "No tumor detected",
            "pituitary": "Pituitary tumor - in pituitary gland area"
        }
    }

@app.get("/model-info")
async def get_model_info():
    """Get model information"""
    return {
        "architecture": "ResNet-50 with transfer learning",
        "input_size": [224, 224, 3],
        "classes": len(class_names),
        "class_names": class_names,
        "device": str(device),
        "features": [
            "Transfer learning from ImageNet",
            "Data augmentation",
            "Grad-CAM saliency maps",
            "Integrated gradients",
            "Multi-modal explanations"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
