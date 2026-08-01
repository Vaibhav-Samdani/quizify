import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

type Props = { 
  accuracy: number; 
};

const AccuracyCard = ({ accuracy }: Props) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;

  // Dynamically color the stat based on performance
  const getScoreColor = (acc: number) => {
    if (acc >= 75) return "text-emerald-500 dark:text-emerald-400";
    if (acc >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  const scoreColor = getScoreColor(roundedAccuracy);

  return (
    <Card className="md:col-span-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in zoom-in-95">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Average Accuracy
        </CardTitle>
        <Target className={`h-5 w-5 ${scoreColor}`} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className={`text-4xl font-bold tracking-tight ${scoreColor}`}>
            {roundedAccuracy}%
          </span>
          <span className="text-sm text-muted-foreground">
            Based on all answered questions
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccuracyCard;