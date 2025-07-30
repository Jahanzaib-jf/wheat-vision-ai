import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, Eye, Target } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  stage: 'uploading' | 'preprocessing' | 'analyzing' | 'generating' | 'complete';
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  progress,
  stage
}) => {
  const getStageInfo = (currentStage: string) => {
    const stages = {
      uploading: {
        icon: <Loader2 className="h-6 w-6 animate-spin" />,
        title: 'Uploading Image',
        description: 'Preparing your wheat leaf image for analysis...'
      },
      preprocessing: {
        icon: <Eye className="h-6 w-6 animate-pulse" />,
        title: 'Preprocessing',
        description: 'Optimizing image quality and extracting features...'
      },
      analyzing: {
        icon: <Brain className="h-6 w-6 animate-pulse" />,
        title: 'AI Analysis',
        description: 'ResNeSt50d model is analyzing disease patterns...'
      },
      generating: {
        icon: <Target className="h-6 w-6 animate-pulse" />,
        title: 'Generating Results',
        description: 'Creating HSV visualizations and final report...'
      },
      complete: {
        icon: <Target className="h-6 w-6" />,
        title: 'Analysis Complete',
        description: 'Results are ready!'
      }
    };

    return stages[currentStage as keyof typeof stages] || stages.uploading;
  };

  const stageInfo = getStageInfo(stage);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              {stageInfo.icon}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{stageInfo.title}</h3>
            <p className="text-muted-foreground">{stageInfo.description}</p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progress.toFixed(0)}% Complete
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className={`p-2 rounded text-center ${stage === 'uploading' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Upload
            </div>
            <div className={`p-2 rounded text-center ${stage === 'preprocessing' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Process
            </div>
            <div className={`p-2 rounded text-center ${stage === 'analyzing' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Analyze
            </div>
            <div className={`p-2 rounded text-center ${stage === 'generating' || stage === 'complete' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Results
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};