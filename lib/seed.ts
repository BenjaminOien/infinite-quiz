import seedData from "@/data/seed-questions.json"
import { Question } from "@/types"
import { nanoid } from "nanoid"

const seed: Question[] = (seedData as { topic: string; question: string; answer: string }[]).map(
  (q) => ({ ...q, id: nanoid() })
)

function topicMatches(seedTopic: string, requestedTopic: string): boolean {
  const a = seedTopic.toLowerCase()
  const b = requestedTopic.toLowerCase()
  return a === b || a.includes(b) || b.includes(a)
}

export function getSeedQuestions(topic: string, exclude: string[]): Question[] {
  return seed
    .filter((q) => topicMatches(q.topic, topic) && !exclude.includes(q.id))
    .map((q) => ({ ...q, id: nanoid() })) // fresh IDs so dedup works per session
}
