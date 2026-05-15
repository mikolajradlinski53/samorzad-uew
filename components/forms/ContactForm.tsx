'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

async function submitForm(formType: string, fields: Record<string, string>): Promise<'success' | 'error'> {
  try {
    const res = await fetch('/api/formularz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, ...fields }),
    })
    return res.ok ? 'success' : 'error'
  } catch {
    return 'error'
  }
}

const inputClass = 'w-full px-4 py-3 rounded-lg border border-ssuew-gray-200 text-base text-ssuew-black bg-white focus:outline-none focus:ring-2 focus:ring-primary'
const inputErrorClass = 'w-full px-4 py-3 rounded-lg border border-red-500 text-base text-ssuew-black bg-white focus:outline-none focus:ring-2 focus:ring-primary'
const labelClass = 'text-[0.85rem] font-bold text-ssuew-black'
const btnClass = 'inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-3.5 text-base bg-primary text-white hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'

function SuccessMessage() {
  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
      <p className="text-base font-bold text-green-800">Wiadomość wysłana!</p>
      <p className="text-[0.85rem] text-green-700 mt-1">Odpiszemy wkrótce.</p>
    </div>
  )
}

function ErrorMessage() {
  return (
    <p className="text-[0.85rem] text-red-600 mt-2">
      Wystąpił błąd. Spróbuj ponownie lub napisz na{' '}
      <a href="mailto:kontakt@samorzad.ue.wroc.pl" className="underline">kontakt@samorzad.ue.wroc.pl</a>
    </p>
  )
}

export function KontaktForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fields = {
      imie: fd.get('imie') as string,
      email: fd.get('email') as string,
      temat: fd.get('temat') as string,
      wiadomosc: fd.get('wiadomosc') as string,
    }
    const errs: Record<string, boolean> = {}
    if (!fields.imie.trim()) errs.imie = true
    if (!fields.email.match(/.+@.+\..+/)) errs.email = true
    if (!fields.temat.trim()) errs.temat = true
    if (!fields.wiadomosc.trim()) errs.wiadomosc = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    const result = await submitForm('kontakt', fields)
    setStatus(result)
  }

  if (status === 'success') return <SuccessMessage />
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {[
        { name: 'imie', label: 'Imię i nazwisko', type: 'text', placeholder: 'Jan Kowalski' },
        { name: 'email', label: 'Adres e-mail', type: 'email', placeholder: 'jan@student.ue.wroc.pl' },
        { name: 'temat', label: 'Temat', type: 'text', placeholder: 'W jakiej sprawie?' },
      ].map(f => (
        <div key={f.name} className="flex flex-col gap-2">
          <label className={labelClass}>{f.label}</label>
          <input name={f.name} type={f.type} placeholder={f.placeholder} className={errors[f.name] ? inputErrorClass : inputClass} />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Wiadomość</label>
        <textarea name="wiadomosc" rows={5} placeholder="Twoja wiadomość..." className={errors.wiadomosc ? inputErrorClass : inputClass} />
      </div>
      {status === 'error' && <ErrorMessage />}
      <button type="submit" disabled={status === 'loading'} className={btnClass}>
        {status === 'loading' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
      </button>
    </form>
  )
}

export function WspolpraceForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fields = {
      firma: fd.get('firma') as string,
      kontaktOsoba: fd.get('kontaktOsoba') as string,
      kontaktEmail: fd.get('kontaktEmail') as string,
      telefon: fd.get('telefon') as string,
      rodzaj: fd.get('rodzaj') as string,
      dodatkowe: fd.get('dodatkowe') as string,
    }
    const errs: Record<string, boolean> = {}
    if (!fields.firma.trim()) errs.firma = true
    if (!fields.kontaktOsoba.trim()) errs.kontaktOsoba = true
    if (!fields.kontaktEmail.match(/.+@.+\..+/)) errs.kontaktEmail = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    const result = await submitForm('wspolpraca', fields)
    setStatus(result)
  }

  if (status === 'success') return <SuccessMessage />
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {[
        { name: 'firma', label: 'Nazwa firmy', type: 'text', placeholder: 'Firma Sp. z o.o.' },
        { name: 'kontaktOsoba', label: 'Imię i nazwisko osoby kontaktowej', type: 'text', placeholder: 'Jan Kowalski' },
        { name: 'kontaktEmail', label: 'E-mail osoby kontaktowej', type: 'email', placeholder: 'kontakt@firma.pl' },
        { name: 'telefon', label: 'Telefon (opcjonalnie)', type: 'tel', placeholder: '+48 000 000 000' },
      ].map(f => (
        <div key={f.name} className="flex flex-col gap-2">
          <label className={labelClass}>{f.label}</label>
          <input name={f.name} type={f.type} placeholder={f.placeholder} className={errors[f.name] ? inputErrorClass : inputClass} />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Rodzaj współpracy</label>
        <select name="rodzaj" className={inputClass}>
          <option value="">-- Wybierz --</option>
          <option>Sponsoring wydarzeń</option>
          <option>Warsztaty/szkolenia</option>
          <option>Rekrutacja</option>
          <option>Inne</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Dodatkowe informacje</label>
        <textarea name="dodatkowe" rows={4} placeholder="Opisz zakres współpracy..." className={inputClass} />
      </div>
      {status === 'error' && <ErrorMessage />}
      <button type="submit" disabled={status === 'loading'} className={btnClass}>
        {status === 'loading' ? 'Wysyłanie...' : 'Wyślij'}
      </button>
    </form>
  )
}

export function RzecznikForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fields = {
      kategoria: fd.get('kategoria') as string,
      opis: fd.get('opis') as string,
      email: fd.get('email') as string,
    }
    const errs: Record<string, boolean> = {}
    if (!fields.opis.trim()) errs.opis = true
    if (!fields.email.match(/.+@.+\..+/)) errs.email = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    const result = await submitForm('rzecznik', fields)
    setStatus(result)
  }

  if (status === 'success') return <SuccessMessage />
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Wybierz problem</label>
        <select name="kategoria" className={inputClass}>
          <option value="">-- Wybierz kategorię --</option>
          <option value="regulamin">Regulamin studiów</option>
          <option value="dziekanat">Dziekanat</option>
          <option value="prawa">Prawa studenta</option>
          <option value="inne">Inne</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Opis problemu</label>
        <textarea name="opis" rows={5} placeholder="Opisz swoją sytuację..." className={errors.opis ? inputErrorClass : inputClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Twój adres email</label>
        <input name="email" type="email" placeholder="student@student.ue.wroc.pl" className={errors.email ? inputErrorClass : inputClass} />
      </div>
      {status === 'error' && <ErrorMessage />}
      <button type="submit" disabled={status === 'loading'} className={btnClass}>
        {status === 'loading' ? 'Wysyłanie...' : 'Prześlij'}
      </button>
    </form>
  )
}
