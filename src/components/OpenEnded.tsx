"use client";

import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@/generated/prisma/client";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer, Trophy } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import OpenEndedPercentage from "./OpenEndedPercentage";
import BlankAnswerInput from "./BlankAnswerInput";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [blankAnswer, setBlankAnswer] = useState("");
  const [now, setNow] = useState(new Date());
  
  // FIX: Store historical scores in an array to calculate a true average
  const [pastScores, setPastScores] = useState<number[]>([]);
  const averagePercentage = pastScores.length > 0 
    ? Math.round(pastScores.reduce((a, b) => a + b, 0) / pastScores.length) 
    : 0;

  const { toast } = useToast();

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      // Note: Direct DOM manipulation in React is usually an anti-pattern, 
      // but assuming BlankAnswerInput requires this setup.
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        const inputElement = input as HTMLInputElement;
        filledAnswer = filledAnswer.replace("_____", inputElement.value);
        inputElement.value = "";
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    if (isChecking) return; // FIX: Prevent double submission if already loading

    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% accurate`,
        });
        
        setPastScores((prev) => [...prev, percentageSimilar]);

        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }, [checkAnswer, isChecking, questionIndex, toast, endGame, game.questions.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  // --- COMPLETED STATE UI ---
  if (hasEnded) {
    return (
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <Card className="flex flex-col items-center p-8 text-center shadow-lg">
          <Trophy className="mb-4 h-16 w-16 text-yellow-500" strokeWidth={1.5} />
          <h2 className="mb-2 text-2xl font-bold tracking-tight">Game Completed!</h2>
          <div className="mb-6 rounded-md bg-green-500/10 px-4 py-2 font-semibold text-green-600 dark:text-green-400">
            Finished in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
          <Link
            href={`/statistics/${game.id}`}
            className={cn(buttonVariants({ size: "lg" }), "w-full transition-transform hover:scale-105")}
          >
            View Statistics
            <BarChart className="ml-2 h-4 w-4" />
          </Link>
        </Card>
      </div>
    );
  }

  // --- ACTIVE GAME UI ---
  return (
    <div className="absolute left-1/2 top-1/2 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 md:w-[80vw] animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-row items-center justify-between">
        
        {/* Topic & Timer */}
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Topic</span>
            <span className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-sm">
              {game.topic}
            </span>
          </p>
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <Timer className="mr-2 h-4 w-4" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>

        <OpenEndedPercentage percentage={averagePercentage} />
      </div>
      
      {/* Question Card */}
      <Card className="mt-6 w-full shadow-md transition-all">
        <CardHeader className="flex flex-row items-center gap-6">
          <CardTitle className="flex flex-col items-center justify-center divide-y divide-zinc-200 text-center dark:divide-zinc-800">
            <div className="pb-2 text-2xl font-bold">{questionIndex + 1}</div>
            <div className="pt-2 text-base font-medium text-muted-foreground">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Answer Input & Actions */}
      <div className="mt-8 flex flex-col items-center justify-center w-full">
        <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        />
        <Button
          className="mt-6 min-w-[120px] transition-transform active:scale-95"
          disabled={isChecking || hasEnded}
          onClick={handleNext}
          size="lg"
        >
          {isChecking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;