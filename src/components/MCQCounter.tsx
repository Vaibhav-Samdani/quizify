import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  correct_answers: number;
  wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in zoom-in-95">
      
      {/* Correct Answers */}
      <div className="flex items-center gap-2">
        <CheckCircle2 
          className="h-6 w-6 text-emerald-500 dark:text-emerald-400" 
          strokeWidth={2.5} 
        />
        <span className="text-2xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
          {correct_answers}
        </span>
      </div>

      {/* Separator */}
      <div className="mx-4 h-8 w-[2px] rounded-full bg-zinc-200 dark:bg-zinc-800" />

      {/* Wrong Answers */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tighter text-rose-600 dark:text-rose-400">
          {wrong_answers}
        </span>
        <XCircle 
          className="h-6 w-6 text-rose-500 dark:text-rose-400" 
          strokeWidth={2.5} 
        />
      </div>
      
    </Card>
  );
};

export default MCQCounter;