"use client";

import React, { useState, useEffect, useMemo } from "react";
import keyword_extractor from "keyword-extractor";
import { cn } from "@/lib/utils";

type Props = {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const BLANK = "_____";

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
  // 1. Extract keywords and split the answer into parts
  const { answerWithBlanks, parts } = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    
    // Shuffle and pick 2 keywords
    const shuffled = words.sort(() => 0.5 - Math.random());
    const selectedKeywords = shuffled.slice(0, 2);

    // Replace the chosen keywords with our BLANK token
    const blanked = selectedKeywords.reduce((acc, curr) => {
      // Using a regex with word boundaries (\b) prevents replacing partial words.
      // E.g., preventing "art" from being replaced inside the word "earth".
      const regex = new RegExp(`\\b${curr}\\b`, "gi");
      return acc.replace(regex, BLANK);
    }, answer);

    return {
      answerWithBlanks: blanked,
      parts: blanked.split(BLANK),
    };
  }, [answer]);

  // 2. Local state to track what the user types into each input box
  const [inputValues, setInputValues] = useState<string[]>([]);

  // Reset the input boxes whenever the question (answer prop) changes
  useEffect(() => {
    setInputValues(Array(parts.length - 1).fill(""));
  }, [parts]);

  // 3. Reconstruct the full string whenever the user types, and send it to the parent
  useEffect(() => {
    const filledAnswer = parts.reduce((acc, part, index) => {
      const inputValue = inputValues[index] || "";
      // The final text part doesn't have a trailing input box
      const isLastPart = index === parts.length - 1;
      return acc + part + (isLastPart ? "" : inputValue);
    }, "");
    
    setBlankAnswer(filledAnswer);
  }, [inputValues, parts, setBlankAnswer]);

  const handleInputChange = (index: number, value: string) => {
    setInputValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <div className="mt-4 flex w-full justify-start">
      {/* Added leading-loose so that if the sentence wraps to two lines, 
          the input borders don't overlap with the text below them */}
      <h1 className="text-xl font-semibold leading-loose text-zinc-800 dark:text-zinc-200">
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          return (
            <React.Fragment key={index}>
              {part}
              {!isLast && (
                <input
                  type="text"
                  value={inputValues[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={cn(
                    "mx-2 w-28 border-b-2 border-zinc-800 bg-transparent text-center transition-all focus:border-primary focus:outline-none dark:border-zinc-200",
                    // Highlight the border slightly if the user has typed something
                    inputValues[index] ? "border-b-4 border-primary" : "focus:border-b-4"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </h1>
    </div>
  );
};

export default BlankAnswerInput;