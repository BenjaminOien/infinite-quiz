"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SEED_TOPICS, getRandomTopic } from "@/lib/topics"

export default function TopicSelector() {
  const [topic, setTopic] = useState("")
  const router = useRouter()

  function startQuiz(t: string) {
    const trimmed = t.trim()
    if (!trimmed) return
    router.push(`/quiz?topic=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm mx-auto px-4">
      {/* Free-text input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && startQuiz(topic)}
          placeholder="Any topic..."
          className="flex-1 min-w-0 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-white
            placeholder:text-zinc-500 text-base focus:outline-none focus:border-zinc-400
            transition-colors"
          autoFocus
        />
        <button
          onClick={() => startQuiz(topic)}
          disabled={!topic.trim()}
          className="px-5 py-4 rounded-2xl bg-white text-zinc-900 font-semibold text-base
            disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
            hover:bg-zinc-100 transition-all active:scale-[0.98] shrink-0"
        >
          Go
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 text-zinc-600 text-xs">
        <div className="flex-1 border-t border-zinc-800" />
        <span>or pick a category</span>
        <div className="flex-1 border-t border-zinc-800" />
      </div>

      {/* Seed topic chips */}
      <div className="flex flex-wrap gap-2">
        {SEED_TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => startQuiz(t)}
            className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 text-sm
              hover:border-zinc-400 hover:text-white hover:bg-zinc-800
              active:scale-[0.96] transition-all capitalize"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Random topic — any of the 30 topics, including non-seed */}
      <button
        onClick={() => startQuiz(getRandomTopic())}
        className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors text-center"
      >
        ↻ random topic
      </button>
    </div>
  )
}
