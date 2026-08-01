import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    topic?: string;
  }>;
}

// 1. DYNAMIC METADATA
// Automatically updates the browser tab and SEO tags based on the topic being searched.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const topic = params.topic ? decodeURIComponent(params.topic) : "";

  return {
    title: topic ? `Create Quiz: ${topic} | Quizzzy` : "Create Quiz | Quizzzy",
    description: topic 
      ? `Generate a custom AI-powered quiz on ${topic} instantly.` 
      : "Quiz yourself on anything using advanced AI architecture.",
  };
}

const Quiz = async ({ searchParams }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  // Safely decode URI components incase topics contain special characters or spaces
  const initialTopic = params.topic ? decodeURIComponent(params.topic) : "";

  return (
    <div className="animate-in fade-in duration-500">
      <QuizCreation topic={initialTopic} />
    </div>
  );
};

export default Quiz;