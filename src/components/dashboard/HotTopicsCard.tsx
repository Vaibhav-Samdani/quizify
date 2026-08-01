import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "../WordCloud";
import prisma from "@/lib/db";
import { Flame } from "lucide-react";

const HotTopicsCard = async () => {
  // Added a 'take' limit and ordered by descending count. 
  // This prevents the word cloud from trying to render 10,000 overlapping words 
  // if your app scales, keeping only the truly "hot" topics visible.
  const topics = await prisma.topic_count.findMany({
    orderBy: {
      count: "desc",
    },
    take: 40,
  });

  const formattedTopics = topics.map((topic) => ({
    text: topic.topic,
    value: topic.count,
  }));

  return (
    <Card className="col-span-4 transition-all duration-300 hover:shadow-md animate-in fade-in zoom-in-95">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Hot Topics
          </CardTitle>
          <CardDescription>
            Click on any topic to instantly start a quiz on it.
          </CardDescription>
        </div>
        
        {/* Themed Icon Badge */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-transform duration-300 hover:scale-110 dark:bg-orange-950/50 dark:text-orange-400">
          <Flame className="h-5 w-5" strokeWidth={2.5} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {formattedTopics.length === 0 ? (
          // Empty State fallback for new users
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No topics found yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Play a few games to see trends appear here!
            </p>
          </div>
        ) : (
          <WordCloud formattedTopics={formattedTopics} />
        )}
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;