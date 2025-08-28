import os
import zipfile
import kaggle
from pathlib import Path

def download_brain_tumor_dataset():
    """Download brain tumor dataset from Kaggle"""
    
    # Create data directory
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    print("Downloading brain tumor dataset from Kaggle...")
    
    # Download dataset
    try:
        kaggle.api.dataset_download_files(
            'masoudnickparvar/brain-tumor-mri-dataset',
            path=str(data_dir),
            unzip=True
        )
        print("✅ Dataset downloaded successfully!")
        
        # Organize the data structure
        organize_dataset()
        
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        print("Make sure you have kaggle API configured:")
        print("1. Create account at kaggle.com")
        print("2. Go to Account -> API -> Create New API Token")
        print("3. Place kaggle.json in ~/.kaggle/")
        print("4. Run: chmod 600 ~/.kaggle/kaggle.json")

def organize_dataset():
    """Organize dataset into train/test/val splits"""
    
    data_dir = Path("data")
    
    # Check if dataset was extracted
    if not any(data_dir.iterdir()):
        print("❌ Dataset directory is empty")
        return
    
    print("📁 Dataset structure:")
    for item in data_dir.rglob("*"):
        if item.is_dir():
            print(f"  📂 {item.relative_to(data_dir)}")
        elif item.suffix in ['.jpg', '.jpeg', '.png']:
            print(f"    🖼️  {item.name}")
            break  # Just show one example file per directory

if __name__ == "__main__":
    download_brain_tumor_dataset()
