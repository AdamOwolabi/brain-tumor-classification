import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.cm as cm

class SaliencyMapGenerator:
    def __init__(self, model, device='cuda' if torch.cuda.is_available() else 'cpu'):
        self.model = model
        self.device = device
        self.model.eval()
        
    def generate_gradcam(self, image_tensor, target_class=None, target_layer_name='layer4'):
        """Generate Grad-CAM saliency map"""
        # Store gradients
        gradients = []
        activations = []
        
        def forward_hook(module, input, output):
            activations.append(output)
            
        def backward_hook(module, grad_input, grad_output):
            gradients.append(grad_output[0])
        
        # Register hooks
        target_layer = None
        for name, module in self.model.named_modules():
            if target_layer_name in name:
                target_layer = module
                break
                
        if target_layer is None:
            # Fallback to last conv layer
            for module in self.model.modules():
                if isinstance(module, torch.nn.Conv2d):
                    target_layer = module
        
        forward_handle = target_layer.register_forward_hook(forward_hook)
        backward_handle = target_layer.register_backward_hook(backward_hook)
        
        # Forward pass
        image_tensor = image_tensor.unsqueeze(0).to(self.device)
        image_tensor.requires_grad_(True)
        
        output = self.model(image_tensor)
        
        if target_class is None:
            target_class = output.argmax(dim=1).item()
        
        # Backward pass
        self.model.zero_grad()
        one_hot = torch.zeros_like(output)
        one_hot[0][target_class] = 1
        output.backward(gradient=one_hot, retain_graph=True)
        
        # Generate CAM
        if gradients and activations:
            gradients_val = gradients[0].cpu().data.numpy()[0]
            activations_val = activations[0].cpu().data.numpy()[0]
            
            weights = np.mean(gradients_val, axis=(1, 2))
            cam = np.zeros(activations_val.shape[1:], dtype=np.float32)
            
            for i, w in enumerate(weights):
                cam += w * activations_val[i]
                
            cam = np.maximum(cam, 0)
            cam = cv2.resize(cam, (224, 224))
            cam = (cam - cam.min()) / (cam.max() - cam.min())
        else:
            cam = np.zeros((224, 224))
        
        # Clean up
        forward_handle.remove()
        backward_handle.remove()
        
        return cam, target_class, F.softmax(output, dim=1).cpu().data.numpy()[0]
    
    def generate_integrated_gradients(self, image_tensor, target_class=None, steps=50):
        """Generate Integrated Gradients saliency map"""
        image_tensor = image_tensor.unsqueeze(0).to(self.device)
        
        if target_class is None:
            output = self.model(image_tensor)
            target_class = output.argmax(dim=1).item()
        
        # Create baseline (black image)
        baseline = torch.zeros_like(image_tensor)
        
        # Generate path from baseline to input
        alphas = torch.linspace(0, 1, steps)
        integrated_grads = torch.zeros_like(image_tensor)
        
        for alpha in alphas:
            interpolated_input = baseline + alpha * (image_tensor - baseline)
            interpolated_input.requires_grad_(True)
            
            output = self.model(interpolated_input)
            self.model.zero_grad()
            
            grad = torch.autograd.grad(
                outputs=output[0, target_class],
                inputs=interpolated_input,
                create_graph=True
            )[0]
            
            integrated_grads += grad / steps
        
        # Scale by input difference
        integrated_grads *= (image_tensor - baseline)
        
        # Convert to numpy and aggregate across channels
        attribution_map = integrated_grads.squeeze().cpu().data.numpy()
        attribution_map = np.transpose(attribution_map, (1, 2, 0))
        attribution_map = np.sum(np.abs(attribution_map), axis=2)
        
        # Normalize
        attribution_map = (attribution_map - attribution_map.min()) / (attribution_map.max() - attribution_map.min())
        
        return attribution_map, target_class
    
    def visualize_saliency(self, original_image, saliency_map, prediction_class, confidence, class_names):
        """Create visualization of saliency map overlaid on original image"""
        
        # Convert original image to numpy if it's a tensor
        if torch.is_tensor(original_image):
            # Denormalize
            mean = torch.tensor([0.485, 0.456, 0.406])
            std = torch.tensor([0.229, 0.224, 0.225])
            original_image = original_image * std[:, None, None] + mean[:, None, None]
            original_image = torch.clamp(original_image, 0, 1)
            original_image = original_image.permute(1, 2, 0).cpu().numpy()
        
        # Create figure
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        # Original image
        axes[0].imshow(original_image)
        axes[0].set_title('Original Image')
        axes[0].axis('off')
        
        # Saliency map
        axes[1].imshow(saliency_map, cmap='jet')
        axes[1].set_title('Saliency Map')
        axes[1].axis('off')
        
        # Overlay
        axes[2].imshow(original_image)
        axes[2].imshow(saliency_map, cmap='jet', alpha=0.6)
        axes[2].set_title(f'Prediction: {class_names[prediction_class]}\nConfidence: {confidence:.2%}')
        axes[2].axis('off')
        
        plt.tight_layout()
        return fig
    
    def generate_occlusion_map(self, image_tensor, target_class=None, patch_size=20, stride=10):
        """Generate occlusion sensitivity map"""
        image_tensor = image_tensor.unsqueeze(0).to(self.device)
        
        if target_class is None:
            output = self.model(image_tensor)
            target_class = output.argmax(dim=1).item()
            baseline_confidence = F.softmax(output, dim=1)[0, target_class].item()
        else:
            output = self.model(image_tensor)
            baseline_confidence = F.softmax(output, dim=1)[0, target_class].item()
        
        # Get image dimensions
        _, _, height, width = image_tensor.shape
        
        # Initialize occlusion map
        occlusion_map = np.zeros((height, width))
        
        # Slide occlusion patch across image
        for y in range(0, height - patch_size + 1, stride):
            for x in range(0, width - patch_size + 1, stride):
                # Create occluded image
                occluded_image = image_tensor.clone()
                occluded_image[:, :, y:y+patch_size, x:x+patch_size] = 0
                
                # Get prediction
                with torch.no_grad():
                    output = self.model(occluded_image)
                    confidence = F.softmax(output, dim=1)[0, target_class].item()
                
                # Calculate importance (difference from baseline)
                importance = baseline_confidence - confidence
                occlusion_map[y:y+patch_size, x:x+patch_size] = importance
        
        # Normalize
        occlusion_map = (occlusion_map - occlusion_map.min()) / (occlusion_map.max() - occlusion_map.min())
        
        return occlusion_map, target_class
