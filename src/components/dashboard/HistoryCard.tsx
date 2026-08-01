"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

const HistoryCard = () => {
  const router = useRouter();
  
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-md active:scale-[0.98] animate-in fade-in zoom-in-95"
      onClick={() => router.push("/history")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          History
        </CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary dark:bg-zinc-800">
          <History className="h-5 w-5" strokeWidth={2.5} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Review your past quiz attempts and track your knowledge progress over time.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;