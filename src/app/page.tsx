import { auth } from "@/auth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  Zap,
  Globe,
  Check,
  X,
  HelpCircle,
  Star
} from "lucide-react";
import { Github } from "@/components/ui/Github";
import SignInButton from "@/components/SignInButton";
import UserAccountNav from "@/components/UserAccountNav";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">

      {/* HEADER / NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-6 sm:px-12 lg:px-24 backdrop-blur-xl bg-background/80 border-b border-border/40 transition-all">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform hover:scale-105">
            <BrainCircuit className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Quizzzy<span className="text-primary">.ai</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden sm:flex gap-2 shadow-sm border-border/60 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <UserAccountNav user={session.user} />
            </div>
          ) : (
            <SignInButton text="Sign In" />
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden px-4 pt-40 pb-24 text-center sm:px-8">

        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-purple-500/15 to-blue-500/10 blur-[160px] pointer-events-none" />

        <div className="mx-auto max-w-4xl space-y-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8 motion-safe:duration-700">

          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-1 text-amber-400" aria-label="5 out of 5 stars rating">
              <Star className="h-3.5 w-3.5 fill-amber-400" aria-hidden="true" />
            </div>
            <span className="text-foreground font-medium">Introducing Instant AI Quiz Generation</span>
            <span className="text-border" aria-hidden="true">|</span>
            <span className="text-primary flex items-center gap-1">Explore Now <Sparkles className="h-3 w-3" aria-hidden="true" /></span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-[1.08]">
            Master Any Subject With{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl font-normal leading-relaxed">
            Turn any topic, textbook, or concept into an interactive quiz in seconds. 
            Test your knowledge, track your accuracy, and learn faster with every round.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            {session?.user ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full gap-2 text-base font-semibold sm:w-auto shadow-xl shadow-primary/25 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                Go to Dashboard <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <div className="w-full sm:w-auto">
                <SignInButton text="Get Started Free" />
              </div>
            )}

            <Link
              href="https://github.com/Vaibhav-Samdani/quizzzy-ai"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full gap-2 text-base sm:w-auto shadow-sm border-border/80 hover:bg-muted/50 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <Github className="h-5 w-5" aria-hidden="true" /> Star on GitHub
            </Link>
          </div>

          {/* Checklist */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /> Free forever
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /> No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /> Sub-second generation
            </div>
          </div>

        </div>

        {/* Hero Live Quiz Preview Card */}
        <div 
          className="mt-20 w-full max-w-3xl rounded-3xl border border-border/80 bg-card/90 p-6 shadow-2xl backdrop-blur-xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-1000 motion-safe:delay-200 text-left"
          aria-label="Example quiz preview"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Generated from: <span className="text-foreground font-semibold">&#34;Photosynthesis&#34;</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/40">
              Question 1 of 10
            </span>
          </div>

          <div className="pt-6 space-y-5">
            <p className="text-lg font-bold tracking-tight sm:text-xl">
              Plants convert sunlight into chemical energy stored as which molecule?
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border-2 border-emerald-500/60 bg-emerald-500/10 px-4 py-3">
                <span className="font-medium text-sm">A. Glucose</span>
                <Check className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3">
                <span className="font-medium text-sm text-muted-foreground">B. ATP</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3">
                <span className="font-medium text-sm text-muted-foreground">C. Oxygen</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/5 px-4 py-3">
                <span className="font-medium text-sm text-muted-foreground">D. Water</span>
                <X className="h-4 w-4 text-rose-500/70 shrink-0" aria-hidden="true" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-muted-foreground border-t border-border/60 mt-2 pt-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-500">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" /> 91.4% accuracy this week
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" /> 6-day streak
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-purple-500" aria-hidden="true" /> 42 quizzes generated
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* BENTO GRID FEATURES SECTION */}
      <section className="py-28 px-6 sm:px-12 lg:px-24 border-t border-border/60 bg-card/20 relative">
        <div className="mx-auto max-w-6xl space-y-16">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Core Architecture</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Engineered for absolute mastery</h2>
            <p className="text-muted-foreground sm:text-lg">
              Everything you need to digest large amounts of information efficiently through active recall.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">

            {/* Card 1: Infinite Topics */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 md:col-span-2">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 transition-transform group-hover:scale-110">
                <BrainCircuit className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Infinite Topic Generation</h3>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Whether it's niche biochemistry, advanced macroeconomics, or ancient philosophy —
                context-aware generation builds accurate, high-rigor quizzes on command.
              </p>
            </div>

            {/* Card 2: Dual Game Modes */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-500/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-6 transition-transform group-hover:scale-110">
                <Zap className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Dual Game Modes</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Choose 4-option multiple-choice for fast rounds, or fill-in-the-blank
                to test real recall, not just recognition.
              </p>
            </div>

            {/* Card 3: Hot Topics Cloud */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-500/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-6 transition-transform group-hover:scale-110">
                <Flame className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Hot Topics Cloud</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                See what the whole platform is studying right now, in a live,
                community-driven word cloud.
              </p>
            </div>

            {/* Card 4: Deep Statistics */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-500/40 md:col-span-2">
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 transition-transform group-hover:scale-110">
                <BarChart3 className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Comprehensive Analytics</h3>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Review question-by-question breakdowns, time spent per session,
                accuracy over time, and progress graphs, so you know exactly what to study next.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-t border-border/60">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Simple Workflow</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Up and running in 3 simple steps</h2>
            <p className="text-muted-foreground text-sm sm:text-base">No complex setup. Just type and learn.</p>
          </div>

          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <li className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4 transition-all hover:border-primary/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg" aria-hidden="true">01</div>
              <h3 className="text-lg font-bold">Type any topic</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter a subject, textbook title, historical era, or programming framework you want to explore.
              </p>
            </li>

            <li className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4 transition-all hover:border-blue-500/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-bold text-lg" aria-hidden="true">02</div>
              <h3 className="text-lg font-bold">Generate your quiz</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get context-aware multiple-choice or fill-in-the-blank questions in seconds.
              </p>
            </li>

            <li className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4 transition-all hover:border-emerald-500/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-lg" aria-hidden="true">03</div>
              <h3 className="text-lg font-bold">Review and improve</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See a full answer breakdown, check your accuracy, and track progress over time.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-t border-border/60 bg-card/20">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Got Questions?</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Everything you need to know about Quizzzy.ai.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" aria-hidden="true" /> Is Quizzzy completely free?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes! Quizzzy is free forever with no credit card required to start generating and playing your custom AI quizzes.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" aria-hidden="true" /> What kinds of questions are generated?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You can choose between multiple-choice questions (MCQs) with four options or open-ended fill-in-the-blank questions for rigorous recall.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" aria-hidden="true" /> Can I track my past quiz attempts?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely. Your dashboard automatically archives all quiz history, accuracy metrics, and time spent learning over time.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" aria-hidden="true" /> How does the AI generate quizzes?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It uses advanced context-aware AI models to instantly synthesize curriculum-accurate questions based on any topic or prompt you provide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 border-t border-border/60 bg-gradient-to-b from-transparent to-primary/5">
        <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-card/80 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-70 pointer-events-none" aria-hidden="true" />
          
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to transform your study routine?</h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-sm sm:text-base">
            Join learners generating high-rigor quizzes on-demand. Completely free, no credit card required.
          </p>

          <div className="pt-2 flex justify-center">
            {session?.user ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 text-base font-semibold shadow-lg shadow-primary/25 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                Launch Dashboard <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <SignInButton text="Get Started Free Now" />
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border/60 bg-card/40 py-14 px-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5 font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            </div>
            Quizzzy.ai
          </div>
          <p>© {new Date().getFullYear()} Vaibhav Samdani. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="https://vaibhavsamdani.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <Globe className="h-4 w-4" aria-hidden="true" /> Portfolio
            </Link>
            <Link
              href="https://github.com/Vaibhav-Samdani/quizzzy-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}