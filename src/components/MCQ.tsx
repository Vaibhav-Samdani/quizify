"use client";

import { Game, Question } from "@prisma/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronRight, Loader2, Timer, Trophy } from "lucide-react";
import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import { cn, formatTimeDelta } from "@/lib/utils";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { useToast } from "./ui/use-toast";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = useState<number>(-1);
  const [now, setNow] = useState(new Date());

  const { toast } = useToast();

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion?.options) return [];
    try {
      const parsed = JSON.parse(currentQuestion.options as string);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [currentQuestion]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
      const response = await axios.post(`/api/endGame`, payload);
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
    if (isChecking) return; // FIX: Prevent double submission spam

    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((prev) => ({
            ...prev,
            correct_answers: prev.correct_answers + 1,
          }));
          toast({
            title: "Correct!",
            description: "You got it right.",
            variant: "default", // Assuming 'success' isn't a default shadcn variant, normally 'default' or a custom one
            className: "bg-emerald-500 text-white border-none", 
          });
        } else {
          setStats((prev) => ({
            ...prev,
            wrong_answers: prev.wrong_answers + 1,
          }));
          toast({
            title: "Incorrect",
            description: "Better luck next time!",
            variant: "destructive",
          });
        }
        
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setSelectedChoice(-1);
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, isChecking, questionIndex, game.questions.length, toast, endGame]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (hasEnded || isChecking) return; // Block inputs while loading or ended

      const key = event.key;
      const parsedKey = parseInt(key);

      // Dynamically support 1 through N options
      if (parsedKey > 0 && parsedKey <= options.length) {
        setSelectedChoice(parsedKey - 1);
      } else if (key === "Enter" && selectedChoice !== -1) {
        event.preventDefault();
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, selectedChoice, options.length, hasEnded, isChecking]);

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
      
      {/* Header Info */}
      <div className="flex flex-row items-center justify-between">
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

        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
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

      {/* Options */}
      <div className="mt-8 flex w-full flex-col items-center justify-center">
        {options.map((option, index) => {
          const isSelected = selectedChoice === index;
          return (
            <Button
              key={`${currentQuestion.id}-${index}`}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "mb-4 w-full justify-start py-8 text-left transition-all hover:scale-[1.01]",
                isSelected && "ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950"
              )}
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div
                  className={cn(
                    "mr-5 flex h-8 w-8 items-center justify-center rounded-md border p-2",
                    isSelected
                      ? "border-primary-foreground text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div className="text-base whitespace-normal break-words">{option}</div>
              </div>
            </Button>
          );
        })}

        {/* Submit Button */}
        <Button
          className="mt-4 min-w-[120px] transition-transform active:scale-95"
          size="lg"
          disabled={selectedChoice === -1 || isChecking || hasEnded}
          onClick={handleNext}
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

export default MCQ;