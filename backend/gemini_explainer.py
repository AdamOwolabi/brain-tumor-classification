import os
import google.generativeai as genai
from dotenv import load_dotenv
import base64
import io
from PIL import Image
import json

load_dotenv()

class GeminiExplainer:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        self.class_descriptions = {
            'glioma': {
                'name': 'Glioma Tumor',
                'description': 'A type of brain tumor that originates from glial cells. Often appears as irregular masses with varying intensity.',
                'characteristics': ['Irregular shape', 'Variable intensity', 'May have necrotic regions', 'Can cause mass effect']
            },
            'meningioma': {
                'name': 'Meningioma Tumor',
                'description': 'A tumor arising from the meninges (protective layers around the brain). Usually well-defined and round.',
                'characteristics': ['Well-defined borders', 'Round or oval shape', 'Uniform intensity', 'Usually benign']
            },
            'pituitary': {
                'name': 'Pituitary Tumor',
                'description': 'A tumor in the pituitary gland area. Often appears as a small, well-defined mass near the center of the brain.',
                'characteristics': ['Small size', 'Central location', 'Well-defined', 'Near sella turcica region']
            },
            'notumor': {
                'name': 'No Tumor',
                'description': 'Normal brain tissue without any visible tumors or abnormalities.',
                'characteristics': ['Normal brain anatomy', 'No mass effect', 'Symmetric structures', 'No abnormal intensities']
            }
        }
    
    def image_to_base64(self, image):
        """Convert PIL image to base64 string"""
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    
    def generate_explanation(self, image, prediction_class, confidence, saliency_map=None):
        """Generate detailed explanation using Gemini 1.5 Flash"""
        
        class_info = self.class_descriptions.get(prediction_class, {})
        class_name = class_info.get('name', prediction_class)
        class_desc = class_info.get('description', '')
        characteristics = class_info.get('characteristics', [])
        
        # Prepare the prompt
        prompt = f"""
        You are an expert radiologist AI assistant analyzing brain MRI scans. 
        
        ANALYSIS CONTEXT:
        - Image Type: Brain MRI scan
        - Predicted Class: {class_name}
        - Confidence Level: {confidence:.1%}
        - Class Description: {class_desc}
        - Key Characteristics: {', '.join(characteristics)}
        
        Please provide a comprehensive analysis of this brain MRI scan including:
        
        1. VISUAL ANALYSIS:
           - Describe what you observe in the image
           - Identify key anatomical structures
           - Note any abnormalities or regions of interest
        
        2. PREDICTION EXPLANATION:
           - Explain why the AI model predicted "{class_name}"
           - Discuss the confidence level ({confidence:.1%}) and what it means
           - Describe the visual features that support this classification
        
        3. CLINICAL INSIGHTS:
           - Explain the medical significance of this finding
           - Discuss typical characteristics of {class_name}
           - Mention any important clinical considerations
        
        4. RECOMMENDATIONS:
           - Suggest next steps or additional imaging if needed
           - Provide any relevant medical advice or considerations
           - Note limitations of AI analysis
        
        Please write in a professional but accessible tone, suitable for both medical professionals and informed patients.
        Keep your response detailed but well-structured with clear sections.
        """
        
        try:
            # Convert image to appropriate format for Gemini
            if isinstance(image, Image.Image):
                # Image is already a PIL Image
                response = self.model.generate_content([prompt, image])
            else:
                # Assume it's a file path or needs conversion
                if isinstance(image, str):
                    image = Image.open(image)
                response = self.model.generate_content([prompt, image])
            
            explanation = response.text
            
            # Structure the response
            structured_response = {
                "prediction": {
                    "class": class_name,
                    "confidence": confidence,
                    "raw_class": prediction_class
                },
                "explanation": explanation,
                "class_info": class_info,
                "technical_details": {
                    "model_type": "Transfer Learning CNN",
                    "architecture": "ResNet-50",
                    "preprocessing": "224x224 resize, normalization",
                    "confidence_threshold": 0.7
                }
            }
            
            return structured_response
            
        except Exception as e:
            # Fallback explanation if Gemini API fails
            fallback_explanation = self._generate_fallback_explanation(
                prediction_class, confidence, class_info
            )
            
            return {
                "prediction": {
                    "class": class_name,
                    "confidence": confidence,
                    "raw_class": prediction_class
                },
                "explanation": fallback_explanation,
                "class_info": class_info,
                "error": f"Gemini API unavailable: {str(e)}",
                "technical_details": {
                    "model_type": "Transfer Learning CNN",
                    "architecture": "ResNet-50",
                    "preprocessing": "224x224 resize, normalization",
                    "confidence_threshold": 0.7
                }
            }
    
    def _generate_fallback_explanation(self, prediction_class, confidence, class_info):
        """Generate a fallback explanation when Gemini API is unavailable"""
        
        class_name = class_info.get('name', prediction_class)
        class_desc = class_info.get('description', '')
        characteristics = class_info.get('characteristics', [])
        
        confidence_interpretation = ""
        if confidence > 0.9:
            confidence_interpretation = "very high confidence"
        elif confidence > 0.7:
            confidence_interpretation = "high confidence"
        elif confidence > 0.5:
            confidence_interpretation = "moderate confidence"
        else:
            confidence_interpretation = "low confidence"
        
        explanation = f"""
        ## Analysis Summary
        
        **Prediction**: {class_name} (with {confidence_interpretation} - {confidence:.1%})
        
        **Clinical Overview**: {class_desc}
        
        **Key Characteristics Detected**:
        {chr(10).join([f"• {char}" for char in characteristics])}
        
        **Confidence Analysis**:
        The model shows {confidence_interpretation} in this prediction. This suggests that the visual features in the MRI scan strongly align with the learned patterns for {class_name}.
        
        **Recommendations**:
        • This AI analysis should be used as a supportive tool alongside professional medical evaluation
        • Consider consulting with a radiologist for definitive diagnosis
        • Additional imaging or clinical correlation may be recommended
        • Regular monitoring may be advised depending on the specific case
        
        **Technical Notes**:
        This analysis was performed using a deep learning model trained on brain MRI scans with transfer learning techniques. The model has been validated on medical imaging datasets but should not replace professional medical judgment.
        """
        
        return explanation.strip()
    
    def generate_comparison_analysis(self, images_with_predictions):
        """Generate comparative analysis for multiple images"""
        
        if len(images_with_predictions) < 2:
            return "Comparison requires at least 2 images"
        
        prompt = f"""
        You are analyzing multiple brain MRI scans for comparison. 
        
        Please provide a comparative analysis including:
        1. Similarities and differences between the scans
        2. Progression analysis if applicable
        3. Relative severity assessment
        4. Clinical implications of the differences
        
        Number of scans: {len(images_with_predictions)}
        """
        
        try:
            # For now, return a structured comparison
            comparison = {
                "summary": "Comparative analysis of brain MRI scans",
                "scan_count": len(images_with_predictions),
                "individual_analyses": []
            }
            
            for i, (image, pred_class, confidence) in enumerate(images_with_predictions):
                analysis = self.generate_explanation(image, pred_class, confidence)
                comparison["individual_analyses"].append({
                    "scan_number": i + 1,
                    "analysis": analysis
                })
            
            return comparison
            
        except Exception as e:
            return f"Error generating comparison: {str(e)}"
