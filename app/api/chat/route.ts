import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const SSUEW_SYSTEM_PROMPT = `Jesteś asystentem Samorządu Studentów Uniwersytetu Ekonomicznego we Wrocławiu (SSUEW).
Odpowiadasz zwięźle na pytania studentów o samorząd.

Kluczowe fakty:
- Siedziba: ul. Kamienna 43, Budynek J, pokój 9, Wrocław
- Email kontaktowy: kontakt@samorzad.ue.wroc.pl
- Przewodnicząca: Emilia Ćwiklińska
- Główne projekty: ADAPCIAK, BAL UEW, Dni Adaptacyjne, GRADUETION, TEDxUEW, UE PARTY
- Rzecznik Praw Studenta: Jakub Buchta (rps@samorzad.ue.wroc.pl)
- Strona: /dla-studenta (zasoby studenckie), /nasze-projekty, /zarzad
- Współprace: karol.vogel@samorzad.ue.wroc.pl

Odpowiadaj po polsku, krótko (max 3 zdania). Jeśli nie wiesz — poleć kontakt przez formularz na /formularz.`

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('AI service not configured', { status: 503 })
  }

  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: SSUEW_SYSTEM_PROMPT,
    messages,
    maxTokens: 300,
  })

  return result.toDataStreamResponse()
}
