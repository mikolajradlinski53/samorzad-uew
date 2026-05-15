import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const ROUTING: Record<string, string> = {
  kontakt:    'kontakt@samorzad.ue.wroc.pl',
  wspolpraca: 'karol.vogel@samorzad.ue.wroc.pl',
  rzecznik:   'rps@samorzad.ue.wroc.pl',
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = await req.json()
  const { formType, ...fields } = body

  if (!formType || !ROUTING[formType]) {
    return NextResponse.json({ error: 'Unknown form type' }, { status: 400 })
  }

  const to = ROUTING[formType]
  const html = Object.entries(fields)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${String(v)}</p>`)
    .join('')

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@samorzad.ue.wroc.pl',
    to,
    subject: `Nowa wiadomość — ${formType} (SSUEW)`,
    html,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data?.id }, { status: 200 })
}
