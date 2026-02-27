// Topics that have curated seed questions
export const SEED_TOPICS = [
  "physics",
  "economics",
  "biology",
  "psychology",
  "mathematics",
  "evolution",
  "chemistry",
  "philosophy",
  "neuroscience",
  "linguistics",
  "game theory",
]

export const TOPICS = [
  "physics",
  "economics",
  "biology",
  "history",
  "linguistics",
  "psychology",
  "mathematics",
  "evolution",
  "chemistry",
  "philosophy",
  "neuroscience",
  "astronomy",
  "ecology",
  "computer science",
  "game theory",
  "medicine",
  "archaeology",
  "statistics",
  "logic",
  "thermodynamics",
  "genetics",
  "political science",
  "law",
  "music theory",
  "anthropology",
  "cognitive science",
  "materials science",
  "cryptography",
  "oceanography",
  "climate science",
]

export function getRandomTopic(): string {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)]
}
