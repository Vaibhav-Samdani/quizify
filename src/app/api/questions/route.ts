import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { MCQItem } from "@/lib/types";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 240;

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    // Uncomment if you want to enforce authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("---->", session);

    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);

    let questions;

    if (type === "open_ended") {
      questions = await strict_output(
        `
Generate EXACTLY ${amount} difficult open-ended questions about "${topic}".

Rules:
- Return EXACTLY ${amount} questions.
- Every question must be unique.
- Every answer must be less than 15 words.
- Return ONLY valid JSON.
`,
        `Generate ${amount} unique open-ended questions about ${topic}.`,
        {
          question: "question",
          answer: "correct answer",
        }
      );
    } else {
      questions = await strict_output(
        `
Generate EXACTLY ${amount} difficult MCQs about "${topic}".

Rules:
- Return EXACTLY ${amount} questions.
- Every question must be unique.
- Each question must have:
  - question
  - answer
  - option1
  - option2
  - option3
- "answer" is the correct answer.
- option1, option2 and option3 must all be incorrect.
- All four options MUST be different.
- Never repeat any option.
- Every option must contain fewer than 15 words.
- Return ONLY valid JSON.
`,
        `Generate ${amount} MCQs on ${topic}.`,
        {
          question: "question",
          answer: "correct answer",
          option1: "wrong option",
          option2: "wrong option",
          option3: "wrong option",
        }
      );

      // Remove invalid MCQs
      questions = questions.filter((q: MCQItem) => {
        const options = [
          q.answer,
          q.option1,
          q.option2,
          q.option3,
        ];

        return new Set(options).size === 4;
      });
    }

    return NextResponse.json(
      {
        questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}