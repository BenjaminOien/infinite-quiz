"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getRandomTopic } from "@/lib/topics"

export default function TopicSelector() {
  const [topic, setTopic] = useState("")
  const router = useRouter()

  function handleStart() {
    const t = topic.trim()
    if (!t) return
    router.push(`/quiz?topic=${encodeURIComponent(t)}`)
  }

  function handleRandom() {
    const t = getRandomTopic()
    setTopic(t)
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto px-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleStart()}
        placeholder="Enter a topic..."
        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-white
          placeholder:text-zinc-500 text-base focus:outline-none focus:border-zinc-400
          transition-colors"
        autoFocus
      />

      <button
        onClick={handleRandom}
        className="w-full py-3 rounded-2xl border border-zinc-700 text-zinc-400 text-sm
          hover:border-zinc-500 hover:text-zinc-200 transition-all active:scale-[0.98]"
      >
        Random topic
      </button>

      <button
        onClick={handleStart}
        disabled={!topic.trim()}
        className="w-full py-4 rounded-2xl bg-white text-zinc-900 font-semibold text-base
          disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
          hover:bg-zinc-100 transition-all active:scale-[0.98]"
      >
        Start Quiz
      </button>
    </div>
  )
}
