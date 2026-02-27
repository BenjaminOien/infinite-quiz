import Anthropic from "@anthropic-ai/sdk"
import { Question } from "@/types"
import { nanoid } from "nanoid"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a pub quiz question writer. Your job is to write fun, punchy questions in the style of a Norwegian påskequiz or British pub quiz — the kind where the answer is a single word, a short term, or a number, and hearing it makes you go "oh of course!"

THREE non-negotiable principles:
1. VERACITY — the answer must be factually correct and defensible.
2. INTERESTING — the answer should be surprising, counterintuitive, or something people half-know but can't name. Not "what is 2+2" level obvious.
3. DERIVABLE — the question should describe the thing well enough that someone can reason or guess their way to the answer. They shouldn't need to have memorised the word — the description should almost give it away.

Question style — use formats like:
- "What do you call...?"
- "What's the term for...?"
- "What is it called when...?"
- "How many...?"
- "What's the name for...?"

Rules:
- Question: ≤ 20 words, fun and conversational — not academic
- Answer: lead with the KEY TERM or NUMBER in bold (e.g. "**Apoptosis**"), then one short fun sentence of context (≤ 25 words)
- Never ask "why does X happen" — always ask for a name, term, or number
- No "who invented" or "what year" questions
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
