import Anthropic from "@anthropic-ai/sdk"
import { Question } from "@/types"
import { nanoid } from "nanoid"

const client = new Anthropic()

const SYSTEM_PROMPT = `Du er spørsmålsskriver for et norsk påskequiz. Skriv morsomme og engasjerende spørsmål i typisk norsk påskequiz-stil — der svaret er ett ord, en kort term eller et tall, og folk sier "jaja, selvfølgelig!" når de hører det.

TRE ufravikelige prinsipper:
1. RIKTIGHET — svaret må være faktisk korrekt og etterprøvbart.
2. INTERESSANT — svaret skal overraske, være motintuitivt, eller noe folk halvt vet men ikke klarer å navngi. Ikke "hva er 2+2"-nivå.
3. UTLEDBART — spørsmålet skal beskrive tingen godt nok til at folk kan resonnere eller gjette seg frem. De trenger ikke ha pugget termen — beskrivelsen skal nesten gi det bort.

Spørsmålsstil — bruk formater som:
- "Hva kalles...?"
- "Hva er ordet for...?"
- "Hva heter...?"
- "Hvor mange...?"
- "Hva er betegnelsen på...?"

Regler:
- Spørsmål: ≤ 20 ord, folkelig og morsomt — ikke akademisk
- Svar: start med NØKKELSVARET i fet skrift (f.eks. "**Apoptose**"), deretter én kort morsom setning med kontekst (≤ 25 ord)
- Spør aldri "hvorfor skjer X" — spør alltid etter et navn, begrep eller tall
- Ingen "hvem oppfant" eller "hvilket år"-spørsmål
- ALL TEKST PÅ NORSK — både spørsmål og svar
- Returner KUN en gyldig JSON-array, ingen markdown, ingen forklaring: [{"question": "...", "answer": "..."}, ...]`

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
