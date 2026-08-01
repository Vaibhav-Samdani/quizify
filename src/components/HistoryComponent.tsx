import prisma from "@/lib/db";
import { Clock, CopyCheck, Edit2, PlayCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: "desc",
    },
  });

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50 animate-in fade-in zoom-in-95">
        <PlayCircle className="mb-4 h-12 w-12 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          No games played yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          When you complete a quiz, your results and statistics will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game, index) => {
        // Snappy staggered animation delay
        const animationDelay = `${index * 75}ms`;

        return (
          // UX FIX: The entire card is now a Link, instead of just the title text.
          // This creates a much larger, mobile-friendly click target.
          <Link
            href={`/statistics/${game.id}`}
            key={game.id}
            className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:border-primary/40 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-gray-950 dark:hover:border-primary/40 dark:hover:bg-zinc-900/50 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay, animationFillMode: "both" }}
          >
            <div className="flex items-center gap-4">
              
              {/* Dynamic Icon Badge */}
              <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
                game.gameType === "mcq" 
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              )}>
                {game.gameType === "mcq" ? (
                  <CopyCheck className="h-6 w-6" strokeWidth={2} />
                ) : (
                  <Edit2 className="h-6 w-6" strokeWidth={2} />
                )}
              </div>

              {/* Game Info */}
              <div className="flex flex-col space-y-1.5">
                <p className="text-base font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100">
                  {game.topic}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                  <span className="flex items-center font-medium text-zinc-600 dark:text-zinc-400">
                    <Clock className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                    {game.timeEnded 
                      ? new Date(game.timeEnded).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        }) 
                      : (
                        <span className="text-amber-600 dark:text-amber-500">In Progress</span>
                      )}
                  </span>
                  
                  {/* Divider Dot */}
                  <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  
                  <span className="font-medium text-zinc-500 dark:text-zinc-400">
                    {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Call to Action Arrow */}
            <div className="ml-4 shrink-0">
              <ChevronRight className="h-5 w-5 text-zinc-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary dark:text-zinc-500" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default HistoryComponent;