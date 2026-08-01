import React from "react";
import { Card } from "@/components/ui/card";
import { Percent, Target } from "lucide-react";

type Props = {
  percentage: number;
};

const OpenEndedPercentage = ({ percentage }: Props) => {
  // Dynamically color the icon based on the score
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-emerald-500 dark:text-emerald-400";
    if (pct >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const scoreColor = getScoreColor(percentage);

  return (
    <Card className="flex flex-row items-center p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <Target className={`mr-3 h-8 w-8 ${scoreColor}`} strokeWidth={2.5} />
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tighter text-zinc-800 dark:text-zinc-100">
          {percentage}
        </span>
        <Percent className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
      </div>
    </Card>
  );
};

export default OpenEndedPercentage;