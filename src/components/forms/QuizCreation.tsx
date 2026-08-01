"use client";

import { quizCreationSchema } from "@/schemas/forms/quiz";
import React, { useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BookOpen, CopyCheck, Sparkles, BrainCircuit } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingQuestions from "../LoadingQuestions";
import { cn } from "@/lib/utils";

type Props = {
  topic: string;
};

type InputType = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const { toast } = useToast();

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: InputType) => {
      const response = await axios.post("/api/game", { amount, topic, type });
      return response.data;
    },
  });

  const form = useForm<InputType>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam || "",
      type: "mcq",
      amount: 3,
    },
  });

  // Optimize re-renders: Only watch the 'type' field instead of the whole form
const currentQuizType = useWatch({
  control: form.control,
  name: "type",
});

  const onSubmit = async (data: InputType) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError && error.response?.status === 500) {
          toast({
            title: "Error Generating Quiz",
            description: "Our AI brain got a little overwhelmed. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "Unable to create your quiz at this time.",
            variant: "destructive",
          });
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    // FIX: Using Flexbox to center the content dynamically below the navbar
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
        <Card className="border-zinc-200 shadow-xl dark:border-zinc-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BrainCircuit className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Create a New Quiz
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              What would you like to test your knowledge on today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Topic Input */}
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Topic
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. History of the Roman Empire, Quantum Physics..."
                          className="h-12 text-base transition-colors focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide any topic, broad or specific, and our AI will generate questions for it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number of Questions Input */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Number of Questions
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How many questions?"
                          type="number"
                          className="h-12 text-base transition-colors focus-visible:ring-primary"
                          {...field}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            form.setValue("amount", isNaN(val) ? 1 : val);
                          }}
                          min={1}
                          max={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interactive Quiz Type Selector */}
                <div className="space-y-3 pt-2">
                  <FormLabel className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Quiz Format
                  </FormLabel>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* MCQ Option */}
                    <div
                      onClick={() => form.setValue("type", "mcq")}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-3 rounded-xl border-2 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                        currentQuizType === "mcq"
                          ? "border-primary bg-primary/5 shadow-sm dark:bg-primary/10"
                          : "border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        currentQuizType === "mcq" ? "bg-primary text-primary-foreground" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                      )}>
                        <CopyCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Multiple Choice</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Standard 4-option quiz format</p>
                      </div>
                    </div>

                    {/* Open Ended Option */}
                    <div
                      onClick={() => form.setValue("type", "open_ended")}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-3 rounded-xl border-2 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                        currentQuizType === "open_ended"
                          ? "border-primary bg-primary/5 shadow-sm dark:bg-primary/10"
                          : "border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        currentQuizType === "open_ended" ? "bg-primary text-primary-foreground" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                      )}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Open Ended</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Fill in the blank answers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  disabled={isPending} 
                  type="submit" 
                  size="lg"
                  className="mt-6 w-full text-base font-semibold shadow-md transition-transform active:scale-[0.98]"
                >
                  {isPending ? (
                    "Warming up the AI..."
                  ) : (
                    <>
                      Generate Quiz <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreation;