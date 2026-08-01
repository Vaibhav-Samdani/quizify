"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Dynamically import to prevent SSR issues with D3 window calculations
const D3WordCloud = dynamic(() => import("react-d3-cloud"), {
  ssr: false,
});

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const WordCloud = ({ formattedTopics }: Props) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="h-[550px] w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900/50" />
    );
  }

  // Use slightly softer colors than pure black/white for better aesthetics
  const getFillColor = () => (resolvedTheme === "dark" ? "#e4e4e7" : "#27272a");

  return (
    <div className="word-cloud-container w-full cursor-pointer transition-opacity duration-500 animate-in fade-in zoom-in-95">
      <style jsx>{`
        :global(.word-cloud-container text) {
          transition: fill 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            font-weight 0.25s ease;
          transform-origin: center;
          user-select: none;
        }
        :global(.word-cloud-container text:hover) {
          font-weight: 600 !important;
        }
      `}</style>

      <D3WordCloud
        data={formattedTopics}
        height={550}
        font="Inter, system-ui, sans-serif"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={12}
        fill={getFillColor}
        onWordClick={(_event, d) => {
          // Properly encode the URL so special characters (like C# or C++) don't break the route
          router.push(`/quiz?topic=${encodeURIComponent(d.text)}`);
        }}
      />
    </div>
  );
};

export default WordCloud;