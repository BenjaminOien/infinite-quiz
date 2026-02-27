import TopicSelector from "@/components/TopicSelector"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-10 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">infinite quiz</h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
          Questions worth knowing.
          <br />
          Answers you can reason to.
        </p>
      </div>

      <TopicSelector />
    </main>
  )
}
