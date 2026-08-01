"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleHelp, Globe } from "lucide-react"; 
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {Github} from "@/components/ui/Github";

// Inline SVG for GitHub (matches Lucide's style)


const techStack = [
  { name: "Next.js", logo: "/nextjs.png" },
  { name: "Tailwind CSS", logo: "/tailwind.png" },
  { name: "NextAuth", logo: "/nextauth.png" },
  { name: "OpenRouter", logo: "/openrouter.png" },
  { name: "React Query", logo: "/react-query.png" },
  { name: "Prisma", logo: "/prisma.png" },
  { name: "TypeScript", logo: "/typescript.png" },
];

const DetailsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
          What is this?
          <CircleHelp className="h-4 w-4 text-muted-foreground" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[90vw] rounded-xl sm:max-w-[70vw] md:max-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Welcome to Quizzzy!
          </DialogTitle>
          <DialogDescription className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Are you tired of mundane and repetitive quizzes? Say goodbye to
            the ordinary and embrace the extraordinary with Quizzzy! Our
            platform revolutionizes the quiz and trivia experience by
            harnessing the immense potential of artificial intelligence.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 h-[1px] w-full bg-border" />

        <div className="mt-2">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Built with
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-2 shadow-sm transition-all hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="relative h-6 w-6">
                  <Image
                    alt={tech.name}
                    src={tech.logo}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium tracking-tight text-zinc-700 dark:text-zinc-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-end">
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "w-full gap-2 sm:w-auto")}
            href="https://github.com/Vaibhav-Samdani/quizify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "default" }), "w-full gap-2 sm:w-auto")}
            href="https://vaibhavsamdani.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="h-4 w-4" />
            Portfolio
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;