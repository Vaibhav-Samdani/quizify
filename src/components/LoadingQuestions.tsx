"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import Image from "next/image";

type Props = { 
  finished: boolean;
};

// Expanded, high-quality, zero-latency loading taglines
const loadingTexts = [
  "Generating brain-teasers...",
  "Unleashing the power of curiosity...",
  "Mining the internet for trivia...",
  "Calibrating the difficulty matrix...",
  "Sharpening the virtual pencils...",
  "Dusting off the encyclopedias...",
  "Connecting the neural pathways...",
  "Summoning the trivia gods...",
  "Teaching the machine to quiz...",
  "Reticulating splines...", // Classic SimCity reference
  "Consulting the oracle of knowledge...",
  "Brewing some serious questions...",
  "Loading the answers (don't peek)...",
  "Checking facts and crossing T's...",
  "Igniting the flame of exploration...",
];

const LoadingQuestions = ({ finished }: Props) => {
  const [progress, setProgress] = useState(10);
  const [textIndex, setTextIndex] = useState(0);

  // Text Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Use sequential rotation instead of Math.random() 
      // This prevents the same text from randomly appearing twice in a row
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500); 
    
    return () => clearInterval(interval);
  }, []);

  // Fake Progress Bar Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        
        // Zeno's Paradox approach: the closer we get to 100, the slower it goes.
        // It will never actually hit 100 until `finished` is true.
        const remaining = 100 - prev;
        const increment = (Math.random() * remaining) / 10;
        
        // Cap the maximum fake loading at 99%
        return Math.min(prev + increment, 99);
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="absolute left-1/2 top-1/2 flex w-[80vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      
      {/* 
        Ensure you have a modern loading GIF or SVG here. 
        Next.js Image requires width/height or fill. 
      */}
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        <Image 
          src="/loading.gif" 
          fill
          className="object-contain"
          alt="Loading animation" 
          priority
        />
      </div>
      
      <Progress value={progress} className="mt-4 w-full h-3" />
      
      {/* 
        Wrapping the text in a container with a fixed height prevents 
        the layout from jumping if one tagline drops to two lines 
      */}
      <div className="mt-6 flex h-12 items-start justify-center">
        <h1 className="text-center text-lg font-medium text-muted-foreground animate-pulse transition-opacity">
          {loadingTexts[textIndex]}
        </h1>
      </div>
      
    </div>
  );
};

export default LoadingQuestions;