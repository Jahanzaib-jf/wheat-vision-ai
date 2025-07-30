import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  predicted_class: string;
  healthy_percent: number;
  infected_percent: number;
  original_image: string;
  mask_image: string;
  highlighted_image: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  originalImage
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-health-good" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-health-warning" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-health-danger" />;
      default:
        return <CheckCircle className="h-5 w-5 text-health-good" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-health-good';
      case 'medium':
        return 'bg-health-warning';
      case 'high':
        return 'bg-health-danger';
      default:
        return 'bg-health-good';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Disease Classification Results
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Detected Disease:</span>
              <Badge variant="destructive" className="text-base px-3 py-1">
                {result.predicted_class}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Healthy Area</span>
                  <span className="font-medium">{result.healthy_percent}%</span>
                </div>
                <Progress 
                  value={result.healthy_percent} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Infected Area</span>
                  <span className="font-medium">{result.infected_percent}%</span>
                </div>
                <Progress 
                  value={result.infected_percent} 
                  className="h-2 [&>div]:bg-red-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Original Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center bg-gray-50 p-4 min-h-[320px]">
            <img
              src={result.original_image}
              alt="Original wheat leaf"
              className="max-w-full max-h-[320px] w-auto h-auto object-contain rounded-lg shadow-md scale-110 transform hover:scale-125 transition-transform duration-200"
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Infection Mask</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center bg-gray-50 p-4 min-h-[320px]">
            <img
              src={result.mask_image}
              alt="Infection mask"
              className="max-w-full max-h-[320px] w-auto h-auto object-contain rounded-lg shadow-md scale-110 transform hover:scale-125 transition-transform duration-200"
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Highlighted Result</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center bg-gray-50 p-4 min-h-[320px]">
            <img
              src={result.highlighted_image}
              alt="Highlighted result"
              className="max-w-full max-h-[320px] w-auto h-auto object-contain rounded-lg shadow-md scale-110 transform hover:scale-125 transition-transform duration-200"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.infected_percent > 50 && (
              <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                <h4 className="font-semibold text-red-700">Immediate Action Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  High infection detected. Consider immediate treatment and isolation of affected plants.
                </p>
              </div>
            )}
            
            {result.infected_percent > 20 && result.infected_percent <= 50 && (
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                <h4 className="font-semibold text-yellow-700">Monitor Closely</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Moderate infection detected. Monitor closely and consider preventive measures.
                </p>
              </div>
            )}
            
            {result.infected_percent <= 20 && (
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                <h4 className="font-semibold text-green-700">Good Health</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Low or no infection detected. Continue regular monitoring and care.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};