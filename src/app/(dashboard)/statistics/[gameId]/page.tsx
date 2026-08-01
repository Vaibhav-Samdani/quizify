import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionsList";

type Props = {
  params: Promise<{
    gameId: string;
  }>;
};

const Statistics = async ({ params }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  const { gameId } = await params;

  // SECURITY FIX: Added userId to the query to prevent IDOR vulnerabilities.
  // This ensures users can only view statistics for games they actually played.
  const game = await prisma.game.findFirst({
    where: {
      id: gameId,
      userId: session.user.id,
    },
    include: {
      questions: true,
    },
  });

  if (!game) {
    redirect("/dashboard");
  }

  let accuracy = 0;

  // SAFETY FIX: Guard against division by zero if a game has no questions
  if (game.questions.length > 0) {
    if (game.gameType === "mcq") {
      const totalCorrect = game.questions.reduce((acc, question) => {
        return question.isCorrect ? acc + 1 : acc;
      }, 0);

      accuracy = (totalCorrect / game.questions.length) * 100;
    } else {
      const totalPercentage = game.questions.reduce((acc, question) => {
        return acc + (question.percentageCorrect ?? 0);
      }, 0);

      accuracy = totalPercentage / game.questions.length;
    }

    accuracy = Math.round(accuracy * 100) / 100;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Trophy className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quiz Results
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {game.topic}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            <LucideLayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 mt-6 md:grid-cols-7">
        <ResultsCard accuracy={accuracy} />

        <AccuracyCard accuracy={accuracy} />

        <TimeTakenCard
          timeStarted={new Date(game.timeStarted ?? 0)}
          timeEnded={new Date(game.timeEnded ?? 0)}
        />
      </div>

      {/* Questions Breakdown List */}
      <div className="mt-8">
        <QuestionsList questions={game.questions} />
      </div>
      
    </div>
  );
};

export default Statistics;