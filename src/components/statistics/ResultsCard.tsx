import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { 
  accuracy: number; 
};

const ResultsCard = ({ accuracy }: Props) => {
  // Determine performance tier
  let tier = "bronze";
  if (accuracy >= 75) tier = "gold";
  else if (accuracy >= 25) tier = "silver";

  // Map tiers to their respective styles and copy
  const tierConfig = {
    gold: {
      title: "Impressive!",
      subtext: "≥ 75% accuracy",
      colorClass: "text-yellow-500",
    },
    silver: {
      title: "Good job!",
      subtext: "≥ 25% accuracy",
      colorClass: "text-zinc-500 dark:text-zinc-400",
    },
    bronze: {
      title: "Nice try!",
      subtext: "< 25% accuracy",
      colorClass: "text-amber-800 dark:text-amber-600",
    },
  };

  const config = tierConfig[tier as keyof typeof tierConfig];

  return (
    <Card className="md:col-span-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in zoom-in-95">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      
      <CardContent className="flex h-3/5 flex-col items-center justify-center space-y-4">
        <Trophy 
          className={cn("h-16 w-16", config.colorClass)} 
          strokeWidth={1.5} 
        />
        
        <div className="flex flex-col items-center text-center gap-1">
          <span className={cn("text-2xl font-bold tracking-tight", config.colorClass)}>
            {config.title}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {config.subtext}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;