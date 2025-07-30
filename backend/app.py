import torch
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import base64
import os
import timm
import torchvision.transforms as transforms

app = FastAPI()
model = None

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model only once at startup
model = None

# Class names for predictions
class_names = ['0', 'MR', 'MRMS', 'MS', 'R', 'S']

def load_model():
    global model
    if model is None:
        try:
            # Try to load from the backend directory first
            model_path = "backend/resnest50d_full_model.pt"
            if not os.path.exists(model_path):
                model_path = "resnest50d_full_model.pt"
            
            print(f"Attempting to load model from: {model_path}")
            # Allowlist the ResNet class from timm
            torch.serialization.add_safe_globals([timm.models.resnet.ResNet])
            model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
            model.eval()
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise Exception(f"Failed to load model: {str(e)}")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        load_model()
        image_bytes = await file.read()
        
        # Load and process image
        original_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        original_np = np.array(original_image)

        # Resize & Normalize for model input
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.5]*3, [0.5]*3)
        ])
        input_tensor = transform(original_image).unsqueeze(0).to(torch.device('cpu'))

        # Predict
        with torch.no_grad():
            outputs = model(input_tensor)
            _, predicted = torch.max(outputs, 1)
            predicted_class = class_names[predicted.item()]

        # Convert to HSV for infection detection
        hsv = cv2.cvtColor(original_np, cv2.COLOR_RGB2HSV)

        # Adjusted HSV range for yellowish infection
        lower_yellow = np.array([15, 80, 80])
        upper_yellow = np.array([45, 255, 255])
        mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)

        # Exclude background
        gray = cv2.cvtColor(original_np, cv2.COLOR_RGB2GRAY)
        background_mask = cv2.inRange(gray, 250, 255)
        non_background = cv2.bitwise_not(background_mask)

        # Final infected mask
        final_mask = cv2.bitwise_and(mask_yellow, mask_yellow, mask=non_background)

        # Calculate infection percentages
        infected_pixels = np.count_nonzero(final_mask)
        leaf_pixels = np.count_nonzero(non_background)
        infected_percent = (infected_pixels / leaf_pixels) * 100 if leaf_pixels else 0
        healthy_percent = 100 - infected_percent

        # Create highlighted image
        highlighted = original_np.copy()
        highlighted[final_mask > 0] = [255, 0, 0]  # Red overlay

        # Convert images to base64
        # Original image
        _, original_buffer = cv2.imencode('.jpg', cv2.cvtColor(original_np, cv2.COLOR_RGB2BGR))
        original_base64 = base64.b64encode(original_buffer.tobytes()).decode('utf-8')
        
        # Mask image
        _, mask_buffer = cv2.imencode('.jpg', final_mask)
        mask_base64 = base64.b64encode(mask_buffer.tobytes()).decode('utf-8')
        
        # Highlighted image
        _, highlighted_buffer = cv2.imencode('.jpg', cv2.cvtColor(highlighted, cv2.COLOR_RGB2BGR))
        highlighted_base64 = base64.b64encode(highlighted_buffer.tobytes()).decode('utf-8')

        return {
            "predicted_class": predicted_class,
            "healthy_percent": round(healthy_percent, 2),
            "infected_percent": round(infected_percent, 2),
            "original_image": f"data:image/jpeg;base64,{original_base64}",
            "mask_image": f"data:image/jpeg;base64,{mask_base64}",
            "highlighted_image": f"data:image/jpeg;base64,{highlighted_base64}"
        }
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


