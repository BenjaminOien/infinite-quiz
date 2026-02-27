// Topics that have curated seed questions
export const SEED_TOPICS = [
  "norske konger",
  "skifakta",
  "var vikingene her òg?",
  "fysikk",
  "samfunnsøkonomi",
  "biologi",
  "hjernen og sånn",
  "matematikk",
  "evolusjon",
  "kjemi",
  "filosofi",
  "språkvitenskap",
]

export const TOPICS = [
  "norske konger",
  "skifakta",
  "var vikingene her òg?",
  "fysikk",
  "samfunnsøkonomi",
  "biologi",
  "historie",
  "språkvitenskap",
  "hjernen og sånn",
  "matematikk",
  "evolusjon",
  "kjemi",
  "filosofi",
  "astronomi",
  "økologi",
  "informatikk",
  "medisin",
  "arkeologi",
  "statistikk",
  "logikk",
  "termodynamikk",
  "genetikk",
  "statsvitenskap",
  "jus",
  "musikkteori",
  "antropologi",
  "materialvitenskap",
  "kryptografi",
  "oseanografi",
  "klimavitenskap",
]

export function getRandomTopic(): string {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)]
}
