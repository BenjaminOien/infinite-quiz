import { NextRequest, NextResponse } from "next/server"
import { getSeedQuestions } from "@/lib/seed"
import { generateQuestions } from "@/lib/claude"

export async function POST(req: NextRequest) {
  const { topic, count = 5, exclude = [] } = await req.json()

  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "topic is required" }, { status: 400 })
  }

  const seedQuestions = getSeedQuestions(topic, exclude)
  const shuffled = seedQuestions.sort(() => Math.random() - 0.5)
  const fromSeed = shuffled.slice(0, count)

  const remaining = count - fromSeed.length

  if (remaining <= 0) {
    return NextResponse.json(fromSeed)
  }

  try {
    const aiQuestions = await generateQuestions(topic, remaining)
    return NextResponse.json([...fromSeed, ...aiQuestions])
  } catch (err) {
    console.error("Claude generation failed:", err)
    // Return whatever seed questions we have rather than failing
    if (fromSeed.length > 0) {
      return NextResponse.json(fromSeed)
    }
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
