import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
    "X-Title": "Quizify",
  },
});

export async function strict_output(
  systemPrompt: string,
  userPrompt: string | string[],
  outputFormat: Record<string, string>,
  model = "openrouter/free",
  temperature = 0.7
) {
  const prompt = Array.isArray(userPrompt)
    ? userPrompt.join("\n")
    : userPrompt;

  const response = await openrouter.chat.completions.create({
    model,
    temperature,
    messages: [
      {
        role: "system",
        content: `${systemPrompt}

You MUST respond with ONLY valid JSON.

The JSON should be an array of objects.

Each object must have the following fields:

${JSON.stringify(outputFormat, null, 2)}

Rules:
- Return ONLY JSON.
- Do NOT wrap it in \`\`\`json.
- Do NOT include explanations.
- Do NOT include any extra text.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("No response received from model.");
  }

  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  }
}