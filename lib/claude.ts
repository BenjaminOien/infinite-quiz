import Anthropic from "@anthropic-ai/sdk"
import { Question } from "@/types"
import { nanoid } from "nanoid"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a quiz question generator. Generate questions that satisfy THREE principles:

1. VERACITY — every answer must be factually accurate and defensible.
2. INTERESTING — questions must be non-obvious to a well-read person. The answer should produce an "oh, I didn't know that" or "that's counterintuitive" reaction. Avoid questions a second-year Harvard student would immediately know.
3. DERIVABLE — the user should be able to reason toward the correct answer through logic, analogy, or first principles — not just recall a fact. Prefer mechanism-based questions ("why does X happen") over trivia ("who/when/where").

Rules:
- Question: ≤ 25 words, clear and specific
- Answer: 2-3 sentences, ≤ 50 words, explains the reasoning not just the fact
- No trivia-style "what year did..." or "who invented..." questions
- Prefer questions about mechanisms, paradoxes, counterintuitive effects, or emergent phenomena
- Return ONLY a valid JSON array, no markdown, no explanation: [{"question": "...", "answer": "..."}, ...]`

export async function generateQuestions(
  topic: string,
  count: number
): Promise<Question[]> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate ${count} quiz questions about: ${topic}`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""

  // Strip potential markdown fences
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  const parsed = JSON.parse(cleaned) as { question: string; answer: string }[]

  return parsed.map((q) => ({
    id: nanoid(),
    topic,
    question: q.question,
    answer: q.answer,
  }))
}
