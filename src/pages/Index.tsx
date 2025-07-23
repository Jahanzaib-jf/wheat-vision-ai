import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Microscope, Leaf, Shield, Activity } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/wheat-hero.jpg';

interface AnalysisResult {
  className: string;
  confidence: number;
  healthyPercentage: number;
  infectedPercentage: number;
  severity: 'low' | 'medium' | 'high';
  resultImage?: string;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState<'uploading' | 'preprocessing' | 'analyzing' | 'generating' | 'complete'>('uploading');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    toast.success('Image selected successfully!');
  };

  const handleImageClear = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate different stages of analysis
    const stages = [
      { stage: 'uploading' as const, duration: 1000, progress: 20 },
      { stage: 'preprocessing' as const, duration: 1500, progress: 40 },
      { stage: 'analyzing' as const, duration: 3000, progress: 80 },
      { stage: 'generating' as const, duration: 1000, progress: 100 },
    ];

    for (const { stage, duration, progress } of stages) {
      setAnalysisStage(stage);
      
      // Gradually increase progress during each stage
      const steps = 20;
      const stepDuration = duration / steps;
      const startProgress = analysisProgress;
      
      for (let i = 0; i <= steps; i++) {
        const currentProgress = startProgress + (progress - startProgress) * (i / steps);
        setAnalysisProgress(currentProgress);
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }

    // Simulate analysis result
    const mockResult: AnalysisResult = {
      className: 'Leaf Rust',
      confidence: 0.94,
      healthyPercentage: 72.3,
      infectedPercentage: 27.7,
      severity: 'medium',
    };

    setAnalysisStage('complete');
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
    toast.success('Analysis completed successfully!');
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    simulateAnalysis();
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');
  };

  if (analysisResult && selectedImage) {
    const originalImageUrl = URL.createObjectURL(selectedImage);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WheatVision AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced wheat leaf disease detection powered by ResNeSt50d deep learning model
            </p>
          </div>

          <AnalysisResults 
            result={analysisResult} 
            originalImage={originalImageUrl}
          />

          <div className="flex justify-center">
            <Button variant="outline" onClick={resetAnalysis}>
              Analyze Another Image
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Wheat field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              WheatVision AI
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Advanced wheat leaf disease detection powered by ResNeSt50d deep learning model
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <Microscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced ResNeSt50d neural network for accurate disease classification
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-accent/10 w-fit">
                <Leaf className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Grad-CAM++ Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visual heatmaps showing infected areas with precise localization
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-wheat-primary/10 w-fit">
                <Activity className="h-6 w-6 text-wheat-primary" />
              </div>
              <CardTitle className="text-lg">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instant disease detection with confidence scores and recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analysis Section */}
        <div className="space-y-8">
          {isAnalyzing ? (
            <AnalysisProgress 
              progress={analysisProgress} 
              stage={analysisStage}
            />
          ) : (
            <>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onImageClear={handleImageClear}
              />

              {selectedImage && (
                <div className="flex justify-center">
                  <Button
                    variant="analyze"
                    size="lg"
                    onClick={handleAnalyze}
                    className="px-8 py-3 text-lg"
                  >
                    <Shield className="h-5 w-5" />
                    Analyze for Disease
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="p-2 rounded-full bg-primary/10 w-fit mx-auto">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold">Upload Image</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of a wheat leaf from your device or camera
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 rounded-full bg-primary/10 w-fit mx-auto">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our ResNeSt50d model analyzes the image for disease patterns
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 rounded-full bg-primary/10 w-fit mx-auto">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold">Get Results</h4>
                <p className="text-sm text-muted-foreground">
                  Receive detailed analysis with disease classification and treatment recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;