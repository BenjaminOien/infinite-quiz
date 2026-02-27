"use client"

import { useEffect, useRef, useState, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Flashcard from "@/components/Flashcard"
import { Question } from "@/types"

const BATCH_SIZE = 5
const PREFETCH_THRESHOLD = 2

function QuizContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get("topic") ?? ""

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seenIds = useRef<string[]>([])
  const prefetching = useRef(false)

  const fetchQuestions = useCallback(
    async (count: number) => {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count, exclude: seenIds.current }),
      })
      if (!res.ok) throw new Error("Failed to fetch questions")
      const data: Question[] = await res.json()
      seenIds.current = [...seenIds.current, ...data.map((q) => q.id)]
      return data
    },
    [topic]
  )

  // Initial load
  useEffect(() => {
    if (!topic) return
    fetchQuestions(BATCH_SIZE)
      .then((data) => {
        setQuestions(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Couldn't load questions. Check your API key and try again.")
        setLoading(false)
      })
  }, [topic, fetchQuestions])

  // Prefetch when approaching end of queue
  useEffect(() => {
    const remaining = questions.length - currentIndex
    if (remaining <= PREFETCH_THRESHOLD && !prefetching.current && !loading) {
      prefetching.current = true
      fetchQuestions(BATCH_SIZE)
        .then((data) => {
          setQuestions((prev) => [...prev, ...data])
          prefetching.current = false
        })
        .catch(() => {
          prefetching.current = false
        })
    }
  }, [currentIndex, questions.length, loading, fetchQuestions])

  function handleNext() {
    setCurrentIndex((i) => i + 1)
  }

  if (!topic) {
    return (
      <div className="text-zinc-400 text-center px-4">
        No topic provided.{" "}
        <button onClick={() => router.push("/")} className="text-white underline">
          Go back
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
        <span className="text-sm">Generating questions on {topic}...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center px-4">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="text-zinc-400 underline text-sm"
        >
          Go back
        </button>
      </div>
    )
  }

  if (currentIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
        <span className="text-sm">Loading more questions...</span>
      </div>
    )
  }

  return (
    <Flashcard
      question={questions[currentIndex]}
      onNext={handleNext}
      index={currentIndex}
      total={questions.length}
    />
  )
}

export default function QuizPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-safe-area-inset-top pt-4 pb-2">
        <button
          onClick={() => router.push("/")}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm flex items-center gap-1"
        >
          ← back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-8">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-3 text-zinc-400">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
            </div>
          }
        >
          <QuizContent />
        </Suspense>
      </div>
    </main>
  )
}
