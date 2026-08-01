import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import HistoryComponent from "../HistoryComponent";
import prisma from "@/lib/db";
import { Activity, ArrowRight } from "lucide-react";

const RecentActivityCard = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  
  const games_count = await prisma.game.count({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <Card className="col-span-4 lg:col-span-3 transition-all duration-300 hover:shadow-md animate-in fade-in zoom-in-95">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            <Link 
              href="/history" 
              className="group flex items-center gap-2 transition-colors hover:text-primary"
            >
              Recent Activity
              {/* Subtle arrow that slides in when hovering the title */}
              <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </CardTitle>
          <CardDescription>
            You have played a total of {games_count} {games_count === 1 ? "quiz" : "quizzes"}.
          </CardDescription>
        </div>

        {/* Themed Icon Badge */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform duration-300 hover:scale-110 dark:bg-blue-950/50 dark:text-blue-400">
          <Activity className="h-5 w-5" strokeWidth={2.5} />
        </div>
      </CardHeader>

      {/* Changed overflow-scroll to overflow-y-auto to prevent empty scrollbar tracks */}
      <CardContent className="max-h-[580px] overflow-y-auto pt-4">
        {games_count === 0 ? (
          // Empty State fallback for new users
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No activity yet.
            </p>
            <Link href="/quiz" className="mt-2 text-sm font-semibold text-primary hover:underline">
              Start your first quiz!
            </Link>
          </div>
        ) : (
          <HistoryComponent limit={10} userId={session.user.id} />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;