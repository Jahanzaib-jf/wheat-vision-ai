import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  className: string;
  confidence: number;
  healthyPercentage: number;
  infectedPercentage: number;
  severity: 'low' | 'medium' | 'high';
  resultImage?: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  originalImage: string;
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getSeverityIcon(result.severity)}
              Disease Classification Results
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {(result.confidence * 100).toFixed(1)}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Detected Disease:</span>
              <Badge variant="destructive" className="text-base px-3 py-1">
                {result.className}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Healthy Area</span>
                  <span className="font-medium">{result.healthyPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={result.healthyPercentage} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Infected Area</span>
                  <span className="font-medium">{result.infectedPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={result.infectedPercentage} 
                  className={`h-2 [&>div]:${getSeverityColor(result.severity)}`}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Original Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={originalImage}
              alt="Original wheat leaf"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result.resultImage ? (
              <img
                src={result.resultImage}
                alt="Analysis result with Grad-CAM++ visualization"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Analysis visualization will appear here</p>
              </div>
            )}
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
            {result.severity === 'high' && (
              <div className="p-4 border-l-4 border-health-danger bg-health-danger/10 rounded">
                <h4 className="font-semibold text-health-danger">Immediate Action Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  High infection detected. Consider immediate treatment and isolation of affected plants.
                </p>
              </div>
            )}
            
            {result.severity === 'medium' && (
              <div className="p-4 border-l-4 border-health-warning bg-health-warning/10 rounded">
                <h4 className="font-semibold text-health-warning">Monitor Closely</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Moderate infection detected. Monitor closely and consider preventive measures.
                </p>
              </div>
            )}
            
            {result.severity === 'low' && (
              <div className="p-4 border-l-4 border-health-good bg-health-good/10 rounded">
                <h4 className="font-semibold text-health-good">Good Health</h4>
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