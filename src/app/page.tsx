import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  // Auth.js v5 universal server-side session check
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight">
            Welcome to Quizzzy 🔥!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Quizzzy is an AI-powered platform for generating dynamic quizzes. Get started by logging in below!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SignInButton text="Sign In with Google" />
        </CardContent>
      </Card>
    </main>
  );
}