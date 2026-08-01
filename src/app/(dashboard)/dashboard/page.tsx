import DetailsDialog from "@/components/DetailsDialog";
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Quizzzy",
  description: "Manage your quizzes, track your performance, and explore trending AI topics.",
};

const Dashboard = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  // Extract the user's first name for a friendly greeting
  const firstName = session.user.name ? session.user.name.split(" ")[0] : "Learner";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Learning Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Here&apos;s an overview of your quiz activity, trending topics, and learning progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DetailsDialog />
        </div>
      </div>

      {/* Primary Action Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>

      {/* Analytics & Trends Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>

    </main>
  );
};

export default Dashboard;