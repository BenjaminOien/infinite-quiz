"use client"

import { useState } from "react"
import { Question } from "@/types"

function renderAnswer(text: string) {
  // Split on **...** and render bold spans
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-bold text-white text-xl">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

interface FlashcardProps {
  question: Question
  onNext: () => void
  index: number
  total: number
}

export default function Flashcard({ question, onNext, index, total }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false)

  function handleReveal() {
    if (!revealed) setRevealed(true)
  }

  function handleNext() {
    setRevealed(false)
    onNext()
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto px-4">
      <div className="text-sm text-zinc-400 text-center tracking-widest uppercase">
        {index + 1} / {total}+
      </div>

      {/* Card */}
      <div
        onClick={handleReveal}
        className={`
          relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 min-h-[280px]
          flex flex-col justify-between gap-6 cursor-pointer select-none
          transition-all duration-200 active:scale-[0.98]
          ${!revealed ? "hover:border-zinc-600" : "cursor-default"}
        `}
      >
        {/* Question */}
        <p className="text-lg font-medium text-white leading-snug">{question.question}</p>

        {/* Divider */}
        {revealed && <div className="border-t border-zinc-700" />}

        {/* Answer */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${revealed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <p className="text-zinc-300 leading-relaxed">{renderAnswer(question.answer)}</p>
        </div>

        {/* Tap hint */}
        {!revealed && (
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mt-auto pt-2">
            <span className="text-xs">TRYKK FOR Å SE SVARET</span>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        className={`
          w-full py-4 rounded-2xl font-semibold text-base tracking-wide
          transition-all duration-200
          ${
            revealed
              ? "bg-white text-zinc-900 hover:bg-zinc-100 active:scale-[0.98]"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }
        `}
        disabled={!revealed}
      >
        Neste →
      </button>
    </div>
  )
}
