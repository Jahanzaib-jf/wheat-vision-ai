import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, FileImage, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onImageClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onImageClear
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  if (selectedImage) {
    const imageUrl = URL.createObjectURL(selectedImage);
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="relative group">
            <img
              src={imageUrl}
              alt="Selected wheat leaf"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onImageClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p className="font-medium">{selectedImage.name}</p>
            <p>{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
            isDragOver
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileImage className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Wheat Leaf Image</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your image here, or click to browse
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button
                variant="upload"
                className="flex-1"
                onClick={triggerFileUpload}
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
              
              <Button
                variant="upload"
                className="flex-1"
                onClick={triggerCameraCapture}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WEBP up to 10MB
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};