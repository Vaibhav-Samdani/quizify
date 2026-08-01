import HistoryComponent from "@/components/HistoryComponent";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard, History as HistoryIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz History | Quizzzy",
  description: "Review your past quiz attempts and track your learning progress over time.",
};

const History = async () => {
  const session = await getAuthSession();
  
  if (!session?.user) {
    return redirect("/");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 animate-in fade-in duration-500">
      <Card className="border-zinc-200 shadow-xl dark:border-zinc-800">
        
        {/* Header Section */}
        <CardHeader className="border-b border-zinc-100 pb-6 dark:border-zinc-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HistoryIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Archive
                </span>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Quiz History
              </CardTitle>
              <CardDescription>
                Review all your past quiz attempts and access detailed performance analytics.
              </CardDescription>
            </div>

            <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
              <LucideLayoutDashboard className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="max-h-[65vh] overflow-y-auto pt-6">
          <HistoryComponent limit={100} userId={session.user.id} />
        </CardContent>

      </Card>
    </div>
  );
};

export default History;