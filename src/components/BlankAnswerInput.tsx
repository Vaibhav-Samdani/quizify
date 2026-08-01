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
  // 1. Pure deterministic extraction of keywords (avoids Math.random during render)
  const { parts } = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });

    if (words.length === 0) {
      return { parts: [answer] };
    }

    // Hash-based deterministic shuffle to pick 2 keywords consistently per answer
    let hash = 0;
    for (let i = 0; i < answer.length; i++) {
      hash = (hash << 5) - hash + answer.charCodeAt(i);
      hash |= 0;
    }

    const selectedKeywords = [...words]
      .sort((a, b) => {
        const hashA = Math.abs((hash ^ a.length) * 31);
        const hashB = Math.abs((hash ^ b.length) * 31);
        return hashA - hashB;
      })
      .slice(0, 2);

    // Replace chosen keywords with BLANK token
    const blanked = selectedKeywords.reduce((acc, curr) => {
      const regex = new RegExp(`\\b${curr}\\b`, "gi");
      return acc.replace(regex, BLANK);
    }, answer);

    return {
      parts: blanked.split(BLANK),
    };
  }, [answer]);

  // 2. Adjust input state synchronously during render when `answer` changes (avoids setState in effect warning)
  const [prevAnswer, setPrevAnswer] = useState(answer);
  const [inputValues, setInputValues] = useState<string[]>(() =>
    Array(Math.max(0, parts.length - 1)).fill("")
  );

  if (prevAnswer !== answer) {
    setPrevAnswer(answer);
    setInputValues(Array(Math.max(0, parts.length - 1)).fill(""));
  }

  // 3. Reconstruct full string and communicate to parent
  useEffect(() => {
    const filledAnswer = parts.reduce((acc, part, index) => {
      const inputValue = inputValues[index] || "";
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
                    inputValues[index]
                      ? "border-b-4 border-primary"
                      : "focus:border-b-4"
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