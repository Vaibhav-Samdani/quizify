"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@prisma/client";

type Props = {
  questions: Question[];
};

const QuestionsList = ({ questions }: Props) => {
  // 1. CRITICAL FIX: Prevent crashes if the questions array is empty or undefined
  if (!questions || questions.length === 0) {
    return (
      <div className="mt-4 p-6 text-center text-muted-foreground border rounded-lg">
        No questions found.
      </div>
    );
  }

  // Safely check the question type now that we know the array has at least one item
  const isOpenEnded = questions[0]?.questionType === "open_ended";

  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>

          {isOpenEnded && (
            <TableHead className="w-[10px] text-right">Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(
          (
            { id, answer, question, userAnswer, percentageCorrect, isCorrect },
            index
          ) => {
            return (
              // Use the actual database ID for the React key if available, fallback to index
              <TableRow key={id || index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">{question}</span>
                    <span className="font-semibold text-green-600 dark:text-green-500">
                      {answer}
                    </span>
                  </div>
                </TableCell>
                
                {isOpenEnded ? (
                  <TableCell className="font-semibold">
                    {userAnswer}
                  </TableCell>
                ) : (
                  <TableCell
                    className={`font-semibold ${
                      isCorrect ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}
                  >
                    {userAnswer}
                  </TableCell>
                )}

                {/* CRITICAL FIX: explicit undefined/null check to prevent rendering a stray "0" */}
                {isOpenEnded && (
                  <TableCell className="text-right">
                    {percentageCorrect !== null && percentageCorrect !== undefined 
                      ? `${percentageCorrect}%` 
                      : "0%"}
                  </TableCell>
                )}
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;