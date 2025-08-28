import React from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="text-gray-600">
          <p>Click to upload or drag and drop</p>
          <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
        </div>
      </label>
      {selectedImage && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Selected: {selectedImage.name}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
