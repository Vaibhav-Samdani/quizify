import OpenAI from "openai";
import { z, ZodType } from "zod"; // Swap ZodSchema for ZodType
import { zodResponseFormat } from "openai/helpers/zod";

// Initialize the standard OpenAI SDK, but route it through OpenRouter
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000", // Required by OpenRouter
    "X-Title": "Quizmify", // Optional: Shows in your OpenRouter dashboard
  },
});


export async function strict_output<T>(
  system_prompt: string,
  user_prompt: string | string[],
  schema: ZodType<T>, // Use ZodType here
  model: string = "meta-llama/llama-4-maverick:free",
  temperature: number = 0.7
): Promise<T> {
  const promptText = Array.isArray(user_prompt) ? user_prompt.join("\n") : user_prompt;

  try {
    const response = await openrouter.chat.completions.parse({
      model,
      temperature,
      messages: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      // We enforce the Zod schema exactly like we would with OpenAI
      response_format: zodResponseFormat(schema, "quiz_payload"),
    });

    const parsed = response.choices[0].message.parsed;

    if (!parsed) {
      throw new Error("Failed to receive structured output from OpenRouter.");
    }

    return parsed;
  } catch (error) {
    console.error("OpenRouter Structured Output Error:", error);
    throw error;
  }
}